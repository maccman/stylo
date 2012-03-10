class Element extends Spine.Controller
  css: (types) ->
    for key, value of types
      @[key]?(value) or @el.css(key, value)

  rotate: (val) ->
    @el.transform(rotate: val)

module.exports = Element