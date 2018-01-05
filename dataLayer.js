const cheerio = require('cheerio')
const FileHound = require('filehound')
const fs = require('fs')

const rootDir = '.'
const reg = 'www.googletagmanager.com/gtag/js?id=UA-112012191-1'
const analyticsCode = `
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-112012191-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', 'UA-112012191-1');
  </script>
`
const readFile = () => {
  return FileHound.create().paths(rootDir).ext('html').find()
}

readFile()
  .then((res) => {
    console.log('开始替换analytics页面．．．')
    addAnalytics(res)
  })


const addAnalytics = (htmls) => {
  htmls.map((html, i) => {
      console.log(html)
      fs.readFile(html, (err, data) => {
        if (err) throw err
        const $ = cheerio.load(data)
        const text = $.html()
        if (text.indexOf(reg) > -1) return
        $('body').append(analyticsCode)
        const replaceHtml = $.html()
        writeFile(html, replaceHtml)
      })
    })
    // console.log('页面生成success')

}

const writeFile = (file, content) => {
  fs.writeFile(file, content, (err) => {
    if (err) throw err
    console.log(`${file}替换成功!`)
  })
}