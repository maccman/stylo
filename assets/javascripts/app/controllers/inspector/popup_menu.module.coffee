class PopupMenu extends Spine.Controller
  @open: (position) ->
    (new this).open(position)

  popupEvents:
    'mousedown': 'cancel'

  constructor: ->
    super
    @delegateEvents(@popupEvents)
    @el.addClass('popupMenu')
    @el.css(position: 'absolute')

  open: (position = {}) ->
    @el.css(position)
    $('body').append(@el)
    $('body').bind('mousedown', @close)
    this

  close: =>
    @release()
    this

  release: ->
    $('body').unbind('mousedown', @close)
    super

  cancel: (e) ->
    e.stopPropagation()

module.exports = PopupMenu