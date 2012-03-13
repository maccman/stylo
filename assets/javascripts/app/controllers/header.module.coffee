class Header extends Spine.Controller
  tag: 'header'
  className: 'header'

  constructor: ->
    super
    throw 'stage required' unless @stage

module.exports = Header