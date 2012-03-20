class Popup extends Spine.Controller
  @open: ->
    (new this).open(arguments...)

  width: 350

  events:
    'click .close': 'close'

  constructor: ->
    super
    @el.addClass('popup')
    @el.css(position: 'absolute').hide()

  open: (position = {left: 0, top: 0}) ->
    left = position.left or position.clientX
    top  = position.top  or position.clientY

    left -= @width + 17
    top  -= 5

    @el.css(left: left, top: top)
    $('body').append(@el)
    @el.gfxRaisedIn()

    @delay ->
      $('body').click(@remove)

  close: ->
    $('body').unbind('click', @remove)
    @el.gfxRaisedOut()
    @el.queueNext =>
      @el.remove()
      @trigger 'hide'

  remove: (e) =>
    # Hide unless the click was on the popup
    unless $(e.target).closest(@el).length
      @close()

module.exports = Popup