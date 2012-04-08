Property = require('app/models/property')
Color    = require('./color')

class Border extends Property
  id: module.id

  constructor: (@width = 0, @style = 'solid', @color = new Color.Black) ->

  toString: ->
    [@width + 'px', @style, @color].join(' ')

  toValue: ->
    [@width, @style, @color]

module.exports = Border