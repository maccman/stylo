// CSS Color parser

start
  = hexcolor / rgba / shortcut

hexcolor "hexcolor"
  = hex:(hexcolorshort / hexcolorlong) {
      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);

      var Color = require("app/models/properties/color");
      return new Color(r, g, b);
    }

hexcolorlong
  = "#" hexes:hex* {
      return hexes.join('');
    }

hexcolorshort
  = "#" h1:hex h2:hex h3:hex {
      return h1 + h1 + h2 + h2 + h3 + h3;
    }

hex
  = [0-9a-fA-F]

rgba "rgba"
  = ("rgb(" elements:elements ")" / "rgba(" elements:elements ")") {
      elements = elements.map(function(i){ return parseFloat(i) });

      var Color = require('app/models/properties/color');
      return new Color(elements[0], elements[1], elements[2], elements[3]);
    }

shortcut "shortcut"
  = "red" / "tan" / "grey" / "gray" / "lime" / "navy" / "blue" /
    "teal" / "aqua" / "cyan" / "gold" / "peru" / "pink" / "plum" / "snow"

// Utilities

elements
  = head:.* tail:("," .*)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][2]);
      }
      return result;
    }