'use strict'

const chai = require('chai')

chai.use(require('chai-http'))

const DEFAULT_URL = `http://localhost:${process.env.LOCAL_PORT}`

/**
 * Contains a set of (`chai`) `http` request methods
 * @class
*/
class RequestMock {
  static get DEFAULT_URL() { return DEFAULT_URL }

  static GET(path, params = {}, baseUrl = DEFAULT_URL) {
    return chai
      .request(baseUrl)
      .get(path)
      .query(params)
  }

  static POST(path, object = {}, params = {}, baseUrl = DEFAULT_URL) {
    return chai
      .request(baseUrl)
      .post(path)
      .query(params)
      .send(object)
  }

  static DELETE(path, params = {}, baseUrl = DEFAULT_URL) {
    return chai
      .request(baseUrl)
      .del(path)
      .query(params)
      .send()
  }
}

module.exports = RequestMock