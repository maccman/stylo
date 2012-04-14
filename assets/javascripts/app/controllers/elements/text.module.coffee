Rectangle = require('./rectangle')

class Text extends Rectangle
  className: 'text'
  id: module.id

  events:
    'dblclick': 'startEditing'

  startEditing: ->
    return if @editing
    @editing = true
    @log 'startEditing'
    @resizing.toggle(false)
    @el.attr('contenteditable', true)
    @el[0].focus()

  stopEditing: ->
    @editing = false
    @log 'stopEditing'
    @el[0].blur()
    @el.removeAttr('contenteditable')

  selected: (bool) ->
    @stopEditing() unless bool
    super

  text: (text) ->
    @el.text(text) if text?
    @el.text()

  toValue: ->
    result = @properties
    result.text = @text()
    result

module.exports = Text