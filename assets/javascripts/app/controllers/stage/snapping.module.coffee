class SnapLine extends Spine.Controller
  className: 'snapLine'

  constructor: (@type) ->
    super()

    @el.addClass(@type)

    if @type is 'horizontal'
      @set(left: 0, right: 0)
    else if @type is 'vertical'
      @set(top: 0, bottom: 0)

  setValue: (value) ->
    if @type is 'horizontal'
      @set(top: value)
    else
      @set(left: value)

  remove: ->
    @el.remove()

  set: (values) ->
    @el.css(values)

class Snap extends Spine.Controller
  threshold:       6
  escapeThreshold: 10
  value:           0
  active:          false
  type:           'horizontal'

  constructor: (@stage) ->
    super(el: @stage.el)

    if @type is 'horizontal'
      @direction = 'top'
    else
      @direction = 'left'

    @line = new SnapLine(@type)

  activate: (value) ->
    @line.setValue(value)
    @append(@line)
    @active = true
    @value  = 0

  remove: ->
    @line.remove()
    @active = false

  snap: (area, difference) ->
    if @active
      difference = @snapOut(area, difference)
    else
      # Record initial difference, as we will
      # need this on snapOut to sync up coords
      @initial   = difference[@direction]
      difference = @snapIn(area, difference)
      @initial  -= difference[@direction]

    difference

  # Private

  snapOut: (area, difference) ->
    @value += difference[@direction]

    if @withinThreshold(@value, @escapeThreshold)
      difference[@direction] = 0
    else
      # Element has escaped snapping
      difference[@direction] = @value + (@initial or 0)
      @remove()

    difference

  snapIn: (area, difference) ->
    # Override in subclass
    difference

  withinThreshold: (value, threshold = @threshold) ->
    value > -threshold and value < threshold

class VerticalCenterSnap extends Snap
  type: 'vertical'

  snapIn: (area, difference) ->
    left   = area.left + (area.width / 2)
    middle = @stage.area().width / 2

    # Vertical center of stage
    if @withinThreshold(left - middle)
      @activate(middle)
      difference[@direction] = middle - left

    difference

class HorizontalCenterSnap extends Snap
  type: 'horizontal'

  snapIn: (area, difference) ->
    top    = area.top + (area.height / 2)
    middle = @stage.area().height / 2

    # Horizontal center of stage
    if @withinThreshold(top - middle)
      @activate(middle)
      difference[@direction] = middle - top

    difference

class HorizontalEdgeSnap extends Snap
  type: 'horizontal'

  snapIn: (area, difference) ->
    bottom      = area.top + area.height
    stageHeight = @stage.area().height

    # Top edge
    if @withinThreshold(area.top)
      @activate(0)
      difference[@direction] = -area.top

    # Bottom edge
    else if @withinThreshold(bottom - stageHeight)
      @activate(stageHeight)
      difference[@direction] = stageHeight - bottom

    difference

class VerticalEdgeSnap extends Snap
  type: 'vertical'

  snapIn: (area, difference) ->
    right      = area.left + area.width
    stageWidth = @stage.area().width

    # Left edge
    if @withinThreshold(area.left)
      @activate(0)
      difference[@direction] = -area.left

    # Right edge
    else if @withinThreshold(right - stageWidth)
      @activate(stageWidth)
      difference[@direction] = stageWidth - right

    difference

class HorizontalElementSnap extends Snap
  type: 'horizontal'

  snapIn: (currentArea, difference) ->
    areas = [currentArea]

    for element in @stage.elements
      continue if element in @stage.selection.elements
      areas.push(element.area())

    for area, i in areas
      areas[i] =
        top:    area.top
        middle: area.top + area.height / 2
        bottom: area.top + area.height

    current = areas.shift()

    # The snapping runs through the following:
    # - Compare topA against topB, middleB, bottomB
    # - Compare middleA against topB, middleB, bottomB
    # - Compare bottomA against topB, middleB, bottomB

    for area in areas
      for typeA, valueA of current
        for typeB, valueB of area
          if @withinThreshold(valueA - valueB)
            @activate(valueB)
            difference[@direction] = valueB - valueA

            return difference

    difference

class VerticalElementSnap extends Snap
  type: 'vertical'

  snapIn: (currentArea, difference) ->
    areas = [currentArea]

    for element in @stage.elements
      continue if element in @stage.selection.elements
      areas.push(element.area())

    for area, i in areas
      areas[i] =
        left:   area.left
        middle: area.left + area.width / 2
        right:  area.left + area.width

    current = areas.shift()

    # The snapping runs through the following:
    # - Compare leftA against leftA, middleB, rightB
    # - Compare middleA against leftA, middleB, rightB
    # - Compare rightA against leftA, middleB, rightB

    for area in areas
      for typeA, valueA of current
        for typeB, valueB of area
          if @withinThreshold(valueA - valueB)
            @activate(valueB)
            difference[@direction] = valueB - valueA

            return difference

    difference

class Snapping extends Spine.Controller
  events:
    'resize.element':   'remove'
    'selection.change': 'remove'
    'end.dragging':     'remove'

  constructor: (@stage) ->
    super(el: @stage.el)
    @snaps = []

    @snaps.push(new VerticalCenterSnap(@stage))
    @snaps.push(new HorizontalCenterSnap(@stage))
    @snaps.push(new VerticalEdgeSnap(@stage))
    @snaps.push(new HorizontalEdgeSnap(@stage))
    @snaps.push(new HorizontalElementSnap(@stage))
    @snaps.push(new VerticalElementSnap(@stage))

  snapSelection: (difference) ->
    @snap(@stage.selection.area(), difference)

  snap: (area, difference) ->
    for snap in @snaps
      difference = snap.snap(area, difference)
    difference

  remove: ->
    snap.remove() for snap in @snaps when snap.active

module.exports = Snapping