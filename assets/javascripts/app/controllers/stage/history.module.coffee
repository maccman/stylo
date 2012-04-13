Model     = require('app/models/history')
Serialize = require('app/models/serialize')

class History extends Spine.Controller
  constructor: (@stage) ->
    super(el: @stage.el)

  undo: ->
    Model.undo()

  redo: ->
    Model.redo()

  record: (isUndo) ->
    elements = JSON.stringify(@stage.elements)

    action   = (isUndo) =>
      # Record the opposite action (i.e. redo)
      @record( !isUndo )

      elements = Serialize.fromJSON(elements)
      @stage.refresh(elements)

    Model.add(action, isUndo)

module.exports = History
