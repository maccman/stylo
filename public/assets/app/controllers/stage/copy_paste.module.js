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
this.require.define({"app/controllers/stage/copy_paste":function(exports, require, module){(function() {
  var CopyPaste,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CopyPaste = (function() {

    function CopyPaste(stage) {
      var _this = this;
      this.stage = stage;
      this.paste = __bind(this.paste, this);
      this.copy = __bind(this.copy, this);
      this.cancel = __bind(this.cancel, this);
      $(window).bind('beforecopy', this.cancel);
      $(window).bind('copy', this.copy);
      $(document).bind('beforepaste', function() {
        return alert('ga');
      });
      $(document).bind('paste', function() {
        return alert('ga');
      });
    }

    CopyPaste.prototype.cancel = function(e) {
      return e.preventDefault();
    };

    CopyPaste.prototype.copy = function(e) {
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
          _results.push(el.styles());
        }
        return _results;
      }).call(this);
      return e.clipboardData.setData('text/plain', styles.join("\n\n"));
    };

    CopyPaste.prototype.paste = function(e) {
      return console.log('paste');
    };

    return CopyPaste;

  })();

  module.exports = CopyPaste;

}).call(this);
;}});
