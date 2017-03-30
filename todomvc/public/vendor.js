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

require.register("inferno/dist/inferno.min.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "inferno");
  (function() {
    !(function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.Inferno=e.Inferno||{})})(this,(function(e){"use strict";function n(e){return!c(e.prototype)&&!c(e.prototype.render)}function t(e){var n=typeof e;return"string"===n||"number"===n}function r(e){return c(e)||f(e)}function o(e){return f(e)||e===!1||d(e)||c(e)}function i(e){return"function"==typeof e}function l(e){return"o"===e[0]&&"n"===e[1]}function a(e){return"string"==typeof e}function u(e){return"number"==typeof e}function f(e){return null===e}function d(e){return e===!0}function c(e){return void 0===e}function s(e){return"object"==typeof e}function v(e){throw e||(e=mn),new Error("Inferno Error: "+e)}function p(e,n){var t,r={};if(e)for(t in e)r[t]=e[t];if(n)for(t in n)r[t]=n[t];return r}function m(){this.listeners=[]}function h(e,n){return n.key=e,n}function g(e,n){return u(e)&&(e="."+e),f(n.key)||"."===n.key[0]?h(e,n):n}function y(e,n){return n.key=e+n.key,n}function k(e,n,r,i){for(var l=e.length;r<l;r++){var a=e[r],u=i+"."+r;o(a)||(gn(a)?k(a,n,0,u):(t(a)?a=cn(a,null):(sn(a)&&a.dom||a.key&&"."===a.key[0])&&(a=un(a)),a=f(a.key)||"."===a.key[0]?h(u,a):y(i,a),n.push(a)))}}function b(e){var n;e.$?e=e.slice():e.$=!0;for(var r=0,i=e.length;r<i;r++){var l=e[r];if(o(l)||gn(l)){var a=(n||e).slice(0,r);return k(e,a,r,""),a}t(l)?(n||(n=e.slice(0,r)),n.push(g(r,cn(l,null)))):sn(l)&&l.dom||f(l.key)&&!(64&l.flags)?(n||(n=e.slice(0,r)),n.push(g(r,un(l)))):n&&n.push(g(r,un(l)))}return n||e}function C(e){return gn(e)?b(e):sn(e)&&e.dom?un(e):e}function N(e,n,t){28&e.flags||!r(t)||r(n.children)||(e.children=n.children),n.ref&&(e.ref=n.ref,delete n.ref),n.events&&(e.events=n.events),r(n.key)||(e.key=n.key,delete n.key)}function x(e,n){n.flags="svg"===e?128:"input"===e?512:"select"===e?2048:"textarea"===e?1024:"media"===e?256:2}function w(e){var n=e.props,t=e.children;if(28&e.flags){var i=e.type,l=i.defaultProps;if(!r(l))if(n)for(var u in l)c(n[u])&&(n[u]=l[u]);else n=e.props=l;a(i)&&(x(i,e),n&&n.children&&(e.children=n.children,t=n.children))}n&&N(e,n,t),o(t)||(e.children=C(t)),n&&!o(n.children)&&(n.children=C(n.children))}function _(e,n,t,r){var o=En.get(e);t?(o||(o={items:new Map,count:0,docEvent:null},o.docEvent=S(e,o),En.set(e,o)),n||(o.count++,Sn&&"onClick"===e&&U(r)),o.items.set(r,t)):o&&o.items.has(r)&&(o.count--,o.items.delete(r),0===o.count&&(document.removeEventListener(O(e),o.docEvent),En.delete(e)))}function M(e,n,t,r,o){var i=t.get(n);if((!i||(r--,o.dom=n,i.event?i.event(i.data,e):i(e),!o.stopPropagation))&&r>0){var l=n.parentNode;(l&&l.disabled!==!0||l===document.body)&&M(e,l,t,r,o)}}function O(e){return e.substr(2).toLowerCase()}function S(e,n){var t=function(e){var t={stopPropagation:!1,dom:document};Object.defineProperty(e,"currentTarget",{configurable:!0,get:function(){return t.dom}}),e.stopPropagation=function(){t.stopPropagation=!0};var r=n.count;r>0&&M(e,e.target,n.items,r,t)};return document.addEventListener(O(e),t),t}function E(){}function U(e){e.onclick=E}function V(e){return"checkbox"===e||"radio"===e}function D(e){return V(e.type)?!r(e.checked):!r(e.value)}function I(e){var n=this.vNode,t=n.events||jn,r=n.dom;if(t.onInput){var o=t.onInput;o.event?o.event(o.data,e):o(e)}else t.oninput&&t.oninput(e);L(this.vNode,r)}function T(e){var n=this.vNode,t=n.events||jn,r=t.onChange;r.event?r.event(r.data,e):r(e)}function P(e){var n=this.vNode,t=n.events||jn,r=n.dom;if(t.onClick){var o=t.onClick;o.event?o.event(o.data,e):o(e)}else t.onclick&&t.onclick(e);L(this.vNode,r)}function j(e){var n=document.querySelectorAll('input[type="radio"][name="'+e+'"]');[].forEach.call(n,(function(e){var n=Un.get(e);if(n){n.vNode.props&&(e.checked=n.vNode.props.checked)}}))}function W(e,n){var t=e.props||jn;if(L(e,n),D(t)){var r=Un.get(n);return r||(r={vNode:e},V(t.type)?(n.onclick=P.bind(r),n.onclick.wrapped=!0):(n.oninput=I.bind(r),n.oninput.wrapped=!0),t.onChange&&(n.onchange=T.bind(r),n.onchange.wrapped=!0),Un.set(n,r)),r.vNode=e,!0}return!1}function L(e,n){var t=e.props||jn,o=t.type,i=t.value,l=t.checked,a=t.multiple,u=t.defaultValue,f=!r(i);o&&o!==n.type&&(n.type=o),a&&a!==n.multiple&&(n.multiple=a),r(u)||f||(n.defaultValue=u+""),V(o)?(f&&(n.value=i),r(l)||(n.checked=l),"radio"===o&&t.name&&j(t.name)):f&&n.value!==i?n.value=i:r(l)||(n.checked=l)}function A(e){return!r(e.value)}function z(e,n){if("optgroup"===e.type){var t=e.children;if(gn(t))for(var r=0,o=t.length;r<o;r++)R(t[r],n);else sn(t)&&R(t,n)}else R(e,n)}function R(e,n){var t=e.props||jn,o=e.dom;o.value=t.value,gn(n)&&n.indexOf(t.value)!==-1||t.value===n?o.selected=!0:r(n)&&r(t.selected)||(o.selected=t.selected||!1)}function K(e){var n=this.vNode,t=n.events||jn,r=n.dom;if(t.onChange){var o=t.onChange;o.event?o.event(o.data,e):o(e)}else t.onchange&&t.onchange(e);F(this.vNode,r,!1)}function G(e,n,t){var r=e.props||jn;if(F(e,n,t),A(r)){var o=Un.get(n);return o||(o={vNode:e},n.onchange=K.bind(o),n.onchange.wrapped=!0,Un.set(n,o)),o.vNode=e,!0}return!1}function F(e,n,t){var i=e.props||jn;i.multiple!==n.multiple&&(n.multiple=i.multiple);var l=e.children;if(!o(l)){var a=i.value;if(t&&r(a)&&(a=i.defaultValue),gn(l))for(var u=0,f=l.length;u<f;u++)z(l[u],a);else sn(l)&&z(l,a)}}function B(e){return!r(e.value)}function H(e){var n=this.vNode,t=n.events||jn,r=t.onChange;r.event?r.event(r.data,e):r(e)}function $(e){var n=this.vNode,t=n.events||jn,r=n.dom;if(t.onInput){var o=t.onInput;o.event?o.event(o.data,e):o(e)}else t.oninput&&t.oninput(e);J(this.vNode,r,!1)}function q(e,n,t){var r=e.props||jn;J(e,n,t);var o=Un.get(n);return!!B(r)&&(o||(o={vNode:e},n.oninput=$.bind(o),n.oninput.wrapped=!0,r.onChange&&(n.onchange=H.bind(o),n.onchange.wrapped=!0),Un.set(n,o)),o.vNode=e,!0)}function J(e,n,t){var o=e.props||jn,i=o.value,l=n.value;if(r(i)){if(t){var a=o.defaultValue;r(a)?""!==l&&(n.value=""):a!==l&&(n.value=a)}}else l!==i&&(n.value=i)}function Y(e,n,t,r){return 512&e?W(n,t):2048&e?G(n,t,r):!!(1024&e)&&q(n,t,r)}function X(e){for(var n=e.firstChild;n;)if(8===n.nodeType)if("!"===n.data){var t=document.createTextNode("");e.replaceChild(t,n),n=n.nextSibling}else{var r=n.previousSibling;e.removeChild(n),n=r||e.firstChild}else n=n.nextSibling}function Q(e,n,t,r,o,i){var l=e.type,a=e.ref;e.dom=n;var u=e.props||jn;if(i){var f=n.namespaceURI===Cn,d=Be(e,l,u,r,f),c=d._lastInput;d._vComponent=e,d._vNode=e,re(c,n,t,d._childContext,f),Ke(e,a,d,t),yn.findDOMNodeEnabled&&Tn.set(d,n),e.children=d}else{var s=qe(e,l,u,r);re(s,n,t,r,o),e.children=s,e.dom=s.dom,Ge(a,n,t)}return n}function Z(e,n,t,r,o){var i=e.children,l=e.props,a=e.events,u=e.flags,f=e.ref;if((o||128&u)&&(o=!0),1!==n.nodeType||n.tagName.toLowerCase()!==e.type){var d=Ae(e,null,t,r,o);return e.dom=d,nn(n.parentNode,d,n),d}e.dom=n,i&&ee(i,n,t,r,o);var c=!1;if(2&u||(c=Y(u,e,n,!1)),l)for(var s in l)Ve(s,null,l[s],n,o,c);if(a)for(var v in a)Ie(v,null,a[v],n);return f&&Fe(n,f,t),n}function ee(e,n,r,o,i){X(n);var l=n.firstChild;if(gn(e))for(var a=0,u=e.length;a<u;a++){var d=e[a];!f(d)&&s(d)&&(l?(l=re(d,l,r,o,i),l=l.nextSibling):je(d,n,r,o,i))}else t(e)?(l&&3===l.nodeType?l.nodeValue!==e&&(l.nodeValue=e):e&&(n.textContent=e),l=l.nextSibling):s(e)&&(re(e,l,r,o,i),l=l.nextSibling);for(;l;){var c=l.nextSibling;n.removeChild(l),l=c}}function ne(e,n){if(3!==n.nodeType){var t=We(e,null);return e.dom=t,nn(n.parentNode,t,n),t}var r=e.children;return n.nodeValue!==r&&(n.nodeValue=r),e.dom=n,n}function te(e,n){return e.dom=n,n}function re(e,n,t,r,o){var i=e.flags;return 28&i?Q(e,n,t,r,o,4&i):3970&i?Z(e,n,t,r,o):1&i?ne(e,n):4096&i?te(e,n):void v()}function oe(e,n,t){var r=n&&n.firstChild;if(r){for(re(e,r,t,jn,!1),r=n.firstChild;r=r.nextSibling;)n.removeChild(r);return!0}return!1}function ie(e,n,t,r){var o=e.type,i=Dn.get(o);if(!c(i)){var l=e.key,a=null===l?i.nonKeyed:i.keyed.get(l);if(!c(a)){var u=a.pop();if(!c(u))return xe(u,e,null,n,t,r,!0),e.dom}}return null}function le(e){var n=e.type,t=e.key,r=Dn.get(n);if(c(r)&&(r={nonKeyed:[],keyed:new Map},Dn.set(n,r)),f(t))r.nonKeyed.push(e);else{var o=r.keyed.get(t);c(o)&&(o=[],r.keyed.set(t,o)),o.push(e)}}function ae(e,n,t,r){var o=e.type,i=Vn.get(o);if(!c(i)){var l=e.key,a=null===l?i.nonKeyed:i.keyed.get(l);if(!c(a)){var u=a.pop();if(!c(u)){if(!_e(u,e,null,n,t,r,4&e.flags,!0))return e.dom}}}return null}function ue(e){var n=e.ref;if(!n||!(n.onComponentWillMount||n.onComponentWillUnmount||n.onComponentDidMount||n.onComponentWillUpdate||n.onComponentDidUpdate)){var t=e.type,r=e.key,o=Vn.get(t);if(c(o)&&(o={nonKeyed:[],keyed:new Map},Vn.set(t,o)),f(r))o.nonKeyed.push(e);else{var i=o.keyed.get(r);c(i)&&(i=[],o.keyed.set(r,i)),i.push(e)}}}function fe(e,n,t,r,o){var i=e.flags;28&i?ce(e,n,t,r,o):3970&i?se(e,n,t,r,o):4097&i&&de(e,n)}function de(e,n){n&&tn(n,e.dom)}function ce(e,n,t,o,i){var l=e.children,a=e.flags,u=4&a,f=e.ref,d=e.dom;if(i||(u?l._unmounted||(l._ignoreSetState=!0,yn.beforeUnmount&&yn.beforeUnmount(e),l.componentWillUnmount&&l.componentWillUnmount(),f&&!i&&f(null),l._unmounted=!0,yn.findDOMNodeEnabled&&Tn.delete(l),fe(l._lastInput,null,l._lifecycle,!1,i)):(r(f)||r(f.onComponentWillUnmount)||f.onComponentWillUnmount(d),fe(l,null,t,!1,i))),n){var c=l._lastInput;r(c)&&(c=l),tn(n,d)}yn.recyclingEnabled&&!u&&(n||o)&&ue(e)}function se(e,n,t,o,i){var l=e.dom,a=e.ref,u=e.events;a&&!i&&pe(a);var d=e.children;if(r(d)||ve(d,t,i),!f(u))for(var c in u)Ie(c,u[c],null,l),u[c]=null;n&&tn(n,l),yn.recyclingEnabled&&(n||o)&&le(e)}function ve(e,n,t){if(gn(e))for(var r=0,i=e.length;r<i;r++){var l=e[r];!o(l)&&s(l)&&fe(l,null,n,!1,t)}else s(e)&&fe(e,null,n,!1,t)}function pe(e){if(i(e))e(null);else{if(o(e))return;v()}}function me(e){yn.findDOMNodeEnabled||v();var n=e&&e.nodeType?e:null;return Tn.get(e)||n}function he(e){for(var n=0,t=In.length;n<t;n++){var r=In[n];if(r.dom===e)return r}return null}function ge(e,n,t){var r={dom:e,input:n,lifecycle:t};return In.push(r),r}function ye(e){for(var n=0,t=In.length;n<t;n++)if(In[n]===e)return void In.splice(n,1)}function ke(e,n){if(Pn===n&&v(),e!==pn){var t=he(n);if(f(t)){var i=new m;o(e)||(e.dom&&(e=un(e)),oe(e,n,i)||je(e,n,i,jn,!1),t=ge(n,e,i),i.trigger())}else{var l=t.lifecycle;l.listeners=[],r(e)?(fe(t.input,n,l,!1,!1),ye(t)):(e.dom&&(e=un(e)),Ce(t.input,e,n,l,jn,!1,!1)),l.trigger(),t.input=e}if(t){var a=t.input;if(a&&28&a.flags)return a.children}}}function be(e){return function(n,t){e||(e=n),ke(t,e)}}function Ce(e,n,t,r,o,i,l){if(e!==n){var a=e.flags,u=n.flags;28&u?28&a?_e(e,n,t,r,o,i,4&u,l):$e(t,Re(n,null,r,o,i,4&u),e,r,l):3970&u?3970&a?xe(e,n,t,r,o,i,l):$e(t,Ae(n,null,r,o,i),e,r,l):1&u?1&a?Me(e,n):$e(t,We(n,null),e,r,l):4096&u?4096&a?Oe(e,n):$e(t,Le(n,null),e,r,l):He(e,n,t,r,o,i,l)}}function Ne(e,n,t,r){sn(e)?fe(e,n,t,!0,r):gn(e)?rn(n,e,t,r):n.textContent=""}function xe(e,n,t,o,i,l,a){var u=n.type;if(e.type!==u)en(e,n,t,o,i,l,a);else{var f=e.dom,d=e.props,c=n.props,s=e.children,v=n.children,p=e.flags,m=n.flags,h=n.ref,g=e.events,y=n.events;n.dom=f,(l||128&m)&&(l=!0),s!==v&&we(p,m,s,v,f,o,i,l,a);var k=!1;if(2&m||(k=Y(m,n,f,!1)),d!==c){var b=d||jn,C=c||jn;if(C!==jn)for(var N in C){var x=C[N],w=b[N];r(x)?Pe(N,x,f):Ve(N,w,x,f,l,k)}if(b!==jn)for(var _ in b)r(C[_])&&Pe(_,b[_],f)}g!==y&&De(g,y,f),h&&(e.ref!==h||a)&&Fe(f,h,o)}}function we(e,n,r,i,l,a,u,f,d){var c=!1,s=!1;64&n?c=!0:32&e&&32&n?(s=!0,c=!0):o(i)?Ne(r,l,a,d):o(r)?t(i)?Je(l,i):gn(i)?ze(i,l,a,u,f):je(i,l,a,u,f):t(i)?t(r)?Ye(l,i):(Ne(r,l,a,d),Je(l,i)):gn(i)?gn(r)?(c=!0,ln(r,i)&&(s=!0)):(Ne(r,l,a,d),ze(i,l,a,u,f)):gn(r)?(rn(l,r,a,d),je(i,l,a,u,f)):sn(i)&&(sn(r)?Ce(r,i,l,a,u,f,d):(Ne(r,l,a,d),je(i,l,a,u,f))),c&&(s?Ee(r,i,l,a,u,f,d):Se(r,i,l,a,u,f,d))}function _e(e,n,i,l,a,u,d,m){var h=e.type,g=n.type,y=e.key,k=n.key;if(h!==g||y!==k)return en(e,n,i,l,a,u,m),!1;var b=n.props||jn;if(d){var C=e.children;if(C._unmounted){if(f(i))return!0;nn(i,Re(n,null,l,a,u,4&n.flags),e.dom)}else{var N,x=C.state,w=C.state,_=C.props;c(C.getChildContext)||(N=C.getChildContext()),n.children=C,C._isSVG=u,C._syncSetState=!1,N=r(N)?a:p(a,N);var M=C._lastInput,O=C._updateComponent(x,w,_,b,a,!1,!1),S=!0;C._childContext=N,o(O)?O=dn():O===pn?(O=M,S=!1):t(O)?O=cn(O,null):gn(O)?v():s(O)&&O.dom&&(O=un(O)),28&O.flags?O.parentVNode=n:28&M.flags&&(M.parentVNode=n),C._lastInput=O,C._vNode=n,S&&(Ce(M,O,i,l,N,u,m),c(C.componentDidUpdate)||C.componentDidUpdate(_,x),yn.afterUpdate&&yn.afterUpdate(n),yn.findDOMNodeEnabled&&Tn.set(C,O.dom)),C._syncSetState=!0,n.dom=O.dom}}else{var E=!0,U=e.props,V=n.ref,D=!r(V),I=e.children,T=I;n.dom=e.dom,n.children=I,y!==k?E=!0:D&&!r(V.onComponentShouldUpdate)&&(E=V.onComponentShouldUpdate(U,b)),E!==!1&&(D&&!r(V.onComponentWillUpdate)&&V.onComponentWillUpdate(U,b),T=g(b,a),o(T)?T=dn():t(T)&&T!==pn?T=cn(T,null):gn(T)?v():s(T)&&T.dom&&(T=un(T)),T!==pn&&(Ce(I,T,i,l,a,u,m),n.children=T,D&&!r(V.onComponentDidUpdate)&&V.onComponentDidUpdate(U,b),n.dom=T.dom)),28&T.flags?T.parentVNode=n:28&I.flags&&(I.parentVNode=n)}return!1}function Me(e,n){var t=n.children,r=e.dom;n.dom=r,e.children!==t&&(r.nodeValue=t)}function Oe(e,n){n.dom=e.dom}function Se(e,n,t,r,o,i,l){for(var a=e.length,u=n.length,f=a>u?u:a,d=0;d<f;d++){var c=n[d];c.dom&&(c=n[d]=un(c)),Ce(e[d],c,t,r,o,i,l)}if(a<u)for(d=f;d<u;d++){var s=n[d];s.dom&&(s=n[d]=un(s)),Xe(t,je(s,null,r,o,i))}else if(0===u)rn(t,e,r,l);else if(a>u)for(d=f;d<a;d++)fe(e[d],t,r,!1,l)}function Ee(e,n,t,r,o,i,l){var a,u,d,s,v,p,m,h=e.length,g=n.length,y=h-1,k=g-1,b=0,C=0;if(0===h)return void(0!==g&&ze(n,t,r,o,i));if(0===g)return void rn(t,e,r,l);var N=e[b],x=n[C],w=e[y],_=n[k];x.dom&&(n[C]=x=un(x)),_.dom&&(n[k]=_=un(_));e:for(;;){for(;N.key===x.key;){if(Ce(N,x,t,r,o,i,l),b++,C++,b>y||C>k)break e;N=e[b],x=n[C],x.dom&&(n[C]=x=un(x))}for(;w.key===_.key;){if(Ce(w,_,t,r,o,i,l),y--,k--,b>y||C>k)break e;w=e[y],_=n[k],_.dom&&(n[k]=_=un(_))}if(w.key!==x.key){if(N.key!==_.key)break;Ce(N,_,t,r,o,i,l),p=k+1,v=p<n.length?n[p].dom:null,Qe(t,_.dom,v),b++,k--,N=e[b],_=n[k],_.dom&&(n[k]=_=un(_))}else Ce(w,x,t,r,o,i,l),Qe(t,x.dom,N.dom),y--,C++,w=e[y],x=n[C],x.dom&&(n[C]=x=un(x))}if(b>y){if(C<=k)for(p=k+1,v=p<n.length?n[p].dom:null;C<=k;)m=n[C],m.dom&&(n[C]=m=un(m)),C++,Qe(t,je(m,null,r,o,i),v)}else if(C>k)for(;b<=y;)fe(e[b++],t,r,!1,l);else{h=y-b+1,g=k-C+1;var M=new Array(g);for(a=0;a<g;a++)M[a]=-1;var O=!1,S=0,E=0;if(g<=4||h*g<=16){for(a=b;a<=y;a++)if(d=e[a],E<g)for(u=C;u<=k;u++)if(s=n[u],d.key===s.key){M[u-C]=a,S>u?O=!0:S=u,s.dom&&(n[u]=s=un(s)),Ce(d,s,t,r,o,i,l),E++,e[a]=null;break}}else{var U=new Map;for(a=C;a<=k;a++)U.set(n[a].key,a);for(a=b;a<=y;a++)d=e[a],E<g&&(u=U.get(d.key),c(u)||(s=n[u],M[u-C]=a,S>u?O=!0:S=u,s.dom&&(n[u]=s=un(s)),Ce(d,s,t,r,o,i,l),E++,e[a]=null))}if(h===e.length&&0===E)for(rn(t,e,r,l);C<g;)m=n[C],m.dom&&(n[C]=m=un(m)),C++,Qe(t,je(m,null,r,o,i),null);else{for(a=h-E;a>0;)d=e[b++],f(d)||(fe(d,t,r,!0,l),a--);if(O){var V=Ue(M);for(u=V.length-1,a=g-1;a>=0;a--)M[a]===-1?(S=a+C,m=n[S],m.dom&&(n[S]=m=un(m)),p=S+1,v=p<n.length?n[p].dom:null,Qe(t,je(m,t,r,o,i),v)):u<0||a!==V[u]?(S=a+C,m=n[S],p=S+1,v=p<n.length?n[p].dom:null,Qe(t,m.dom,v)):u--}else if(E!==g)for(a=g-1;a>=0;a--)M[a]===-1&&(S=a+C,m=n[S],m.dom&&(n[S]=m=un(m)),p=S+1,v=p<n.length?n[p].dom:null,Qe(t,je(m,null,r,o,i),v))}}}function Ue(e){var n,t,r,o,i,l=e.slice(0),a=[0],u=e.length;for(n=0;n<u;n++){var f=e[n];if(f!==-1)if(t=a[a.length-1],e[t]<f)l[n]=t,a.push(n);else{for(r=0,o=a.length-1;r<o;)i=(r+o)/2|0,e[a[i]]<f?r=i+1:o=i;f<e[a[r]]&&(r>0&&(l[n]=a[r-1]),a[r]=n)}}for(r=a.length,o=a[r-1];r-- >0;)a[r]=o,o=l[o];return a}function Ve(e,n,t,o,i,a){if(!(e in Mn||a&&"value"===e))if(e in xn)e="autoFocus"===e?e.toLowerCase():e,o[e]=!!t;else if(e in Nn){var u=r(t)?"":t;o[e]!==u&&(o[e]=u)}else if(n!==t)if(l(e))Ie(e,n,t,o);else if(r(t))o.removeAttribute(e);else if("className"===e)i?o.setAttribute("class",t):o.className=t;else if("style"===e)Te(n,t,o);else if("dangerouslySetInnerHTML"===e){var f=n&&n.__html,d=t&&t.__html;f!==d&&(r(d)||(o.innerHTML=d))}else{var c=!!i&&wn[e];c?o.setAttributeNS(c,e,t):o.setAttribute(e,t)}}function De(e,n,t){if(e=e||jn,(n=n||jn)!==jn)for(var o in n)Ie(o,e[o],n[o],t);if(e!==jn)for(var i in e)r(n[i])&&Ie(i,e[i],null,t)}function Ie(e,n,t,o){if(n!==t){var l=e.toLowerCase(),a=o[l];if(a&&a.wrapped)return;if(On[e])_(e,n,t,o);else if(i(t)||r(t))o[l]=t;else{var u=t.event;u&&i(u)?(o._data||(o[l]=function(e){u(e.currentTarget._data,e)}),o._data=t.data):v()}}}function Te(e,n,t){var o=t.style;if(a(n))return void(o.cssText=n);for(var i in n){var l=n[i];!u(l)||i in _n?o[i]=l:o[i]=l+"px"}if(!r(e))for(var f in e)r(n[f])&&(o[f]="")}function Pe(e,n,t){"className"===e?t.removeAttribute("class"):"value"===e?t.value="":"style"===e?t.removeAttribute("style"):l(e)?_(name,n,null,t):t.removeAttribute(e)}function je(e,n,t,r,o){var i=e.flags;return 3970&i?Ae(e,n,t,r,o):28&i?Re(e,n,t,r,o,4&i):4096&i?Le(e,n):1&i?We(e,n):void v()}function We(e,n){var t=document.createTextNode(e.children);return e.dom=t,n&&Xe(n,t),t}function Le(e,n){var t=document.createTextNode("");return e.dom=t,n&&Xe(n,t),t}function Ae(e,n,r,i,l){if(yn.recyclingEnabled){var a=ie(e,r,i,l);if(!f(a))return f(n)||Xe(n,a),a}var u=e.flags;(l||128&u)&&(l=!0);var d=Ze(e.type,l),c=e.children,s=e.props,v=e.events,p=e.ref;e.dom=d,o(c)||(t(c)?Je(d,c):gn(c)?ze(c,d,r,i,l):sn(c)&&je(c,d,r,i,l));var m=!1;if(2&u||(m=Y(u,e,d,!0)),!f(s))for(var h in s)Ve(h,null,s[h],d,l,m);if(!f(v))for(var g in v)Ie(g,null,v[g],d);return f(p)||Fe(d,p,r),f(n)||Xe(n,d),d}function ze(e,n,t,r,i){for(var l=0,a=e.length;l<a;l++){var u=e[l];o(u)||(u.dom&&(e[l]=u=un(u)),je(e[l],n,t,r,i))}}function Re(e,n,t,r,o,i){if(yn.recyclingEnabled){var l=ae(e,t,r,o);if(!f(l))return f(n)||Xe(n,l),l}var a,u=e.type,d=e.props||jn,c=e.ref;if(i){var s=Be(e,u,d,r,o),v=s._lastInput;s._vNode=e,e.dom=a=je(v,null,t,s._childContext,o),f(n)||Xe(n,a),Ke(e,c,s,t),yn.findDOMNodeEnabled&&Tn.set(s,a),e.children=s}else{var p=qe(e,u,d,r);e.dom=a=je(p,null,t,r,o),e.children=p,Ge(c,a,t),f(n)||Xe(n,a)}return a}function Ke(e,n,t,r){n&&(i(n)?n(t):v());var o=t.componentDidMount,l=yn.afterMount;c(o)&&f(l)?t._syncSetState=!0:r.addListener((function(){l&&l(e),o&&t.componentDidMount(),t._syncSetState=!0}))}function Ge(e,n,t){e&&(r(e.onComponentWillMount)||e.onComponentWillMount(),r(e.onComponentDidMount)||t.addListener((function(){return e.onComponentDidMount(n)})))}function Fe(e,n,t){if(i(n))t.addListener((function(){return n(e)}));else{if(o(n))return;v()}}function Be(e,n,i,l,a){c(l)&&(l=jn);var u=new n(i,l);u.context=l,u.props===jn&&(u.props=i),u._patch=Ce,yn.findDOMNodeEnabled&&(u._componentToDOMNodeMap=Tn),u._unmounted=!1,u._pendingSetState=!0,u._isSVG=a,c(u.componentWillMount)||u.componentWillMount();var f;c(u.getChildContext)||(f=u.getChildContext()),r(f)?u._childContext=l:u._childContext=p(l,f),yn.beforeRender&&yn.beforeRender(u);var d=u.render(i,u.state,l);return yn.afterRender&&yn.afterRender(u),gn(d)?v():o(d)?d=dn():t(d)?d=cn(d,null):(d.dom&&(d=un(d)),28&d.flags&&(d.parentVNode=e)),u._pendingSetState=!1,u._lastInput=d,u}function He(e,n,t,r,o,i,l){$e(t,je(n,null,r,o,i),e,r,l)}function $e(e,n,t,r,o){fe(t,null,r,!1,o),nn(e,n,t.dom)}function qe(e,n,r,i){var l=n(r,i);return gn(l)?v():o(l)?l=dn():t(l)?l=cn(l,null):(l.dom&&(l=un(l)),28&l.flags&&(l.parentVNode=e)),l}function Je(e,n){""!==n?e.textContent=n:e.appendChild(document.createTextNode(""))}function Ye(e,n){e.firstChild.nodeValue=n}function Xe(e,n){e.appendChild(n)}function Qe(e,n,t){r(t)?Xe(e,n):e.insertBefore(n,t)}function Ze(e,n){return n===!0?document.createElementNS(Cn,e):document.createElement(e)}function en(e,n,t,r,o,i,l){fe(e,null,r,!1,l);var a=je(n,null,r,o,i);n.dom=a,nn(t,a,e.dom)}function nn(e,n,t){e||(e=t.parentNode),e.replaceChild(n,t)}function tn(e,n){e.removeChild(n)}function rn(e,n,t,r){e.textContent="",(!yn.recyclingEnabled||yn.recyclingEnabled&&!r)&&on(null,n,t,r)}function on(e,n,t,r){for(var i=0,l=n.length;i<l;i++){var a=n[i];o(a)||fe(a,e,t,!0,r)}}function ln(e,n){return n.length&&!r(n[0])&&!r(n[0].key)&&e.length&&!r(e[0])&&!r(e[0].key)}function an(e,t,r,o,i,l,a,u){16&e&&(e=n(t)?4:8);var f={children:c(o)?null:o,dom:null,events:i||null,flags:e,key:c(l)?null:l,props:r||null,ref:a||null,type:t};return u||w(f),yn.createVNode&&yn.createVNode(f),f}function un(e){var n,r=e.flags;if(28&r){var i,l=e.props;if(l){i={};for(var a in l)i[a]=l[a]}else i=jn;n=an(r,e.type,i,null,e.events,e.key,e.ref,!0);var u=n.props;if(u){var f=u.children;if(f)if(gn(f)){var d=f.length;if(d>0){for(var c=[],s=0;s<d;s++){var v=f[s];t(v)?c.push(v):!o(v)&&sn(v)&&c.push(un(v))}u.children=c}}else sn(f)&&(u.children=un(f))}n.children=null}else if(3970&r){var p,m=e.children,h=e.props;if(h){p={};for(var g in h)p[g]=h[g]}else p=jn;n=an(r,e.type,p,m,e.events,e.key,e.ref,!m)}else 1&r&&(n=cn(e.children,e.key));return n}function fn(e,n){for(var i=[],l=arguments.length-2;l-- >0;)i[l]=arguments[l+2];var a=i,u=i.length;u>0&&!c(i[0])&&(n||(n={}),1===u&&(a=i[0]),c(a)||(n.children=a));var f;if(gn(e)){for(var d=[],s=0,v=e.length;s<v;s++)d.push(un(e[s]));f=d}else{var m=e.flags,h=e.events||n&&n.events||null,g=r(e.key)?n?n.key:null:e.key,y=e.ref||(n?n.ref:null);if(28&m){f=an(m,e.type,e.props||n?p(e.props,n):jn,null,h,g,y,!0);var k=f.props;if(k){var b=k.children;if(b)if(gn(b)){var C=b.length;if(C>0){for(var N=[],x=0;x<C;x++){var w=b[x];t(w)?N.push(w):!o(w)&&sn(w)&&N.push(un(w))}k.children=N}}else sn(b)&&(k.children=un(b))}f.children=null}else 3970&m?(a=n&&!c(n.children)?n.children:e.children,f=an(m,e.type,e.props||n?p(e.props,n):jn,a,h,g,y,!a)):1&m&&(f=cn(e.children,g))}return f}function dn(){return an(4096)}function cn(e,n){return an(1,null,null,e,null,n)}function sn(e){return!!e.flags}function vn(e,n){return{data:e,event:n}}var pn="$NO_OP",mn="a runtime error occured! Use Inferno in development environment to find the error.",hn="undefined"!=typeof window&&window.document,gn=Array.isArray;m.prototype.addListener=function(e){this.listeners.push(e)},m.prototype.trigger=function(){for(var e=this.listeners,n=0,t=e.length;n<t;n++)e[n]()};var yn={recyclingEnabled:!1,findDOMNodeEnabled:!1,roots:null,createVNode:null,beforeRender:null,afterRender:null,afterMount:null,afterUpdate:null,beforeUnmount:null},kn="http://www.w3.org/1999/xlink",bn="http://www.w3.org/XML/1998/namespace",Cn="http://www.w3.org/2000/svg",Nn=Object.create(null);Nn.volume=!0,Nn.defaultChecked=!0,Object.freeze(Nn);var xn=Object.create(null);xn.muted=!0,xn.scoped=!0,xn.loop=!0,xn.open=!0,xn.checked=!0,xn.default=!0,xn.capture=!0,xn.disabled=!0,xn.readOnly=!0,xn.required=!0,xn.autoplay=!0,xn.controls=!0,xn.seamless=!0,xn.reversed=!0,xn.allowfullscreen=!0,xn.novalidate=!0,xn.hidden=!0,xn.autoFocus=!0,Object.freeze(xn);var wn=Object.create(null);wn["xlink:href"]=kn,wn["xlink:arcrole"]=kn,wn["xlink:actuate"]=kn,wn["xlink:show"]=kn,wn["xlink:role"]=kn,wn["xlink:title"]=kn,wn["xlink:type"]=kn,wn["xml:base"]=bn,wn["xml:lang"]=bn,wn["xml:space"]=bn,Object.freeze(wn);var _n=Object.create(null);_n.animationIterationCount=!0,_n.borderImageOutset=!0,_n.borderImageSlice=!0,_n.borderImageWidth=!0,_n.boxFlex=!0,_n.boxFlexGroup=!0,_n.boxOrdinalGroup=!0,_n.columnCount=!0,_n.flex=!0,_n.flexGrow=!0,_n.flexPositive=!0,_n.flexShrink=!0,_n.flexNegative=!0,_n.flexOrder=!0,_n.gridRow=!0,_n.gridColumn=!0,_n.fontWeight=!0,_n.lineClamp=!0,_n.lineHeight=!0,_n.opacity=!0,_n.order=!0,_n.orphans=!0,_n.tabSize=!0,_n.widows=!0,_n.zIndex=!0,_n.zoom=!0,_n.fillOpacity=!0,_n.floodOpacity=!0,_n.stopOpacity=!0,_n.strokeDasharray=!0,_n.strokeDashoffset=!0,_n.strokeMiterlimit=!0,_n.strokeOpacity=!0,_n.strokeWidth=!0,Object.freeze(_n);var Mn=Object.create(null);Mn.children=!0,Mn.childrenType=!0,Mn.defaultValue=!0,Mn.ref=!0,Mn.key=!0,Mn.selected=!0,Mn.checked=!0,Mn.multiple=!0,Object.freeze(Mn);var On=Object.create(null);On.onClick=!0,On.onMouseDown=!0,On.onMouseUp=!0,On.onMouseMove=!0,On.onSubmit=!0,On.onDblClick=!0,On.onKeyDown=!0,On.onKeyUp=!0,On.onKeyPress=!0,Object.freeze(On);var Sn=hn&&!!navigator.platform&&/iPad|iPhone|iPod/.test(navigator.platform),En=new Map,Un=new Map,Vn=new Map,Dn=new Map,In=[],Tn=new Map;yn.roots=In;var Pn=hn?document.body:null,jn={},Wn={linkEvent:vn,createVNode:an,cloneVNode:fn,NO_OP:pn,EMPTY_OBJ:jn,render:ke,findDOMNode:me,createRenderer:be,options:yn,version:"1.4.0"};e.version="1.4.0",e.default=Wn,e.linkEvent=vn,e.createVNode=an,e.cloneVNode=fn,e.NO_OP=pn,e.EMPTY_OBJ=jn,e.render=ke,e.findDOMNode=me,e.createRenderer=be,e.options=yn,e.internal_isUnitlessNumber=_n,e.internal_normalize=w,Object.defineProperty(e,"__esModule",{value:!0})}));
  })();
});

