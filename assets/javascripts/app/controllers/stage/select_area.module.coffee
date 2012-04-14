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

class SelectArea extends Spine.Controller
  events:
    'mousedown': 'listen'

  constructor: (@stage) ->
    super(el: @stage.el)

  listen: (e) =>
    # Only listen to mousedown's on the stage
    return if e.target isnt e.currentTarget

    e.preventDefault()

    @offset = @el.offset()
    @offset.left -= @el.scrollLeft()
    @offset.top  -= @el.scrollTop()

    @selectArea?.release()

    $(document).mousemove(@drag)
    $(document).mouseup(@drop)

  drag: (e) =>
    # We offset by 1, so it doesn't
    # mess up click events
    unless @selectArea
      @selectArea = new Area(
        e.pageX - @offset.left + 1,
        e.pageY - @offset.top  + 1
      )

      @append(@selectArea)

    @selectArea.resize(
      e.pageX - @offset.left,
      e.pageY - @offset.top
    )

    area = @selectArea.area()

    for element in @stage.elements
      if element.inArea(area)
        @stage.selection.add(element)
      else
        @stage.selection.remove(element)

  drop: (e) =>
    @selectArea?.release()
    @selectArea = null
    $(document).unbind('mousemove', @drag)
    $(document).unbind('mouseup', @drop)

module.exports = SelectArea