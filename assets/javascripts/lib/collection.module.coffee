class Collection extends Array
  # Include events
  for k,v of Spine.Events
    @::[k] = v

  constructor: (value) ->
    if Array.isArray(value)
      super()
      @push(value...)
    else
      super

  refresh: (records) ->
    @splice(0, @length)
    @push(r) for r in records
    @trigger 'refresh'
    @change()

  push: ->
    res = super
    @trigger 'append'
    @change()
    res

  remove: (record) ->
    index = @indexOf(record)
    @splice(index, 1)
    @trigger 'remove'
    @change()

  change: (func) ->
    if typeof func is 'function'
      @bind 'change', arguments...
    else
      @trigger 'change', arguments...
    this

  include: (value) ->
    @indexOf(value) isnt -1

  first: ->
    @[0]

  last: ->
    @[@length - 1]

module.exports = Collection