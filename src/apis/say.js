const cheerio = require('cheerio')
// const rp = require('request-promise')
const rq = require('superagent')
const charset = require('superagent-charset')
const EventProxy = require('eventproxy')
charset(rq)

module.exports = function (router) {
  router.get('/say', async (ctx) => {
    ctx.checkQuery('name').notEmpty('name is required!')
    ctx.check()

    const {name} = ctx.query
    const data = {
      message: ctx.$say.hello(name)
    }

    ctx.success(data)
  })

  router.get('/say/pchong', async (ctx) => {
    let data = await rq.get('http://www.dytt8.net/').charset('gb2312')

    let $ = cheerio.load(data.text)

    // let target = $('#header .contain h4 a').eq(0).attr('href')
    // let alen = $('.co_area2 .co_content8 ul a').length
    // let dolen = Math.ceil(alen / 2)
    let hrefs = []
    for (let i = 0; i < 30; i++) {
      let target = $('.co_area2 .co_content8 ul a').eq(i * 2 + 1).attr('href')
      hrefs.push(target)
    }

    let ep = new EventProxy()
    ep.after('hello', hrefs.length, (topics) => {
      topics = topics.map((topic) => {
        let url = topic[0]
        let html = topic[1]
        $ = cheerio.load(html)
        return ({
          title: $('.title_all h1 font').text().trim(),
          url: url,
          download: $('#Zoom td a').attr('href')
        })
      })

      console.log('finish!')
      console.log(topics)
    })

    for (let i = 0; i < hrefs.length; i++) {
      let url = 'http://www.dytt8.net/' + hrefs[i]
      rq.get(url).charset('gb2312').end((err, detail) => {
        console.log('fetch ' + url + ' successful')
        ep.emit('hello', [url, detail.text])
      })
    }
    ctx.success()
  })
}
