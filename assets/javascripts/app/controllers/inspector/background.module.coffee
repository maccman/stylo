ColorPicker = require('lib/color_picker')

class Background extends Spine.Controller
  className: 'background'

  elements:
    '.preview .inner': '$preview'

  events:
    'click .preview': 'showColorPicker'

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

    if @values.background
      @$preview.css(background: @values.background)

  showColorPicker: ->
    ColorPicker.show()

module.exports = Background