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
  var BackgroundImage, Color, ColorPicker, ColorSlide, GradientPicker, Popup, Stop,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Popup = require('./popup');

  ColorPicker = require('./color_picker');

  Color = ColorPicker.Color;

  BackgroundImage = require('app/models/properties/background_image');

  Stop = (function(_super) {

    __extends(Stop, _super);

    Stop.prototype.className = 'stop';

    Stop.prototype.events = {
      'mousedown': 'listen'
    };

    function Stop(slide, color, location) {
      this.slide = slide;
      this.color = color;
      this.location = location != null ? location : 0;
      this.drop = __bind(this.drop, this);
      this.drag = __bind(this.drag, this);
      this.listen = __bind(this.listen, this);
      Stop.__super__.constructor.call(this);
      this.appendTo(this.slide);
    }

    Stop.prototype.listen = function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.dragPosition = {
        left: e.pageX,
        top: e.pageY
      };
      this.slide.mousemove(this.drag);
      return $(document).mouseup(this.drop);
    };

    Stop.prototype.drag = function(e) {
      var difference;
      difference = {
        left: e.pageX - this.dragPosition.left,
        top: e.pageY - this.dragPosition.top
      };
      this.dragPosition = {
        left: e.pageX,
        top: e.pageY
      };
      return this.move({
        left: difference.left
      });
    };

    Stop.prototype.drop = function(e) {
      this.slide.unbind('mousemove', this.drag);
      return $(document).unbind('mouseup', this.drop);
    };

    Stop.prototype.move = function(toPosition) {
      var position;
      position = this.el.position();
      position.left += toPosition.left;
      this.location = this.slide.width() - position.left;
      this.el.css(position);
      return this.el.trigger('moved', this);
    };

    return Stop;

  })(Spine.Controller);

  ColorSlide = (function(_super) {

    __extends(ColorSlide, _super);

    function ColorSlide() {
      ColorSlide.__super__.constructor.apply(this, arguments);
    }

    ColorSlide.prototype.className = 'colorSlide';

    return ColorSlide;

  })(Spine.Controller);

  GradientPicker = (function(_super) {

    __extends(GradientPicker, _super);

    function GradientPicker() {
      GradientPicker.__super__.constructor.apply(this, arguments);
      this.gradient || (this.gradient = new BackgroundImage.LinearGradient);
    }

    return GradientPicker;

  })(Popup);

  module.exports = GradientPicker;

}).call(this);
;}});
