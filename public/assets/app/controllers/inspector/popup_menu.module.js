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
this.require.define({"app/controllers/inspector/popup_menu":function(exports, require, module){(function() {
  var PopupMenu,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PopupMenu = (function(_super) {

    __extends(PopupMenu, _super);

    PopupMenu.name = 'PopupMenu';

    PopupMenu.open = function(position) {
      return (new this).open(position);
    };

    PopupMenu.prototype.popupMenuEvents = {
      'mousedown': 'cancelEvent'
    };

    function PopupMenu() {
      this.close = __bind(this.close, this);
      PopupMenu.__super__.constructor.apply(this, arguments);
      this.delegateEvents(this.popupMenuEvents);
      this.el.addClass('popupMenu');
      this.el.css({
        position: 'absolute'
      });
    }

    PopupMenu.prototype.open = function(position) {
      if (position == null) {
        position = {};
      }
      this.el.css(position);
      $('body').append(this.el);
      $('body').bind('mousedown', this.close);
      return this;
    };

    PopupMenu.prototype.close = function() {
      this.release();
      return this;
    };

    PopupMenu.prototype.release = function() {
      $('body').unbind('mousedown', this.close);
      return PopupMenu.__super__.release.apply(this, arguments);
    };

    PopupMenu.prototype.cancelEvent = function(e) {
      return e.stopPropagation();
    };

    return PopupMenu;

  })(Spine.Controller);

  module.exports = PopupMenu;

}).call(this);
;}});
