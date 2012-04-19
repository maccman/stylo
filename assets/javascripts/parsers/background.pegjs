URI "uri"
  = "url(" value:string / .* ")"

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

string1
  = '"' chars:([^\n\r\f\\"] / "\\" nl:nl { return nl } / escape)* '"' {
      return chars.join("");
    }

string2
  = "'" chars:([^\n\r\f\\'] / "\\" nl:nl { return nl } / escape)* "'" {
      return chars.join("");
    }

string
  = string1
  / string2

_ "whitespace"
  = whitespace*

whitespace
  = [ \t\n\r]