require.register("path-parser/dist/commonjs/path-parser.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "path-parser");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _searchParams = require('search-params');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOrConstrained = function defaultOrConstrained(match) {
    return '(' + (match ? match.replace(/(^<|>$)/g, '') : '[a-zA-Z0-9-_.~%\':]+') + ')';
};

var rules = [{
    // An URL can contain a parameter :paramName
    // - and _ are allowed but not in last position
    name: 'url-parameter',
    pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
    regex: function regex(match) {
        return new RegExp(defaultOrConstrained(match[2]));
    }
}, {
    // Url parameter (splat)
    name: 'url-parameter-splat',
    pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
    regex: /([^\?]*)/
}, {
    name: 'url-parameter-matrix',
    pattern: /^\;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
    regex: function regex(match) {
        return new RegExp(';' + match[1] + '=' + defaultOrConstrained(match[2]));
    }
}, {
    // Query parameter: ?param1&param2
    //                   ?:param1&:param2
    name: 'query-parameter-bracket',
    pattern: /^(?:\?|&)(?:\:)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(?:\[\])/
}, {
    // Query parameter: ?param1&param2
    //                   ?:param1&:param2
    name: 'query-parameter',
    pattern: /^(?:\?|&)(?:\:)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/
}, {
    // Delimiter /
    name: 'delimiter',
    pattern: /^(\/|\?)/,
    regex: function regex(match) {
        return new RegExp('\\' + match[0]);
    }
}, {
    // Sub delimiters
    name: 'sub-delimiter',
    pattern: /^(\!|\&|\-|_|\.|;)/,
    regex: function regex(match) {
        return new RegExp(match[0]);
    }
}, {
    // Unmatched fragment (until delimiter is found)
    name: 'fragment',
    pattern: /^([0-9a-zA-Z]+)/,
    regex: function regex(match) {
        return new RegExp(match[0]);
    }
}];

