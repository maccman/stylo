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
this.require.define({"app/controllers/inspector/text_position":function(exports, require, module){(function() {
  var TextPosition,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TextPosition = (function(_super) {

    __extends(TextPosition, _super);

    TextPosition.name = 'TextPosition';

    TextPosition.prototype.className = 'textPosition';

    TextPosition.prototype.types = ['textIndent', 'lineHeight', 'letterSpacing', 'wordSpacing'];

    TextPosition.prototype.elements = {
      'input[name=textIndent]': '$textIndent',
      'input[name=lineHeight]': '$lineHeight',
      'input[name=letterSpacing]': '$letterSpacing',
      'input[name=wordSpacing]': '$wordSpacing'
    };

    TextPosition.prototype.events = {
      'change input': 'change'
    };

    function TextPosition() {
      TextPosition.__super__.constructor.apply(this, arguments);
      this.html(JST['app/views/inspector/text_position'](this));
    }

    TextPosition.prototype.render = function() {
      var type, value, _i, _len, _ref, _results;
      this.disabled = !this.stage.selection.isAny();
      this.current = {};
      _ref = this.types;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        value = this.stage.selection.get(type);
        _results.push(this['$' + type].val(value));
      }
      return _results;
    };

    TextPosition.prototype.change = function() {
      var type, value, _i, _len, _ref, _results;
      _ref = this.types;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        value = parseInt(this['$' + type].val(), 10);
        _results.push(this.stage.selection.set(type, value));
      }
      return _results;
    };

    return TextPosition;

  })(Spine.Controller);

  module.exports = TextPosition;

}).call(this);
;}});
