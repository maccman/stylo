Resizing   = require('./element/resizing')
Serialize  = require('app/models/serialize').Serialize
Background = require('app/models/properties/background')
Color      = require('app/models/properties/color')
Utils      = require('lib/utils')

class Element extends Spine.Controller
  @include Serialize

  className: 'element'
  id: module.id

  defaults: ->
    result =
      position: 'absolute'
      width: 100
      height: 100
      left: 0
      top: 0
      backgroundColor: new Color.Black(0.2)
      order: -1

  events:
    'mousedown': 'select'

  constructor: (attrs = {}) ->
    super(el: attrs.el)

    @properties = {}

    @set @defaults()
    @set attrs

    @resizing = new Resizing(this)

  get: (key) ->
    @[key]?() ? @properties[key]

  set: (key, value) ->
    if typeof key is 'object'
      @set(k, v) for k, v of key
    else
      @[key]?(value) or @properties[key] = value

    @paint()

  paint: ->
    @el.css(@properties)

  toValue: ->
    @properties

  # Manipulating elements

  resize: (area) ->
    @set(area)
    @el.trigger('resized', [this])

  moveBy: (toPosition) ->
    area       = @area()
    area.left += toPosition.left
    area.top  += toPosition.top

    @set(area)
    @el.trigger('moved', [this])

  order: (i) ->
    @set('zIndex', i + 100)

  remove: ->
    @el.remove()

  # Selecting elements

  select: (e) ->
    if @selected()
      @el.trigger('deselect', [this, e?.shiftKey])
    else
      @el.trigger('select', [this, e?.shiftKey])

  selected: (bool) =>
    if bool?
      @_selected = bool
      @el.toggleClass('selected', bool)
      @resizing.toggle(bool)
    @_selected

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
    'left'
    'top'
    'zIndex'
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

module.exports = Element