var exists = function exists(val) {
    return val !== undefined && val !== null;
};

var tokenise = function tokenise(str) {
    var tokens = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    // Look for a matching rule
    var matched = rules.some(function (rule) {
        var match = str.match(rule.pattern);
        if (!match) return false;

        tokens.push({
            type: rule.name,
            match: match[0],
            val: match.slice(1, 2),
            otherVal: match.slice(2),
            regex: rule.regex instanceof Function ? rule.regex(match) : rule.regex
        });

        if (match[0].length < str.length) tokens = tokenise(str.substr(match[0].length), tokens);
        return true;
    });

    // If no rules matched, throw an error (possible malformed path)
    if (!matched) {
        throw new Error('Could not parse path.');
    }
    // Return tokens
    return tokens;
};

var optTrailingSlash = function optTrailingSlash(source, trailingSlash) {
    if (!trailingSlash) return source;
    return source.replace(/\\\/$/, '') + '(?:\\/)?';
};

var upToDelimiter = function upToDelimiter(source, delimiter) {
    if (!delimiter) return source;

    return (/(\/)$/.test(source) ? source : source + '(\\/|\\?|\\.|;|$)'
    );
};

var appendQueryParam = function appendQueryParam(params, param) {
    var val = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    if (/\[\]$/.test(param)) {
        param = (0, _searchParams.withoutBrackets)(param);
        val = [val];
    }
    var existingVal = params[param];

    if (existingVal === undefined) params[param] = val;else params[param] = Array.isArray(existingVal) ? existingVal.concat(val) : [existingVal, val];

    return params;
};

var parseQueryParams = function parseQueryParams(path) {
    var searchPart = (0, _searchParams.getSearch)(path);
    if (!searchPart) return {};

    return (0, _searchParams.toObject)((0, _searchParams.parse)(searchPart));
};

function _serialise(key, val) {
    if (Array.isArray(val)) {
        return val.map(function (v) {
            return _serialise(key, v);
        }).join('&');
    }

    if (val === true) {
        return key;
    }

    return key + '=' + val;
}

var Path = function () {
    _createClass(Path, null, [{
        key: 'createPath',
        value: function createPath(path) {
            return new Path(path);
        }
    }, {
        key: 'serialise',
        value: function serialise(key, val) {
            return _serialise(key, val);
        }
    }]);

    function Path(path) {
        _classCallCheck(this, Path);

        if (!path) throw new Error('Please supply a path');
        this.path = path;
        this.tokens = tokenise(path);

        this.hasUrlParams = this.tokens.filter(function (t) {
            return (/^url-parameter/.test(t.type)
            );
        }).length > 0;
        this.hasSpatParam = this.tokens.filter(function (t) {
            return (/splat$/.test(t.type)
            );
        }).length > 0;
        this.hasMatrixParams = this.tokens.filter(function (t) {
            return (/matrix$/.test(t.type)
            );
        }).length > 0;
        this.hasQueryParams = this.tokens.filter(function (t) {
            return (/^query-parameter/.test(t.type)
            );
        }).length > 0;
        // Extract named parameters from tokens
        this.spatParams = this._getParams('url-parameter-splat');
        this.urlParams = this._getParams(/^url-parameter/);
        // Query params
        this.queryParams = this._getParams('query-parameter');
        this.queryParamsBr = this._getParams('query-parameter-bracket');
        // All params
        this.params = this.urlParams.concat(this.queryParams).concat(this.queryParamsBr);
        // Check if hasQueryParams
        // Regular expressions for url part only (full and partial match)
        this.source = this.tokens.filter(function (t) {
            return t.regex !== undefined;
        }).map(function (r) {
            return r.regex.source;
        }).join('');
    }

    _createClass(Path, [{
        key: '_getParams',
        value: function _getParams(type) {
            var predicate = type instanceof RegExp ? function (t) {
                return type.test(t.type);
            } : function (t) {
                return t.type === type;
            };

            return this.tokens.filter(predicate).map(function (t) {
                return t.val[0];
            });
        }
    }, {
        key: '_isQueryParam',
        value: function _isQueryParam(name) {
            return this.queryParams.indexOf(name) !== -1 || this.queryParamsBr.indexOf(name) !== -1;
        }
    }, {
        key: '_urlTest',
        value: function _urlTest(path, regex) {
            var _this = this;

            var match = path.match(regex);
            if (!match) return null;else if (!this.urlParams.length) return {};
            // Reduce named params to key-value pairs
            return match.slice(1, this.urlParams.length + 1).reduce(function (params, m, i) {
                params[_this.urlParams[i]] = decodeURIComponent(m);
                return params;
            }, {});
        }
    }, {
        key: 'test',
        value: function test(path, opts) {
            var _this2 = this;

            var options = _extends({ trailingSlash: false }, opts);
            // trailingSlash: falsy => non optional, truthy => optional
            var source = optTrailingSlash(this.source, options.trailingSlash);
            // Check if exact match
            var matched = this._urlTest(path, new RegExp('^' + source + (this.hasQueryParams ? '(\\?.*$|$)' : '$')));
            // If no match, or no query params, no need to go further
            if (!matched || !this.hasQueryParams) return matched;
            // Extract query params
            var queryParams = parseQueryParams(path);
            var unexpectedQueryParams = Object.keys(queryParams).filter(function (p) {
                return _this2.queryParams.concat(_this2.queryParamsBr).indexOf(p) === -1;
            });

            if (unexpectedQueryParams.length === 0) {
                // Extend url match
                Object.keys(queryParams).forEach(function (p) {
                    return matched[p] = queryParams[p];
                });

                return matched;
            }

            return null;
        }
    }, {
        key: 'partialTest',
        value: function partialTest(path, opts) {
            var _this3 = this;

            var options = _extends({ delimited: true }, opts);
            // Check if partial match (start of given path matches regex)
            // trailingSlash: falsy => non optional, truthy => optional
            var source = upToDelimiter(this.source, options.delimited);
            var match = this._urlTest(path, new RegExp('^' + source));

            if (!match) return match;

            if (!this.hasQueryParams) return match;

            var queryParams = parseQueryParams(path);

            Object.keys(queryParams).filter(function (p) {
                return _this3.queryParams.concat(_this3.queryParamsBr).indexOf(p) >= 0;
            }).forEach(function (p) {
                return appendQueryParam(match, p, queryParams[p]);
            });

            return match;
        }
    }, {
        key: 'build',
        value: function build() {
            var _this4 = this;

            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var options = _extends({ ignoreConstraints: false, ignoreSearch: false }, opts);
            var encodedParams = Object.keys(params).reduce(function (acc, key) {
                if (!exists(params[key])) {
                    return acc;
                }

                var val = params[key];
                var encode = _this4._isQueryParam(key) ? encodeURIComponent : encodeURI;

                if (typeof val === 'boolean') {
                    acc[key] = val;
                } else if (Array.isArray(val)) {
                    acc[key] = val.map(encode);
                } else {
                    acc[key] = encode(val);
                }

                return acc;
            }, {});

            // Check all params are provided (not search parameters which are optional)
            if (this.urlParams.some(function (p) {
                return !exists(encodedParams[p]);
            })) throw new Error('Missing parameters');

            // Check constraints
            if (!options.ignoreConstraints) {
                var constraintsPassed = this.tokens.filter(function (t) {
                    return (/^url-parameter/.test(t.type) && !/-splat$/.test(t.type)
                    );
                }).every(function (t) {
                    return new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(encodedParams[t.val]);
                });

                if (!constraintsPassed) throw new Error('Some parameters are of invalid format');
            }

            var base = this.tokens.filter(function (t) {
                return (/^query-parameter/.test(t.type) === false
                );
            }).map(function (t) {
                if (t.type === 'url-parameter-matrix') return ';' + t.val + '=' + encodedParams[t.val[0]];
                return (/^url-parameter/.test(t.type) ? encodedParams[t.val[0]] : t.match
                );
            }).join('');

            if (options.ignoreSearch) return base;

            var queryParams = this.queryParams.concat(this.queryParamsBr.map(function (p) {
                return p + '[]';
            }));

            var searchPart = queryParams.filter(function (p) {
                return Object.keys(encodedParams).indexOf((0, _searchParams.withoutBrackets)(p)) !== -1;
            }).map(function (p) {
                return _serialise(p, encodedParams[(0, _searchParams.withoutBrackets)(p)]);
            }).join('&');

            return base + (searchPart ? '?' + searchPart : '');
        }
    }]);

    return Path;
}();

exports.default = Path;
module.exports = exports['default'];
  })();
});

require.register("process/browser.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "process");
  (function() {
    // shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };
  })();
});

require.register("route-node/dist/commonjs/route-node.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "route-node");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathParser = require('path-parser');

var _pathParser2 = _interopRequireDefault(_pathParser);

var _searchParams = require('search-params');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noop = function noop() {};

var RouteNode = function () {
    function RouteNode() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var childRoutes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cb = arguments[3];
        var parent = arguments[4];

        _classCallCheck(this, RouteNode);

        this.name = name;
        this.absolute = /^~/.test(path);
        this.path = this.absolute ? path.slice(1) : path;
        this.parser = this.path ? new _pathParser2.default(this.path) : null;
        this.children = [];
        this.parent = parent;

        this.checkParents();

        this.add(childRoutes, cb);

        return this;
    }

    _createClass(RouteNode, [{
        key: 'checkParents',
        value: function checkParents() {
            if (this.absolute && this.hasParentsParams()) {
                throw new Error('[RouteNode] A RouteNode with an abolute path cannot have parents with route parameters');
            }
        }
    }, {
        key: 'hasParentsParams',
        value: function hasParentsParams() {
            if (this.parent && this.parent.parser) {
                var parser = this.parent.parser;
                var hasParams = parser.hasUrlParams || parser.hasSpatParam || parser.hasMatrixParams || parser.hasQueryParams;

                return hasParams || this.parent.hasParentsParams();
            }

            return false;
        }
    }, {
        key: 'getNonAbsoluteChildren',
        value: function getNonAbsoluteChildren() {
            return this.children.filter(function (child) {
                return !child.absolute;
            });
        }
    }, {
        key: 'findAbsoluteChildren',
        value: function findAbsoluteChildren() {
            return this.children.reduce(function (absoluteChildren, child) {
                return absoluteChildren.concat(child.absolute ? child : []).concat(child.findAbsoluteChildren());
            }, []);
        }
    }, {
        key: 'findSlashChild',
        value: function findSlashChild() {
            var slashChildren = this.getNonAbsoluteChildren().filter(function (child) {
                return child.parser && /^\/(\?|$)/.test(child.parser.path);
            });

            return slashChildren[0];
        }
    }, {
        key: 'getParentSegments',
        value: function getParentSegments() {
            var segments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            return this.parent && this.parent.parser ? this.parent.getParentSegments(segments.concat(this.parent)) : segments.reverse();
        }
    }, {
        key: 'setParent',
        value: function setParent(parent) {
            this.parent = parent;
            this.checkParents();
        }
    }, {
        key: 'setPath',
        value: function setPath() {
            var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            this.path = path;
            this.parser = path ? new _pathParser2.default(path) : null;
        }
    }, {
        key: 'add',
        value: function add(route) {
            var _this = this;

            var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

            var originalRoute = void 0;
            if (route === undefined || route === null) return;

            if (route instanceof Array) {
                route.forEach(function (r) {
                    return _this.add(r, cb);
                });
                return;
            }

            if (!(route instanceof RouteNode) && !(route instanceof Object)) {
                throw new Error('RouteNode.add() expects routes to be an Object or an instance of RouteNode.');
            } else if (route instanceof RouteNode) {
                route.setParent(this);
            } else {
                if (!route.name || !route.path) {
                    throw new Error('RouteNode.add() expects routes to have a name and a path defined.');
                }
                originalRoute = route;
                route = new RouteNode(route.name, route.path, route.children, cb, this);
            }

            var names = route.name.split('.');

            if (names.length === 1) {
                // Check duplicated routes
                if (this.children.map(function (child) {
                    return child.name;
                }).indexOf(route.name) !== -1) {
                    throw new Error('Alias "' + route.name + '" is already defined in route node');
                }

                // Check duplicated paths
                if (this.children.map(function (child) {
                    return child.path;
                }).indexOf(route.path) !== -1) {
                    throw new Error('Path "' + route.path + '" is already defined in route node');
                }

                this.children.push(route);
                // Push greedy spats to the bottom of the pile
                this.children.sort(function (left, right) {
                    var leftPath = left.path.split('?')[0].replace(/(.+)\/$/, '$1');
                    var rightPath = right.path.split('?')[0].replace(/(.+)\/$/, '$1');
                    // '/' last
                    if (leftPath === '/') return 1;
                    if (rightPath === '/') return -1;
                    // Spat params last
                    if (left.parser.hasSpatParam) return 1;
                    if (right.parser.hasSpatParam) return -1;
                    // No spat, number of segments (less segments last)
                    var leftSegments = (leftPath.match(/\//g) || []).length;
                    var rightSegments = (rightPath.match(/\//g) || []).length;
                    if (leftSegments < rightSegments) return 1;
                    if (leftSegments > rightSegments) return -1;
                    // Same number of segments, number of URL params ascending
                    var leftParamsCount = left.parser.urlParams.length;
                    var rightParamsCount = right.parser.urlParams.length;
                    if (leftParamsCount < rightParamsCount) return -1;
                    if (leftParamsCount > rightParamsCount) return 1;
                    // Same number of segments and params, last segment length descending
                    var leftParamLength = (leftPath.split('/').slice(-1)[0] || '').length;
                    var rightParamLength = (rightPath.split('/').slice(-1)[0] || '').length;
                    if (leftParamLength < rightParamLength) return 1;
                    if (leftParamLength > rightParamLength) return -1;
                    // Same last segment length, preserve definition order
                    return 0;
                });
            } else {
                // Locate parent node
                var segments = this.getSegmentsByName(names.slice(0, -1).join('.'));
                if (segments) {
                    route.name = names[names.length - 1];
                    segments[segments.length - 1].add(route);
                } else {
                    throw new Error('Could not add route named \'' + route.name + '\', parent is missing.');
                }
            }

            if (originalRoute) {
                var fullName = route.getParentSegments([route]).map(function (_) {
                    return _.name;
                }).join('.');
                cb(_extends({}, originalRoute, {
                    name: fullName
                }));
            }

            return this;
        }
    }, {
        key: 'addNode',
        value: function addNode(name, params) {
            this.add(new RouteNode(name, params));
            return this;
        }
    }, {
        key: 'getSegmentsByName',
        value: function getSegmentsByName(routeName) {
            var findSegmentByName = function findSegmentByName(name, routes) {
                var filteredRoutes = routes.filter(function (r) {
                    return r.name === name;
                });
                return filteredRoutes.length ? filteredRoutes[0] : undefined;
            };
            var segments = [];
            var routes = this.parser ? [this] : this.children;
            var names = (this.parser ? [''] : []).concat(routeName.split('.'));

            var matched = names.every(function (name) {
                var segment = findSegmentByName(name, routes);
                if (segment) {
                    routes = segment.children;
                    segments.push(segment);
                    return true;
                }
                return false;
            });

            return matched ? segments : null;
        }
    }, {
        key: 'getSegmentsMatchingPath',
        value: function getSegmentsMatchingPath(path, options) {
            var trailingSlash = options.trailingSlash,
                strictQueryParams = options.strictQueryParams,
                strongMatching = options.strongMatching;

            var matchChildren = function matchChildren(nodes, pathSegment, segments) {
                var isRoot = nodes.length === 1 && nodes[0].name === '';
                // for (child of node.children) {

                var _loop = function _loop(i) {
                    var child = nodes[i];

                    // Partially match path
                    var match = void 0;
                    var remainingPath = void 0;

                    if (!child.children.length) {
                        match = child.parser.test(pathSegment, { trailingSlash: trailingSlash });
                    }

                    if (!match) {
                        match = child.parser.partialTest(pathSegment, { delimiter: strongMatching });
                    }

                    if (match) {
                        // Remove consumed segment from path
                        var consumedPath = child.parser.build(match, { ignoreSearch: true });
                        if (trailingSlash && !child.children.length) {
                            consumedPath = consumedPath.replace(/\/$/, '');
                        }
                        remainingPath = pathSegment.replace(consumedPath, '');
                        var search = (0, _searchParams.omit)((0, _searchParams.getSearch)(pathSegment.replace(consumedPath, '')), child.parser.queryParams.concat(child.parser.queryParamsBr));
                        remainingPath = (0, _searchParams.getPath)(remainingPath) + (search ? '?' + search : '');
                        if (trailingSlash && !isRoot && remainingPath === '/' && !/\/$/.test(consumedPath)) {
                            remainingPath = '';
                        }

                        segments.push(child);
                        Object.keys(match).forEach(function (param) {
                            return segments.params[param] = match[param];
                        });

                        if (!isRoot && !remainingPath.length) {
                            // fully matched
                            return {
                                v: segments
                            };
                        }
                        if (!isRoot && !strictQueryParams && remainingPath.indexOf('?') === 0) {
                            // unmatched queryParams in non strict mode
                            var remainingQueryParams = (0, _searchParams.parse)(remainingPath.slice(1));

                            remainingQueryParams.forEach(function (_ref) {
                                var name = _ref.name,
                                    value = _ref.value;
                                return segments.params[name] = value;
                            });
                            return {
                                v: segments
                            };
                        }
                        // Continue matching on non absolute children
                        var children = child.getNonAbsoluteChildren();
                        // If no children to match against but unmatched path left
                        if (!children.length) {
                            return {
                                v: null
                            };
                        }
                        // Else: remaining path and children
                        return {
                            v: matchChildren(children, remainingPath, segments)
                        };
                    }
                };

                for (var i = 0; i < nodes.length; i += 1) {
                    var _ret = _loop(i);

                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                }

                return null;
            };

            var topLevelNodes = this.parser ? [this] : this.children;
            var startingNodes = topLevelNodes.reduce(function (nodes, node) {
                return nodes.concat(node, node.findAbsoluteChildren());
            }, []);

            var segments = [];
            segments.params = {};

            var matched = matchChildren(startingNodes, path, segments);
            if (matched && matched.length === 1 && matched[0].name === '') return null;
            return matched;
        }
    }, {
        key: 'getPathFromSegments',
        value: function getPathFromSegments(segments) {
            return segments ? segments.map(function (segment) {
                return segment.path;
            }).join('') : null;
        }
    }, {
        key: 'getPath',
        value: function getPath(routeName) {
            return this.getPathFromSegments(this.getSegmentsByName(routeName));
        }
    }, {
        key: 'buildPathFromSegments',
        value: function buildPathFromSegments(segments) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if (!segments) return null;

            var searchParams = [];
            var nonSearchParams = [];

            for (var i = 0; i < segments.length; i += 1) {
                var parser = segments[i].parser;
                searchParams.push.apply(searchParams, _toConsumableArray(parser.queryParams));
                searchParams.push.apply(searchParams, _toConsumableArray(parser.queryParamsBr));
                nonSearchParams.push.apply(nonSearchParams, _toConsumableArray(parser.urlParams));
                nonSearchParams.push.apply(nonSearchParams, _toConsumableArray(parser.spatParams));
            }

            if (!options.strictQueryParams) {
                var extraParams = Object.keys(params).reduce(function (acc, p) {
                    return searchParams.indexOf(p) === -1 && nonSearchParams.indexOf(p) === -1 ? acc.concat(p) : acc;
                }, []);
                searchParams.push.apply(searchParams, _toConsumableArray(extraParams));
            }

            var searchPart = !searchParams.length ? null : searchParams.filter(function (p) {
                if (Object.keys(params).indexOf((0, _searchParams.withoutBrackets)(p)) === -1) {
                    return false;
                }

                var val = params[(0, _searchParams.withoutBrackets)(p)];

                return val !== undefined && val !== null;
            }).map(function (p) {
                var val = params[(0, _searchParams.withoutBrackets)(p)];
                var encodedVal = Array.isArray(val) ? val.map(encodeURIComponent) : encodeURIComponent(val);

                return _pathParser2.default.serialise(p, encodedVal);
            }).join('&');

            var path = segments.reduce(function (path, segment) {
                var segmentPath = segment.parser.build(params, { ignoreSearch: true });

                return segment.absolute ? segmentPath : path + segmentPath;
            }, '');

            return path + (searchPart ? '?' + searchPart : '');
        }
    }, {
        key: 'getMetaFromSegments',
        value: function getMetaFromSegments(segments) {
            var accName = '';

            return segments.reduce(function (meta, segment) {
                var urlParams = segment.parser.urlParams.reduce(function (params, p) {
                    params[p] = 'url';
                    return params;
                }, {});

                var allParams = segment.parser.queryParams.reduce(function (params, p) {
                    params[p] = 'query';
                    return params;
                }, urlParams);

                if (segment.name !== undefined) {
                    accName = accName ? accName + '.' + segment.name : segment.name;
                    meta[accName] = allParams;
                }
                return meta;
            }, {});
        }
    }, {
        key: 'buildPath',
        value: function buildPath(routeName) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var defaultOptions = { strictQueryParams: true };
            var options = _extends({}, defaultOptions, opts);
            var path = this.buildPathFromSegments(this.getSegmentsByName(routeName), params, options);

            if (options.trailingSlash === true) {
                return (/\/$/.test(path) ? path : path + '/'
                );
            } else if (options.trailingSlash === false) {
                return (/\/$/.test(path) ? path.slice(0, -1) : path
                );
            }

            return path;
        }
    }, {
        key: 'buildStateFromSegments',
        value: function buildStateFromSegments(segments) {
            if (!segments || !segments.length) return null;

            var name = segments.map(function (segment) {
                return segment.name;
            }).filter(function (name) {
                return name;
            }).join('.');
            var params = segments.params;

            return {
                name: name,
                params: params,
                _meta: this.getMetaFromSegments(segments)
            };
        }
    }, {
        key: 'buildState',
        value: function buildState(name) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var segments = this.getSegmentsByName(name);
            if (!segments || !segments.length) return null;

            return {
                name: name,
                params: params,
                _meta: this.getMetaFromSegments(segments)
            };
        }
    }, {
        key: 'matchPath',
        value: function matchPath(path, options) {
            var defaultOptions = { trailingSlash: false, strictQueryParams: true, strongMatching: true };
            var opts = _extends({}, defaultOptions, options);
            var matchedSegments = this.getSegmentsMatchingPath(path, opts);

            if (matchedSegments) {
                if (matchedSegments[0].absolute) {
                    var firstSegmentParams = matchedSegments[0].getParentSegments();

                    matchedSegments.reverse();
                    matchedSegments.push.apply(matchedSegments, _toConsumableArray(firstSegmentParams));
                    matchedSegments.reverse();
                }

                var lastSegment = matchedSegments[matchedSegments.length - 1];
                var lastSegmentSlashChild = lastSegment.findSlashChild();

                if (lastSegmentSlashChild) {
                    matchedSegments.push(lastSegmentSlashChild);
                }
            }

            return this.buildStateFromSegments(matchedSegments);
        }
    }]);

    return RouteNode;
}();

exports.default = RouteNode;
module.exports = exports['default'];
  })();
});

