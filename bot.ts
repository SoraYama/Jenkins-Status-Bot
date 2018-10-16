import assert from 'assert'
import Telegraf, {ContextMessageUpdate} from 'telegraf'
import SocksAgent from 'socks-proxy-agent'
import log4js from './logger'
import path from 'path'
import fs from 'fs-extra'
import { DATA_ROOT } from './utils';

const logger = log4js.getLogger('bot')

if (!process.env.BOT_TOKEN) {
  require('dotenv').load()
}

let bot: Telegraf<ContextMessageUpdate>

assert(process.env.BOT_TOKEN, `No BOT_TOKEN env found! Set this env manually or in a '.env' file.`);

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

bot.command('sub', async ctx => {
  try {
    await ctx.reply('Welcome, this is PT-Jenkins telegram bot')
    const chat = await ctx.getChat();
    if (!fs.existsSync(DATA_ROOT)) {
      fs.mkdirSync(DATA_ROOT)
    }
    await fs.appendFile(path.join(DATA_ROOT, 'subscribers'), chat.id)
  } catch(e) {
    logger.error(e)
    ctx.reply('咪啪。')
  }
})

bot.startPolling()

export default bot
