Serialize = require('app/models/serialize')

class Clipboard
  constructor: (@stage) ->
    $(window).bind 'beforecopy', @cancel
    $(window).bind 'copy', @copy

    $(window).bind 'beforepaste', @cancel
    $(window).bind 'paste', @paste

  cancel: (e) =>
    # We need to cancel the default to get
    # the 'copy' event to trigger
    e.preventDefault()

  copy: (e) =>
    return unless @stage.selection.isAny()

    e.preventDefault()
    e = e.originalEvent

    json = JSON.stringify(@stage.selection.elements)
    e.clipboardData.setData('json/x-stylo', json)

    html = (el.outerHTML() for el in @stage.selection.elements)
    e.clipboardData.setData('text/html', html.join("\n"))

    styles = (el.outerCSS() for el in @stage.selection.elements)
    e.clipboardData.setData('text/plain', styles.join("\n\n"))

  paste: (e) =>
    return if 'value' of e.target

    e.preventDefault()
    e = e.originalEvent

    json     = e.clipboardData.getData('json/x-stylo')
    return unless json

    elements = Serialize.fromJSON(json)

    @stage.add(el) for el in elements
    @stage.selection.clear()
    @stage.selection.add(el) for el in elements


module.exports = Clipboard