class Opacity extends Spine.Controller
  className: 'opacity'

  events:
    'change input': 'change'

  constructor: ->
    super
    throw 'stage required' unless @stage
    @render()

  render: =>
    @disabled = not @stage.selection.isAny()
    @opacity  = @stage.selection.get('opacity')
    if @opacity
      @opacity = parseFloat(@opacity).toPrecision(2)

    @html JST['app/views/inspector/opacity'](this)

  change: (e) ->
    val = $(e.currentTarget).val()
    @stage.selection.set('opacity', val)
    @$('input').val(val)

module.exports = Opacity