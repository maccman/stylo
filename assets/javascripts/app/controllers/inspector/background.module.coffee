class Background extends Spine.Controller
  className: 'background'

  styles: [
    'backgroundColor',
    'backgroundImage',
    'backgroundRepeat',
    'backgroundSize'
  ]

  constructor: ->
    super
    @render()

  render: =>
    @background = {}

    for style in @styles
      @background[style] = @stage.selection.get(style)

    @html JST['app/views/inspector/background'](this)

module.exports = Background