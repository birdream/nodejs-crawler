module.exports = function (mongoose, Schema, ObjectId) {
  const userSchema = new Schema({
    username: {
      type: String,
      required: [true, '缺少用户名。'],
      validate: {
        validator: (v) => /^[0-9a-zA-Z_]{6,20}$/.test(v),
        message: '用户名格式不正确'
      }
    },
    password: {
      type: String,
      required: [true, '缺少密码。']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    LastLoginedAt: {
      type: Date,
      default: null
    }
  })

  return mongoose.model('User', userSchema)
}
