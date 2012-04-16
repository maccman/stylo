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
this.require.define({"app/controllers/element/resizing":function(exports, require, module){(function() {
  var Resizing, Thumb,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Thumb = (function(_super) {

    __extends(Thumb, _super);

    Thumb.name = 'Thumb';

    Thumb.prototype.className = 'thumb';

    Thumb.prototype.events = {
      'mousedown': 'listen'
    };

    function Thumb(type) {
      this.type = type;
      this.drop = __bind(this.drop, this);

      this.drag = __bind(this.drag, this);

      this.listen = __bind(this.listen, this);

      Thumb.__super__.constructor.call(this);
      this.el.addClass(this.type);
    }

    Thumb.prototype.listen = function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.dragPosition = {
        left: e.pageX,
        top: e.pageY
      };
      $(document).mousemove(this.drag);
      $(document).mouseup(this.drop);
      return this.el.trigger('start.resize', [this.type]);
    };

    Thumb.prototype.drag = function(e) {
      var difference;
      difference = {
        left: e.pageX - this.dragPosition.left,
        top: e.pageY - this.dragPosition.top
      };
      this.dragPosition = {
        left: e.pageX,
        top: e.pageY
      };
      return this.el.trigger('drag.resize', [this.type, difference, e.shiftKey]);
    };

    Thumb.prototype.drop = function(e) {
      this.el.trigger('end.resize');
      $(document).unbind('mousemove', this.drag);
      return $(document).unbind('mouseup', this.drop);
    };

    return Thumb;

  })(Spine.Controller);

  Resizing = (function(_super) {

    __extends(Resizing, _super);

    Resizing.name = 'Resizing';

    Resizing.prototype.className = 'resizing';

    Resizing.prototype.events = {
      'drag.resize': 'resize'
    };

    function Resizing(element) {
      this.element = element;
      Resizing.__super__.constructor.call(this, {
        el: this.element.el
      });
    }

    Resizing.prototype.render = function() {
      this.thumbs = $('<div />');
      this.thumbs.append(new Thumb('tl').el);
      this.thumbs.append(new Thumb('tt').el);
      this.thumbs.append(new Thumb('tr').el);
      this.thumbs.append(new Thumb('rr').el);
      this.thumbs.append(new Thumb('br').el);
      this.thumbs.append(new Thumb('bb').el);
      this.thumbs.append(new Thumb('bl').el);
      this.thumbs.append(new Thumb('ll').el);
      this.thumbs = this.thumbs.children();
      return this.append(this.thumbs);
    };

    Resizing.prototype.remove = function() {
      var _ref;
      return (_ref = this.thumbs) != null ? _ref.remove() : void 0;
    };

    Resizing.prototype.toggle = function(bool) {
      if (bool) {
        return this.render();
      } else {
        return this.remove();
      }
    };

    Resizing.prototype.resize = function(e, type, position, lockAR) {
      var area;
      area = this.element.area();
      switch (type) {
        case 'tl':
          area.width -= position.left;
          area.height -= position.top;
          area.top += position.top;
          area.left += position.left;
          break;
        case 'tt':
          area.height -= position.top;
          area.top += position.top;
          break;
        case 'tr':
          area.width += position.left;
          area.height -= position.top;
          area.top += position.top;
          break;
        case 'rr':
          area.width += position.left;
          break;
        case 'br':
          area.width += position.left;
          area.height += position.top;
          break;
        case 'bb':
          area.height += position.top;
          break;
        case 'bl':
          area.width -= position.left;
          area.height += position.top;
          area.left += position.left;
          break;
        case 'll':
          area.width -= position.left;
          area.left += position.left;
      }
      if (lockAR) {
        area.width = Math.max(area.width, area.height);
        area.height = area.width;
      }
      area.width = Math.max(0, area.width);
      area.height = Math.max(0, area.height);
      return this.element.resize(area);
    };

    return Resizing;

  })(Spine.Controller);

  module.exports = Resizing;

}).call(this);
;}});
