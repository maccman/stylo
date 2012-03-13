class Area extends Spine.Controller
  className: 'selectArea'

  constructor: (@left, @top) ->
    super()
    @set(left: @left, top: @top)

  area: ->
    area        = @el.position()
    area.height = @el.height()
    area.width  = @el.width()
    area

  set: (key, value) ->
    if value?
      @el.css(key, value)
    else
      @el.css(key)

  resize: (left, top) ->
    dimensions = {
      width:  left - @left,
      height: top  - @top
    }

    # Support negative areas
    if dimensions.width < 0
      dimensions.left = @left + dimensions.width
      dimensions.width *= -1

    if dimensions.height < 0
      dimensions.top = @top + dimensions.height
      dimensions.height *= -1

    @set(dimensions)

  remove: ->
    @el.remove()

class Selection extends Spine.Module
  @include Spine.Events
  @Area: Area

  constructor: (@elements = []) ->

  # Returns a property for an element selection.
  # Returns null if any of the elements have a different value.
  get: (key) ->
    result = (el.get(key) for el in @elements)
    first  = result.shift()
    for value in result when value isnt first
      return null
    return first

  set: (key, value) ->
    el.set(key, value) for el in @elements

  isMultiple: ->
    @elements.length > 1

  add: (element) ->
    return if element in @elements
    @elements.push(element)
    element.trigger('selected', true)
    @trigger('change')

  remove: (element) ->
    return if element not in @elements
    element.trigger('selected', false)

    index    = @elements.indexOf(element)
    elements = @elements.slice()
    elements.splice(index, 1)
    @elements = elements

    @trigger('change')

  refresh: (elements) ->
    @clear()
    @add(el) for el in elements

  clear: ->
    @remove(el) for el in @elements

module.exports = Selection