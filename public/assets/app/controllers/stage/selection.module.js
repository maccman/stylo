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
this.require.define({"app/controllers/stage/selection":function(exports, require, module){(function() {
  var Selection, max, min,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  min = function(a, b) {
    if (a == null) {
      a = 0;
    }
    if (b == null) {
      b = 0;
    }
    if (a === 0) {
      return b;
    }
    return Math.min(a, b);
  };

  max = function(a, b) {
    if (a == null) {
      a = 0;
    }
    if (b == null) {
      b = 0;
    }
    if (a === 0) {
      return b;
    }
    return Math.max(a, b);
  };

  Selection = (function(_super) {

    __extends(Selection, _super);

    Selection.name = 'Selection';

    Selection.include(Spine.Events);

    function Selection(elements) {
      this.elements = elements != null ? elements : [];
    }

    Selection.prototype.get = function(key) {
      var el, first, _i, _len, _ref, _ref1;
      if (!this.isAny()) {
        return null;
      }
      first = (_ref = this.elements[0]) != null ? _ref.get(key) : void 0;
      _ref1 = this.elements;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        el = _ref1[_i];
        if (el.get(key) !== first) {
          return null;
        }
      }
      return first;
    };

    Selection.prototype.set = function(key, value) {
      var el, _i, _len, _ref, _results;
      _ref = this.elements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(el.set(key, value));
      }
      return _results;
    };

    Selection.prototype.isMultiple = function() {
      return this.elements.length > 1;
    };

    Selection.prototype.isSingle = function() {
      return this.elements.length === 1;
    };

    Selection.prototype.isAny = function() {
      return this.elements.length > 0;
    };

    Selection.prototype.add = function(element) {
      if (__indexOf.call(this.elements, element) >= 0) {
        return;
      }
      this.elements.push(element);
      element.selected(true);
      return this.trigger('change');
    };

    Selection.prototype.remove = function(element) {
      var elements, index;
      if (__indexOf.call(this.elements, element) < 0) {
        return;
      }
      element.selected(false);
      index = this.elements.indexOf(element);
      elements = this.elements.slice();
      elements.splice(index, 1);
      this.elements = elements;
      return this.trigger('change');
    };

    Selection.prototype.refresh = function(elements) {
      var el, _i, _len, _results;
      this.clear();
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        _results.push(this.add(el));
      }
      return _results;
    };

    Selection.prototype.clear = function() {
      var el, _i, _len, _ref, _results;
      _ref = this.elements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(this.remove(el));
      }
      return _results;
    };

    Selection.prototype.area = function() {
      var area, element, elementArea, _i, _len, _ref;
      if (this.elements.length === 1) {
        return this.elements[0].area();
      }
      area = {};
      _ref = this.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        elementArea = element.area();
        area.left = min(area.left, elementArea.left);
        area.top = min(area.top, elementArea.top);
        area.right = max(area.right, elementArea.left + elementArea.width);
        area.bottom = max(area.bottom, elementArea.top + elementArea.height);
      }
      area.width = area.right - area.left;
      area.height = area.bottom - area.top;
      delete area.right;
      delete area.bottom;
      return area;
    };

    Selection.prototype.moveBy = function(toPosition) {
      var el, _i, _len, _ref, _results;
      _ref = this.elements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(el.moveBy(toPosition));
      }
      return _results;
    };

    return Selection;

  })(Spine.Module);

  module.exports = Selection;

}).call(this);
;}});
