# 关于箭头函数的case
>An arrow function expression has a shorter syntax than a function expression and does not bind its own this, arguments, super, or new.target. These function expressions are best suited for non-method functions, and they cannot be used as constructors.  -----MDN


```
// #1
var x = 1,
    o = {
        x : 10,
        test : function(){
            console.log(this.x);
        }
    };

o.test(); //output: 10

// #2
var x = 1,
    o = {
        x : 10,
        test : () =>{this.x}
    };
o.test();//output: 1
```
### case:解释上述代码，为啥输出不一样？
- 第一个比较容易理解。都知道this是运行时动态绑定的，`o.test()`方法在直接在`o`对象上调用，即`this`指向`o`。换一种写法：`o.test.call({x:222})` ,此时绑定的对象是`{x:222}`。

- 第二个使用了箭头函数，都知道箭头函数可以`绑定this`。
	- 箭头函数中this不是通过类似于闭包机制实现的局部变量
	- 也不是`.bind(this)`的语法糖
	
上述两种情况并不是箭头函数关于对this的实现，只是在行为表现较为相似。

>- “箭头函数”的this，总是指向定义时所在的对象，而不是运行时所在的对象。
>- 箭头函数都没有自己的this，对this访问永远是它继承外部上下的this（行为上类似于普通变量查询，沿着作用域链逐级向上查找）
>- 箭头函数不仅不绑定this，也不绑定arguments，super(ES6)，new.target。所有涉及它们的引用，都会沿袭向上查找外层作用域链的方案来处理。

结合上述关于箭头函数的描述，就可以很好地解释第二个实例为什么会输出为`1`。
因为箭头函数没有自己的this，所以只能沿着作用域链逐级向上查找，（要知道`{}对象`是没有**变量对象**和**作用域链**，它们只存在于函数中），直到作用域链最顶端（作用域链最顶端都是的全局对象global）。于是查找到定义在全局作用域`var x = 1`，因此输出就为`1`了。

### 参考文章：
- [关于箭头函数this的理解几乎完全是错误的](https://github.com/ruanyf/es6tutorial/issues/150)
- [ES6 箭头函数中的 this？你可能想多了（翻译）](http://www.cnblogs.com/vajoy/p/4902935.html)
