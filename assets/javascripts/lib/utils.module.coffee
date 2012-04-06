dasherize = (str) ->
  str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
     .replace(/([a-z\d])([A-Z])/g, '$1-$2')
     .toLowerCase()

module.exports =
  dasherize: dasherize