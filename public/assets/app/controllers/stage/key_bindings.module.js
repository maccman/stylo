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
this.require.define({"app/controllers/stage/key_bindings":function(exports, require, module){(function() {
  var KeyBindings,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  KeyBindings = (function(_super) {

    __extends(KeyBindings, _super);

    KeyBindings.name = 'KeyBindings';

    KeyBindings.include(Spine.Log);

    KeyBindings.prototype.mapping = {
      8: 'backspace',
      37: 'leftArrow',
      38: 'upArrow',
      39: 'rightArrow',
      40: 'downArrow',
      46: 'backspace',
      65: 'aKey',
      67: 'cKey',
      68: 'dKey',
      79: 'oKey',
      83: 'sKey',
      86: 'vKey',
      90: 'zKey',
      187: 'plusKey',
      189: 'minusKey'
    };

    function KeyBindings(stage) {
      this.stage = stage;
      this.keypress = __bind(this.keypress, this);

      $(document).bind('keydown', this.keypress);
    }

    KeyBindings.prototype.keypress = function(e) {
      var _name;
      if ('value' in e.target) {
        return;
      }
      if ($(e.target).attr('contenteditable')) {
        return;
      }
      return typeof this[_name = this.mapping[e.which]] === "function" ? this[_name](e) : void 0;
    };

    KeyBindings.prototype.backspace = function(e) {
      e.preventDefault();
      this.stage.history.record();
      return this.stage.removeSelected();
    };

    KeyBindings.prototype.leftArrow = function(e) {
      var amount;
      e.preventDefault();
      amount = -1;
      if (e.shiftKey) {
        amount *= 10;
      }
      this.stage.history.record('leftArrow');
      return this.stage.selection.moveBy({
        left: amount,
        top: 0
      });
    };

    KeyBindings.prototype.upArrow = function(e) {
      var amount;
      e.preventDefault();
      amount = -1;
      if (e.shiftKey) {
        amount *= 10;
      }
      this.stage.history.record('upArrow');
      return this.stage.selection.moveBy({
        left: 0,
        top: amount
      });
    };

    KeyBindings.prototype.rightArrow = function(e) {
      var amount;
      e.preventDefault();
      amount = 1;
      if (e.shiftKey) {
        amount *= 10;
      }
      this.stage.history.record('rightArrow');
      return this.stage.selection.moveBy({
        left: amount,
        top: 0
      });
    };

    KeyBindings.prototype.downArrow = function(e) {
      var amount;
      e.preventDefault();
      amount = 1;
      if (e.shiftKey) {
        amount *= 10;
      }
      this.stage.history.record('downArrow');
      return this.stage.selection.moveBy({
        left: 0,
        top: amount
      });
    };

    KeyBindings.prototype.aKey = function(e) {
      if (!e.metaKey) {
        return;
      }
      e.preventDefault();
      return this.stage.selectAll();
    };

    KeyBindings.prototype.dKey = function(e) {
      if (!e.metaKey) {
        return;
      }
      e.preventDefault();
      if (e.metaKey) {
        return this.stage.selection.clear();
      }
    };

    KeyBindings.prototype.oKey = function(e) {
      if (!e.metaKey) {
        return;
      }
      e.preventDefault();
      return this.stage.load();
    };

    KeyBindings.prototype.sKey = function(e) {
      if (!e.metaKey) {
        return;
      }
      e.preventDefault();
      return this.stage.save();
    };

    KeyBindings.prototype.plusKey = function(e) {
      if (!e.metaKey) {
        return;
      }
      e.preventDefault();
      return this.log('zoomIn');
    };

    KeyBindings.prototype.minusKey = function(e) {
      if (!e.metaKey) {
        return;
      }
      e.preventDefault();
      return this.log('zoomOut');
    };

    KeyBindings.prototype.cKey = function(e) {
      if (!e.metaKey) {
        return;
      }
      return this.stage.clipboard.copyInternal(e);
    };

    KeyBindings.prototype.vKey = function(e) {
      if (!e.metaKey) {
        return;
      }
      return this.stage.clipboard.pasteInternal(e);
    };

    KeyBindings.prototype.zKey = function(e) {
      if (!e.metaKey) {
        return;
      }
      e.preventDefault();
      if (e.shiftKey) {
        return this.stage.history.redo();
      } else {
        return this.stage.history.undo();
      }
    };

    KeyBindings.prototype.release = function() {
      return $(document).unbind('keydown', this.keypress);
    };

    return KeyBindings;

  })(Spine.Module);

  module.exports = KeyBindings;

}).call(this);
;}});
