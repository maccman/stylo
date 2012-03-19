Popup = require('./popup')

class Color
  @regex: /^(?:#([0-9a-f]{3,6})|rgba?\(([^)]+)\))/

  @fromHex: (hex) ->
    if hex[0] is '#'
      hex = hex.substring(1, 7)

    if hex.length is 3
      hex = hex.charAt(0) + hex.charAt(0) +
            hex.charAt(1) + hex.charAt(1) +
            hex.charAt(2) + hex.charAt(2)

    r = hex.substring(0,2)
    g = hex.substring(2,4)
    b = hex.substring(4,6)

    new this(r, g, b)

  @fromString: (str) ->
    match = str.match(@regex)
    return null unless match

    if hex = match[1]
      @fromHex(hex)

    else if rgba = match[2]
      new this(rgba.split(/\s*,\s*/)...)

  constructor: (r, g, b, a = 1) ->
    @r = parseInt(r, 16)
    @g = parseInt(g, 16)
    @b = parseInt(b, 16)
    @a = parseInt(a, 10)

  toHex: ->
    a = (@b | @g << 8 | @r << 16).toString(16)
    a = '#' + '000000'.substr(0, 6 - a.length) + a
    a.toUpperCase()

  isTransparent: ->
    @a is 0

  toString: ->
    "rgba(#{@r},#{@g},#{@b},#{@a})"

  set: (values) ->
    @[key] = value for key, value of values

  rgb: ->
    result =
      r: @r
      g: @g
      b: @b

  clone: ->
    Object.create(this)

class Canvas extends Spine.Controller
  tag: 'canvas'
  width: 100
  height: 100

  events:
    'mousedown': 'drag'

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

  drag: (e) ->
    @el.mousemove(@over)
    $(document).mouseup(@drop)
    @over(e)

  over: (e) =>
     offset = @el.offset()
     x = e.pageX - offset.left
     y = e.pageY - offset.top
     @trigger('change', @val(x, y))

  drop: =>
    @el.unbind('mousemove', @over)
    $(document).unbind('mouseup', @drop)

class Gradient extends Canvas
  className: 'gradient'
  width: 250
  height: 250

  constructor: ->
    super
    @color or= new Color(0, 0, 0)
    @setColor(@color)

  setColor: (@color) ->
    @render()

  colorWithAlpha: (a) ->
    color = @color.clone()
    color.a = a
    color

  renderGradient: (xy, colors...) ->
    gradient = @ctx.createLinearGradient(0, 0, xy...)
    gradient.addColorStop(0, colors.shift()?.toString())

    for color, index in colors
      gradient.addColorStop(index + 1 / colors.length, color.toString())

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

    gradient = @ctx.createLinearGradient(0, 0, -6, @height)
    gradient.addColorStop(0, new Color(0, 0, 0, 0).toString())
    gradient.addColorStop(1, new Color(0, 0, 0, 1).toString())
    @ctx.fillStyle = gradient
    @ctx.fillRect(0, 0, @width, @height)

class Spectrum extends Canvas
  className: 'spectrum'
  width: 25
  height: 250

  constructor: ->
    super
    @color or= new Color(0, 0, 0)
    @setColor(@color)

  render: ->
    @ctx.clearRect(0, 0, @width, @height)

    gradient = @ctx.createLinearGradient(0, 0, 0, @height)
    gradient.addColorStop(0,    'rgb(255,   0,   0)')
    gradient.addColorStop(0.16, 'rgb(255,   0, 255)')
    gradient.addColorStop(0.33, 'rgb(0,     0, 255)')
    gradient.addColorStop(0.50, 'rgb(0,   255, 255)')
    gradient.addColorStop(0.67, 'rgb(0,   255,   0)')
    gradient.addColorStop(0.83, 'rgb(255, 255,   0)')
    gradient.addColorStop(1,    'rgb(255,   0,   0)')

    @ctx.fillStyle = gradient
    @ctx.fillRect(0, 0, @width, @height)

  setColor: (@color) ->
    @render()

class Display extends Spine.Controller
  tag: 'article'

  elements:
    'input[name=hex]': '$hex'
    '.preview .inner': '$preview'
    '.preview .original': '$original'

  events:
    'change input:not([name=hex])': 'change'
    'change input[name=hex]': 'changeHex'

  constructor: ->
    super
    @color or= new Color(0, 0, 0)
    @render()
    @setColor(@color)

  render: ->
    @html JST['lib/views/color_picker'](this)

    if @original
      @$original.css(background: @original.toString())

  setColor: (@color) ->
    for input in @$('input')
      input.value = @color[input.name]
    @$hex.val @color.toHex()
    @$preview.css(background: @color.toString())

  change: (e) ->
    e.preventDefault()

    color = new Color
    for input in @$('input')
      color[input.name] = input.value
    @trigger 'change', color

  changeHex: (e) ->
    e.preventDefault()

    color = Color.fromHex(@$hex.val())
    @trigger 'change', color

class ColorPicker extends Popup
  className: 'colorPicker'
  width: 390

  events:
    'click .save': 'save'
    'click .cancel': 'cancel'
    'form submit': 'save'

  constructor: ->
    super
    @color or= new Color(255, 0, 0)
    unless @color instanceof Color
      @color = Color.fromString(@color)
    @original = @color.clone()
    @render()

  render: ->
    @el.empty()

    @gradient = new Gradient(color: @color)
    @spectrum = new Spectrum(color: @color)
    @display  = new Display(color: @color, original: @original)

    @gradient.bind 'change', (color) =>
      @color.set(color.rgb())
      @display.setColor(@color)
      @change()

    @spectrum.bind 'change', (color) =>
      @color.set(color.rgb())
      @gradient.setColor(@color)
      @display.setColor(@color)
      @change()

    @display.bind 'change', (color) =>
      @setColor(color)

    @append(@gradient, @spectrum, @display)

  setColor: (@color) ->
    @display.setColor(@color)
    @gradient.setColor(@color)
    @spectrum.setColor(@color)
    @change()

  change: (color = @color) ->
    @trigger 'change', color

  save: (e) ->
    e.preventDefault()
    @close()
    @trigger 'save', @color

  cancel: (e) ->
    e.preventDefault()
    @close()
    @trigger 'cancel'

module.exports = ColorPicker
module.exports.Color = Color