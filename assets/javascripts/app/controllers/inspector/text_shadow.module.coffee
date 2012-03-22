Shadow         = require('app/models/properties/shadow')
ColorPicker    = require('lib/color_picker')
PositionPicker = require('lib/position_picker')

class TextShadow extends Spine.Controller
  className: 'textShadow'

  events:
    'change input': 'change'
    'click .preview': 'showColorPicker'

  elements:
    'input[name=x]': '$x'
    'input[name=y]': '$y'
    'input[name=blur]': '$blur'
    '.preview .inner': '$preview'

  constructor: ->
    super

    @positionPicker = new PositionPicker

    @positionPicker.bind 'change', (position) =>
      @shadow.x = position.left
      @shadow.y = position.top
      @stage.selection.set('textShadow', @shadow.toString())
      @update()

    @render()

  render: ->
    @disabled = not @stage.selection.isAny()

    @shadow = @stage.selection.get('textShadow')
    @shadow = Shadow.fromString(@shadow)[0] if @shadow
    @shadow or= new Shadow

    @html JST['app/views/inspector/text_shadow'](@)

    @$('input').attr('disabled', @disabled)
    @$preview.css('background', @shadow?.color.toString())

    @positionPicker.disabled = @disabled
    @positionPicker.change(
      left: @shadow.x, top: @shadow.y
    )
    @append @positionPicker

  update: ->
    @$('input').attr('disabled', @disabled)
    @$preview.css('background', @shadow?.color.toString())

    @$x.val @shadow.x
    @$y.val @shadow.y
    @$blur.val @shadow.blur

  showColorPicker: (e) ->
    return if @disabled

    color  = @shadow?.color
    picker = new ColorPicker(color: color)

    picker.bind 'change', (color) =>
      @shadow.color = color
      @change()
      @update()

    picker.bind 'cancel', =>
      @shadow.color = color
      @change()
      @update()

    picker.open(@$preview.offset())

  change: ->
    @shadow.x    = parseFloat(@$x.val())
    @shadow.y    = parseFloat(@$y.val())
    @shadow.blur = parseFloat(@$blur.val())

    @stage.selection.set('textShadow', @shadow.toString())

module.exports =  TextShadow