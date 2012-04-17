Color       = require('app/models/properties/color')
ColorPicker = require('lib/color_picker')

class Font extends Spine.Controller
  className: 'font'

  elements:
    'input': '$inputs'
    'input[name=size]': '$size'
    'select[name=family]': '$family'

  events:
    'change input': 'change'
    'change select': 'change'

  constructor: ->
    super
    @html JST['app/views/inspector/font'](this)

    @$color = new ColorPicker.Preview
    @$color.bind 'change', => @change()

    @$('input[type=color]').replaceWith(@$color.el)

  render: =>
    @disabled = not @stage.selection.isAny()
    @$color.val(@stage.selection.get('color') or new Color.Black)
    @$size.val(@stage.selection.get('fontSize') ? 12)
    @$family.val(@stage.selection.get('fontFamily'))

  change: (e) ->
    @stage.history.record('font')

    @stage.selection.set('color',       @$color.val())
    @stage.selection.set('fontSize',    parseInt(@$size.val(), 10))
    @stage.selection.set('fontFamily',  @$family.val())

module.exports = Font