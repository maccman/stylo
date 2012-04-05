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
this.require.define({"app/controllers/elements/canvas":function(exports, require, module){(function() {
  var Canvas, Element,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Element = require('../element');

  Canvas = (function(_super) {

    __extends(Canvas, _super);

    Canvas.prototype.tag = 'canvas';

    Canvas.prototype.points = [];

    function Canvas() {
      Canvas.__super__.constructor.apply(this, arguments);
      this.ctx = this.el[0].getContext('2d');
    }

    Canvas.prototype.paint = function() {
      var first, point, points, _i, _len, _ref, _ref2, _ref3;
      first = this.points[0];
      points = this.points.slice(1, this.points.length);
      if (!first) return;
      this.ctx.beginPath();
      (_ref = this.ctx).moveTo.apply(_ref, first);
      _ref2 = this.points;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        point = _ref2[_i];
        (_ref3 = this.ctx).lineTo.apply(_ref3, point);
      }
      return this.ctx.fill();
    };

    Canvas.prototype.width = function(val) {};

    Canvas.prototype.height = function(val) {};

    Canvas.prototype.backgroundImage = function(val) {};

    Canvas.prototype.backgroundColor = function(val) {};

    Canvas.prototype.borderBottom = function(val) {};

    Canvas.prototype.boxShadow = function(val) {};

    Canvas.prototype.borderRadius = function(val) {};

    return Canvas;

  })(Element);

  module.exports = Canvas;

}).call(this);
;}});
