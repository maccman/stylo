Rectangle = require('./rectangle')

class Text extends Rectangle
  className: 'text'
  id: module.id

  events:
    'dblclick': 'startEditing'

  startEditing: ->
    @el.attr('contenteditable', true)

  stopEditing: ->
    @el.removeAttr('contenteditable')

  selected: (bool) ->
    super
    @stopEditing() if bool is false

  text: (text) ->
    @el.text(text) if text?
    @el.text()

  toValue: ->
    result = @properties
    result.text = @text()
    result

module.exports = Text