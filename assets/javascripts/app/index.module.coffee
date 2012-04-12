Stage     = require('./controllers/stage')
Header    = require('./controllers/header')
Inspector = require('./controllers/inspector')

class App extends Spine.Controller
  className: 'app'

  constructor: ->
    super
    @stage      = new Stage
    @header     = new Header(stage: @stage)
    @inspector  = new Inspector(stage: @stage)

    @append(
      @header.render(),
      @stage.render(),
      @inspector.render()
    )

module.exports = App