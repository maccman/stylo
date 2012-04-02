Popup       = require('./popup')
ColorPicker = require('./color_picker')
Color       = ColorPicker.Color

# TODO - abstract from properties
Background      = require('app/models/properties/background')
LinearGradient  = Background.LinearGradient
ColorStop       = Background.ColorStop

class Slider extends Spine.Controller
  className: 'slider'

  events:
    'mousedown': 'listen'
    'mouseup': 'openColorPicker'

  constructor: (@colorStop = new ColorStop) ->
    super()

    @inner = $('<div />').addClass('inner')
    @append @inner
    @render()

  render: ->
    @move(@colorStop.length)
    @inner.css(background: @colorStop.color)

  listen: (e) =>
    e.preventDefault()
    e.stopPropagation()

    @width  = @el.parent().width()
    @offset = @el.parent().offset()
    @remove = false
    @moved  = false

    $(document).mousemove(@drag)
    $(document).mouseup(@drop)

  drag: (e) =>
    @moved = true
    @picker?.close?()
    @picker = false

    top = e.pageY - @offset.top
    @remove = top > 100 or top < -100
    @el.toggleClass('remove', @remove)

    left   = e.pageX - @offset.left
    length = (left / @width) * 100
    @move(length)

  drop: (e) =>
    $(document).unbind('mousemove', @drag)
    $(document).unbind('mouseup', @drop)
    @release() if @remove

  move: (@length = 0) ->
    @length = Math.max(Math.min(@length, 100), 0)
    @colorStop.length = @length

    @el.css(left: "#{@length}%")
    @el.trigger('change', [this])

  release: ->
    @el.trigger('removed', [this])
    @el.trigger('change', [this])
    super

  openColorPicker: ->
    if @moved
      return

    @picker = new ColorPicker(color: @colorStop.color)

    @picker.bind 'change', (color) =>
      @colorStop.color = color
      @el.trigger('change', [this])
      @render()

    @picker.open(@el.offset())

class GradientPicker extends Spine.Controller
  className: 'gradientPicker'

  events:
    'removed': 'removeSlider'
    'change': 'set'
    'click': 'createSlider'

  constructor: ->
    super

    @gradient or= new LinearGradient
    @append(new Slider(stop)) for stop in @gradient.stops

    # Add default stops
    unless @gradient.stops.length
      @addSlider(new ColorStop(new Color.White, 0))
      @addSlider(new ColorStop(new Color.Black, 100))

    @el.css(background: @gradient)

  addSlider: (colorStop = new ColorStop) ->
    @gradient.addStop(colorStop)
    @append(new Slider(colorStop))
    @set()

  removeSlider: (e, slider) ->
    @gradient.removeStop(slider.colorStop)

  set: ->
    @el.css(background: @gradient)
    @trigger('change', @gradient)

  createSlider: (e) ->
    # Only create sliders for clicks directly on the picker
    return unless e.target is e.currentTarget

    left   = e.pageX - @el.offset().left
    length = (left / @el.width()) * 100

    @addSlider(new ColorStop(new Color.White, length))

module.exports = GradientPicker