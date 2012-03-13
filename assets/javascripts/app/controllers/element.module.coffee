Resizing = require('./resizing')

class Element extends Spine.Controller
  defaults:
    position: 'absolute'
    width: '100px'
    height: '100px'
    background: 'rgba(0, 0, 0, 0.5)'
    left: '0'
    top: '0'
    minWidth: '1'
    minHeight: '1'

  events:
    'mousedown': 'select'
    'dblclick':  'edit'

  constructor: (attrs = {}) ->
    super()
    @resizing = new Resizing(this)
    @el.addClass('element')
    @bind 'selected', @selected
    @set @defaults
    @set attrs
    @log attrs

  get: (key) ->
    @[key]?() or @el.css(key)

  set: (key, value) ->
    if typeof key is 'object'
      @set(k, v) for k, v of key
    else
      @[key]?(value) or @el.css(key, value)

  rotate: (val) ->
    @el.transform(rotate: val)

  translate: (position) ->
    coords = [position.left, position.top, 0].join('px,')
    @el.css('-webkit-transform', "translate3d(#{coords})")

  fix: ->
    @el.css(@el.position())
    @el.transform(translate3d: '0,0,0')

  select: (e) ->
    @el.trigger('select', [this, e.shiftKey])

  selected: (bool) =>
    @el.toggleClass('selected', bool)
    @resizing.toggle(bool)

  area: ->
    area        = @el.position()
    area.height = @el.height()
    area.width  = @el.width()
    area

  inArea: (testArea) ->
    area = @area()

    if (area.left + area.width) > testArea.left and
      area.left < (testArea.left + testArea.width) and
        (area.top + area.height) > testArea.top and
          area.top < (testArea.top + testArea.height)
            return true

    false

  edit: ->
    @el.attr('contenteditable', true)

module.exports = Element