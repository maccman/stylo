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
  var HorizontalCenterSnap, HorizontalEdgeSnap, HorizontalElementSnap, Snap, SnapLine, Snapping, VerticalCenterSnap, VerticalEdgeSnap, VerticalElementSnap,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  SnapLine = (function(_super) {

    __extends(SnapLine, _super);

    SnapLine.prototype.className = 'snapLine';

    function SnapLine(type) {
      this.type = type;
      SnapLine.__super__.constructor.call(this);
      this.el.addClass(this.type);
      if (this.type === 'horizontal') {
        this.set({
          left: 0,
          right: 0
        });
      } else if (this.type === 'vertical') {
        this.set({
          top: 0,
          bottom: 0
        });
      }
    }

    SnapLine.prototype.setValue = function(value) {
      if (this.type === 'horizontal') {
        return this.set({
          top: value
        });
      } else {
        return this.set({
          left: value
        });
      }
    };

    SnapLine.prototype.remove = function() {
      return this.el.remove();
    };

    SnapLine.prototype.set = function(values) {
      return this.el.css(values);
    };

    return SnapLine;

  })(Spine.Controller);

  Snap = (function(_super) {

    __extends(Snap, _super);

    Snap.prototype.threshold = 6;

    Snap.prototype.escapeThreshold = 10;

    Snap.prototype.value = 0;

    Snap.prototype.active = false;

    Snap.prototype.type = 'horizontal';

    function Snap(stage) {
      this.stage = stage;
      Snap.__super__.constructor.call(this, {
        el: this.stage.el
      });
      if (this.type === 'horizontal') {
        this.direction = 'top';
      } else {
        this.direction = 'left';
      }
      this.line = new SnapLine(this.type);
    }

    Snap.prototype.activate = function(value) {
      this.line.setValue(value);
      this.append(this.line);
      this.active = true;
      return this.value = 0;
    };

    Snap.prototype.remove = function() {
      this.line.remove();
      return this.active = false;
    };

    Snap.prototype.snap = function(area, difference) {
      if (this.active) {
        difference = this.snapOut(area, difference);
      } else {
        this.initial = difference[this.direction];
        difference = this.snapIn(area, difference);
        this.initial -= difference[this.direction];
      }
      return difference;
    };

    Snap.prototype.snapOut = function(area, difference) {
      this.value += difference[this.direction];
      if (this.withinThreshold(this.value, this.escapeThreshold)) {
        difference[this.direction] = 0;
      } else {
        difference[this.direction] = this.value + (this.initial || 0);
        this.remove();
      }
      return difference;
    };

    Snap.prototype.snapIn = function(area, difference) {
      return difference;
    };

    Snap.prototype.withinThreshold = function(value, threshold) {
      if (threshold == null) threshold = this.threshold;
      return value > -threshold && value < threshold;
    };

    return Snap;

  })(Spine.Controller);

  VerticalCenterSnap = (function(_super) {

    __extends(VerticalCenterSnap, _super);

    function VerticalCenterSnap() {
      VerticalCenterSnap.__super__.constructor.apply(this, arguments);
    }

    VerticalCenterSnap.prototype.type = 'vertical';

    VerticalCenterSnap.prototype.snapIn = function(area, difference) {
      var left, middle;
      left = area.left + (area.width / 2);
      middle = this.stage.area().width / 2;
      if (this.withinThreshold(left - middle)) {
        this.activate(middle);
        difference[this.direction] = middle - left;
      }
      return difference;
    };

    return VerticalCenterSnap;

  })(Snap);

  HorizontalCenterSnap = (function(_super) {

    __extends(HorizontalCenterSnap, _super);

    function HorizontalCenterSnap() {
      HorizontalCenterSnap.__super__.constructor.apply(this, arguments);
    }

    HorizontalCenterSnap.prototype.type = 'horizontal';

    HorizontalCenterSnap.prototype.snapIn = function(area, difference) {
      var middle, top;
      top = area.top + (area.height / 2);
      middle = this.stage.area().height / 2;
      if (this.withinThreshold(top - middle)) {
        this.activate(middle);
        difference[this.direction] = middle - top;
      }
      return difference;
    };

    return HorizontalCenterSnap;

  })(Snap);

  HorizontalEdgeSnap = (function(_super) {

    __extends(HorizontalEdgeSnap, _super);

    function HorizontalEdgeSnap() {
      HorizontalEdgeSnap.__super__.constructor.apply(this, arguments);
    }

    HorizontalEdgeSnap.prototype.type = 'horizontal';

    HorizontalEdgeSnap.prototype.snapIn = function(area, difference) {
      var bottom, stageHeight;
      bottom = area.top + area.height;
      stageHeight = this.stage.area().height;
      if (this.withinThreshold(area.top)) {
        this.activate(0);
        difference[this.direction] = -area.top;
      } else if (this.withinThreshold(bottom - stageHeight)) {
        this.activate(stageHeight);
        difference[this.direction] = stageHeight - bottom;
      }
      return difference;
    };

    return HorizontalEdgeSnap;

  })(Snap);

  VerticalEdgeSnap = (function(_super) {

    __extends(VerticalEdgeSnap, _super);

    function VerticalEdgeSnap() {
      VerticalEdgeSnap.__super__.constructor.apply(this, arguments);
    }

    VerticalEdgeSnap.prototype.type = 'vertical';

    VerticalEdgeSnap.prototype.snapIn = function(area, difference) {
      var right, stageWidth;
      right = area.left + area.width;
      stageWidth = this.stage.area().width;
      if (this.withinThreshold(area.left)) {
        this.activate(0);
        difference[this.direction] = -area.left;
      } else if (this.withinThreshold(right - stageWidth)) {
        this.activate(stageWidth);
        difference[this.direction] = stageWidth - right;
      }
      return difference;
    };

    return VerticalEdgeSnap;

  })(Snap);

  HorizontalElementSnap = (function(_super) {

    __extends(HorizontalElementSnap, _super);

    function HorizontalElementSnap() {
      HorizontalElementSnap.__super__.constructor.apply(this, arguments);
    }

    HorizontalElementSnap.prototype.type = 'horizontal';

    HorizontalElementSnap.prototype.snapIn = function(currentArea, difference) {
      var area, areas, current, element, i, typeA, typeB, valueA, valueB, _i, _j, _len, _len2, _len3, _ref;
      areas = [currentArea];
      _ref = this.stage.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        if (__indexOf.call(this.stage.selection.elements, element) >= 0) continue;
        areas.push(element.area());
      }
      for (i = 0, _len2 = areas.length; i < _len2; i++) {
        area = areas[i];
        areas[i] = {
          top: area.top,
          middle: area.top + area.height / 2,
          bottom: area.top + area.height
        };
      }
      current = areas.shift();
      for (_j = 0, _len3 = areas.length; _j < _len3; _j++) {
        area = areas[_j];
        for (typeA in current) {
          valueA = current[typeA];
          for (typeB in area) {
            valueB = area[typeB];
            if (this.withinThreshold(valueA - valueB)) {
              this.activate(valueB);
              difference[this.direction] = valueB - valueA;
              return difference;
            }
          }
        }
      }
      return difference;
    };

    return HorizontalElementSnap;

  })(Snap);

  VerticalElementSnap = (function(_super) {

    __extends(VerticalElementSnap, _super);

    function VerticalElementSnap() {
      VerticalElementSnap.__super__.constructor.apply(this, arguments);
    }

    VerticalElementSnap.prototype.type = 'vertical';

    VerticalElementSnap.prototype.snapIn = function(currentArea, difference) {
      var area, areas, current, element, i, typeA, typeB, valueA, valueB, _i, _j, _len, _len2, _len3, _ref;
      areas = [currentArea];
      _ref = this.stage.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        if (__indexOf.call(this.stage.selection.elements, element) >= 0) continue;
        areas.push(element.area());
      }
      for (i = 0, _len2 = areas.length; i < _len2; i++) {
        area = areas[i];
        areas[i] = {
          left: area.left,
          middle: area.left + area.width / 2,
          right: area.left + area.width
        };
      }
      current = areas.shift();
      for (_j = 0, _len3 = areas.length; _j < _len3; _j++) {
        area = areas[_j];
        for (typeA in current) {
          valueA = current[typeA];
          for (typeB in area) {
            valueB = area[typeB];
            if (this.withinThreshold(valueA - valueB)) {
              this.activate(valueB);
              difference[this.direction] = valueB - valueA;
              return difference;
            }
          }
        }
      }
      return difference;
    };

    return VerticalElementSnap;

  })(Snap);

  Snapping = (function(_super) {

    __extends(Snapping, _super);

    Snapping.prototype.events = {
      'resized': 'remove',
      'selection.change': 'remove',
      'dragging.end': 'remove'
    };

    function Snapping(stage) {
      this.stage = stage;
      Snapping.__super__.constructor.call(this, {
        el: this.stage.el
      });
      this.snaps = [];
      this.snaps.push(new VerticalCenterSnap(this.stage));
      this.snaps.push(new HorizontalCenterSnap(this.stage));
      this.snaps.push(new VerticalEdgeSnap(this.stage));
      this.snaps.push(new HorizontalEdgeSnap(this.stage));
      this.snaps.push(new HorizontalElementSnap(this.stage));
      this.snaps.push(new VerticalElementSnap(this.stage));
    }

    Snapping.prototype.snapSelection = function(difference) {
      return this.snap(this.stage.selection.area(), difference);
    };

    Snapping.prototype.snap = function(area, difference) {
      var snap, _i, _len, _ref;
      _ref = this.snaps;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        snap = _ref[_i];
        difference = snap.snap(area, difference);
      }
      return difference;
    };

    Snapping.prototype.remove = function() {
      var snap, _i, _len, _ref, _results;
      _ref = this.snaps;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        snap = _ref[_i];
        _results.push(snap.remove());
      }
      return _results;
    };

    return Snapping;

  })(Spine.Controller);

  module.exports = Snapping;

}).call(this);
;}});
