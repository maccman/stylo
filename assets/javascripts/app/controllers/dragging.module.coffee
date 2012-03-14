class Dragging extends Spine.Controller
  events:
    'mousedown .selected': 'listen'

  constructor: (@stage) ->
    super(el: @stage.el)

  listen: (e) =>
    e.preventDefault()
    e.stopPropagation()

    @dragPosition = {left: e.pageX, top: e.pageY}
    $(@el).mousemove(@drag)
    $(@el).mouseup(@drop)

  drag: (e) =>
    difference =
      left: e.pageX - @dragPosition.left
      top:  e.pageY - @dragPosition.top

    @dragPosition = {left: e.pageX, top: e.pageY}

    @stage.selection.set('move', difference)

  drop: (e) =>
    $(@el).unbind('mousemove', @drag)
    $(@el).unbind('mouseup', @drop)


# * Line snapping to:
#   * Center of page (x/y) axis
#   * Bottom/left/right side of pages?
#   * Sides of elements?
#   * Middle of elements
# * Width snapping:
#   * Detect distance between elements - snap when two distances are the same.


module.exports = Dragging