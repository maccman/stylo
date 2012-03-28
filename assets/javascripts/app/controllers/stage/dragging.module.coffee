class CoordTitle extends Spine.Controller
  className: 'coordTitle'

  change: (area) ->
    @html("x: #{area.left}px &nbsp; y: #{area.top}px")

  move: (position) ->
    @el.css(left: position.left, top: position.top)

  remove: ->
    @el.remove()

class Dragging extends Spine.Controller
  events:
    'mousedown .selected': 'listen'

  constructor: (@stage) ->
    super(el: @stage.el)

  listen: (e) =>
    e.preventDefault()

    # Copy elements when alt dragging
    if e.altKey
      clones = @stage.cloneSelected()
      @stage.selection.refresh(clones)

    @dragPosition = {left: e.pageX, top: e.pageY}

    $(document).mousemove(@drag)
    $(document).mouseup(@drop)

  drag: (e) =>
    difference =
      left: e.pageX - @dragPosition.left
      top:  e.pageY - @dragPosition.top

    @dragPosition  = {left: e.pageX, top: e.pageY}
    @stageArea     = @stage.area()
    @selectionArea = @stage.selection.area()

    # Check vertical/center stage snapping
    difference = @stage.snapping.snap(@selectionArea, difference)

    # Setup CoordTitle
    @moveCoordTitle(e)

    @stage.selection.set('moveBy', difference)

  drop: (e) =>
    $(document).unbind('mousemove', @drag)
    $(document).unbind('mouseup', @drop)
    @el.trigger('dragging.end')

    # Reset coordTitle
    @coordTitle?.remove()
    @coordTitle = null

  moveCoordTitle: ->
    unless @coordTitle
      @append(@coordTitle = new CoordTitle)

    @coordTitle.move(
      left: @dragPosition.left - @stageArea.left + 10,
      top:  @dragPosition.top  - @stageArea.top  + 10
    )

    @coordTitle.change(@selectionArea)

module.exports = Dragging