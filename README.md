A Photoshop replacement. Inspired by Keynote. Democratizing design.

##TODO

Phase 1:

* ✓ Move
* ✓ Resize
* ✓ Select
* ✓ Select multiple items
* ✓ Toolbar menu
* Inspector panel (Element/Text/Ruler)

Phase 2:

* ✓ Stage snapping
* Resizing snapping
* Element snapping
* Canvas snapping
* Undo/redo
* Pen tool
* Layers
* Color picker
* Scaling stage & size
* Z-index
* Keyboard shortcuts

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
* Ellipsis
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

#

