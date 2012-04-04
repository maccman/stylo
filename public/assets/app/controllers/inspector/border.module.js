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
this.require.define({"app/controllers/inspector/border":function(exports, require, module){(function() {
  var Border,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Border = (function(_super) {

    __extends(Border, _super);

    Border.prototype.className = 'border';

    Border.prototype.styles = ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft'];

    Border.prototype.events = {
      'click [data-border]': 'borderClick',
      'change input': 'inputChange'
    };

    Border.prototype.current = 'border';

    function Border() {
      this.render = __bind(this.render, this);
      var style, _i, _len, _ref;
      Border.__super__.constructor.apply(this, arguments);
      this.borders = {};
      _ref = this.styles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        style = _ref[_i];
        this.borders[style] = this.stage.selection.get(style);
      }
      this.render();
    }

    Border.prototype.render = function() {
      return this.html(JST['app/views/inspector/border'](this));
    };

    Border.prototype.change = function(current) {
      this.current = current;
    };

    Border.prototype.borderClick = function(e) {
      return this.change($(e.target).data('border'));
    };

    Border.prototype.inputChange = function(e) {};

    return Border;

  })(Spine.Controller);

  module.exports = Border;

}).call(this);
;}});
