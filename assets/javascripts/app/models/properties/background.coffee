# Use http://lea.verou.me/demos/cssgradientsplease/cssgradient.js

class Position
  @keywords:
    top: 0


    right: 90
    bottom: 180
    left: 270

  @angleRegex: /(\d+)deg/

  @fromString: (str) ->
    parts = str.split(' ')

    h = @keywords(parts[0]) or parseFloat(parts[0]) or @keywords.top
    v = @keywords(parts[1]) or parseFloat(parts[1]) or @keywords.bottom
    a = @keywords(parts[2]) or parseFloat(parts[2]) or 0

    new this(x, y, a)

  constructor: (@x, @y, @angle) ->

  toString: ->
    ''


class Point
  @fromString: (str) ->
    color   = Color.fromString(str)
    str     = str.replace(Color.regex, '')
    percent = parseFloat(str)
    new this(color, percent)

  constructor: (@color, @percent) ->

class Background
  @linearRegex: /(-webkit-)?linear-gradient\((.+),?\);?/
  @radialRegex: /(-webkit-)?radial-gradient\((.+),?\);?/

  @fromString: (str) ->
    backgrounds = []

    return backgrounds if str is 'none'

    while str
      if match = str.match(@linearRegex)
        params = match[2]
        params = params.split(',')

        direction = Direction.fromString(params.unshift())
        points    = (Point.fromString(p) for p in params)

        backgrounds.push(new Linear(direction, points))
        str = str.replace(@linearRegex, '')

      else if match = str.match(@radialRegex)
        params = match[2]
        params = params.split(',')

        direction = Direction.fromString(params.unshift())
        points    = (Point.fromString(p) for p in params)

        backgrounds.push(new Radial(direction, points...))
        str = str.replace(@radialRegex, '')

    backgrounds

class Linear extends Background
  constructor: (@position, @points...) ->

  toString: ->
    "-webkit-linear-gradient(#{@position.toString()})"

class Radial extends Background
  constructor: (@position, @points...) ->
