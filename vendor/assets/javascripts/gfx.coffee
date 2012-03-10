$ = jQuery ? require('jqueryify')

throw 'jQuery required' unless $

$.support.transition or= do ->
  style = (new Image).style
  'transition' of style or
   'webkitTransition' of style or
    'MozTransition' of style

vendor = if $.browser.mozilla then 'moz'
vendor or= 'webkit'
prefix = "-#{vendor}-"

vendorNames = n =
  transition: "#{prefix}transition"
  transform: "#{prefix}transform"
  transitionEnd: "#{vendor}TransitionEnd"

defaults =
  duration: 400
  queue: true
  easing: ''
  enabled: $.support.transition

transformTypes = [
  'scale', 'scaleX', 'scaleY', 'scale3d',
  'rotate', 'rotateX', 'rotateY', 'rotateZ', 'rotate3d',
  'translate', 'translateX', 'translateY', 'translateZ', 'translate3d',
  'skew', 'skewX', 'skewY',
  'matrix', 'matrix3d', 'perspective'
]

# Internal helper functions

$.fn.queueNext = (callback, type) ->
  type or= "fx";

  @queue ->
    callback.apply(this, arguments)
    redraw = this.offsetHeight
    jQuery.dequeue(this, type)

$.fn.emulateTransitionEnd = (duration) ->
  called = false
  $(@).one(n.transitionEnd, -> called = true)
  callback = => $(@).trigger(n.transitionEnd) unless called
  setTimeout(callback, duration)

# Helper function for easily adding transforms

$.fn.transform = (properties, options) ->
  opts = $.extend({}, defaults, options)
  return this unless opts.enabled

  transforms = []

  for key, value of properties when key in transformTypes
    transforms.push("#{key}(#{value})")
    delete properties[key]

  if transforms.length
    properties[n.transform] = transforms.join(' ')

  if opts.origin
    properties["#{prefix}transform-origin"] = opts.origin

  $(@).css(properties)

$.fn.gfx = (properties, options) ->
  opts = $.extend({}, defaults, options)
  return this unless opts.enabled

  properties[n.transition] = "all #{opts.duration}ms #{opts.easing}"

  callback = ->
    $(@).css(n.transition, '')
    opts.complete?.apply(this, arguments)
    $(@).dequeue()

  @[ if opts.queue is false then 'each' else 'queue' ] ->
    $(@).one(n.transitionEnd, callback)
    $(@).transform(properties)

    # Sometimes the event doesn't fire, so we have to fire it manually
    $(@).emulateTransitionEnd(opts.duration + 50)