require.register("router5.transition-path/index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5.transition-path");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.nameToIDs = nameToIDs;
function nameToIDs(name) {
    return name.split('.').reduce(function (ids, name) {
        return ids.concat(ids.length ? ids[ids.length - 1] + '.' + name : name);
    }, []);
}

function exists(val) {
    return val !== undefined && val !== null;
}

function hasMetaParams(state) {
    return state && state.meta && state.meta.params;
}

function extractSegmentParams(name, state) {
    if (!exists(state.meta.params[name])) return {};

    return Object.keys(state.meta.params[name]).reduce(function (params, p) {
        params[p] = state.params[p];
        return params;
    }, {});
}

function transitionPath(toState, fromState) {
    var fromStateIds = fromState ? nameToIDs(fromState.name) : [];
    var toStateIds = nameToIDs(toState.name);
    var maxI = Math.min(fromStateIds.length, toStateIds.length);

    function pointOfDifference() {
        var i = void 0;

        var _loop = function _loop() {
            var left = fromStateIds[i];
            var right = toStateIds[i];

            if (left !== right) return {
                    v: i
                };

            var leftParams = extractSegmentParams(left, toState);
            var rightParams = extractSegmentParams(right, fromState);

            if (leftParams.length !== rightParams.length) return {
                    v: i
                };
            if (leftParams.length === 0) return 'continue';

            var different = Object.keys(leftParams).some(function (p) {
                return rightParams[p] !== leftParams[p];
            });
            if (different) {
                return {
                    v: i
                };
            }
        };

        for (i = 0; i < maxI; i += 1) {
            var _ret = _loop();

            switch (_ret) {
                case 'continue':
                    continue;

                default:
                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
        }

        return i;
    }

    var i = void 0;
    if (!fromState) {
        i = 0;
    } else if (!hasMetaParams(fromState) && !hasMetaParams(toState)) {
        console.warn('[router5.transition-path] Some states are missing metadata, reloading all segments');
        i = 0;
    } else {
        i = pointOfDifference();
    }

    var toDeactivate = fromStateIds.slice(i).reverse();
    var toActivate = toStateIds.slice(i);

    var intersection = fromState && i > 0 ? fromStateIds[i - 1] : '';

    return {
        intersection: intersection,
        toDeactivate: toDeactivate,
        toActivate: toActivate
    };
}

exports.default = transitionPath;
  })();
});

require.register("router5/constants.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var errorCodes = exports.errorCodes = {
    ROUTER_NOT_STARTED: 'NOT_STARTED',
    NO_START_PATH_OR_STATE: 'NO_START_PATH_OR_STATE',
    ROUTER_ALREADY_STARTED: 'ALREADY_STARTED',
    ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
    SAME_STATES: 'SAME_STATES',
    CANNOT_DEACTIVATE: 'CANNOT_DEACTIVATE',
    CANNOT_ACTIVATE: 'CANNOT_ACTIVATE',
    TRANSITION_ERR: 'TRANSITION_ERR',
    TRANSITION_CANCELLED: 'CANCELLED'
};

var constants = {
    UNKNOWN_ROUTE: '@@router5/UNKNOWN_ROUTE',
    ROUTER_START: '$start',
    ROUTER_STOP: '$stop',
    TRANSITION_START: '$$start',
    TRANSITION_CANCEL: '$$cancel',
    TRANSITION_SUCCESS: '$$success',
    TRANSITION_ERROR: '$$error'
};

exports.default = constants;
  })();
});

require.register("router5/core/clone.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = withCloning;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function withCloning(router, createRouter) {
    router.clone = clone;

    /**
     * Clone the current router configuration. The new returned router will be non-started,
     * with a null state
     * @param  {[type]} deps [description]
     * @return {[type]}      [description]
     */
    function clone() {
        var deps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var clonedDependencies = _extends({}, router.getDependencies(), deps);
        var clonedRouter = createRouter(router.rootNode, router.getOptions(), clonedDependencies);

        clonedRouter.useMiddleware.apply(clonedRouter, _toConsumableArray(router.getMiddlewareFactories()));
        clonedRouter.usePlugin.apply(clonedRouter, _toConsumableArray(router.getPlugins()));

        var _router$getLifecycleF = router.getLifecycleFactories(),
            _router$getLifecycleF2 = _slicedToArray(_router$getLifecycleF, 2),
            canDeactivateFactories = _router$getLifecycleF2[0],
            canActivateFactories = _router$getLifecycleF2[1];

        Object.keys(canDeactivateFactories).forEach(function (name) {
            return clonedRouter.canDeactivate(name, canDeactivateFactories[name]);
        });
        Object.keys(canActivateFactories).forEach(function (name) {
            return clonedRouter.canActivate(name, canActivateFactories[name]);
        });

        return clonedRouter;
    }
};
  })();
});

require.register("router5/core/middleware.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = withMiddleware;
function withMiddleware(router) {
    var middlewareFactories = [];
    var middlewareFunctions = [];

    router.useMiddleware = useMiddleware;
    router.getMiddlewareFactories = getMiddlewareFactories;
    router.getMiddlewareFunctions = getMiddlewareFunctions;
    router.clearMiddleware = clearMiddleware;

    /**
     * Register middleware functions.
     * @param  {...Function} middlewares The middleware functions
     * @return {Object}                  The router instance
     */
    function useMiddleware() {
        for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
            middlewares[_key] = arguments[_key];
        }

        middlewares.forEach(addMiddleware);

        return router;
    }

    /**
     * Remove all middleware functions
     * @return {Object} The router instance
     */
    function clearMiddleware() {
        middlewareFactories = [];
        middlewareFunctions = [];

        return router;
    }

    function getMiddlewareFactories() {
        return middlewareFactories;
    }

    function getMiddlewareFunctions() {
        return middlewareFunctions;
    }

    function addMiddleware(middleware) {
        middlewareFactories.push(middleware);
        middlewareFunctions.push(router.executeFactory(middleware));
    }
}
  })();
});

require.register("router5/core/navigation.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = withNavigation;

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _transition = require('../transition');

var _transition2 = _interopRequireDefault(_transition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {};

function withNavigation(router) {
    var cancelCurrentTransition = void 0;

    router.navigate = navigate;
    router.navigateToDefault = navigateToDefault;
    router.transitionToState = transitionToState;
    router.cancel = cancel;

    /**
     * Cancel the current transition if there is one
     * @return {Object} The router instance
     */
    function cancel() {
        if (cancelCurrentTransition) {
            cancelCurrentTransition('navigate');
            cancelCurrentTransition = null;
        }

        return router;
    }

    /**
     * Navigate to a route
     * @param  {String}   routeName      The route name
     * @param  {Object}   [routeParams]  The route params
     * @param  {Object}   [options]      The navigation options (`replace`, `reload`)
     * @param  {Function} [done]         A done node style callback (err, state)
     * @return {Function}                A cancel function
     */
    function navigate() {
        var _ref;

        var name = arguments.length <= 0 ? undefined : arguments[0];
        var lastArg = (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]);
        var done = typeof lastArg === 'function' ? lastArg : noop;
        var params = _typeof(arguments.length <= 1 ? undefined : arguments[1]) === 'object' ? arguments.length <= 1 ? undefined : arguments[1] : {};
        var opts = _typeof(arguments.length <= 2 ? undefined : arguments[2]) === 'object' ? arguments.length <= 2 ? undefined : arguments[2] : {};

        if (!router.isStarted()) {
            done({ code: _constants.errorCodes.ROUTER_NOT_STARTED });
            return;
        }

        var route = router.buildState(name, params);

        if (!route) {
            var err = { code: _constants.errorCodes.ROUTE_NOT_FOUND };
            done(err);
            router.invokeEventListeners(_constants2.default.TRANSITION_ERROR, null, router.getState(), err);
            return;
        }

        var toState = router.makeState(route.name, route.params, router.buildPath(name, params), route._meta);
        var sameStates = router.getState() ? router.areStatesEqual(router.getState(), toState, false) : false;

        // Do not proceed further if states are the same and no reload
        // (no desactivation and no callbacks)
        if (sameStates && !opts.reload) {
            var _err = { code: _constants.errorCodes.SAME_STATES };
            done(_err);
            router.invokeEventListeners(_constants2.default.TRANSITION_ERROR, toState, router.getState(), _err);
            return;
        }

        var fromState = sameStates ? null : router.getState();

        // Transitio
        return transitionToState(toState, fromState, opts, function (err, state) {
            if (err) {
                if (err.redirect) {
                    var _err$redirect = err.redirect,
                        _name = _err$redirect.name,
                        _params = _err$redirect.params;


                    navigate(_name, _params, _extends({}, opts, { reload: true }), done);
                } else {
                    done(err);
                }
            } else {
                router.invokeEventListeners(_constants2.default.TRANSITION_SUCCESS, state, fromState, opts);
                done(null, state);
            }
        });
    }

    /**
     * Navigate to the default route (if defined)
     * @param  {Object}   [opts] The navigation options
     * @param  {Function} [done] A done node style callback (err, state)
     * @return {Function}        A cancel function
     */
    function navigateToDefault() {
        var opts = _typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object' ? arguments.length <= 0 ? undefined : arguments[0] : {};
        var done = arguments.length === 2 ? arguments.length <= 1 ? undefined : arguments[1] : typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'function' ? arguments.length <= 0 ? undefined : arguments[0] : noop;
        var options = router.getOptions();

        if (options.defaultRoute) {
            return navigate(options.defaultRoute, options.defaultParams, opts, done);
        }

        return function () {};
    }

    function transitionToState(toState, fromState) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;

        cancel();
        router.invokeEventListeners(_constants2.default.TRANSITION_START, toState, fromState);

        cancelCurrentTransition = (0, _transition2.default)(router, toState, fromState, options, function (err, state) {
            cancelCurrentTransition = null;
            state = state || toState;

            if (err) {
                if (err.code === _constants.errorCodes.TRANSITION_CANCELLED) {
                    router.invokeEventListeners(_constants2.default.TRANSITION_CANCEL, toState, fromState);
                } else {
                    router.invokeEventListeners(_constants2.default.TRANSITION_ERROR, toState, fromState, err);
                }
                done(err);
            } else {
                router.setState(state);
                done(null, state);
            }
        });

        return cancelCurrentTransition;
    }
}
  })();
});

require.register("router5/core/plugins.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = withPlugins;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var pluginMethods = ['onStart', 'onStop', 'onTransitionSuccess', 'onTransitionStart', 'onTransitionError', 'onTransitionCancel'];

function withPlugins(router) {
    var plugins = [];
    var removePluginListeners = [];

    router.usePlugin = usePlugin;
    router.hasPlugin = hasPlugin;
    router.getPlugins = getPlugins;

    function getPlugins() {
        return plugins;
    }

    /**
     * Use plugins
     * @param  {...Function} plugins An argument list of plugins
     * @return {Object}              The router instance
     */
    function usePlugin() {
        for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
            plugins[_key] = arguments[_key];
        }

        plugins.forEach(addPlugin);
        return router;
    }

    function addPlugin(plugin) {
        if (!hasPlugin(plugin)) {
            plugins.push(plugin);
            startPlugin(plugin);
        }
    }

    /**
     * Check if a plugin has already been registered.
     * @param  {String}  pluginName The plugin name
     * @return {Boolean}            Whether the plugin has been registered
     */
    function hasPlugin(pluginName) {
        return plugins.filter(function (p) {
            return p.pluginName === pluginName || p.name === pluginName;
        }).length > 0;
    }

    function startPlugin(plugin) {
        var appliedPlugin = router.executeFactory(plugin);

        var removeEventListeners = pluginMethods.map(function (methodName) {
            if (appliedPlugin[methodName]) {
                return router.addEventListener(methodName.toLowerCase().replace(/^on/, '$$').replace(/transition/, '$$'), appliedPlugin[methodName]);
            }
        }).filter(Boolean);

        removePluginListeners.push.apply(removePluginListeners, _toConsumableArray(removeEventListeners));
    }
}
  })();
});

require.register("router5/core/route-lifecycle.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = withRouteLifecycle;
var toFunction = function toFunction(val) {
    return typeof val === 'function' ? val : function () {
        return function () {
            return val;
        };
    };
};

function withRouteLifecycle(router) {
    var canDeactivateFactories = {};
    var canActivateFactories = {};
    var canDeactivateFunctions = {};
    var canActivateFunctions = {};

    router.canDeactivate = canDeactivate;
    router.canActivate = canActivate;
    router.getLifecycleFactories = getLifecycleFactories;
    router.getLifecycleFunctions = getLifecycleFunctions;
    router.clearCanDeactivate = clearCanDeactivate;

    function getLifecycleFactories() {
        return [canDeactivateFactories, canActivateFactories];
    }

    function getLifecycleFunctions() {
        return [canDeactivateFunctions, canActivateFunctions];
    }

    /**
     * Register a canDeactivate handler or specify a if a route can be deactivated
     * @param  {String} name                           The route name
     * @param  {Function|Boolean} canDeactivateHandler The canDeactivate handler or boolean
     * @return {Object}                                The router instance
     */
    function canDeactivate(name, canDeactivateHandler) {
        var factory = toFunction(canDeactivateHandler);

        canDeactivateFactories[name] = factory;
        canDeactivateFunctions[name] = router.executeFactory(factory);

        return router;
    }

    /**
     * Remove a canDeactivate handler for a route
     * @param  {String} name The route name
     * @return {Object}      The router instance
     */
    function clearCanDeactivate(name) {
        canDeactivateFactories[name] = undefined;
        canDeactivateFunctions[name] = undefined;

        return router;
    }

    /**
     * Register a canActivate handler or specify a if a route can be deactivated
     * @param  {String} name                         The route name
     * @param  {Function|Boolean} canActivateHandler The canActivate handler or boolean
     * @return {Object}                              The router instance
     */
    function canActivate(name, canActivateHandler) {
        var factory = toFunction(canActivateHandler);

        canActivateFactories[name] = factory;
        canActivateFunctions[name] = router.executeFactory(factory);

        return router;
    }
}
  })();
});

