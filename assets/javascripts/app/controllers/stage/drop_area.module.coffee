module.exports = DropArea

Image = require('app/controllers/elements/image')

class DropArea extends Spine.Controller
  events:
    'dragover':  'cancel'
    'drop':      'drop'

  constructor: (@stage) ->
    super(el: @stage.el)
    $('body').bind('dragover', @cancel)

  drop: (e) ->
    e.preventDefault()
    e = e.originalEvent

    for file in e.dataTransfer.files
      reader = new FileReader
      reader.onload = (e) =>
        @addImage(e.target.result)
      reader.readAsBinaryString(file)

  addImage: (src) ->
    @stage.history.record()

    element = new Image(src: src)

    @stage.add(element)
    @stage.selection.clear()
    @stage.selection.add(element)

  cancel: (e) ->
    e.stopPropagation()
    e.preventDefault()

  release: ->
    $('body').unbind('dragover', @cancel)

module.exports = DropArea