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

    Clipboard.name = 'Clipboard';

    function Clipboard(stage) {
      this.stage = stage;
      this.paste = __bind(this.paste, this);

      this.copy = __bind(this.copy, this);

      this.cancel = __bind(this.cancel, this);

      $(window).bind('beforecopy', this.cancel);
      $(window).bind('copy', this.copy);
    }

    Clipboard.prototype.cancel = function(e) {
      if ('value' in e.target) {
        return;
      }
      if ($(e.target).attr('contenteditable')) {
        return;
      }
      return e.preventDefault();
    };

    Clipboard.prototype.copy = function(e) {
      var el, json, styles;
      if (!this.stage.selection.isAny()) {
        return;
      }
      e.preventDefault();
      e = e.originalEvent;
      json = JSON.stringify(this.stage.selection.elements);
      e.clipboardData.setData('json/x-stylo', json);
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
      var el, elements, json, _i, _len;
      if ('value' in e.target) {
        return;
      }
      e.preventDefault();
      e = e.originalEvent;
      json = e.clipboardData.getData('json/x-stylo');
      if (!json) {
        return;
      }
      elements = Serialize.fromJSON(json);
      this.stage.history.record();
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        this.stage.add(el);
      }
      this.stage.selection.refresh(elements);
      return this.stage.selection.moveBy({
        left: 10,
        top: 10
      });
    };

    Clipboard.prototype.data = null;

    Clipboard.prototype.copyInternal = function() {
      var el;
      return this.data = (function() {
        var _i, _len, _ref, _results;
        _ref = this.stage.selection.elements;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          _results.push(el.clone());
        }
        return _results;
      }).call(this);
    };

    Clipboard.prototype.pasteInternal = function(e) {
      var el, _i, _len, _ref;
      if (!this.data) {
        return;
      }
      if (e != null) {
        e.preventDefault();
      }
      this.stage.history.record();
      _ref = this.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        this.stage.add(el);
      }
      this.stage.selection.refresh(this.data);
      this.stage.selection.moveBy({
        left: 10,
        top: 10
      });
      return this.copyInternal();
    };

    Clipboard.prototype.release = function() {
      $(window).unbind('beforecopy', this.cancel);
      $(window).unbind('copy', this.copy);
      $(window).unbind('beforepaste', this.cancel);
      return $(window).unbind('paste', this.paste);
    };

    return Clipboard;

  })();

  module.exports = Clipboard;

}).call(this);
;}});
