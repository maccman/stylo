class KeyBindings extends Spine.Module
  @include Spine.Log

  mapping:
    8:   'backspace'
    37:  'leftArrow'
    38:  'upArrow'
    39:  'rightArrow'
    40:  'downArrow'
    46:  'backspace'
    65:  'aKey'
    67:  'cKey'
    68:  'dKey'
    83:  'sKey'
    86:  'vKey'
    187: 'plusKey'
    189: 'minusKey'

  constructor: (@stage) ->
    $(document).bind('keydown', @keypress)

  keypress: (e) =>
    # Disable keyboard shortcuts in inputs
    return if 'value' of e.target
    @[@mapping[e.which]]?(e)

  backspace: (e) ->
    e.preventDefault()
    @stage.removeSelected()

  leftArrow: (e) ->
    e.preventDefault()
    amount = -1
    amount *= 5 if e.shiftKey
    @stage.selection.set('moveBy', left: amount, top: 0)

  upArrow: (e) ->
    e.preventDefault()
    amount = -1
    amount *= 5 if e.shiftKey
    @stage.selection.set('moveBy', left: 0, top: amount)

  rightArrow: (e) ->
    e.preventDefault()
    amount = 1
    amount *= 5 if e.shiftKey
    @stage.selection.set('moveBy', left: amount, top: 0)

  downArrow: (e) ->
    e.preventDefault()
    amount = 1
    amount *= 5 if e.shiftKey
    @stage.selection.set('moveBy', left: 0, top: amount)

  aKey: (e) ->
    return unless e.metaKey
    e.preventDefault()
    @stage.selectAll()

  dKey: (e) ->
    return unless e.metaKey
    e.preventDefault()
    @stage.selection.clear() if e.metaKey

  sKey: (e) ->
    return unless e.metaKey
    e.preventDefault()
    @log('save')

  plusKey: (e) ->
    return unless e.metaKey
    e.preventDefault()
    @log('zoomIn')

  minusKey: (e) ->
    return unless e.metaKey
    e.preventDefault()
    @log('zoomOut')

  cKey: (e) ->
    return unless e.metaKey
    @stage.clipboard.copyInternal()

  vKey: (e) ->
    return unless e.metaKey
    @stage.clipboard.pasteInternal()

module.exports = KeyBindings