Serialize = require('app/models/serialize')

class Clipboard
  constructor: (@stage) ->
    $(window).bind 'beforecopy', @cancel
    $(window).bind 'copy', @copy

    # Remove pasting for the moment, until
    # it's better supported in browsers
    #
    # $(window).bind 'beforepaste', @cancel
    # $(window).bind 'paste', @paste

  cancel: (e) =>
    return if 'value' of e.target
    return if $(e.target).attr('contenteditable')

    # We need to cancel the default to get
    # the 'copy' event to trigger
    e.preventDefault()

  copy: (e) =>
    return unless @stage.selection.isAny()

    e.preventDefault()
    e = e.originalEvent

    json = JSON.stringify(@stage.selection.elements)
    e.clipboardData.setData('json/x-stylo', json)

    styles = (el.outerCSS() for el in @stage.selection.elements)
    e.clipboardData.setData('text/plain', styles.join("\n\n"))

  paste: (e) =>
    return if 'value' of e.target

    e.preventDefault()
    e = e.originalEvent

    # Some browsers restrict the clipboard data types,
    # so we need to revert back to text/html
    json = e.clipboardData.getData('json/x-stylo')
    return unless json

    elements = Serialize.fromJSON(json)

    @stage.history.record()
    @stage.add(el) for el in elements
    @stage.selection.refresh(elements)
    @stage.selection.moveBy(left: 10, top: 10)

  data: null

  copyInternal: ->
    @data = (el.clone() for el in @stage.selection.elements)

  pasteInternal: (e) ->
    return unless @data

    @stage.history.record()
    @stage.add(el) for el in @data
    @stage.selection.refresh(@data)
    @stage.selection.moveBy(left: 10, top: 10)

    # Re-clone the elements
    @copyInternal()

    # Cancel event propogation
    false

  release: ->
    $(window).unbind 'beforecopy', @cancel
    $(window).unbind 'copy', @copy
    $(window).unbind 'beforepaste', @cancel
    $(window).unbind 'paste', @paste

module.exports = Clipboard