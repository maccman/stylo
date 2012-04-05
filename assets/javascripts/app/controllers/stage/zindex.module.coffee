Collection = require('lib/collection')

class ZIndex
  constructor: (@stage) ->
    @order = @stage.elements

  bringForward: (element) ->
    index = @order.indexOf(element)

    if index isnt -1 or index isnt (@order.length - 1)
      # Swap item forwards
      @order[index]     = @order[index + 1]
      @order[index + 1] = element

    @set()

  bringBack: (element) ->
    index = @order.indexOf(element)

    if index isnt -1 or index isnt 0
      # Swap item backwards
      @order[index]     = @order[index - 1]
      @order[index - 1] = element

    @set()

  bringToFront: (element) ->
    # Remove element
    index = @order.indexOf(element)
    @order.splice(index, 1)

    # Add it to the end
    @order.push(element)

    @set()

  bringToBack: (element) ->
    # Remove element
    index = @order.indexOf(element)
    @order.splice(index, 1)

    # Add it to the start
    @order.unshift(element)

    @set()

  set: ->
    for element, index in @order
      element.set('order', index)

module.exports = ZIndex