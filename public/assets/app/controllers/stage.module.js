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
  var Dragging, Ellipsis, KeyBindings, Properties, Rectangle, Resizing, SelectArea, Selection, Snapping, Stage,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  Selection = require('./stage/selection');

  Dragging = require('./stage/dragging');

  Resizing = require('./stage/resizing');

  SelectArea = require('./stage/select_area');

  Snapping = require('./stage/snapping');

  KeyBindings = require('./stage/key_bindings');

  Rectangle = require('./elements/rectangle');

  Ellipsis = require('./elements/ellipsis');

  Properties = require('app/models/properties');

  Stage = (function(_super) {

    __extends(Stage, _super);

    Stage.prototype.className = 'stage';

    Stage.prototype.events = {
      'select': 'select',
      'deselect': 'deselect',
      'mousedown': 'deselectAll',
      'resize.start': 'resizeStart',
      'resize.end': 'resizeEnd'
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
      this.selection = new Selection;
      this.dragging = new Dragging(this);
      this.resizing = new Resizing(this);
      this.selectArea = new SelectArea(this);
      this.snapping = new Snapping(this);
      this.keybindings = new KeyBindings(this);
      this.selection.bind('change', function() {
        return _this.el.trigger('selection.change', _this);
      });
      this.rectangle1 = new Rectangle({
        left: 200,
        top: 200,
        background: [new Properties.Background.URL('assets/blacky.png')]
      });
      this.rectangle2 = new Rectangle();
      this.add(this.rectangle1, this.rectangle2);
    }

    Stage.prototype.add = function() {
      var element, elements, _i, _len, _results;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        this.elements.push(element);
        _results.push(this.append(element));
      }
      return _results;
    };

    Stage.prototype.remove = function(element) {
      this.selection.remove(element);
      element.remove();
      return this.elements.splice(this.elements.indexOf(element), 1);
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
      if (!this.selection.isMultiple() && !modifier) this.selection.clear();
      return this.selection.add(element);
    };

    Stage.prototype.deselect = function(e, element, modifier) {
      if (modifier) return this.selection.remove(element);
    };

    Stage.prototype.deselectAll = function(e) {
      if (e.target === e.currentTarget) return this.selection.clear();
    };

    Stage.prototype.resizeStart = function() {
      return this.$('.thumb').hide();
    };

    Stage.prototype.resizeEnd = function() {
      return this.$('.thumb').show();
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

    return Stage;

  })(Spine.Controller);

  module.exports = Stage;

}).call(this);
;}});
