const logger = Logger('$say')

exports.hello = function (name) {
  logger.debug('Hello ' + name)
  return 'Hello ' + name
}
