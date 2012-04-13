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
      'mousedown': 'cancel',
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
      this.remove();
      item = $(e.currentTarget);
      type = item.data('type');
      if (!item.hasClass('disabled')) {
        return this[type]();
      }
    };

    Menu.prototype.remove = function(e) {
      return this.el.remove();
    };

    Menu.prototype.cancel = function() {
      return false;
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
      'contextmenu': 'show'
    };

    function ContextMenu(stage) {
      this.stage = stage;
      this.remove = __bind(this.remove, this);

      ContextMenu.__super__.constructor.call(this, {
        el: this.stage.el
      });
      $('body').bind('mousedown', this.remove);
    }

    ContextMenu.prototype.show = function(e) {
      var position;
      e.preventDefault();
      this.remove();
      position = {
        left: e.pageX + 1,
        top: e.pageY + 1
      };
      this.menu = new Menu(this.stage, position);
      return $('body').append(this.menu.el);
    };

    ContextMenu.prototype.remove = function() {
      var _ref;
      if ((_ref = this.menu) != null) {
        _ref.remove();
      }
      return this.menu = null;
    };

    ContextMenu.prototype.release = function() {
      return $('body').unbind('mousedown', this.remove);
    };

    return ContextMenu;

  })(Spine.Controller);

  module.exports = ContextMenu;

}).call(this);
;}});
