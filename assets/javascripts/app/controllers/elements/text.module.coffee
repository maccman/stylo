Color     = require('app/models/properties/color')
Rectangle = require('./rectangle')

class Text extends Rectangle
  className: 'text'
  id: module.id

  events:
    'dblclick': 'startEditing'
    'dblclick .thumb.br': 'fitToText'

  textDefaults: ->
    result =
      height: 30
      fontSize: 18
      backgroundColor: new Color.Transparent

  constructor: (attrs = {}) ->
    super

    @set(@textDefaults())
    @text(attrs.text)

  startEditing: ->
    return if @editing
    @editing = true

    # We don't want the element to be
    # resizable, or draggable
    @resizing.toggle(false)
    @el.removeClass('selected')
    @el.addClass('editing')
    @el.css(height: 'auto')

    # Enable text editing and select text
    @el.attr('contenteditable', true)
    @el.focus()
    document.execCommand('selectAll', false, null)

  stopEditing: ->
    return unless @editing
    @editing = false

    @el.blur()
    @el.removeAttr('contenteditable')
    @el.scrollTop(0)
    @el.addClass('selected')
    @el.removeClass('editing')
    @set(height: @el.outerHeight())

    # Remove the element if empty
    @remove() unless @text()

  toggleSelect: ->
    return if @editing
    super

  setSelected: (bool) ->
    @stopEditing() unless bool
    super

  fitToText: ->
    @el.css(width: 'auto', height: 'auto')
    @set(
      width:  @el.outerWidth(),
      height: @el.outerHeight()
    )

  text: (text) ->
    @el.text(text) if text?
    @el.text()

  toValue: ->
    result = super
    result.text = @text()
    result

module.exports = Text