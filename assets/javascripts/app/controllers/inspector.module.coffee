Background    = require('./inspector/background')
Border        = require('./inspector/border')
BorderRadius  = require('./inspector/border_radius')
Opacity       = require('./inspector/opacity')
BoxShadow     = require('./inspector/box_shadow')
TextShadow    = require('./inspector/text_shadow')
Dimensions    = require('./inspector/dimensions')
TextPosition  = require('./inspector/text_position')
Utils         = require('lib/utils')

class TextInspector extends Spine.Controller
  className: 'textInspector'

  constructor: ->
    super
    @append(@textPosition = new TextPosition(stage: @stage))

  render: ->
    @textPosition.render()
    this

  release: ->
    @textPosition.release()
    super

class DisplayInspector extends Spine.Controller
  className: 'displayInspector'

  constructor: ->
    super

    @append(@dimensions   = new Dimensions(stage: @stage))
    @append(@background   = new Background(stage: @stage))
    @append(@border       = new Border(stage: @stage))
    @append(@borderRadius = new BorderRadius(stage: @stage))
    @append(@boxShadow    = new BoxShadow(stage: @stage))
    @append(@opacity      = new Opacity(stage: @stage))

  render: ->
    @dimensions.render()
    @background.render()
    @border.render()
    @borderRadius.render()
    @boxShadow.render()
    @opacity.render()
    this

  release: ->
    @dimensions?.release()
    @background?.release()
    @border?.release()
    @borderRadius?.release()
    @boxShadow?.release()
    @opacity?.release()

class Inspector extends Spine.Controller
  className: 'inspector'

  events:
    'click header [data-type]':  'changeInspector'

  elements:
    'header div': '$headers'

  constructor: ->
    super

    @append(JST['app/views/inspector']())
    @append(@textInspector    = new TextInspector(stage: @stage))
    @append(@displayInspector = new DisplayInspector(stage: @stage))

    # Make sure only one inspector is active
    @manager = new Spine.Manager
    @manager.add(@textInspector, @displayInspector)
    @manager.bind 'change', (controller) =>
      @$headers.removeClass('active')
      name = controller.constructor.name
      @$headers.filter("[data-type=#{name}]").addClass('active')

    # Display the display inspector by default
    @displayInspector.active()

    # We can increase performance dramatically by using
    # requestAnimationFrame and rendering async
    @stage.selection.bind 'change', @paint

    @render()

  paint: =>
    return if @rendering
    @rendering = true
    Utils.requestAnimationFrame(@render)

  render: =>
    # Do update in one paint by hiding
    # before rendering inspectors
    @el.hide()

    # Render the currently active inspector
    @manager.current.render()

    @el.show()
    @rendering = false
    this

  changeInspector: (e) ->
    name = $(e.target).data('type')

    if name is 'DisplayInspector'
      @displayInspector.render()
      @displayInspector.active()

    else if name is 'TextInspector'
      @textInspector.render()
      @textInspector.active()

  release: ->
    @textInspector.release()
    @displayInspector.release()
    @stage.selection.unbind 'change', @paint
    super

module.exports = Inspector