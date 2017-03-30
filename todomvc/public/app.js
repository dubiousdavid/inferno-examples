(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.js", function(exports, require, module) {
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _inferno = require('inferno');

var _inferno2 = _interopRequireDefault(_inferno);

var _router = require('router5');

var _router2 = _interopRequireDefault(_router);

var _browser = require('router5/plugins/browser');

var _browser2 = _interopRequireDefault(_browser);

var _listeners = require('router5/plugins/listeners');

var _listeners2 = _interopRequireDefault(_listeners);

var _Observable = require('rxjs/Observable');

var _Subject = require('rxjs/Subject');

require('rxjs/add/operator/do');

require('rxjs/add/operator/map');

require('rxjs/add/operator/scan');

require('rxjs/add/operator/startWith');

require('rxjs/add/operator/switchMap');

require('rxjs/add/operator/publishBehavior');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Routing
var router = (0, _router2.default)().addNode('all', '/').addNode('active', '/active').addNode('completed', '/completed').usePlugin((0, _listeners2.default)()).usePlugin(_router.loggerPlugin).usePlugin((0, _browser2.default)({ useHash: true })).start();

var createVNode = _inferno2.default.createVNode;
function Link(props) {
  var route = props.route,
      params = props.params,
      children = props.children,
      rest = _objectWithoutProperties(props, ['route', 'params', 'children']);

  var href = router.buildUrl(route, params);

  return createVNode(2, 'a', _extends({}, rest, {
    'href': href
  }), children);
}

// Streams
var actions$ = new _Subject.Subject();

// Model
var initModel = getFromStorage() || { items: [], allCompleted: false, filter: router.getState().name, text: '', uid: 0 };

var storageKey = 'todos-infernojs';

function getFromStorage() {
  var json = localStorage.getItem(storageKey);
  if (json) {
    return JSON.parse(json);
  }
}

// Update
function update(model, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      action = _ref2[0],
      value = _ref2[1];

  var items = model.items,
      allCompleted = model.allCompleted,
      filter = model.filter,
      text = model.text,
      uid = model.uid;

  var newItems = void 0;

  switch (action) {
    case 'changeText':
      return _extends({}, model, { text: value });
    case 'addItem':
      return _extends({}, model, { text: '', allCompleted: false, items: [].concat(_toConsumableArray(items), [newItem(value, uid)]), uid: uid + 1 });
    case 'toggleItem':
      newItems = items.map(function (item) {
        return item.id == value ? _extends({}, item, { completed: !item.completed }) : item;
      });
      return _extends({}, model, { items: newItems, allCompleted: allItemsCompleted(newItems) });
    case 'editItem':
      newItems = items.map(function (item) {
        return item.id == value ? _extends({}, item, { editing: true }) : item;
      });
      return _extends({}, model, { items: newItems });
    case 'changeItemText':
      newItems = items.map(function (item) {
        return item.id == value.id ? _extends({}, item, { text: value.text }) : item;
      });
      return _extends({}, model, { items: newItems });
    case 'cancelEdit':
      newItems = items.map(function (item) {
        return item.editing ? _extends({}, item, { editing: false }) : item;
      });
      return _extends({}, model, { items: newItems });
    case 'updateItem':
      if (value == '') {
        var index = items.findIndex(function (item) {
          return item.editing;
        });
        newItems = index == -1 ? items : removeItem(items, items[index].id);
      } else {
        newItems = items.map(function (item) {
          return item.editing ? _extends({}, item, { editing: false, text: value }) : item;
        });
      }
      return items != newItems ? _extends({}, model, { items: newItems }) : model;
    case 'removeItem':
      newItems = removeItem(items, value);
      return _extends({}, model, { items: newItems, allCompleted: allItemsCompleted(newItems) });
    case 'toggleAll':
      var newAllCompleted = !allCompleted;

      newItems = items.map(function (item) {
        return _extends({}, item, { completed: newAllCompleted });
      });
      return _extends({}, model, { items: newItems, allCompleted: newAllCompleted });
    case 'changeFilter':
      return _extends({}, model, { filter: value });
    case 'clearCompleted':
      newItems = items.filter(function (item) {
        return !item.completed;
      });
      return _extends({}, model, { items: newItems });
  }
}

function removeItem(items, id) {
  return items.filter(function (item) {
    return item.id != id;
  });
}

function allItemsCompleted(items) {
  return items.every(function (item) {
    return item.completed;
  });
}

function newItem(text, id) {
  return { id: id, text: text, completed: false, editing: false };
}

// View
function view(model) {
  var text = model.text;

  var numItems = model.items.length;

  return createVNode(2, 'div', null, [createVNode(2, 'section', {
    'className': 'todoapp'
  }, [createVNode(2, 'header', {
    'className': 'header'
  }, [createVNode(2, 'h1', null, 'todos'), createVNode(512, 'input', {
    'className': 'new-todo',
    'placeholder': 'What needs to be done?',
    'autofocus': true,
    'value': text
  }, null, {
    'onInput': handleInput,
    'onKeyDown': onEnter
  })]), numItems > 0 ? main(model) : '', numItems > 0 ? footer(model) : '']), info()]);
}

function handleInput(e) {
  var value = e.target.value.trimLeft();
  actions$.next(['changeText', value]);
}

function onEnter(e) {
  if (e.code == 'Enter') {
    var text = e.target.value.trim();
    if (text !== '') actions$.next(['addItem', text]);
  }
}

function main(_ref3) {
  var items = _ref3.items,
      filter = _ref3.filter,
      allCompleted = _ref3.allCompleted;

  function isVisible(item) {
    switch (filter) {
      case 'all':
        return true;
      case 'completed':
        return item.completed;
      case 'active':
        return !item.completed;
    }
  }

  return createVNode(2, 'section', {
    'className': 'main'
  }, [createVNode(512, 'input', {
    'className': 'toggle-all',
    'type': 'checkbox',
    'checked': allCompleted
  }, null, {
    'onClick': toggleAll
  }), createVNode(2, 'label', {
    'for': 'toggle-all'
  }, 'Mark all as complete'), createVNode(2, 'ul', {
    'className': 'todo-list'
  }, items.filter(isVisible).map(viewItem))]);
}

function toggleAll() {
  actions$.next(['toggleAll']);
}

function toggleClass(className, enabled) {
  return enabled ? className : '';
}

function toggleClasses(classes) {
  var output = [];
  for (var cls in classes) {
    output.push(toggleClass(cls, classes[cls]));
  }
  return output.join(' ');
}

function viewItem(item) {
  var id = item.id,
      completed = item.completed,
      editing = item.editing,
      text = item.text;

  return createVNode(2, 'li', {
    'className': toggleClasses({ completed: completed, editing: editing })
  }, [createVNode(2, 'div', {
    'className': 'view'
  }, [createVNode(512, 'input', {
    'className': 'toggle',
    'type': 'checkbox',
    'checked': completed
  }, null, {
    'onClick': (0, _inferno.linkEvent)(id, checkboxClick)
  }), createVNode(2, 'label', null, text, {
    'onDblClick': (0, _inferno.linkEvent)(id, itemClick)
  }), createVNode(2, 'button', {
    'className': 'destroy'
  }, null, {
    'onClick': (0, _inferno.linkEvent)(id, destroyClick)
  })]), createVNode(512, 'input', {
    'className': 'edit',
    'value': editing ? text : ''
  }, null, {
    'onKeyDown': onEditDone,
    'onBlur': onBlur,
    'onInput': (0, _inferno.linkEvent)(id, itemInput),
    'onComponentDidMount': focusElement
  })]);
}

function focusElement(oldVnode, vnode) {
  vnode.elm.focus();
}

function itemInput(id, e) {
  var text = e.target.value.trimLeft();
  actions$.next(['changeItemText', { id: id, text: text }]);
}

function onEditDone(e) {
  switch (e.code) {
    case 'Enter':
      var text = e.target.value.trim();
      actions$.next(['updateItem', text]);
      break;
    case 'Escape':
      actions$.next(['cancelEdit']);
      break;
  }
}

function onBlur(e) {
  var text = e.target.value.trim();
  actions$.next(['updateItem', text]);
}

function itemClick(id) {
  actions$.next(['editItem', id]);
}

function checkboxClick(id) {
  actions$.next(['toggleItem', id]);
}

function destroyClick(id) {
  actions$.next(['removeItem', id]);
}

function footer(_ref4) {
  var items = _ref4.items,
      filter = _ref4.filter;

  var numDone = numCompleted(items);
  var numLeft = items.length - numDone;

  return createVNode(2, 'footer', {
    'className': 'footer'
  }, [createVNode(2, 'span', {
    'className': 'todo-count'
  }, createVNode(2, 'strong', null, [numLeft, ' item', numLeft == 1 ? '' : 's', ' left'])), createVNode(2, 'ul', {
    'className': 'filters'
  }, [viewFilter('all', filter), viewFilter('active', filter), viewFilter('completed', filter)]), numDone >= 1 ? createVNode(2, 'button', {
    'className': 'clear-completed'
  }, ['Clear Completed (', numDone, ')'], {
    'onClick': clearCompleted
  }) : '']);
}

function numCompleted(items) {
  return items.filter(function (item) {
    return item.completed;
  }).length;
}

function clearCompleted(e) {
  actions$.next(['clearCompleted']);
}

function viewFilter(filter, currentFilter) {
  return createVNode(2, 'li', null, createVNode(16, Link, {
    'route': filter,
    'className': toggleClass('selected', filter == currentFilter),
    children: filter
  }));
}

function info() {
  return createVNode(2, 'footer', {
    'className': 'info'
  }, [createVNode(2, 'p', null, 'Double-click to edit a todo'), createVNode(2, 'p', null, ['Created by ', createVNode(2, 'a', {
    'href': 'https://github.com/dubiousdavid'
  }, 'David Sargeant')]), createVNode(2, 'p', null, ['Part of ', createVNode(2, 'a', {
    'href': 'http://todomvc.com'
  }, 'TodoMVC')])]);
}

// Reduce
var model$ = actions$.do(function (x) {
  return console.log('Actions', x);
}).scan(update, initModel).do(function (x) {
  return console.log('Model', x);
}).publishBehavior(initModel).refCount();

// Save to local storage
function writeToStorage(model) {
  localStorage.setItem(storageKey, JSON.stringify(model));
}

model$.map(disableEditing).subscribe(writeToStorage);

function disableEditing(model) {
  var newItems = model.items.map(function (item) {
    return _extends({}, item, { editing: false });
  });
  return _extends({}, model, { items: newItems });
}

// Handle route change
router.addListener(changeFilter);

function changeFilter(_ref5) {
  var name = _ref5.name;

  actions$.next(['changeFilter', name]);
}

// Render
var view$ = model$.map(view);
var render = _inferno2.default.createRenderer();
view$.subscribe(function (vNode) {
  render(document.getElementById('app'), vNode);
});

});

require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map