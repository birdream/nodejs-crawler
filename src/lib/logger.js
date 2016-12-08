const log4js = require('log4js')
const config = require('../config')

const logConfig = config.log || {}
if (!logConfig.level) logConfig.level = 'DEBUG'
if (logConfig.options) log4js.configure(logConfig.options)

module.exports = function getLogger (name) {
  const logger = log4js.getLogger(name)
  logger.setLevel(logConfig.level)
  return logger
}

// Usage:
//
// const logger = getLogger('cheese')
// logger.trace('Entering cheese testing')
// logger.debug('Got cheese.')
// logger.info('Cheese is Gouda.')
// logger.warn('Cheese is quite smelly.')
// logger.error('Cheese is too ripe!')
// logger.fatal('Cheese was breeding ground for listeria.')
