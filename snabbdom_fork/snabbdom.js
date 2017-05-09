// jshint newcap: false
/* global require, module, document, Element */
'use strict';
// 封装vnode
var VNode = require('./vnode');
// 提供isArray,primitive方法，前者判断是否是数组，后者判断是否是字符串或number类型
var is = require('./is');
// 判断是否定义过
function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }
// 将Dom节点转为vnode
function emptyNodeAt(elm) {
  return VNode(elm.tagName, {}, [], undefined, elm);
}

// 生产一个空Vnode
var emptyNode = VNode('', {}, [], undefined, undefined);
// 通过key和sel来判断是否相同Vnode
function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
// 转换key集合的映射
function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, map = {}, key;
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}
// 如果给定childElm元素上的listeners等于0，就删除childElm
function createRmCb(childElm, listeners) {
  return function() {
    if (--listeners === 0) childElm.parentElement.removeChild(childElm);
  };
}
// 暴露给模块级的钩子函数，是进行扩展的核心
var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

// 模块化架构，通过hooks很容易扩展snabbdom功能，这样保障了“单一职责原则”，
// 不仅便于扩展，而且维护也方便。
function init(modules) {
  // 抽取模块中hooks缓存cbs中
  var i, j, cbs = {};
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
    }
  }
  // 创建元素 增加vnode.elm
  function createElm(vnode, insertedVnodeQueue) {
    var i, data = vnode.data;
    // 如果存在data
    if (isDef(data)) {
      // 如果存在hook,且hook上有init,执行init,并将vnode作为参数
      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode);
      // 如果存在data上存在vnode，更新vnode
      if (isDef(i = data.vnode)) vnode = i;
    }
    var elm, children = vnode.children, sel = vnode.sel;
    // 存在选择器如果“div#id.class”
    if (isDef(sel)) {
      // Parse selector
      var hashIdx = sel.indexOf('#');
      var dotIdx = sel.indexOf('.', hashIdx);
      // 处理“div#id”
      var hash = hashIdx > 0 ? hashIdx : sel.length;
      // 处理“div.class”
      var dot = dotIdx > 0 ? dotIdx : sel.length;
      // 获取tag：div 、div#id 、div.class
      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      // 创建元素crateElement，绑定到vnode.elm, 如果是data上存在ns(即SVG元素),会调用createElementNS方法来创建
      elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? document.createElementNS(i, tag)
                                                          : document.createElement(tag);
      // 获取id, elm.id, 这里为啥要hash<dot，因为存在"div"情况                                                       
      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
      // 获取className, elm.className, 会存在''情况
      if (dotIdx > 0) elm.className = sel.slice(dot+1).replace(/\./g, ' ');
      // 如果children存在，直接插入
      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          elm.appendChild(createElm(children[i], insertedVnodeQueue));
        }
        // 否则如果存在text,直接通过createTextNode创建插入
      } else if (is.primitive(vnode.text)) {
        elm.appendChild(document.createTextNode(vnode.text));
      }
      // 执行模块上的create钩子函数
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        // 执行节点上的create、insert钩子函数
        if (i.create) i.create(emptyNode, vnode);
        if (i.insert) insertedVnodeQueue.push(vnode);
      }
    } else {
      // 否则就是文本节点直接创建
      elm = vnode.elm = document.createTextNode(vnode.text);
    }
    // 返回vnode.elm
    return vnode.elm;
  }
  // 增加指定子节点vnodes添加到before前面
  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      parentElm.insertBefore(createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }
  // 调用destroy钩子函数
  function invokeDestroyHook(vnode) {
    var i = vnode.data, j;
    if (isDef(i)) {
      if (isDef(i = i.hook) && isDef(i = i.destroy)) i(vnode);
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }
  }
  // 删除节点同时调用remove|destory钩子
  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var i, listeners, rm, ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);
          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
            i(ch, rm);
          } else {
            rm();
          }
        } else { // Text node
          parentElm.removeChild(ch.elm);
        }
      }
    }
  }
  // 更新子节点
  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    // 缓存
    var oldStartIdx = 0, newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;
    // 对比更新，遍历循环
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // oldStartVnode不存在，移动到下一个节点
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      // oldEndVnode不存在，移动到下一个节点
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
        // 如果存在sel和key相同，执行如下操作，分5种情况进行对比：
        // 1: sameVnode(oldStartVnode, oldStartVnode)
      } else if (sameVnode(oldStartVnode, oldStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
        // 2: sameVnode(oldEndVnode, newEndVnode)
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
        // 3: sameVnode(oldStartVnode, newEndVnode)
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);//移动到正确的位置上
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
        // 3: sameVnode(oldEndVnode, newStartVnode)
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);//移动到正确的位置上
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        // 针对有key的情况 ----> ul > li*n
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = oldKeyToIdx[newStartVnode.key];
        // 如果不存在对应的idxInOld, 直接创建newStartVnode, 然后插入到oldStartVnode.elm之前
        if (isUndef(idxInOld)) { // New element
          parentElm.insertBefore(createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          // 存在对应的idxInOld, 直接对比更新
          elmToMove = oldCh[idxInOld];
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined;
          parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    // 如果oldStartIdx > oldEndIdx，会将剩余newCh添加到父元素中，进行补全
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx+1]) ? null : newCh[newEndIdx+1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      // 如果newStartIdx > newEndIdx，会将剩余oldCh从父元素中删除，如上面的ul>li*n情况
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
    var i, hook;
    // 执行prepatch
    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode);
    }
    // 如果data中存在vnode，那么直接替换？data缓存了vnode?
    if (isDef(i = oldVnode.data) && isDef(i = i.vnode)) oldVnode = i;
    if (isDef(i = vnode.data) && isDef(i = i.vnode)) vnode = i;

    var elm = vnode.elm = oldVnode.elm, oldCh = oldVnode.children, ch = vnode.children;
    // 相等直接返回
    if (oldVnode === vnode) return;
    // 执行update钩子函数
    if (isDef(vnode.data)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
      i = vnode.data.hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
    }
    // 如果不是文本子节点
    if (isUndef(vnode.text)) {
      // 如果子节点都存在且不相同，则执行updateChildren
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        // 如果oldCh不存在，ch存在则执行插入新节点
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        // 如果oldCh存在，ch不存在则执行删除操作
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      }
    } else if (oldVnode.text !== vnode.text) {
      // 如果是文本子节点，且不太相同直接更新元素的textContent
      elm.textContent = vnode.text;
    }
    // 执行postpatch钩子
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode);
    }
  }
  // patch function
  return function(oldVnode, vnode) {
    var i;
    // 用于在执行insert时，作为参数传入新插入vnode
    var insertedVnodeQueue = [];
    // 执行pre钩子
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
    // 如果比较节点是元素
    if (oldVnode instanceof Element) {
      // 如果存在父元素
      if (oldVnode.parentElement !== null) {
        // 创建Vnode元素: vnode.elm
        createElm(vnode, insertedVnodeQueue);
        // 用vnode.elm替换oldVnode
        oldVnode.parentElement.replaceChild(vnode.elm, oldVnode);
      } else {
        // 如果不存在父元素，将oldVnode元素转换为Vnode
        oldVnode = emptyNodeAt(oldVnode);
        // 执行对比操作
        patchVnode(oldVnode, vnode, insertedVnodeQueue);
      }
    } else {
      // 如果oldVnode不是元素，直接进行对比操作
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    }
    // 对比完执行insert钩子，并将缓存的Vnode作为参数传入insert
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    // 执行post钩子函数
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    // 返回新vnode
    return vnode;
  };
}
// 导出init
module.exports = {init: init};
