Rectangle = require('./rectangle')

class Text extends Rectangle
  className: 'text'

  events:
    'dblclick': 'startEditing'

  startEditing: ->
    @el.attr('contenteditable', true)

  stopEditing: ->
    @el.removeAttr('contenteditable')

  selected: (bool) ->
    super
    @stopEditing() if bool is false

module.exports = Text