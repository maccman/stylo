class Dimensions extends Spine.Controller
  className: 'dimensions'

  events:
    'change input': 'change'

  elements:
    'input': '$inputs'
    'input[name=width]': '$width'
    'input[name=height]': '$height'

  constructor: ->
    super
    throw 'stage required' unless @stage
    @render()

  render: =>
    @disabled = not @stage.selection.isAny()

    @html JST['app/views/inspector/dimensions'](this)
    @update()

    @el.toggleClass('disabled', @disabled)
    @$inputs.attr('disabled', @disabled)

  update: ->
    @$width.val(@stage.selection.get('width'))
    @$height.val(@stage.selection.get('width'))

  change: (e) ->
    @stage.selection.set('width',  parseInt(@$width.val(), 10))
    @stage.selection.set('height', parseInt(@$height.val(), 10))

module.exports = Dimensions