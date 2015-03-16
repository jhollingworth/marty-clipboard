(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MartyClipboard = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/james/src/marty-clipboard/index.css":[function(require,module,exports){
var css = ""; (require("./node_modules/cssify"))(css); module.exports = css;
},{"./node_modules/cssify":"/Users/james/src/marty-clipboard/node_modules/cssify/browser.js"}],"/Users/james/src/marty-clipboard/node_modules/cssify/browser.js":[function(require,module,exports){
module.exports = function (css, customDocument) {
  var doc = customDocument || document;
  if (doc.createStyleSheet) {
    var sheet = doc.createStyleSheet()
    sheet.cssText = css;
    return sheet.ownerNode;
  } else {
    var head = doc.getElementsByTagName('head')[0],
        style = doc.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(doc.createTextNode(css));
    }

    head.appendChild(style);
    return style;
  }
};

module.exports.byUrl = function(url) {
  if (document.createStyleSheet) {
    return document.createStyleSheet(url).ownerNode;
  } else {
    var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    head.appendChild(link);
    return link;
  }
};

},{}],"/Users/james/src/marty-clipboard/node_modules/keymage/keymage.js":[function(require,module,exports){
// keymage.js - Javascript keyboard event handling
// http://github.com/piranha/keymage
//
// (c) 2012 Alexander Solovyov
// under terms of ISC License

(function(define, undefined) {
define(function() {
    var VERSION = '1.0.1';
    var isOsx = typeof navigator !== 'undefined' &&
        ~navigator.userAgent.indexOf('Mac OS X');

    // Defining all keys
    var MODPROPS = ['shiftKey', 'ctrlKey', 'altKey', 'metaKey'];
    var MODS = {
        'shift': 'shift',
        'ctrl': 'ctrl', 'control': 'ctrl',
        'alt': 'alt', 'option': 'alt',
        'win': 'meta', 'cmd': 'meta', 'super': 'meta',
                          'meta': 'meta',
        // default modifier for os x is cmd and for others is ctrl
        'defmod':  isOsx ? 'meta' : 'ctrl'
        };
    var MODORDER = ['shift', 'ctrl', 'alt', 'meta'];
    var MODNUMS = [16, 17, 18, 91];

    var KEYS = {
        'backspace': 8,
        'tab': 9,
        'enter': 13, 'return': 13,
        'pause': 19,
        'caps': 20, 'capslock': 20,
        'escape': 27, 'esc': 27,
        'space': 32,
        'pgup': 33, 'pageup': 33,
        'pgdown': 34, 'pagedown': 34,
        'end': 35,
        'home': 36,
        'ins': 45, 'insert': 45,
        'del': 46, 'delete': 46,

        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,

        '*': 106,
        '+': 107, 'plus': 107,
        '-': 109, 'minus': 109,
        ';': 186,
        '=': 187,
        ',': 188,
        '.': 190,
        '/': 191,
        '`': 192,
        '[': 219,
        '\\': 220,
        ']': 221,
        "'": 222
    };

    var i;
    // numpad
    for (i = 0; i < 10; i++) {
        KEYS['num-' + i] = i + 95;
    }
    // top row 0-9
    for (i = 0; i < 10; i++) {
        KEYS[i.toString()] = i + 48;
    }
    // f1-f24
    for (i = 1; i < 25; i++) {
        KEYS['f' + i] = i + 111;
    }
    // alphabet
    for (i = 65; i < 91; i++) {
        KEYS[String.fromCharCode(i).toLowerCase()] = i;
    }

    // Reverse key codes
    var KEYREV = {};
    for (var k in KEYS) {
        var val = KEYS[k];
        if (!KEYREV[val] || KEYREV[val].length < k.length) {
            KEYREV[val] = k;
        }
    }

    // -----------------------
    // Actual work is done here

    var currentScope = '';
    var allChains = {};

    function parseKeyString(keystring) {
        var bits = keystring.split('-');
        var button = bits[bits.length - 1];
        var key = {code: KEYS[button]};

        if (!key.code) {
            throw 'Unknown key "' + button + '" in keystring "' +
                keystring + '"';
        }

        var mod;
        for (var i = 0; i < bits.length - 1; i++) {
            button = bits[i];
            mod = MODS[button];
            if (!mod) {
                    throw 'Unknown modifier "' + button + '" in keystring "' +
                        keystring + '"';
            }
            key[mod] = true;
        }

        return key;
    }

    function stringifyKey(key) {
        var s = '';
        for (var i = 0; i < MODORDER.length; i++) {
            if (key[MODORDER[i]]) {
                s += MODORDER[i] + '-';
            }
        }
        s += KEYREV[key.code];
        return s;
    }

    function normalizeKeyChain(keychainString) {
        var keychain = [];
        var keys = keychainString.split(' ');

        for (var i = 0; i < keys.length; i++) {
            var key = parseKeyString(keys[i]);
            key = stringifyKey(key);
            keychain.push(key);
        }

        keychain.original = keychainString;
        return keychain;
    }

    function eventKeyString(e) {
        var key = {code: e.keyCode};
        for (var i = 0; i < MODPROPS.length; i++) {
            var mod = MODPROPS[i];
            if (e[mod]) {
                key[mod.slice(0, mod.length - 3)] = true;
            }
        }
        return stringifyKey(key);
    }

    function getNestedChains(chains, scope) {
        for (var i = 0; i < scope.length; i++) {
            var bit = scope[i];

            if (bit) {
                chains = chains[bit];
            }

            if (!chains) {
                break;
            }
        }
        return chains;
    }

    var sequence = [];
    function dispatch(e) {
        // Skip all modifiers
        if (~MODNUMS.indexOf(e.keyCode)) {
            return;
        }

        var seq = sequence.slice();
        seq.push(eventKeyString(e));
        var scope = currentScope.split('.');
        var matched, chains, key;

        for (var i = scope.length; i >= 0; i--) {
            chains = getNestedChains(allChains, scope.slice(0, i));
            if (!chains) {
                continue;
            }
            matched = true;
            for (var j = 0; j < seq.length; j++) {
                key = seq[j];
                if (!chains[key]) {
                    matched = false;
                    break;
                }
                chains = chains[key];
            }

            if (matched) {
                break;
            }
        }

        var definitionScope = scope.slice(0, i).join('.');
        var preventDefault = chains.preventDefault;

        // partial match, save the sequence
        if (matched && !chains.handlers) {
            sequence = seq;
            if (preventDefault) {
                e.preventDefault();
            }
            return;
        }

        if (matched) {
            for (i = 0; i < chains.handlers.length; i++) {
                var handler = chains.handlers[i];
                var options = handler._keymage;

                var res = handler.call(options.context, e, {
                    shortcut: options.original,
                    scope: currentScope,
                    definitionScope: definitionScope
                });

                if (res === false || preventDefault) {
                    e.preventDefault();
                }
            }
        }

        // either matched or not, drop the sequence
        sequence = [];
    }

    function getHandlers(scope, keychain, fn) {
        var bits = scope.split('.');
        var chains = allChains;
        bits = bits.concat(keychain);

        for (var i = 0, l = bits.length; i < l; i++) {
            var bit = bits[i];
            if (!bit) continue;

            chains = chains[bit] || (chains[bit] = {});
            if (fn && fn._keymage.preventDefault) {
                chains.preventDefault = true;
            }

            if (i === l - 1) {
                var handlers = chains.handlers || (chains.handlers = []);
                return handlers;
            }
        }
    }

    function assignKey(scope, keychain, fn) {
        var handlers = getHandlers(scope, keychain, fn);
        handlers.push(fn);
    }

    function unassignKey(scope, keychain, fn) {
        var handlers = getHandlers(scope, keychain);
        var idx = handlers.indexOf(fn);
        if (~idx) {
            handlers.splice(idx, 1);
        }
    }

    function parsed(scope, keychain, fn, options) {
        if (keychain === undefined && fn === undefined) {
            return function(keychain, fn) {
                return keymage(scope, keychain, fn);
            };
        }

        if (typeof keychain === 'function') {
            options = fn;
            fn = keychain;
            keychain = scope;
            scope = '';
        }

        var normalized = normalizeKeyChain(keychain);

        return [scope, normalized, fn, options];
    }

    // optional arguments: scope, options.
    function keymage(scope, keychain, fn, options) {
        var args = parsed(scope, keychain, fn, options);
        fn = args[2];
        options = args[3];
        fn._keymage = options || {};
        fn._keymage.original = keychain;
        assignKey.apply(null, args);
    }

    keymage.unbind = function(scope, keychain, fn) {
        var args = parsed(scope, keychain, fn);
        unassignKey.apply(null, args);
    };

    keymage.parse = parseKeyString;
    keymage.stringify = stringifyKey;

    keymage.bindings = allChains;

    keymage.setScope = function(scope) {
        currentScope = scope ? scope : '';
    };

    keymage.getScope = function() { return currentScope; };

    keymage.pushScope = function(scope) {
        currentScope = (currentScope ? currentScope + '.' : '') + scope;
        return currentScope;
    };

    keymage.popScope = function(scope) {
        var i;

        if (!scope) {
            i = currentScope.lastIndexOf('.');
            scope = currentScope.slice(i + 1);
            currentScope = i == -1 ? '' : currentScope.slice(0, i);
            return scope;
        }

        currentScope = currentScope.replace(
            new RegExp('(^|\\.)' + scope + '(\\.|$).*'), '');
        return scope;
    };

    keymage.version = VERSION;

    window.addEventListener('keydown', dispatch, false);

    return keymage;
});
})(typeof define !== 'undefined' ? define : function(factory) {
    if (typeof module !== 'undefined') {
        module.exports = factory();
    } else {
        window.keymage = factory();
    }
});

},{}],"/Users/james/src/marty-clipboard/node_modules/nanomodal/nanomodal.min.js":[function(require,module,exports){
var nanoModal;!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){function c(a,b){var c=document,e=a.nodeType||a===window?a:c.createElement(a),f=[];b&&(e.className=b);var g=d(),h=d(),i=function(a,b){e.addEventListener?e.addEventListener(a,b,!1):e.attachEvent("on"+a,b),f.push({event:a,handler:b})},j=function(a,b){e.removeEventListener?e.removeEventListener(a,b):e.detachEvent("on"+a,b);for(var c,d=f.length;d-->0;)if(c=f[d],c.event===a&&c.handler===b){f.splice(d,1);break}},k=function(a){"ontouchend"in document.documentElement?i("touchstart",a):i("click",a)},l=function(a){e&&(e.style.display="block",g.fire(a))},m=function(a){e&&(e.style.display="none",h.fire(a))},n=function(){return e.style&&"block"===e.style.display},o=function(a){e&&(e.innerHTML=a)},p=function(a){e&&(o(""),e.appendChild(c.createTextNode(a)))},q=function(){if(e.parentNode){for(var a,b=f.length;b-->0;)a=f[b],j(a.event,a.handler);e.parentNode.removeChild(e),g.removeAllListeners(),h.removeAllListeners()}},r=function(a){var b=a.el||a;e.appendChild(b)};return{el:e,addListener:i,addClickListener:k,onShowEvent:g,onHideEvent:h,show:l,hide:m,isShowing:n,html:o,text:p,remove:q,add:r}}var d=a("./ModalEvent");b.exports=c},{"./ModalEvent":3}],2:[function(a,b){function c(a,b,e,f,g){if(void 0!==a){b=b||{};var h,i=d("div","nanoModal nanoModalOverride "+(b.classes||"")),j=d("div","nanoModalContent"),k=d("div","nanoModalButtons");i.add(j),i.add(k),i.el.style.display="none";var l,m=[];b.buttons=b.buttons||[{text:"Close",handler:"hide",primary:!0}];var n=function(){for(var a=m.length;a-->0;){var b=m[a];b.remove()}m=[]},o=function(){i.el.style.marginLeft=-i.el.clientWidth/2+"px"},p=function(){for(var a=document.querySelectorAll(".nanoModal"),b=a.length;b-->0;)if("none"!==a[b].style.display)return!0;return!1},q=function(){i.isShowing()||(c.resizeOverlay(),e.show(e),i.show(l),o())},r=function(){i.isShowing()&&(i.hide(l),p()||e.hide(e),b.autoRemove&&l.remove())},s=function(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b};return l={modal:i,overlay:e,show:function(){return f?f(q,l):q(),l},hide:function(){return g?g(r,l):r(),l},onShow:function(a){return i.onShowEvent.addListener(function(){a(l)}),l},onHide:function(a){return i.onHideEvent.addListener(function(){a(l)}),l},remove:function(){e.onRequestHide.removeListener(h),h=null,n(),i.remove()},setButtons:function(a){var b,c,e,f=a.length,g=function(a,b){var c=s(l);a.addClickListener(function(a){c.event=a||window.event,b.handler(c)})};if(n(),0===f)k.hide();else for(k.show();f-->0;)b=a[f],e="nanoModalBtn",b.primary&&(e+=" nanoModalBtnPrimary"),e+=b.classes?" "+b.classes:"",c=d("button",e),"hide"===b.handler?c.addClickListener(l.hide):b.handler&&g(c,b),c.text(b.text),k.add(c),m.push(c);return o(),l},setContent:function(b){return b.nodeType?(j.html(""),j.add(b)):j.html(b),o(),a=b,l},getContent:function(){return a}},h=e.onRequestHide.addListener(function(){b.overlayClose!==!1&&i.isShowing()&&l.hide()}),l.setContent(a).setButtons(b.buttons),document.body.appendChild(i.el),l}}var d=a("./El"),e=document,f=function(a){var b=e.documentElement,c="scroll"+a,d="offset"+a;return Math.max(e.body[c],b[c],e.body[d],b[d],b["client"+a])};c.resizeOverlay=function(){var a=e.getElementById("nanoModalOverlay");a.style.width=f("Width")+"px",a.style.height=f("Height")+"px"},b.exports=c},{"./El":1}],3:[function(a,b){function c(){var a={},b=0,c=function(c){return a[b]=c,b++},d=function(b){b&&delete a[b]},e=function(){a={}},f=function(){for(var c=0,d=b;d>c;++c)a[c]&&a[c].apply(null,arguments)};return{addListener:c,removeListener:d,removeAllListeners:e,fire:f}}b.exports=c},{}],4:[function(a){var b=a("./ModalEvent"),c=function(){function c(){if(!g.querySelector("#nanoModalOverlay")){var a=e("style"),c=a.el,h=g.querySelectorAll("head")[0].childNodes[0];h.parentNode.insertBefore(c,h);var i=".nanoModal{position:absolute;top:100px;left:50%;display:none;z-index:9999;min-width:300px;padding:15px 20px 10px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;background:#fff;background:-moz-linear-gradient(top,#fff 0,#ddd 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#fff),color-stop(100%,#ddd));background:-webkit-linear-gradient(top,#fff 0,#ddd 100%);background:-o-linear-gradient(top,#fff 0,#ddd 100%);background:-ms-linear-gradient(top,#fff 0,#ddd 100%);background:linear-gradient(to bottom,#fff 0,#ddd 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dddddd', GradientType=0)}.nanoModalOverlay{position:absolute;top:0;left:0;width:100%;height:100%;z-index:9998;background:#000;display:none;-ms-filter:\"alpha(Opacity=50)\";-moz-opacity:.5;-khtml-opacity:.5;opacity:.5}.nanoModalButtons{border-top:1px solid #ddd;margin-top:15px;text-align:right}.nanoModalBtn{color:#333;background-color:#fff;display:inline-block;padding:6px 12px;margin:8px 4px 0;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.nanoModalBtn:active,.nanoModalBtn:focus,.nanoModalBtn:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.nanoModalBtn.nanoModalBtnPrimary{color:#fff;background-color:#428bca;border-color:#357ebd}.nanoModalBtn.nanoModalBtnPrimary:active,.nanoModalBtn.nanoModalBtnPrimary:focus,.nanoModalBtn.nanoModalBtnPrimary:hover{color:#fff;background-color:#3071a9;border-color:#285e8e}";c.styleSheet?c.styleSheet.cssText=i:a.text(i),d=e("div","nanoModalOverlay nanoModalOverride"),d.el.id="nanoModalOverlay",g.body.appendChild(d.el),d.onRequestHide=b();var j=function(){d.onRequestHide.fire()};d.addClickListener(j),e(g).addListener("keydown",function(a){var b=a.which||a.keyCode;27===b&&j()});var k,l=e(window);l.addListener("resize",function(){k&&clearTimeout(k),k=setTimeout(f.resizeOverlay,100)}),l.addListener("orientationchange",function(){for(var a=0;3>a;++a)setTimeout(f.resizeOverlay,1e3*a+200)})}}var d,e=a("./El"),f=a("./Modal"),g=document;document.body&&c();var h=function(a,b){return c(),f(a,b,d,h.customShow,h.customHide)};return h.resizeOverlay=f.resizeOverlay,h}();nanoModal=c},{"./El":1,"./Modal":2,"./ModalEvent":3}]},{},[1,2,3,4]),"undefined"!=typeof window&&("function"==typeof window.define&&window.define.amd&&window.define(function(){return nanoModal}),window.nanoModal=nanoModal),"undefined"!=typeof module&&(module.exports=nanoModal);
},{}],"/index.js":[function(require,module,exports){
require('./index.css');

var keymage = require('keymage');
var nanoModal = require('nanomodal');

keymage('ctrl-shift-c', function() {
  var Marty = window.Marty;

  if (!Marty) {
    console.warn('Marty not found on page');
    return;
  }

  nanoModal("Marty State").onShow(function (modal) {
    modal.setContent(content());

    function content() {
      var state = Marty.dehydrate();
      var textarea = document.createElement("textarea")
      textarea.cols = 50
      textarea.rows = 5;
      textarea.value =  JSON.stringify(state);
      textarea.onchange = updateState;
      textarea.onkeyup = updateState;
      textarea.onpaste = updateState;

      function updateState() {
        try {
          var json = JSON.parse(textarea.value);

          Marty.rehydrate(json);
        } catch (e) {
          console.error('Invalid JSON');
        }
      }

      return textarea;
    }
  }).show();
  return false;
});

},{"./index.css":"/Users/james/src/marty-clipboard/index.css","keymage":"/Users/james/src/marty-clipboard/node_modules/keymage/keymage.js","nanomodal":"/Users/james/src/marty-clipboard/node_modules/nanomodal/nanomodal.min.js"}]},{},[])("/index.js")
});