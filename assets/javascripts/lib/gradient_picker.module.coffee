Popup       = require('./popup')
ColorPicker = require('./color_picker')
Color       = ColorPicker.Color

# TODO - abstract from properties
BackgroundImage = require('app/models/properties/background_image')
LinearGradient  = BackgroundImage.LinearGradient
ColorStop       = BackgroundImage.ColorStop

class Slider extends Spine.Controller
  className: 'slider'

  events:
    'mousedown': 'listen'

  constructor: (@colorStop = new ColorStop) ->
    super()

    @colorInput = new ColorPicker.Preview(color: @colorStop.color)
    @colorInput.bind 'change', (color) =>
      @colorInput.color = color
      @el.trigger('change', this)

    @append(@colorInput)

  listen: (e) =>
    e.preventDefault()
    e.stopPropagation()

    @width = @el.parent().width()
    $(document).mousemove(@drag)
    $(document).mouseup(@drop)

  drag: (e) =>
    position = @el.offset()
    left     = e.pageY - position.left

    location = (left / @width) * 100
    @move(location)

  drop: (e) =>
    $(document).unbind('mousemove', @drag)
    $(document).unbind('mouseup', @drop)

  move: (@location = 0) ->
    @colorStop.location = @location

    left = (@location / 100) * @width
    left = Math.max(Math.min(@width, left), 0)

    @el.css(left: left)
    @el.trigger('change', this)

  release: ->
    super
    @el.trigger('removed', this)
    @el.trigger('change', this)

class GradientPicker extends Spine.Controller
  events:
    'removed': 'removeSlider'
    'change': 'set'

  constructor: ->
    super

    @gradient or= new LinearGradient
    @append(new Slider(stop)) for stop in @gradient.stops

    # Add default stops
    unless @gradient.stops.length
      @addSlider(new ColorStop(new Color(255, 255, 255), 0))
      @addSlider(new ColorStop(new Color(0, 0, 0), 1))

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

module.exports = GradientPicker