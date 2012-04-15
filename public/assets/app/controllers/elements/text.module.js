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
this.require.define({"app/controllers/elements/text":function(exports, require, module){(function() {
  var Color, Rectangle, Text,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Color = require('app/models/properties/color');

  Rectangle = require('./rectangle');

  Text = (function(_super) {

    __extends(Text, _super);

    Text.name = 'Text';

    Text.prototype.className = 'text';

    Text.prototype.id = module.id;

    Text.prototype.events = {
      'dblclick': 'startEditing',
      'dblclick .thumb.br': 'fitToText'
    };

    Text.prototype.textDefaults = function() {
      var result;
      return result = {
        height: 30,
        fontSize: 18,
        backgroundColor: new Color.Transparent
      };
    };

    function Text(attrs) {
      if (attrs == null) {
        attrs = {};
      }
      Text.__super__.constructor.apply(this, arguments);
      this.set(this.textDefaults());
      this.text(attrs.text);
    }

    Text.prototype.startEditing = function() {
      if (this.editing) {
        return;
      }
      this.editing = true;
      this.resizing.toggle(false);
      this.el.removeClass('selected');
      this.el.addClass('editing');
      this.el.css({
        height: 'auto'
      });
      this.el.attr('contenteditable', true);
      this.el.focus();
      return document.execCommand('selectAll', false, null);
    };

    Text.prototype.stopEditing = function() {
      if (!this.editing) {
        return;
      }
      this.editing = false;
      this.el.blur();
      this.el.removeAttr('contenteditable');
      this.el.scrollTop(0);
      this.el.addClass('selected');
      this.el.removeClass('editing');
      this.set({
        height: this.el.outerHeight()
      });
      if (!this.text()) {
        return this.remove();
      }
    };

    Text.prototype.toggleSelect = function() {
      if (this.editing) {
        return;
      }
      return Text.__super__.toggleSelect.apply(this, arguments);
    };

    Text.prototype.setSelected = function(bool) {
      if (!bool) {
        this.stopEditing();
      }
      return Text.__super__.setSelected.apply(this, arguments);
    };

    Text.prototype.fitToText = function() {
      this.el.css({
        width: 'auto',
        height: 'auto'
      });
      return this.set({
        width: this.el.outerWidth(),
        height: this.el.outerHeight()
      });
    };

    Text.prototype.text = function(text) {
      if (text != null) {
        this.el.text(text);
      }
      return this.el.text();
    };

    Text.prototype.toValue = function() {
      var result;
      result = Text.__super__.toValue.apply(this, arguments);
      result.text = this.text();
      return result;
    };

    return Text;

  })(Rectangle);

  module.exports = Text;

}).call(this);
;}});
