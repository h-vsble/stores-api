'use strict'

const Store = require('models/Store')

/**
 * Mock class for [`Store` model]{@link Store}
 *
 * @class StoreMock
*/
class StoreMock {

  static getMockObject(params = {}) {
    const defaultObject = StoreMock
      .getDefaultObject()

    const paramsTemp = params && params.toJSON instanceof Function ?
      params.toJSON() :
      { ...params }

    return { ...defaultObject, ...paramsTemp }
  }

  /**
   * Returns the random mock
   *
   * @param {Object} params The object `params` to be merged with
   *
   * @return {Generic} The mock
  */
  static getMock(params = {}) {
    const mockObject = StoreMock
      .getMockObject(params)

    return new Store(mockObject)
  }

  /**
   * Returns the list of `mocks` mocks
   *
   * @param {Object} params The object `params` to be merged with
   * @param {Number} length The `length` of the returned `mocks`
   *
   * @return {Array<Generic>} The list of `mocks`
  */
  static getMocks(params, length = 3) {
    const mocks = []

    for (let i = 0; i < length; i++)
      mocks.push(this.getMock(params))

    return mocks
  }

  /**
   * Inserts the `mock`
   *
   * @param {Object} mockObject The `mock` object
   *
   * @return {Promise<this.Store>} The inserted `mock`
  */
  static add(mockObject) {
    const mock = this.getMockObject(mockObject)

    return Store
      .create(mock)
  }

  /**
   * Inserts the `mocks`
   * @async
   *
   * @param {Array<Generic> | Object} params The object `params` to set in every mock or a list of `mocks`
   * @param {Number} [length = 3] The number of `mocks` to be created
   *
   * @return {Array<Generic>} The list of created `mocks`
  */
  static async addMocks(params, length = 3) {
    const mocks = params instanceof Array ?
      [ ...params ] :
      this.getMocks(params, length)

    const promises = []

    for (let i = mocks.length - 1; i >= 0; i--)
      promises.push(this.add(mocks[i].toJSON()))

    await Promise.all(promises)

    return mocks
  }

  /**
   * Removes the `mocks`
   * @async
   *
   * @param {Array<Generic>} objects The list of `mocks` to be removed
   *
   * @return {undefined}
  */
  static async remove(objects) {
    if (objects) {
      const objectsTemp = objects instanceof Array ?
        [ ...objects ] :
        [objects]

      const promises = objectsTemp
        .map(object => {
          const id = object instanceof Object ?
            object._id :
            object

          return Store.findByIdAndRemove(id)
        })

      await Promise.all(promises)
    }
  }

  /**
   * Returns the default mock object
   *
   * @return {Object} The default mock object
  */
  static getDefaultObject() {
    const [ latitude, longitude ] = [-8.00128, -34.87363]

    return {
      latitude,
      longitude,
      uuid          : Math.round(Math.random() * 999999999),
      street        : `streetName_${Math.round(Math.random() * 999999)}`,
      street2       : `streetNumber_${Math.round(Math.random() * 999999)}`,
      postalCode    : `postalCode_${Math.round(Math.random() * 999999)}`,
      city          : `city_${Math.round(Math.random() * 999999)}`,
      locationType  : 'Supermarkt',
      addressName   : `addressName_${Math.round(Math.random() * 999999)}`,
      location      : [latitude, longitude]
    }
  }

  static addStoreLocations(locations) {
    const promises = locations
      .map(l => StoreMock.add({ location: l }))

    return Promise.all(promises)
  }
}

module.exports = StoreMock