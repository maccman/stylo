ColorPicker = require('lib/color_picker')

class Background extends Spine.Controller
  className: 'background'

  elements:
    '.preview .inner': '$preview'
    'select': '$select'
    '.option': '$options'
    '.option.color': '$color'

  events:
    'click .preview': 'showColorPicker'
    'change select': 'select'

  styles: [
    'background',
    'backgroundColor',
    'backgroundImage',
    'backgroundRepeat',
    'backgroundSize'
  ]

  constructor: ->
    super
    @render()

  render: =>
    @values = {}

    for style in @styles
      @values[style] = @stage.selection.get(style)

    @html JST['app/views/inspector/background'](this)

    @$options.hide()

    # TODO - check bgimg

    if @values.backgroundColor
      @$select.val('color').change()
      @$preview.css(backgroundColor: @values.backgroundColor)

  showColorPicker: (e) ->
    color  = @stage.selection.get('backgroundColor')
    if color
      color = ColorPicker.Color.fromString(color)
      color = false if color.isTransparent()

    picker = new ColorPicker(color: color)

    picker.bind 'change', (color) =>
      @stage.selection.set('background', color.toString())
      @render()

    picker.bind 'cancel', =>
      @stage.selection.set('background', color.toString())
      @render()

    picker.open(@$preview.offset())

  select: ->
    @$options.hide()
    switch @$select.val()
      when 'color'
        @$color.show()
      when 'none'
        @stage.selection.set('background', 'none')

module.exports = Background