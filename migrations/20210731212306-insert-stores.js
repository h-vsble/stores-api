const { stores } = require('../stores.json')

module.exports = {
  async up(db) {
    stores
      .forEach(store => {
        store.latitude = parseFloat(store.latitude)
        store.longitude = parseFloat(store.longitude)
        store.location = [store.longitude, store.latitude]
      })

    await db
      .collection('stores')
      .insertMany(stores)
  },

  async down(db) {
    await db
      .collection('stores')
      .deleteMany({})
  }
}
