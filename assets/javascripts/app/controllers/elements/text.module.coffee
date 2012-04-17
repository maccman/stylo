Color     = require('app/models/properties/color')
Rectangle = require('./rectangle')

class Text extends Rectangle
  className: 'text'
  id: module.id

  events:
    'dblclick .thumb.br': 'fitToText'

  defaults: ->
    result =
      height: 30
      fontSize: 18
      backgroundColor: new Color.Transparent

    $.extend({}, super, result)

  stopEditing: ->
    return unless @editing
    super

    if @text()
      @fitToText()
    else
      # Remove the element if empty
      @remove()

  fitToText: ->
    @el.css(width: 'auto', height: 'auto')
    @set(
      width:  @el.outerWidth(),
      height: @el.outerHeight()
    )

module.exports = Text