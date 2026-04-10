module.exports = {
  require: [
    '@babel/register',
    'coffeescript/register',
    'coffee-react/register',
    './test/mocha-preload.js'
  ]
}