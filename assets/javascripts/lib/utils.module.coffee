dasherize = (str) ->
  str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
     .replace(/([a-z\d])([A-Z])/g, '$1-$2')
     .toLowerCase()

# Differentiate Safari from Chrome
$.browser.chrome =  /chrome/.test(
  navigator.userAgent.toLowerCase()
)

module.exports =
  dasherize: dasherize
  browser: $.browser