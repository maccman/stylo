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
this.require.define({"app/controllers/inspector/font":function(exports, require, module){(function() {
  var Color, ColorPicker, Font,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Color = require('app/models/properties/color');

  ColorPicker = require('lib/color_picker');

  Font = (function(_super) {

    __extends(Font, _super);

    Font.name = 'Font';

    Font.prototype.className = 'font';

    Font.prototype.elements = {
      'input': '$inputs',
      'input[name=size]': '$size',
      'select[name=family]': '$family'
    };

    Font.prototype.events = {
      'change input': 'change',
      'change select': 'change'
    };

    function Font() {
      this.render = __bind(this.render, this);

      var _this = this;
      Font.__super__.constructor.apply(this, arguments);
      this.html(JST['app/views/inspector/font'](this));
      this.$color = new ColorPicker.Preview;
      this.$color.bind('change', function() {
        return _this.change();
      });
      this.$('input[type=color]').replaceWith(this.$color.el);
    }

    Font.prototype.render = function() {
      this.disabled = !this.stage.selection.isAny();
      this.$color.val(this.stage.selection.get('color') || new Color.Black);
      this.$size.val(this.stage.selection.get('fontSize'));
      return this.$family.val(this.stage.selection.get('fontFamily'));
    };

    Font.prototype.change = function(e) {
      this.stage.history.record('font');
      this.stage.selection.set('color', this.$color.val());
      this.stage.selection.set('fontSize', parseInt(this.$size.val(), 10));
      return this.stage.selection.set('fontFamily', this.$family.val());
    };

    return Font;

  })(Spine.Controller);

  module.exports = Font;

}).call(this);
;}});
