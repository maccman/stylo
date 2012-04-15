Serialize   = require('app/models/serialize')
Selection   = require('./stage/selection')
Dragging    = require('./stage/dragging')
Resizing    = require('./stage/resizing')
SelectArea  = require('./stage/select_area')
Snapping    = require('./stage/snapping')
KeyBindings = require('./stage/key_bindings')
ZIndex      = require('./stage/zindex')
Clipboard   = require('./stage/clipboard')
ContextMenu = require('./stage/context_menu')
History     = require('./stage/history')
DropArea    = require('./stage/drop_area')

Rectangle   = require('./elements/rectangle')
Ellipsis    = require('./elements/ellipsis')
Properties  = require('app/models/properties')

class Stage extends Spine.Controller
  className: 'stage'

  events:
    'select.element':   'selectEvent'
    'deselect.element': 'deselectEvent'
    'mousedown':        'deselectAllEvent'
    'release.element':  'releaseEvent'
    'start.resize':     'resizeStart'
    'end.resize':       'resizeEnd'

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
    @contextMenu = new ContextMenu(this)
    @history     = new History(this)
    @dropArea    = new DropArea(this)

    @selection.bind 'change', =>
      @el.trigger('change.selection', [this])

  render: -> this

  add: (element) =>
    throw 'element required' unless element

    # Push and resolve zIndex
    @elements.push(element)
    element.order(@elements.indexOf(element))

    # Append to stage
    @append(element)

    # Add to selection if element is selected
    @selection.add(element) if element.selected

  remove: (element) =>
    throw 'element required' unless element

    @selection.remove(element)
    @elements.splice(@elements.indexOf(element), 1)
    element.release()

  clear: ->
    @selection.clear()
    for element in @elements[..]
      @remove(element)

  refresh: (elements) ->
    @el.hide()
    @clear()
    @add(el) for el in elements
    @el.show()

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

  selectEvent: (e, element, modifier) =>
    # Clear selection unless multiple items are
    # selected and the shift key is pressed
    @selection.clear() unless modifier

    @selection.add(element)

  deselectEvent: (e, element, modifier) =>
    if modifier
      @selection.remove(element)

  deselectAllEvent: (e) =>
    if (e.target is e.currentTarget)
      @selection.clear()

  # Resizing

  resizeStart: ->
    @$('.thumb').hide()

  resizeEnd: ->
    @$('.thumb').show()

  # ZIndex

  bringForward: ->
    elements = @selection.element[..].reverse()
    @zindex.bringForward(element) for element in elements
    true

  bringBack: ->
    elements = @selection.elements[..].reverse()
    @zindex.bringBack(element) for element in elements
    true

  bringToFront: ->
    elements = @selection.elements[..].reverse()
    @zindex.bringToFront(element) for element in elements
    true

  bringToBack: ->
    elements = @selection.elements[..].reverse()
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
    @properties[key]

  set: (key, value) ->
    if typeof key is 'object'
      @properties[k] = v for k, v of key
    else
      @properties[key] = value

    @paint()

  paint: ->
    @el.css(@properties)

  # Serialization

  @include Serialize.Serialize

  id: module.id

  toValue: ->
    result =
      elements:   @elements
      properties: @properties

  save: ->
    localStorage.stage = JSON.stringify(@elements)

  load: ->
    data = localStorage.stage
    return unless data
    @refresh Serialize.fromJSON(data)

  # Release

  releaseEvent: (e, element) ->
    @remove(element)

  release: ->
    @selection?.release()
    @dragging?.release()
    @resizing?.release()
    @selectArea?.release()
    @snapping?.release()
    @keyBindings?.release()
    @clipboard?.release()
    @contextMenu?.release()
    @history?.release()
    @dropArea?.release()
    super

module.exports = Stage