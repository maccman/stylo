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
this.require.define({"app/controllers/stage/history":function(exports, require, module){(function() {
  var History, Model, Serialize,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Model = require('app/models/history');

  Serialize = require('app/models/serialize');

  History = (function(_super) {

    __extends(History, _super);

    History.name = 'History';

    function History(stage) {
      this.stage = stage;
      History.__super__.constructor.call(this, {
        el: this.stage.el
      });
    }

    History.prototype.undo = function() {
      return Model.undo();
    };

    History.prototype.redo = function() {
      return Model.redo();
    };

    History.prototype.record = function(type) {
      if (!this.throttle(type)) {
        return this.recordState();
      }
    };

    History.prototype.recordState = function(isUndo) {
      var action, elements,
        _this = this;
      elements = JSON.stringify(this.stage.elements);
      action = function(isUndo) {
        _this.recordState(!isUndo);
        elements = Serialize.fromJSON(elements);
        return _this.stage.refresh(elements);
      };
      return Model.add(action, isUndo);
    };

    History.prototype.throttleLimit = 500;

    History.prototype.throttle = function(type) {
      var current, throttled;
      throttled = false;
      current = new Date;
      if (type && this.throttleType === type && (current - this.throttleDate) <= this.throttleLimit) {
        throttled = true;
      }
      this.throttleType = type;
      this.throttleDate = current;
      return throttled;
    };

    History.prototype.release = function() {
      return Model.clear();
    };

    return History;

  })(Spine.Controller);

  module.exports = History;

}).call(this);
;}});
