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
this.require.define({"app/controllers/inspector/box_shadow":function(exports, require, module){(function() {
  var BoxShadow, BoxShadowEdit, BoxShadowList, Collection, ColorPicker, Popup, PositionPicker, Shadow,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Collection = require('lib/collection');

  Shadow = require('app/models/properties/shadow');

  ColorPicker = require('lib/color_picker');

  PositionPicker = require('lib/position_picker');

  Popup = require('lib/popup');

  BoxShadowEdit = (function(_super) {

    __extends(BoxShadowEdit, _super);

    BoxShadowEdit.prototype.className = 'edit';

    BoxShadowEdit.prototype.events = {
      'change input': 'inputChange'
    };

    BoxShadowEdit.prototype.elements = {
      'input[name=x]': '$x',
      'input[name=y]': '$y',
      'input[name=blur]': '$blur'
    };

    function BoxShadowEdit() {
      BoxShadowEdit.__super__.constructor.apply(this, arguments);
      this.change(this.shadow);
    }

    BoxShadowEdit.prototype.change = function(shadow) {
      this.shadow = shadow != null ? shadow : new Shadow;
      return this.render();
    };

    BoxShadowEdit.prototype.render = function() {
      var _this = this;
      this.html(JST['app/views/inspector/box_shadow'](this));
      this.colorInput = new ColorPicker.Preview({
        color: this.shadow.color,
        el: this.$('.colorInput')
      });
      this.colorInput.bind('change', function(color) {
        _this.shadow.color.set(color);
        _this.trigger('change', _this.shadow);
        return _this.update();
      });
      this.positionPicker = new PositionPicker({
        el: this.$('.positionInput')
      });
      this.positionPicker.bind('change', function(position) {
        _this.shadow.x = position.left;
        _this.shadow.y = position.top;
        _this.trigger('change', _this.shadow);
        return _this.update();
      });
      return this.update();
    };

    BoxShadowEdit.prototype.update = function() {
      this.$('input').attr('disabled', this.disabled);
      this.positionPicker.disabled = this.disabled;
      this.positionPicker.change({
        left: this.shadow.x,
        top: this.shadow.y
      });
      this.$x.val(this.shadow.x);
      this.$y.val(this.shadow.y);
      return this.$blur.val(this.shadow.blur);
    };

    BoxShadowEdit.prototype.inputChange = function(e) {
      this.shadow.x = parseFloat(this.$x.val());
      this.shadow.y = parseFloat(this.$y.val());
      this.shadow.blur = parseFloat(this.$blur.val()) || 0;
      this.trigger('change', this.shadow);
      return this.update();
    };

    return BoxShadowEdit;

  })(Spine.Controller);

  BoxShadowList = (function(_super) {

    __extends(BoxShadowList, _super);

    BoxShadowList.prototype.className = 'list';

    BoxShadowList.prototype.events = {
      'click .item': 'click',
      'click button.plus': 'addShadow',
      'click button.minus': 'removeShadow'
    };

    function BoxShadowList() {
      this.render = __bind(this.render, this);      BoxShadowList.__super__.constructor.apply(this, arguments);
      if (!this.shadows) throw 'shadows required';
      this.shadows.change(this.render);
      this.render();
    }

    BoxShadowList.prototype.render = function() {
      var selected;
      this.html(JST['app/views/inspector/box_shadow/list'](this));
      this.$('.item').removeClass('selected');
      selected = this.$('.item').get(this.shadows.indexOf(this.current));
      return $(selected).addClass('selected');
    };

    BoxShadowList.prototype.click = function(e) {
      this.current = this.shadows[$(e.currentTarget).index()];
      this.trigger('change', this.current);
      this.render();
      return false;
    };

    BoxShadowList.prototype.addShadow = function() {
      this.shadows.push(this.current = new Shadow);
      this.trigger('change', this.current);
      return false;
    };

    BoxShadowList.prototype.removeShadow = function() {
      this.shadows.remove(this.current);
      this.current = this.shadows.first();
      this.trigger('change', this.current);
      return false;
    };

    return BoxShadowList;

  })(Spine.Controller);

  BoxShadow = (function(_super) {

    __extends(BoxShadow, _super);

    BoxShadow.prototype.className = 'boxShadow';

    function BoxShadow() {
      this.set = __bind(this.set, this);      BoxShadow.__super__.constructor.apply(this, arguments);
      this.render();
    }

    BoxShadow.prototype.render = function() {
      var shadows,
        _this = this;
      this.disabled = !this.stage.selection.isAny();
      shadows = this.stage.selection.get('boxShadow');
      this.shadows = new Collection(shadows);
      this.current = this.shadows.first();
      this.shadows.change(this.set);
      this.el.empty();
      this.el.append($('<h3/>').text('Shadow'));
      this.list = new BoxShadowList({
        current: this.current,
        shadows: this.shadows
      });
      this.list.bind('change', function(current) {
        _this.current = current;
        return _this.edit.change(_this.current);
      });
      this.append(this.list);
      this.edit = new BoxShadowEdit({
        shadow: this.current
      });
      this.edit.bind('change', this.set);
      return this.append(this.edit);
    };

    BoxShadow.prototype.set = function(shadow) {
      if (shadow) if (!this.shadows.include(shadow)) this.shadows.push(shadow);
      return this.stage.selection.set('boxShadow', this.shadows.valueOf());
    };

    return BoxShadow;

  })(Spine.Controller);

  module.exports = BoxShadow;

}).call(this);
;}});
