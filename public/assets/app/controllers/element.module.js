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
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Resizing = require('./element/resizing');

  Serialize = require('app/models/serialize').Serialize;

  Background = require('app/models/properties/background');

  Color = require('app/models/properties/color');

  Utils = require('lib/utils');

  Element = (function(_super) {

    __extends(Element, _super);

    Element.name = 'Element';

    Element.include(Serialize);

    Element.prototype.id = module.id;

    Element.prototype.defaults = function() {
      var result;
      return result = {
        width: 100,
        height: 100,
        backgroundColor: new Color.Black(0.2)
      };
    };

    Element.prototype.elementEvents = {
      'mousedown': 'toggleSelect',
      'dblclick': 'startEditing'
    };

    function Element(attrs) {
      if (attrs == null) {
        attrs = {};
      }
      this.setSelected = __bind(this.setSelected, this);

      Element.__super__.constructor.call(this, {
        el: attrs.el
      });
      this.el.addClass('element');
      this.delegateEvents(this.elementEvents);
      this.properties = {};
      this.selected = !!attrs.selected;
      this.resizing = new Resizing(this);
      if (attrs.text) {
        this.text(attrs.text);
      }
      this.set(this.defaults());
      this.set(attrs.properties || attrs);
    }

    Element.prototype.get = function(key) {
      return this.properties[key];
    };

    Element.prototype.set = function(key, value) {
      var k, v;
      if (typeof key === 'object') {
        for (k in key) {
          v = key[k];
          this.properties[k] = v;
        }
      } else {
        this.properties[key] = value;
      }
      return this.paint();
    };

    Element.prototype.paint = function() {
      return this.el.css(this.properties);
    };

    Element.prototype.resize = function(area) {
      this.set(area);
      return this.el.trigger('resize.element', [this]);
    };

    Element.prototype.moveBy = function(toPosition) {
      var area;
      area = this.area();
      area.left += toPosition.left;
      area.top += toPosition.top;
      this.set(area);
      return this.el.trigger('move.element', [this]);
    };

    Element.prototype.order = function(i) {
      if (this.get('zIndex') !== i + 100) {
        return this.set('zIndex', i + 100);
      }
    };

    Element.prototype.remove = function() {
      return this.el.trigger('release.element', [this]);
    };

    Element.prototype.toggleSelect = function(e) {
      if (this.editing) {
        return;
      }
      if (this.selected) {
        return this.el.trigger('deselect.element', [this, e != null ? e.shiftKey : void 0]);
      } else {
        return this.el.trigger('select.element', [this, e != null ? e.shiftKey : void 0]);
      }
    };

    Element.prototype.setSelected = function(bool) {
      if (bool != null) {
        this.selected = bool;
        this.el.toggleClass('selected', bool);
        if (!bool) {
          this.stopEditing();
        }
        this.resizing.toggle(bool);
      }
      return this.selected;
    };

    Element.prototype.startEditing = function() {
      if (this.editing) {
        return;
      }
      this.editing = true;
      this.resizing.toggle(false);
      this.el.removeClass('selected');
      this.el.addClass('editing');
      this.el.attr('contenteditable', true);
      this.el.focus();
      return document.execCommand('selectAll', false, null);
    };

    Element.prototype.stopEditing = function() {
      if (!this.editing) {
        return;
      }
      this.editing = false;
      this.el.blur();
      this.el.removeAttr('contenteditable');
      this.el.scrollTop(0);
      this.el.addClass('selected');
      return this.el.removeClass('editing');
    };

    Element.prototype.text = function(text) {
      if (text != null) {
        this.el.text(text);
      }
      return this.el.text();
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
        if (__indexOf.call(this.ignoredStyles, name) >= 0) {
          continue;
        }
        if (!value) {
          continue;
        }
        if (typeof value === 'number' && !$.cssNumber[name]) {
          value += 'px';
        }
        name = Utils.dasherize(name);
        value = value.toString();
        if (!value) {
          continue;
        }
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

    Element.prototype.toValue = function() {
      var result;
      return result = {
        selected: this.selected,
        properties: this.properties,
        text: this.text()
      };
    };

    return Element;

  })(Spine.Controller);

  module.exports = Element;

}).call(this);
;}});
