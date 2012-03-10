Stage = require('app/controllers/stage')

class App extends Spine.Controller
  className: 'app'

  constructor: ->
    super
    @append(@stage = new Stage)

module.exports = App