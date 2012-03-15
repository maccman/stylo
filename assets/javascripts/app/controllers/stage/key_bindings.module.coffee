class KeyBindings
  mapping:
    8: 'backspace'
    46: 'backspace'

  constructor: (@stage) ->
    $(document).bind('keydown', @keypress)

  keypress: (e) =>
    @[@mapping[e.which]]?(e)

  backspace: (e) ->
    e.preventDefault()
    @stage.removeSelected()

module.exports = KeyBindings