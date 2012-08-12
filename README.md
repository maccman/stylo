# Stylo

Stylo is a web app designer written in [CoffeeScript](http://coffeescript.org) and [Spine](http://spinejs.com). It allows you to manipulate various HTML elements, add styles and edit text.

You can find a [demo here](http://styloapp.com/) *(webkit only)*.

[![Stylo](http://img.svbtle.com/maccman-24077671832628-raw.png)](http://styloapp.com/)

## Code examples

The code should provide good examples of how to achieve the following:

* [Element snapping](https://github.com/maccman/stylo/blob/master/assets/javascripts/app/controllers/stage/snapping.module.coffee), [resizing](https://github.com/maccman/stylo/blob/master/assets/javascripts/app/controllers/stage/resizing.module.coffee) and [drag/drop](https://github.com/maccman/stylo/blob/master/assets/javascripts/app/controllers/stage/dragging.module.coffee)
* [Copy/paste](https://github.com/maccman/stylo/blob/master/assets/javascripts/app/controllers/stage/clipboard.module.coffee), [undo/redo](https://github.com/maccman/stylo/blob/master/assets/javascripts/app/controllers/stage/history.module.coffee) &amp; [keyboard shortcuts](https://github.com/maccman/stylo/blob/master/assets/javascripts/app/controllers/stage/key_bindings.module.coffee)
* [Context menus](https://github.com/maccman/stylo/blob/master/assets/javascripts/app/controllers/stage/context_menu.module.coffee) and [z-index ordering](https://github.com/maccman/stylo/blob/master/assets/javascripts/app/controllers/stage/zindex.module.coffee)
* [Color picker using canvas](https://github.com/maccman/stylo/blob/master/assets/javascripts/lib/color_picker.module.coffee)
* [JSON object instance serialization](https://github.com/maccman/stylo/blob/master/assets/javascripts/app/models/serialize.module.coffee)

## More

For more information, please see the [blog post](http://blog.alexmaccaw.com/stylo).