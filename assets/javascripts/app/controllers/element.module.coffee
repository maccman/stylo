Resizing   = require('./element/resizing')
Serialize  = require('app/models/serialize').Serialize
Background = require('app/models/properties/background')
Color      = require('app/models/properties/color')
Utils      = require('lib/utils')

class Element extends Spine.Controller
  @include Serialize
  id: module.id

  defaults: ->
    result =
      position: 'absolute'
      width: 100
      height: 100
      left: 0
      top: 0
      backgroundColor: new Color.Black(0.2)

  elementEvents:
    'mousedown': 'toggleSelect'
    'dblclick': 'startEditing'

  constructor: (attrs = {}) ->
    super(el: attrs.el)

    @el.addClass('element')
    @delegateEvents(@elementEvents)

    @properties = {}
    @selected   = !!attrs.selected
    @resizing   = new Resizing(this)

    @text(attrs.text) if attrs.text

    @set @defaults()
    @set attrs.properties or attrs

  get: (key) ->
    @properties[key]

  set: (key, value) ->
    if typeof key is 'object'
      for k, v of key
        @properties[k] = v
    else
      @properties[key] = value

    @paint()

  paint: ->
    @el.css(@properties)

  # Manipulating elements

  resize: (area) ->
    @set(area)
    @el.trigger('resize.element', [this])

  moveBy: (toPosition) ->
    area       = @area()
    area.left += toPosition.left
    area.top  += toPosition.top

    @set(area)
    @el.trigger('move.element', [this])

  order: (i) ->
    unless @get('zIndex') is i + 100
      @set('zIndex', i + 100)

  remove: ->
    @el.trigger('release.element', [this])

  # Selecting elements

  toggleSelect: (e) ->
    # Disable selection when editing
    return if @editing

    if @selected
      @el.trigger('deselect.element', [this, e?.shiftKey])
    else
      @el.trigger('select.element', [this, e?.shiftKey])

  setSelected: (bool) =>
    if bool?
      @selected = bool
      @el.toggleClass('selected', bool)

      @stopEditing() unless bool
      @resizing.toggle(bool)

    @selected

  # Text editing

  startEditing: ->
    return if @editing
    @editing = true

    # We don't want the element to be
    # resizable, or draggable
    @resizing.toggle(false)
    @el.removeClass('selected')
    @el.addClass('editing')

    # Enable text editing and select text
    @el.attr('contenteditable', true)
    @el.focus()
    document.execCommand('selectAll', false, null)

  stopEditing: ->
    return unless @editing
    @editing = false

    @el.blur()
    @el.removeAttr('contenteditable')
    @el.scrollTop(0)
    @el.addClass('selected')
    @el.removeClass('editing')

  text: (text) ->
    @el.text(text) if text?
    @el.text()

  # Position & Area

  area: ->
    area = {}
    area.left   = @properties.left or 0
    area.top    = @properties.top or 0
    area.height = @properties.height or 0
    area.width  = @properties.width or 0
    area

  inArea: (testArea) ->
    area = @area()

    if (area.left + area.width) > testArea.left and
      area.left < (testArea.left + testArea.width) and
        (area.top + area.height) > testArea.top and
          area.top < (testArea.top + testArea.height)
            return true

    false

  # Exporting

  outerHTML: ->
    @el.clone().empty()[0].outerHTML

  ignoredStyles: [
    'left',
    'top',
    'zIndex',
    'position'
  ]

  outerCSS: ->
    # Clone properties object
    styles = {}

    for name, value of @properties
      continue if name in @ignoredStyles
      continue unless value

      # If a number was passed in, add 'px' to
      # it (except for certain CSS properties)
      if typeof value is 'number' and not $.cssNumber[name]
        value += 'px'

      # Format as CSS property
      name  = Utils.dasherize(name)
      value = value.toString()
      continue unless value

      styles[name] = value

    # Format as CSS properties
    styles = ("\t#{k}: #{v};" for k, v of styles).join("\n")
    ".#{@className} {\n#{styles}\n}"

  toValue: ->
    result =
      selected:   @selected
      properties: @properties
      text:       @text()

module.exports = Element