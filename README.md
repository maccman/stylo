A Photoshop replacement. Inspired by Keynote. Democratizing design.

##TODO

Phase 1:

* ✓ Move
* ✓ Resize
* ✓ Select
* ✓ Select multiple items
* ✓ Toolbar menu
* Inspector panel (Element/Text/Ruler)
  * ½ Background
  * Border
  * ½ Shadow
  * Font alignment
  * Font family/size/style/color
  * ✓ Text-shadow
  * Text-spacing
  * Rotation
  * ✓ Opacity

Phase 2:

* ✓ Stage snapping
* ✓ Color picker
* Copy paste
* Undo/redo (on set())
* Resizing snapping
* Element snapping
* Canvas snapping
* Pen tool
* Layers
* Scaling stage & size
* Z-index
* Keyboard shortcuts
* Saving/opening

Nice to have:

* Versioning
* Exporting HTML
* Share (dropbox/email?)
* Clone HTML components

Inherit Ellipsis from Rectangle (resizing & lines).

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

##Elements

* Triangle
* ✓ Rectangle
* ✓ Ellipsis
* Form elements
* Text
* Image
* Line tool?
* Link?

##Canvas CSS properties

background-clip: border-box;
background-color: transparent;
background-image: none;
background-position: 0% 0%;
background-repeat: repeat;
background-size: auto;

border-bottom-color: #555;
border-bottom-left-radius: 0px;
border-bottom-right-radius: 0px;
border-bottom-style: none;
border-bottom-width: 0px;

border-left-color: #555;
border-left-style: none;
border-left-width: 0px;
border-right-color: #555;
border-right-style: none;
border-right-width: 0px;
border-top-color: #555;
border-top-left-radius: 0px;
border-top-right-radius: 0px;
border-top-style: none;
border-top-width: 0px;

box-shadow: none;
color: #555;

filter: none;
height: 20px;

width: 848px;
z-index: auto;

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