class History
  @undoStack: []
  @redoStack: []
  @max: 30

  @add: (action, isUndo) ->
    if isUndo is true
      # Push onto the undo
      # stack from a redo
      stack = @undoStack

    else if isUndo is false
      # Push onto the redo
      # stack from a undo
      stack = @redoStack

    else
      # By default, push onto
      # an undo stack
      stack = @undoStack
      stack.shift() if stack.length is @max
      @redoStack = []

    stack.push(action)

  @undo: ->
    action = @undoStack.pop()
    action?.call(this, true)

  @redo: ->
    action = @redoStack.pop()
    action?.call(this, false)

module.exports = History