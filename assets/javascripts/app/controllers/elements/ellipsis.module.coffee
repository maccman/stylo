Element = require('../element')

class Ellipsis extends Element
  className: 'ellipsis'
  id: module.id

  constructor: ->
    super
    @properties['borderRadius'] = '50%'
    @paint()

  # Disable setting borderRadius in
  # the element inspector
  borderRadius: false

module.exports = Ellipsis