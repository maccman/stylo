class Dimensions extends Spine.Controller
  className: 'dimensions'

  events:
    'change input': 'change'

  elements:
    'input': '$inputs'
    'input[name=width]': '$width'
    'input[name=height]': '$height'
    'input[name=x]': '$x'
    'input[name=y]': '$y'

  constructor: ->
    super
    throw 'stage required' unless @stage
    $(document).bind 'resize.element move.element', @update
    @render()

  render: =>
    @disabled = not @stage.selection.isSingle()

    @html JST['app/views/inspector/dimensions'](this)
    @update()

    @el.toggleClass('disabled', @disabled)
    @$inputs.attr('disabled', @disabled)

  update: =>
    @disabled = not @stage.selection.isSingle()
    return if @disabled

    @$width.val(@stage.selection.get('width'))
    @$height.val(@stage.selection.get('height'))
    @$x.val(@stage.selection.get('left'))
    @$y.val(@stage.selection.get('top'))

  change: (e) ->
    @stage.selection.set('width',  parseInt(@$width.val(), 10))
    @stage.selection.set('height', parseInt(@$height.val(), 10))
    @stage.selection.set('left',   parseInt(@$x.val(), 10))
    @stage.selection.set('top',    parseInt(@$y.val(), 10))

module.exports = Dimensions