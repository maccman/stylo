class Font extends Spine.Controller
  className: 'font'

  elements:
    'input': '$inputs'

  render: =>
    @disabled = not @stage.selection.isAny()
    @fontSize  = @stage.selection.get('fontSize') ? 12

    @html JST['app/views/inspector/font'](this)

    # Color
    # Size
    # Font family

    # Style
    # Decoration
    # Capitalize
    # Alignment

    # text-indent
    # Line-height
    # letter-spacing
    # word-spacing


  change: (e) ->
    # val = parseFloat($(e.currentTarget).val())
    # val = Math.round(val * 100) / 100
    #
    # @stage.history.record('opacity')
    # @stage.selection.set('opacity', val)
    # @$inputs.val(val)

module.exports = Font