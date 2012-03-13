Rectangle = require('./elements/rectangle')
Selection = require('./selection')

class Stage extends Spine.Controller
  className: 'stage'

  events:
    'select': 'select'
    'mousedown.deselect': 'deselect'
    'mousedown .selected': 'dragListen'
    'mousedown.selectarea': 'selectAreaListen'
    'resize.start': 'resizeStart'
    'resize.end': 'resizeEnd'

  constructor: ->
    super
    @selection = new Selection
    @elements  = []

    # Test data
    @add(new Rectangle)
    @rectangle2 = new Rectangle
    @add(@rectangle2)
    @rectangle2.set(left: '200', top: '200', background: 'blue')

  add: (element) =>
    @elements.push(element)
    @append(element)

  toDataURL: (type = 'image/png') ->

  # Dragging elements

  dragListen: (e) =>
    e.preventDefault()
    e.stopPropagation()

    @dragPosition = {left: e.pageX, top: e.pageY}
    $(document).mousemove(@drag)
    $(document).mouseup(@drop)

  # Snapping:
  # - Middle of x axis
  # - Middle of y axis
  # - Middle of element x axis
  # - Middle of element y axis
  # - Same distance from two elements
  # - Element edge?

  drag: (e) =>
    difference =
      left: e.pageX - @dragPosition.left
      top:  e.pageY - @dragPosition.top

    @selection.set('translate', difference)

  drop: (e) =>
    @selection.set('fix')
    $(document).unbind('mousemove', @drag)
    $(document).unbind('mouseup', @drop)

  # Selecting elements

  select: (e, element) =>
    @selection.clear() unless @selection.isMultiple()
    @selection.add(element)

  deselect: (e) =>
    if (e.target is e.currentTarget)
      @selection.clear()

  # Select area

  selectAreaListen: (e) =>
    e.preventDefault()
    e.stopPropagation()

    @$selectArea = new Selection.Area(e.clientX, e.clientY)
    @append(@$selectArea)

    $(document).mousemove(@selectArea)
    $(document).mouseup(@selectAreaRemove)

  selectArea: (e) =>
    @$selectArea.resize(e.clientX, e.clientY)
    area = @$selectArea.area()

    for element in @elements
      if element.inArea(area)
        @selection.add(element)
      else
        @selection.remove(element)

  selectAreaRemove: (e) =>
    @$selectArea.remove()
    $(document).unbind('mousemove', @selectArea)
    $(document).unbind('mouseup', @selectAreaRemove)

  # Resizing

  resizeStart: ->
    @$('.thumb').hide()

  resizeEnd: ->
    @$('.thumb').show()


module.exports = Stage