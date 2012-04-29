Element = require('../element')

class Input extends Element
  tag: 'input'

  # Stub out unused methods
  defaults: -> {}
  text: ->
  startEditing: ->
  stopEditing: ->

class Text extends Input
  attrs:
    type: 'text'

class Textarea extends Input
  tag: 'textarea'

class CheckBox extends Input
  attrs:
    type: 'checkbox'

module.exports =
  Text: Text
  Textarea: Textarea
  CheckBox: CheckBox