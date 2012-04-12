class Opacity extends Spine.Controller
  className: 'opacity'

  events:
    'change input': 'change'

  elements:
    'input': '$inputs'

  render: =>
    @disabled = not @stage.selection.isAny()
    @opacity  = @stage.selection.get('opacity') ? 1

    @html JST['app/views/inspector/opacity'](this)

  change: (e) ->
    val = parseFloat($(e.currentTarget).val())
    val = Math.round(val * 100) / 100

    @stage.selection.set('opacity', val)
    @$inputs.val(val)

module.exports = Opacity