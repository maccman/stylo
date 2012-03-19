Resizing = require('./element/resizing')

class Element extends Spine.Controller
  defaults:
    position: 'absolute'

  events:
    'mousedown': 'select'
    'dblclick':  'edit'

  constructor: (attrs = {}) ->
    @el = attrs.el if 'el' of attrs
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

  edit: ->
    @el.attr('contenteditable', true)

  remove: ->
    @el.remove()

  clone: ->
    el = @el.clone()
    el.empty()
    new @constructor(el: el)

  # Selecting elements

  select: (e) ->
    if @isSelected()
      @el.trigger('deselect', [this, e?.shiftKey])
    else
      @el.trigger('select', [this, e?.shiftKey])

  selected: (bool) =>
    @el.toggleClass('selected', bool)
    @resizing.toggle(bool)

  isSelected: ->
    @el.hasClass('selected')

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

module.exports = Element