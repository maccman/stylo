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
this.require.define({"app/controllers/stage/dragging":function(exports, require, module){(function() {
  var CoordTitle, Dragging,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CoordTitle = (function(_super) {

    __extends(CoordTitle, _super);

    CoordTitle.name = 'CoordTitle';

    function CoordTitle() {
      return CoordTitle.__super__.constructor.apply(this, arguments);
    }

    CoordTitle.prototype.className = 'coordTitle';

    CoordTitle.prototype.change = function(area) {
      return this.html("x: " + area.left + "px &nbsp; y: " + area.top + "px");
    };

    CoordTitle.prototype.move = function(position) {
      return this.el.css({
        left: position.left,
        top: position.top
      });
    };

    return CoordTitle;

  })(Spine.Controller);

  Dragging = (function(_super) {

    __extends(Dragging, _super);

    Dragging.name = 'Dragging';

    Dragging.prototype.events = {
      'mousedown .selected': 'listen'
    };

    function Dragging(stage) {
      this.stage = stage;
      this.drop = __bind(this.drop, this);

      this.drag = __bind(this.drag, this);

      this.listen = __bind(this.listen, this);

      Dragging.__super__.constructor.call(this, {
        el: this.stage.el
      });
    }

    Dragging.prototype.listen = function(e) {
      var clones;
      e.preventDefault();
      if (e.altKey) {
        clones = this.stage.cloneSelected();
        this.stage.selection.refresh(clones);
      }
      this.stage.history.record();
      this.dragPosition = {
        left: e.pageX,
        top: e.pageY
      };
      this.active = false;
      $(document).mousemove(this.drag);
      return $(document).mouseup(this.drop);
    };

    Dragging.prototype.drag = function(e) {
      var difference;
      if (this.active === false) {
        this.trigger('start.dragging');
      }
      this.active = true;
      difference = {
        left: e.pageX - this.dragPosition.left,
        top: e.pageY - this.dragPosition.top
      };
      this.dragPosition = {
        left: e.pageX,
        top: e.pageY
      };
      this.stageArea = this.stage.area();
      this.selectionArea = this.stage.selection.area();
      if (e.altKey || e.metaKey) {
        this.stage.snapping.release();
      } else {
        difference = this.stage.snapping.snap(this.selectionArea, difference);
      }
      this.moveCoordTitle(e);
      this.stage.selection.moveBy(difference);
      return this.el.trigger('move.dragging');
    };

    Dragging.prototype.drop = function(e) {
      var _ref;
      $(document).unbind('mousemove', this.drag);
      $(document).unbind('mouseup', this.drop);
      if (this.active) {
        this.el.trigger('end.dragging');
      }
      if ((_ref = this.coordTitle) != null) {
        _ref.release();
      }
      return this.coordTitle = null;
    };

    Dragging.prototype.moveCoordTitle = function() {
      if (!this.coordTitle) {
        this.append(this.coordTitle = new CoordTitle);
      }
      this.coordTitle.move({
        left: this.dragPosition.left - this.stageArea.left + 10,
        top: this.dragPosition.top - this.stageArea.top + 10
      });
      return this.coordTitle.change(this.selectionArea);
    };

    return Dragging;

  })(Spine.Controller);

  module.exports = Dragging;

}).call(this);
;}});
