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
      'change input': 'change'
    };

    TextShadow.prototype.elements = {
      'input[name=x]': '$x',
      'input[name=y]': '$y',
      'input[name=blur]': '$blur'
    };

    function TextShadow() {
      var _this = this;
      TextShadow.__super__.constructor.apply(this, arguments);
      this.$position = new PositionPicker;
      this.$position.bind('change', function(position) {
        _this.shadow.x = position.left;
        _this.shadow.y = position.top;
        _this.set();
        return _this.update();
      });
      this.$color = new ColorPicker.Preview;
      this.$color.bind('change', function() {
        return _this.change();
      });
      this.html(JST['app/views/inspector/text_shadow'](this));
      this.$('input[type=color]').replaceWith(this.$color.el);
      this.$('input[type=position]').replaceWith(this.$position.el);
    }

    TextShadow.prototype.render = function() {
      this.disabled = !this.stage.selection.isAny();
      this.shadow = this.stage.selection.get('textShadow');
      this.shadow || (this.shadow = new Shadow);
      this.update();
      return this;
    };

    TextShadow.prototype.update = function() {
      this.$('input').attr('disabled', this.disabled);
      this.$x.val(this.shadow.x);
      this.$y.val(this.shadow.y);
      this.$blur.val(this.shadow.blur);
      return this.$color.val(this.shadow.color);
    };

    TextShadow.prototype.change = function() {
      this.shadow.x = parseFloat(this.$x.val());
      this.shadow.y = parseFloat(this.$y.val());
      this.shadow.blur = parseFloat(this.$blur.val());
      this.shadow.color = this.$color.val();
      this.$position.change({
        left: this.shadow.x,
        top: this.shadow.y
      });
      this.set();
      return this.update();
    };

    TextShadow.prototype.set = function() {
      var _base;
      if ((_base = this.shadow).blur == null) {
        _base.blur = 0;
      }
      this.stage.history.record('textShadow');
      return this.stage.selection.set('textShadow', this.shadow);
    };

    TextShadow.prototype.release = function() {
      var _ref, _ref1;
      if ((_ref = this.$position) != null) {
        _ref.release();
      }
      if ((_ref1 = this.$color) != null) {
        _ref1.release();
      }
      return TextShadow.__super__.release.apply(this, arguments);
    };

    return TextShadow;

  })(Spine.Controller);

  module.exports = TextShadow;

}).call(this);
;}});
