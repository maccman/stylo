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
this.require.define({"lib/popup":function(exports, require, module){(function() {
  var Popup,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Popup = (function(_super) {

    __extends(Popup, _super);

    Popup.open = function() {
      var _ref;
      return (_ref = new this).open.apply(_ref, arguments);
    };

    Popup.prototype.width = 400;

    function Popup() {
      this.remove = __bind(this.remove, this);
      this.close = __bind(this.close, this);
      this.open = __bind(this.open, this);      Popup.__super__.constructor.apply(this, arguments);
      this.el.delegate('click', '.close', this.close);
      this.el.addClass('popup');
      this.el.css({
        position: 'absolute'
      }).hide();
    }

    Popup.prototype.open = function(position) {
      var left, top;
      if (position == null) {
        position = {
          left: 0,
          top: 0
        };
      }
      left = position.left || position.clientX;
      top = position.top || position.clientY;
      left -= this.width + 17;
      top -= 5;
      this.el.css({
        left: left,
        top: top
      });
      $('body').append(this.el);
      this.el.gfxRaisedIn();
      return this.delay(function() {
        return $('body').mousedown(this.remove);
      });
    };

    Popup.prototype.close = function() {
      var _this = this;
      $('body').unbind('mousedown', this.remove);
      this.el.gfxRaisedOut();
      return this.el.queueNext(function() {
        _this.el.remove();
        return _this.trigger('hide');
      });
    };

    Popup.prototype.remove = function(e) {
      if (!$(e.target).closest(this.el).length) return this.close();
    };

    return Popup;

  })(Spine.Controller);

  module.exports = Popup;

}).call(this);
;}});
