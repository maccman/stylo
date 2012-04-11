Serialize = require('app/models/serialize')
Utils     = require('lib/utils')

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
    e.clipboardData.setData('text/html', json)

    styles = (el.outerCSS() for el in @stage.selection.elements)
    e.clipboardData.setData('text/plain', styles.join("\n\n"))

  paste: (e) =>
    return if 'value' of e.target

    e.preventDefault()
    e = e.originalEvent

    # Some browsers restrict the clipboard data types,
    # so we need to revert back to text/html
    json = e.clipboardData.getData('json/x-stylo')
    json or= e.clipboardData.getData('text/html')
    return unless json

    elements = Serialize.fromJSON(json)

    @stage.add(el) for el in elements
    @stage.selection.refresh(elements)
    @stage.selection.moveBy(left: 10, top: 10)

  data: null

  copyInternal: ->
    return if Utils.browser.chrome
    @data = (el.clone() for el in @stage.selection.elements)

  pasteInternal: (e) ->
    # At the moment, only Chrome supports
    # the non-focused paste event
    return if Utils.browser.chrome
    return unless @data

    @stage.add(el) for el in @data
    @stage.selection.refresh(@data)
    @stage.selection.moveBy(left: 10, top: 10)

    # Re-clone the elements
    @copyInternal()

    # Cancel event propogation
    false

module.exports = Clipboard