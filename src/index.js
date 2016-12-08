'use strict'

/* node modules */
const path = require('path')
const mongoose = require('mongoose')
const Koa = require('koa')
// const convert = require('koa-convert')
const kcors = require('kcors')
const koaLogger = require('koa-logger')
const jwt = require('koa-jwt')
const bodyParser = require('koa-bodyparser')
const koaValidate = require('koa-validate')
const Router = require('koa-router')
const koaUtils = require('./lib/koaUtils')
const mongodbUtils = require('./lib/mongodbUtils')
const config = require('./config')
const getLogger = require('./lib/logger')

/* logger */
global.Logger = getLogger
const logger = Logger('app')
logger.info(config)

/* mongoose connection */
if (config.mongodb) {
  mongoose.Promise = global.Promise
  mongoose.connect(mongodbUtils.createConnStr(config.mongodb))
  mongoose.connection.on('error', (err) => {
    logger.error(err)
    process.exit(1)
  })
}

/* app and context props */
const app = new Koa()
app.context.config = config
app.context.success = koaUtils.success
app.context.fail = koaUtils.fail
app.context.check = koaUtils.check

/* middlewares */
app.use(kcors())
app.use(koaLogger())
app.use(jwt({secret: config.app.secret}).unless({path: config.app.whiteList || []}))
app.use(bodyParser())
koaValidate(app)
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.fail(err.message, err.status || 500)
  }
})

/* services and routes */
const router = new Router()
koaUtils.injectServices(app, path.join(__dirname, 'services'))
koaUtils.injectRoutes(router, path.join(__dirname, 'apis'))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(config.app.port, () => { console.log('Server is listening on %s', config.app.port) })
