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
    if bool?
      @_selected = bool
      @el.toggleClass('selected', bool)
      @stopEditing() unless bool
    @_selected

  text: (text) ->
    @el.text(text) if text?
    @el.text()

  toValue: ->
    result = @properties
    result.text = @text()
    result

module.exports = Text