Element    = require('../element')
Color      = require('app/models/properties/color')
Background = require('app/models/properties/background')

class Button extends Element
  events:
    'resize.element': 'syncLineHeight'

  defaults: ->
    result =
      width: 100
      height: 40
      textAlign: 'center'
      lineHeight: 40
      borderRadius: 5
      borderWidth: 1
      borderStyle: 'solid'
      borderColor: new Color(166, 166, 166)
      backgroundImage: [new Background.LinearGradient(
        new Background.Position(270),
        [
          new Background.ColorStop(new Color.White, 0),
          new Background.ColorStop(new Color.White, 30),
          new Background.ColorStop(new Color(242,242,242), 100)
        ]
      )]

  syncLineHeight: ->
    @set(lineHeight: @get('height'))

module.exports = Button