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
this.require.define({"app/controllers/stage/context":function(exports, require, module){(function() {
  var Context, ContextMenu,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ContextMenu = (function(_super) {

    __extends(ContextMenu, _super);

    ContextMenu.name = 'ContextMenu';

    ContextMenu.prototype.className = 'contextMenu';

    ContextMenu.prototype.events = {
      'mousedown': 'cancel',
      'click [data-type]': 'click'
    };

    function ContextMenu(stage, position) {
      this.stage = stage;
      ContextMenu.__super__.constructor.call(this);
      this.el.css(position);
      this.html(JST['app/views/context_menu'](this));
      this.selectDisabled = !this.stage.selection.isAny();
      this.$('[data-require=select]').toggleClass('disabled', this.selectDisabled);
    }

    ContextMenu.prototype.click = function(e) {
      var item, type;
      e.preventDefault();
      this.remove();
      item = $(e.currentTarget);
      type = item.data('type');
      if (!item.hasClass('disabled')) {
        return this[type]();
      }
    };

    ContextMenu.prototype.remove = function(e) {
      return this.el.remove();
    };

    ContextMenu.prototype.cancel = function() {
      return false;
    };

    ContextMenu.prototype.copy = function() {
      return this.stage.clipboard.copyInternal();
    };

    ContextMenu.prototype.paste = function() {
      return this.stage.clipboard.pasteInternal();
    };

    ContextMenu.prototype.bringForward = function() {
      return this.stage.bringForward();
    };

    ContextMenu.prototype.bringBack = function() {
      return this.stage.bringBack();
    };

    ContextMenu.prototype.bringToFront = function() {
      return this.stage.bringToFront();
    };

    ContextMenu.prototype.bringToBack = function() {
      return this.stage.bringToBack();
    };

    return ContextMenu;

  })(Spine.Controller);

  Context = (function(_super) {

    __extends(Context, _super);

    Context.name = 'Context';

    Context.prototype.events = {
      'contextmenu': 'show'
    };

    function Context(stage) {
      this.stage = stage;
      this.remove = __bind(this.remove, this);

      Context.__super__.constructor.call(this, {
        el: this.stage.el
      });
      $('body').bind('mousedown', this.remove);
    }

    Context.prototype.show = function(e) {
      var position;
      e.preventDefault();
      this.remove();
      position = {
        left: e.pageX + 1,
        top: e.pageY + 1
      };
      this.menu = new ContextMenu(this.stage, position);
      return $('body').append(this.menu.el);
    };

    Context.prototype.remove = function() {
      var _ref;
      if ((_ref = this.menu) != null) {
        _ref.remove();
      }
      return this.menu = null;
    };

    Context.prototype.release = function() {
      $('body').unbind('mousedown', this.remove);
      return Context.__super__.release.apply(this, arguments);
    };

    return Context;

  })(Spine.Controller);

  module.exports = Context;

}).call(this);
;}});
