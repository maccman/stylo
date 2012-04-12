dasherize = (str) ->
  str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
     .replace(/([a-z\d])([A-Z])/g, '$1-$2')
     .toLowerCase()

# Differentiate Safari from Chrome
$.browser.chrome =  /chrome/.test(
  navigator.userAgent.toLowerCase()
)

requestAnimationFrame = do ->
  request =
      window.requestAnimationFrame or
      window.webkitRequestAnimationFrame or
      window.mozRequestAnimationFrame or
      window.oRequestAnimationFrame or
      window.msRequestAnimationFrame or
      (callback) ->
        window.setTimeout(callback, 1000 / 60)

  (callback) ->
    request.call(window, callback)

module.exports =
  dasherize: dasherize
  browser: $.browser
  requestAnimationFrame: requestAnimationFrame