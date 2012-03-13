Stage  = require('./controllers/stage')
Header = require('./controllers/header')

class App extends Spine.Controller
  className: 'app'

  constructor: ->
    super
    @stage  = new Stage
    @header = new Header(stage: @stage)
    @append(@header, @stage)

module.exports = App