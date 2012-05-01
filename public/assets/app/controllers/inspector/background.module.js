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
this.require.define({"app/controllers/inspector/background":function(exports, require, module){(function() {
  var Background, BackgroundImage, BackgroundInspector, BackgroundType, Backgrounds, Collection, Color, ColorPicker, Edit, GradientPicker, List, PopupMenu,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Collection = require('lib/collection');

  ColorPicker = require('lib/color_picker');

  GradientPicker = require('lib/gradient_picker');

  Color = require('app/models/properties/color');

  Background = require('app/models/properties/background');

  BackgroundImage = Background.BackgroundImage;

  PopupMenu = require('app/controllers/inspector/popup_menu');

  Backgrounds = (function(_super) {

    __extends(Backgrounds, _super);

    Backgrounds.name = 'Backgrounds';

    function Backgrounds() {
      return Backgrounds.__super__.constructor.apply(this, arguments);
    }

    Backgrounds.prototype.getColor = function() {
      return (this.filter(function(item) {
        return item instanceof Color;
      }))[0] || new Color.Transparent;
    };

    Backgrounds.prototype.getImages = function() {
      return this.filter(function(item) {
        return item instanceof BackgroundImage;
      });
    };

    return Backgrounds;

  })(Collection);

  Edit = (function(_super) {

    __extends(Edit, _super);

    Edit.name = 'Edit';

    Edit.prototype.className = 'edit';

    Edit.prototype.events = {
      'change input': 'inputChange'
    };

    function Edit() {
      Edit.__super__.constructor.apply(this, arguments);
      this.change(this.background);
    }

    Edit.prototype.change = function(background) {
      this.background = background;
      return this.render();
    };

    Edit.prototype.render = function() {
      var picker,
        _this = this;
      this.el.empty();
      if (this.background instanceof Color) {
        picker = new ColorPicker.Preview({
          color: this.background
        });
        picker.bind('change', function(color) {
          _this.background = color;
          return _this.trigger('change', _this.background);
        });
        this.append(picker);
      } else if (this.background instanceof Background.URL) {
        this.html(JST['app/views/inspector/background/url'](this));
      } else if (this.background instanceof Background.LinearGradient) {
        picker = new GradientPicker({
          gradient: this.background
        });
        picker.bind('change', function(background) {
          _this.background = background;
          return _this.trigger('change', _this.background);
        });
        this.append(picker);
      } else {

      }
      return this;
    };

    Edit.prototype.inputChange = function() {
      if (this.background instanceof Background.URL) {
        this.background.url = this.$('input').val();
        return this.trigger('change', this.background);
      }
    };

    return Edit;

  })(Spine.Controller);

  BackgroundType = (function(_super) {

    __extends(BackgroundType, _super);

    BackgroundType.name = 'BackgroundType';

    BackgroundType.prototype.className = 'backgroundType';

    BackgroundType.prototype.events = {
      'click [data-type]': 'choose'
    };

    function BackgroundType() {
      BackgroundType.__super__.constructor.apply(this, arguments);
      this.render();
    }

    BackgroundType.prototype.render = function() {
      return this.html(JST['app/views/inspector/background/menu'](this));
    };

    BackgroundType.prototype.choose = function(e) {
      this.trigger('choose', $(e.currentTarget).data('type'));
      return this.close();
    };

    return BackgroundType;

  })(PopupMenu);

  List = (function(_super) {

    __extends(List, _super);

    List.name = 'List';

    List.prototype.className = 'list';

    List.prototype.events = {
      'click .item': 'click',
      'click button.plus': 'plus',
      'click button.minus': 'minus'
    };

    function List() {
      this.render = __bind(this.render, this);
      List.__super__.constructor.apply(this, arguments);
      if (!this.backgrounds) {
        throw 'backgrounds required';
      }
      this.backgrounds.change(this.render);
    }

    List.prototype.render = function() {
      var selected;
      this.html(JST['app/views/inspector/background/list'](this));
      this.$('.item').removeClass('selected');
      selected = this.$('.item').get(this.backgrounds.indexOf(this.current));
      $(selected).addClass('selected');
      return this;
    };

    List.prototype.click = function(e) {
      this.current = this.backgrounds[$(e.currentTarget).index()];
      this.trigger('change', this.current);
      return this.render();
    };

    List.prototype.plus = function(e) {
      var menu,
        _this = this;
      menu = new BackgroundType;
      menu.bind('choose', function(type) {
        if (type === 'backgroundColor') {
          return _this.addBackgroundColor();
        } else if (type === 'linearGradient') {
          return _this.addLinearGradient();
        } else if (type === 'url') {
          return _this.addURL();
        }
      });
      return menu.open({
        left: e.pageX,
        top: e.pageY
      });
    };

    List.prototype.minus = function() {
      this.backgrounds.remove(this.current);
      this.current = this.backgrounds.first();
      return this.trigger('change', this.current);
    };

    List.prototype.addBackgroundColor = function() {
      this.current = new Background.Color.White;
      this.backgrounds.push(this.current);
      return this.trigger('change', this.current);
    };

    List.prototype.addLinearGradient = function() {
      this.current = new Background.LinearGradient(new Background.Position(0), [new Background.ColorStop(new Color.Black, 0), new Background.ColorStop(new Color.White, 100)]);
      this.backgrounds.push(this.current);
      return this.trigger('change', this.current);
    };

    List.prototype.addURL = function() {
      this.current = new Background.URL;
      this.backgrounds.push(this.current);
      return this.trigger('change', this.current);
    };

    return List;

  })(Spine.Controller);

  BackgroundInspector = (function(_super) {

    __extends(BackgroundInspector, _super);

    BackgroundInspector.name = 'BackgroundInspector';

    function BackgroundInspector() {
      this.set = __bind(this.set, this);

      this.render = __bind(this.render, this);
      return BackgroundInspector.__super__.constructor.apply(this, arguments);
    }

    BackgroundInspector.prototype.className = 'background';

    BackgroundInspector.prototype.render = function() {
      var backgroundColor,
        _this = this;
      this.disabled = !this.stage.selection.isAny();
      this.el.toggleClass('disabled', this.disabled);
      this.backgrounds = this.stage.selection.get('backgroundImage');
      this.backgrounds = new Backgrounds(this.backgrounds);
      backgroundColor = this.stage.selection.get('backgroundColor');
      if (backgroundColor) {
        this.backgrounds.push(backgroundColor);
      }
      this.current = this.backgrounds.first();
      this.backgrounds.change(this.set);
      this.el.empty();
      this.el.append('<h3>Background</h3>');
      this.list = new List({
        current: this.current,
        backgrounds: this.backgrounds
      });
      this.list.bind('change', function(current) {
        _this.current = current;
        return _this.edit.change(_this.current);
      });
      this.append(this.list.render());
      this.edit = new Edit({
        background: this.current
      });
      this.edit.bind('change', function() {
        return _this.backgrounds.change();
      });
      this.append(this.edit);
      return this;
    };

    BackgroundInspector.prototype.set = function() {
      this.stage.history.record('background');
      this.stage.selection.set('backgroundColor', this.backgrounds.getColor());
      return this.stage.selection.set('backgroundImage', this.backgrounds.getImages());
    };

    BackgroundInspector.prototype.release = function() {
      var _ref, _ref1;
      if ((_ref = this.edit) != null) {
        _ref.release();
      }
      if ((_ref1 = this.list) != null) {
        _ref1.release();
      }
      return BackgroundInspector.__super__.release.apply(this, arguments);
    };

    return BackgroundInspector;

  })(Spine.Controller);

  module.exports = BackgroundInspector;

}).call(this);
;}});
