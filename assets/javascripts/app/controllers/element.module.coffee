Resizing = require('./element/resizing')

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
    @set @defaults
    @set attrs

  get: (key) ->
    @[key]?() or @el.css(key)

  set: (key, value) ->
    if typeof key is 'object'
      @set(k, v) for k, v of key
    else
      @[key]?(value) or @el.css(key, value)

  # Manipulating elements

  rotate: (val) ->
    @el.transform(rotate: val)

  resize: (area) ->
    @el.css(area)
    @el.trigger('resized', this)

  move: (toPosition) ->
    position       = @el.position()
    position.left += toPosition.left
    position.top  += toPosition.top

    @el.css(position)
    @el.trigger('moved', this)

  # Selecting elements

  select: (e) ->
    @el.trigger('select', [this, e.shiftKey])

  selected: (bool) =>
    @el.toggleClass('selected', bool)
    @resizing.toggle(bool)

  # Position & Area

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

  remove: ->
    @el.remove()

module.exports = Element