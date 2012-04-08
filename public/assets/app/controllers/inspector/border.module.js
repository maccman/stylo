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
this.require.define({"app/controllers/inspector/border":function(exports, require, module){(function() {
  var Border, BorderController, ColorPicker,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Border = require('app/models/properties/border');

  ColorPicker = require('lib/color_picker');

  BorderController = (function(_super) {

    __extends(BorderController, _super);

    BorderController.prototype.className = 'border';

    BorderController.prototype.events = {
      'click [data-border]': 'borderClick',
      'change': 'inputChange'
    };

    BorderController.prototype.elements = {
      '.borders div': '$borders',
      'select[name=style]': '$style',
      'input[name=thickness]': '$thickness'
    };

    BorderController.prototype.current = 'border';

    function BorderController() {
      this.render = __bind(this.render, this);      BorderController.__super__.constructor.apply(this, arguments);
      this.render();
    }

    BorderController.prototype.render = function() {
      var _this = this;
      this.html(JST['app/views/inspector/border'](this));
      this.$color = new ColorPicker.Preview;
      this.$color.bind('change', function() {
        return _this.inputChange();
      });
      this.$('input[type=color]').replaceWith(this.$color.el);
      return this.change(this.current);
    };

    BorderController.prototype.change = function(current) {
      var _ref;
      this.current = current;
      this.$borders.removeClass('active');
      this.$borders.filter("[data-border=" + this.current + "]").addClass('active');
      this.currentBorder = this.stage.selection.get(this.current);
      if (!this.currentBorder) {
        this.currentBorder = (_ref = this.stage.selection.get('border')) != null ? _ref.clone() : void 0;
        this.currentBorder || (this.currentBorder = new Border);
      }
      this.$thickness.val(this.currentBorder.width);
      this.$style.val(this.currentBorder.style);
      return this.$color.val(this.currentBorder.color);
    };

    BorderController.prototype.borderClick = function(e) {
      return this.change($(e.currentTarget).data('border'));
    };

    BorderController.prototype.inputChange = function() {
      this.currentBorder.width = parseInt(this.$thickness.val(), 10);
      this.currentBorder.style = this.$style.val();
      this.currentBorder.color = this.$color.val();
      return this.set();
    };

    BorderController.prototype.set = function() {
      return this.stage.selection.set(this.current, this.currentBorder);
    };

    return BorderController;

  })(Spine.Controller);

  module.exports = BorderController;

}).call(this);
;}});
