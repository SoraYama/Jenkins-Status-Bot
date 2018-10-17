import assert from 'assert'
import Telegraf, {ContextMessageUpdate} from 'telegraf'
import SocksAgent from 'socks-proxy-agent'
import _ from 'lodash'
import log4js from './logger'
import dataManager from './dataManager'

const logger = log4js.getLogger('bot')

if (!process.env.BOT_TOKEN) {
  require('dotenv').load()
}

let bot: Telegraf<ContextMessageUpdate>

assert(process.env.BOT_TOKEN, `No BOT_TOKEN env found! Set this env manually or in a '.env' file.`)

const proxy = process.env.BOT_PROXY || ''

if (proxy) {
  logger.info('proxy: ', proxy)
  const agent = new SocksAgent(proxy);
  bot = new Telegraf(process.env.BOT_TOKEN!, {
    telegram: {
      agent,
    }
  });
} else {
  bot = new Telegraf(process.env.BOT_TOKEN!);
}

bot.help(async ctx => {
  await ctx.reply(`
/sub\tSubscribe to recieve notification.
Eg: "/sub <foo1> <foo2>" will let you subscribe to recieve buildmsg from foo1 & foo2
To unsubscribe or update job info just send "/sub <newJob OR EMPTY>"
/help\tShow this help.
/touch\tTest whether the bot works correctly.
`)
})

bot.command('touch', async ctx => {
  await ctx.reply('> <')
})

bot.command('sub', async ctx => {
  try {
    await ctx.reply('Welcome, this is PT-Jenkins telegram bot')
    const chat = await ctx.getChat();
    const user = dataManager.getSubscriberByChatId(chat.id)
    const copiedList = [...dataManager.subscriberList]
    const jobRegs = _.tail(_.split(ctx.message.text, ' '))
    if (!user) {
      copiedList.push({
        chatId: chat.id,
        jobRegs,
      })
    } else {
      _.find(copiedList, {chatId: chat.id}).jobRegs = [...jobRegs]
    }
    logger.info('copiedList\n', copiedList)
    dataManager.writeSubscribers(copiedList)
    await ctx.reply('Subscribed success.')
  } catch(e) {
    logger.error(e)
    ctx.reply('opps, something went wrong.\n', e)
  }
})

bot.startPolling()

export default bot
