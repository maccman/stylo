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
this.require.define({"app/controllers/inspector":function(exports, require, module){(function() {
  var Background, Border, BorderRadius, BoxShadow, Dimensions, DisplayInspector, Inspector, Opacity, TextInspector, TextPosition, TextShadow, Utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Background = require('./inspector/background');

  Border = require('./inspector/border');

  BorderRadius = require('./inspector/border_radius');

  Opacity = require('./inspector/opacity');

  BoxShadow = require('./inspector/box_shadow');

  TextShadow = require('./inspector/text_shadow');

  Dimensions = require('./inspector/dimensions');

  TextPosition = require('./inspector/text_position');

  Utils = require('lib/utils');

  TextInspector = (function(_super) {

    __extends(TextInspector, _super);

    TextInspector.name = 'TextInspector';

    TextInspector.prototype.className = 'textInspector';

    function TextInspector() {
      TextInspector.__super__.constructor.apply(this, arguments);
      this.append(this.textPosition = new TextPosition({
        stage: this.stage
      }));
    }

    TextInspector.prototype.render = function() {
      this.textPosition.render();
      return this;
    };

    TextInspector.prototype.release = function() {
      this.textPosition.release();
      return TextInspector.__super__.release.apply(this, arguments);
    };

    return TextInspector;

  })(Spine.Controller);

  DisplayInspector = (function(_super) {

    __extends(DisplayInspector, _super);

    DisplayInspector.name = 'DisplayInspector';

    DisplayInspector.prototype.className = 'displayInspector';

    function DisplayInspector() {
      DisplayInspector.__super__.constructor.apply(this, arguments);
      this.append(this.dimensions = new Dimensions({
        stage: this.stage
      }));
      this.append(this.background = new Background({
        stage: this.stage
      }));
      this.append(this.border = new Border({
        stage: this.stage
      }));
      this.append(this.borderRadius = new BorderRadius({
        stage: this.stage
      }));
      this.append(this.boxShadow = new BoxShadow({
        stage: this.stage
      }));
      this.append(this.opacity = new Opacity({
        stage: this.stage
      }));
    }

    DisplayInspector.prototype.render = function() {
      this.dimensions.render();
      this.background.render();
      this.border.render();
      this.borderRadius.render();
      this.boxShadow.render();
      this.opacity.render();
      return this;
    };

    DisplayInspector.prototype.release = function() {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      if ((_ref = this.dimensions) != null) {
        _ref.release();
      }
      if ((_ref1 = this.background) != null) {
        _ref1.release();
      }
      if ((_ref2 = this.border) != null) {
        _ref2.release();
      }
      if ((_ref3 = this.borderRadius) != null) {
        _ref3.release();
      }
      if ((_ref4 = this.boxShadow) != null) {
        _ref4.release();
      }
      return (_ref5 = this.opacity) != null ? _ref5.release() : void 0;
    };

    return DisplayInspector;

  })(Spine.Controller);

  Inspector = (function(_super) {

    __extends(Inspector, _super);

    Inspector.name = 'Inspector';

    Inspector.prototype.className = 'inspector';

    Inspector.prototype.events = {
      'click header [data-type]': 'changeInspector'
    };

    Inspector.prototype.elements = {
      'header div': '$headers'
    };

    function Inspector() {
      this.render = __bind(this.render, this);

      this.paint = __bind(this.paint, this);

      var _this = this;
      Inspector.__super__.constructor.apply(this, arguments);
      this.append(JST['app/views/inspector']());
      this.append(this.textInspector = new TextInspector({
        stage: this.stage
      }));
      this.append(this.displayInspector = new DisplayInspector({
        stage: this.stage
      }));
      this.manager = new Spine.Manager;
      this.manager.add(this.textInspector, this.displayInspector);
      this.manager.bind('change', function(controller) {
        var name;
        _this.$headers.removeClass('active');
        name = controller.constructor.name;
        return _this.$headers.filter("[data-type=" + name + "]").addClass('active');
      });
      this.displayInspector.active();
      this.stage.selection.bind('change', this.paint);
      this.render();
    }

    Inspector.prototype.paint = function() {
      if (this.rendering) {
        return;
      }
      this.rendering = true;
      return Utils.requestAnimationFrame(this.render);
    };

    Inspector.prototype.render = function() {
      this.el.hide();
      this.manager.current.render();
      this.el.show();
      this.rendering = false;
      return this;
    };

    Inspector.prototype.changeInspector = function(e) {
      var name;
      name = $(e.target).data('type');
      if (name === 'DisplayInspector') {
        this.displayInspector.render();
        return this.displayInspector.active();
      } else if (name === 'TextInspector') {
        this.textInspector.render();
        return this.textInspector.active();
      }
    };

    Inspector.prototype.release = function() {
      this.textInspector.release();
      this.displayInspector.release();
      this.stage.selection.unbind('change', this.paint);
      return Inspector.__super__.release.apply(this, arguments);
    };

    return Inspector;

  })(Spine.Controller);

  module.exports = Inspector;

}).call(this);
;}});
