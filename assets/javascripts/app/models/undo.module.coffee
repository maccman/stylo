class Undo
  @undoStack: []
  @redoStack: []

  @add: (undo, redo) ->
    @undoStack.push([undo, redo])
    @redoStack = []
    redo()

  @undo: ->
    action = @undoStack.pop()
    return unless action

    [undo, redo] = action
    undo()

    @redoStack.push(action)

  @redo: ->
    action = @redoStack.pop()
    return unless action

    [undo, redo] = action
    redo()

    @undoStack.push(action)

module.exports = Undo