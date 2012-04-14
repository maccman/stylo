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
this.require.define({"app/controllers/stage/resizing":function(exports, require, module){(function() {
  var AreaTitle, Resizing,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  AreaTitle = (function(_super) {

    __extends(AreaTitle, _super);

    AreaTitle.name = 'AreaTitle';

    function AreaTitle() {
      return AreaTitle.__super__.constructor.apply(this, arguments);
    }

    AreaTitle.prototype.className = 'areaTitle';

    AreaTitle.prototype.change = function(area) {
      return this.html("width: " + area.width + "px &nbsp; height: " + area.height + "px");
    };

    AreaTitle.prototype.move = function(position) {
      return this.el.css({
        left: position.left,
        top: position.top
      });
    };

    return AreaTitle;

  })(Spine.Controller);

  Resizing = (function(_super) {

    __extends(Resizing, _super);

    Resizing.name = 'Resizing';

    Resizing.prototype.events = {
      'start.resize': 'resizeStart',
      'resize.element': 'resized',
      'end.resize': 'resizeEnd'
    };

    function Resizing(stage) {
      this.stage = stage;
      Resizing.__super__.constructor.call(this, {
        el: this.stage.el
      });
    }

    Resizing.prototype.resizeStart = function() {
      return this.stage.history.record();
    };

    Resizing.prototype.resized = function(e, element) {
      var area;
      area = element.area();
      if (!this.areaTitle) {
        this.append(this.areaTitle = new AreaTitle);
      }
      this.areaTitle.move({
        left: area.left + area.width + 10,
        top: area.top + area.height + 10
      });
      return this.areaTitle.change(area);
    };

    Resizing.prototype.resizeEnd = function() {
      var _ref;
      if ((_ref = this.areaTitle) != null) {
        _ref.release();
      }
      return this.areaTitle = null;
    };

    return Resizing;

  })(Spine.Controller);

  module.exports = Resizing;

}).call(this);
;}});
