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
this.require.define({"app/models/undo":function(exports, require, module){(function() {
  var Undo;

  Undo = (function() {

    Undo.name = 'Undo';

    function Undo() {}

    Undo.undoStack = [];

    Undo.redoStack = [];

    Undo.add = function(undo, redo) {
      this.undoStack.push([undo, redo]);
      this.redoStack = [];
      return redo();
    };

    Undo.undo = function() {
      var action, redo, undo;
      action = this.undoStack.pop();
      if (!action) {
        return;
      }
      undo = action[0], redo = action[1];
      undo();
      return this.redoStack.push(action);
    };

    Undo.redo = function() {
      var action, redo, undo;
      action = this.redoStack.pop();
      if (!action) {
        return;
      }
      undo = action[0], redo = action[1];
      redo();
      return this.undoStack.push(action);
    };

    return Undo;

  })();

  module.exports = Undo;

}).call(this);
;}});
