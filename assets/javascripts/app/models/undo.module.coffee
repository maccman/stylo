class Undo
  @undoStack: []
  @redoStack: []

  @add: (undo, redo) ->
    @undoStack.push([undo, redo])
    @redoStack = []
    redo()

  @undo: ->
    [undo, redo] = @undoStack.pop()
    undo()
    @redoStack.push([undo, redo])

  @redo: ->
    [undo, redo] = @redoStack.pop()
    redo()
    @undoStack.push([undo, redo])

module.exports = Undo