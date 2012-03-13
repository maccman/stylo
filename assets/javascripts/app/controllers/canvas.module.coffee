Element = require('./element')

class Canvas extends Element
  tag: 'canvas'

  points: []

  constructor: ->
    super
    @ctx = @el[0].getContext('2d')

  paint: ->
    first  = @points[0]
    points = @points[1...@points.length]
    return unless first

    @ctx.beginPath()
    @ctx.moveTo(first...)

    for point in @points
      @ctx.lineTo(point...)

    @ctx.fill()

  width: (val) ->

  height: (val) ->

  backgroundImage: (val) ->

  backgroundColor: (val) ->

  borderBottom: (val) ->

  boxShadow: (val) ->

  borderRadius: (val) ->

module.exports = Canvas