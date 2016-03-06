# iShare.js

iShare.js是一个小巧的分享插件，纯JS编写，不依赖任何库。目前国内比较受欢迎的分享插件都比较大，如Jiathis, bShare, 百度分享等。最重要集成很多分享接口，但是其实我们真正用到才有那几个，虽然可以定制。但制定度不不是很高，特别在定制分享icon样式，当然也可通过覆盖方式来实现定制自己的样式，但是总是很不方便。而iShare.js可以容易解决这个问题，使用很方便。
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
- title: 分享的标题
- url： 分享的**URL**
- host： 分享的**host**
- description： 分享的**summary**或**description**
- image： 指定分享图片的**src**
- sites： 指定使用那些分享接口
- initialized：如果为`true`，可以自动填充分享元素
- isTitle：如果为`true`,会开启a标签的`title`属性
- isAbroad: 如果为`false`，会将`sites`中的**Linkedin**、 **Facebook**、 **Twitter**、 **Google+**、 **Pinterest**、 **Tumblr**去掉

##使用

```xml
<div class="iShare iShare-16"></div> //默认分享icon的大小：24px，可以通过指定iShare-16，iShare-36来定制16px或32px的icon的大小

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


## 教程
#### 1. 自定义分享样式