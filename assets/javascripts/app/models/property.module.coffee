Collection = require('lib/collection')
Serialize  = require('./serialize').Serialize

class Values extends Collection
  toString: ->
    @join(', ')

class Property extends Spine.Module
  @include Serialize

  # We override valueOf to properties
  # can be easily compared with each other.
  # This could be a performance bottleneck.
  # valueOf: ->
  #   JSON.stringify(this)

module.exports = Property
module.exports.Values = Values