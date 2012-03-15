class Opacity extends Spine.Controller
  className: 'border'

  constructor: ->
    super
    throw 'stage required' unless @stage
    @stage.selection.bind 'change', @render

  render: =>
    @opacitty = @stage.selection.get('opacity')
    @html JST['app/views/inspector/opacity'](this)

module.exports = Border