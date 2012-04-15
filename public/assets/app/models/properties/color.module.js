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
this.require.define({"app/models/properties/color":function(exports, require, module){(function() {
  var Color, Property,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Property = require('app/models/property');

  Color = (function(_super) {

    __extends(Color, _super);

    Color.name = 'Color';

    Color.regex = /(?:#([0-9a-f]{3,6})|rgba?\(([^)]+)\))/i;

    Color.fromHex = function(hex) {
      var b, g, r;
      if (hex[0] === '#') {
        hex = hex.substring(1, 7);
      }
      if (hex.length === 3) {
        hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
      }
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
      return new this(r, g, b);
    };

    Color.fromString = function(str) {
      var a, b, g, hex, match, r, rgba, _ref;
      match = str.match(this.regex);
      if (!match) {
        return null;
      }
      if (hex = match[1]) {
        return this.fromHex(hex);
      } else if (rgba = match[2]) {
        _ref = rgba.split(/\s*,\s*/), r = _ref[0], g = _ref[1], b = _ref[2], a = _ref[3];
        return new this(r, g, b, a);
      }
    };

    Color.White = function(alpha) {
      return new Color(255, 255, 255, alpha);
    };

    Color.Black = function(alpha) {
      return new Color(0, 0, 0, alpha);
    };

    Color.Transparent = function() {
      return new Color;
    };

    function Color(r, g, b, a) {
      if (a == null) {
        a = 1;
      }
      if (r != null) {
        this.r = parseInt(r, 10);
      }
      if (g != null) {
        this.g = parseInt(g, 10);
      }
      if (b != null) {
        this.b = parseInt(b, 10);
      }
      this.a = parseFloat(a);
    }

    Color.prototype.toHex = function() {
      var a;
      if (!((this.r != null) && (this.g != null) && (this.b != null))) {
        return 'transparent';
      }
      a = (this.b | this.g << 8 | this.r << 16).toString(16);
      a = '#' + '000000'.substr(0, 6 - a.length) + a;
      return a.toUpperCase();
    };

    Color.prototype.isTransparent = function() {
      return !this.a;
    };

    Color.prototype.set = function(values) {
      var key, value;
      for (key in values) {
        value = values[key];
        this[key] = value;
      }
      return this;
    };

    Color.prototype.rgb = function() {
      var result;
      return result = {
        r: this.r,
        g: this.g,
        b: this.b
      };
    };

    Color.prototype.rgba = function() {
      var result;
      return result = {
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a
      };
    };

    Color.prototype.clone = function() {
      return new this.constructor(this.r, this.g, this.b, this.a);
    };

    Color.prototype.toString = function() {
      if ((this.r != null) && (this.g != null) && (this.b != null)) {
        if (this.a != null) {
          return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        } else {
          return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
        }
      } else {
        return 'transparent';
      }
    };

    Color.prototype.id = module.id;

    Color.prototype.toValue = function() {
      return [this.r, this.g, this.b, this.a];
    };

    return Color;

  })(Property);

  module.exports = Color;

}).call(this);
;}});
