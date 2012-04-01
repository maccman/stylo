Collection      = require('lib/collection')
ColorPicker     = require('lib/color_picker')
GradientPicker  = require('lib/gradient_picker')
Color           = require('app/models/properties/color')
BackgroundImage = require('app/models/properties/background_image')
BI              = BackgroundImage

class Edit extends Spine.Controller
  className: 'edit'

  events:
    'change input': 'inputChange'

  constructor: ->
    super
    @change(@background)

  change: (@background) ->
    @render()

  render: ->
    @el.empty()

    if @background instanceof BackgroundImage.Pure
      picker = new ColorPicker.Preview(color: @background.color)
      picker.bind 'change', (color) =>
        @background.color = color
        @trigger('change', @background)
      @append picker

    else if @background instanceof BackgroundImage.URL
      @html JST['app/views/inspector/background/url'](@)

    else if @background instanceof BackgroundImage.LinearGradient
      picker = new GradientPicker(gradient: @background)
      picker.bind 'change', (@background) =>
        @trigger 'change', @background
      @append picker

    else
      # Empty BG

    # TODO
    # Multiple gradient picker
    # Single color picker
    # Url picker (repeat)

  inputChange: ->
    if @background instanceof BackgroundImage.URL
      @background.url = @$('input').val()
      @trigger 'change', @background

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
    @current = new BI.LinearGradient(
      new BI.Position(0),
      [
        new BI.ColorStop(new Color(255, 255, 255)),
        new BI.ColorStop(new Color(0, 0, 0))
      ]
    )
    @backgrounds.push(@current)
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