
const http = require('http');

// 如果是https协议的网站，这里改用https就可以了
// 请求头最好设置为user-agent，不然有的网站爬不到，做了限制爬虫爬取网页
const options = {
  url: 'https://visitor-badge.laobi.icu/badge?page_id=Bingo.readme',
  header: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.'
  }
}


async function get(){
  return new Promise((rs,rj)=>{
    http.get(options, function (res) {
      const chunks = [];
      res.on('data', function (chunk) {
        chunks.push(chunk);
      });
      res.on('end', function () {
        rs()
        console.log('成功')
      });
    })
  })
}

async function loop(){
  for (let i = 0; i < 450; i++) {
    await get()
  }
}

loop()
