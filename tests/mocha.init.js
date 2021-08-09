/* eslint-disable require-jsdoc */
'use strict'

require('module-alias/register')
require('dotenv').config()

const mongoose = require('mongoose')

const chai = require('chai')
const { spawn } = require('cross-spawn')

let slsOfflineProcess
let isDone = false

global.chai = chai
global.expect = chai.expect

initChaiPlugins()

before(function (done) {
  console.warn('[Serverless Offline Initialization] Start')

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URL_TEST, function (err) {
      if (err) throw err

      return clearCollections()
    })
  }
  else
    return clearCollections()

  this.timeout(45000)

  startSlsOffline(function (e) {
    if (!isDone) {
      isDone = true

      if (e)
        return done(e)

      console.warn('[Serverless Offline Initialization] Done')

      done()
    }
  })
})

after(function () {
  console.warn('[Serverless Offline Shutdown] Start')

  stopSlsOffline()

  mongoose.disconnect()

  console.warn('[Serverless Offline Shutdown] Done')
})

// Helper functions

function initChaiPlugins() {
  chai
    .use(require('chai-shallow-deep-equal'))
    .use(require('chai-as-promised'))
}

function clearCollections() {
  for (var collection in mongoose.connection.collections)
    mongoose.connection.collections[collection].remove(function() {})

  // return done()
}

function startSlsOffline(done) {
  slsOfflineProcess = spawn('sls', [
    'offline',
    'start',
    '--apiKey',
    'api-key',
    '--skipCacheInvalidation',
    `--port ${process.env.LOCAL_PORT}`
  ])

  console.warn(`[Serverless Offline Start] PID: ${slsOfflineProcess.pid}`)

  slsOfflineProcess.stdout.on('data', data => {
    console.warn('[Serverless Offline Start]', data.toString().trim())

    if (data.toString().includes('[HTTP] server ready')) {
      console.warn('[Serverless Offline Start]', data.toString().trim())

      done()
    }
  })

  slsOfflineProcess.stderr.on('data', errData => {
    console.warn('[Serverless Offline Start]', errData.toString())

    done(errData)
  })
}

function stopSlsOffline() {
  slsOfflineProcess.kill()

  console.warn('[Serverless Offline Shutdown] Stopped')
}