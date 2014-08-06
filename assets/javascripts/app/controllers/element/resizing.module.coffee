class Thumb extends Spine.Controller
  className: 'thumb'

  events:
    'mousedown': 'listen'

  constructor: (@type) ->
    super()
    @el.addClass(@type)

  listen: (e) =>
    e.preventDefault()
    e.stopPropagation()

    @dragPosition = {left: e.pageX, top: e.pageY}
    $(document).mousemove(@drag)
    $(document).mouseup(@drop)
    @el.trigger('start.resize', [@type])

  drag: (e) =>
    difference =
      left: e.pageX - @dragPosition.left
      top:  e.pageY - @dragPosition.top

    @dragPosition = {left: e.pageX, top: e.pageY}
    @el.trigger('drag.resize', [@type, difference, e.shiftKey])

  drop: (e) =>
    @el.trigger('end.resize')

    $(document).unbind('mousemove', @drag)
    $(document).unbind('mouseup', @drop)

class Resizing extends Spine.Controller
  className: 'resizing'

  events:
    'drag.resize': 'resize'

  constructor: (@element) ->
    super(el: @element.el)

  render: ->
    @thumbs = $('<div />')
    @thumbs.append(new Thumb('tl').el)
    @thumbs.append(new Thumb('tt').el)
    @thumbs.append(new Thumb('tr').el)
    @thumbs.append(new Thumb('rr').el)
    @thumbs.append(new Thumb('br').el)
    @thumbs.append(new Thumb('bb').el)
    @thumbs.append(new Thumb('bl').el)
    @thumbs.append(new Thumb('ll').el)
    @thumbs = @thumbs.children()
    @append(@thumbs)

  remove: ->
    @thumbs?.remove()

  toggle: (bool) ->
    if bool then @render() else @remove()

  resize: (e, type, position, lockAR) ->
    area = @element.area()

    switch type[0]
      when 't'
        area.top    += position.top
        area.height -= position.top
      when 'b'
        area.height += position.top
    switch type[1]
      when 'l'
        area.width  -= position.left
        area.left   += position.left
      when 'r'
        area.width  += position.left

    if lockAR
      # TODO - FIXME, this doesn't lock AR properly
      area.width  = Math.max(area.width, area.height)
      area.height = area.width

    # Make sure we can't have negative widths/heights
    area.width  = Math.max(0, area.width)
    area.height = Math.max(0, area.height)

    @element.resize(area)

module.exports = Resizing