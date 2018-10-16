import Koa from 'koa'
import log4js from './logger'
import { validate, DATA_ROOT } from './utils'
import bot from './bot'
import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'
import qs from 'querystring'

const logger = log4js.getLogger('index')

const app = new Koa()

app.on('error', err => {
  logger.error(err)
})

app.use(async (ctx, next) => {
  logger.info(`${ctx.method} ${ctx.url}`)
  await next()
})

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(async (ctx, next) => {
  const validated = validate(ctx.querystring, ['buildTag', 'buildStatus', 'buildTime', 'link'])
  if (!validated.ok) {
    logger.error(`${ctx.url} lack params: ${validated.lackedParams}`)
    ctx.status = 400
    return
  }
  const subBuffer = await fs.readFile(path.join(DATA_ROOT, 'subscribers'))
  const subscriberIds = subBuffer.toString().split(',')
  const { buildTag, buildTime, buildStatus, link } = qs.parse(ctx.querystring)
  _.each(subscriberIds, async id => {
    await bot.telegram.sendMessage(id, `${buildTag} (${buildStatus})\n${buildTime}\n${link}`)
  })
  await next()
})

app.listen(7123)
