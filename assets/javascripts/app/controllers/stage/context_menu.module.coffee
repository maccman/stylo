class Menu extends Spine.Controller
  className: 'contextMenu'

  events:
    'mousedown': 'cancel'
    'click [data-type]': 'click'

  constructor: (@stage, position) ->
    super()

    @el.css(position)
    @html(JST['app/views/context_menu'](this))

    @selectDisabled = not @stage.selection.isAny()
    @$('[data-require=select]').toggleClass('disabled', @selectDisabled)

  click: (e) ->
    e.preventDefault()
    @release()

    item = $(e.currentTarget)
    type = item.data('type')

    unless item.hasClass('disabled')
      @[type]()

  cancel: (e) ->
    # Stop the menu closing immediately
    e.preventDefault()
    e.stopPropagation()

  # Types

  copy: ->
    @stage.clipboard.copyInternal()

  paste: ->
    @stage.clipboard.pasteInternal()

  bringForward: ->
    @stage.history.record()
    @stage.bringForward()

  bringBack: ->
    @stage.history.record()
    @stage.bringBack()

  bringToFront: ->
    @stage.history.record()
    @stage.bringToFront()

  bringToBack: ->
    @stage.history.record()
    @stage.bringToBack()

class ContextMenu extends Spine.Controller
  events:
    'contextmenu': 'show'

  constructor: (@stage) ->
    super(el: @stage.el)
    $('body').bind('mousedown', @hide)

  show: (e) ->
    e.preventDefault()
    @hide()

    position =
      left: e.pageX + 1
      top:  e.pageY + 1

    @menu = new Menu(@stage, position)
    $('body').append(@menu.el)

  hide: =>
    @menu?.release()
    @menu = null

  release: ->
    $('body').unbind('mousedown', @hide)

module.exports = ContextMenu