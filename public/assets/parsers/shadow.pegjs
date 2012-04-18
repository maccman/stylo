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
  = number "px"

number "number"
  = int_:int frac:frac exp:exp _ { return parseFloat(int_ + frac + exp); }
  / int_:int frac:frac _         { return parseFloat(int_ + frac);       }
  / int_:int exp:exp _           { return parseFloat(int_ + exp);        }
  / int_:int _                   { return parseFloat(int_);              }

int
  = digit19:digit19 digits:digits     { return digit19 + digits;       }
  / digit:digit
  / "-" digit19:digit19 digits:digits { return "-" + digit19 + digits; }
  / "-" digit:digit                   { return "-" + digit;            }

frac
  = "." digits:digits { return "." + digits; }

exp
  = e:e digits:digits { return e + digits; }

digits
  = digits:digit+ { return digits.join(""); }

digit
  = [0-9]

digit19
  = [1-9]

_ "whitespace"
  = whitespace*

whitespace
  = [ \t\n\r]