
const http = require('http')
const https = require('https')
const Promise = require('bluebird')
const qs = require('querystring')
const fs = require('fs')
const iconv = require('iconv-lite')
const {
    URL
} = require('url')


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
    constructor() {}

    /**
     * 自动判断data里面的元素 如果是数组 JSON.stringify()
     * @param {*} url 
     * @param {*} data 
     */
    async post(url, data) {
        const postData = await this._stringify(data)
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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
                }
            }
            const R = protocol == 'http:' ? http : https
            const req = R.request(options, res => {
                const {
                    statusCode
                } = res
                if (statusCode !== 200) {
                    const err = new Error(`请求失败， 状态码：${statusCode}`)
                    res.resume()
                    return reject(err)
                }
                res.setEncoding('UTF-8');
                req.setTimeout(1000 * 60 * 5)
                let buffer = ''
                res.on('data', chunk => {
                    buffer += chunk
                })
                res.on('end', function () {
                    try {
                        return resolve(JSON.parse(buffer))
                    } catch (error) {
                        return resolve(buffer)
                    }
                })
            });
            req.on('error', err => {
                console.log(err)
                return reject(false)
            })
            req.setTimeout(1000 * 60 * 5, err => {
                req.abort()
                console.log(err)
                return reject(false)
            })
            req.write(postData)
            req.end()
        }).catch(err => {
            console.log(err)
            return false
        })
    }

    async json(url, data) {
        const postData = await this._stringify(data)
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
                method: 'POST',
                json: true,
                headers: {
                    'Accept': 'application/jsonversion=2.0',
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            }
            const R = protocol == 'http:' ? http : https
            const req = R.request(options, res => {
                const {
                    statusCode
                } = res
                if (statusCode !== 200) {
                    const err = new Error(`请求失败， 状态码：${statusCode}`)
                    res.resume()
                    return reject(err)
                }
                res.setEncoding('UTF-8');
                req.setTimeout(1000 * 60 * 5)
                let buffer = ''
                res.on('data', chunk => {
                    buffer += chunk
                })
                res.on('end', function () {
                    try {
                        return resolve(JSON.parse(buffer))
                    } catch (error) {
                        return resolve(buffer)
                    }
                })
            });
            req.on('error', err => {
                console.log(err)
                return reject(false)
            })
            req.setTimeout(1000 * 60 * 5, err => {
                req.abort()
                console.log(err)
                return reject(false)
            })
            req.write(postData)
            req.end()
        }).catch(err => {
            console.log(err)
            return false
        })
    }

    /**
     * 发送文件
     * @param {*} url 
     * @param {*} filefullpath 
     */
    async postFile (url, filefullpath) {
        const postData = await this._stringify(data)
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url)
            const {
                protocol,
                search,
                pathname
            } = urlObj
           const defaults = {
               flags: 'r',
               encoding: 'binary',
               fd: null,
               mode: 0o666,
               autoClose: true,
               highWaterMark: 64 * 1024
           };
            const stream = fs.createReadStream(filefullpath, defaults);
            
            const options = {
                hostname: urlObj['hostname'],
                port: urlObj['port'],
                path: `${pathname}${search}`,
                method: 'POST',
                json: true,
                headers: {
                    'Accept': 'application/jsonversion=2.0',
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            }
           
            const R = protocol == 'http:' ? http : https
            const req = R.request(options, res => {
                const {
                    statusCode
                } = res
                if (statusCode !== 200) {
                    const err = new Error(`请求失败， 状态码：${statusCode}`)
                    res.resume()
                    return reject(err)
                }
                res.setEncoding('UTF-8');
                req.setTimeout(1000 * 60 * 5)
                let buffer = ''
                res.on('data', chunk => {
                    buffer += chunk
                })
                res.on('end', function () {
                    try {
                        return resolve(JSON.parse(buffer))
                    } catch (error) {
                        return resolve(buffer)
                    }
                })
            });
            req.on('error', err => {
                console.log(err)
                return reject(false)
            })
            req.setTimeout(1000 * 60 * 5, err => {
                req.abort()
                console.log(err)
                return reject(false)
            })
            req.write(postData)
            req.end()
        }).catch(err => {
            console.log(err)
            return false
        })
    }
    /**
     * get 请求
     * @param {*} url 
     */
    async get(url) {
        console.log('uri'+url)
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
                    res.resume()
                    return reject(err)
                }
                res.setEncoding('binary')
                res.setTimeout(1000 * 60 * 5)
                const chunks = []
                res.on('data', chunk => {
                    chunks.push(Buffer.from(chunk, 'binary'))
                })
                res.on('end', function () {
                    resolve(iconv.decode(Buffer.concat(chunks), 'gbk'))
                })
            });
            req.on('error', err => {
                console.log(err)
                return reject(false)
            })
            req.setTimeout(1000 * 60 * 5, err => {
                req.abort()
                console.log(err)
                return reject(false)
            })
            req.end()
        })
    }

    /**
     * 下载文件
     * @param {*} url 
     * @param {*} filefullpath 
     */
    async getFile(url, filefullpath) {
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
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            const R = protocol == 'http:' ? http : https
            const req = R.request(options, res => {
                const {
                    statusCode
                } = res
                if (statusCode !== 200) {
                    const err = new Error(`请求失败， 状态码：${statusCode}`)
                    res.resume()
                    return reject(err)
                }
                res.setEncoding('binary');
                req.setTimeout(1000 * 60 * 5)
                const defaults = {
                    flags: 'w',
                    encoding: 'binary',
                    fd: null,
                    mode: 0o666,
                    autoClose: true
                };
                const stream = fs.createWriteStream(filefullpath, defaults);
                res.on('data', chunk => {
                    console.log(Buffer.byteLength(chunk))
                    stream.write(chunk)
                })
                res.on('end', function () {
                    resolve({
                        res: 0,
                        msg: 'OK'
                    })
                })
            });
            req.on('error', err => {
                console.log(err)
                return reject(false)
            })
            req.setTimeout(1000 * 60 * 5, err => {
                req.abort()
                console.log(err)
                return reject(false)
            })
            req.end()
        })
    }


    async _stringify(data) {
        for (const key in data) {
            if (typeof data[key] == 'object') {
                data[key] = JSON.stringify(data[key])
            }
        }
        return qs.stringify(data)
    }
}

module.exports = new Request()