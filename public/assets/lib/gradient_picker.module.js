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
this.require.define({"lib/gradient_picker":function(exports, require, module){(function() {
  var Background, Color, ColorPicker, ColorStop, GradientPicker, LinearGradient, Popup, Slider,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Popup = require('./popup');

  ColorPicker = require('./color_picker');

  Color = ColorPicker.Color;

  Background = require('app/models/properties/background');

  LinearGradient = Background.LinearGradient;

  ColorStop = Background.ColorStop;

  Slider = (function(_super) {

    __extends(Slider, _super);

    Slider.prototype.className = 'slider';

    Slider.prototype.events = {
      'mousedown': 'listen',
      'mouseup': 'openColorPicker'
    };

    function Slider(colorStop) {
      this.colorStop = colorStop != null ? colorStop : new ColorStop;
      this.drop = __bind(this.drop, this);
      this.drag = __bind(this.drag, this);
      this.listen = __bind(this.listen, this);
      Slider.__super__.constructor.call(this);
      this.inner = $('<div />').addClass('inner');
      this.append(this.inner);
      this.render();
    }

    Slider.prototype.render = function() {
      this.move(this.colorStop.length);
      return this.inner.css({
        background: this.colorStop.color
      });
    };

    Slider.prototype.listen = function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.width = this.el.parent().width();
      this.offset = this.el.parent().offset();
      this.remove = false;
      this.moved = false;
      $(document).mousemove(this.drag);
      return $(document).mouseup(this.drop);
    };

    Slider.prototype.drag = function(e) {
      var left, length, top, _ref;
      this.moved = true;
      if ((_ref = this.picker) != null) {
        if (typeof _ref.close === "function") _ref.close();
      }
      this.picker = false;
      top = e.pageY - this.offset.top;
      this.remove = top > 100 || top < -100;
      this.el.toggleClass('remove', this.remove);
      left = e.pageX - this.offset.left;
      length = (left / this.width) * 100;
      return this.move(length);
    };

    Slider.prototype.drop = function(e) {
      $(document).unbind('mousemove', this.drag);
      $(document).unbind('mouseup', this.drop);
      if (this.remove) return this.release();
    };

    Slider.prototype.move = function(length) {
      this.length = length != null ? length : 0;
      this.length = Math.max(Math.min(this.length, 100), 0);
      this.colorStop.length = this.length;
      this.el.css({
        left: "" + this.length + "%"
      });
      return this.el.trigger('change', [this]);
    };

    Slider.prototype.release = function() {
      this.el.trigger('removed', [this]);
      this.el.trigger('change', [this]);
      return Slider.__super__.release.apply(this, arguments);
    };

    Slider.prototype.openColorPicker = function() {
      var _this = this;
      if (this.moved) return;
      this.picker = new ColorPicker({
        color: this.colorStop.color
      });
      this.picker.bind('change', function(color) {
        _this.colorStop.color = color;
        _this.el.trigger('change', [_this]);
        return _this.render();
      });
      return this.picker.open(this.el.offset());
    };

    return Slider;

  })(Spine.Controller);

  GradientPicker = (function(_super) {

    __extends(GradientPicker, _super);

    GradientPicker.prototype.className = 'gradientPicker';

    GradientPicker.prototype.events = {
      'removed': 'removeSlider',
      'change': 'set',
      'click': 'createSlider'
    };

    function GradientPicker() {
      var stop, _i, _len, _ref;
      GradientPicker.__super__.constructor.apply(this, arguments);
      this.gradient || (this.gradient = new LinearGradient);
      _ref = this.gradient.stops;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stop = _ref[_i];
        this.append(new Slider(stop));
      }
      if (!this.gradient.stops.length) {
        this.addSlider(new ColorStop(new Color.White, 0));
        this.addSlider(new ColorStop(new Color.Black, 100));
      }
      this.el.css({
        background: this.gradient
      });
    }

    GradientPicker.prototype.addSlider = function(colorStop) {
      if (colorStop == null) colorStop = new ColorStop;
      this.gradient.addStop(colorStop);
      this.append(new Slider(colorStop));
      return this.set();
    };

    GradientPicker.prototype.removeSlider = function(e, slider) {
      return this.gradient.removeStop(slider.colorStop);
    };

    GradientPicker.prototype.set = function() {
      this.el.css({
        background: this.gradient
      });
      return this.trigger('change', this.gradient);
    };

    GradientPicker.prototype.createSlider = function(e) {
      var left, length;
      if (e.target !== e.currentTarget) return;
      left = e.pageX - this.el.offset().left;
      length = (left / this.el.width()) * 100;
      return this.addSlider(new ColorStop(new Color.White, length));
    };

    return GradientPicker;

  })(Spine.Controller);

  module.exports = GradientPicker;

}).call(this);
;}});
