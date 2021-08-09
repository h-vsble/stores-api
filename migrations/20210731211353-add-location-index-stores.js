module.exports = {
  async up(db) {
    await db
      .collection('stores')
      .createIndex({
        location: '2d'
      })
  },

  async down(db) {
    await db
      .collection('stores')
      .dropIndex('location')
  }
}