require.register("router5/core/router-lifecycle.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = withRouterLifecycle;

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {};

function withRouterLifecycle(router) {
    var started = false;
    var options = router.getOptions();

    router.isStarted = isStarted;
    router.start = start;
    router.stop = stop;

    /**
     * Check if the router is started
     * @return {Boolean} Whether the router is started or not
     */
    function isStarted() {
        return started;
    }

    /**
     * Start the router
     * @param  {String|Object} startPathOrState The start path or state. This is optional when using the browser plugin.
     * @param  {Function}      done             A done node style callback (err, state)
     * @return {Object}                         The router instance
     */
    function start() {
        var _ref;

        var lastArg = (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]);
        var done = typeof lastArg === 'function' ? lastArg : noop;
        var startPathOrState = typeof (arguments.length <= 0 ? undefined : arguments[0]) !== 'function' ? arguments.length <= 0 ? undefined : arguments[0] : undefined;

        if (started) {
            done({ code: _constants.errorCodes.ROUTER_ALREADY_STARTED });
            return router;
        }

        var startPath = void 0,
            startState = void 0;

        started = true;
        router.invokeEventListeners(_constants2.default.ROUTER_START);

        // callback
        var cb = function cb(err, state) {
            var invokeErrCb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            if (!err) router.invokeEventListeners(_constants2.default.TRANSITION_SUCCESS, state, null, { replace: true });
            if (err && invokeErrCb) router.invokeEventListeners(_constants2.default.TRANSITION_ERROR, state, null, err);
            done(err, state);
        };

        if (startPathOrState === undefined && !options.defaultRoute) {
            return cb({ code: _constants.errorCodes.NO_START_PATH_OR_STATE });
        }if (typeof startPathOrState === 'string') {
            startPath = startPathOrState;
        } else if ((typeof startPathOrState === 'undefined' ? 'undefined' : _typeof(startPathOrState)) === 'object') {
            startState = startPathOrState;
        }

        if (!startState) {
            // If no supplied start state, get start state
            startState = startPath === undefined ? null : router.matchPath(startPath);

            // Navigate to default function
            var navigateToDefault = function navigateToDefault() {
                return router.navigateToDefault({ replace: true }, done);
            };
            var redirect = function redirect(route) {
                return router.navigate(route.name, route.params, { replace: true, reload: true }, done);
            };
            // If matched start path
            if (startState) {
                router.transitionToState(startState, router.getState(), {}, function (err, state) {
                    if (!err) cb(null, state);else if (err.redirect) redirect(err.redirect);else if (options.defaultRoute) navigateToDefault();else cb(err, null, false);
                });
            } else if (options.defaultRoute) {
                // If default, navigate to default
                navigateToDefault();
            } else if (options.allowNotFound) {
                cb(null, router.makeNotFoundState(startPath));
            } else {
                // No start match, no default => do nothing
                cb({ code: _constants.errorCodes.ROUTE_NOT_FOUND, path: startPath }, null);
            }
        } else {
            // Initialise router with provided start state
            router.setState(startState);
            cb(null, startState);
        }

        return router;
    }

    /**
     * Stop the router
     * @return {Object} The router instance
     */
    function stop() {
        if (started) {
            router.setState(null);
            started = false;
            router.invokeEventListeners(_constants2.default.ROUTER_STOP);
        }

        return router;
    }
}
  })();
});

require.register("router5/core/utils.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = withUtils;

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function withUtils(router) {
    var options = router.getOptions();

    router.isActive = isActive;
    router.areStatesEqual = areStatesEqual;
    router.areStatesDescendants = areStatesDescendants;
    router.buildPath = buildPath;
    router.buildState = buildState;
    router.matchPath = matchPath;
    router.setRootPath = setRootPath;

    /**
     * Check if a route is currently active
     * @param  {String}  name                     The route name
     * @param  {Object}  params                   The route params
     * @param  {Boolean} [strictEquality=false]   Whether to check if the given route is the active route, or part of the active route
     * @param  {Boolean} [ignoreQueryParams=true] Whether to ignore query parameters
     * @return {Boolean}                          Whether the given route is active
     */
    function isActive(name) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var strictEquality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var ignoreQueryParams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

        var activeState = router.getState();

        if (!activeState) return false;

        if (strictEquality || activeState.name === name) {
            return areStatesEqual(router.makeState(name, params), activeState, ignoreQueryParams);
        }

        return areStatesDescendants(router.makeState(name, params), activeState);
    }

    /**
     * Compare two route state objects
     * @param  {Object}  state1            The route state
     * @param  {Object}  state2            The other route state
     * @param  {Boolean} ignoreQueryParams Whether to ignore query parameters or not
     * @return {Boolean}                   Whether the two route state are equal or not
     */
    function areStatesEqual(state1, state2) {
        var ignoreQueryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (state1.name !== state2.name) return false;

        var getUrlParams = function getUrlParams(name) {
            return router.rootNode.getSegmentsByName(name).map(function (segment) {
                return segment.parser[ignoreQueryParams ? 'urlParams' : 'params'];
            }).reduce(function (params, p) {
                return params.concat(p);
            }, []);
        };

        var state1Params = getUrlParams(state1.name);
        var state2Params = getUrlParams(state2.name);

        return state1Params.length === state2Params.length && state1Params.every(function (p) {
            return state1.params[p] === state2.params[p];
        });
    }

    /**
     * Check if two states are related
     * @param  {State} parentState  The parent state
     * @param  {State} childState   The child state
     * @return {Boolean}            Whether the two states are descendants or not
     */
    function areStatesDescendants(parentState, childState) {
        var regex = new RegExp('^' + parentState.name + '\\.(.*)$');
        if (!regex.test(childState.name)) return false;
        // If child state name extends parent state name, and all parent state params
        // are in child state params.
        return Object.keys(parentState.params).every(function (p) {
            return parentState.params[p] === childState.params[p];
        });
    }

    /**
     * Build a path
     * @param  {String} route  The route name
     * @param  {Object} params The route params
     * @return {String}        The path
     */
    function buildPath(route, params) {
        if (route === _constants2.default.UNKNOWN_ROUTE) {
            return params.path;
        }

        var useTrailingSlash = options.useTrailingSlash,
            strictQueryParams = options.strictQueryParams;

        return router.rootNode.buildPath(route, params, { trailingSlash: useTrailingSlash, strictQueryParams: strictQueryParams });
    }

    function buildState(route, params) {
        return router.rootNode.buildState(route, params);
    }

    /**
     * Match a path
     * @param  {String} path     The path to match
     * @param  {String} [source] The source (optional, used internally)
     * @return {Object}          The matched state (null if unmatched)
     */
    function matchPath(path, source) {
        var trailingSlash = options.trailingSlash,
            strictQueryParams = options.strictQueryParams,
            strongMatching = options.strongMatching;

        var match = router.rootNode.matchPath(path, { trailingSlash: trailingSlash, strictQueryParams: strictQueryParams, strongMatching: strongMatching });

        if (match) {
            var name = match.name,
                params = match.params,
                _meta = match._meta;

            var builtPath = options.useTrailingSlash === undefined ? path : router.buildPath(name, params);

            return router.makeState(name, params, builtPath, _meta, source);
        }

        return null;
    }

    /**
     * Set the root node patch, use carefully. It can be used to set app-wide allowed query parameters.
     * @param {String} rootPath The root node path
     */
    function setRootPath(rootPath) {
        router.rootNode.setPath(rootPath);
    }
}
  })();
});

require.register("router5/create-router.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _routeNode = require('route-node');

var _routeNode2 = _interopRequireDefault(_routeNode);

var _utils = require('./core/utils');

var _utils2 = _interopRequireDefault(_utils);

var _routerLifecycle = require('./core/router-lifecycle');

var _routerLifecycle2 = _interopRequireDefault(_routerLifecycle);

var _navigation = require('./core/navigation');

var _navigation2 = _interopRequireDefault(_navigation);

var _middleware = require('./core/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _plugins = require('./core/plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _routeLifecycle = require('./core/route-lifecycle');

var _routeLifecycle2 = _interopRequireDefault(_routeLifecycle);

var _clone = require('./core/clone');

var _clone2 = _interopRequireDefault(_clone);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultOptions = {
    trailingSlash: 0,
    useTrailingSlash: undefined,
    autoCleanUp: true,
    strictQueryParams: true,
    allowNotFound: false,
    strongMatching: true
};

/**
 * Create a router
 * @param  {Array}  [routes]          The routes
 * @param  {Object} [options={}]      The router options
 * @param  {Object} [dependencies={}] The router dependencies
 * @return {Object}                   The router instance
 */
function createRouter(routes) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var routerState = null;
    var stateId = 0;
    var callbacks = {};
    var dependencies = deps;
    var options = _extends({}, defaultOptions);

    Object.keys(opts).forEach(function (opt) {
        return setOption(opt, opts[opt]);
    });

    var router = {
        rootNode: rootNode,
        getOptions: getOptions,
        setOption: setOption,
        getState: getState,
        setState: setState,
        makeState: makeState,
        makeNotFoundState: makeNotFoundState,
        setDependency: setDependency,
        setDependencies: setDependencies,
        getDependencies: getDependencies,
        add: add,
        addNode: addNode,
        executeFactory: executeFactory,
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        invokeEventListeners: invokeEventListeners
    };

    /**
     * Invoke all event listeners by event name. Possible event names are listed under constants
     * (`import { constants } from 'router5'`): `ROUTER_START`, `ROUTER_STOP`, `TRANSITION_START`,
     * `TRANSITION_CANCEL`, `TRANSITION_SUCCESS`, `TRANSITION_ERROR`.
     * This method is used internally and should not be invoked directly, but it can be useful for
     * testing purposes.
     * @private
     * @name invokeEventListeners
     * @param  {String}    eventName The event name
     */
    function invokeEventListeners(eventName) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        (callbacks[eventName] || []).forEach(function (cb) {
            return cb.apply(undefined, args);
        });
    }

    /**
     * Removes an event listener
     * @private
     * @param  {String}   eventName The event name
     * @param  {Function} cb        The callback to remove
     */
    function removeEventListener(eventName, cb) {
        callbacks[eventName] = callbacks[eventName].filter(function (_cb) {
            return _cb !== cb;
        });
    }

    /**
     * Add an event listener
     * @private
     * @param {String}   eventName The event name
     * @param {Function} cb        The callback to add
     */
    function addEventListener(eventName, cb) {
        callbacks[eventName] = (callbacks[eventName] || []).concat(cb);

        return function () {
            return removeEventListener(eventName, cb);
        };
    }

    (0, _utils2.default)(router);
    (0, _plugins2.default)(router);
    (0, _middleware2.default)(router);
    (0, _routeLifecycle2.default)(router);
    (0, _routerLifecycle2.default)(router);
    (0, _navigation2.default)(router);
    (0, _clone2.default)(router, createRouter);

    var rootNode = routes instanceof _routeNode2.default ? routes : new _routeNode2.default('', '', routes, addCanActivate);

    router.rootNode = rootNode;

    return router;

    function addCanActivate(route) {
        if (route.canActivate) router.canActivate(route.name, route.canActivate);
    }

    /**
     * Build a state object
     * @param  {String} name         The state name
     * @param  {Object} params       The state params
     * @param  {String} path         The state path
     * @param  {Object} [metaParams] Description of the state params
     * @param  {String} [source]     The source of the routing state
     * @return {Object}              The state object
     */
    function makeState(name, params, path, metaParams, source) {
        var state = {};
        var setProp = function setProp(key, value) {
            return Object.defineProperty(state, key, { value: value, enumerable: true });
        };
        setProp('name', name);
        setProp('params', params);
        setProp('path', path);

        if (metaParams || source) {
            stateId += 1;
            var meta = { params: metaParams, id: stateId };

            if (source) meta.source = source;

            setProp('meta', meta);
        }

        return state;
    }

    /**
     * Build a not found state for a given path
     * @param  {String} path The unmatched path
     * @return {Object}      The not found state object
     */
    function makeNotFoundState(path) {
        return makeState(_constants2.default.UNKNOWN_ROUTE, { path: path }, path, {});
    }

    /**
     * Get the current router state
     * @return {Object} The current state
     */
    function getState() {
        return routerState;
    }

    /**
     * Set the current router state
     * @param {Object} state The state object
     */
    function setState(state) {
        routerState = state;
    }

    /**
     * Get router options
     * @return {Object} The router options
     */
    function getOptions() {
        return options;
    }

    /**
     * Set an option
     * @param  {String} option The option name
     * @param  {*}      value  The option value
     * @return {Object}       The router instance
     */
    function setOption(option, value) {
        if (option === 'useTrailingSlash' && value !== undefined) {
            options.trailingSlash = true;
        }
        options[option] = value;
        return router;
    }

    /**
     * Set a router dependency
     * @param  {String} dependencyName The dependency name
     * @param  {*}      dependency     The dependency
     * @return {Object}                The router instance
     */
    function setDependency(dependencyName, dependency) {
        dependencies[dependencyName] = dependency;
        return router;
    }

    /**
     * Add dependencies
     * @param { Object} deps A object of dependencies (key-value pairs)
     * @return {Object}      The router instance
     */
    function setDependencies(deps) {
        Object.keys(deps).forEach(function (depName) {
            dependencies[depName] = deps[depName];
        });

        return router;
    }

    /**
     * Get dependencies
     * @return {Object} The dependencies
     */
    function getDependencies() {
        return dependencies;
    }

    function getInjectables() {
        return [router, getDependencies()];
    }

    function executeFactory(factoryFunction) {
        return factoryFunction.apply(undefined, _toConsumableArray(getInjectables()));
    }

    /**
     * Add routes
     * @param  {Array} routes A list of routes to add
     * @return {Object}       The router instance
     */
    function add(routes) {
        rootNode.add(routes, addCanActivate);
        return router;
    }

    /**
     * Add a single route (node)
     * @param {String} name                   The route name (full name)
     * @param {String} path                   The route path (from parent)
     * @param {Function} [canActivateHandler] The canActivate handler for this node
     */
    function addNode(name, path, canActivateHandler) {
        router.rootNode.addNode(name, path);
        if (canActivateHandler) router.canActivate(name, canActivateHandler);
        return router;
    }
}

exports.default = createRouter;
  })();
});

require.register("router5/index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.constants = exports.transitionPath = exports.errorCodes = exports.loggerPlugin = exports.RouteNode = exports.createRouter = undefined;

var _createRouter = require('./create-router');

var _createRouter2 = _interopRequireDefault(_createRouter);

var _routeNode = require('route-node');

var _routeNode2 = _interopRequireDefault(_routeNode);

var _logger = require('./plugins/logger');

var _logger2 = _interopRequireDefault(_logger);

var _router = require('router5.transition-path');

var _router2 = _interopRequireDefault(_router);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _createRouter2.default;
exports.createRouter = _createRouter2.default;
exports.RouteNode = _routeNode2.default;
exports.loggerPlugin = _logger2.default;
exports.errorCodes = _constants.errorCodes;
exports.transitionPath = _router2.default;
exports.constants = _constants2.default;
  })();
});

require.register("router5/plugins/browser/browser.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Dumb functions
 */
// istanbul ignore next
var identity = function identity(arg) {
    return function () {
        return arg;
    };
};
// istanbul ignore next
var noop = function noop() {};

/**
 * Browser detection
 */
var isBrowser = typeof window !== 'undefined' && window.history;

/**
 * Browser functions needed by router5
 */
var getBase = function getBase() {
    return window.location.pathname.replace(/\/$/, '');
};

var pushState = function pushState(state, title, path) {
    return window.history.pushState(state, title, path);
};

var replaceState = function replaceState(state, title, path) {
    return window.history.replaceState(state, title, path);
};

var addPopstateListener = function addPopstateListener(fn) {
    return window.addEventListener('popstate', fn);
};

var removePopstateListener = function removePopstateListener(fn) {
    return window.removeEventListener('popstate', fn);
};

var getLocation = function getLocation(opts) {
    var path = opts.useHash ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '') : window.location.pathname.replace(new RegExp('^' + opts.base), '');
    return (path || '/') + window.location.search;
};

var getState = function getState() {
    return window.history.state;
};

/**
 * Export browser object
 */
var browser = {};
if (isBrowser) {
    browser = { getBase: getBase, pushState: pushState, replaceState: replaceState, addPopstateListener: addPopstateListener, removePopstateListener: removePopstateListener, getLocation: getLocation, getState: getState };
} else {
    // istanbul ignore next
    browser = {
        getBase: identity(''),
        pushState: noop,
        replaceState: noop,
        addPopstateListener: noop,
        removePopstateListener: noop,
        getLocation: identity(''),
        getState: identity(null)
    };
}

exports.default = browser;
  })();
});

require.register("router5/plugins/browser/index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('../../constants');

var _constants2 = _interopRequireDefault(_constants);

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
    forceDeactivate: true,
    useHash: false,
    hashPrefix: '',
    base: false
};

var source = 'popstate';

function browserPluginFactory() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var browser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _browser2.default;

    var options = _extends({}, defaultOptions, opts);
    var transitionOptions = { forceDeactivate: options.forceDeactivate, source: source };

    function browserPlugin(router) {
        var routerOptions = router.getOptions();
        var routerStart = router.start;

        (0, _utils2.default)(router, options);

        router.start = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (args.length === 0 || typeof args[0] === 'function') {
                routerStart.apply(undefined, [browser.getLocation(options)].concat(args));
            } else {
                routerStart.apply(undefined, args);
            }

            return router;
        };

        router.replaceHistoryState = function (name) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var state = router.buildState(name, params);
            var url = router.buildUrl(name, params);
            router.lastKnownState = state;
            browser.replaceState(state, '', url);
        };

        function updateBrowserState(state, url, replace) {
            if (replace) browser.replaceState(state, '', url);else browser.pushState(state, '', url);
        }

        function onPopState(evt) {
            var routerState = router.getState();
            // Do nothing if no state or if last know state is poped state (it should never happen)
            var newState = !evt.state || !evt.state.name;
            var state = newState ? router.matchPath(browser.getLocation(options), source) : evt.state;
            var defaultRoute = routerOptions.defaultRoute,
                defaultParams = routerOptions.defaultParams;


            if (!state) {
                // If current state is already the default route, we will have a double entry
                // Navigating back and forth will emit SAME_STATES error
                defaultRoute && router.navigateToDefault(_extends({}, transitionOptions, { reload: true, replace: true }));
                return;
            }
            if (routerState && router.areStatesEqual(state, routerState, false)) {
                return;
            }

            router.transitionToState(state, routerState, transitionOptions, function (err, toState) {
                if (err) {
                    if (err.redirect) {
                        var _err$redirect = err.redirect,
                            name = _err$redirect.name,
                            params = _err$redirect.params;


                        router.navigate(name, params, _extends({}, transitionOptions, { replace: true }));
                    } else if (err === _constants.errorCodes.CANNOT_DEACTIVATE) {
                        var url = router.buildUrl(routerState.name, routerState.params);
                        if (!newState) {
                            // Keep history state unchanged but use current URL
                            updateBrowserState(state, url, true);
                        }
                        // else do nothing or history will be messed up
                        // TODO: history.back()?
                    } else {
                        // Force navigation to default state
                        defaultRoute && router.navigate(defaultRoute, defaultParams, _extends({}, transitionOptions, { reload: true, replace: true }));
                    }
                } else {
                    router.invokeEventListeners(_constants2.default.TRANSITION_SUCCESS, toState, routerState, { replace: true });
                }
            });
        }

        function onStart() {
            if (options.useHash && !options.base) {
                // Guess base
                options.base = browser.getBase();
            }

            browser.addPopstateListener(onPopState);
        }

        function onStop() {
            browser.removePopstateListener(onPopState);
        }

        function onTransitionSuccess(toState, fromState, opts) {
            var historyState = browser.getState();
            var replace = opts.replace || fromState && router.areStatesEqual(toState, fromState, false) || opts.reload && historyState && router.areStatesEqual(toState, historyState, false);
            updateBrowserState(toState, router.buildUrl(toState.name, toState.params), replace);
        }

        return { onStart: onStart, onStop: onStop, onTransitionSuccess: onTransitionSuccess, onPopState: onPopState };
    };

    browserPlugin.pluginName = 'BROWSER_PLUGIN';

    return browserPlugin;
}

exports.default = browserPluginFactory;
  })();
});

