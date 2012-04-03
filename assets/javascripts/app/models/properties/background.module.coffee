Property = require('app/models/property')
Color    = require('./color')

class Position
  constructor: (@angle = 0) ->

  toString: ->
    "#{@angle}deg"

class ColorStop
  constructor: (@color, @length) ->
    @color or= new Color.Black

  toString: ->
    if @length
      "#{@color} #{@length}%"
    else
      "#{@color}"

class BackgroundImage extends Property

class LinearGradient extends BackgroundImage
  constructor: (@position = new Position, @stops = []) ->

  toString: ->
    stops = @stops.sort((a, b) -> a.length - b.length)
    "-webkit-linear-gradient(#{[@position, stops...].join(',')})"

  toDisplayString: ->
    stops = @stops.sort((a, b) -> a.length - b.length)
    "linear-gradient(#{[@position, stops...].join(', ')})"

  addStop: (stop) ->
    @stops.push(stop)

  removeStop: (stop) ->
    index = @stops.indexOf(stop)
    @stops.splice(index, 1)

class URL extends BackgroundImage
  constructor: (@url) ->

  toString: ->
    "url('#{@url}')"

class Background
  constructor: (@color, @images = []) ->

  toString: ->
    "#{@color} #{@images}"

module.exports                 = Background
module.exports.BackgroundImage = BackgroundImage
module.exports.LinearGradient  = LinearGradient
module.exports.URL             = URL
module.exports.Position        = Position
module.exports.ColorStop       = ColorStop