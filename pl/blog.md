# 更靠谱的横竖屏检测方法

前不久，做了一个H5项目，需要在横竖屏变化时，做一些处理。毫无疑问，需要使用`orientationChange`来监听横竖屏的变化。
### 方案一：
```js
// 监听 orientation changes
window.addEventListener("orientationchange", function(event) {
	// 根据event.orientation|screen.orientation.angle等于0|180、90|-90度来判断横竖屏
}, false);
```
代码添加上后，就各种兼容性问题。这里兼容性问题出现在两个地方：
- `orientationchange`
- `event.orientation|screen.orientation.angle`

##### 如下是`orientationchange`事件的兼容性：
[![orientationchange.png](orientationchange.png)](http://www.quirksmode.org/dom/events/orientationchange.html)
##### 如下是`screen.orientation`的兼容性：
[![screen.orientation](screen.png)](https://developer.mozilla.org/zh-CN/docs/Web/API/Screen/orientation)
#### 方案二：
上述方案不行，只能另行他法了。google一下，了解到可以通过`resize`配合`(window.inner/outerWidth, window.inner/outerHeight)`来实现：
```js
window.addEventListener("resize", function(event) {
    var orientation=(window.innerWidth > window.innerHeight)? "landscape":"portrait";
    if(oritentation === 'portrait'){
    	// do something ……
    } else {
    	// do something else ……
    }
}, false);
```
这种方案基本满足大部分项目的需求，但是还是有些不足之处：
- 只要window的size变化，就会不断触发触发`resize`事件。可以使用setTimeout来优化一下
- 如果有多个地方需要监听横竖屏，就需要注册多个`window.addEventListener("resize", function(event) {……})`。能不能通过`订阅与发布模式`来改进一下，只注册一个`resize`负责监听横竖屏变化，只要横竖发生变化就发布通知订阅的对象。其他需要监听横竖屏的地方只需订阅一下即可。

关键代码如下：
```js
    var resizeCB = function(){
      if(win.innerWidth > win.innerHeight){//初始化判断
        meta.init = 'landscape';
        meta.current = 'landscape';
      } else {
        meta.init = 'portrait';
        meta.current = 'portrait';
      }
      return function(){
        if(win.innerWidth > win.innerHeight){
          if(meta.current !== 'landscape'){
            meta.current = 'landscape';
            event.trigger('__orientationChange__', meta);
          }
        } else {
          if(meta.current !== 'portrait'){
            meta.current = 'portrait';
            event.trigger('__orientationChange__', meta);
          }
        }
      }
    }();
```
[完整代码猛击这里](https://github.com/zhansingsong/pl/blob/master/other/pl_other.js)

### 方案三：
不过个人觉得通过`window.innerWidth > window.innerHeight`来实现的是一种伪检测，点不可靠。 可不可以通过浏览器来实现检测？如基于CSS3`@media`媒体查询来实现。
如下`@media`兼容性：
[![media](media.png)](http://caniuse.com/#feat=css-mediaqueries)
如上上图所示，移动端浏览器都支持CSS3 media。

##### 实现思路：
- 创建包含标识横竖屏状态的特定css样式
- 通过JS向页面中注入CSS代码
- resize回调函数中获取横竖屏的状态

这里我选择`<html></html>`的节点`font-family`作为检测样式属性。理由如下：
- 选择`<html></html>`主要为了避免reflow和repaint
- 选择`font-family`样式，主要是因为`font-family`有如下特性：
> - 优先使用排在前面的字体。
> - 如果找不到该种字体，或者该种字体不包括所要渲染的文字，则使用下一种字体。
> - 如果所列出的字体，都无法满足需要，则让操作系统自行决定使用哪种字体。

这样我们就可以指定特定标识来标识横竖屏的状态，不过需要将指定的标识放置在其他字体的前面，这样就不会引起hmtl字体的变化。
关键代码如下：
```js
    // callback
    var resizeCB = function() {
        var hstyle = win.getComputedStyle(html, null),
            ffstr = hstyle['font-family'],
            pstr = "portrait, " + ffstr,
            lstr = "landscape, " + ffstr,
            // 拼接css
            cssstr = '@media (orientation: portrait) { .orientation{font-family:' + pstr + ';} } @media (orientation: landscape) {  .orientation{font-family:' + lstr + ';}}';
        // 载入样式		
        loadStyleString(cssstr);
        // 添加类
        html.className = 'orientation' + html.className;
        if (hstyle['font-family'] === pstr) { //初始化判断
            meta.init = 'portrait';
            meta.current = 'portrait';
        } else {
            meta.init = 'landscape';
            meta.current = 'landscape';
        }
        return function() {
            if (hstyle['font-family'] === pstr) {
                if (meta.current !== 'portrait') {
                    meta.current = 'portrait';
                    event.trigger('__orientationChange__', meta);
                }
            } else {
                if (meta.current !== 'landscape') {
                    meta.current = 'landscape';
                    event.trigger('__orientationChange__', meta);
                }
            }
        }
    }();
```
[完整代码猛击这里](https://github.com/zhansingsong/pl/blob/master/src/pl.js)
#### 测试效果
#####　portrait效果：
![p](p.png)
#####　landscape效果：
![p](l.png)


推荐使用第三种方案，自己也在项目实践过了效果不错，并将其封装，放置在github上，地址：[https://github.com/zhansingsong/pl](https://github.com/zhansingsong/pl)

