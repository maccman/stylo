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
this.require.define({"app/models/history":function(exports, require, module){(function() {
  var History;

  History = (function() {

    History.name = 'History';

    function History() {}

    History.undoStack = [];

    History.redoStack = [];

    History.max = 50;

    History.add = function(action, isUndo) {
      var stack;
      if (isUndo === true) {
        stack = this.undoStack;
      } else if (isUndo === false) {
        stack = this.redoStack;
      } else {
        stack = this.undoStack;
        if (stack.length >= this.max) {
          stack.shift();
        }
        this.redoStack = [];
      }
      return stack.push(action);
    };

    History.undo = function() {
      var action;
      action = this.undoStack.pop();
      if (action) {
        return action.call(this, true);
      } else {
        return false;
      }
    };

    History.redo = function() {
      var action;
      action = this.redoStack.pop();
      if (action) {
        return action.call(this, false);
      } else {
        return false;
      }
    };

    return History;

  })();

  module.exports = History;

}).call(this);
;}});
