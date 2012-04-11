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
this.require.define({"app/controllers/inspector/text_shadow":function(exports, require, module){(function() {
  var ColorPicker, PositionPicker, Shadow, TextShadow,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Shadow = require('app/models/properties/shadow');

  ColorPicker = require('lib/color_picker');

  PositionPicker = require('lib/position_picker');

  TextShadow = (function(_super) {

    __extends(TextShadow, _super);

    TextShadow.name = 'TextShadow';

    TextShadow.prototype.className = 'textShadow';

    TextShadow.prototype.events = {
      'change input': 'change',
      'click .preview': 'showColorPicker'
    };

    TextShadow.prototype.elements = {
      'input[name=x]': '$x',
      'input[name=y]': '$y',
      'input[name=blur]': '$blur',
      '.preview .inner': '$preview'
    };

    function TextShadow() {
      var _this = this;
      TextShadow.__super__.constructor.apply(this, arguments);
      this.positionPicker = new PositionPicker;
      this.positionPicker.bind('change', function(position) {
        _this.shadow.x = position.left;
        _this.shadow.y = position.top;
        _this.stage.selection.set('textShadow', _this.shadow.toString());
        return _this.update();
      });
      this.render();
    }

    TextShadow.prototype.render = function() {
      var _ref;
      this.disabled = !this.stage.selection.isAny();
      this.shadow = this.stage.selection.get('textShadow');
      this.shadow || (this.shadow = new Shadow);
      this.html(JST['app/views/inspector/text_shadow'](this));
      this.$('input').attr('disabled', this.disabled);
      this.$preview.css('background', (_ref = this.shadow) != null ? _ref.color.toString() : void 0);
      this.positionPicker.disabled = this.disabled;
      this.positionPicker.change({
        left: this.shadow.x,
        top: this.shadow.y
      });
      return this.append(this.positionPicker);
    };

    TextShadow.prototype.update = function() {
      var _ref;
      this.$('input').attr('disabled', this.disabled);
      this.$preview.css('background', (_ref = this.shadow) != null ? _ref.color.toString() : void 0);
      this.$x.val(this.shadow.x);
      this.$y.val(this.shadow.y);
      return this.$blur.val(this.shadow.blur);
    };

    TextShadow.prototype.showColorPicker = function(e) {
      var color, picker, _ref,
        _this = this;
      if (this.disabled) {
        return;
      }
      color = (_ref = this.shadow) != null ? _ref.color : void 0;
      picker = new ColorPicker({
        color: color
      });
      picker.bind('change', function(color) {
        _this.shadow.color = color;
        _this.change();
        return _this.update();
      });
      picker.bind('cancel', function() {
        _this.shadow.color = color;
        _this.change();
        return _this.update();
      });
      return picker.open(this.$preview.offset());
    };

    TextShadow.prototype.change = function() {
      this.shadow.x = parseFloat(this.$x.val());
      this.shadow.y = parseFloat(this.$y.val());
      this.shadow.blur = parseFloat(this.$blur.val());
      return this.stage.selection.set('textShadow', this.shadow);
    };

    TextShadow.prototype.release = function() {
      var _ref;
      if ((_ref = this.positionPicker) != null) {
        _ref.release();
      }
      return TextShadow.__super__.release.apply(this, arguments);
    };

    return TextShadow;

  })(Spine.Controller);

  module.exports = TextShadow;

}).call(this);
;}});
