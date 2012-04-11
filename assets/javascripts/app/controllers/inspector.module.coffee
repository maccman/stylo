Background    = require('./inspector/background')
Border        = require('./inspector/border')
BorderRadius  = require('./inspector/border_radius')
Opacity       = require('./inspector/opacity')
BoxShadow     = require('./inspector/box_shadow')
TextShadow    = require('./inspector/text_shadow')
Dimensions    = require('./inspector/dimensions')

class Inspector extends Spine.Controller
  className: 'inspector'

  constructor: ->
    super
    @stage.selection.bind 'change', => setTimeout(@render)
    @render()

  render: =>
    @el.hide()
    @el.empty()
    @sweep()
    @append(@dimensions   = new Dimensions(stage: @stage))
    @append(@background   = new Background(stage: @stage))
    @append(@border       = new Border(stage: @stage))
    @append(@borderRadius = new BorderRadius(stage: @stage))
    @append(@boxShadow    = new BoxShadow(stage: @stage))
    @append(@opacity      = new Opacity(stage: @stage))
    # @append(@textShadow = new TextShadow(stage: @stage))
    @el.show()

  sweep: ->
    @dimensions?.release()
    @background?.release()
    @border?.release()
    @borderRadius?.release()
    @boxShadow?.release()
    @opacity?.release()

  release: ->
    @stage.selection.unbind 'change', @render
    super

module.exports = Inspector