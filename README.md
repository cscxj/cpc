# CPC （Channel Procedure Call）

实现两个可通信端的方法互调用

## 🚫 limitations  

- 由于调用参数和返回结果都是通过消息通道传递，所以所有的方法都将是异步的  
- 只能调用被代理对象上的函数，不能获取属性值

## 🍀 Usage

### 单向调用  

```javascript
// 被调用端
const {
  onMessage,
  handleMessage,
  Channel: My
} = useCpc(my)
onMessage((data) => {
  my.postMessage(data)
})
my.onMessage((data) => {
  handleMessage(data)
})

// 调用端
const {
  onMessage,
  handleMessage,
  Channel: My
} = useCpc()
onMessage((data) => {
  my.postMessage(data)
})
my.onMessage((data) => {
  handleMessage(data)
})

My.authorize()
```

### 双向调用  

```javascript
// 通信端1
const {
  onMessage,
  handleMessage,
  Channel: My
} = useCpc(my) // useCpc 参数传入调用被代理的对象
onMessage((data) => {
  my.postMessage(data)
})
my.onMessage((data) => {
  handleMessage(data)
})

// 通信端1
const {
  onMessage,
  handleMessage,
  Channel: My
} = useCpc(my) // 这里也绑定一个被代理对象即可实现双向调用
onMessage((data) => {
  my.postMessage(data)
})
my.onMessage((data) => {
  handleMessage(data)
})

My.authorize()
```

### 多对象代理  

可以多次使用`useCpc`绑定多个对象，在消息传递时自行加字段区分，将消息分流，以实现多对象代理  
