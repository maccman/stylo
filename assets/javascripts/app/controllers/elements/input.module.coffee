Element = require('../element')
Color   = require('app/models/properties/color')
Shadow  = require('app/models/properties/shadow')

class Text extends Element
  defaults: ->
    result =
      width: 125
      height: 20
      padding: 3
      backgroundColor: new Color.White
      borderWidth: 1
      borderStyle: 'solid'
      borderColor: new Color(155,155,155)
      boxShadow:   new Shadow(
        inset: true, x: 0, y: 1, blur: 2,
        color: new Color(0, 0, 0, 0.12)
      )

class CheckBox extends Element

module.exports =
  Text: Text
  CheckBox: CheckBox