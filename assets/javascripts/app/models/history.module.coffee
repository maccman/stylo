class History
  @undoStack: []
  @redoStack: []
  @max: 50

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
      stack.shift() if stack.length >= @max
      @redoStack = []

    stack.push(action)

  @undo: ->
    action = @undoStack.pop()
    if action
      action.call(this, true)
    else false

  @redo: ->
    action = @redoStack.pop()
    if action
      action.call(this, false)
    else false

  @clear: ->
    @undoStack = []
    @redoStack = []

module.exports = History