require.register("router5/plugins/browser/utils.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = withUtils;
function withUtils(router, options) {
    router.urlToPath = urlToPath;
    router.buildUrl = buildUrl;
    router.matchUrl = matchUrl;

    function buildUrl(route, params) {
        var base = options.base || '';
        var prefix = options.useHash ? '#' + options.hashPrefix : '';
        var path = router.buildPath(route, params);

        return base + prefix + path;
    }

    function urlToPath(url) {
        var match = url.match(/^(?:http|https)\:\/\/(?:[0-9a-z_\-\.\:]+?)(?=\/)(.*)$/);
        var path = match ? match[1] : url;

        var pathParts = path.match(/^(.+?)(#.+?)?(\?.+)?$/);

        if (!pathParts) throw new Error('[router5] Could not parse url ' + url);

        var pathname = pathParts[1];
        var hash = pathParts[2] || '';
        var search = pathParts[3] || '';

        return (options.useHash ? hash.replace(new RegExp('^#' + options.hashPrefix), '') : options.base ? pathname.replace(new RegExp('^' + options.base), '') : pathname) + search;
    }

    function matchUrl(url) {
        return router.matchPath(urlToPath(url));
    }
}
  })();
});

require.register("router5/plugins/listeners/index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _router = require('router5.transition-path');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
    autoCleanUp: true
};

function listenersPluginFactory() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOptions;

    function listenersPlugin(router) {
        var listeners = {};

        function removeListener(name, cb) {
            if (cb) {
                if (listeners[name]) listeners[name] = listeners[name].filter(function (callback) {
                    return callback !== cb;
                });
            } else {
                listeners[name] = [];
            }
            return router;
        };

        function addListener(name, cb, replace) {
            var normalizedName = name.replace(/^(\*|\^|=)/, '');

            if (normalizedName && !/^\$/.test(name)) {
                var segments = router.rootNode.getSegmentsByName(normalizedName);
                if (!segments) console.warn('No route found for ' + normalizedName + ', listener might never be called!');
            }

            if (!listeners[name]) listeners[name] = [];
            listeners[name] = (replace ? [] : listeners[name]).concat(cb);

            return router;
        };

        router.getListeners = function () {
            return listeners;
        };

        router.addListener = function (cb) {
            return addListener('*', cb);
        };
        router.removeListener = function (cb) {
            return removeListener('*', cb);
        };

        router.addNodeListener = function (name, cb) {
            return addListener('^' + name, cb, true);
        };
        router.removeNodeListener = function (name, cb) {
            return removeListener('^' + name, cb);
        };

        router.addRouteListener = function (name, cb) {
            return addListener('=' + name, cb);
        };
        router.removeRouteListener = function (name, cb) {
            return removeListener('=' + name, cb);
        };

        function invokeListeners(name, toState, fromState) {
            (listeners[name] || []).forEach(function (cb) {
                if (listeners[name].indexOf(cb) !== -1) {
                    cb(toState, fromState);
                }
            });
        }

        function onTransitionSuccess(toState, fromState, opts) {
            var _transitionPath = (0, _router2.default)(toState, fromState),
                intersection = _transitionPath.intersection,
                toDeactivate = _transitionPath.toDeactivate;

            var intersectionNode = opts.reload ? '' : intersection;
            var name = toState.name;


            if (options.autoCleanUp) {
                toDeactivate.forEach(function (name) {
                    return removeListener('^' + name);
                });
            }

            invokeListeners('^' + intersectionNode, toState, fromState);
            invokeListeners('=' + name, toState, fromState);
            invokeListeners('*', toState, fromState);
        }

        return { onTransitionSuccess: onTransitionSuccess };
    };

    listenersPlugin.pluginName = 'LISTENERS_PLUGIN';

    return listenersPlugin;
}

exports.default = listenersPluginFactory;
  })();
});

require.register("router5/plugins/logger/index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* istanbul ignore next */
/*eslint no-console: 0*/

function loggerPlugin() {
    var startGroup = function startGroup() {
        return console.group('Router transition');
    };
    var endGroup = function endGroup() {
        return console.groupEnd('Router transition');
    };

    console.info('Router started');

    return {
        onStop: function onStop() {
            console.info('Router stopped');
        },
        onTransitionStart: function onTransitionStart(toState, fromState) {
            endGroup();
            startGroup();
            console.log('Transition started from state');
            console.log(fromState);
            console.log('To state');
            console.log(toState);
        },
        onTransitionCancel: function onTransitionCancel() {
            console.warn('Transition cancelled');
        },
        onTransitionError: function onTransitionError(toState, fromState, err) {
            console.warn('Transition error with code ' + err.code);
            endGroup();
        },
        onTransitionSuccess: function onTransitionSuccess() {
            console.log('Transition success');
            endGroup();
        }
    };
};

loggerPlugin.pluginName = 'LOGGER_PLUGIN';

exports.default = loggerPlugin;
  })();
});

require.register("router5/transition/index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _router = require('router5.transition-path');

var _router2 = _interopRequireDefault(_router);

var _resolve = require('./resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = transition;


function transition(router, toState, fromState, opts, callback) {
    var cancelled = false;
    var completed = false;
    var options = router.getOptions();

    var _router$getLifecycleF = router.getLifecycleFunctions(),
        _router$getLifecycleF2 = _slicedToArray(_router$getLifecycleF, 2),
        canDeactivateFunctions = _router$getLifecycleF2[0],
        canActivateFunctions = _router$getLifecycleF2[1];

    var middlewareFunctions = router.getMiddlewareFunctions();
    var isCancelled = function isCancelled() {
        return cancelled;
    };
    var cancel = function cancel() {
        if (!cancelled && !completed) {
            cancelled = true;
            callback({ code: _constants.errorCodes.TRANSITION_CANCELLED }, null);
        }
    };
    var done = function done(err, state) {
        completed = true;

        if (isCancelled()) {
            return;
        }

        if (!err && options.autoCleanUp) {
            var activeSegments = (0, _router.nameToIDs)(toState.name);
            Object.keys(canDeactivateFunctions).forEach(function (name) {
                if (activeSegments.indexOf(name) === -1) router.clearCanDeactivate(name);
            });
        }

        callback(err, state || toState);
    };
    var makeError = function makeError(base, err) {
        return _extends({}, base, err instanceof Object ? err : { error: err });
    };

    var _transitionPath = (0, _router2.default)(toState, fromState),
        toDeactivate = _transitionPath.toDeactivate,
        toActivate = _transitionPath.toActivate;

    var asyncBase = { isCancelled: isCancelled, toState: toState, fromState: fromState };

    var canDeactivate = function canDeactivate(toState, fromState, cb) {
        var canDeactivateFunctionMap = toDeactivate.filter(function (name) {
            return canDeactivateFunctions[name];
        }).reduce(function (fnMap, name) {
            return _extends({}, fnMap, _defineProperty({}, name, canDeactivateFunctions[name]));
        }, {});

        (0, _resolve2.default)(canDeactivateFunctionMap, _extends({}, asyncBase, { errorKey: 'segment' }), function (err) {
            return cb(err ? makeError({ code: _constants.errorCodes.CANNOT_DEACTIVATE }, err) : null);
        });
    };

    var canActivate = function canActivate(toState, fromState, cb) {
        var canActivateFunctionMap = toActivate.filter(function (name) {
            return canActivateFunctions[name];
        }).reduce(function (fnMap, name) {
            return _extends({}, fnMap, _defineProperty({}, name, canActivateFunctions[name]));
        }, {});

        (0, _resolve2.default)(canActivateFunctionMap, _extends({}, asyncBase, { errorKey: 'segment' }), function (err) {
            return cb(err ? makeError({ code: _constants.errorCodes.CANNOT_ACTIVATE }, err) : null);
        });
    };

    var middleware = !middlewareFunctions.length ? [] : function (toState, fromState, cb) {
        return (0, _resolve2.default)(middlewareFunctions, _extends({}, asyncBase), function (err, state) {
            return cb(err ? makeError({ code: _constants.errorCodes.TRANSITION_ERR }, err) : null, state || toState);
        });
    };

    var pipeline = (fromState && !opts.forceDeactivate ? [canDeactivate] : []).concat(canActivate).concat(middleware);

    (0, _resolve2.default)(pipeline, asyncBase, done);

    return cancel;
}
  })();
});

require.register("router5/transition/resolve.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "router5");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = resolve;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function resolve(functions, _ref, callback) {
    var isCancelled = _ref.isCancelled,
        toState = _ref.toState,
        fromState = _ref.fromState,
        errorKey = _ref.errorKey;

    var remainingFunctions = Array.isArray(functions) ? functions : Object.keys(functions);

    var isState = function isState(obj) {
        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.name !== undefined && obj.params !== undefined && obj.path !== undefined;
    };
    var hasStateChanged = function hasStateChanged(state) {
        return state.name !== toState.name || state.params !== toState.params || state.path !== toState.path;
    };

    var processFn = function processFn(done) {
        if (!remainingFunctions.length) return true;

        var isMapped = typeof remainingFunctions[0] === 'string';
        var errBase = errorKey && isMapped ? _defineProperty({}, errorKey, remainingFunctions[0]) : {};
        var stepFn = isMapped ? functions[remainingFunctions[0]] : remainingFunctions[0];

        // const len = stepFn.length;
        var res = stepFn.call(null, toState, fromState, done);
        if (isCancelled()) {
            done(null);
        } else if (typeof res === 'boolean') {
            done(res ? null : errBase);
        } else if (res && typeof res.then === 'function') {
            res.then(function (resVal) {
                if (resVal instanceof Error) done({ error: resVal }, null);else done(null, resVal);
            }, function (err) {
                if (err instanceof Error) {
                    console.error(err.stack || err);
                    done(_extends({}, errBase, { promiseError: err }), null);
                } else {
                    done((typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object' ? _extends({}, errBase, err) : errBase, null);
                }
            });
        }
        // else: wait for done to be called

        return false;
    };

    var iterate = function iterate(err, val) {
        if (isCancelled()) {
            callback();
        } else if (err) {
            callback(err);
        } else {
            if (val && isState(val)) {
                if (hasStateChanged(val)) console.error('[router5][transition] Warning: state values changed during transition process.');
                toState = val;
            }
            remainingFunctions = remainingFunctions.slice(1);
            next();
        }
    };

    var next = function next() {
        if (isCancelled()) {
            callback();
        } else {
            var finished = processFn(iterate);
            if (finished) callback(null, toState);
        }
    };

    next();
}
  })();
});

require.register("rxjs/BehaviorSubject.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('./Subject');
var ObjectUnsubscribedError_1 = require('./util/ObjectUnsubscribedError');
/**
 * @class BehaviorSubject<T>
 */
var BehaviorSubject = (function (_super) {
    __extends(BehaviorSubject, _super);
    function BehaviorSubject(_value) {
        _super.call(this);
        this._value = _value;
    }
    Object.defineProperty(BehaviorSubject.prototype, "value", {
        get: function () {
            return this.getValue();
        },
        enumerable: true,
        configurable: true
    });
    BehaviorSubject.prototype._subscribe = function (subscriber) {
        var subscription = _super.prototype._subscribe.call(this, subscriber);
        if (subscription && !subscription.closed) {
            subscriber.next(this._value);
        }
        return subscription;
    };
    BehaviorSubject.prototype.getValue = function () {
        if (this.hasError) {
            throw this.thrownError;
        }
        else if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else {
            return this._value;
        }
    };
    BehaviorSubject.prototype.next = function (value) {
        _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject;
}(Subject_1.Subject));
exports.BehaviorSubject = BehaviorSubject;
//# sourceMappingURL=BehaviorSubject.js.map
  })();
});

require.register("rxjs/InnerSubscriber.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('./Subscriber');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerSubscriber = (function (_super) {
    __extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        _super.call(this);
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber_1.Subscriber));
exports.InnerSubscriber = InnerSubscriber;
//# sourceMappingURL=InnerSubscriber.js.map
  })();
});

require.register("rxjs/Observable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var root_1 = require('./util/root');
var toSubscriber_1 = require('./util/toSubscriber');
var observable_1 = require('./symbol/observable');
/**
 * A representation of any set of values over any amount of time. This the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = (function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is  called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this._trySubscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
            sink.error(err);
        }
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var subscription = _this.subscribe(function (value) {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                }
                else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable_1.$$observable] = function () {
        return this;
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
exports.Observable = Observable;
//# sourceMappingURL=Observable.js.map
  })();
});

require.register("rxjs/Observer.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
exports.empty = {
    closed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};
//# sourceMappingURL=Observer.js.map
  })();
});

require.register("rxjs/OuterSubscriber.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('./Subscriber');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var OuterSubscriber = (function (_super) {
    __extends(OuterSubscriber, _super);
    function OuterSubscriber() {
        _super.apply(this, arguments);
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(Subscriber_1.Subscriber));
exports.OuterSubscriber = OuterSubscriber;
//# sourceMappingURL=OuterSubscriber.js.map
  })();
});

require.register("rxjs/Subject.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('./Observable');
var Subscriber_1 = require('./Subscriber');
var Subscription_1 = require('./Subscription');
var ObjectUnsubscribedError_1 = require('./util/ObjectUnsubscribedError');
var SubjectSubscription_1 = require('./SubjectSubscription');
var rxSubscriber_1 = require('./symbol/rxSubscriber');
/**
 * @class SubjectSubscriber<T>
 */
var SubjectSubscriber = (function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        _super.call(this, destination);
        this.destination = destination;
    }
    return SubjectSubscriber;
}(Subscriber_1.Subscriber));
exports.SubjectSubscriber = SubjectSubscriber;
/**
 * @class Subject<T>
 */
var Subject = (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        _super.call(this);
        this.observers = [];
        this.closed = false;
        this.isStopped = false;
        this.hasError = false;
        this.thrownError = null;
    }
    Subject.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription_1.Subscription.EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return Subscription_1.Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable_1.Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable_1.Observable));
exports.Subject = Subject;
/**
 * @class AnonymousSubject<T>
 */
var AnonymousSubject = (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        _super.call(this);
        this.destination = destination;
        this.source = source;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription_1.Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject));
exports.AnonymousSubject = AnonymousSubject;
//# sourceMappingURL=Subject.js.map
  })();
});

require.register("rxjs/SubjectSubscription.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1 = require('./Subscription');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubjectSubscription = (function (_super) {
    __extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        _super.call(this);
        this.subject = subject;
        this.subscriber = subscriber;
        this.closed = false;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription_1.Subscription));
exports.SubjectSubscription = SubjectSubscription;
//# sourceMappingURL=SubjectSubscription.js.map
  })();
});

require.register("rxjs/Subscriber.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isFunction_1 = require('./util/isFunction');
var Subscription_1 = require('./Subscription');
var Observer_1 = require('./Observer');
var rxSubscriber_1 = require('./symbol/rxSubscriber');
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = Observer_1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = Observer_1.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.destination = destinationOrNext;
                        this.destination.add(this);
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.prototype[rxSubscriber_1.$$rxSubscriber] = function () { return this; };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
exports.Subscriber = Subscriber;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        _super.call(this);
        this._parentSubscriber = _parentSubscriber;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            context = observerOrNext;
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (isFunction_1.isFunction(context.unsubscribe)) {
                this.add(context.unsubscribe.bind(context));
            }
            context.unsubscribe = this.unsubscribe.bind(this);
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._complete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._complete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
//# sourceMappingURL=Subscriber.js.map
  })();
});

require.register("rxjs/Subscription.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var isArray_1 = require('./util/isArray');
var isObject_1 = require('./util/isObject');
var isFunction_1 = require('./util/isFunction');
var tryCatch_1 = require('./util/tryCatch');
var errorObject_1 = require('./util/errorObject');
var UnsubscriptionError_1 = require('./util/UnsubscriptionError');
/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription = (function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}
//# sourceMappingURL=Subscription.js.map
  })();
});

require.register("rxjs/add/operator/do.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var Observable_1 = require('../../Observable');
var do_1 = require('../../operator/do');
Observable_1.Observable.prototype.do = do_1._do;
Observable_1.Observable.prototype._do = do_1._do;
//# sourceMappingURL=do.js.map
  })();
});

require.register("rxjs/add/operator/map.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var Observable_1 = require('../../Observable');
var map_1 = require('../../operator/map');
Observable_1.Observable.prototype.map = map_1.map;
//# sourceMappingURL=map.js.map
  })();
});

require.register("rxjs/add/operator/publishBehavior.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var Observable_1 = require('../../Observable');
var publishBehavior_1 = require('../../operator/publishBehavior');
Observable_1.Observable.prototype.publishBehavior = publishBehavior_1.publishBehavior;
//# sourceMappingURL=publishBehavior.js.map
  })();
});

require.register("rxjs/add/operator/scan.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var Observable_1 = require('../../Observable');
var scan_1 = require('../../operator/scan');
Observable_1.Observable.prototype.scan = scan_1.scan;
//# sourceMappingURL=scan.js.map
  })();
});

require.register("rxjs/add/operator/startWith.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var Observable_1 = require('../../Observable');
var startWith_1 = require('../../operator/startWith');
Observable_1.Observable.prototype.startWith = startWith_1.startWith;
//# sourceMappingURL=startWith.js.map
  })();
});

require.register("rxjs/add/operator/switchMap.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var Observable_1 = require('../../Observable');
var switchMap_1 = require('../../operator/switchMap');
Observable_1.Observable.prototype.switchMap = switchMap_1.switchMap;
//# sourceMappingURL=switchMap.js.map
  })();
});

require.register("rxjs/observable/ArrayObservable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
var ScalarObservable_1 = require('./ScalarObservable');
var EmptyObservable_1 = require('./EmptyObservable');
var isScheduler_1 = require('../util/isScheduler');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ArrayObservable = (function (_super) {
    __extends(ArrayObservable, _super);
    function ArrayObservable(array, scheduler) {
        _super.call(this);
        this.array = array;
        this.scheduler = scheduler;
        if (!scheduler && array.length === 1) {
            this._isScalar = true;
            this.value = array[0];
        }
    }
    ArrayObservable.create = function (array, scheduler) {
        return new ArrayObservable(array, scheduler);
    };
    /**
     * Creates an Observable that emits some values you specify as arguments,
     * immediately one after the other, and then emits a complete notification.
     *
     * <span class="informal">Emits the arguments you provide, then completes.
     * </span>
     *
     * <img src="./img/of.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the arguments given, and the complete notification thereafter. It can
     * be used for composing with other Observables, such as with {@link concat}.
     * By default, it uses a `null` IScheduler, which means the `next`
     * notifications are sent synchronously, although with a different IScheduler
     * it is possible to determine when those notifications will be delivered.
     *
     * @example <caption>Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.</caption>
     * var numbers = Rx.Observable.of(10, 20, 30);
     * var letters = Rx.Observable.of('a', 'b', 'c');
     * var interval = Rx.Observable.interval(1000);
     * var result = numbers.concat(letters).concat(interval);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link never}
     * @see {@link throw}
     *
     * @param {...T} values Arguments that represent `next` values to be emitted.
     * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
     * the emissions of the `next` notifications.
     * @return {Observable<T>} An Observable that emits each given input value.
     * @static true
     * @name of
     * @owner Observable
     */
    ArrayObservable.of = function () {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i - 0] = arguments[_i];
        }
        var scheduler = array[array.length - 1];
        if (isScheduler_1.isScheduler(scheduler)) {
            array.pop();
        }
        else {
            scheduler = null;
        }
        var len = array.length;
        if (len > 1) {
            return new ArrayObservable(array, scheduler);
        }
        else if (len === 1) {
            return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
        }
        else {
            return new EmptyObservable_1.EmptyObservable(scheduler);
        }
    };
    ArrayObservable.dispatch = function (state) {
        var array = state.array, index = state.index, count = state.count, subscriber = state.subscriber;
        if (index >= count) {
            subscriber.complete();
            return;
        }
        subscriber.next(array[index]);
        if (subscriber.closed) {
            return;
        }
        state.index = index + 1;
        this.schedule(state);
    };
    ArrayObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var array = this.array;
        var count = array.length;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ArrayObservable.dispatch, 0, {
                array: array, index: index, count: count, subscriber: subscriber
            });
        }
        else {
            for (var i = 0; i < count && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        }
    };
    return ArrayObservable;
}(Observable_1.Observable));
exports.ArrayObservable = ArrayObservable;
//# sourceMappingURL=ArrayObservable.js.map
  })();
});

