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
      @snapOut(area, difference)
    else
      @snapIn(area, difference)

  # Private

  snapOut: (area, difference) ->
    @value += difference[@direction]

    if @withinThreshold(@value, @escapeThreshold)
      difference[@direction] = 0
    else
      difference[@direction] = @value
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

    if @withinThreshold(left - middle)
      @activate(middle)
      difference[@direction] = middle - left

    difference

class HorizontalCenterSnap extends Snap
  type: 'horizontal'

  snapIn: (area, difference) ->
    top    = area.top + (area.height / 2)
    middle = @stage.area().height / 2

    if @withinThreshold(top - middle)
      @activate(middle)
      difference[@direction] = middle - top

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

    # Compare topA against topB, middleB, bottomB
    # Compare middleA against topB, middleB, bottomB
    # Compare bottomA against topB, middleB, bottomB

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
    'resized':          'removeLines'
    'selection.change': 'removeLines'
    'dragging.end':     'removeLines'

  constructor: (@stage) ->
    super(el: @stage.el)
    @snaps = []

    @snaps.push(new VerticalCenterSnap(@stage))
    @snaps.push(new HorizontalCenterSnap(@stage))
    @snaps.push(new HorizontalElementSnap(@stage))
    @snaps.push(new VerticalElementSnap(@stage))

  snapSelection: (difference) ->
    @snap(@stage.selection.area(), difference)

  snap: (area, difference) ->
    for snap in @snaps
      difference = snap.snap(area, difference)

    difference

  removeLines: ->
    snap.remove() for snap in @snaps

module.exports = Snapping