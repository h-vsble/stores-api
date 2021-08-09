'use strict'

require('dotenv').config()

const StoreMock = require('../mocks/models/StoreMock')
const RequestMock = require('../mocks/RequestMock')

describe('getNearest', () => {
  const URL = '/test/stores/nearests'

  describe('GET /nearests', () => {
    const PATH = URL

    context('when `query` params has `latitude` and `logitude`', () => {
      context('when there is a near `store`', () => {
        let store, response

        before(async () => {
          const queryStringParams = {
            latitude  : -10.3424,
            longitude : -30.9082,
            radius    : 10
          }

          store = await StoreMock
            .add({
              location: [ queryStringParams.longitude, queryStringParams.latitude ]
            })

          response = await RequestMock.GET(PATH, queryStringParams)
        })

        after(async () => await StoreMock.remove(store))

        it('should return the `store`', () => {
          expect(response.body).to.shallowDeepEqual([JSON.parse(JSON.stringify(store))])
        })
      })

      context('when there is no near `store`', () => {
        let response

        before(async () => {
          const queryStringParams = {
            latitude  : -11.323232,
            longitude : -30.88789798,
            radius    : 30
          }

          response = await RequestMock.GET(PATH, queryStringParams)
        })

        it('should return an empty `list`', () => {
          expect(response.body).to.have.lengthOf(0)
        })
      })
    })

    context('when `query` params has no `latitude` or `logitude`', () => {
      let response

      before(async () => {
        const queryStringParams = {
          radius: 10
        }

        response = await RequestMock.GET(PATH, queryStringParams)
      })

      it('should return `null`', () => {
        expect(response.body).to.eql({})
      })
    })
  })
})