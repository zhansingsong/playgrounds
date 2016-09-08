#pl
***
pl是一个基于`@media`媒体查询实现的、轻量级的、横竖屏检测实用库，它让orientation detection更加可靠，更加easy。只要支持@media的浏览器都该都支持。
### usage
将`pl`脚本（文件）引入`<head></head>`节点中
```xml
<head>
  <meta charset="utf-8">
  <!-- 引入pl文件 -->
  <script type="text/javascript" src="js/library/pl.js"></script>
</head>
```
对需要检测横竖屏的地方，调用`pl.on()`
```js
pl.on(function(event){
 if(event.current === 'portrait|landscape'){
 	// do something……
 } else {
 	// do something……
 }
});
```
`pl.on()`的参数必须是`function`, 可以调用多次。

### API
##### pl.on(fn)
`fn`: function类型，该函数会在横竖屏发生变化时执行。同时会传递一个参数event(可以随意命名)给该函数，event参数等于`pl.orientation`
```js
event:{
  init: 'portrait|landscape', //初始化时，横竖屏的状态
  current: 'portrait|landscape'//当前横竖屏的状态
}
```
注意：可以多次调用pl.on()函数。

```js
pl.on(function(event){
 if(event.current === 'portrait|landscape'){
 	// do something……
 } else {
 	// do something……
 }
});
```
##### pl.orientation
```js
pl.orientation:{
  init: 'portrait|landscape', //初始化时，横竖屏的状态
  current: 'portrait|landscape'//当前横竖屏的状态
}
```
##### pl.event
订阅与发布事件模式
```js
pl.event.listen: 用于订阅特定的事件
pl.event.trigger：用于触发特定的事件
pl.event.remove: 用于删除特定的事件
```

### License
**pl.js** is covered by the MIT License.