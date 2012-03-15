class SnapLine extends Spine.Controller
  className: 'snapLine'

  constructor: (@type) ->
    super()
    @el.addClass(@type)

  set: (values) ->
    @el.css(values)

  remove: ->
    @el.remove()

class Snapping extends Spine.Controller
  events:
    'resized':          'removeLines'
    'selection.change': 'removeLines'
    'dragging.end':     'removeLines'

  constructor: (@stage) ->
    super(el: @stage.el)

    @lines   = {}
    @snapped = {}

  snapElement: (element, difference) ->
    @snap(element.area(), difference)

  snapSelection: (difference) ->
    @snap(@stage.selection.area(), difference)

  snap: (area, difference) ->
    # Lazy load stage area, otherwise
    # it has no dimensions
    @stageArea or= @stage.area()

    difference = @verticalStageSnap(area, difference)
    difference = @horizontalStageSnap(area, difference)
    difference

  # Private

  threshold: 6
  escapeThreshold: 10

  withinThreshold: (a, b, threshold = @threshold) ->
    (a - b) > -threshold and (a - b) < threshold

  verticalStageSnap: (area, difference) ->
    left   = area.left + (area.width / 2)
    middle = @stageArea.width / 2

    # We don't want to check snapping until they've
    # gone out of that snapping threshold again
    if @snapped.vertical
      @snapped.vertical += difference.left

      # Pulled out of snap threshold?
      if @snapped.vertical > @escapeThreshold or
          @snapped.vertical < -@escapeThreshold
        difference.left   = @snapped.vertical
        @snapped.vertical = 0
        @lines.vertical?.remove()
      else
        # Stick the element
        difference.left = 0

    # Are we within the snap threshold?
    else if @withinThreshold(left, middle)
      # Snap to middle
      @snapped.vertical = 1
      difference.left   = middle - left

      # Add snap line
      @lines.vertical?.remove()
      @lines.vertical = new SnapLine('vertical')
      @lines.vertical.set(left: middle, top: 0, bottom: 0)
      @append(@lines.vertical)

    difference

  horizontalStageSnap: (area, difference) ->
    top    = area.top + (area.height / 2)
    middle = @stageArea.height / 2

    if @snapped.horizontal
      @snapped.horizontal += difference.top

      if @snapped.horizontal > @escapeThreshold or
          @snapped.horizontal < -@escapeThreshold
        difference.top      = @snapped.horizontal
        @snapped.horizontal = 0
        @lines.horizontal?.remove()
      else
        difference.top = 0

    else if @withinThreshold(top, middle)
      @snapped.horizontal = 1
      difference.top      = middle - top

      @lines.horizontal?.remove()
      @lines.horizontal = new SnapLine('horizontal')
      @lines.horizontal.set(top: middle, left: 0, right: 0)
      @append(@lines.horizontal)

    difference

  removeLines: ->
    @$('.snapLine').remove()

# * Line snapping to:
#   * Center of page (x/y) axis
#   * Bottom/left/right side of pages?
#   * Sides of elements?
#   * Middle of elements
# * Width snapping:
#   * Detect distance between elements - snap when two distances are the same.

module.exports = Snapping