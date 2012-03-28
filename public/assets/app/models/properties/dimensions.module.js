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
this.require.define({"app/models/properties/dimensions":function(exports, require, module){(function() {
  var Dimensions, Height, Left, Top, Width,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Dimensions = (function() {

    function Dimensions(value) {
      this.value = value != null ? value : 0;
    }

    Dimensions.prototype.toString = function() {
      return "" + this.value + "px";
    };

    return Dimensions;

  })();

  Left = (function(_super) {

    __extends(Left, _super);

    function Left() {
      Left.__super__.constructor.apply(this, arguments);
    }

    return Left;

  })(Dimensions);

  Top = (function(_super) {

    __extends(Top, _super);

    function Top() {
      Top.__super__.constructor.apply(this, arguments);
    }

    return Top;

  })(Dimensions);

  Width = (function(_super) {

    __extends(Width, _super);

    function Width() {
      Width.__super__.constructor.apply(this, arguments);
    }

    return Width;

  })(Dimensions);

  Height = (function(_super) {

    __extends(Height, _super);

    function Height() {
      Height.__super__.constructor.apply(this, arguments);
    }

    return Height;

  })(Dimensions);

  module.exports = {
    Left: Left,
    Top: Top,
    Width: Width,
    Height: Height
  };

}).call(this);
;}});
