ColorPicker    = require('lib/color_picker')
Color          = ColorPicker.Color
PositionPicker = require('lib/position_picker')

class BoxShadow
  @fromString: (str) ->
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
    @blur   or= 0
    @spread or= 0
    @color  or= new Color(0, 0, 0, 0.3)

  toString: ->
    result = []
    result.push('inset') if @inset
    result.push(@x + 'px')
    result.push(@y + 'px')
    result.push(@blur + 'px')
    result.push(@spread + 'px')
    result.push(@color.toString())
    result.join(' ')

class Shadow extends Spine.Controller
  className: 'shadow'

  events:
    'change input': 'change'
    'click .preview': 'showColorPicker'

  elements:
    'input[name=x]': '$x'
    'input[name=y]': '$y'
    'input[name=blur]': '$blur'
    '.preview .inner': '$preview'

  constructor: ->
    super

    @positionPicker = new PositionPicker

    @positionPicker.bind 'change', (position) =>
      @shadow.x = position.left
      @shadow.y = position.top
      @stage.selection.set('boxShadow', @shadow.toString())
      @update()

    @render()

  render: ->
    @disabled = not @stage.selection.isAny()

    @shadow = @stage.selection.get('boxShadow')
    @shadow = BoxShadow.fromString(@shadow)[0] if @shadow
    @shadow or= new BoxShadow

    @html JST['app/views/inspector/shadow'](@)

    @$('input').attr('disabled', @disabled)
    @$preview.css('background', @shadow?.color.toString())

    @positionPicker.disabled = @disabled
    @append @positionPicker

  update: ->
    @$('input').attr('disabled', @disabled)
    @$preview.css('background', @shadow?.color.toString())

    @$x.val @shadow.x
    @$y.val @shadow.y
    @$blur.val @shadow.blur

  showColorPicker: (e) ->
    return if @disabled

    color  = @shadow?.color
    picker = new ColorPicker(color: color)

    picker.bind 'change', (color) =>
      @shadow.color = color
      @change()
      @update()

    picker.bind 'cancel', =>
      @shadow.color = color
      @change()
      @update()

    picker.open(@$preview.offset())

  change: ->
    @shadow.x    = parseFloat(@$x.val())
    @shadow.y    = parseFloat(@$y.val())
    @shadow.blur = parseFloat(@$blur.val())

    @stage.selection.set('boxShadow', @shadow.toString())

module.exports = Shadow
module.exports.BoxShadow = BoxShadow