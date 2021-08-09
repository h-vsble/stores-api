'use strict'

require('module-alias/register')

const mongooseConfig = require('configs/mongoose')

const middy = require('@middy/core')
const cors = require('@middy/http-cors')
const middyMongooseConnector = require('middy-mongoose-connector')
const doNotWaitForEmptyEventLoop = require('@middy/do-not-wait-for-empty-event-loop')

const Store = require('models/Store')

/**
 * @api {get} /nearests Gets all `storees` near a `location`
 * @apiName getNearest
 * @apiVersion 0.1.0
 * @apiGroup Store
 *
 * @apiParam {Number} latitude The `latitude`
 * @apiParam {Number} longitude The `longitude`
 * @apiParam {Number} radius The max distance to search for
 * @apiParam {Number} limit The max addresses
 *
 * @apiSuccess {Object} The nearest `store`
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     addressName  : 'Some location there',
 *     street       : 'arpel 232',
 *     street2      : '431A',
 *     ...
 *   }
*/
const main = middy(async event => {
  try {
    const { latitude, longitude, radius, limit } = event.queryStringParameters

    let store = {}

    if (latitude && longitude) {
      store = await Store
        .getNearests(latitude, longitude, radius, { limit })
    }

    return {
      statusCode  : 200,
      body        : JSON.stringify(store)
    }
  }
  catch (e) {
    console
      .error(`[StoreCache.getNearests] ${event.queryStringParameters}`, {
        error : e.message,
        stack : e.estack
      })

    return ({
      statusCode: e.statusCode || 500
    })
  }
})


main
  .use(doNotWaitForEmptyEventLoop())
  .use(
    middyMongooseConnector
      .default({
        mongoose    : mongooseConfig.mongoose,
        databaseURI : mongooseConfig.url
      })
  )
  .use(cors())

module.exports = { main }