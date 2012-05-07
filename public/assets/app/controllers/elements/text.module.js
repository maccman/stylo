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
this.require.define({"app/controllers/elements/text":function(exports, require, module){(function() {
  var Color, Rectangle, Text,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Color = require('app/models/properties/color');

  Rectangle = require('./rectangle');

  Text = (function(_super) {

    __extends(Text, _super);

    Text.name = 'Text';

    function Text() {
      return Text.__super__.constructor.apply(this, arguments);
    }

    Text.prototype.className = 'text';

    Text.prototype.id = module.id;

    Text.prototype.events = {
      'dblclick .thumb.br': 'fitToText'
    };

    Text.prototype.defaults = function() {
      var result;
      result = {
        height: 30,
        fontSize: 18,
        backgroundColor: new Color.Transparent
      };
      return $.extend({}, Text.__super__.defaults.apply(this, arguments), result);
    };

    Text.prototype.startEditing = function() {
      if (this.editing) {
        return;
      }
      Text.__super__.startEditing.apply(this, arguments);
      return this.autoSize();
    };

    Text.prototype.stopEditing = function() {
      if (!this.editing) {
        return;
      }
      Text.__super__.stopEditing.apply(this, arguments);
      if (this.text()) {
        return this.fixSize();
      } else {
        return this.remove();
      }
    };

    Text.prototype.autoSize = function() {
      return this.el.css({
        width: 'auto',
        height: 'auto'
      });
    };

    Text.prototype.fixSize = function() {
      return this.set({
        width: this.el.outerWidth(),
        height: this.el.outerHeight()
      });
    };

    return Text;

  })(Rectangle);

  module.exports = Text;

}).call(this);
;}});
