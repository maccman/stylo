Collection      = require('lib/collection')
ColorPicker     = require('lib/color_picker')
GradientPicker  = require('lib/gradient_picker')
Color           = require('app/models/properties/color')
Background      = require('app/models/properties/background')
BackgroundImage = Background.BackgroundImage
PopupMenu       = require('app/controllers/inspector/popup_menu')

class Backgrounds extends Collection
  getColor: ->
    (@filter (item) -> item instanceof Color)[0] or new Color.Transparent

  getImages: ->
    @filter (item) -> item instanceof BackgroundImage

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

    if @background instanceof Color
      picker = new ColorPicker.Preview(color: @background)
      picker.bind 'change', (color) =>
        @background = color
        @trigger('change', @background)
      @append picker

    else if @background instanceof Background.URL
      @html JST['app/views/inspector/background/url'](@)

    else if @background instanceof Background.LinearGradient
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
    this

  inputChange: ->
    if @background instanceof Background.URL
      @background.url = @$('input').val()
      @trigger 'change', @background

class BackgroundType extends PopupMenu
  className: 'backgroundType'

  events:
    'click [data-type]': 'choose'

  constructor: ->
    super
    @render()

  render: ->
    @html JST['app/views/inspector/background/menu'](@)

  choose: (e) ->
    @trigger 'choose', $(e.currentTarget).data('type')
    @close()

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

  render: =>
    @html JST['app/views/inspector/background/list'](@)

    @$('.item').removeClass('selected')
    selected = @$('.item').get(@backgrounds.indexOf(@current))
    $(selected).addClass('selected')

    this

  click: (e) ->
    @current = @backgrounds[$(e.currentTarget).index()]
    @trigger 'change', @current
    @render()

  plus: (e) ->
    menu = new BackgroundType

    menu.bind 'choose', (type) =>
      if type is 'backgroundColor'
        @addBackgroundColor()

      else if type is 'linearGradient'
        @addLinearGradient()

      else if type is 'url'
        @addURL()

    menu.open(
      left: e.pageX,
      top:  e.pageY
    )

  minus: ->
    @backgrounds.remove(@current)
    @current = @backgrounds.first()
    @trigger 'change', @current

  # Private

  addBackgroundColor: ->
    @current = new Background.Color.White

    @backgrounds.push(@current)
    @trigger 'change', @current

  addLinearGradient: ->
    @current = new Background.LinearGradient(
      new Background.Position(0),
      [
        new Background.ColorStop(new Color.Black, 0),
        new Background.ColorStop(new Color.White, 100)
      ]
    )

    @backgrounds.push(@current)
    @trigger 'change', @current

  addURL: ->
    @current = new Background.URL

    @backgrounds.push(@current)
    @trigger 'change', @current

class BackgroundInspector extends Spine.Controller
  className: 'background'

  render: =>
    @disabled = not @stage.selection.isAny()
    @el.toggleClass('disabled', @disabled)

    # Get the background gradients
    @backgrounds = @stage.selection.get('backgroundImage')
    @backgrounds = new Backgrounds(@backgrounds)

    # Get the background color
    backgroundColor = @stage.selection.get('backgroundColor')
    @backgrounds.push(backgroundColor) if backgroundColor

    @current = @backgrounds.first()
    @backgrounds.change @set

    @el.empty()
    @el.append('<h3>Background</h3>')

    # List
    @list = new List
      current: @current
      backgrounds: @backgrounds

    @list.bind 'change', (@current) =>
      @edit.change @current

    @append @list.render()

    # Edit
    @edit = new Edit(background: @current)
    @edit.bind 'change', => @backgrounds.change()
    @append @edit

    this

  set: =>
    @stage.history.record('background')
    @stage.selection.set('backgroundColor', @backgrounds.getColor())
    @stage.selection.set('backgroundImage', @backgrounds.getImages())

  release: ->
    @edit?.release()
    @list?.release()
    super

module.exports = BackgroundInspector