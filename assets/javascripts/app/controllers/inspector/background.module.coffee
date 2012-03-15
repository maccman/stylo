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
    throw 'stage required' unless @stage
    @stage.selection.bind 'change', @render

  render: =>
    @background = {}

    for style in @styles
      @background[style] = @stage.selection.get(style)

    @html JST['app/views/inspector/background'](this)

module.exports = Background