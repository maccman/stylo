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
this.require.define({"app/controllers/elements/button":function(exports, require, module){(function() {
  var Background, Button, Color, Element,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Element = require('../element');

  Color = require('app/models/properties/color');

  Background = require('app/models/properties/background');

  Button = (function(_super) {

    __extends(Button, _super);

    Button.name = 'Button';

    function Button() {
      return Button.__super__.constructor.apply(this, arguments);
    }

    Button.prototype.className = 'button';

    Button.prototype.id = module.id;

    Button.prototype.events = {
      'resize.element': 'syncLineHeight'
    };

    Button.prototype.defaults = function() {
      var result;
      return result = {
        width: 100,
        height: 40,
        textAlign: 'center',
        lineHeight: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: new Color(166, 166, 166),
        backgroundImage: [new Background.LinearGradient(new Background.Position(270), [new Background.ColorStop(new Color.White, 0), new Background.ColorStop(new Color.White, 30), new Background.ColorStop(new Color(242, 242, 242), 100)])]
      };
    };

    Button.prototype.syncLineHeight = function() {
      return this.set({
        lineHeight: this.get('height')
      });
    };

    return Button;

  })(Element);

  module.exports = Button;

}).call(this);
;}});
