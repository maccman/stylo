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

    # FIXME: Test data
    @rectangle1 = new Rectangle(background: 'url(assets/whitey.png)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)')
    @rectangle2 = new Rectangle(left: '200px', top: '200px', background: 'url(assets/blacky.png)')

    @add(@rectangle1)
    @add(@rectangle2)

  add: (element) =>
    @elements.push(element)
    @append(element)

  # Dragging elements

  dragListen: (e) =>
    e.preventDefault()
    e.stopPropagation()

    @dragPosition = {left: e.pageX, top: e.pageY}
    $(@el).mousemove(@drag)
    $(@el).mouseup(@drop)

  # TODO: Snapping:
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
    $(@el).unbind('mousemove', @drag)
    $(@el).unbind('mouseup', @drop)

  # Selecting elements

  select: (e, element, modifier) =>
    # Clear selection unless multiple items are
    # selected, or the shift key is pressed
    if !@selection.isMultiple() and !modifier
      @selection.clear()

    @selection.add(element)

  deselect: (e) =>
    if (e.target is e.currentTarget)
      @selection.clear()

  # Select area

  selectAreaListen: (e) =>
    e.preventDefault()
    e.stopPropagation()

    # Mouse events need to be offset
    # by the height of the header
    @offset      = @el.offset()
    @$selectArea = new Selection.Area(
      e.clientX - @offset.left,
      e.clientY - @offset.top
    )

    @append(@$selectArea)

    $(@el).mousemove(@selectArea)
    $(@el).mouseup(@selectAreaRemove)

  selectArea: (e) =>
    @$selectArea.resize(
      e.clientX - @offset.left,
      e.clientY - @offset.top
    )

    area = @$selectArea.area()

    for element in @elements
      if element.inArea(area)
        @selection.add(element)
      else
        @selection.remove(element)

  selectAreaRemove: (e) =>
    @$selectArea.remove()
    $(@el).unbind('mousemove', @selectArea)
    $(@el).unbind('mouseup', @selectAreaRemove)

  # Resizing

  resizeStart: ->
    @$('.thumb').hide()

  resizeEnd: ->
    @$('.thumb').show()

module.exports = Stage