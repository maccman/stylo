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
this.require.define({"app/controllers/stage/context_menu":function(exports, require, module){(function() {
  var ContextMenu, Menu,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Menu = (function(_super) {

    __extends(Menu, _super);

    Menu.name = 'Menu';

    Menu.prototype.className = 'contextMenu';

    Menu.prototype.events = {
      'mousedown': 'cancelEvent',
      'click [data-type]': 'click'
    };

    function Menu(stage, position) {
      this.stage = stage;
      Menu.__super__.constructor.call(this);
      this.el.css(position);
      this.html(JST['app/views/context_menu'](this));
      this.selectDisabled = !this.stage.selection.isAny();
      this.$('[data-require=select]').toggleClass('disabled', this.selectDisabled);
    }

    Menu.prototype.click = function(e) {
      var item, type;
      e.preventDefault();
      this.release();
      item = $(e.currentTarget);
      type = item.data('type');
      if (!item.hasClass('disabled')) {
        return this[type]();
      }
    };

    Menu.prototype.cancelEvent = function(e) {
      e.preventDefault();
      return e.stopPropagation();
    };

    Menu.prototype.copy = function() {
      return this.stage.clipboard.copyInternal();
    };

    Menu.prototype.paste = function() {
      return this.stage.clipboard.pasteInternal();
    };

    Menu.prototype.bringForward = function() {
      this.stage.history.record();
      return this.stage.bringForward();
    };

    Menu.prototype.bringBack = function() {
      this.stage.history.record();
      return this.stage.bringBack();
    };

    Menu.prototype.bringToFront = function() {
      this.stage.history.record();
      return this.stage.bringToFront();
    };

    Menu.prototype.bringToBack = function() {
      this.stage.history.record();
      return this.stage.bringToBack();
    };

    return Menu;

  })(Spine.Controller);

  ContextMenu = (function(_super) {

    __extends(ContextMenu, _super);

    ContextMenu.name = 'ContextMenu';

    ContextMenu.prototype.events = {
      'contextmenu': 'open'
    };

    function ContextMenu(stage) {
      this.stage = stage;
      this.close = __bind(this.close, this);

      ContextMenu.__super__.constructor.call(this, {
        el: this.stage.el
      });
      $('body').bind('mousedown', this.close);
    }

    ContextMenu.prototype.open = function(e) {
      var position;
      if (e.metaKey) {
        return;
      }
      e.preventDefault();
      this.close();
      position = {
        left: e.pageX + 1,
        top: e.pageY + 1
      };
      this.menu = new Menu(this.stage, position);
      return $('body').append(this.menu.el);
    };

    ContextMenu.prototype.close = function() {
      var _ref;
      if ((_ref = this.menu) != null) {
        _ref.release();
      }
      return this.menu = null;
    };

    ContextMenu.prototype.release = function() {
      return $('body').unbind('mousedown', this.close);
    };

    return ContextMenu;

  })(Spine.Controller);

  module.exports = ContextMenu;

}).call(this);
;}});
