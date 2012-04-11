class Popup extends Spine.Controller
  @open: ->
    (new this).open(arguments...)

  width: 400

  constructor: ->
    super
    @el.delegate 'click', '.close', @close
    @el.addClass('popup')
    @el.css(position: 'absolute').hide()

  open: (position = {left: 0, top: 0}) =>
    left = position.left or position.clientX
    top  = position.top  or position.clientY

    left -= @width + 17
    top  -= 5

    @el.css(left: left, top: top)
    $('body').append(@el)
    @el.gfxRaisedIn()

    @delay ->
      $('body').mousedown(@remove)

  close: =>
    $('body').unbind('mousedown', @remove)
    @el.gfxRaisedOut()
    @el.queueNext =>
      @release()
      @trigger 'close'

  remove: (e) =>
    # Hide unless the click was on the popup
    unless $(e.target).closest(@el).length
      @close()

  isOpen: ->
    !!@el.parent().length

module.exports = Popup