'use strict'

const Store = require('models/Store')

const StoreMock = require('../mocks/models/StoreMock')

describe('Store', () => {
  describe('virtuals', () => {
    describe('isOpen', () => {
      context('when `todayOpen` is not `null`', () => {
        context('when `todayOpen` is not `Gesloten`', () => {
          let store

          before(() => {
            store = new Store({ todayOpen: '08:00' })
          })

          it('should return `true`', () => {
            expect(store.toJSON().isOpen).to.true
          })
        })

        context('when `todayOpen` is `Gesloten`', () => {
          let store

          before(() => {
            store = new Store({ todayOpen: 'Gesloten' })
          })

          it('should return `true`', () => {
            expect(store.toJSON().isOpen).to.false
          })
        })
      })

      context('when `todayOpen` is `null`', () => {
        let store

        before(() => {
          store = new Store()
        })

        it('should return `false`', () => {
          expect(store.toJSON().isOpen).to.false
        })
      })
    })
  })

  describe('#save', () => {
    context('when `store` is valid', () => {
      let store

      before(async () => {
        store = StoreMock.getMock()

        await store.save()
      })

      after(async () => await StoreMock.remove(store))

      it('should save the `store`', async () => {
        const storeTemp = await Store.findById(store.get('_id'))

        expect(storeTemp.get('_id')).to.exist
      })
    })

    context('when `store` is invalid', () => {
      let store, expectionFunction

      before(() => {
        store = StoreMock
          .getMock({
            street: null
          })

        expectionFunction = async () => await store.save()
      })

      it('should return an `exception`', () => {
        return expect(expectionFunction()).to.be.rejectedWith(Error)
      })

      it('should not save the `store`', async () => {
        const storeTemp = await Store.findById(store.get('_id'))

        expect(storeTemp).to.not.exist
      })
    })
  })

  describe('#update', () => {
    context('when `store` is valid', () => {
      let store

      before(async () => {
        store = await StoreMock.add()
        store = await Store.findById(store._id)

        store.street = 'arpel 4595'

        await store.save()
      })

      after(async () => await StoreMock.remove(store))

      it('should update the `store`', async () => {
        const storeTemp = await Store
          .findById(store._id)

        expect(storeTemp.street).to.eql(store.street)
      })
    })

    context('when `store` is invalid', () => {
      let store, expectionFunction

      before(async () => {
        store = await StoreMock.add()
        store = await Store.findById(store._id)

        store.street = null

        expectionFunction = async () => await store.save()
      })

      after(async () => await Store.findByIdAndRemove(store._id))

      it('should return an `exception`', () => {
        return expect(expectionFunction()).to.be.rejectedWith(Error)
      })

      it('should not update the `store`', async () => {
        const storeTemp = await Store.findById(store.get('_id'))

        expect(storeTemp.street).to.not.eql(store.street)
      })
    })
  })

  describe('.find', () => {
    context('when filtered by `city`', () => {
      const CITY = 'GH'

      let DEFAULT_PARAMS, stores

      before(async () => {
        stores = await StoreMock
          .addMocks({
            city: CITY
          })

        stores = await Store
          .find(DEFAULT_PARAMS)

        DEFAULT_PARAMS = {
          city: CITY
        }
      })

      after(async () => await StoreMock.remove(stores))

      it('should return the `store`', async () => {
        const params = { ...DEFAULT_PARAMS }

        const storesTemp = await Store
          .find(params)

        const stores = await Store
          .find(params)
          .sort('date')

        expect(JSON.parse(JSON.stringify(storesTemp))).to.deep.equal(JSON.parse(JSON.stringify(stores)))
      })
    })
  })

  describe('.findOne', () => {
    context('when filtered by `city`', () => {
      const CITY = 'GL'

      let stores, DEFAULT_PARAMS

      before(async () => {
        stores = await StoreMock
          .addMocks({
            city: CITY
          })

        DEFAULT_PARAMS = {
          city: CITY
        }
      })

      after(async () => await StoreMock.remove(stores))

      it('should return the `store`', async () => {
        const params = { ...DEFAULT_PARAMS, id: stores[0].id }

        const storeGetOne = await Store
          .findOne(params)

        const storeGetOneQuery = await Store
          .findOne(params)

        expect(storeGetOne).to.deep.equal(storeGetOneQuery)
      })
    })
  })

  describe('.getNearests', () => {
    const POSITIONS = [
      [ -8.00292, -34.8726 ],
      [ -8.00292, -34.8727 ],
      [ -8.00194, -34.8731 ],
      [ -8.00128, -34.8736 ]
    ]

    let stores

    before(async () => {
      const promises = POSITIONS
        .map(p => {
          return StoreMock
            .add({
              location: p
            })
        })

      stores = await Promise.all(promises)
    })

    after(async () => await StoreMock.remove(stores))

    context('when there is a near `store`', () => {
      let nearestStores, position

      before(() => {
        nearestStores = stores.slice(0, 2)

        const [ lat, lng ] = nearestStores[0].location

        position = [
          lat + .00001,
          lng
        ]
      })

      context('when `latitude` is a `Number`', () => {
        let latitude, longitude

        before(() => {
          latitude = position[1]
          longitude = position[0]
        })

        context('when `radius` is a `Number`', () => {
          const RADIUS = 20

          let store

          before(async () => {
            store = await Store
              .getNearests(latitude, longitude, RADIUS)
          })

          it('should return the `nearest` `stores`', () => {
            expect(store.map(s => s.toJSON())).to.shallowDeepEqual(nearestStores.map(s => s.toJSON()))
          })
        })

        context('when `radius` is `undefined`', () => {
          const RADIUS = undefined

          let store

          before(async () => {
            store = await Store
              .getNearests(latitude, longitude, RADIUS)
          })

          it('should return the `nearest` `stores`', () => {
            expect(store.map(s => s.toJSON())).to.shallowDeepEqual(nearestStores.map(s => s.toJSON()))
          })
        })
      })

      context('when `latitude` is an `Array`', () => {
        let latitude

        before(() => {
          latitude = [ ...position ]
        })

        context('when `longitude` is a `Number`', () => {
          const LONGITUDE = 20

          let store

          before(async () => {
            store = await Store
              .getNearests(latitude, LONGITUDE)
          })

          it('should return the `nearest` `stores`', () => {
            expect(store.map(s => s.toJSON())).to.shallowDeepEqual(nearestStores.map(s => s.toJSON()))
          })
        })

        context('when `longitude` is `undefined`', () => {
          const LONGITUDE = undefined

          let store

          before(async () => {
            store = await Store
              .getNearests(latitude, LONGITUDE)
          })

          it('should return the `nearest` `stores`', () => {
            expect(store.map(s => s.toJSON())).to.shallowDeepEqual(nearestStores.map(s => s.toJSON()))
          })
        })
      })
    })

    context('when there is no near `store`', () => {
      let store

      before(async () => {
        const position = [ ...POSITIONS[0] ]
        const radius = 20

        position[0] += .1334

        store = await Store
          .getNearests(position, radius)
      })

      it('should return an empty `Array`', () => {
        expect(store).to.have.lengthOf(0)
      })
    })
  })
})