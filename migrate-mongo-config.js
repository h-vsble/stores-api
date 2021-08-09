require('dotenv').config()

// In this file you can configure migrate-mongo

const uri = process.env.NODE_ENV != 'test' ?
  process.env.MONGODB_URL :
  process.env.MONGODB_URL_TEST

// eslint-disable-next-line no-useless-escape
const databaseName = uri.match(/(?!\/).[^\/]*$/g)[0]
const url = uri.replace(`/${databaseName}`, '')

const config = {
  mongodb: {
    url,
    databaseName,

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: 'migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'mongoMigrations',

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: '.js',

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false
}

module.exports = config