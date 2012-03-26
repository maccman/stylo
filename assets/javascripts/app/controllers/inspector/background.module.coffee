ColorPicker = require('lib/color_picker')

class List

class Background extends Spine.Controller
  className: 'background'

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

    @el.empty()
    @el.append('<h3>Background</h3>')


module.exports = Background