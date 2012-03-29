Collection  = require('lib/collection')
Color       = require('app/models/properties/color')
BackgroundImage = require('app/models/properties/background_image')

class List

class Background extends Spine.Controller
  className: 'background'

  # styles: [
  #   'background',
  #   'backgroundColor',
  #   'backgroundImage',
  #   'backgroundRepeat',
  #   'backgroundSize'
  # ]
  #

  constructor: ->
    super
    @render()

  render: =>
    @backgroundImage = @stage.selection.get('backgroundImage')
    @backgroundImage = new Collection(@backgroundImage)

    @backgroundColor = @stage.selection.get('backgroundColor')

    @el.empty()
    @el.append('<h3>Background</h3>')

  set: =>
    @stage.selection.set('backgroundImage', @backgroundImage.valueOf())

module.exports = Background