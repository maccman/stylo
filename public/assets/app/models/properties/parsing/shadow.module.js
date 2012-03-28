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
this.require.define({"app/models/properties/parsing/shadow":function(exports, require, module){(function() {
  var Color, Shadow;

  Color = require('./color');

  Shadow = (function() {

    Shadow.fromString = function(str) {
      var color, colors, i, inset, p, parts, properties, property, shadows, _len;
      if (!str) return [];
      if (str === 'none') return [];
      shadows = [];
      colors = [];
      while (color = Color.fromString(str)) {
        colors.push(color);
        str = str.replace(Color.regex, '');
      }
      properties = str.split(',');
      for (i = 0, _len = properties.length; i < _len; i++) {
        property = properties[i];
        color = colors[i];
        inset = this.insetRegex.test(property);
        parts = property.split(' ');
        parts = (function() {
          var _i, _len2, _results;
          _results = [];
          for (_i = 0, _len2 = parts.length; _i < _len2; _i++) {
            p = parts[_i];
            if (p !== '') _results.push(parseFloat(p));
          }
          return _results;
        })();
        shadows.push(new this({
          x: parts[0],
          y: parts[1],
          blur: parts[2],
          spread: parts[3],
          inset: inset,
          color: color
        }));
      }
      return shadows;
    };

    Shadow.insetRegex = /inset/;

    function Shadow(properties) {
      var k, v;
      if (properties == null) properties = {};
      for (k in properties) {
        v = properties[k];
        this[k] = v;
      }
      this.x || (this.x = 0);
      this.y || (this.y = 0);
      this.color || (this.color = new Color(0, 0, 0, 0.3));
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

    return Shadow;

  })();

  module.exports = Shadow;

}).call(this);
;}});
