Property = require('app/models/property')
Color    = require('./color')

class Position
  constructor: (@angle = 0) ->

  toString: ->
    "#{@angle}deg"

class ColorStop
  constructor: (@color, @length) ->
    @color or= new Color

  toString: ->
    if @length
      "#{@color} #{@length}%"
    else
      "#{@color}"

class BackgroundImage extends Property


class LinearGradient extends BackgroundImage
  constructor: (@position = new Position, @stops = []) ->

  toString: ->
    "-webkit-linear-gradient(#{[@position, @stops...].join(',')})"

class URL extends BackgroundImage
  constructor: (@url) ->

  toString: ->
    "url('#{@url}')"

module.exports = BackgroundImage
module.exports.LinearGradient = LinearGradient
module.exports.URL = URL
module.exports.Position = Position
module.exports.ColorStop = ColorStop