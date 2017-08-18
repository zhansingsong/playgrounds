# 关于z-index的一些事
一般**z-index**失效基本上都是不了解**z-index**是如何工作导致的（这没有看这篇[blog](https://philipwalton.com/articles/what-no-one-told-you-about-z-index/)之前，至少我也是这样的）。它不复杂，但如果不花时间去查看z-index文档，可能会不了解一些关键技术点。

不信？能否解答如下问题，作为检验你是否真正了解**z-index**：

## 问题：

HTML结构如下：

```HTML
<div>
  <span class="red">Red</span>
</div>
<div>
  <span class="green">Green</span>
</div>
<div>
  <span class="blue">Blue</span>
</div>
```
CSS如下：

```css
.red, .green, .blue {
  position: absolute;
}
.red {
  background: red;
  z-index: 1;
}
.green {
  background: green;
}
.blue {
  background: blue;
}
```

### 如何将“红色块”放置“绿色块”之后，需要满足如下条件：

- 不能修改html结构
- 不能修改任何元素的z-index属性
- 不能修改任何元素的position属性

### codepen：
<iframe height='320' scrolling='no' title='JyNRxj' src='//codepen.io/zhansingsong/embed/JyNRxj/?height=330&theme-id=dark&default-tab=css,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/zhansingsong/pen/JyNRxj/'>JyNRxj</a> by zhansingsong (<a href='https://codepen.io/zhansingsong'>@zhansingsong</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 解决方法

给第一个`div`（即“红色块”的父节点）添加如下样式：

```css
  div:first-child {
    opacity: .99;
  }
```

或许你会好奇为什么这个`opacity`会让“红色块”置于“绿色块”之后（当时我看这个答案也是一脸懵逼了😑）。希望下文能解惑你的好奇。

### z-index [specification](https://www.w3.org/TR/CSS2/visuren.html#propdef-z-index)
**z-index**只对**positioned元素**（即该元素的`position`不等于默认`static`外的值）起作用。对应`positoned box`（positioned元素)，**z-index**主要：
1. 指定该元素在当前**stacking context**的stack层级
2. 该元素是否创建新的**stacking context**

**z-index**可以取如下值：

- **(integer)整数**：表示当前元素在当前的**stacking context**的stack层级，并会让当前元素创建一个新的**stacking context**

- **auto**: 表示当前元素在当前的**stacking context**的stack层级为0，如果该元素不是**root**元素，就不会创建新的**stacking context**


### stacking order
**stacking context**可以相互嵌套，每个元素（box）都属于一个**stacking context**（自包含），每个`positoned box`在一个**stacking context**中都有一个整数的stack层级，它表示在同一个**stacking context**中的z轴方向stack层级位置。stack层级越大在**stacking context**中的位置越靠前。如果stack层级相同，按其在DOM文档中出现顺序绘制。

### stacking context
>**The stacking context** is a three-dimensional conceptualization of HTML elements along an imaginary z-axis relative to the user who is assumed to be facing the viewport or the webpage. HTML elements occupy this space in priority order based on element attributes.——MDN



**stacking context**的形成条件：

* 文档根节点（HTML）| Root element of document (HTML).
* 元素的position属性值为`absolute`或`relative`，并且z-index属性为除`auto`外的值 | Element with a position value "absolute" or "relative" and z-index value other than "auto".
* 元素的position属性值为`fixed`或`sticky` | Element with a position value "fixed" or "sticky" (sticky for all mobile browsers, but not older desktop).
* 元素是flexbox容器的子元素，带有z-index属性，且值为除`auto`外的值 | Element that is a child of a flex (flexbox) container, with z-index value other than "auto".
* 元素的opcity属性值小于1 | Element with a opacity value less than 1 (See the specification for opacity).
* 元素的[mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)属性值为除`normal`外的值 | Element with a mix-blend-mode value other than "normal".
* 元素的如下属性值为除`none`外的值 | Element with any of the following properties with value other than "none":
    * [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
    * [filter](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
    * [perspective](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective)
    * [clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path)
    * [mask](https://developer.mozilla.org/en-US/docs/Web/CSS/mask) / [mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image) / [mask-border](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-border)
* 元素的isolation属性值为`isolate` | Element with a [isolation](https://developer.mozilla.org/en-US/docs/Web/CSS/isolation) value "isolate".
* 元素的-webkit-overflow-scrolling属性值为`touch` | Element with a -webkit-overflow-scrolling value "touch".
* 元素带有[will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)属性 | Element with a will-change value specifying any property that would create a stacking context on non-initial value (see this post).

### painted order in stacking context

1. 形成**stacking context**元素的`background`和`borders` | the background and borders of the element forming the stacking context.
2. 负数的stack层级的**child stacking context**(负数值越大越前) | the child stacking contexts with negative stack levels (most negative first).
3. 文档流中非inline级、非positioned子节点 | the in-flow, non-inline-level, non-positioned descendants.
4. 非positioned浮动子节点 | the non-positioned floats.
5. 文档流中非positioned的inline级子节点（包括inline tables和inline blocks） | the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
6. stack层级为0的**child stacking context**和positoned子节点 | the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
7. stack层级为正整数的**child stacking context** | the child stacking contexts with positive stack levels (least positive first).
### Example
<iframe height='265' scrolling='no' title='stackLevel' src='//codepen.io/zhansingsong/embed/WEMrNK/?height=265&theme-id=dark&default-tab=css,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/zhansingsong/pen/WEMrNK/'>stackLevel</a> by zhansingsong (<a href='https://codepen.io/zhansingsong'>@zhansingsong</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 参考文章：
- [What No One Told You About Z-Index](https://philipwalton.com/articles/what-no-one-told-you-about-z-index/)
- [The stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
- [Specifying the stack level: the 'z-index' property](https://www.w3.org/TR/CSS2/visuren.html#propdef-z-index)


   
