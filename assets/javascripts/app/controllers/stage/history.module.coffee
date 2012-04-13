Model     = require('app/models/history')
Serialize = require('app/models/serialize')

class History extends Spine.Controller
  constructor: (@stage) ->
    super(el: @stage.el)

  undo: ->
    Model.undo()

  redo: ->
    Model.redo()

  record: (type) ->
    @recordState() unless @throttle(type)

  # Private

  recordState: (isUndo) ->
    elements = JSON.stringify(@stage.elements)

    action   = (isUndo) =>
      # Record the opposite action (i.e. redo)
      @recordState( !isUndo )

      # Replace stage with previous state
      elements = Serialize.fromJSON(elements)
      @stage.refresh(elements)

    Model.add(action, isUndo)

  # Throttling

  throttleLimit: 500

  throttle: (type) ->
    throttled = false
    current   = new Date

    if type and @throttleType is type and
      (current - @throttleDate) <= @throttleLimit
        throttled = true

    @throttleType = type
    @throttleDate = current

    throttled

  release: ->
    Model.clear()

module.exports = History
