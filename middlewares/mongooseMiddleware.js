'use strict'

const mongooseConfig = require('configs/mongoose')

const mongoConnectionOptions = {
  useCreateIndex      : true,
  useFindAndModify    : false,
  useNewUrlParser     : true,
  useUnifiedTopology  : true
}

const middleware = {
  before: async () => {
    if (mongooseConfig.mongoose.connection.readyState === 1)
      console.warn('Using existing database connection')
    else {
      console.warn('Using new database connection')

      await mongooseConfig.mongoose
        .connect(mongooseConfig.url, mongoConnectionOptions)
    }
  },
  after: async () => {
    if (mongooseConfig.mongoose.connection.readyState !== 0)
      await mongooseConfig.mongoose.connection.close()
  }
}

module.exports = middleware