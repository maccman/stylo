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
this.require.define({"app/controllers/header":function(exports, require, module){(function() {
  var Ellipsis, Header, Rectangle, Text,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Rectangle = require('./elements/rectangle');

  Ellipsis = require('./elements/ellipsis');

  Text = require('./elements/text');

  Header = (function(_super) {

    __extends(Header, _super);

    Header.name = 'Header';

    function Header() {
      return Header.__super__.constructor.apply(this, arguments);
    }

    Header.prototype.tag = 'header';

    Header.prototype.className = 'header';

    Header.prototype.events = {
      'click .rectangle': 'addRectangle',
      'click .ellipsis': 'addEllipsis',
      'click .text': 'addText'
    };

    Header.prototype.render = function() {
      this.html(JST['app/views/header'](this));
      return this;
    };

    Header.prototype.addRectangle = function() {
      return this.addElement(new Rectangle);
    };

    Header.prototype.addEllipsis = function() {
      return this.addElement(new Ellipsis);
    };

    Header.prototype.addText = function() {
      var element;
      this.addElement(element = new Text);
      return element.startEditing();
    };

    Header.prototype.addElement = function(element) {
      var position;
      position = this.stage.center();
      position.left -= element.get('width') || 50;
      position.top -= element.get('height') || 50;
      element.set(position);
      this.stage.add(element);
      this.stage.selection.clear();
      return this.stage.selection.add(element);
    };

    return Header;

  })(Spine.Controller);

  module.exports = Header;

}).call(this);
;}});
