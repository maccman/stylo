class TextPosition extends Spine.Controller
  className: 'textPosition'

  types: [
    'textIndent',
    'lineHeight',
    'letterSpacing',
    'wordSpacing'
  ]

  elements:
    'input[name=textIndent]': '$textIndent'
    'input[name=lineHeight]': '$lineHeight'
    'input[name=letterSpacing]': '$letterSpacing'
    'input[name=wordSpacing]': '$wordSpacing'

  events:
    'change input': 'change'

  constructor: ->
    super
    @html JST['app/views/inspector/text_position'](this)

  render: ->
    @disabled = not @stage.selection.isAny()

    @current = {}

    for type in @types
      value = @stage.selection.get(type)
      @['$' + type].val(value)

  change: ->
    for type in @types
      value = parseInt(@['$' + type].val(), 10)
      @stage.selection.set(type, value)


module.exports = TextPosition