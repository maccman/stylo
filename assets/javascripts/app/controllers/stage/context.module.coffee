class Context
  constructor: (@stage) ->
    @stage.el.bind 'contextmenu', @contextmenu

  contextmenu: (e) =>
    e.preventDefault()
    # TODO

module.exports = Context