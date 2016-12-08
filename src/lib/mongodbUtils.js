// 根据数据库配置对象，生成连接字符串
exports.createConnStr = function (dbconfig) {
  let {username, password, host, option, name} = dbconfig
  const auth = username && password ? `${username}:${password}@` : ''
  host = host instanceof Array ? host.join(',') : host
  option = option ? option instanceof Array ? option.join('&') : option : ''
  return `mongodb://${auth}${host}/${name}?${option}`
}
