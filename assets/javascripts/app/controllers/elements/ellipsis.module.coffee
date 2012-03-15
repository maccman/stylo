Element = require('../element')

class Ellipsis extends Element
  className: 'ellipsis'

  constructor: ->
    super
    @set(borderRadius: '50%')

module.exports = Ellipsis