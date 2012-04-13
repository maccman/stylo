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

    @stage.history.record()

    @dragPosition = {left: e.pageX, top: e.pageY}
    @active = false

    $(document).mousemove(@drag)
    $(document).mouseup(@drop)

  drag: (e) =>
    @active = true

    difference =
      left: e.pageX - @dragPosition.left
      top:  e.pageY - @dragPosition.top

    @dragPosition  = {left: e.pageX, top: e.pageY}
    @stageArea     = @stage.area()
    @selectionArea = @stage.selection.area()

    if e.altKey or e.metaKey
      @stage.snapping.remove()
    else
      # Check vertical/center stage snapping
      difference = @stage.snapping.snap(@selectionArea, difference)

    # Setup CoordTitle
    @moveCoordTitle(e)

    @stage.selection.moveBy(difference)
    @el.trigger('move.dragging')

  drop: (e) =>
    $(document).unbind('mousemove', @drag)
    $(document).unbind('mouseup', @drop)
    @el.trigger('end.dragging') if @active

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