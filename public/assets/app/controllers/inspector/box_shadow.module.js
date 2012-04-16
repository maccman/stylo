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
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Collection = require('lib/collection');

  Shadow = require('app/models/properties/shadow');

  ColorPicker = require('lib/color_picker');

  PositionPicker = require('lib/position_picker');

  Popup = require('lib/popup');

  BoxShadowEdit = (function(_super) {

    __extends(BoxShadowEdit, _super);

    BoxShadowEdit.name = 'BoxShadowEdit';

    BoxShadowEdit.prototype.className = 'edit';

    BoxShadowEdit.prototype.events = {
      'change input': 'inputChange'
    };

    BoxShadowEdit.prototype.elements = {
      'input[name=x]': '$x',
      'input[name=y]': '$y',
      'input[name=blur]': '$blur',
      'input': '$inputs'
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
      this.$color = new ColorPicker.Preview({
        color: this.shadow.color
      });
      this.$color.bind('change', function(color) {
        return _this.inputChange();
      });
      this.$position = new PositionPicker;
      this.$position.bind('change', function(position) {
        _this.shadow.x = position.left;
        _this.shadow.y = position.top;
        _this.trigger('change', _this.shadow);
        return _this.update();
      });
      this.html(JST['app/views/inspector/box_shadow'](this));
      this.$('input[type=color]').replaceWith(this.$color.el);
      this.$('input[type=position]').replaceWith(this.$position.el);
      this.update();
      return this;
    };

    BoxShadowEdit.prototype.update = function() {
      this.$inputs.attr('disabled', this.disabled);
      this.$position.change({
        left: this.shadow.x,
        top: this.shadow.y
      });
      this.$x.val(this.shadow.x);
      this.$y.val(this.shadow.y);
      this.$blur.val(this.shadow.blur);
      return this.$color.val(this.shadow.color);
    };

    BoxShadowEdit.prototype.inputChange = function(e) {
      this.shadow.x = parseFloat(this.$x.val());
      this.shadow.y = parseFloat(this.$y.val());
      this.shadow.blur = parseFloat(this.$blur.val()) || 0;
      this.shadow.color = this.$color.val();
      this.trigger('change', this.shadow);
      return this.update();
    };

    BoxShadowEdit.prototype.release = function() {
      var _ref, _ref1;
      if ((_ref = this.$color) != null) {
        _ref.release();
      }
      if ((_ref1 = this.$position) != null) {
        _ref1.release();
      }
      return BoxShadowEdit.__super__.release.apply(this, arguments);
    };

    return BoxShadowEdit;

  })(Spine.Controller);

  BoxShadowList = (function(_super) {

    __extends(BoxShadowList, _super);

    BoxShadowList.name = 'BoxShadowList';

    BoxShadowList.prototype.className = 'list';

    BoxShadowList.prototype.events = {
      'click .item': 'click',
      'click button.plus': 'addShadow',
      'click button.minus': 'removeShadow'
    };

    function BoxShadowList() {
      this.render = __bind(this.render, this);
      BoxShadowList.__super__.constructor.apply(this, arguments);
      if (!this.shadows) {
        throw 'shadows required';
      }
      this.shadows.change(this.render);
    }

    BoxShadowList.prototype.render = function() {
      var selected;
      this.html(JST['app/views/inspector/box_shadow/list'](this));
      this.$('.item').removeClass('selected');
      selected = this.$('.item').get(this.shadows.indexOf(this.current));
      $(selected).addClass('selected');
      return this;
    };

    BoxShadowList.prototype.click = function(e) {
      this.current = this.shadows[$(e.currentTarget).index()];
      this.trigger('change', this.current);
      this.render();
      return false;
    };

    BoxShadowList.prototype.addShadow = function() {
      this.shadows.push(this.current = new Shadow({
        blur: 3
      }));
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

    BoxShadow.name = 'BoxShadow';

    function BoxShadow() {
      this.set = __bind(this.set, this);
      return BoxShadow.__super__.constructor.apply(this, arguments);
    }

    BoxShadow.prototype.className = 'boxShadow';

    BoxShadow.prototype.render = function() {
      var _this = this;
      this.disabled = !this.stage.selection.isAny();
      this.el.toggleClass('disabled', this.disabled);
      this.shadows = this.stage.selection.get('boxShadow');
      this.shadows = new Collection(this.shadows);
      this.current = this.shadows.first();
      this.shadows.change(this.set);
      this.el.empty();
      this.el.append($('<h3/>').text('Shadow'));
      this.list = new BoxShadowList({
        current: this.current,
        shadows: this.shadows,
        disabled: this.disabled
      });
      this.list.bind('change', function(current) {
        _this.current = current;
        return _this.edit.change(_this.current);
      });
      this.append(this.list.render());
      this.edit = new BoxShadowEdit({
        shadow: this.current,
        disabled: this.disabled
      });
      this.edit.bind('change', function() {
        var _ref;
        return (_ref = _this.shadows).change.apply(_ref, arguments);
      });
      this.append(this.edit);
      return this;
    };

    BoxShadow.prototype.set = function(shadow) {
      if (shadow) {
        if (!this.shadows.include(shadow)) {
          this.shadows.push(shadow);
        }
      }
      this.stage.history.record('boxShadow');
      return this.stage.selection.set('boxShadow', this.shadows.valueOf());
    };

    BoxShadow.prototype.release = function() {
      var _ref, _ref1, _ref2;
      if ((_ref = this.list) != null) {
        _ref.release();
      }
      if ((_ref1 = this.edit) != null) {
        _ref1.release();
      }
      if ((_ref2 = this.shadows) != null) {
        _ref2.unbind();
      }
      return BoxShadow.__super__.release.apply(this, arguments);
    };

    return BoxShadow;

  })(Spine.Controller);

  module.exports = BoxShadow;

}).call(this);
;}});
