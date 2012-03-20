Popup = require('./popup')
ColorPicker = require('./color_picker')
Color = ColorPicker.Color

class Stop extends Spine.Controller
  className: 'stop'

  events:
    'mousedown': 'listen'

  constructor: (@slide, @color, @location = 0) ->
    super()
    # @el.addClass(@type)
    @appendTo(@slide)

  listen: (e) =>
    e.preventDefault()
    e.stopPropagation()

    @dragPosition = {left: e.pageX, top: e.pageY}
    @slide.mousemove(@drag)
    $(document).mouseup(@drop)

  drag: (e) =>
    difference =
      left: e.pageX - @dragPosition.left
      top:  e.pageY - @dragPosition.top

    @dragPosition = {left: e.pageX, top: e.pageY}
    @move(left: difference.left)

  drop: (e) =>
    @slide.unbind('mousemove', @drag)
    $(document).unbind('mouseup', @drop)

  move: (toPosition) ->
    position       = @el.position()
    position.left += toPosition.left

    @location = @slide.width() - position.left

    @el.css(position)
    @el.trigger('moved', this)

class ColorSlide extends Spine.Controller
  className: 'colorSlide'


class GradientPicker extends Popup
  constructor: ->
    super
    @color or= Color(0, 0, 0)

module.exports = GradientPicker