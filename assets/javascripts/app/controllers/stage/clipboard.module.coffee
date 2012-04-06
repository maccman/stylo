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
    console.log('paste', e)

module.exports = Clipboard