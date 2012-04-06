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
this.require.define({"app/controllers/stage/clipboard":function(exports, require, module){(function() {
  var Clipboard, Serialize,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Serialize = require('app/models/serialize');

  Clipboard = (function() {

    function Clipboard(stage) {
      this.stage = stage;
      this.paste = __bind(this.paste, this);
      this.copy = __bind(this.copy, this);
      this.cancel = __bind(this.cancel, this);
      $(window).bind('beforecopy', this.cancel);
      $(window).bind('copy', this.copy);
      $(window).bind('beforepaste', this.cancel);
      $(window).bind('paste', this.paste);
    }

    Clipboard.prototype.cancel = function(e) {
      return e.preventDefault();
    };

    Clipboard.prototype.copy = function(e) {
      var el, html, json, styles;
      if (!this.stage.selection.isAny()) return;
      e.preventDefault();
      e = e.originalEvent;
      json = JSON.stringify(this.stage.selection.elements);
      e.clipboardData.setData('json/x-stylo', json);
      html = (function() {
        var _i, _len, _ref, _results;
        _ref = this.stage.selection.elements;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          _results.push(el.outerHTML());
        }
        return _results;
      }).call(this);
      e.clipboardData.setData('text/html', html.join("\n"));
      styles = (function() {
        var _i, _len, _ref, _results;
        _ref = this.stage.selection.elements;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          _results.push(el.outerCSS());
        }
        return _results;
      }).call(this);
      return e.clipboardData.setData('text/plain', styles.join("\n\n"));
    };

    Clipboard.prototype.paste = function(e) {
      var el, elements, json, _i, _j, _len, _len2, _results;
      if ('value' in e.target) return;
      e.preventDefault();
      e = e.originalEvent;
      json = e.clipboardData.getData('json/x-stylo');
      elements = Serialize.fromJSON(json);
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        this.stage.add(el);
      }
      this.stage.selection.clear();
      _results = [];
      for (_j = 0, _len2 = elements.length; _j < _len2; _j++) {
        el = elements[_j];
        _results.push(this.stage.selection.add(el));
      }
      return _results;
    };

    return Clipboard;

  })();

  module.exports = Clipboard;

}).call(this);
;}});
