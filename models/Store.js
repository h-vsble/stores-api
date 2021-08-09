'use strict'

const mongoose = require('mongoose')

const StoreSchema = require('../schemas/StoreSchema')

const OPTIONS = {
  _id         : true,
  strict      : true,
  toJSON: {
    virtuals: true
  }
}

/**
 * The `max distance` (in `meters`) between the `lat/lng` and the (assumed by us) `nearest` `Store`
 *
 * @type {Number}
 * @constant
*/
const MAX_DISTANCE = process.env.MAX_DISTANCE || 20

const schema = new mongoose.Schema(StoreSchema, OPTIONS)

/**
 * Represents the `Store` model in `db`
 *
 * @class Store
 *
 * @property {string} street
 * @property {string} street_number
 * @property {string} postal_code
 * @property {string} neighborhood
 * @property {string} city
 * @property {string} state
 * @property {string} state_short
 * @property {string} country
 * @property {string} country_short
 * @property {string} formatted_Store
 * @property {string} google_place_id
 * @property {Object} geometry The `geometry` object from `google.maps.GeocoderResult` (See {@link https://developers.google.com/maps/documentation/javascript/reference/geocoder#GeocoderResult})
 * @property {Array<Number>} location The `[ lat, lng ]`
 * @property {Boolean} is_bus_station Wether this `Store` is a `bus station` or not (according to its [`types`]{@link https://developers.google.com/maps/documentation/geocoding/intro#Types})
 * @property {Array<string>} types The `Store`' `types` (See {@link https://developers.google.com/maps/documentation/geocoding/intro#Types})
 * @property {Date} created_at_ds
 * @property {Date} updated_at_ds
*/
class Store {
  static get MAX_DISTANCE()               { return MAX_DISTANCE }

  /**
   * Returns the `nearest` `stores` given a `lat/lng` inside a `radius`
   * @async
   *
   * @param {Array<Number> | Number} latitude The `position` (`[ lat, lng ]`) or the `latitude`
   * @param {Number} longitude The `longitude` or `radius` if `latitude` is an `Array`
   * @param {Number} [radius = MAX_DISTANCE] The `radius` in `meters` (default [`MAX_DISTANCE`]{@link MAX_DISTANCE})
   * @param {Object} [params] Extra query params
   * @param {Number} params.limit
   *
   * @return {Array<Promise<Store>>} The nearest `stores`
  */
  static getNearests(latitude, longitude, radius = MAX_DISTANCE, params = {}) {
    const { position, maxDistance } = Store
      .getNearestParams(latitude, longitude, radius)

    const filterParams = {
      location: {
        $near         : position,
        $maxDistance  : parseFloat((maxDistance / 100 / 111.12).toFixed(5))
      }
    }

    const query = this.find(filterParams)

    if (params.limit)
      query.limit(parseInt(params.limit))

    return query
  }

  /**
   * Returns the `nearest` params
   *
   * @param {Array<Number> | Number} latitude The `position` (`[ lat, lng ]`) or the `latitude`
   * @param {Number} longitude The `longitude` or `radius` if `latitude` is an `Array`
   * @param {Number} [radius = MAX_DISTANCE] The `radius` in `meters` (default [`MAX_DISTANCE`]{@link MAX_DISTANCE})
   *
   * @return {Object} The `nearest` params
  */
  static getNearestParams(latitude, longitude, radius = MAX_DISTANCE) {
    let position = [ longitude, latitude ]
    let maxDistance = radius

    if (latitude instanceof Array) {
      position = [ ...latitude ]

      if (longitude)
        maxDistance = longitude
    }

    return { position, maxDistance }
  }
}

schema
  .virtual('formattedAddress')
  .get(function() {
    const streets = [
      this.street,
      this.street2,
      this.street3
    ]
      .filter(s => s && s != '')

    const address = `${streets.join(', ')} - ${this.postalCode}, ${this.city}`

    return address
  })

schema
  .virtual('isOpen')
  .get(function() {
    let isOpen = false

    if (this && this.todayOpen)
      isOpen = this.todayOpen.toLowerCase() != 'gesloten'

    return isOpen
  })

schema.loadClass(Store)

module.exports = mongoose.model('Store', schema)