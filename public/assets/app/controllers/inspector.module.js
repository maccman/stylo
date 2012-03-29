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
  var Background, Border, BoxShadow, Inspector, Opacity, TextShadow,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Background = require('./inspector/background');

  Border = require('./inspector/border');

  Opacity = require('./inspector/opacity');

  BoxShadow = require('./inspector/box_shadow');

  TextShadow = require('./inspector/text_shadow');

  Inspector = (function(_super) {

    __extends(Inspector, _super);

    Inspector.prototype.className = 'inspector';

    function Inspector() {
      this.render = __bind(this.render, this);      Inspector.__super__.constructor.apply(this, arguments);
      this.stage.selection.bind('change', this.render);
      this.render();
    }

    Inspector.prototype.render = function() {
      this.el.empty();
      this.append(new Opacity({
        stage: this.stage
      }));
      return this.append(new BoxShadow({
        stage: this.stage
      }));
    };

    return Inspector;

  })(Spine.Controller);

  module.exports = Inspector;

}).call(this);
;}});
