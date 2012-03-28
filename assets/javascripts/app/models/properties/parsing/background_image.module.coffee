# Use http://lea.verou.me/demos/cssgradientsplease/cssgradient.js
Color = require('./color')

class Position
  @keywords:
    left: 0
    bottom: 90
    right: 180
    top: 270

  @regex: /^(.+)\s+(.+)$/

  @fromRegex: (keywords, angle) ->
    if keywords?
      types = @regex.exec(keywords)
      posh  = @keywords[types[1]] or 0
      posv  = @keywords[types[2]] or 0

      if posv
        posh /= 2
        posv /= 2

      new this(posh + posv)

    else
      new this(angle)

  constructor: (@angle = 0) ->

  toString: ->
    "#{@angle}deg"

class ColorStop
  @regex: ///
    ^(?: # Color stop
      ,?\s*
      (#(?:[0-9a-f]{3,6})|rgba?\((?:[^)]+)\)) # (3) Color
      (?:\s+(-?[0-9]*\.?[0-9]+)%)? # (4) Length
      \s*
    )*
  ///

  @multipleFromString: (str) ->
    matches = []
    while match = @regex.exec(str)
      matches.push(match)
      if regex.lastIndex is match.index
        regex.lastIndex++

    (@fromRegex(match[1], match[2]) for match in matches)

  @fromRegex: (color, length) ->
    color  = Color.fromString(color)
    length = parseFloat(length) or 0
    new this(color, length)

  constructor: (@color, @length) ->

  toString: ->
    if @length
      "#{@color} #{@length}%"
    else
      "#{@color}"

class BackgroundImage
  @multipleFromString: (str) ->
    backgrounds = []

    while str.length
      if bg = LinearGradient.fromString(str)
        backgrounds.push(bg)
        str.replace(LinearGradient.regex, '')
      else if bg = URL.fromString(str)
        backgrounds.push(bg)
        str.replace(URL.regex, '')
      else
        throw 'Invalid image'
      str.replace(/^,?\s*/, '')

    backgrounds

class LinearGradient extends BackgroundImage
  @regex: ///
    ^(?:-webkit-)?linear-gradient\(
      (?: # Position
        (?:
          ((?:top\s+|bottom\s+)?(?:right|left)|(?:right\s+|left\s+)?(?:top|bottom)) # (1)
          |((?:-?[0-9]*\.?[0-9]+)deg|(?:0)) # (2)
        )\s*,
      )?
      (.+) # (3)
    \);?
  ///i

  @fromString: (str) ->
    match = str.match(@regex)
    return unless match

    position = Position.fromRegex(
      match[1], # Keywords
      match[2]  # Angle
    )

    stops = ColorStop.multipleFromString(
      match[3] # CSV colors
    )

    new this(position, stops)

  constructor: (@position = new Position, @stops = []) ->

  toString: ->
    "-webkit-linear-gradient(#{[@position, @stops...].join(',')})"

class URL extends BackgroundImage
  @regex: ///
    ^url\(?:(?:"|')?(.+)\1\)
  ///

  @fromString: (str) ->
    match = str.match(@regex)
    return unless match

    new this(match[1])

  constructor: (@url) ->

  toString: ->
    "url('#{@url}')"

module.exports = BackgroundImage
module.exports.LinearGradient = LinearGradient
module.exports.URL = URL
module.exports.Position = Position
module.exports.ColorStop = ColorStop