Collection = require('lib/collection')
Serialize  = require('./serialize').Serialize

class Values extends Collection
  toString: ->
    @join(', ')

class Property extends Spine.Module
  @include Serialize

module.exports = Property
module.exports.Values = Values