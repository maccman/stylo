Serialize   = require('app/models/serialize').Serialize
Selection   = require('./stage/selection')
Dragging    = require('./stage/dragging')
Resizing    = require('./stage/resizing')
SelectArea  = require('./stage/select_area')
Snapping    = require('./stage/snapping')
KeyBindings = require('./stage/key_bindings')
ZIndex      = require('./stage/zindex')
Clipboard   = require('./stage/clipboard')
Context     = require('./stage/context')

Rectangle  = require('./elements/rectangle')
Ellipsis   = require('./elements/ellipsis')

Properties = require('app/models/properties')

class Stage extends Spine.Controller
  className: 'stage'

  events:
    'select.element': 'select'
    'deselect.element': 'deselect'
    'mousedown': 'deselectAll'
    'start.resize': 'resizeStart'
    'end.resize': 'resizeEnd'

  constructor: ->
    super

    @elements    = []
    @properties  = {}

    @selection   = new Selection
    @dragging    = new Dragging(this)
    @resizing    = new Resizing(this)
    @selectArea  = new SelectArea(this)
    @snapping    = new Snapping(this)
    @keyBindings = new KeyBindings(this)
    @zindex      = new ZIndex(this)
    @clipboard   = new Clipboard(this)
    @context     = new Context(this)

    @selection.bind 'change', =>
      @el.trigger('selection.change', [this])

  render: ->
    # FIXME: Test data
    rectangle1 = new Rectangle(
      left: 200, top: 200,
      backgroundImage: [new Properties.Background.URL('assets/blacky.png')]
    )
    rectangle2 = new Rectangle()

    @add(rectangle1)
    @add(rectangle2)
    this

  add: (element) =>
    @elements.push(element)
    @append(element)

  remove: (element) =>
    @selection.remove(element)
    @elements.splice(@elements.indexOf(element), 1)
    element.release()

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

  # Properties

  get: (key) ->
    @[key]?() or @properties[key]

  set: (key, value) ->
    if typeof key is 'object'
      @set(k, v) for k, v of key
    else
      @[key]?(value) or @properties[key] = value

    @paint()

  paint: ->
    @el.css(@properties)

  # Serialization

  @include Serialize

  id: module.id

  toValue: ->
    result =
      elements:   @elements
      properties: @properties

  # Release

  release: ->
    @selection?.release()
    @dragging?.release()
    @resizing?.release()
    @selectArea?.release()
    @snapping?.release()
    @keyBindings?.release()
    @clipboard?.release()
    @context?.release()
    super

module.exports = Stage