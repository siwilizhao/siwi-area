const request = require('./lib/request')
const cheerio = require('cheerio')
const baseDomain = `http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2009`
const mkdirs = require('siwi-mkdirs')
const fs = require('fs')
const path = require('path')

class Spider {
    constructor() {
        this.getHtml(`${baseDomain}/index.html`)
    }
    async getHtml(uri) {
        const html = await request.get(uri)
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
            if (uri ) {
                chinese[province] = await this.getCity(uri)
            } else {
                chinese[province] = []
            }
        }
        const defaults = {
            flags: 'w',
            encoding: 'UTF-8',
            fd: null,
            mode: 0o666,
            autoClose: true
        };
        const save_path = path.resolve('data/chinese')
        if (!fs.existsSync(save_path)) {
            await mkdirs.multi(save_path)
        }
        const stream = fs.createWriteStream(`${save_path}/area.json`, defaults);
        stream.write(JSON.stringify(chinese))
    }
    async getCity(uri) {
        const html = await request.get(uri)
        const $ = cheerio.load(html)
        const result = {}
        $('.citytr').each(async (i, e) => {
            const title = $(e).children('td').last().text()
            const link = $(e).children('td').last().find('a').attr('href')
            if (link) {
                const href = `${baseDomain}/${link}`
                result[title] = await this.getCountry(href)
            }
        })
        return result
    }
    async getCountry(uri) {
        const html = await request.get(uri)
        const $ = cheerio.load(html)
        const result = []
        $('.countytr').each(async (i, e) => {
            const title = $(e).children('td').last().text()
            result.push(title)
        })
        return result
    }
}
module.exports = new Spider()