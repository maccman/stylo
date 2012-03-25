class PositionPicker extends Spine.Controller
  className: 'positionPicker'

  events:
    'mousedown': 'drag'

  width:  40
  height: 40

  constructor: ->
    super

    @el.css
      width: @width
      height: @height

    @ball = $('<div />').addClass('ball')
    @append @ball

    @ball.css
      left: '50%'
      top: '50%'

  change: (position) ->
    # Offset to center
    left = position.left + @width / 2
    left = Math.max(Math.min(left, @width), 0)

    top  = position.top  + @height / 2
    top  = Math.max(Math.min(top, @height), 0)

    @ball.css(left: left, top: top)

  drag: (e) ->
    return if @disabled

    # Center of picker on page
    @offset = $(@el).offset()

    $(document).mousemove(@over)
    $(document).mouseup(@drop)
    @over(e)

  over: (e) =>
    e.preventDefault()

    difference =
      left: e.pageX - @offset.left - (@width / 2)
      top:  e.pageY - @offset.top  - (@height / 2)

    @change difference
    @trigger('change', difference)

  drop: =>
    $(document).unbind('mousemove', @over)
    $(document).unbind('mouseup', @drop)

module.exports = PositionPicker