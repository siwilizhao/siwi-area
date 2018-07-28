const spider = require('../index')
describe('index.js', () => {
    it('getHtml', async() => {
        const uri = `http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2009/index.html`
        await spider.getHtml(uri)
    });
});