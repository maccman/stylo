Element = require('../element')

class Image extends Element
  className: 'image'
  id: module.id

  constructor: (attrs = {}) ->
    super
    @src(attrs.src)

  src: (value) ->
    @set(
      'backgroundImage',
      "#{value} no-repeat center center"
    ) if value?
    @get('backgroundImage')

  toValue: ->
    result = super
    result.src = @src()
    result

module.exports = Image