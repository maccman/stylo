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
this.require.define({"app/controllers/element":function(exports, require, module){(function() {
  var Background, Color, Element, Resizing, Serialize, Utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Resizing = require('./element/resizing');

  Serialize = require('app/models/serialize').Serialize;

  Background = require('app/models/properties/background');

  Color = require('app/models/properties/color');

  Utils = require('lib/utils');

  Element = (function(_super) {

    __extends(Element, _super);

    Element.include(Serialize);

    Element.prototype.className = 'element';

    Element.prototype.id = module.id;

    Element.prototype.defaults = function() {
      var result;
      return result = {
        position: 'absolute',
        width: 100,
        height: 100,
        left: 0,
        top: 0,
        opacity: 1,
        backgroundColor: new Color.Black(0.2),
        order: -1
      };
    };

    Element.prototype.events = {
      'mousedown': 'select'
    };

    function Element(attrs) {
      if (attrs == null) attrs = {};
      this.selected = __bind(this.selected, this);
      Element.__super__.constructor.call(this, {
        el: attrs.el
      });
      this.properties = {};
      this.set(this.defaults());
      this.set(attrs);
      this.resizing = new Resizing(this);
    }

    Element.prototype.get = function(key) {
      return (typeof this[key] === "function" ? this[key]() : void 0) || this.properties[key];
    };

    Element.prototype.set = function(key, value) {
      var k, v;
      if (typeof key === 'object') {
        for (k in key) {
          v = key[k];
          this.set(k, v);
        }
      } else {
        (typeof this[key] === "function" ? this[key](value) : void 0) || (this.properties[key] = value);
      }
      return this.paint();
    };

    Element.prototype.paint = function() {
      return this.el.css(this.properties);
    };

    Element.prototype.toValue = function() {
      return this.properties;
    };

    Element.prototype.resize = function(area) {
      this.set(area);
      return this.el.trigger('resized', [this]);
    };

    Element.prototype.moveBy = function(toPosition) {
      var area;
      area = this.area();
      area.left += toPosition.left;
      area.top += toPosition.top;
      this.set(area);
      return this.el.trigger('moved', [this]);
    };

    Element.prototype.order = function(i) {
      return this.set('zIndex', i + 100);
    };

    Element.prototype.remove = function() {
      return this.el.remove();
    };

    Element.prototype.clone = function() {
      return new this.constructor(this.properties);
    };

    Element.prototype.select = function(e) {
      if (this.selected()) {
        return this.el.trigger('deselect', [this, e != null ? e.shiftKey : void 0]);
      } else {
        return this.el.trigger('select', [this, e != null ? e.shiftKey : void 0]);
      }
    };

    Element.prototype.selected = function(bool) {
      if (bool != null) {
        this._selected = bool;
        this.el.toggleClass('selected', bool);
        this.resizing.toggle(bool);
      }
      return this._selected;
    };

    Element.prototype.area = function() {
      var area;
      area = {};
      area.left = this.properties.left || 0;
      area.top = this.properties.top || 0;
      area.height = this.properties.height || 0;
      area.width = this.properties.width || 0;
      return area;
    };

    Element.prototype.inArea = function(testArea) {
      var area;
      area = this.area();
      if ((area.left + area.width) > testArea.left && area.left < (testArea.left + testArea.width) && (area.top + area.height) > testArea.top && area.top < (testArea.top + testArea.height)) {
        return true;
      }
      return false;
    };

    Element.prototype.outerHTML = function() {
      return this.el.clone().empty()[0].outerHTML;
    };

    Element.prototype.ignoredStyles = ['left', 'top', 'zIndex', 'position'];

    Element.prototype.outerCSS = function() {
      var k, name, styles, v, value, _ref;
      styles = {};
      _ref = this.properties;
      for (name in _ref) {
        value = _ref[name];
        if (__indexOf.call(this.ignoredStyles, name) >= 0) continue;
        if (typeof value === 'number' && !$.cssNumber[name]) value += 'px';
        name = Utils.dasherize(name);
        styles[name] = value;
      }
      styles = ((function() {
        var _results;
        _results = [];
        for (k in styles) {
          v = styles[k];
          _results.push("\t" + k + ": " + v + ";");
        }
        return _results;
      })()).join("\n");
      return "." + this.className + " {\n" + styles + "\n}";
    };

    return Element;

  })(Spine.Controller);

  module.exports = Element;

}).call(this);
;}});
