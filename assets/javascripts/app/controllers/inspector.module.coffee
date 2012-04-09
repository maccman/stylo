Background    = require('./inspector/background')
Border        = require('./inspector/border')
BorderRadius  = require('./inspector/border_radius')
Opacity       = require('./inspector/opacity')
BoxShadow     = require('./inspector/box_shadow')
TextShadow    = require('./inspector/text_shadow')

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
    @append(new BorderRadius(stage: @stage))
    @append(new BoxShadow(stage: @stage))
    @append(new Opacity(stage: @stage))
    # @append(new TextShadow(stage: @stage))

module.exports = Inspector