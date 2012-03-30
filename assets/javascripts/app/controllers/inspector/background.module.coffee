Collection      = require('lib/collection')
Color           = require('app/models/properties/color')
BackgroundImage = require('app/models/properties/background_image')

class Edit extends Spine.Controller
  className: 'edit'

  events:
    'change input': 'inputChange'

  elements:
    'input[name=x]': '$x'
    'input[name=y]': '$y'
    'input[name=blur]': '$blur'

  constructor: ->
    super
    @change(@background)

  change: (@background = new BackgroundImage) ->
    @render()

  render: ->
    @html JST['app/views/inspector/background'](@)

    # TODO
    # Multiple gradient picker
    # Single color picker
    # Url picker (repeat)


class List extends Spine.Controller
  className: 'list'

  events:
    'click .item': 'click'
    'click button.plus': 'plus'
    'click button.minus': 'minus'

  constructor: ->
    super
    throw 'backgrounds required' unless @backgrounds
    @backgrounds.change @render
    @render()

  render: =>
    @html JST['app/views/inspector/background/list'](@)

    @$('.item').removeClass('selected')
    selected = @$('.item').get(@backgrounds.indexOf(@current))
    $(selected).addClass('selected')

  click: (e) ->
    @current = @backgrounds[$(e.currentTarget).index()]
    @trigger 'change', @current
    @render()
    false

  plus: ->
    @backgrounds.push(@current = new BackgroundImage)
    @trigger 'change', @current
    false

  minus: ->
    @backgrounds.remove(@current)
    @current = @backgrounds.first()
    @trigger 'change', @current
    false


class Background extends Spine.Controller
  className: 'background'

  # styles: [
  #   'background',
  #   'backgroundColor',
  #   'backgroundImage',
  #   'backgroundRepeat',
  #   'backgroundSize'
  # ]

  constructor: ->
    super
    @render()

  render: =>
    @disabled = not @stage.selection.isAny()

    @backgrounds = @stage.selection.get('backgroundImage')
    @backgrounds = new Collection(@backgrounds)
    @current     = @backgrounds.first()

    @backgrounds.change @set

    @el.empty()
    @el.append('<h3>Background</h3>')

    # List
    @list = new List
      current: @current
      backgrounds: @backgrounds

    @list.bind 'change', (@current) =>
      @edit.change @current

    @append @list

    # Edit
    @edit = new Edit(background: @current)
    @edit.bind 'change', @set
    @append @edit


  set: =>
    @stage.selection.set('backgroundImage', @backgrounds.valueOf())

module.exports = Background