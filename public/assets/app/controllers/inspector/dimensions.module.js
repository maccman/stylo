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
this.require.define({"app/controllers/inspector/dimensions":function(exports, require, module){(function() {
  var Dimensions,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Dimensions = (function(_super) {

    __extends(Dimensions, _super);

    Dimensions.name = 'Dimensions';

    Dimensions.prototype.className = 'dimensions';

    Dimensions.prototype.events = {
      'change input': 'change'
    };

    Dimensions.prototype.elements = {
      'input': '$inputs',
      'input[name=width]': '$width',
      'input[name=height]': '$height',
      'input[name=x]': '$x',
      'input[name=y]': '$y'
    };

    function Dimensions() {
      this.update = __bind(this.update, this);

      this.render = __bind(this.render, this);
      Dimensions.__super__.constructor.apply(this, arguments);
      $(document).bind('resize.element move.element', this.update);
    }

    Dimensions.prototype.render = function() {
      this.disabled = !this.stage.selection.isSingle();
      this.html(JST['app/views/inspector/dimensions'](this));
      this.update();
      this.el.toggleClass('disabled', this.disabled);
      this.$inputs.attr('disabled', this.disabled);
      return this;
    };

    Dimensions.prototype.update = function() {
      this.disabled = !this.stage.selection.isSingle();
      if (this.disabled) {
        return;
      }
      this.$width.val(this.stage.selection.get('width'));
      this.$height.val(this.stage.selection.get('height'));
      this.$x.val(this.stage.selection.get('left'));
      return this.$y.val(this.stage.selection.get('top'));
    };

    Dimensions.prototype.change = function(e) {
      this.stage.history.record('dimensions');
      this.stage.selection.set('width', parseInt(this.$width.val(), 10));
      this.stage.selection.set('height', parseInt(this.$height.val(), 10));
      this.stage.selection.set('left', parseInt(this.$x.val(), 10));
      return this.stage.selection.set('top', parseInt(this.$y.val(), 10));
    };

    Dimensions.prototype.release = function() {
      $(document).unbind('resize.element', this.update);
      $(document).unbind('move.element', this.update);
      return Dimensions.__super__.release.apply(this, arguments);
    };

    return Dimensions;

  })(Spine.Controller);

  module.exports = Dimensions;

}).call(this);
;}});
