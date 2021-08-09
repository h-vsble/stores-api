'use strict'

module.exports = {
  'allow-uncaught': false,
  'check-leaks': false,
  color: true,
  diff: true,
  exit: false, // could be expressed as "'no-exit': true"
  extension: ['js'],
  // fgrep: something, // fgrep and grep are mutually exclusive
  // file: ['/path/to/some/file', '/path/to/some/other/file'],
  'inline-diffs': false,
  jobs: 1,
  parallel: false,
  recursive: false,
  reporter: 'spec',
  retries: 1,
  slow: '75',
  sort: false,
  spec: ['tests/mocha.init', 'tests/**/*.test.js'], // the positional arguments!
  timeout: '2000', // same as "timeout: '2s'"
  'trace-warnings': true, // node flags ok
  ui: 'bdd',
  'watch-files': ['models/**/*.js', 'functions/**/*.js', 'configs/**/*.js', 'tests/**/*.js']
}