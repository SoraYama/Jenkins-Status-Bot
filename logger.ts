import log4js from 'log4js'

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'colored'
      },
    },
    verbose: {
      type: 'file',
      filename: './logs/debug.log',
      maxLogSize: 10485760,
      layout: {
        type: 'colored'
      },
    },
    production: {
      type: 'file',
      filename: './logs/production.log',
      layout: {
        type: 'colored'
      },
    },
    fatal: {
      type: 'file',
      filename: './logs/error.log',
      layout: {
        type: 'colored'
      },
    },
  },
  categories: {
    default: {
      appenders: ['production', 'console'],
      level: 'info',
    },
    utils: {
      appenders: ['verbose', 'console'],
      level: 'debug',
    },
    error: {
      appenders: ['fatal'],
      level: 'error',
    },
  }
})

export default log4js
