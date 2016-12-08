const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId // constructor function
const _ObjectId = Schema.Types.ObjectId // use in schema definitions
const {capitalize, removeExtension} = require('../lib/formatUtils')

const models = {ObjectId}

fs.readdirSync(__dirname)
  .forEach((filename) => {
    if (filename === 'index.js') return
    const modelName = capitalize(removeExtension(filename))
    models[modelName] = require(path.join(__dirname, filename))(mongoose, Schema, _ObjectId)
  })

module.exports = models
