Property = require('app/models/property')
Color    = require('./color')

class Shadow extends Property
  id: module.id

  constructor: (properties = {}) ->
    @[k] = v for k, v of properties

    @x      or= 0
    @y      or= 0
    @color  or= new Color.Black(0.3)

  toString: ->
    result = []
    result.push('inset') if @inset
    result.push(@x + 'px')
    result.push(@y + 'px')
    result.push(@blur + 'px') if @blur?
    result.push(@spread + 'px') if @spread?
    result.push(@color.toString())
    result.join(' ')

  toValue: ->
    value =
      x: @x
      y: @y
      color: @color

module.exports = Shadow