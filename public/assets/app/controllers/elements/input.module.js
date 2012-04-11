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
this.require.define({"app/controllers/elements/input":function(exports, require, module){(function() {
  var CheckBox, Element, Input, Text, Textarea,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Element = require('../element');

  Input = (function(_super) {

    __extends(Input, _super);

    Input.name = 'Input';

    function Input() {
      return Input.__super__.constructor.apply(this, arguments);
    }

    Input.prototype.tag = 'input';

    return Input;

  })(Element);

  Text = (function(_super) {

    __extends(Text, _super);

    Text.name = 'Text';

    function Text() {
      return Text.__super__.constructor.apply(this, arguments);
    }

    Text.prototype.attrs = {
      type: 'text'
    };

    return Text;

  })(Input);

  Textarea = (function(_super) {

    __extends(Textarea, _super);

    Textarea.name = 'Textarea';

    function Textarea() {
      return Textarea.__super__.constructor.apply(this, arguments);
    }

    Textarea.prototype.tag = 'textarea';

    return Textarea;

  })(Input);

  CheckBox = (function(_super) {

    __extends(CheckBox, _super);

    CheckBox.name = 'CheckBox';

    function CheckBox() {
      return CheckBox.__super__.constructor.apply(this, arguments);
    }

    CheckBox.prototype.attrs = {
      type: 'checkbox'
    };

    return CheckBox;

  })(Input);

  module.exports = {
    Text: Text,
    Textarea: Textarea,
    CheckBox: CheckBox
  };

}).call(this);
;}});
