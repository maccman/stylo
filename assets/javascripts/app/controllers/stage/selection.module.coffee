min = (a = 0, b = 0) ->
  return b if a is 0
  Math.min(a, b)

max = (a = 0, b = 0) ->
  return b if a is 0
  Math.max(a, b)

class Selection extends Spine.Module
  @include Spine.Events

  constructor: (@elements = []) ->

  # Returns a property for an element selection.
  # Returns null unless all of the elements have the same value.
  get: (key) ->
    return null unless @isAny()

    first = @elements[0]?.get(key)
    for el in @elements
      if el.get(key) isnt first
        return null
    first

  # Sets a property on all elements
  set: (key, value) ->
    el.set(key, value) for el in @elements

  isMultiple: ->
    @elements.length > 1

  isSingle: ->
    @elements.length is 1

  isAny: ->
    @elements.length > 0

  # Select an element
  add: (element) ->
    return if element in @elements

    @elements.push(element)
    element.selected(true)

    @trigger('change')

  # Remove a selected element
  remove: (element) ->
    return if element not in @elements
    element.selected(false)

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

  # Find total area of selected elements
  area: ->

    # Quick return for single elements
    if @elements.length is 1
      return @elements[0].area()

    area = {}

    # Loop through the elements, find the upper and
    # lower most ones to calculate the total area
    for element in @elements
      elementArea = element.area()
      area.left   = min(area.left,   elementArea.left)
      area.top    = min(area.top,    elementArea.top)
      area.right  = max(area.right,  elementArea.left + elementArea.width)
      area.bottom = max(area.bottom, elementArea.top + elementArea.height)

    area.width  = area.right - area.left
    area.height = area.bottom - area.top

    delete area.right
    delete area.bottom

    area

  moveBy: (toPosition) ->
    # Shortcut to reduce calls on set() and paint()
    el.moveBy(toPosition) for el in @elements


module.exports = Selection