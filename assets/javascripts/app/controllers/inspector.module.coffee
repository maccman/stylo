Background    = require('./inspector/background')
Border        = require('./inspector/border')
BorderRadius  = require('./inspector/border_radius')
Opacity       = require('./inspector/opacity')
BoxShadow     = require('./inspector/box_shadow')
TextShadow    = require('./inspector/text_shadow')
Dimensions    = require('./inspector/dimensions')
Utils         = require('lib/utils')

class Inspector extends Spine.Controller
  className: 'inspector'

  constructor: ->
    super

    @dimensions   = new Dimensions(stage: @stage)
    @background   = new Background(stage: @stage)
    @border       = new Border(stage: @stage)
    @borderRadius = new BorderRadius(stage: @stage)
    @boxShadow    = new BoxShadow(stage: @stage)
    @opacity      = new Opacity(stage: @stage)

    # We can increase performance dramatically by using
    # requestAnimationFrame and rendering async
    @stage.selection.bind 'change', => @dirty = true
    @frame()

  frame: =>
    @render() if @dirty
    Utils.requestAnimationFrame(@frame)

  render: =>
    @el.hide()
    @el.empty()

    @append(@dimensions.render())
    @append(@background.render())
    @append(@border.render())
    @append(@borderRadius.render())
    @append(@boxShadow.render())
    @append(@opacity.render())

    @el.show()
    @dirty = false
    this

  release: ->
    @stage.selection.unbind 'change', @render
    super

module.exports = Inspector