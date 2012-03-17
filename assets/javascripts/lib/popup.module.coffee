class Popup extends Spine.Controller
  @show: ->
    (new this).show(arguments...)

  constructor: ->
    super
    @el.addClass('popup')
    @el.css(position: 'absolute').hide()

  show: (position = {left: 0, top: 0}) ->
    left = position.left or position.clientX
    top  = position.top  or position.clientY
    @el.css(left: left, top: top)
    $('body').append(@el)
    @el.gfxRaisedIn()

  hide: ->
    @el.gfxRaisedOut()
    @el.queueNext =>
      @el.remove()

module.exports = Popup