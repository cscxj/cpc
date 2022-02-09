# CPC （Channel Procedure Call）

分为调用端和被调用端  
调用端API：

```javascript
var msgHandler = {
    handleMessage(pkg) {
      my.postMessage(pkg)
    }
    onMessage(pkg) {

    }
}
my.onMessage = pkg => {
    msgHandler.onMessage(pkg)
}

var cpc = createCpc(, 'my')

cpc.call('exit') // 调用方法
cpc.get() // 获取值
```
