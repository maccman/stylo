Rectangle  = require('./elements/rectangle')
Ellipsis   = require('./elements/ellipsis')
Text       = require('./elements/text')

class Header extends Spine.Controller
  tag: 'header'
  className: 'header'

  events:
    'click .rectangle': 'addRectangle'
    'click .ellipsis': 'addEllipsis'
    'click .text': 'addText'

  render: ->
    @html JST['app/views/header'](this)
    this

  addRectangle: ->
    @addElement(new Rectangle)

  addEllipsis: ->
    @addElement(new Ellipsis)

  addText: ->
    @addElement(element = new Text)
    element.startEditing()

  addElement: (element) ->
    @stage.history.record()

    position       = @stage.center()
    position.left -= element.get('width') or 50
    position.top  -= element.get('height') or 50
    element.set(position)

    @stage.add(element)
    @stage.selection.clear()
    @stage.selection.add(element)

module.exports = Header