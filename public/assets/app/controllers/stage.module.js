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
this.require.define({"app/controllers/stage":function(exports, require, module){(function() {
  var Clipboard, ContextMenu, Dragging, Ellipsis, History, KeyBindings, Properties, Rectangle, Resizing, SelectArea, Selection, Serialize, Snapping, Stage, ZIndex,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Serialize = require('app/models/serialize').Serialize;

  Selection = require('./stage/selection');

  Dragging = require('./stage/dragging');

  Resizing = require('./stage/resizing');

  SelectArea = require('./stage/select_area');

  Snapping = require('./stage/snapping');

  KeyBindings = require('./stage/key_bindings');

  ZIndex = require('./stage/zindex');

  Clipboard = require('./stage/clipboard');

  ContextMenu = require('./stage/context_menu');

  History = require('./stage/history');

  Rectangle = require('./elements/rectangle');

  Ellipsis = require('./elements/ellipsis');

  Properties = require('app/models/properties');

  Stage = (function(_super) {

    __extends(Stage, _super);

    Stage.name = 'Stage';

    Stage.prototype.className = 'stage';

    Stage.prototype.events = {
      'select.element': 'select',
      'deselect.element': 'deselect',
      'mousedown': 'deselectAll',
      'start.resize': 'resizeStart',
      'end.resize': 'resizeEnd'
    };

    function Stage() {
      this.deselectAll = __bind(this.deselectAll, this);

      this.deselect = __bind(this.deselect, this);

      this.select = __bind(this.select, this);

      this.remove = __bind(this.remove, this);

      this.add = __bind(this.add, this);

      var _this = this;
      Stage.__super__.constructor.apply(this, arguments);
      this.elements = [];
      this.properties = {};
      this.selection = new Selection;
      this.dragging = new Dragging(this);
      this.resizing = new Resizing(this);
      this.selectArea = new SelectArea(this);
      this.snapping = new Snapping(this);
      this.keyBindings = new KeyBindings(this);
      this.zindex = new ZIndex(this);
      this.clipboard = new Clipboard(this);
      this.contextMenu = new ContextMenu(this);
      this.history = new History(this);
      this.selection.bind('change', function() {
        return _this.el.trigger('selection.change', [_this]);
      });
    }

    Stage.prototype.render = function() {
      var rectangle1, rectangle2;
      rectangle1 = new Rectangle({
        left: 200,
        top: 200,
        backgroundImage: [new Properties.Background.URL('assets/blacky.png')]
      });
      rectangle2 = new Rectangle();
      this.add(rectangle1);
      this.add(rectangle2);
      return this;
    };

    Stage.prototype.add = function(element) {
      this.elements.push(element);
      element.order(this.elements.indexOf(element));
      this.append(element);
      if (element.selected()) {
        return this.selection.add(element);
      }
    };

    Stage.prototype.remove = function(element) {
      this.selection.remove(element);
      this.elements.splice(this.elements.indexOf(element), 1);
      return element.release();
    };

    Stage.prototype.clear = function() {
      var element, _i, _len, _ref;
      this.selection.clear();
      _ref = this.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        element.release();
      }
      return this.elements = [];
    };

    Stage.prototype.refresh = function(elements) {
      var el, _i, _len, _results;
      this.clear();
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        _results.push(this.add(el));
      }
      return _results;
    };

    Stage.prototype.removeSelected = function() {
      var el, _i, _len, _ref, _results;
      _ref = this.selection.elements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(this.remove(el));
      }
      return _results;
    };

    Stage.prototype.selectAll = function() {
      var el, _i, _len, _ref, _results;
      _ref = this.elements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(this.selection.add(el));
      }
      return _results;
    };

    Stage.prototype.cloneSelected = function() {
      var clones, el, _i, _len;
      clones = (function() {
        var _i, _len, _ref, _results;
        _ref = this.selection.elements;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          _results.push(el.clone());
        }
        return _results;
      }).call(this);
      for (_i = 0, _len = clones.length; _i < _len; _i++) {
        el = clones[_i];
        this.add(el);
      }
      return clones;
    };

    Stage.prototype.select = function(e, element, modifier) {
      if (!this.selection.isMultiple() && !modifier) {
        this.selection.clear();
      }
      return this.selection.add(element);
    };

    Stage.prototype.deselect = function(e, element, modifier) {
      if (modifier) {
        return this.selection.remove(element);
      }
    };

    Stage.prototype.deselectAll = function(e) {
      if (e.target === e.currentTarget) {
        return this.selection.clear();
      }
    };

    Stage.prototype.resizeStart = function() {
      return this.$('.thumb').hide();
    };

    Stage.prototype.resizeEnd = function() {
      return this.$('.thumb').show();
    };

    Stage.prototype.bringForward = function() {
      var element, elements, _i, _len;
      elements = this.selection.elements.slice(0).reverse();
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        this.zindex.bringForward(element);
      }
      return true;
    };

    Stage.prototype.bringBack = function() {
      var element, elements, _i, _len;
      elements = this.selection.elements.slice(0).reverse();
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        this.zindex.bringBack(element);
      }
      return true;
    };

    Stage.prototype.bringToFront = function() {
      var element, elements, _i, _len;
      elements = this.selection.elements.slice(0).reverse();
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        this.zindex.bringToFront(element);
      }
      return true;
    };

    Stage.prototype.bringToBack = function() {
      var element, elements, _i, _len;
      elements = this.selection.elements.slice(0).reverse();
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        this.zindex.bringToBack(element);
      }
      return true;
    };

    Stage.prototype.area = function() {
      var area;
      area = this.el.position();
      area.height = this.el.height();
      area.width = this.el.width();
      return area;
    };

    Stage.prototype.center = function() {
      var area, position;
      area = this.area();
      return position = {
        left: area.width / 2,
        top: area.height / 2
      };
    };

    Stage.prototype.get = function(key) {
      return (typeof this[key] === "function" ? this[key]() : void 0) || this.properties[key];
    };

    Stage.prototype.set = function(key, value) {
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

    Stage.prototype.paint = function() {
      return this.el.css(this.properties);
    };

    Stage.include(Serialize);

    Stage.prototype.id = module.id;

    Stage.prototype.toValue = function() {
      var result;
      return result = {
        elements: this.elements,
        properties: this.properties
      };
    };

    Stage.prototype.release = function() {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if ((_ref = this.selection) != null) {
        _ref.release();
      }
      if ((_ref1 = this.dragging) != null) {
        _ref1.release();
      }
      if ((_ref2 = this.resizing) != null) {
        _ref2.release();
      }
      if ((_ref3 = this.selectArea) != null) {
        _ref3.release();
      }
      if ((_ref4 = this.snapping) != null) {
        _ref4.release();
      }
      if ((_ref5 = this.keyBindings) != null) {
        _ref5.release();
      }
      if ((_ref6 = this.clipboard) != null) {
        _ref6.release();
      }
      if ((_ref7 = this.context) != null) {
        _ref7.release();
      }
      return Stage.__super__.release.apply(this, arguments);
    };

    return Stage;

  })(Spine.Controller);

  module.exports = Stage;

}).call(this);
;}});
