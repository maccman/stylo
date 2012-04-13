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
this.require.define({"app/controllers/stage/zindex":function(exports, require, module){(function() {
  var Collection, ZIndex;

  Collection = require('lib/collection');

  ZIndex = (function() {

    ZIndex.name = 'ZIndex';

    function ZIndex(stage) {
      this.stage = stage;
      this.order = this.stage.elements;
    }

    ZIndex.prototype.bringForward = function(element) {
      var index;
      index = this.order.indexOf(element);
      if (index !== -1 || index !== (this.order.length - 1)) {
        this.order[index] = this.order[index + 1];
        this.order[index + 1] = element;
      }
      return this.set();
    };

    ZIndex.prototype.bringBack = function(element) {
      var index;
      index = this.order.indexOf(element);
      if (index !== -1 || index !== 0) {
        this.order[index] = this.order[index - 1];
        this.order[index - 1] = element;
      }
      return this.set();
    };

    ZIndex.prototype.bringToFront = function(element) {
      var index;
      index = this.order.indexOf(element);
      this.order.splice(index, 1);
      this.order.push(element);
      return this.set();
    };

    ZIndex.prototype.bringToBack = function(element) {
      var index;
      index = this.order.indexOf(element);
      this.order.splice(index, 1);
      this.order.unshift(element);
      return this.set();
    };

    ZIndex.prototype.set = function() {
      var element, index, _i, _len, _ref, _results;
      _ref = this.order;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        element = _ref[index];
        _results.push(element.order(index));
      }
      return _results;
    };

    return ZIndex;

  })();

  module.exports = ZIndex;

}).call(this);
;}});
