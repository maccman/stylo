class BorderRadius extends Spine.Controller
  className: 'borderRadius'

  events:
    'click [data-border-radius]': 'borderClick'
    'change input': 'inputChange'

  elements:
    '.borders div': '$borders'
    'input': '$inputs'

  current: 'borderRadius'

  constructor: ->
    super
    @html JST['app/views/inspector/border_radius'](this)

  render: =>
    # Disable unless elements are selected or if an
    # element, such as an ellipsis, is selected.
    @disabled = not @stage.selection.isAny()
    @disabled = true if @stage.selection.get('borderRadius') is false

    @change(@current)

    @el.toggleClass('disabled', @disabled)
    @$inputs.attr('disabled', @disabled)

    this

  # Private

  change: (@current) ->
    return if @disabled

    @$borders.removeClass('active')
    @$borders.filter("[data-border-radius=#{@current}]").addClass('active')

    @radius = @stage.selection.get(@current)
    @radius or= @stage.selection.get('borderRadius')
    @radius or= 0

    @$inputs.val(@radius)

  # Events

  borderClick: (e) ->
    @change($(e.currentTarget).data('border-radius'))

  inputChange: (e) ->
    val = parseInt($(e.currentTarget).val(), 10)
    @$inputs.val(val)
    @set(val)

  set: (val) ->
    @stage.history.record('borderRadius')

    # borderRadius overrides everything else
    if @current is 'borderRadius'
      @stage.selection.set(
        borderTopLeftRadius: null
        borderTopRightRadius: null
        borderBottomRightRadius: null
        borderBottomLeftRadius: null
      )

    @stage.selection.set(@current, val)

module.exports = BorderRadius