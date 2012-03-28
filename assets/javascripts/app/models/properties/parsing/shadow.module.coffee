Color = require('./color')

class Shadow
  @fromString: (str) ->
    return [] unless str
    return [] if str is 'none'

    shadows = []

    # Parse out the colors first, as they
    # may contain commas, which makes the
    # property parsing difficult
    colors = []
    while color = Color.fromString(str)
      colors.push(color)
      str = str.replace(Color.regex, '')

    properties = str.split(',')

    for property, i in properties
      color = colors[i]
      inset = @insetRegex.test(property)

      parts = property.split(' ')
      parts = (parseFloat(p) for p in parts when p isnt '')

      shadows.push(new this(
        x:       parts[0]
        y:       parts[1]
        blur:    parts[2]
        spread:  parts[3]
        inset:   inset
        color:   color
      ))

    shadows

  @insetRegex: /inset/

  constructor: (properties = {}) ->
    @[k] = v for k, v of properties

    @x      or= 0
    @y      or= 0
    @color  or= new Color(0, 0, 0, 0.3)

  toString: ->
    result = []
    result.push('inset') if @inset
    result.push(@x + 'px')
    result.push(@y + 'px')
    result.push(@blur + 'px') if @blur?
    result.push(@spread + 'px') if @spread?
    result.push(@color.toString())
    result.join(' ')

module.exports = Shadow