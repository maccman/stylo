/* CSS property parser */

// Top level parsers

// Default empty parser
start
  =

// HEX/RGBA Color parser
//
// Format:
//   #FFF / #FFFFFF / rgba(0, 0, 0, 0) / transparent / black
//
color
  = hexColor / rgba / transparent / shortcutColor

// Multiple background image parser
//
// Format:
//   url(...), linear-gradient(...)
//
backgroundImages
  = (_ image:backgroundImage _ ","? { return image; })*

// Box and text shadow parser
//
// Format:
//   #FFF 1px 1px 2px 3px inset
//
shadow
  = color:color __ x:px __ y:px blur:(__ px)? spread:(__ px)? inset:(__ "inset")? _ {
    var Shadow = require('app/models/properties/shadow');

    var props = {
      color:  color,
      x:      x,
      y:      y,
      blur:   blur[1],
      spread: spread[1],
      inset:  !!inset[1]
    };

    return new Shadow(props);
  }

// Background images

backgroundImage
  = linearGradient / url

// linear-gradient(top left, white, #a6f2c0 30%, rgba(180, 200, 210, .9), black)
linearGradient
  = "-webkit-"? "linear-gradient(" _ position:(position _)? stops:colorStopList* ")" {
    var LinearGradient = require('app/models/properties/background').LinearGradient;
    return new LinearGradient(position[0], stops);
  }

radialGradient
  = "radial-gradient(" ")"

url
  = "url(" href:( !")" s:. { return s; })* ")" {
    href = href.join('').replace(/["']{1}/gi, "");

    var URL = require('app/models/properties/background').URL;
    return new URL(href);
  }

position
  = angle:(angle / positionKeyword) {
    var Position = require('app/models/properties/background').Position;
    return new Position(angle);
  }

colorStopList
  = "," _ stop:colorStop _ { return stop }

colorStop
  = color:color length:(_ number "%"?)? {
    var ColorStop = require('app/models/properties/background').ColorStop;
    return new ColorStop(color, length[1]);
  }

// Position

positionKeyword
  = keywords:(positionKeywordMultiple / positionKeywordSingle) {
    var x, y, mapping;

    mapping = {
      left:   0,
      bottom: 90,
      right:  180,
      top:    270
    };

    var x = mapping[keywords[0]] || 0;
    var y = mapping[keywords[1]] || 0;

    if (y) {
      x /= 2;
      y /= 2;
    }

    return x + y;
  }

positionKeywordMultiple
  = key:(
      "top"    __ "left"
    / "top"    __ "right"
    / "bottom" __ "left"
    / "bottom" __ "right"
    / "right"  __ "top"
    / "right"  __ "bottom"
    / "left"   __ "top"
    / "left"   __ "bottom"
    ) {
      return [key[0], key[2]];
    }

positionKeywordSingle
 = key:("top" / "left" / "bottom" / "right") {
    return [key];
  }

// Color

hexColor
  = "#" hex:(hexColorShort / hexColorLong) {
      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);

      var Color = require('app/models/properties/color');
      return new Color(r, g, b);
    }

hexColorLong
  = hexes:hex+ {
      return hexes.join('');
    }

hexColorShort
  = h1:hex h2:hex h3:hex !hex {
      return h1 + h1 + h2 + h2 + h3 + h3;
    }

rgba
  = "rgb" "a"? "(" elements:elements ")" {
    var Color = require('app/models/properties/color');
    return new Color(elements[0], elements[1], elements[2], elements[3]);
  }

transparent
  = "transparent" {
      var Color = require('app/models/properties/color');
      return new Color.Transparent;
    }

shortcutColor
  = "red" / "tan" / "grey" / "gray" / "lime" / "navy" / "blue" /
    "teal" / "aqua" / "cyan" / "gold" / "peru" / "pink" / "plum" / "snow"
  / "white" {
      var Color = require('app/models/properties/color');
      return new Color.White;
    }
  / "black" {
      var Color = require('app/models/properties/color');
      return new Color.Black;
    }

// Utilities

elements
  = _ head:value _ tail:("," _ value _)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][2]);
      }
      return result;
    }

value
  = number

number
  = float
  / integer

integer
  = digits:[0-9]+ {
      return parseInt(digits.join(""), 10);
    }

float
  = before:[0-9]* "." after:[0-9]+ {
      return parseFloat(before.join("") + "." + after.join(""));
    }

px
  = number:number "px" { return number; }

percent
  = number:number "%" { return number; }

angle
  = number:number "deg" { return number; }

hex
  = [0-9a-fA-F]

_ "whitespace"
  = whitespace*

__ "required whitespace"
  = whitespace+

whitespace
  = [ \t\n\r]