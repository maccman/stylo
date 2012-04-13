Popup = require('./popup')

class Color
  @regex: /(?:#([0-9a-f]{3,6})|rgba?\(([^)]+)\))/i

  @fromHex: (hex) ->
    if hex[0] is '#'
      hex = hex.substring(1, 7)

    if hex.length is 3
      hex = hex.charAt(0) + hex.charAt(0) +
            hex.charAt(1) + hex.charAt(1) +
            hex.charAt(2) + hex.charAt(2)

    r = parseInt(hex.substring(0,2), 16)
    g = parseInt(hex.substring(2,4), 16)
    b = parseInt(hex.substring(4,6), 16)

    new this(r, g, b)

  @fromString: (str) ->
    match = str.match(@regex)
    return null unless match

    if hex = match[1]
      @fromHex(hex)

    else if rgba = match[2]
      [r, g, b, a] = rgba.split(/\s*,\s*/)
      new this(r, g, b, a)

  @White: (alpha) ->
    new Color(255, 255, 255, alpha)

  @Black: (alpha) ->
    new Color(0, 0, 0, alpha)

  @Transparent: ->
    new Color

  constructor: (r, g, b, a = 1) ->
    @r = parseInt(r, 10) if r?
    @g = parseInt(g, 10) if g?
    @b = parseInt(b, 10) if b?
    @a = parseFloat(a)

  toHex: ->
    unless @r? and @g? and @b?
      return 'transparent'

    a = (@b | @g << 8 | @r << 16).toString(16)
    a = '#' + '000000'.substr(0, 6 - a.length) + a
    a.toUpperCase()

  isTransparent: ->
    not @a

  set: (values) ->
    @[key] = value for key, value of values
    this

  rgb: ->
    result =
      r: @r
      g: @g
      b: @b

  rgba: ->
    result =
      r: @r
      g: @g
      b: @b
      a: @a

  clone: ->
    new @constructor(@r, @g, @b, @a)

  toString: ->
    if @r? and @g? and @b?
      if @a?
        "rgba(#{@r}, #{@g}, #{@b}, #{@a})"
      else
        "rgb(#{@r}, #{@g}, #{@b})"

    else
      'transparent'

  id: "#{module.id}.Color"

  toJSON: ->
    result =
      id:    @id
      value: @toValue()

  toValue: ->
    [@r, @g, @b, @a]

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
    e.preventDefault()

    offset = @el.offset()
    x = e.pageX - offset.left
    y = e.pageY - offset.top
    @trigger('change', @val(x, y))

  drop: =>
    @el.unbind('mousemove', @over)
    $(document).unbind('mouseup', @drop)

  release: ->
    super
    @drop()

class Gradient extends Canvas
  className: 'gradient'
  width: 250
  height: 250

  constructor: ->
    super
    @color or= new Color.Black
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

class Alpha extends Canvas
  className: 'alpha'
  width: 25
  height: 250

  constructor: ->
    super
    @color or= new Color(0, 0, 0)
    @setColor(@color)

  render: ->
    @ctx.clearRect(0, 0, @width, @height)

    gradient = @ctx.createLinearGradient(0, 0, 0, @height)
    gradient.addColorStop(0, @color.clone().set(a: 0).toString())
    gradient.addColorStop(0.9, @color.clone().set(a: 1).toString())

    @ctx.fillStyle = gradient
    @ctx.fillRect(0, 0, @width, @height)

  setColor: (@color) ->
    @render()

  val: (x, y) ->
     data = @ctx.getImageData(x, y, 1, 1).data
     @color.set(a: Math.round((data[3] / 255) * 100) / 100)

class Display extends Spine.Controller
  tag: 'article'

  elements:
    'input[name=hex]': '$hex'
    'input[name=r]': '$r'
    'input[name=g]': '$g'
    'input[name=b]': '$b'
    'input[name=a]': '$a'
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
    @$r.val @color.r
    @$g.val @color.g
    @$b.val @color.b

    @$a.val Math.round(@color.a * 100)
    @$hex.val @color.toHex()
    @$preview.css(background: @color.toString())

  change: (e) ->
    e.preventDefault()

    color = new Color(
      @$r.val(),
      @$g.val(),
      @$b.val(),
      parseFloat(@$a.val()) / 100
    )

    @trigger 'change', color

  changeHex: (e) ->
    e.preventDefault()

    color = Color.fromHex(@$hex.val())
    @trigger 'change', color

class ColorPicker extends Popup
  className: 'colorPicker'
  width: 425

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
    @alpha    = new Alpha(color: @color)
    @display  = new Display(color: @color, original: @original)

    @gradient.bind 'change', (color) =>
      @color.set(color.rgb())
      @display.setColor(@color)
      @alpha.setColor(@color)
      @change()

    @spectrum.bind 'change', (color) =>
      @color.set(color.rgb())
      @gradient.setColor(@color)
      @display.setColor(@color)
      @alpha.setColor(@color)
      @change()

    @alpha.bind 'change', (color) =>
      @color.set(a: color.a)
      @display.setColor(@color)
      @change()

    @display.bind 'change', (color) =>
      @setColor(color)

    @append(@gradient, @spectrum, @alpha, @display)

  setColor: (@color) ->
    @display.setColor(@color)
    @gradient.setColor(@color)
    @spectrum.setColor(@color)
    @alpha.setColor(@color)
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
    @trigger 'change', @original

  release: ->
    super
    @gradient.release()
    @spectrum.release()
    @display.release()

class Input extends Spine.Controller
  className: 'colorInput'

  events:
    'click .preview': 'open'
    'change input': 'change'

  constructor: ->
    super
    @color or= new Color

    @$preview = $('<div />').addClass('preview')
    @$preview.css(background: @color.toString())

    @$input   = $('<input type=color>')
    @$input.val @color.toString()

    @el.append @$preview, @$input

  open: =>
    @picker = new ColorPicker(color: @color)

    @picker.bind 'change', (color) =>
      @$input.val color.toString()
      @$input.change()

    @picker.open(@el.offset())

  change: =>
    @color.set Color.fromString(@$input.val())
    @$preview.css(background: @color.toString())

class Preview extends Spine.Controller
  className: 'colorPreview'

  events:
    'click': 'open'

  constructor: ->
    super
    @color  or= new Color
    @inner  = $('<div />').addClass('inner')
    @append @inner
    @render()

  render: ->
    @inner.css(background: @color.toString())

  open: =>
    # Picker already open
    if @picker and @picker.isOpen()
      @picker.remove()
      return

    @picker = new ColorPicker(color: @color)

    @picker.bind 'change', (color) =>
      @color.set color
      @trigger 'change', @color
      @render()

    @picker.open(@el.offset())

  val: (color) ->
    if color?
      @color = color
      @render()
    @color

module.exports = ColorPicker
module.exports.Color = Color
module.exports.Input = Input
module.exports.Preview = Preview