require.register("rxjs/observable/ConnectableObservable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require('../Subject');
var Observable_1 = require('../Observable');
var Subscriber_1 = require('../Subscriber');
var Subscription_1 = require('../Subscription');
/**
 * @class ConnectableObservable<T>
 */
var ConnectableObservable = (function (_super) {
    __extends(ConnectableObservable, _super);
    function ConnectableObservable(source, subjectFactory) {
        _super.call(this);
        this.source = source;
        this.subjectFactory = subjectFactory;
        this._refCount = 0;
    }
    ConnectableObservable.prototype._subscribe = function (subscriber) {
        return this.getSubject().subscribe(subscriber);
    };
    ConnectableObservable.prototype.getSubject = function () {
        var subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    };
    ConnectableObservable.prototype.connect = function () {
        var connection = this._connection;
        if (!connection) {
            connection = this._connection = new Subscription_1.Subscription();
            connection.add(this.source
                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = Subscription_1.Subscription.EMPTY;
            }
            else {
                this._connection = connection;
            }
        }
        return connection;
    };
    ConnectableObservable.prototype.refCount = function () {
        return this.lift(new RefCountOperator(this));
    };
    return ConnectableObservable;
}(Observable_1.Observable));
exports.ConnectableObservable = ConnectableObservable;
exports.connectableObservableDescriptor = {
    operator: { value: null },
    _refCount: { value: 0, writable: true },
    _subscribe: { value: ConnectableObservable.prototype._subscribe },
    getSubject: { value: ConnectableObservable.prototype.getSubject },
    connect: { value: ConnectableObservable.prototype.connect },
    refCount: { value: ConnectableObservable.prototype.refCount }
};
var ConnectableSubscriber = (function (_super) {
    __extends(ConnectableSubscriber, _super);
    function ConnectableSubscriber(destination, connectable) {
        _super.call(this, destination);
        this.connectable = connectable;
    }
    ConnectableSubscriber.prototype._error = function (err) {
        this._unsubscribe();
        _super.prototype._error.call(this, err);
    };
    ConnectableSubscriber.prototype._complete = function () {
        this._unsubscribe();
        _super.prototype._complete.call(this);
    };
    ConnectableSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (connectable) {
            this.connectable = null;
            var connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    };
    return ConnectableSubscriber;
}(Subject_1.SubjectSubscriber));
var RefCountOperator = (function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}());
var RefCountSubscriber = (function (_super) {
    __extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        _super.call(this, destination);
        this.connectable = connectable;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        ///
        // Compare the local RefCountSubscriber's connection Subscription to the
        // connection Subscription on the shared ConnectableObservable. In cases
        // where the ConnectableObservable source synchronously emits values, and
        // the RefCountSubscriber's downstream Observers synchronously unsubscribe,
        // execution continues to here before the RefCountOperator has a chance to
        // supply the RefCountSubscriber with the shared connection Subscription.
        // For example:
        // ```
        // Observable.range(0, 10)
        //   .publish()
        //   .refCount()
        //   .take(5)
        //   .subscribe();
        // ```
        // In order to account for this case, RefCountSubscriber should only dispose
        // the ConnectableObservable's shared connection Subscription if the
        // connection Subscription exists, *and* either:
        //   a. RefCountSubscriber doesn't have a reference to the shared connection
        //      Subscription yet, or,
        //   b. RefCountSubscriber's connection Subscription reference is identical
        //      to the shared connection Subscription
        ///
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=ConnectableObservable.js.map
  })();
});

require.register("rxjs/observable/EmptyObservable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var EmptyObservable = (function (_super) {
    __extends(EmptyObservable, _super);
    function EmptyObservable(scheduler) {
        _super.call(this);
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable that emits no items to the Observer and immediately
     * emits a complete notification.
     *
     * <span class="informal">Just emits 'complete', and nothing else.
     * </span>
     *
     * <img src="./img/empty.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the complete notification. It can be used for composing with other
     * Observables, such as in a {@link mergeMap}.
     *
     * @example <caption>Emit the number 7, then complete.</caption>
     * var result = Rx.Observable.empty().startWith(7);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
     * var interval = Rx.Observable.interval(1000);
     * var result = interval.mergeMap(x =>
     *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
     * );
     * result.subscribe(x => console.log(x));
     *
     * // Results in the following to the console:
     * // x is equal to the count on the interval eg(0,1,2,3,...)
     * // x will occur every 1000ms
     * // if x % 2 is equal to 1 print abc
     * // if x % 2 is not equal to 1 nothing will be output
     *
     * @see {@link create}
     * @see {@link never}
     * @see {@link of}
     * @see {@link throw}
     *
     * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
     * the emission of the complete notification.
     * @return {Observable} An "empty" Observable: emits only the complete
     * notification.
     * @static true
     * @name empty
     * @owner Observable
     */
    EmptyObservable.create = function (scheduler) {
        return new EmptyObservable(scheduler);
    };
    EmptyObservable.dispatch = function (arg) {
        var subscriber = arg.subscriber;
        subscriber.complete();
    };
    EmptyObservable.prototype._subscribe = function (subscriber) {
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
        }
        else {
            subscriber.complete();
        }
    };
    return EmptyObservable;
}(Observable_1.Observable));
exports.EmptyObservable = EmptyObservable;
//# sourceMappingURL=EmptyObservable.js.map
  })();
});

require.register("rxjs/observable/ScalarObservable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('../Observable');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ScalarObservable = (function (_super) {
    __extends(ScalarObservable, _super);
    function ScalarObservable(value, scheduler) {
        _super.call(this);
        this.value = value;
        this.scheduler = scheduler;
        this._isScalar = true;
        if (scheduler) {
            this._isScalar = false;
        }
    }
    ScalarObservable.create = function (value, scheduler) {
        return new ScalarObservable(value, scheduler);
    };
    ScalarObservable.dispatch = function (state) {
        var done = state.done, value = state.value, subscriber = state.subscriber;
        if (done) {
            subscriber.complete();
            return;
        }
        subscriber.next(value);
        if (subscriber.closed) {
            return;
        }
        state.done = true;
        this.schedule(state);
    };
    ScalarObservable.prototype._subscribe = function (subscriber) {
        var value = this.value;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ScalarObservable.dispatch, 0, {
                done: false, value: value, subscriber: subscriber
            });
        }
        else {
            subscriber.next(value);
            if (!subscriber.closed) {
                subscriber.complete();
            }
        }
    };
    return ScalarObservable;
}(Observable_1.Observable));
exports.ScalarObservable = ScalarObservable;
//# sourceMappingURL=ScalarObservable.js.map
  })();
});

require.register("rxjs/operator/concat.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var Observable_1 = require('../Observable');
var isScheduler_1 = require('../util/isScheduler');
var ArrayObservable_1 = require('../observable/ArrayObservable');
var mergeAll_1 = require('./mergeAll');
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which sequentially emits all values from every
 * given input Observable after the current Observable.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * Joins this Observable with multiple other Observables by subscribing to them
 * one at a time, starting with the source, and merging their results into the
 * output Observable. Will wait for each Observable to complete before moving
 * on to the next.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = timer.concat(sequence);
 * result.subscribe(x => console.log(x));
 *
 * // results in:
 * // 1000ms-> 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3 -immediate-> 1 ... 10
 *
 * @example <caption>Concatenate 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = timer1.concat(timer2, timer3);
 * result.subscribe(x => console.log(x));
 *
 * // results in the following:
 * // (Prints to console sequentially)
 * // -1000ms-> 0 -1000ms-> 1 -1000ms-> ... 9
 * // -2000ms-> 0 -2000ms-> 1 -2000ms-> ... 5
 * // -500ms-> 0 -500ms-> 1 -500ms-> ... 9
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {ObservableInput} other An input Observable to concatenate after the source
 * Observable. More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional IScheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @method concat
 * @owner Observable
 */
function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    return this.lift.call(concatStatic.apply(void 0, [this].concat(observables)));
}
exports.concat = concat;
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which sequentially emits all values from given
 * Observable and then moves on to the next.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * <img src="./img/concat.png" width="100%">
 *
 * `concat` joins multiple Observables together, by subscribing to them one at a time and
 * merging their results into the output Observable. You can pass either an array of
 * Observables, or put them directly as arguments. Passing an empty array will result
 * in Observable that completes immediately.
 *
 * `concat` will subscribe to first input Observable and emit all its values, without
 * changing or affecting them in any way. When that Observable completes, it will
 * subscribe to then next Observable passed and, again, emit its values. This will be
 * repeated, until the operator runs out of Observables. When last input Observable completes,
 * `concat` will complete as well. At any given moment only one Observable passed to operator
 * emits values. If you would like to emit values from passed Observables concurrently, check out
 * {@link merge} instead, especially with optional `concurrent` parameter. As a matter of fact,
 * `concat` is an equivalent of `merge` operator with `concurrent` parameter set to `1`.
 *
 * Note that if some input Observable never completes, `concat` will also never complete
 * and Observables following the one that did not complete will never be subscribed. On the other
 * hand, if some Observable simply completes immediately after it is subscribed, it will be
 * invisible for `concat`, which will just move on to the next Observable.
 *
 * If any Observable in chain errors, instead of passing control to the next Observable,
 * `concat` will error immediately as well. Observables that would be subscribed after
 * the one that emitted error, never will.
 *
 * If you pass to `concat` the same Observable many times, its stream of values
 * will be "replayed" on every subscription, which means you can repeat given Observable
 * as many times as you like. If passing the same Observable to `concat` 1000 times becomes tedious,
 * you can always use {@link repeat}.
 *
 * @example <caption>Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10</caption>
 * var timer = Rx.Observable.interval(1000).take(4);
 * var sequence = Rx.Observable.range(1, 10);
 * var result = Rx.Observable.concat(timer, sequence);
 * result.subscribe(x => console.log(x));
 *
 * // results in:
 * // 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3 -immediate-> 1 ... 10
 *
 *
 * @example <caption>Concatenate an array of 3 Observables</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var result = Rx.Observable.concat([timer1, timer2, timer3]); // note that array is passed
 * result.subscribe(x => console.log(x));
 *
 * // results in the following:
 * // (Prints to console sequentially)
 * // -1000ms-> 0 -1000ms-> 1 -1000ms-> ... 9
 * // -2000ms-> 0 -2000ms-> 1 -2000ms-> ... 5
 * // -500ms-> 0 -500ms-> 1 -500ms-> ... 9
 *
 *
 * @example <caption>Concatenate the same Observable to repeat it</caption>
 * const timer = Rx.Observable.interval(1000).take(2);
 *
 * Rx.Observable.concat(timer, timer) // concating the same Observable!
 * .subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('...and it is done!')
 * );
 *
 * // Logs:
 * // 0 after 1s
 * // 1 after 2s
 * // 0 after 3s
 * // 1 after 4s
 * // "...and it is done!" also after 4s
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {ObservableInput} input1 An input Observable to concatenate with others.
 * @param {ObservableInput} input2 An input Observable to concatenate with others.
 * More than one input Observables may be given as argument.
 * @param {Scheduler} [scheduler=null] An optional IScheduler to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @static true
 * @name concat
 * @owner Observable
 */
function concatStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var scheduler = null;
    var args = observables;
    if (isScheduler_1.isScheduler(args[observables.length - 1])) {
        scheduler = args.pop();
    }
    if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable_1.Observable) {
        return observables[0];
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(1));
}
exports.concatStatic = concatStatic;
//# sourceMappingURL=concat.js.map
  })();
});

require.register("rxjs/operator/do.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/* tslint:enable:max-line-length */
/**
 * Perform a side effect for every emission on the source Observable, but return
 * an Observable that is identical to the source.
 *
 * <span class="informal">Intercepts each emission on the source and runs a
 * function, but returns an output which is identical to the source.</span>
 *
 * <img src="./img/do.png" width="100%">
 *
 * Returns a mirrored Observable of the source Observable, but modified so that
 * the provided Observer is called to perform a side effect for every value,
 * error, and completion emitted by the source. Any errors that are thrown in
 * the aforementioned Observer or handlers are safely sent down the error path
 * of the output Observable.
 *
 * This operator is useful for debugging your Observables for the correct values
 * or performing other side effects.
 *
 * Note: this is different to a `subscribe` on the Observable. If the Observable
 * returned by `do` is not subscribed, the side effects specified by the
 * Observer will never happen. `do` therefore simply spies on existing
 * execution, it does not trigger an execution to happen like `subscribe` does.
 *
 * @example <caption>Map every every click to the clientX position of that click, while also logging the click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks
 *   .do(ev => console.log(ev))
 *   .map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link map}
 * @see {@link subscribe}
 *
 * @param {Observer|function} [nextOrObserver] A normal Observer object or a
 * callback for `next`.
 * @param {function} [error] Callback for errors in the source.
 * @param {function} [complete] Callback for the completion of the source.
 * @return {Observable} An Observable identical to the source, but runs the
 * specified Observer or callback(s) for each item.
 * @method do
 * @name do
 * @owner Observable
 */
function _do(nextOrObserver, error, complete) {
    return this.lift(new DoOperator(nextOrObserver, error, complete));
}
exports._do = _do;
var DoOperator = (function () {
    function DoOperator(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    DoOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    };
    return DoOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DoSubscriber = (function (_super) {
    __extends(DoSubscriber, _super);
    function DoSubscriber(destination, nextOrObserver, error, complete) {
        _super.call(this, destination);
        var safeSubscriber = new Subscriber_1.Subscriber(nextOrObserver, error, complete);
        safeSubscriber.syncErrorThrowable = true;
        this.add(safeSubscriber);
        this.safeSubscriber = safeSubscriber;
    }
    DoSubscriber.prototype._next = function (value) {
        var safeSubscriber = this.safeSubscriber;
        safeSubscriber.next(value);
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        }
        else {
            this.destination.next(value);
        }
    };
    DoSubscriber.prototype._error = function (err) {
        var safeSubscriber = this.safeSubscriber;
        safeSubscriber.error(err);
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        }
        else {
            this.destination.error(err);
        }
    };
    DoSubscriber.prototype._complete = function () {
        var safeSubscriber = this.safeSubscriber;
        safeSubscriber.complete();
        if (safeSubscriber.syncErrorThrown) {
            this.destination.error(safeSubscriber.syncErrorValue);
        }
        else {
            this.destination.complete();
        }
    };
    return DoSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=do.js.map
  })();
});

require.register("rxjs/operator/map.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/**
 * Applies a given `project` function to each value emitted by the source
 * Observable, and emits the resulting values as an Observable.
 *
 * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
 * it passes each source value through a transformation function to get
 * corresponding output values.</span>
 *
 * <img src="./img/map.png" width="100%">
 *
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the output
 * Observable.
 *
 * @example <caption>Map every every click to the clientX position of that click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks.map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link mapTo}
 * @see {@link pluck}
 *
 * @param {function(value: T, index: number): R} project The function to apply
 * to each `value` emitted by the source Observable. The `index` parameter is
 * the number `i` for the i-th emission that has happened since the
 * subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to define what `this` is in the
 * `project` function.
 * @return {Observable<R>} An Observable that emits the values from the source
 * Observable transformed by the given `project` function.
 * @method map
 * @owner Observable
 */
function map(project, thisArg) {
    if (typeof project !== 'function') {
        throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
    }
    return this.lift(new MapOperator(project, thisArg));
}
exports.map = map;
var MapOperator = (function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
}());
exports.MapOperator = MapOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MapSubscriber = (function (_super) {
    __extends(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        _super.call(this, destination);
        this.project = project;
        this.count = 0;
        this.thisArg = thisArg || this;
    }
    // NOTE: This looks unoptimized, but it's actually purposefully NOT
    // using try/catch optimizations.
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=map.js.map
  })();
});

require.register("rxjs/operator/mergeAll.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/**
 * Converts a higher-order Observable into a first-order Observable which
 * concurrently delivers all values that are emitted on the inner Observables.
 *
 * <span class="informal">Flattens an Observable-of-Observables.</span>
 *
 * <img src="./img/mergeAll.png" width="100%">
 *
 * `mergeAll` subscribes to an Observable that emits Observables, also known as
 * a higher-order Observable. Each time it observes one of these emitted inner
 * Observables, it subscribes to that and delivers all the values from the
 * inner Observable on the output Observable. The output Observable only
 * completes once all inner Observables have completed. Any error delivered by
 * a inner Observable will be immediately emitted on the output Observable.
 *
 * @example <caption>Spawn a new interval Observable for each click event, and blend their outputs as one Observable</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
 * var firstOrder = higherOrder.mergeAll();
 * firstOrder.subscribe(x => console.log(x));
 *
 * @example <caption>Count from 0 to 9 every second for each click, but only allow 2 concurrent timers</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000).take(10));
 * var firstOrder = higherOrder.mergeAll(2);
 * firstOrder.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link exhaust}
 * @see {@link merge}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switch}
 * @see {@link zipAll}
 *
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of inner
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits values coming from all the
 * inner Observables emitted by the source Observable.
 * @method mergeAll
 * @owner Observable
 */
function mergeAll(concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return this.lift(new MergeAllOperator(concurrent));
}
exports.mergeAll = mergeAll;
var MergeAllOperator = (function () {
    function MergeAllOperator(concurrent) {
        this.concurrent = concurrent;
    }
    MergeAllOperator.prototype.call = function (observer, source) {
        return source.subscribe(new MergeAllSubscriber(observer, this.concurrent));
    };
    return MergeAllOperator;
}());
exports.MergeAllOperator = MergeAllOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeAllSubscriber = (function (_super) {
    __extends(MergeAllSubscriber, _super);
    function MergeAllSubscriber(destination, concurrent) {
        _super.call(this, destination);
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
    }
    MergeAllSubscriber.prototype._next = function (observable) {
        if (this.active < this.concurrent) {
            this.active++;
            this.add(subscribeToResult_1.subscribeToResult(this, observable));
        }
        else {
            this.buffer.push(observable);
        }
    };
    MergeAllSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeAllSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeAllSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.MergeAllSubscriber = MergeAllSubscriber;
//# sourceMappingURL=mergeAll.js.map
  })();
});

require.register("rxjs/operator/multicast.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var ConnectableObservable_1 = require('../observable/ConnectableObservable');
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits the results of invoking a specified selector on items
 * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
 *
 * <img src="./img/multicast.png" width="100%">
 *
 * @param {Function|Subject} subjectOrSubjectFactory - Factory function to create an intermediate subject through
 * which the source sequence's elements will be multicast to the selector function
 * or Subject to push source elements into.
 * @param {Function} [selector] - Optional selector function that can use the multicasted source stream
 * as many times as needed, without causing multiple subscriptions to the source stream.
 * Subscribers to the given source will receive all notifications of the source from the
 * time of the subscription forward.
 * @return {Observable} An Observable that emits the results of invoking the selector
 * on the items emitted by a `ConnectableObservable` that shares a single subscription to
 * the underlying stream.
 * @method multicast
 * @owner Observable
 */
function multicast(subjectOrSubjectFactory, selector) {
    var subjectFactory;
    if (typeof subjectOrSubjectFactory === 'function') {
        subjectFactory = subjectOrSubjectFactory;
    }
    else {
        subjectFactory = function subjectFactory() {
            return subjectOrSubjectFactory;
        };
    }
    if (typeof selector === 'function') {
        return this.lift(new MulticastOperator(subjectFactory, selector));
    }
    var connectable = Object.create(this, ConnectableObservable_1.connectableObservableDescriptor);
    connectable.source = this;
    connectable.subjectFactory = subjectFactory;
    return connectable;
}
exports.multicast = multicast;
var MulticastOperator = (function () {
    function MulticastOperator(subjectFactory, selector) {
        this.subjectFactory = subjectFactory;
        this.selector = selector;
    }
    MulticastOperator.prototype.call = function (subscriber, source) {
        var selector = this.selector;
        var subject = this.subjectFactory();
        var subscription = selector(subject).subscribe(subscriber);
        subscription.add(source.subscribe(subject));
        return subscription;
    };
    return MulticastOperator;
}());
exports.MulticastOperator = MulticastOperator;
//# sourceMappingURL=multicast.js.map
  })();
});

