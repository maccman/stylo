Collection = require('lib/collection')

class Values extends Collection
  toString: ->
    @join(', ')

class Property

module.exports = Property
module.exports.Values = Values