class Color
  @regex: /^(?:#([0-9a-f]{3,6})|rgba?\(([^)]+)\))/

  @fromHex: (hex) ->
    if hex[0] == "#"
      hex = hex.substring(1, 7)

    if hex.length < 6
      hex += '000000'.substr(0, 6 - hex.length)

    r = parseInt(hex.substring(0,2), 16)
    g = parseInt(hex.substring(2,4), 16)
    b = parseInt(hex.substring(4,6), 16)
    new this(r, g, b)

  @fromString: (str) ->
    match = str.match(@regex)
    if match
      if hex = match[1]
        @fromHex(hex)

      else if rgba = match[2]
        new this(rgba.split(/\s*,\s*/)...)

    else
      null

  constructor: (@r, @g, @b, @a = 1) ->

  toHex: ->
    a = (@b | @g << 8 | @r << 16).toString(16)
    '#' + '000000'.substr(0, 6 - a.length) + a

  toString: ->
    "rgba(#{@r},#{@g},#{@b},#{@a})"

  dup: ->
    Object.create(this)

class Canvas extends Spine.Controller
  tag: 'canvas'
  width: 100
  height: 100

  events:
    'click': 'click'

  constructor: ->
    super
    @el.attr(
      width:  @width,
      height: @height
    )
    @ctx = @el[0].getContext('2d')

  val: (x, y) ->
     data = @ctx.getImageData(x, y, 1, 1).data
     new Color(data[0], data[1], data[2])

  click: (e) ->
     offset = @el.offset()
     x = e.pageX - offset.left
     y = e.pageY - offset.top
     @trigger('change', @val(x, y))

class Gradient extends Canvas
  className: 'gradient'
  width: 250
  height: 250

  constructor: ->
    super
    @color or= new Color(0, 0, 0)
    @render()

  colorWithAlpha: (a) ->
    color = @color.dup()
    color.a = a
    color

  renderGradient: (xy, fromColor, toColor) ->
    gradient = @ctx.createLinearGradient(0, 0, xy...)
    gradient.addColorStop(0, fromColor.toString())
    gradient.addColorStop(1, toColor.toString())
    @ctx.fillStyle = gradient
    @ctx.fillRect(0, 0, @width, @height)

  render: ->
    @ctx.clearRect(0, 0, @width, @height)

    @renderGradient(
      [@width, 0],
      new Color(255, 255, 255),
      new Color(255, 255, 255)
    )

    @renderGradient(
      [@width, 0],
      @colorWithAlpha(0),
      @colorWithAlpha(1)
    )

    @renderGradient(
      [0, @height],
      new Color(0, 0, 0, 0),
      new Color(0, 0, 0, 1)
    )

class Spectrum extends Canvas
  className: 'spectrum'
  width: 25
  height: 250

  constructor: ->
    super
    @render()

  render: ->
    @ctx.clearRect(0, 0, @width, @height)

    gradient = @ctx.createLinearGradient(0, 0, 0, @height)
    gradient.addColorStop(0,    'rgb(255,   0,   0)')
    gradient.addColorStop(0.15, 'rgb(255,   0, 255)')
    gradient.addColorStop(0.33, 'rgb(0,     0, 255)')
    gradient.addColorStop(0.49, 'rgb(0,   255, 255)')
    gradient.addColorStop(0.67, 'rgb(0,   255,   0)')
    gradient.addColorStop(0.84, 'rgb(255, 255,   0)')
    gradient.addColorStop(1,    'rgb(255,   0,   0)')

    @ctx.fillStyle = gradient
    @ctx.fillRect(0, 0, @width, @height)

class ColorPicker extends Spine.Controller
  constructor: ->
    super
    @render()

  render: ->
    @el.empty()
    @gradient = new Gradient(color: new Color(255, 0, 0))
    @spectrum = new Spectrum

    @gradient.bind 'change', (color) =>
      $('body').css('background': color.toString())

    @spectrum.bind 'change', (color) =>
      @gradient.color = color
      @gradient.render()

    @append(@gradient, @spectrum)

module.exports = ColorPicker