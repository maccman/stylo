class Area extends Spine.Controller
  className: 'selectArea'

  constructor: (@left, @top) ->
    super()
    @el.css(left: @left, top: @top)

  area: ->
    area        = @el.position()
    area.height = @el.height()
    area.width  = @el.width()
    area

  resize: (left, top) ->
    dimensions =
      width:  left - @left
      height: top  - @top

    # Support negative areas
    if dimensions.width < 0
      dimensions.left = @left + dimensions.width
      dimensions.width *= -1

    if dimensions.height < 0
      dimensions.top = @top + dimensions.height
      dimensions.height *= -1

    @el.css(dimensions)

  remove: ->
    @el.remove()

class SelectArea extends Spine.Controller
  events:
    'mousedown': 'listen'

  constructor: (@stage) ->
    super(el: @stage.el)

  listen: (e) =>
    # Only listen to mousedown's on the stage
    return if e.target isnt e.currentTarget

    e.preventDefault()

    @selectArea?.remove()
    @offset = @el.offset()

    $(@el).mousemove(@drag)
    $(@el).mouseup(@drop)

  drag: (e) =>
    # Mouse events need to be offset
    # by the height of the header,
    # We also offset by 1, so it doesn't
    # mess up click events
    unless @selectArea
      @selectArea = new Area(
        e.clientX - @offset.left + 1,
        e.clientY - @offset.top  + 1
      )

      @append(@selectArea)

    @selectArea.resize(
      e.clientX - @offset.left,
      e.clientY - @offset.top
    )

    area = @selectArea.area()

    for element in @stage.elements
      if element.inArea(area)
        @stage.selection.add(element)
      else
        @stage.selection.remove(element)

  drop: (e) =>
    @selectArea?.remove()
    @selectArea = null
    $(@el).unbind('mousemove', @drag)
    $(@el).unbind('mouseup', @drop)

module.exports = SelectArea