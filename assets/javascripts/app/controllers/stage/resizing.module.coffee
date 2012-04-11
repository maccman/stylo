class AreaTitle extends Spine.Controller
  className: 'areaTitle'

  change: (area) ->
    @html("width: #{area.width}px &nbsp; height: #{area.height}px")

  move: (position) ->
    @el.css(left: position.left, top: position.top)

  remove: ->
    @el.remove()

class Resizing extends Spine.Controller
  events:
    'resize.element': 'resized'
    'end.resize': 'resizeEnd'

  constructor: (@stage) ->
    super(el: @stage.el)

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
    @areaTitle?.remove()
    @areaTitle = null

module.exports = Resizing