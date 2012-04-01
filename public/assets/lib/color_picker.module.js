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
this.require.define({"lib/color_picker":function(exports, require, module){(function() {
  var Alpha, Canvas, Color, ColorPicker, Display, Gradient, Input, Popup, Preview, Spectrum,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  Popup = require('./popup');

  Color = (function() {

    Color.regex = /(?:#([0-9a-f]{3,6})|rgba?\(([^)]+)\))/i;

    Color.fromHex = function(hex) {
      var b, g, r;
      if (hex[0] === '#') hex = hex.substring(1, 7);
      if (hex.length === 3) {
        hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
      }
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
      return new this(r, g, b);
    };

    Color.fromString = function(str) {
      var a, b, g, hex, match, r, rgba, _ref;
      match = str.match(this.regex);
      if (!match) return null;
      if (hex = match[1]) {
        return this.fromHex(hex);
      } else if (rgba = match[2]) {
        _ref = rgba.split(/\s*,\s*/), r = _ref[0], g = _ref[1], b = _ref[2], a = _ref[3];
        return new this(r, g, b, a);
      }
    };

    Color.White = function(alpha) {
      return new Color(255, 255, 255, alpha);
    };

    Color.Black = function(alpha) {
      return new Color(0, 0, 0, alpha);
    };

    function Color(r, g, b, a) {
      if (r == null) r = 0;
      if (g == null) g = 0;
      if (b == null) b = 0;
      if (a == null) a = 1;
      this.r = parseInt(r, 10);
      this.g = parseInt(g, 10);
      this.b = parseInt(b, 10);
      this.a = parseFloat(a);
    }

    Color.prototype.toHex = function() {
      var a;
      a = (this.b | this.g << 8 | this.r << 16).toString(16);
      a = '#' + '000000'.substr(0, 6 - a.length) + a;
      return a.toUpperCase();
    };

    Color.prototype.isTransparent = function() {
      return this.a === 0;
    };

    Color.prototype.toString = function() {
      return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };

    Color.prototype.set = function(values) {
      var key, value;
      for (key in values) {
        value = values[key];
        this[key] = value;
      }
      return this;
    };

    Color.prototype.rgb = function() {
      var result;
      return result = {
        r: this.r,
        g: this.g,
        b: this.b
      };
    };

    Color.prototype.clone = function() {
      return new this.constructor(this.r, this.g, this.b, this.a);
    };

    return Color;

  })();

  Canvas = (function(_super) {

    __extends(Canvas, _super);

    Canvas.prototype.tag = 'canvas';

    Canvas.prototype.width = 100;

    Canvas.prototype.height = 100;

    Canvas.prototype.events = {
      'mousedown': 'drag'
    };

    function Canvas() {
      this.drop = __bind(this.drop, this);
      this.over = __bind(this.over, this);      Canvas.__super__.constructor.apply(this, arguments);
      this.el.attr({
        width: this.width,
        height: this.height
      });
      this.ctx = this.el[0].getContext('2d');
    }

    Canvas.prototype.val = function(x, y) {
      var data;
      data = this.ctx.getImageData(x, y, 1, 1).data;
      return new Color(data[0], data[1], data[2]);
    };

    Canvas.prototype.drag = function(e) {
      this.el.mousemove(this.over);
      $(document).mouseup(this.drop);
      return this.over(e);
    };

    Canvas.prototype.over = function(e) {
      var offset, x, y;
      e.preventDefault();
      offset = this.el.offset();
      x = e.pageX - offset.left;
      y = e.pageY - offset.top;
      return this.trigger('change', this.val(x, y));
    };

    Canvas.prototype.drop = function() {
      this.el.unbind('mousemove', this.over);
      return $(document).unbind('mouseup', this.drop);
    };

    Canvas.prototype.release = function() {
      Canvas.__super__.release.apply(this, arguments);
      return this.drop();
    };

    return Canvas;

  })(Spine.Controller);

  Gradient = (function(_super) {

    __extends(Gradient, _super);

    Gradient.prototype.className = 'gradient';

    Gradient.prototype.width = 250;

    Gradient.prototype.height = 250;

    function Gradient() {
      Gradient.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color(0, 0, 0));
      this.setColor(this.color);
    }

    Gradient.prototype.setColor = function(color) {
      this.color = color;
      return this.render();
    };

    Gradient.prototype.colorWithAlpha = function(a) {
      var color;
      color = this.color.clone();
      color.a = a;
      return color;
    };

    Gradient.prototype.renderGradient = function() {
      var color, colors, gradient, index, xy, _len, _ref, _ref2;
      xy = arguments[0], colors = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      gradient = (_ref = this.ctx).createLinearGradient.apply(_ref, [0, 0].concat(__slice.call(xy)));
      gradient.addColorStop(0, (_ref2 = colors.shift()) != null ? _ref2.toString() : void 0);
      for (index = 0, _len = colors.length; index < _len; index++) {
        color = colors[index];
        gradient.addColorStop(index + 1 / colors.length, color.toString());
      }
      this.ctx.fillStyle = gradient;
      return this.ctx.fillRect(0, 0, this.width, this.height);
    };

    Gradient.prototype.render = function() {
      var gradient;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.renderGradient([this.width, 0], new Color(255, 255, 255), new Color(255, 255, 255));
      this.renderGradient([this.width, 0], this.colorWithAlpha(0), this.colorWithAlpha(1));
      gradient = this.ctx.createLinearGradient(0, 0, -6, this.height);
      gradient.addColorStop(0, new Color(0, 0, 0, 0).toString());
      gradient.addColorStop(1, new Color(0, 0, 0, 1).toString());
      this.ctx.fillStyle = gradient;
      return this.ctx.fillRect(0, 0, this.width, this.height);
    };

    return Gradient;

  })(Canvas);

  Spectrum = (function(_super) {

    __extends(Spectrum, _super);

    Spectrum.prototype.className = 'spectrum';

    Spectrum.prototype.width = 25;

    Spectrum.prototype.height = 250;

    function Spectrum() {
      Spectrum.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color(0, 0, 0));
      this.setColor(this.color);
    }

    Spectrum.prototype.render = function() {
      var gradient;
      this.ctx.clearRect(0, 0, this.width, this.height);
      gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, 'rgb(255,   0,   0)');
      gradient.addColorStop(0.16, 'rgb(255,   0, 255)');
      gradient.addColorStop(0.33, 'rgb(0,     0, 255)');
      gradient.addColorStop(0.50, 'rgb(0,   255, 255)');
      gradient.addColorStop(0.67, 'rgb(0,   255,   0)');
      gradient.addColorStop(0.83, 'rgb(255, 255,   0)');
      gradient.addColorStop(1, 'rgb(255,   0,   0)');
      this.ctx.fillStyle = gradient;
      return this.ctx.fillRect(0, 0, this.width, this.height);
    };

    Spectrum.prototype.setColor = function(color) {
      this.color = color;
      return this.render();
    };

    return Spectrum;

  })(Canvas);

  Alpha = (function(_super) {

    __extends(Alpha, _super);

    Alpha.prototype.className = 'alpha';

    Alpha.prototype.width = 25;

    Alpha.prototype.height = 250;

    function Alpha() {
      Alpha.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color(0, 0, 0));
      this.setColor(this.color);
    }

    Alpha.prototype.render = function() {
      var gradient;
      this.ctx.clearRect(0, 0, this.width, this.height);
      gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, this.color.clone().set({
        a: 0
      }).toString());
      gradient.addColorStop(0.9, this.color.clone().set({
        a: 1
      }).toString());
      this.ctx.fillStyle = gradient;
      return this.ctx.fillRect(0, 0, this.width, this.height);
    };

    Alpha.prototype.setColor = function(color) {
      this.color = color;
      return this.render();
    };

    Alpha.prototype.val = function(x, y) {
      var data;
      data = this.ctx.getImageData(x, y, 1, 1).data;
      return this.color.set({
        a: Math.round((data[3] / 255) * 100) / 100
      });
    };

    return Alpha;

  })(Canvas);

  Display = (function(_super) {

    __extends(Display, _super);

    Display.prototype.tag = 'article';

    Display.prototype.elements = {
      'input[name=hex]': '$hex',
      'input[name=r]': '$r',
      'input[name=g]': '$g',
      'input[name=b]': '$b',
      'input[name=a]': '$a',
      '.preview .inner': '$preview',
      '.preview .original': '$original'
    };

    Display.prototype.events = {
      'change input:not([name=hex])': 'change',
      'change input[name=hex]': 'changeHex'
    };

    function Display() {
      Display.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color(0, 0, 0));
      this.render();
      this.setColor(this.color);
    }

    Display.prototype.render = function() {
      this.html(JST['lib/views/color_picker'](this));
      if (this.original) {
        return this.$original.css({
          background: this.original.toString()
        });
      }
    };

    Display.prototype.setColor = function(color) {
      this.color = color;
      this.$r.val(this.color.r);
      this.$g.val(this.color.g);
      this.$b.val(this.color.b);
      this.$a.val(Math.round(this.color.a * 100));
      this.$hex.val(this.color.toHex());
      return this.$preview.css({
        background: this.color.toString()
      });
    };

    Display.prototype.change = function(e) {
      var color;
      e.preventDefault();
      color = new Color(this.$r.val(), this.$g.val(), this.$b.val(), parseFloat(this.$a.val()) / 100);
      return this.trigger('change', color);
    };

    Display.prototype.changeHex = function(e) {
      var color;
      e.preventDefault();
      color = Color.fromHex(this.$hex.val());
      return this.trigger('change', color);
    };

    return Display;

  })(Spine.Controller);

  ColorPicker = (function(_super) {

    __extends(ColorPicker, _super);

    ColorPicker.prototype.className = 'colorPicker';

    ColorPicker.prototype.width = 425;

    ColorPicker.prototype.events = {
      'click .save': 'save',
      'click .cancel': 'cancel',
      'form submit': 'save'
    };

    function ColorPicker() {
      ColorPicker.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color(255, 0, 0));
      if (!(this.color instanceof Color)) {
        this.color = Color.fromString(this.color);
      }
      this.original = this.color.clone();
      this.render();
    }

    ColorPicker.prototype.render = function() {
      var _this = this;
      this.el.empty();
      this.gradient = new Gradient({
        color: this.color
      });
      this.spectrum = new Spectrum({
        color: this.color
      });
      this.alpha = new Alpha({
        color: this.color
      });
      this.display = new Display({
        color: this.color,
        original: this.original
      });
      this.gradient.bind('change', function(color) {
        _this.color.set(color.rgb());
        _this.display.setColor(_this.color);
        _this.alpha.setColor(_this.color);
        return _this.change();
      });
      this.spectrum.bind('change', function(color) {
        _this.color.set(color.rgb());
        _this.gradient.setColor(_this.color);
        _this.display.setColor(_this.color);
        _this.alpha.setColor(_this.color);
        return _this.change();
      });
      this.alpha.bind('change', function(color) {
        _this.color.set({
          a: color.a
        });
        _this.display.setColor(_this.color);
        return _this.change();
      });
      this.display.bind('change', function(color) {
        return _this.setColor(color);
      });
      return this.append(this.gradient, this.spectrum, this.alpha, this.display);
    };

    ColorPicker.prototype.setColor = function(color) {
      this.color = color;
      this.display.setColor(this.color);
      this.gradient.setColor(this.color);
      this.spectrum.setColor(this.color);
      this.alpha.setColor(this.color);
      return this.change();
    };

    ColorPicker.prototype.change = function(color) {
      if (color == null) color = this.color;
      return this.trigger('change', color);
    };

    ColorPicker.prototype.save = function(e) {
      e.preventDefault();
      this.close();
      return this.trigger('save', this.color);
    };

    ColorPicker.prototype.cancel = function(e) {
      e.preventDefault();
      this.close();
      this.trigger('cancel');
      return this.trigger('change', this.original);
    };

    ColorPicker.prototype.release = function() {
      ColorPicker.__super__.release.apply(this, arguments);
      this.gradient.release();
      this.spectrum.release();
      return this.display.release();
    };

    return ColorPicker;

  })(Popup);

  Input = (function(_super) {

    __extends(Input, _super);

    Input.prototype.className = 'colorInput';

    Input.prototype.events = {
      'click .preview': 'open',
      'change input': 'change'
    };

    function Input() {
      this.change = __bind(this.change, this);
      this.open = __bind(this.open, this);      Input.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color);
      this.$preview = $('<div />').addClass('preview');
      this.$preview.css({
        background: this.color.toString()
      });
      this.$input = $('<input type=color>');
      this.$input.val(this.color.toString());
      this.el.append(this.$preview, this.$input);
    }

    Input.prototype.open = function() {
      var _this = this;
      this.picker = new ColorPicker({
        color: this.color
      });
      this.picker.bind('change', function(color) {
        _this.$input.val(color.toString());
        return _this.$input.change();
      });
      return this.picker.open(this.el.offset());
    };

    Input.prototype.change = function() {
      this.color.set(Color.fromString(this.$input.val()));
      return this.$preview.css({
        background: this.color.toString()
      });
    };

    return Input;

  })(Spine.Controller);

  Preview = (function(_super) {

    __extends(Preview, _super);

    Preview.prototype.className = 'colorPreview';

    Preview.prototype.events = {
      'click': 'open'
    };

    function Preview() {
      this.open = __bind(this.open, this);      Preview.__super__.constructor.apply(this, arguments);
      this.color || (this.color = new Color);
      this.inner = $('<div />').addClass('inner');
      this.append(this.inner);
      this.render();
    }

    Preview.prototype.render = function() {
      return this.inner.css({
        background: this.color
      });
    };

    Preview.prototype.open = function() {
      var _this = this;
      this.picker = new ColorPicker({
        color: this.color
      });
      this.picker.bind('change', function(color) {
        _this.color.set(color);
        _this.trigger('change', _this.color);
        return _this.render();
      });
      return this.picker.open(this.el.offset());
    };

    return Preview;

  })(Spine.Controller);

  module.exports = ColorPicker;

  module.exports.Color = Color;

  module.exports.Input = Input;

  module.exports.Preview = Preview;

}).call(this);
;}});
