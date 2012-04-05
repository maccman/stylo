Selection   = require('./stage/selection')
Dragging    = require('./stage/dragging')
Resizing    = require('./stage/resizing')
SelectArea  = require('./stage/select_area')
Snapping    = require('./stage/snapping')
KeyBindings = require('./stage/key_bindings')
ZIndex      = require('./stage/zindex')

Rectangle  = require('./elements/rectangle')
Ellipsis   = require('./elements/ellipsis')

Properties = require('app/models/properties')

class Stage extends Spine.Controller
  className: 'stage'

  events:
    'select': 'select'
    'deselect': 'deselect'
    'mousedown': 'deselectAll'
    'resize.start': 'resizeStart'
    'resize.end': 'resizeEnd'

  constructor: ->
    super
    @elements    = []
    @selection   = new Selection
    @dragging    = new Dragging(this)
    @resizing    = new Resizing(this)
    @selectArea  = new SelectArea(this)
    @snapping    = new Snapping(this)
    @keybindings = new KeyBindings(this)
    @zindex      = new ZIndex(this)

    @selection.bind 'change', =>
      @el.trigger('selection.change', [this])

    # FIXME: Test data
    @rectangle1 = new Rectangle(
      left: 200, top: 200,
      backgroundImage: [new Properties.Background.URL('assets/blacky.png')]
    )
    @rectangle2 = new Rectangle()

    @add(@rectangle1, @rectangle2)

  add: (elements...) =>
    for element in elements
      @elements.push(element)
      @append(element)

  remove: (element) =>
    @selection.remove(element)
    element.remove()
    @elements.splice(@elements.indexOf(element), 1)

  # Batch manipulate selected

  removeSelected: ->
    @remove(el) for el in @selection.elements

  selectAll: ->
    @selection.add(el) for el in @elements

  cloneSelected: ->
    clones = (el.clone() for el in @selection.elements)
    @add(el) for el in clones
    clones

  # Selecting elements

  select: (e, element, modifier) =>
    # Clear selection unless multiple items are
    # selected, or the shift key is pressed
    if !@selection.isMultiple() and !modifier
      @selection.clear()

    @selection.add(element)

  deselect: (e, element, modifier) =>
    if modifier
      @selection.remove(element)

  deselectAll: (e) =>
    if (e.target is e.currentTarget)
      @selection.clear()

  # Resizing

  resizeStart: ->
    @$('.thumb').hide()

  resizeEnd: ->
    @$('.thumb').show()

  # ZIndex

  bringForward: ->
    elements = @selection.elements.slice(0).reverse()
    @zindex.bringForward(element) for element in elements
    true

  bringBack: ->
    elements = @selection.elements.slice(0).reverse()
    @zindex.bringBack(element) for element in elements
    true

  bringToFront: ->
    elements = @selection.elements.slice(0).reverse()
    @zindex.bringToFront(element) for element in elements
    true

  bringToBack: ->
    elements = @selection.elements.slice(0).reverse()
    @zindex.bringToBack(element) for element in elements
    true

  # Attributes

  area: ->
    area        = @el.position()
    area.height = @el.height()
    area.width  = @el.width()
    area

  center: ->
    area = @area()
    position =
      left: area.width / 2
      top:  area.height / 2

module.exports = Stage