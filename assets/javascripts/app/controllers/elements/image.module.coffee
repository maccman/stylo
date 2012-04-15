Element = require('../element')
Color   = require('app/models/properties/color')

class Image extends Element
  className: 'image'
  id: module.id

  constructor: (attrs = {}) ->
    super
    @setSrc(attrs.src)

  setSrc: (@src) ->
    @set(
      backgroundColor:    new Color.Transparent
      backgroundImage:    "url(#{@src})"
      backgroundSize:     '100% 100%'
      backgroundRepeat:   'no-repeat'
      backgroundPosition: 'center center'
    ) if @src

  toValue: ->
    result = super
    result.src = @src
    result

module.exports = Image