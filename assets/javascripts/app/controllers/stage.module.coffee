Rectangle  = require('./elements/rectangle')
Ellipsis   = require('./elements/ellipsis')
Selection  = require('./stage/selection')
Dragging   = require('./stage/dragging')
SelectArea = require('./stage/select_area')

class Stage extends Spine.Controller
  className: 'stage'

  events:
    'select': 'select'
    'mousedown.deselect': 'deselect'
    'resize.start': 'resizeStart'
    'resize.end': 'resizeEnd'

  constructor: ->
    super
    @elements   = []
    @selection  = new Selection
    @dragging   = new Dragging(this)
    @selectArea = new SelectArea(this)

    # FIXME: Test data
    @rectangle1 = new Rectangle(left: '200px', top: '200px', background: 'url(assets/blacky.png)')
    @rectangle2 = new Rectangle(background: 'url(assets/whitey.png)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)')
    @ellipsis   = new Ellipsis(left: '100px', top: '100px')

    @add(@rectangle1, @rectangle2, @ellipsis)

  add: (elements...) =>
    for element in elements
      @elements.push(element)
      @append(element)

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

  # Resizing

  resizeStart: ->
    @$('.thumb').hide()

  resizeEnd: ->
    @$('.thumb').show()

module.exports = Stage