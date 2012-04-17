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
this.require.define({"app/controllers/stage/select_area":function(exports, require, module){(function() {
  var Area, SelectArea,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Area = (function(_super) {

    __extends(Area, _super);

    Area.name = 'Area';

    Area.prototype.className = 'selectArea';

    function Area(left, top) {
      this.left = left;
      this.top = top;
      Area.__super__.constructor.call(this);
      this.el.css({
        left: this.left,
        top: this.top
      });
    }

    Area.prototype.area = function() {
      var area;
      area = this.el.position();
      area.height = this.el.height();
      area.width = this.el.width();
      return area;
    };

    Area.prototype.resize = function(left, top) {
      var dimensions;
      dimensions = {
        width: left - this.left,
        height: top - this.top
      };
      if (dimensions.width < 0) {
        dimensions.left = this.left + dimensions.width;
        dimensions.width *= -1;
      }
      if (dimensions.height < 0) {
        dimensions.top = this.top + dimensions.height;
        dimensions.height *= -1;
      }
      return this.el.css(dimensions);
    };

    return Area;

  })(Spine.Controller);

  SelectArea = (function(_super) {

    __extends(SelectArea, _super);

    SelectArea.name = 'SelectArea';

    SelectArea.prototype.events = {
      'mousedown': 'listen'
    };

    function SelectArea(stage) {
      this.stage = stage;
      this.drop = __bind(this.drop, this);

      this.drag = __bind(this.drag, this);

      this.listen = __bind(this.listen, this);

      SelectArea.__super__.constructor.call(this, {
        el: this.stage.el
      });
    }

    SelectArea.prototype.listen = function(e) {
      var _ref;
      if (e.target !== e.currentTarget) {
        return;
      }
      this.offset = this.el.offset();
      this.offset.left -= this.el.scrollLeft();
      this.offset.top -= this.el.scrollTop();
      if ((_ref = this.selectArea) != null) {
        _ref.release();
      }
      $(document).mousemove(this.drag);
      $(document).mouseup(this.drop);
      return true;
    };

    SelectArea.prototype.drag = function(e) {
      var area, element, _i, _len, _ref;
      if (!this.selectArea) {
        this.selectArea = new Area(e.pageX - this.offset.left + 1, e.pageY - this.offset.top + 1);
        this.append(this.selectArea);
      }
      this.selectArea.resize(e.pageX - this.offset.left, e.pageY - this.offset.top);
      area = this.selectArea.area();
      _ref = this.stage.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        if (element.inArea(area)) {
          this.stage.selection.add(element);
        } else {
          this.stage.selection.remove(element);
        }
      }
      return true;
    };

    SelectArea.prototype.drop = function(e) {
      var _ref;
      if ((_ref = this.selectArea) != null) {
        _ref.release();
      }
      this.selectArea = null;
      $(document).unbind('mousemove', this.drag);
      $(document).unbind('mouseup', this.drop);
      return true;
    };

    return SelectArea;

  })(Spine.Controller);

  module.exports = SelectArea;

}).call(this);
;}});
