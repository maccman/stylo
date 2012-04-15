Image = require('app/controllers/elements/image')

class DropArea extends Spine.Controller
  events:
    'drop': 'drop'
    'dragenter': 'cancel'
    'dragover':  'cancel'
    'dragleave': 'cancel'

  constructor: (@stage) ->
    super(el: @stage.el)
    $('body').bind('drop', @cancel)

  drop: (e) ->
    e.preventDefault()
    e = e.originalEvent

    for file in e.dataTransfer.files
      reader = new FileReader
      reader.onload = (e) =>
        @addImage(e.target.result)
      reader.readAsDataURL(file)

  addImage: (src) ->
    @stage.history.record()

    element = new Image(src: src)

    @stage.add(element)
    @stage.selection.clear()
    @stage.selection.add(element)

  cancel: (e) ->
    e.preventDefault()

  release: ->
    $('body').unbind('drop', @cancel)

module.exports = DropArea