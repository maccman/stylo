class Popup extends Spine.Controller
  @open: ->
    (new this).open(arguments...)

  width: 400

  popupEvents:
    'click .close': 'close'
    'mousedown': 'cancelEvent'

  constructor: ->
    super
    @delegateEvents(@popupEvents)
    @el.addClass('popup')
    @el.css(position: 'absolute')

  open: (position = {left: 0, top: 0}) =>
    left = position.left or position.clientX
    top  = position.top  or position.clientY

    left -= @width + 17
    top  -= 5

    @el.css(left: left, top: top).hide()
    $('body').append(@el)
    $('body').bind('mousedown', @close)

    @el.gfxRaisedIn()

  close: =>
    @el.gfxRaisedOut()
    @el.queueNext =>
      @release()
      @trigger 'close'

  release: ->
    $('body').unbind('mousedown', @close)
    super

  isOpen: ->
    !!@el.parent().length

  cancelEvent: (e) ->
    e.stopPropagation()

module.exports = Popup