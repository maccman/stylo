class Border extends Spine.Controller
  className: 'border'

  styles: [
    'border',
    'borderTop',
    'borderRight',
    'borderBottom',
    'borderLeft'
  ]

  events:
    'click [data-border]': 'borderClick'
    'change input': 'inputChange'

  current: 'border'

  constructor: ->
    super

    @borders = {}

    # Border list
    # Border Edit
    #   Border style
    #   Border color
    #   Border thickness

    for style in @styles
      @borders[style] = @stage.selection.get(style)

    @render()

  render: =>
    @html JST['app/views/inspector/border'](this)

  change: (@current) ->

  borderClick: (e) ->
    @change($(e.target).data('border'))

  inputChange: (e) ->


module.exports = Border