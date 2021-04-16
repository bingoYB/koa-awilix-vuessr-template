var glob = require('glob')
const path = require('path')

const mockPath = './src/web/mock/'
const json404 = { code: 404, message: '本地数据找不到。' }
const json200 = { code: 200, message: '操作成功。' }


module.exports = app => {
	// 设置路径匹配
	app.use('/mock/', function (req, res) {
		let basePath = path.resolve(__dirname, mockPath)
		let l = req.url.indexOf('?')
		let reqUrl = l === -1 ? req.url : req.url.substring(0, l)
		let paths = reqUrl.split('/')
		let i = paths.length
		while (i > 0) {
			const findFilePath = paths.slice(0, i).join('/')
			const jsonFile = glob.sync(basePath + findFilePath + '.json')
			if (jsonFile.length) {
				const pathKey = paths.slice(i, paths.length).join('/')
				delete require.cache[jsonFile[0].replace(/\//g, '\\')]
				// 加载数据文件
				let resJson = require(jsonFile[0])
				// 需要返回的json
				let requiredJson = pathKey ? resJson[pathKey] : resJson
				if (requiredJson) {
					res.send(requiredJson)
					return
				}
			}

			const jsFile = glob.sync(basePath + findFilePath + '.js')
			if (jsFile.length) {
				const pathKey = paths.slice(i, paths.length).join('/')
				delete require.cache[jsFile[0].replace(/\//g, '\\')]
				// 加载数据文件
				let resJson = require(jsFile[0])

				let resFunc = (typeof resJson === 'function') && resJson

				if (resFunc) {
					resJson = resFunc(req)
				}
				// 需要返回的json
				let requiredJson = pathKey ? resJson[pathKey] : resJson
				if (requiredJson) {
					res.send(requiredJson)
					return
				}
			}
			i--
		}

		if (reqUrl.match(/add|save|del|delete|update/)) {
			res.json(json200)
		} else {
			res.json(json404)
		}
	})
}