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

    @positionPicker = new PositionPicker

    @positionPicker.bind 'change', (position) =>
      @shadow.x = position.left
      @shadow.y = position.top
      @stage.selection.set('textShadow', @shadow)
      @update()

    @$color = new ColorPicker.Preview
    @$color.bind 'change', => @change()

  render: ->
    @disabled = not @stage.selection.isAny()

    @shadow = @stage.selection.get('textShadow')
    @shadow or= new Shadow

    @html JST['app/views/inspector/text_shadow'](@)
    @$('input[type=color]').replaceWith(@$color.el)
    @append @positionPicker

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

    @positionPicker.change(
      left: @shadow.x,
      top: @shadow.y
    )

    @stage.history.record('textShadow')
    @stage.selection.set('textShadow', @shadow)
    @update()

  release: ->
    @positionPicker?.release()
    super

module.exports =  TextShadow