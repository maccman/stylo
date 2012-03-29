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
this.require.define({"lib/collection":function(exports, require, module){(function() {
  var Collection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  Collection = (function(_super) {
    var k, v, _ref;

    __extends(Collection, _super);

    _ref = Spine.Events;
    for (k in _ref) {
      v = _ref[k];
      Collection.prototype[k] = v;
    }

    function Collection(value) {
      if (Array.isArray(value)) {
        Collection.__super__.constructor.call(this);
        this.push.apply(this, value);
      } else {
        Collection.__super__.constructor.apply(this, arguments);
      }
    }

    Collection.prototype.refresh = function(records) {
      var r, _i, _len;
      this.splice(0, this.length);
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        r = records[_i];
        this.push(r);
      }
      this.trigger('refresh');
      return this.change();
    };

    Collection.prototype.push = function() {
      var res;
      res = Collection.__super__.push.apply(this, arguments);
      this.trigger('append');
      this.change();
      return res;
    };

    Collection.prototype.remove = function(record) {
      var index;
      index = this.indexOf(record);
      this.splice(index, 1);
      this.trigger('remove');
      return this.change();
    };

    Collection.prototype.change = function(func) {
      if (typeof func === 'function') {
        this.bind.apply(this, ['change'].concat(__slice.call(arguments)));
      } else {
        this.trigger.apply(this, ['change'].concat(__slice.call(arguments)));
      }
      return this;
    };

    Collection.prototype.include = function(value) {
      return this.indexOf(value) !== -1;
    };

    Collection.prototype.first = function() {
      return this[0];
    };

    Collection.prototype.last = function() {
      return this[this.length - 1];
    };

    Collection.prototype.valueOf = function() {
      return this.slice(0);
    };

    return Collection;

  })(Array);

  module.exports = Collection;

}).call(this);
;}});
