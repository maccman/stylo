class PositionPicker extends Spine.Controller
  className: 'positionPicker'

  events:
    'mousedown': 'drag'

  drag: (e) ->
    return if @disabled

    # Center of picker on page
    @offset = $(@el).offset()
    @offset.left += ($(@el).width() / 2)
    @offset.top += ($(@el).height() / 2)

    $(document).mousemove(@over)
    $(document).mouseup(@drop)
    @over(e)

  over: (e) =>
    e.preventDefault()

    difference =
      left: e.pageX - @offset.left
      top:  e.pageY - @offset.top

    @trigger('change', difference)

  drop: =>
    $(document).unbind('mousemove', @over)
    $(document).unbind('mouseup', @drop)

module.exports = PositionPicker