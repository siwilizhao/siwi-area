const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const cheerio = require('cheerio')
const mkdirs = require('siwi-mkdirs')
const request = require('./lib/request')
const unique = require('siwi-uniquestring')
const { WRITE_STREAM_DEFAULT } = require('./config')
const baseDomain = `http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2009`
class Spider {
    constructor() {
        this.getProvinces(`${baseDomain}/index.html`)
    }

    /**
     * 获取省份列表
     * @param {String} uri 
     */
    async getProvinces(uri) {
        let html = await request.get(uri)
        while (!html) {
            await utils.log(`[getProvinces] 重新获取： ${uri}`)
            html = await request.get(uri)
        }
        const $ = cheerio.load(html)
        const chinese = {}
        $('.provincetr td').each((i, e) => {
            const title = $(e).text()
            const href = $(e).children('a').attr('href')
            if (href) {
                chinese[title] = [`${baseDomain}/${href}`]
            }
        })
        for (const province in chinese) {
            const uri = chinese[province]
            if (uri) {
                chinese[province] = await this.getCity(uri)
            } else {
                chinese[province] = []
            }
        }
        const save_path = path.resolve('data/chinese')
        if (!fs.existsSync(save_path)) {
            await mkdirs.multi(save_path)
        }
        const filename = await unique.random()
        const stream = fs.createWriteStream(`${save_path}/${filename}.json`, WRITE_STREAM_DEFAULT);
        stream.write(JSON.stringify(chinese))
    }

    /**
     * 获取省份城市
     * @param {String} uri 
     */
    async getCity(uri) {
        let html = await request.get(uri)
        while (!html) {
            await utils.log(`[getCity] 重新获取： ${uri}`)
            html = await request.get(uri)
        }
        const $ = cheerio.load(html)
        const province = {}
        $('.citytr').each((i, e) => {
            const title = $(e).children('td').last().text()
            const link = $(e).children('td').last().find('a').attr('href')
            province[title] = `${baseDomain}/${link}`
            if (link) {
                province[title] = `${baseDomain}/${link}`
            } else {
                province[title] = false
            }
        })

        for (const city in province) {
            const uri = province[city]
            if (uri) {
                province[city] = await this.getCountry(uri)
            } else {
                province[city] = []
            }
        }
        return province
    }

    /**
     * 获取城市区域
     * @param {String} uri 
     */
    async getCountry(uri) {
        let html = await request.get(uri)
        while (!html) {
            utils.log(`[getCountry] 重新获取： ${uri}`)
            html = await request.get(uri)
        }
        const $ = cheerio.load(html)
        const city = []
        $('.countytr').each((i, e) => {
            const title = $(e).children('td').last().text()
            city.push(title)
        })
        return city
    }
}
module.exports = new Spider()