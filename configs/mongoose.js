'use strict'

const mongoose = require('mongoose')

const url = process.env.NODE_ENV != 'test' ?
  process.env.MONGODB_URL :
  process.env.MONGODB_URL_TEST

module.exports = {
  url,
  mongoose
}