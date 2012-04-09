Collection     = require('lib/collection')
Shadow         = require('app/models/properties/shadow')
ColorPicker    = require('lib/color_picker')
PositionPicker = require('lib/position_picker')
Popup          = require('lib/popup')

class BoxShadowEdit extends Spine.Controller
  className: 'edit'

  events:
    'change input': 'inputChange'

  elements:
    'input[name=x]': '$x'
    'input[name=y]': '$y'
    'input[name=blur]': '$blur'

  constructor: ->
    super
    @change(@shadow)

  change: (@shadow = new Shadow) ->
    @render()

  render: ->
    @html JST['app/views/inspector/box_shadow'](@)

    @colorInput = new ColorPicker.Preview(
      color: @shadow.color
      el: @$('.colorInput')
    )

    @colorInput.bind 'change', (color) =>
      @shadow.color.set color
      @trigger 'change', @shadow
      @update()

    @positionPicker = new PositionPicker(
      el: @$('.positionInput')
    )

    @positionPicker.bind 'change', (position) =>
      @shadow.x = position.left
      @shadow.y = position.top
      @trigger 'change', @shadow
      @update()

    @update()

  update: ->
    @$('input').attr('disabled', @disabled)

    @positionPicker.disabled = @disabled

    @positionPicker.change(
      left: @shadow.x, top: @shadow.y
    )

    @$x.val @shadow.x
    @$y.val @shadow.y
    @$blur.val @shadow.blur

  inputChange: (e) ->
    @shadow.x    = parseFloat(@$x.val())
    @shadow.y    = parseFloat(@$y.val())
    @shadow.blur = parseFloat(@$blur.val()) or 0

    @trigger 'change', @shadow
    @update()

class BoxShadowList extends Spine.Controller
  className: 'list'

  events:
    'click .item': 'click'
    'click button.plus': 'addShadow'
    'click button.minus': 'removeShadow'

  constructor: ->
    super
    throw 'shadows required' unless @shadows
    @shadows.change @render
    @render()

  render: =>
    @html JST['app/views/inspector/box_shadow/list'](@)

    @$('.item').removeClass('selected')
    selected = @$('.item').get(@shadows.indexOf(@current))
    $(selected).addClass('selected')

  click: (e) ->
    @current = @shadows[$(e.currentTarget).index()]
    @trigger 'change', @current
    @render()
    false

  addShadow: ->
    @shadows.push(@current = new Shadow(blur: 3))
    @trigger 'change', @current
    false

  removeShadow: ->
    @shadows.remove(@current)
    @current = @shadows.first()
    @trigger 'change', @current
    false

class BoxShadow extends Spine.Controller
  className: 'boxShadow'

  constructor: ->
    super
    @render()

  render: ->
    @disabled = not @stage.selection.isAny()
    @el.toggleClass('disabled', @disabled)

    @shadows  = @stage.selection.get('boxShadow')
    @shadows = new Collection(@shadows)
    @current = @shadows.first()
    @shadows.change @set

    @el.empty()

    # BoxShadow List

    @el.append($('<h3/>').text('Shadow'))

    @list = new BoxShadowList
      current: @current
      shadows: @shadows

    @list.bind 'change', (@current) =>
      @edit.change @current

    @append @list

    # BoxShadow Edit

    @edit = new BoxShadowEdit(shadow: @current)
    @edit.bind 'change', => @shadows.change(arguments...)
    @append @edit

  set: (shadow) =>
    if shadow
      @shadows.push(shadow) unless @shadows.include(shadow)

    @stage.selection.set('boxShadow', @shadows.valueOf())

module.exports = BoxShadow