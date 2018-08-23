### Chrome Extension

#### 坑1：popp.html引入外部JS文件报错

* popp.html中直接引入外部文件
```html
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```
* 控制台报错
```javascirpt
/* error：Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self' blob: filesystem: chrome-extension-resource:". Either the 'unsafe-inline' keyword, a hash ('sha256-8jJ7LLeZfHj1p+GusjL8Jaj/aeL5U2seRtFZKg/fLaI='), or a nonce ('nonce-...') is required to enable inline execution. */
```
* 解决办法1： 本地引入（或者配置如下字段）
```
{
    ...
    "content_security_policy": "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; object-src 'self'",
    ...
}
```
* 控制台报错
```javascirpt
/* error：Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'unsafe-eval'". Either the 'unsafe-inline' keyword, a hash ('sha256-8jJ7LLeZfHj1p+GusjL8Jaj/aeL5U2seRtFZKg/fLaI='), or a nonce ('nonce-...') is required to enable inline execution.
 */
 /*
    基本得出结论：'unsafe-inline' 字段不能使用在谷歌扩展中，即使添加也没有效果
 */
```


#### 坑2：