require.register("rxjs/operator/publishBehavior.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var BehaviorSubject_1 = require('../BehaviorSubject');
var multicast_1 = require('./multicast');
/**
 * @param value
 * @return {ConnectableObservable<T>}
 * @method publishBehavior
 * @owner Observable
 */
function publishBehavior(value) {
    return multicast_1.multicast.call(this, new BehaviorSubject_1.BehaviorSubject(value));
}
exports.publishBehavior = publishBehavior;
//# sourceMappingURL=publishBehavior.js.map
  })();
});

require.register("rxjs/operator/scan.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = require('../Subscriber');
/* tslint:enable:max-line-length */
/**
 * Applies an accumulator function over the source Observable, and returns each
 * intermediate result, with an optional seed value.
 *
 * <span class="informal">It's like {@link reduce}, but emits the current
 * accumulation whenever the source emits a value.</span>
 *
 * <img src="./img/scan.png" width="100%">
 *
 * Combines together all values emitted on the source, using an accumulator
 * function that knows how to join a new source value into the accumulation from
 * the past. Is similar to {@link reduce}, but emits the intermediate
 * accumulations.
 *
 * Returns an Observable that applies a specified `accumulator` function to each
 * item emitted by the source Observable. If a `seed` value is specified, then
 * that value will be used as the initial value for the accumulator. If no seed
 * value is specified, the first item of the source is used as the seed.
 *
 * @example <caption>Count the number of click events</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var ones = clicks.mapTo(1);
 * var seed = 0;
 * var count = ones.scan((acc, one) => acc + one, seed);
 * count.subscribe(x => console.log(x));
 *
 * @see {@link expand}
 * @see {@link mergeScan}
 * @see {@link reduce}
 *
 * @param {function(acc: R, value: T, index: number): R} accumulator
 * The accumulator function called on each source value.
 * @param {T|R} [seed] The initial accumulation value.
 * @return {Observable<R>} An observable of the accumulated values.
 * @method scan
 * @owner Observable
 */
function scan(accumulator, seed) {
    var hasSeed = false;
    // providing a seed of `undefined` *should* be valid and trigger
    // hasSeed! so don't use `seed !== undefined` checks!
    // For this reason, we have to check it here at the original call site
    // otherwise inside Operator/Subscriber we won't know if `undefined`
    // means they didn't provide anything or if they literally provided `undefined`
    if (arguments.length >= 2) {
        hasSeed = true;
    }
    return this.lift(new ScanOperator(accumulator, seed, hasSeed));
}
exports.scan = scan;
var ScanOperator = (function () {
    function ScanOperator(accumulator, seed, hasSeed) {
        if (hasSeed === void 0) { hasSeed = false; }
        this.accumulator = accumulator;
        this.seed = seed;
        this.hasSeed = hasSeed;
    }
    ScanOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
    };
    return ScanOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ScanSubscriber = (function (_super) {
    __extends(ScanSubscriber, _super);
    function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
        _super.call(this, destination);
        this.accumulator = accumulator;
        this._seed = _seed;
        this.hasSeed = hasSeed;
        this.index = 0;
    }
    Object.defineProperty(ScanSubscriber.prototype, "seed", {
        get: function () {
            return this._seed;
        },
        set: function (value) {
            this.hasSeed = true;
            this._seed = value;
        },
        enumerable: true,
        configurable: true
    });
    ScanSubscriber.prototype._next = function (value) {
        if (!this.hasSeed) {
            this.seed = value;
            this.destination.next(value);
        }
        else {
            return this._tryNext(value);
        }
    };
    ScanSubscriber.prototype._tryNext = function (value) {
        var index = this.index++;
        var result;
        try {
            result = this.accumulator(this.seed, value, index);
        }
        catch (err) {
            this.destination.error(err);
        }
        this.seed = result;
        this.destination.next(result);
    };
    return ScanSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=scan.js.map
  })();
});

require.register("rxjs/operator/startWith.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var ArrayObservable_1 = require('../observable/ArrayObservable');
var ScalarObservable_1 = require('../observable/ScalarObservable');
var EmptyObservable_1 = require('../observable/EmptyObservable');
var concat_1 = require('./concat');
var isScheduler_1 = require('../util/isScheduler');
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits the items you specify as arguments before it begins to emit
 * items emitted by the source Observable.
 *
 * <img src="./img/startWith.png" width="100%">
 *
 * @param {...T} values - Items you want the modified Observable to emit first.
 * @param {Scheduler} [scheduler] - A {@link IScheduler} to use for scheduling
 * the emissions of the `next` notifications.
 * @return {Observable} An Observable that emits the items in the specified Iterable and then emits the items
 * emitted by the source Observable.
 * @method startWith
 * @owner Observable
 */
function startWith() {
    var array = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        array[_i - 0] = arguments[_i];
    }
    var scheduler = array[array.length - 1];
    if (isScheduler_1.isScheduler(scheduler)) {
        array.pop();
    }
    else {
        scheduler = null;
    }
    var len = array.length;
    if (len === 1) {
        return concat_1.concatStatic(new ScalarObservable_1.ScalarObservable(array[0], scheduler), this);
    }
    else if (len > 1) {
        return concat_1.concatStatic(new ArrayObservable_1.ArrayObservable(array, scheduler), this);
    }
    else {
        return concat_1.concatStatic(new EmptyObservable_1.EmptyObservable(scheduler), this);
    }
}
exports.startWith = startWith;
//# sourceMappingURL=startWith.js.map
  })();
});

require.register("rxjs/operator/switchMap.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OuterSubscriber_1 = require('../OuterSubscriber');
var subscribeToResult_1 = require('../util/subscribeToResult');
/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable, emitting values only from the most recently projected Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link switch}.</span>
 *
 * <img src="./img/switchMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. Each time it observes one of these
 * inner Observables, the output Observable begins emitting the items emitted by
 * that inner Observable. When a new inner Observable is emitted, `switchMap`
 * stops emitting items from the earlier-emitted inner Observable and begins
 * emitting items from the new one. It continues to behave like this for
 * subsequent inner Observables.
 *
 * @example <caption>Rerun an interval Observable on every click event</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.switchMap((ev) => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link mergeMap}
 * @see {@link switch}
 * @see {@link switchMapTo}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and taking only the values from the most recently
 * projected inner Observable.
 * @method switchMap
 * @owner Observable
 */
function switchMap(project, resultSelector) {
    return this.lift(new SwitchMapOperator(project, resultSelector));
}
exports.switchMap = switchMap;
var SwitchMapOperator = (function () {
    function SwitchMapOperator(project, resultSelector) {
        this.project = project;
        this.resultSelector = resultSelector;
    }
    SwitchMapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SwitchMapSubscriber(subscriber, this.project, this.resultSelector));
    };
    return SwitchMapOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchMapSubscriber = (function (_super) {
    __extends(SwitchMapSubscriber, _super);
    function SwitchMapSubscriber(destination, project, resultSelector) {
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.index = 0;
    }
    SwitchMapSubscriber.prototype._next = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result, value, index);
    };
    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
        var innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, result, value, index));
    };
    SwitchMapSubscriber.prototype._complete = function () {
        var innerSubscription = this.innerSubscription;
        if (!innerSubscription || innerSubscription.closed) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype._unsubscribe = function () {
        this.innerSubscription = null;
    };
    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._tryNotifyNext(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            this.destination.next(innerValue);
        }
    };
    SwitchMapSubscriber.prototype._tryNotifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
        var result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return SwitchMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=switchMap.js.map
  })();
});

require.register("rxjs/symbol/iterator.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var root_1 = require('../util/root');
function symbolIteratorPonyfill(root) {
    var Symbol = root.Symbol;
    if (typeof Symbol === 'function') {
        if (!Symbol.iterator) {
            Symbol.iterator = Symbol('iterator polyfill');
        }
        return Symbol.iterator;
    }
    else {
        // [for Mozilla Gecko 27-35:](https://mzl.la/2ewE1zC)
        var Set_1 = root.Set;
        if (Set_1 && typeof new Set_1()['@@iterator'] === 'function') {
            return '@@iterator';
        }
        var Map_1 = root.Map;
        // required for compatability with es6-shim
        if (Map_1) {
            var keys = Object.getOwnPropertyNames(Map_1.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                // according to spec, Map.prototype[@@iterator] and Map.orototype.entries must be equal.
                if (key !== 'entries' && key !== 'size' && Map_1.prototype[key] === Map_1.prototype['entries']) {
                    return key;
                }
            }
        }
        return '@@iterator';
    }
}
exports.symbolIteratorPonyfill = symbolIteratorPonyfill;
exports.$$iterator = symbolIteratorPonyfill(root_1.root);
//# sourceMappingURL=iterator.js.map
  })();
});

require.register("rxjs/symbol/observable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var root_1 = require('../util/root');
function getSymbolObservable(context) {
    var $$observable;
    var Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) {
            $$observable = Symbol.observable;
        }
        else {
            $$observable = Symbol('observable');
            Symbol.observable = $$observable;
        }
    }
    else {
        $$observable = '@@observable';
    }
    return $$observable;
}
exports.getSymbolObservable = getSymbolObservable;
exports.$$observable = getSymbolObservable(root_1.root);
//# sourceMappingURL=observable.js.map
  })();
});

require.register("rxjs/symbol/rxSubscriber.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var root_1 = require('../util/root');
var Symbol = root_1.root.Symbol;
exports.$$rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
//# sourceMappingURL=rxSubscriber.js.map
  })();
});

require.register("rxjs/util/ObjectUnsubscribedError.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when an action is invalid because the object has been
 * unsubscribed.
 *
 * @see {@link Subject}
 * @see {@link BehaviorSubject}
 *
 * @class ObjectUnsubscribedError
 */
var ObjectUnsubscribedError = (function (_super) {
    __extends(ObjectUnsubscribedError, _super);
    function ObjectUnsubscribedError() {
        var err = _super.call(this, 'object unsubscribed');
        this.name = err.name = 'ObjectUnsubscribedError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return ObjectUnsubscribedError;
}(Error));
exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
//# sourceMappingURL=ObjectUnsubscribedError.js.map
  })();
});

require.register("rxjs/util/UnsubscriptionError.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = (function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this);
        this.errors = errors;
        var err = Error.call(this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return UnsubscriptionError;
}(Error));
exports.UnsubscriptionError = UnsubscriptionError;
//# sourceMappingURL=UnsubscriptionError.js.map
  })();
});

require.register("rxjs/util/errorObject.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
// typeof any so that it we don't have to cast when comparing a result to the error object
exports.errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map
  })();
});

require.register("rxjs/util/isArray.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArray.js.map
  })();
});

require.register("rxjs/util/isArrayLike.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
exports.isArrayLike = (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArrayLike.js.map
  })();
});

require.register("rxjs/util/isFunction.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=isFunction.js.map
  })();
});

require.register("rxjs/util/isObject.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map
  })();
});

require.register("rxjs/util/isPromise.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
function isPromise(value) {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
exports.isPromise = isPromise;
//# sourceMappingURL=isPromise.js.map
  })();
});

require.register("rxjs/util/isScheduler.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}
exports.isScheduler = isScheduler;
//# sourceMappingURL=isScheduler.js.map
  })();
});

require.register("rxjs/util/root.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
/**
 * window: browser in DOM main thread
 * self: browser in WebWorker
 * global: Node.js/other
 */
exports.root = (typeof window == 'object' && window.window === window && window
    || typeof self == 'object' && self.self === self && self
    || typeof global == 'object' && global.global === global && global);
if (!exports.root) {
    throw new Error('RxJS could not find any global context (window, self, global)');
}
//# sourceMappingURL=root.js.map
  })();
});

require.register("rxjs/util/subscribeToResult.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var root_1 = require('./root');
var isArrayLike_1 = require('./isArrayLike');
var isPromise_1 = require('./isPromise');
var isObject_1 = require('./isObject');
var Observable_1 = require('../Observable');
var iterator_1 = require('../symbol/iterator');
var InnerSubscriber_1 = require('../InnerSubscriber');
var observable_1 = require('../symbol/observable');
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    if (destination.closed) {
        return null;
    }
    if (result instanceof Observable_1.Observable) {
        if (result._isScalar) {
            destination.next(result.value);
            destination.complete();
            return null;
        }
        else {
            return result.subscribe(destination);
        }
    }
    else if (isArrayLike_1.isArrayLike(result)) {
        for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
            destination.next(result[i]);
        }
        if (!destination.closed) {
            destination.complete();
        }
    }
    else if (isPromise_1.isPromise(result)) {
        result.then(function (value) {
            if (!destination.closed) {
                destination.next(value);
                destination.complete();
            }
        }, function (err) { return destination.error(err); })
            .then(null, function (err) {
            // Escaping the Promise trap: globally throw unhandled errors
            root_1.root.setTimeout(function () { throw err; });
        });
        return destination;
    }
    else if (result && typeof result[iterator_1.$$iterator] === 'function') {
        var iterator = result[iterator_1.$$iterator]();
        do {
            var item = iterator.next();
            if (item.done) {
                destination.complete();
                break;
            }
            destination.next(item.value);
            if (destination.closed) {
                break;
            }
        } while (true);
    }
    else if (result && typeof result[observable_1.$$observable] === 'function') {
        var obs = result[observable_1.$$observable]();
        if (typeof obs.subscribe !== 'function') {
            destination.error(new TypeError('Provided object does not correctly implement Symbol.observable'));
        }
        else {
            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
        }
    }
    else {
        var value = isObject_1.isObject(result) ? 'an invalid object' : "'" + result + "'";
        var msg = ("You provided " + value + " where a stream was expected.")
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        destination.error(new TypeError(msg));
    }
    return null;
}
exports.subscribeToResult = subscribeToResult;
//# sourceMappingURL=subscribeToResult.js.map
  })();
});

require.register("rxjs/util/toSubscriber.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var Subscriber_1 = require('../Subscriber');
var rxSubscriber_1 = require('../symbol/rxSubscriber');
var Observer_1 = require('../Observer');
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber_1.$$rxSubscriber]) {
            return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer_1.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;
//# sourceMappingURL=toSubscriber.js.map
  })();
});

require.register("rxjs/util/tryCatch.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "rxjs");
  (function() {
    "use strict";
var errorObject_1 = require('./errorObject');
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
;
//# sourceMappingURL=tryCatch.js.map
  })();
});

require.register("search-params/index.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "search-params");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Split path
var getPath = exports.getPath = function getPath(path) {
    return path.split('?')[0];
};
var getSearch = exports.getSearch = function getSearch(path) {
    return path.split('?')[1];
};

// Search param value
var isSerialisable = function isSerialisable(val) {
    return val !== undefined && val !== null && val !== '';
};

// Search param name
var bracketTest = /\[\]$/;
var hasBrackets = exports.hasBrackets = function hasBrackets(paramName) {
    return bracketTest.test(paramName);
};
var withoutBrackets = exports.withoutBrackets = function withoutBrackets(paramName) {
    return paramName.replace(bracketTest, '');
};

/**
 * Parse a querystring and return a list of params (Objects with name and value properties)
 * @param  {String} querystring The querystring to parse
 * @return {Array[Object]}      The list of params
 */
var parse = exports.parse = function parse(querystring) {
    return querystring.split('&').reduce(function (params, param) {
        var split = param.split('=');
        var name = split[0];
        var value = split[1];

        return params.concat(split.length === 1 ? { name: name, value: true } : { name: name, value: decodeURIComponent(value) });
    }, []);
};

/**
 * Reduce a list of parameters (returned by `.parse()``) to an object (key-value pairs)
 * @param  {Array} paramList The list of parameters returned by `.parse()`
 * @return {Object}          The object of parameters (key-value pairs)
 */
var toObject = exports.toObject = function toObject(paramList) {
    return paramList.reduce(function (params, _ref) {
        var name = _ref.name;
        var value = _ref.value;

        var isArray = hasBrackets(name);
        var currentValue = params[withoutBrackets(name)];

        if (currentValue === undefined) {
            params[withoutBrackets(name)] = isArray ? [value] : value;
        } else {
            params[withoutBrackets(name)] = [].concat(currentValue, value);
        }

        return params;
    }, {});
};

/**
 * Build a querystring from a list of parameters
 * @param  {Array} paramList The list of parameters (see `.parse()`)
 * @return {String}          The querystring
 */
var build = exports.build = function build(paramList) {
    return paramList.filter(function (_ref2) {
        var value = _ref2.value;
        return value !== undefined && value !== null;
    }).map(function (_ref3) {
        var name = _ref3.name;
        var value = _ref3.value;
        return value === true ? name : name + '=' + encodeURIComponent(value);
    }).join('&');
};

/**
 * Remove a list of parameters from a querystring
 * @param  {String} querystring  The original querystring
 * @param  {Array}  paramsToOmit The parameters to omit
 * @return {String}              The querystring
 */
var omit = exports.omit = function omit(querystring, paramsToOmit) {
    if (!querystring) return '';

    var remainingQueryParams = parse(querystring).filter(function (_ref4) {
        var name = _ref4.name;
        return paramsToOmit.indexOf(withoutBrackets(name)) === -1;
    });
    var remainingQueryString = build(remainingQueryParams);

    return remainingQueryString || '';
};
  })();
});
require.alias("inferno/dist/inferno.min.js", "inferno");
require.alias("path-parser/dist/commonjs/path-parser.js", "path-parser");
require.alias("process/browser.js", "process");
require.alias("route-node/dist/commonjs/route-node.js", "route-node");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

'use strict';

/* jshint ignore:start */
(function () {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = window.brunch || {};
  var ar = br['auto-reload'] = br['auto-reload'] || {};
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function cacheBuster(url) {
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function page() {
      window.location.reload(true);
    },

    stylesheet: function stylesheet() {
      [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (link) {
        var val = link.getAttribute('data-autoreload');
        return link.href && val != 'false';
      }).forEach(function (link) {
        link.href = cacheBuster(link.href);
      });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function () {
        document.body.offsetHeight;
      }, 25);
    },

    javascript: function javascript() {
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function (script) {
        return script.text;
      }).filter(function (text) {
        return text.length > 0;
      });
      var srcScripts = scripts.filter(function (script) {
        return script.src;
      });

      var loaded = 0;
      var all = srcScripts.length;
      var onLoad = function onLoad() {
        loaded = loaded + 1;
        if (loaded === all) {
          textScripts.forEach(function (script) {
            eval(script);
          });
        }
      };

      srcScripts.forEach(function (script) {
        var src = script.src;
        script.remove();
        var newScript = document.createElement('script');
        newScript.src = cacheBuster(src);
        newScript.async = true;
        newScript.onload = onLoad;
        document.head.appendChild(newScript);
      });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function connect() {
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function (event) {
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function () {
      if (connection.readyState) connection.close();
    };
    connection.onclose = function () {
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */

;
//# sourceMappingURL=vendor.js.map