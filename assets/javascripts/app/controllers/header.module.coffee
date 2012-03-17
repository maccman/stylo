Rectangle  = require('./elements/rectangle')
Ellipsis   = require('./elements/ellipsis')

class Header extends Spine.Controller
  tag: 'header'
  className: 'header'

  events:
    'click .rectangle': 'addRectangle'
    'click .ellipsis': 'addEllipsis'

  constructor: ->
    super
    throw 'stage required' unless @stage
    @html JST['app/views/header'](this)

  addRectangle: ->
    position = @stage.center()
    position.left -= 50
    position.top  -= 50
    @stage.add(shape = new Rectangle(position))
    @stage.selection.clear()
    @stage.selection.add(shape)

  addEllipsis: ->
    position = @stage.center()
    position.left -= 50
    position.top  -= 50
    @stage.add(shape = new Ellipsis(position))
    @stage.selection.clear()
    @stage.selection.add(shape)

module.exports = Header