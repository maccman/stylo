class Border extends Spine.Controller
  className: 'border'

  styles: [
    'borderColor'
  ]

  constructor: ->
    super
    @render()

  render: =>
    @border = {}

    for style in @styles
      @border[style] = @stage.selection.get(style)

    @html JST['app/views/inspector/border'](this)

module.exports = Border