# babel----loose mode
>Babel’s loose mode transpiles ES6 code to ES5 code that is less faithful to ES6 semantics. 
>
> babel的松散模式会将**ES6**代码转换为非严格**ES6**语义化的**ES5**代码.

### normal and loose mode

Babel支持两种模式：**normal**、**loose**

- **normal** : 尽可能地遵行**ES6**的语义化规范来转换代码
- **loose** : 与**normal**相反，不遵行**ES6**语义化，生成较简洁的**ES5**代码

通常是不推荐使用**loose mode**
### loose mode优缺点
- 优点 : 生成的代码更加简洁，速度更快，兼容性更好。 
- 缺点 : 当将转译过的**ES6**代码转为**native ES6**时，可能会有问题。
### 开启loose mode
- presets
```json
{
  "presets": [
    ["es2015", {
      "loose": true
    }]
  ]
}
```
- plugins
```json
{
  "plugins": [
    ["transform-es2015-classes", {
      "loose": true
    }]
  ]
}
```
### DEMO
这里通过一段代码，分别开启normal、loose模式，对比生成的代码。代码如下：
```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
```
#### 1. normal mode

在normal模式下，类的原型方法是通过`Object.defineProperty()`来添加的，完全遵行ES6规范，确保不可枚举。

```js
"use strict";

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor); // (A)
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Point = (function () {
    function Point(x, y) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
    }

    _createClass(Point, [{
        key: "toString",
        value: function toString() {
            return "(" + this.x + ", " + this.y + ")";
        }
    }]);

    return Point;
})();

```
#### 2. loose mode

在loose模式下，通过赋值语句来添加方法。风格就像手工书写的ES5代码一样。

```js
"use strict";

function _classCallCheck(instance, Constructor) { ··· }

var Point = (function () {
    function Point(x, y) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
    }

    Point.prototype.toString = function toString() { // (A)
        return "(" + this.x + ", " + this.y + ")";
    };

    return Point;
})();
```
## 参考文章：
[Babel 6: loose mode](http://2ality.com/2015/12/babel6-loose-mode.html)