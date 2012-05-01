Property = require('app/models/property')
Color    = require('./color')

class Position extends Property
  id: "#{module.id}.Position"

  constructor: (@angle = 0) ->

  toString: ->
    "#{@angle}deg"

  toValue: -> @angle

class ColorStop extends Property
  id: "#{module.id}.ColorStop"

  constructor: (@color, @length) ->
    @color or= new Color.Black

  toString: ->
    if @length
      "#{@color} #{@length}%"
    else
      "#{@color}"

  toValue: ->
    [@color, @length]

class BackgroundImage extends Property
  id: "#{module.id}.BackgroundImage"

class LinearGradient extends BackgroundImage
  id: "#{module.id}.LinearGradient"

  constructor: (@position = new Position, @stops = []) ->

  toString: ->
    stops = @stops.sort((a, b) -> a.length - b.length)
    "-webkit-linear-gradient(#{[@position, stops...].join(', ')})"

  toDisplayString: ->
    stops = @stops.sort((a, b) -> a.length - b.length)
    "linear-gradient(#{[@position, stops...].join(', ')})"

  toValue: ->
    [@position, @stops]

  addStop: (stop) ->
    @stops.push(stop)

  removeStop: (stop) ->
    index = @stops.indexOf(stop)
    @stops.splice(index, 1)

class URL extends BackgroundImage
  id: "#{module.id}.URL"

  constructor: (@url) ->

  toString: ->
    "url('#{@url or ''}')"

  toValue: -> @url

class Background
  id: module.id

  constructor: (@color, @images = []) ->

  toString: ->
    "#{@color} #{@images}"

  toValue: ->
    [@color, @images]

module.exports                 = Background
module.exports.BackgroundImage = BackgroundImage
module.exports.LinearGradient  = LinearGradient
module.exports.URL             = URL
module.exports.Position        = Position
module.exports.ColorStop       = ColorStop
module.exports.Color           = Color