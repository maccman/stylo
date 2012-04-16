Shadow         = require('app/models/properties/shadow')
ColorPicker    = require('lib/color_picker')
PositionPicker = require('lib/position_picker')

class TextShadow extends Spine.Controller
  className: 'textShadow'

  events:
    'change input': 'change'

  elements:
    'input[name=x]': '$x'
    'input[name=y]': '$y'
    'input[name=blur]': '$blur'

  constructor: ->
    super

    @$position = new PositionPicker

    @$position.bind 'change', (position) =>
      @shadow.x = position.left
      @shadow.y = position.top
      @set()
      @update()

    @$color = new ColorPicker.Preview
    @$color.bind 'change', => @change()

    @html JST['app/views/inspector/text_shadow'](@)
    @$('input[type=color]').replaceWith(@$color.el)
    @$('input[type=position]').replaceWith(@$position.el)

  render: ->
    @disabled = not @stage.selection.isAny()

    @shadow = @stage.selection.get('textShadow')
    @shadow or= new Shadow

    @update()

    this

  update: ->
    @$('input').attr('disabled', @disabled)

    @$x.val @shadow.x
    @$y.val @shadow.y
    @$blur.val @shadow.blur
    @$color.val @shadow.color

  change: ->
    @shadow.x     = parseFloat(@$x.val())
    @shadow.y     = parseFloat(@$y.val())
    @shadow.blur  = parseFloat(@$blur.val())
    @shadow.color = @$color.val()

    @$position.change(
      left: @shadow.x,
      top: @shadow.y
    )

    @set()
    @update()

  set: ->
    # Text shadows need a blur
    # to be formatted correctly
    @shadow.blur ?= 0

    @stage.history.record('textShadow')
    @stage.selection.set('textShadow', @shadow)

  release: ->
    @$position?.release()
    @$color?.release()
    super

module.exports =  TextShadow