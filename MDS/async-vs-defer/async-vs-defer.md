# async vs defer

> **async**与**defer**都是用来延迟（异步）加载脚本，但两者之间还是存在一些区别的，因此使用场景也有所不同。


### Legend
![legend](./legend.svg)


#### script
script标签不带**async**或**defer**特性时。当浏览器解析HTML遇到该script标签时，会暂停解析工作。然后会发起脚本请求，在脚本下载完便开始执行，只有在脚本执行完之后才恢复HTML解析。
[demo](./demo/script.html)

![script](./script.svg)

#### script with async

script标签带**async**特性时。当浏览器解析HTML遇到该script标签时，此时脚本的下载不会阻塞HTML的解析，只有在脚本下载完开始执行时，才会阻塞HTML的解析。**async**可以不能保证脚本执行顺序（在文档中出现的顺序），因为执行顺序取决于下载完的顺序。
[demo](./demo/script-async.html)

![script](./script-async.svg)

#### script with defer

script标签带**defer**特性时。当浏览器解析HTML遇到该script标签时，此时脚本的下载不会阻塞HTML的解析，脚本只有在HTML解析完之后才开始执行。**defer**可以保证脚本执行顺序（在文档中出现的顺序）。

[demo](./demo/script-defer.html)

![script](./script-defer.svg)

### 使用规则
一般尽可能使用**async**，然后考虑**defer**，最后不使用任何特性
- 如果脚本是一个模块并且没有依赖于其他脚本时，使用**async**
- 如果脚本依赖于其他脚本或被其他脚本依赖时，使用**defer**
- 如果脚本较小，并且被其他带**async**的脚本依赖，可以将该脚本直接内联script标签中，并放置在**async**脚本之前


### 兼容

在<=IE9浏览器对**defer**的实现存在一些bug，如defer不能保证script的执行顺序，如果需要支持<=IE9，不建议使用**defer**，如果scirpts的执行顺序重要，可以不设置任何特性，[了解更多](https://github.com/h5bp/lazyweb-requests/issues/42)。

### 参考文章：
- [async vs defer attributes](http://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)
