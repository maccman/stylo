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
    'input[name=width]': '$width'
    'input, select': '$inputs'

  current: 'border'

  render: =>
    @disabled = not @stage.selection.isAny()
    @disabled = true if @stage.selection.get('border') is false

    @html JST['app/views/inspector/border'](this)

    # Color input
    @$color = new ColorPicker.Preview
    @$color.bind 'change', => @inputChange()

    @$('input[type=color]').replaceWith(@$color.el)
    @change(@current)

    @el.toggleClass('disabled', @disabled)
    @$inputs.attr('disabled', @disabled)
    this

  change: (@current) ->
    return if @disabled

    @$borders.removeClass('active')
    @$borders.filter("[data-border=#{@current}]").addClass('active')

    @currentBorder = @stage.selection.get(@current)

    unless @currentBorder
      # Base this border on the default one.
      @currentBorder = @stage.selection.get('border')?.clone()
      @currentBorder or= new Border

    @$width.val(@currentBorder.width)
    @$style.val(@currentBorder.style)
    @$color.val(@currentBorder.color)

  borderClick: (e) ->
    @change($(e.currentTarget).data('border'))

  inputChange: ->
    @currentBorder.width = parseInt(@$width.val(), 10)
    @currentBorder.style = @$style.val()
    @currentBorder.color = @$color.val()
    @set()

  set: ->
    # Border overrides everything else
    if @current is 'border'
      @stage.selection.set(
        borderTop: null
        borderRight: null
        borderBottom: null
        borderLeft: null
      )

    @stage.selection.set(@current, @currentBorder)

  release: ->
    @$color?.release()
    super

module.exports = BorderController