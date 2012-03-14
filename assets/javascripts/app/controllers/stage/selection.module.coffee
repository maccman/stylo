class Selection extends Spine.Module
  @include Spine.Events

  constructor: (@elements = []) ->

  # Returns a property for an element selection.
  # Returns null unless all of the elements have the same value.
  get: (key) ->
    result = (el.get(key) for el in @elements)
    first  = result.shift()
    for value in result when value isnt first
      return null
    return first

  # Sets a property on all elements
  set: (key, value) ->
    el.set(key, value) for el in @elements

  isMultiple: ->
    @elements.length > 1

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

module.exports = Selection