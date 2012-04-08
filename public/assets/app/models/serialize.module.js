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
this.require.define({"app/models/serialize":function(exports, require, module){(function() {
  var Serialize, fromJSON, fromObject;

  fromObject = function(object) {
    var args, constructor, k, name, o, path, result, v, _ref;
    if (typeof object !== 'object') return object;
    if (Array.isArray(object)) {
      return (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = object.length; _i < _len; _i++) {
          o = object[_i];
          _results.push(fromObject(o));
        }
        return _results;
      })();
    }
    if (!object.id) {
      for (k in object) {
        v = object[k];
        object[k] = fromObject(v);
      }
      return object;
    }
    _ref = object.id.split('.', 2), path = _ref[0], name = _ref[1];
    constructor = require(path);
    if (name) constructor = constructor[name];
    if (result = typeof constructor.fromValue === "function" ? constructor.fromValue(object) : void 0) {
      return result;
    }
    args = fromObject(object.value);
    if (Array.isArray(args)) {
      return new constructor(args[0], args[1], args[2], args[3], args[4], args[5]);
    } else {
      return new constructor(args);
    }
  };

  fromJSON = function(object) {
    if (typeof object === 'string') object = JSON.parse(object);
    return fromObject(object);
  };

  Serialize = {
    id: function() {
      return module.id;
    },
    toJSON: function() {
      var result;
      return result = {
        id: (typeof this.id === "function" ? this.id() : void 0) || this.id,
        value: (typeof this.toValue === "function" ? this.toValue() : void 0) || this.toValue
      };
    },
    clone: function() {
      return fromJSON(JSON.stringify(this));
    }
  };

  module.exports.Serialize = Serialize;

  module.exports.fromJSON = fromJSON;

}).call(this);
;}});
