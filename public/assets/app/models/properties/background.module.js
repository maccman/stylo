(function() {
  if (!this.require) {
    var modules = {}, cache = {};

    var require = function(name, root) {
      var path = expand(root, name), indexPath = expand(path, './index'), module, fn;
      module   = cache[path] || cache[indexPath];
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = indexPath]) {
        module = {id: path, exports: {}};
        cache[path] = module.exports;
        fn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        return cache[path] = module.exports;
      } else {
        throw 'module ' + name + ' not found';
      }
    };

    var expand = function(root, name) {
      var results = [], parts, part;
      // If path is relative
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.define = function(bundle) {
      for (var key in bundle) {
        modules[key] = bundle[key];
      }
    };

    this.require.modules = modules;
    this.require.cache   = cache;
  }

  return this.require;
}).call(this);
this.require.define({"app/models/properties/background.module":function(exports, require, module){(function() {
  var BackgroundImage, Color, LinearGradient, Point, Position, URL,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  Color = require('lib/color_picker').Color;

  Position = (function() {

    Position.prototype.keywords = {
      left: 0,
      bottom: 90,
      right: 180,
      top: 270
    };

    Position.fromRegex = function(keywords, angle) {
      var posh, posv, types;
      if (keywords != null) {
        types = keywords.split(' ');
        posh = this.keywords[types[0]] || 0;
        posv = this.keywords[types[1]] || 0;
        if (posv) {
          posh /= 2;
          posv /= 2;
        }
        return new this(posh + posv);
      } else {
        return new this(angle);
      }
    };

    function Position(angle) {
      this.angle = angle != null ? angle : 0;
    }

    Position.prototype.toString = function() {
      return "" + this.angle + "deg";
    };

    return Position;

  })();

  Point = (function() {

    Point.fromRegex = function(color, length) {
      color = Color.fromString(color);
      length = parseFloat(length) || 0;
      return new this(color, length);
    };

    function Point(color, length) {
      this.color = color;
      this.length = length;
    }

    Point.prototype.toString = function() {
      return "" + this.color + " " + this.length + "%";
    };

    return Point;

  })();

  BackgroundImage = (function() {

    function BackgroundImage() {}

    BackgroundImage.multipleFromString = function(str) {
      var backgrounds, bg;
      backgrounds = [];
      while (str.length) {
        if (bg = LinearGradient.fromString(str)) {
          backgrounds.push(bg);
          str.replace(LinearGradient.regex, '');
        } else if (bg = URL.fromString(str)) {
          backgrounds.push(bg);
          str.replace(URL.regex, '');
        } else {
          throw 'Invalid image';
        }
        str.replace(/^,?\s*/, '');
      }
      return backgrounds;
    };

    return BackgroundImage;

  })();

  LinearGradient = (function(_super) {

    __extends(LinearGradient, _super);

    LinearGradient.regex = /^(?:-webkit-)?linear-gradient\((?:(?:((?:top\s+|bottom\s+)?(?:right|left)|(?:right\s+|left\s+)?(?:top|bottom))|((?:-?[0-9]*\.?[0-9]+)deg|(?:0)))\s*,)?(?:(?:\s*(#(?:[0-9a-f]{3,6})|rgba?\(?:(?:[^)]+)\))(?:\s+(-?[0-9]*\.?[0-9]+)%)?)(?:,\s*(#(?:[0-9a-f]{3,6})|rgba?\(?:(?:[^)]+)\))(?:\s+(-?[0-9]*\.?[0-9]+)%)?)+)\);?/i;

    LinearGradient.fromString = function(str) {
      var match, points, position;
      match = str.match(this.regex);
      if (!match) return;
      match.shift();
      position = Position.fromRegex(match.shift(), match.shift());
      points = [];
      while (match.length) {
        points.push(Point.fromRegex(match.shift(), match.shift()));
      }
      return new this(position, points);
    };

    function LinearGradient(position, points) {
      this.position = position != null ? position : new Position;
      this.points = points != null ? points : [];
    }

    LinearGradient.prototype.toString = function() {
      return "-webkit-linear-gradient(" + ([this.position].concat(__slice.call(this.points)).join(',')) + ")";
    };

    return LinearGradient;

  })(BackgroundImage);

  URL = (function(_super) {

    __extends(URL, _super);

    URL.regex = /^url\(?:(?:"|')?(.+)\1\)/;

    URL.fromString = function(str) {
      var match;
      match = str.match(this.regex);
      if (!match) return;
      return new this(match[1]);
    };

    function URL(url) {
      this.url = url;
    }

    URL.prototype.toString = function() {
      return "url('" + this.url + "')";
    };

    return URL;

  })(BackgroundImage);

  module.exports = BackgroundImage;

  module.exports.LinearGradient = LinearGradient;

  module.exports.URL = URL;

  module.exports.Position = Position;

  module.exports.Point = Point;

}).call(this);
;}});
