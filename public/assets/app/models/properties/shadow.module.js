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
this.require.define({"app/models/properties/shadow":function(exports, require, module){(function() {
  var Color, Property, Shadow,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Property = require('app/models/property');

  Color = require('./color');

  Shadow = (function(_super) {

    __extends(Shadow, _super);

    Shadow.prototype.id = module.id;

    function Shadow(properties) {
      var k, v;
      if (properties == null) properties = {};
      for (k in properties) {
        v = properties[k];
        this[k] = v;
      }
      this.x || (this.x = 0);
      this.y || (this.y = 0);
      this.color || (this.color = new Color.Black(0.3));
    }

    Shadow.prototype.toString = function() {
      var result;
      result = [];
      if (this.inset) result.push('inset');
      result.push(this.x + 'px');
      result.push(this.y + 'px');
      if (this.blur != null) result.push(this.blur + 'px');
      if (this.spread != null) result.push(this.spread + 'px');
      result.push(this.color.toString());
      return result.join(' ');
    };

    Shadow.prototype.toValue = function() {
      var value;
      return value = {
        x: this.x,
        y: this.y,
        color: this.color
      };
    };

    return Shadow;

  })(Property);

  module.exports = Shadow;

}).call(this);
;}});
