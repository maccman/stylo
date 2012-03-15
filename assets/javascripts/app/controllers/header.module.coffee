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
    @stage.add(new Rectangle(@stage.center()))

  addEllipsis: ->
    @stage.add(new Ellipsis(@stage.center()))

module.exports = Header