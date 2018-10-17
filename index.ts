import Koa from 'koa'
import log4js from './logger'
import { validate } from './utils'
import bot from './bot'
import _ from 'lodash'
import qs from 'querystring'
import moment from 'moment-timezone'
import dataManager from './dataManager';

const logger = log4js.getLogger('index')

const app = new Koa()

app.on('error', err => {
  logger.error(err)
})

app.use(async (ctx, next) => {
  await next()
  logger.info(`${ctx.method} ${ctx.protocol} ${ctx.url} - ${ctx.response.get('X-Response-Time')}`)
})

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(async (ctx, next) => {
  const validated = validate(ctx.querystring, ['buildTag', 'buildStatus', 'link'])
  if (!validated.ok) {
    logger.error(`${ctx.url} lack params: ${validated.lackedParams}`)
    ctx.status = 400
    return
  }
  const subList = dataManager.subscriberList
  const { buildTag, buildStatus, link } = qs.parse(ctx.querystring)
  const filterdList = _.filter(
    subList,
    item => _.some(item.jobRegs, r => new RegExp(r, 'ig').test(buildTag as string))
  )
  const dateStr = moment.tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
  _.each(filterdList, async sub => {
    try {
      await bot.telegram.sendMessage(sub.chatId, `${buildTag} (${buildStatus})\n${dateStr} CST\n${link}`)
      logger.info(`sent msg to ${sub.chatId}`)
    } catch (e) { logger.error(e) }
  })
  await next()
})

app.listen(7123)
