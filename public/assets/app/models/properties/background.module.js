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
this.require.define({"app/models/properties/background":function(exports, require, module){(function() {
  var Background, BackgroundImage, Color, ColorStop, LinearGradient, Position, Property, URL,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  Property = require('app/models/property');

  Color = require('./color');

  Position = (function() {

    function Position(angle) {
      this.angle = angle != null ? angle : 0;
    }

    Position.prototype.toString = function() {
      return "" + this.angle + "deg";
    };

    return Position;

  })();

  ColorStop = (function() {

    function ColorStop(color, length) {
      this.color = color;
      this.length = length;
      this.color || (this.color = new Color.Black);
    }

    ColorStop.prototype.toString = function() {
      if (this.length) {
        return "" + this.color + " " + this.length + "%";
      } else {
        return "" + this.color;
      }
    };

    return ColorStop;

  })();

  BackgroundImage = (function(_super) {

    __extends(BackgroundImage, _super);

    function BackgroundImage() {
      BackgroundImage.__super__.constructor.apply(this, arguments);
    }

    return BackgroundImage;

  })(Property);

  LinearGradient = (function(_super) {

    __extends(LinearGradient, _super);

    function LinearGradient(position, stops) {
      this.position = position != null ? position : new Position;
      this.stops = stops != null ? stops : [];
    }

    LinearGradient.prototype.toString = function() {
      var stops;
      stops = this.stops.sort(function(a, b) {
        return a.length - b.length;
      });
      return "-webkit-linear-gradient(" + ([this.position].concat(__slice.call(stops)).join(',')) + ")";
    };

    LinearGradient.prototype.toDisplayString = function() {
      var stops;
      stops = this.stops.sort(function(a, b) {
        return a.length - b.length;
      });
      return "linear-gradient(" + ([this.position].concat(__slice.call(stops)).join(', ')) + ")";
    };

    LinearGradient.prototype.addStop = function(stop) {
      return this.stops.push(stop);
    };

    LinearGradient.prototype.removeStop = function(stop) {
      var index;
      index = this.stops.indexOf(stop);
      return this.stops.splice(index, 1);
    };

    return LinearGradient;

  })(BackgroundImage);

  URL = (function(_super) {

    __extends(URL, _super);

    function URL(url) {
      this.url = url;
    }

    URL.prototype.toString = function() {
      return "url('" + this.url + "')";
    };

    return URL;

  })(BackgroundImage);

  Background = (function() {

    function Background(color, images) {
      this.color = color;
      this.images = images != null ? images : [];
    }

    Background.prototype.toString = function() {
      return "" + this.color + " " + this.images;
    };

    return Background;

  })();

  module.exports = Background;

  module.exports.BackgroundImage = BackgroundImage;

  module.exports.LinearGradient = LinearGradient;

  module.exports.URL = URL;

  module.exports.Position = Position;

  module.exports.ColorStop = ColorStop;

}).call(this);
;}});
