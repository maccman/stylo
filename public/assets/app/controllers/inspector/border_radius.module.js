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
this.require.define({"app/controllers/inspector/border_radius":function(exports, require, module){(function() {
  var BorderRadius,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BorderRadius = (function(_super) {

    __extends(BorderRadius, _super);

    BorderRadius.name = 'BorderRadius';

    BorderRadius.prototype.className = 'borderRadius';

    BorderRadius.prototype.events = {
      'click [data-border-radius]': 'borderClick',
      'change input': 'inputChange'
    };

    BorderRadius.prototype.elements = {
      '.borders div': '$borders',
      'input': '$inputs'
    };

    BorderRadius.prototype.current = 'borderRadius';

    function BorderRadius() {
      this.render = __bind(this.render, this);
      BorderRadius.__super__.constructor.apply(this, arguments);
      if (!this.stage) {
        throw 'stage required';
      }
      this.render();
    }

    BorderRadius.prototype.render = function() {
      this.disabled = !this.stage.selection.isAny();
      if (this.stage.selection.get('borderRadius') === false) {
        this.disabled = true;
      }
      this.html(JST['app/views/inspector/border_radius'](this));
      this.change(this.current);
      this.el.toggleClass('disabled', this.disabled);
      return this.$inputs.attr('disabled', this.disabled);
    };

    BorderRadius.prototype.change = function(current) {
      this.current = current;
      if (this.disabled) {
        return;
      }
      this.$borders.removeClass('active');
      this.$borders.filter("[data-border-radius=" + this.current + "]").addClass('active');
      this.radius = this.stage.selection.get(this.current);
      this.radius || (this.radius = this.stage.selection.get('borderRadius'));
      this.radius || (this.radius = 0);
      return this.$inputs.val(this.radius);
    };

    BorderRadius.prototype.borderClick = function(e) {
      return this.change($(e.currentTarget).data('border-radius'));
    };

    BorderRadius.prototype.inputChange = function(e) {
      var val;
      val = parseInt($(e.currentTarget).val(), 10);
      this.$inputs.val(val);
      return this.set(val);
    };

    BorderRadius.prototype.set = function(val) {
      if (this.current === 'borderRadius') {
        this.stage.selection.set({
          borderTopLeftRadius: null,
          borderTopRightRadius: null,
          borderBottomRightRadius: null,
          borderBottomLeftRadius: null
        });
      }
      return this.stage.selection.set(this.current, val);
    };

    return BorderRadius;

  })(Spine.Controller);

  module.exports = BorderRadius;

}).call(this);
;}});
