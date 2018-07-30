
const http = require('http')
const https = require('https')
const Promise = require('bluebird')
const iconv = require('iconv-lite')
const {
    URL
} = require('url')
const {HTTP_REQUEST_TIMEOUT, HTTP_RESPONSE_TIMEOUT} = require('../config')
/*
URL
{
    href: 'http://baidu.com/',
    origin: 'http://baidu.com',
    protocol: 'http:',
    username: '',
    password: '',
    host: 'baidu.com',
    hostname: 'baidu.com',
    port: '',
    pathname: '/',
    search: '',
    searchParams: URLSearchParams {},
    hash: ''
}
*/
class Request {
    constructor() { }

    async get(url) {
        if (process.env.NODE_ENV == 'dev') {
            console.log('uri:' + url)
        }
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url)
            const {
                protocol,
                search,
                pathname
            } = urlObj
            const options = {
                hostname: urlObj['hostname'],
                port: urlObj['port'],
                path: `${pathname}${search}`,
                method: 'GET',
            }
            const R = protocol == 'http:' ? http : https
            const req = R.request(options, res => {
                const {
                    statusCode
                } = res
                if (statusCode !== 200) {
                    const err = new Error(`请求失败， 状态码：${statusCode}`)
                    res.resume()// 消耗响应数据以释放内存
                    reject(err)
                }
                res.setEncoding('binary')
                res.setTimeout(1000 * 60 * HTTP_RESPONSE_TIMEOUT, () => {
                    if (process.env.NODE_ENV == 'dev') {
                        console.log('error: res timeout')
                    }
                    reject(false)
                })
                const chunks = []
                res.on('data', chunk => {
                    chunks.push(Buffer.from(chunk, 'binary'))
                })
                res.on('end', function () {
                    resolve(iconv.decode(Buffer.concat(chunks), 'gbk'))
                })
            });
            req.on('error', error => {
                if (process.env.NODE_ENV == 'dev') {
                    console.log('error: on error')
                    console.trace(error)
                }
                reject(false)
            })
            req.setTimeout(1000 * 60 * HTTP_REQUEST_TIMEOUT, () => {
                if (process.env.NODE_ENV == 'dev') {
                    console.log('error: req on error')
                }
                req.abort() // 标记请求为终止。 调用该方法将使响应中剩余的数据被丢弃且 socket 被销毁。
                reject(false)
            })
            req.end()
        }).catch(error => {
            return error // false
        })
    }
}
module.exports = new Request()