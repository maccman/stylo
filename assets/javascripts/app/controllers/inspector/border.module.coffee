class Border extends Spine.Controller
  className: 'border'

  styles: [
    'borderColor'
  ]

  constructor: ->
    super
    throw 'stage required' unless @stage
    @stage.selection.bind 'change', @render

  render: =>
    @border = {}

    for style in @styles
      @border[style] = @stage.selection.get(style)

    @html JST['app/views/inspector/border'](this)

module.exports = Border