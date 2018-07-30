# siwi-area
国家统计局城乡划分

## 运行

```shell
node index.js
```

## 调试

```shell
export NODE_ENV=dev
node index.js
```

## 配置

### HTTP_REQUEST_TIMEOUT

> 请求超时的分钟数 默认1分钟

### HTTP_RESPONSE_TIMEOUT

> 设置 socket 的超时时间 默认1分钟

### WRITE_STREAM_DEFAULT

```js
{
    flags: 'w',
    encoding: 'UTF-8',
    fd: null,
    mode: 0o666,
    autoClose: true
}
```

> 文件

## 生成文件

> 默认路径 当前目录下  data/chinese/${random}.json  文件名随机生成