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
this.require.define({"app/controllers/stage/snapping":function(exports, require, module){(function() {
  var SnapLine, Snapping,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  SnapLine = (function(_super) {

    __extends(SnapLine, _super);

    SnapLine.prototype.className = 'snapLine';

    function SnapLine(type) {
      this.type = type;
      SnapLine.__super__.constructor.call(this);
      this.el.addClass(this.type);
    }

    SnapLine.prototype.set = function(values) {
      return this.el.css(values);
    };

    SnapLine.prototype.remove = function() {
      return this.el.remove();
    };

    return SnapLine;

  })(Spine.Controller);

  Snapping = (function(_super) {

    __extends(Snapping, _super);

    Snapping.prototype.events = {
      'resized': 'removeLines',
      'selection.change': 'removeLines',
      'dragging.end': 'removeLines'
    };

    function Snapping(stage) {
      this.stage = stage;
      Snapping.__super__.constructor.call(this, {
        el: this.stage.el
      });
      this.lines = {};
      this.snapped = {};
    }

    Snapping.prototype.snapElement = function(element, difference) {
      return this.snap(element.area(), difference);
    };

    Snapping.prototype.snapSelection = function(difference) {
      return this.snap(this.stage.selection.area(), difference);
    };

    Snapping.prototype.snap = function(area, difference) {
      this.stageArea = this.stage.area();
      difference = this.verticalStageSnap(area, difference);
      difference = this.horizontalStageSnap(area, difference);
      return difference;
    };

    Snapping.prototype.threshold = 6;

    Snapping.prototype.escapeThreshold = 10;

    Snapping.prototype.withinThreshold = function(a, b, threshold) {
      if (threshold == null) threshold = this.threshold;
      return (a - b) > -threshold && (a - b) < threshold;
    };

    Snapping.prototype.verticalStageSnap = function(area, difference) {
      var left, middle, _ref, _ref2;
      left = area.left + (area.width / 2);
      middle = this.stageArea.width / 2;
      if (this.snapped.vertical) {
        this.snapped.vertical += difference.left;
        if (this.snapped.vertical > this.escapeThreshold || this.snapped.vertical < -this.escapeThreshold) {
          difference.left = this.snapped.vertical;
          this.snapped.vertical = 0;
          if ((_ref = this.lines.vertical) != null) _ref.remove();
        } else {
          difference.left = 0;
        }
      } else if (this.withinThreshold(left, middle)) {
        this.snapped.vertical = 1;
        difference.left = middle - left;
        if ((_ref2 = this.lines.vertical) != null) _ref2.remove();
        this.lines.vertical = new SnapLine('vertical');
        this.lines.vertical.set({
          left: middle,
          top: 0,
          bottom: 0
        });
        this.append(this.lines.vertical);
      }
      return difference;
    };

    Snapping.prototype.horizontalStageSnap = function(area, difference) {
      var middle, top, _ref, _ref2;
      top = area.top + (area.height / 2);
      middle = this.stageArea.height / 2;
      if (this.snapped.horizontal) {
        this.snapped.horizontal += difference.top;
        if (this.snapped.horizontal > this.escapeThreshold || this.snapped.horizontal < -this.escapeThreshold) {
          difference.top = this.snapped.horizontal;
          this.snapped.horizontal = 0;
          if ((_ref = this.lines.horizontal) != null) _ref.remove();
        } else {
          difference.top = 0;
        }
      } else if (this.withinThreshold(top, middle)) {
        this.snapped.horizontal = 1;
        difference.top = middle - top;
        if ((_ref2 = this.lines.horizontal) != null) _ref2.remove();
        this.lines.horizontal = new SnapLine('horizontal');
        this.lines.horizontal.set({
          top: middle,
          left: 0,
          right: 0
        });
        this.append(this.lines.horizontal);
      }
      return difference;
    };

    Snapping.prototype.removeLines = function() {
      return this.$('.snapLine').remove();
    };

    return Snapping;

  })(Spine.Controller);

  module.exports = Snapping;

}).call(this);
;}});
