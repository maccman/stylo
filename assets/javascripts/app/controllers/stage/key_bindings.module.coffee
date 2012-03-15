class KeyBindings
  mapping:
    8: 'backspace'
    46: 'backspace'
    37: 'leftArrow'
    38: 'upArrow'
    39: 'rightArrow'
    40: 'downArrow'

  constructor: (@stage) ->
    $(document).bind('keydown', @keypress)

  keypress: (e) =>
    @[@mapping[e.which]]?(e)

  backspace: (e) ->
    e.preventDefault()
    @stage.removeSelected()

  leftArrow: (e) ->
    amount = -1
    amount *= 5 if e.shiftKey
    @stage.selection.set('move', left: amount, top: 0)

  upArrow: (e) ->
    amount = -1
    amount *= 5 if e.shiftKey
    @stage.selection.set('move', left: 0, top: amount)

  rightArrow: (e) ->
    amount = 1
    amount *= 5 if e.shiftKey
    @stage.selection.set('move', left: amount, top: 0)

  downArrow: (e) ->
    amount = 1
    amount *= 5 if e.shiftKey
    @stage.selection.set('move', left: 0, top: 1)

module.exports = KeyBindings