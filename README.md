A Photoshop replacement. Inspired by Keynote. Democratizing design.

##TODO

Phase 1:

* ✓ Move
* ✓ Resize
* ✓ Select
* ✓ Select multiple items
* ✓ Toolbar menu
* Inspector panel (Element/Text/Ruler)
  * ½ Background (type/direction)
  * ✓ Border
  * ½ Shadow (inset)
  * ✓ Text-shadow
  * Rotation
  * ✓ Opacity
  * ✓ content editable
  * ✓ context menu
  * Font alignment
  * Font family/size/style/color
  * Text-shadow
  * Text-spacing (line height)

Phase 2:

* ✓ Stage snapping
* ✓ Color picker
* Stage inspector
* ✓ Z-index
* ✓ Copy paste
* ✓ Undo/redo
* ½ Saving/opening

Phase 3:

* Resizing snapping
* ✓ Edge snapping
* ✓ Element snapping
* Pen tool

Nice to have:

* ✓ Keyboard shortcuts
* Versioning
* Exporting HTML?
* ✓ Exporting CSS
* Share (dropbox/email?)
* Clone HTML components
* WebFonts
* Layers?
* ✓ Context menu
* Similar distance snapping

##Elements

* Triangle
* ✓ Rectangle
* ✓ Ellipsis
* Form elements
* ✓ Text
* ✓ Image
* Line

##Fixes:

* Background image
* Background gradient rotation
* Color inspector movable window
* Dragging right and up doesn't select elements - offset by the header
* We want the resize to be around the selection?
* ✓ We want the inspector not to completely re-render on selection
* ✓ You can have negative widths

-------------------------------------------------------------------------------------------------------------------------------------

##Rulers & Snap

When moving element - cycle through all the other elements, compare the sides - inject rulers if necessary. Also show rulers for center of page. Need to think about how multiple selected items works.

Two types of snapping:

* Line snapping to:
  * Center of page (x/y) axis
  * Bottom/left/right side of pages?
  * Sides of elements?
  * Middle of elements
* Width snapping:
  * Detect distance between elements - snap when two distances are the same.

#Save to png

https://github.com/paulhammond/webkit2png/blob/master/webkit2png
https://developer.apple.com/library/mac/#samplecode/ScreenSnapshot/Listings/ScreenSnapshot_ImageView_m.html#//apple_ref/doc/uid/DTS40011158-ScreenSnapshot_ImageView_m-DontLinkElementID_7
http://www.cocoadev.com/index.pl?HowToAcquireScreenshots
http://www.sticksoftware.com/developer/Screensnap.m.txt
https://github.com/appcelerator/titanium_desktop/blob/master/modules/ti.Platform/PlatformMac.mm

http://www.cssdesk.com/

http://10k.aneventapart.com/2/Uploads/579/

http://10k.aneventapart.com/2/Uploads/504/

AN EASY WAY TO CHOOSE COLORS - I.E. BURN ETC
Video of desiging various interfaces = include Stylo.
Tool to generate noise.

https://developers.google.com/webfonts
https://typekit.com/

Issue with border radius is that properties are being applied in the wrong order.
Should 'selected' not be a property?
Only save selection in history.
We should have a benchmarking testing library.