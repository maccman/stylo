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

  drag: (e) =>
    difference =
      left: e.pageX - @dragPosition.left
      top:  e.pageY - @dragPosition.top
    @dragPosition = {left: e.pageX, top: e.pageY}
    @el.trigger('resize.start', [@type, difference, e.shiftKey])

  drop: (e) =>
    @el.trigger('resize.end')

    $(document).unbind('mousemove', @drag)
    $(document).unbind('mouseup', @drop)

class Resizing extends Spine.Controller
  className: 'resizing'

  events:
    'resize.start': 'resize'

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

    switch type
      when 'tl'
        area.width  -= position.left
        area.height -= position.top
        area.top    += position.top
        area.left   += position.left

      when 'tt'
        area.height -= position.top
        area.top    += position.top

      when 'tr'
        area.width  += position.left
        area.height -= position.top
        area.top    += position.top

      when 'rr'
        area.width  += position.left

      when 'br'
        area.width  += position.left
        area.height += position.top

      when 'bb'
        area.height += position.top

      when 'bl'
        area.width  -= position.left
        area.height += position.top
        area.left   += position.left

      when 'll'
        area.width  -= position.left
        area.left   += position.left

    if lockAR
      # TODO - FIXME
      area.width  = Math.max(area.width, area.height)
      area.height = area.width

    @element.resize(area)

module.exports = Resizing