# iShare.js

##### **iShare.js**是一个小巧的分享插件，纯JS编写，不依赖任何第三方库，使用简便。
**Jiathis**,** bShare**, **百度分享**等是目前国内比较受欢迎的分享插件，都集成了很多常用的分享接口，功能很丰富。不过个人体验存在如下两点不足：

1. 定制度不高，特别在自定义样式上。
2. 没有更新维护，部分接口都是挂掉的。另外，提供的大部分接口都是没有用到，而真正用到就那么几个，显得有点冗余。

++**iShare.js**是针对上述两个问题而诞生的。++

![share](sharejs.png)

## 安装

`npm install iShare` 或 `or bower install iShare`

## Features

- 支持UMD模式（AMD，CMD, Globals）
- 纯js编写，不依赖任何库
- 多种配置方式
- 兼容性好
- 支持常用的分享接口

## 支持分享接口

- QQ好友
- QQ空间
- 腾讯微博
- 新浪微博
- 微信
- 豆瓣
- 人人
- 有道笔记
- Linkedin
- Facebook
- Twitter
- Google+
- Pinterest
- Tumblr

## 配置项

```js
defaults = {
			title: document.title,
			url: location.href,
			host: location.origin || '',
			description: Util.getmeta('description'),
			image: Util.getimg(),
			sites: ['iShare_weibo','iShare_qq','iShare_wechat','iShare_tencent','iShare_douban','iShare_qzone','iShare_renren','iShare_youdaonote','iShare_facebook','iShare_linkedin','iShare_twitter','iShare_googleplus','iShare_tumblr','iShare_pinterest'],
			initialized: true,
			isTitle: false,
			isAbroad: false
		}
```
- **title**: 分享的标题，默认为页面标题
- **url**： 分享的**URL**， 默认为页面**URL**
- **host**： 分享的**host**，默认为页面**host**
- **description**： 分享的**summary**或**description**，默认为meta的description
- **image**： 指定分享图片的**src**，默认为页面第一图片
- **sites**： 指定使用那些分享接口
- **initialized**：如果为`true`，可以自动填充分享元素, 默认为`true`
- **isTitle**：如果为`true`,会开启a标签的`title`属性, 默认是为`false`
- **isAbroad**: 如果为`false`，会将`sites`中的**Linkedin**、 **Facebook**、 **Twitter**、 **Google+**、 **Pinterest**、 **Tumblr**去掉, 默认为`false`




## 教程
#### 1. 快速入门
- 引入容器（<font color="red">**注意：**</font>必须指定`iShare`类名）
```xml
<div class="iShare iShare-16"></div>//默认分享icon的大小：24px，可以通过指定iShare-16，iShare-36来定制16px或32px的icon的大小，这只对内置样式起作用，即对自定义样式不起作用。
```
- 进行配置（可选）
```js
    var iShare_config = {
        title: '分享标题',
        description: '分享的summary或description',
        url: '分享的URL',
        isAbroad: true,
        initialized: true
    }
```
- 引入脚本文件
```xml
<script href="javascript:;" type="text/javascript" src="iShare.js"></script>
```


###### Example
<font color="red">**注意：**</font>**`iShare_config`必须在脚本加载之前配置**

```xml
<div class="iShare iShare-16"></div>

<script href="javascript:;" type="text/javascript">
	var iShare_config = {
		title: '分享标题',
		description: '分享的summary或description',
		url: '分享的URL',
		isAbroad: true,
		isTitle: true,
		initialized: true
	}
</script>
<script href="javascript:;" type="text/javascript" src="iShare.js"></script>
```

#### 2. 自定义分享样式
- 引入自定义的代码（<font color="red">**注意：**</font>必须指定`iShare`类名，同时为特定分享指定应对分享类名，例qq分享，需要指定`iShare_qq`）
```xml
<div class="iShare">
	<a href="#" class="iShare_qq"><i class="iconfont qq">&#xe60f;</i></a>
</div>
```
- 将`initialized`配置项设置为`false`，开启自定义模式
```js
	var iShare_config = {
		initialized: false
	}
```

###### Example
```xml
<div class="iShare" style="position: absolute;top: 50%;margin-top: 50px;" data-sites="">
	<a href="#" class="iShare_qq"><i class="iconfont qq">&#xe60f;</i></a>
	<a href="#" class="iShare_qzone"><i class="iconfont qzone">&#xe610;</i></a>
	<a href="#" class="iShare_tencent"><i class="iconfont tencent" style="vertical-align: -2px;">&#xe608;</i></a>
	<a href="#" class="iShare_weibo"><i class="iconfont weibo">&#xe609;</i></a>
	<a href="#" class="iShare_wechat"><i class="iconfont wechat" style="vertical-align: -2px;">&#xe613;</i></a>
	<a href="#" class="iShare_douban"><i class="iconfont douban" style=" vertical-align: -2px;">&#xe612;</i></a>
</div>
<script href="javascript:;" type="text/javascript">
 	// 将initialized设置为false
	var iShare_config = {
		initialized: false
	}
</script>
```


