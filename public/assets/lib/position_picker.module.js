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
this.require.define({"lib/position_picker":function(exports, require, module){(function() {
  var PositionPicker,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PositionPicker = (function(_super) {

    __extends(PositionPicker, _super);

    PositionPicker.prototype.className = 'positionPicker';

    PositionPicker.prototype.events = {
      'mousedown': 'drag'
    };

    PositionPicker.prototype.width = 40;

    PositionPicker.prototype.height = 40;

    function PositionPicker() {
      this.drop = __bind(this.drop, this);
      this.over = __bind(this.over, this);      PositionPicker.__super__.constructor.apply(this, arguments);
      this.el.css({
        width: this.width,
        height: this.height
      });
      this.ball = $('<div />').addClass('ball');
      this.append(this.ball);
      this.ball.css({
        left: '50%',
        top: '50%'
      });
    }

    PositionPicker.prototype.change = function(position) {
      var left, top;
      left = position.left + this.width / 2;
      left = Math.max(Math.min(left, this.width), 0);
      top = position.top + this.height / 2;
      top = Math.max(Math.min(top, this.height), 0);
      return this.ball.css({
        left: left,
        top: top
      });
    };

    PositionPicker.prototype.drag = function(e) {
      if (this.disabled) return;
      this.offset = $(this.el).offset();
      $(document).mousemove(this.over);
      $(document).mouseup(this.drop);
      return this.over(e);
    };

    PositionPicker.prototype.over = function(e) {
      var difference;
      e.preventDefault();
      difference = {
        left: e.pageX - this.offset.left - (this.width / 2),
        top: e.pageY - this.offset.top - (this.height / 2)
      };
      this.change(difference);
      return this.trigger('change', difference);
    };

    PositionPicker.prototype.drop = function() {
      $(document).unbind('mousemove', this.over);
      return $(document).unbind('mouseup', this.drop);
    };

    return PositionPicker;

  })(Spine.Controller);

  module.exports = PositionPicker;

}).call(this);
;}});
