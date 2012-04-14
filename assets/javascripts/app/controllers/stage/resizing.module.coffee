class AreaTitle extends Spine.Controller
  className: 'areaTitle'

  change: (area) ->
    @html("width: #{area.width}px &nbsp; height: #{area.height}px")

  move: (position) ->
    @el.css(left: position.left, top: position.top)

class Resizing extends Spine.Controller
  events:
    'start.resize': 'resizeStart'
    'resize.element': 'resized'
    'end.resize': 'resizeEnd'

  constructor: (@stage) ->
    super(el: @stage.el)

  resizeStart: ->
    @stage.history.record()

  resized: (e, element) ->
    area = element.area()

    unless @areaTitle
      @append(@areaTitle = new AreaTitle)

    @areaTitle.move(
      left: area.left + area.width  + 10,
      top:  area.top  + area.height + 10
    )

    @areaTitle.change(area)

  resizeEnd: ->
    @areaTitle?.release()
    @areaTitle = null

module.exports = Resizing