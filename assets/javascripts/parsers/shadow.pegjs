// CSS Shadow parser

start
  = inset:"inset"? color:color (values:px _ *) {
    var Shadow   = require('app/models/properties/shadow');
    var props    = {};
    props.inset  = !!inset;
    props.x      = values[0];
    props.y      = values[1];
    props.blur   = values[2];
    props.spread = values[3];
    return new Shadow(options);
  }

px
  = num "px"

num
  = float
  / integer

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

float
  = before:[0-9]* "." after:[0-9]+ {
      return parseFloat(before.join("") + "." + after.join(""));
    }

_ "whitespace"
  = whitespace*

whitespace
  = [ \t\n\r]