Border      = require('app/models/properties/border')
ColorPicker = require('lib/color_picker')

class BorderController extends Spine.Controller
  className: 'border'

  events:
    'click [data-border]': 'borderClick'
    'change': 'inputChange'

  elements:
    '.borders div': '$borders'
    'select[name=style]': '$style'
    'input[name=thickness]': '$thickness'

  current: 'border'

  constructor: ->
    super
    @render()

  render: =>
    @html JST['app/views/inspector/border'](this)

    # Color input
    @$color = new ColorPicker.Preview
    @$color.bind 'change', => @inputChange()

    @$('input[type=color]').replaceWith(@$color.el)
    @change(@current)

  change: (@current) ->
    @$borders.removeClass('active')
    @$borders.filter("[data-border=#{@current}]").addClass('active')

    @currentBorder = @stage.selection.get(@current)

    unless @currentBorder
      # Base this border on the default one.
      @currentBorder = @stage.selection.get('border')?.clone()
      @currentBorder or= new Border

    @$thickness.val(@currentBorder.width)
    @$style.val(@currentBorder.style)
    @$color.val(@currentBorder.color)

  borderClick: (e) ->
    @change($(e.currentTarget).data('border'))

  inputChange: ->
    @currentBorder.width = parseInt(@$thickness.val(), 10)
    @currentBorder.style = @$style.val()
    @currentBorder.color = @$color.val()
    @set()

  set: ->
    @stage.selection.set(@current, @currentBorder)

module.exports = BorderController