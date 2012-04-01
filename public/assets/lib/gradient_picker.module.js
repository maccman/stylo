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
  var BackgroundImage, Color, ColorPicker, ColorStop, GradientPicker, LinearGradient, Popup, Slider,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Popup = require('./popup');

  ColorPicker = require('./color_picker');

  Color = ColorPicker.Color;

  BackgroundImage = require('app/models/properties/background_image');

  LinearGradient = BackgroundImage.LinearGradient;

  ColorStop = BackgroundImage.ColorStop;

  Slider = (function(_super) {

    __extends(Slider, _super);

    Slider.prototype.className = 'slider';

    Slider.prototype.events = {
      'mousedown': 'listen'
    };

    function Slider(colorStop) {
      var _this = this;
      this.colorStop = colorStop != null ? colorStop : new ColorStop;
      this.drop = __bind(this.drop, this);
      this.drag = __bind(this.drag, this);
      this.listen = __bind(this.listen, this);
      Slider.__super__.constructor.call(this);
      this.colorInput = new ColorPicker.Preview({
        color: this.colorStop.color
      });
      this.colorInput.bind('change', function(color) {
        _this.colorInput.color = color;
        return _this.el.trigger('change', _this);
      });
      this.append(this.colorInput);
    }

    Slider.prototype.listen = function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.width = this.el.parent().width();
      $(document).mousemove(this.drag);
      return $(document).mouseup(this.drop);
    };

    Slider.prototype.drag = function(e) {
      var left, location, position;
      position = this.el.offset();
      left = e.pageY - position.left;
      location = (left / this.width) * 100;
      return this.move(location);
    };

    Slider.prototype.drop = function(e) {
      $(document).unbind('mousemove', this.drag);
      return $(document).unbind('mouseup', this.drop);
    };

    Slider.prototype.move = function(location) {
      var left;
      this.location = location != null ? location : 0;
      this.colorStop.location = this.location;
      left = (this.location / 100) * this.width;
      left = Math.max(Math.min(this.width, left), 0);
      this.el.css({
        left: left
      });
      return this.el.trigger('change', this);
    };

    Slider.prototype.release = function() {
      Slider.__super__.release.apply(this, arguments);
      this.el.trigger('removed', this);
      return this.el.trigger('change', this);
    };

    return Slider;

  })(Spine.Controller);

  GradientPicker = (function(_super) {

    __extends(GradientPicker, _super);

    GradientPicker.prototype.events = {
      'removed': 'removeSlider',
      'change': 'set'
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
        this.addSlider(new ColorStop(new Color(255, 255, 255), 0));
        this.addSlider(new ColorStop(new Color(0, 0, 0), 1));
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

    return GradientPicker;

  })(Spine.Controller);

  module.exports = GradientPicker;

}).call(this);
;}});
