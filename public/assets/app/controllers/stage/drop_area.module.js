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
this.require.define({"app/controllers/stage/drop_area":function(exports, require, module){(function() {
  var DropArea, Image,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Image = require('app/controllers/elements/image');

  DropArea = (function(_super) {

    __extends(DropArea, _super);

    DropArea.name = 'DropArea';

    DropArea.prototype.events = {
      'drop': 'drop',
      'dragenter': 'cancel',
      'dragover': 'cancel',
      'dragleave': 'cancel'
    };

    function DropArea(stage) {
      this.stage = stage;
      DropArea.__super__.constructor.call(this, {
        el: this.stage.el
      });
      $('body').bind('drop', this.cancel);
    }

    DropArea.prototype.drop = function(e) {
      var file, reader, _i, _len, _ref, _results,
        _this = this;
      e.preventDefault();
      e = e.originalEvent;
      _ref = e.dataTransfer.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        reader = new FileReader;
        reader.onload = function(e) {
          return _this.addImage(e.target.result);
        };
        _results.push(reader.readAsDataURL(file));
      }
      return _results;
    };

    DropArea.prototype.addImage = function(src) {
      var element;
      this.stage.history.record();
      element = new Image({
        src: src
      });
      this.stage.add(element);
      this.stage.selection.clear();
      return this.stage.selection.add(element);
    };

    DropArea.prototype.cancel = function(e) {
      return e.preventDefault();
    };

    DropArea.prototype.release = function() {
      return $('body').unbind('drop', this.cancel);
    };

    return DropArea;

  })(Spine.Controller);

  module.exports = DropArea;

}).call(this);
;}});
