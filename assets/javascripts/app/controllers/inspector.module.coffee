Background = require('./inspector/background')
Border     = require('./inspector/border')
Opacity    = require('./inspector/opacity')

class Inspector extends Spine.Controller
  className: 'inspector'

  constructor: ->
    super
    @stage.selection.bind 'change', @render
    @render()

  render: =>
    @el.empty()
    @append(new Background(stage: @stage))
    @append(new Border(stage: @stage))
    @append(new Opacity(stage: @stage))

module.exports = Inspector