# This class serializes objects into a JSON string,
# and then can de-serialize JSON strings into instances.
#
# Serialized objects are in the following format:
#   {id: 'path/to/module.Exports', value: objectValue}
#
# You should override the object's value:
#   toValue: -> @properties
#
# The objects value will be passed to it's constructor
# function upon instantiation.

fromObject = (object) ->
  # If type is native, return
  unless typeof object is 'object'
    return object

  # If type is array, call recursively
  if Array.isArray(object)
    return (fromObject(o) for o in object)

  # If type is object, and we're not dealing
  # with a instance, resolve recursively
  unless object.id
    for k, v of object
      object[k] = fromObject(v)
    return object

  # Otherwise, we're dealing with an instance.
  # Find the instance by ID, and then instantiate
  # it, passing object.value

  [path, name] = object.id.split('.', 2)
  constructor  = require(path)
  constructor  = constructor[name] if name

  # Constructor supports a custom fromValue function
  if result = constructor.fromValue?(object)
    return result

  # Recursively find objects
  args = fromObject(object.value)

  if Array.isArray(args)

    # Constructor functions can't
    # use apply() or call(), so we have
    # to manually pass arguments.
    new constructor(
      args[0], args[1], args[2],
      args[3], args[4], args[5]
    )

  else
    new constructor(args)

fromJSON = (object) ->
  if typeof object is 'string'
    object = JSON.parse(object)
  fromObject(object)

Serialize =
  # ID Needs to be overridden in each
  # class Serialize is included in
  id: ->
    module.id

  toJSON: ->
    result =
      id: @id?() or @id
      value: @toValue?() or @toValue

module.exports.Serialize = Serialize
module.exports.fromJSON  = fromJSON