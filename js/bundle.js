/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 46:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var bootstrap_js_dist_collapse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(647);
/* harmony import */ var bootstrap_js_dist_collapse__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bootstrap_js_dist_collapse__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bootstrap_js_dist_dropdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(453);
/* harmony import */ var bootstrap_js_dist_dropdown__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bootstrap_js_dist_dropdown__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _load_assets_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(741);
/* harmony import */ var _load_assets_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_load_assets_js__WEBPACK_IMPORTED_MODULE_2__);
/** =====================================================================
 * Entry: assets/js/main.js
 * الغاية:
 *   نقطة دخول تجميع (Webpack Entry) تجمع الموارد (SCSS + JS) وتهيئ سلوكيات واجهة الموقع.
 * الوظائف الحالية:
 *   - استيراد أجزاء Bootstrap الضرورية (collapse, dropdown) فقط.
 *   - تحميل FontAwesome (نسخة CSS) + الأنماط الرئيسية.
 *   - إدارة حالة شريط التنقل (scroll -> إضافة/إزالة scrolled).
 *   - تفعيل زر رجوع ذكي (محاولة history.back مع fallback للرئيسية).
 *   - إعادة ضبط القوائم المنسدلة والنماذج عند pageshow (BFCache / الرجوع).
 * الأحداث:
 *   - DOMContentLoaded، scroll، pageshow.
 * التوسعة المقترحة:
 *   - Lazy import لأجزاء إضافية.
 *   - قياس تفاعل (analytics events) ضمن requestIdleCallback.
 * ملاحظات أداء:
 *   - تجنب عمليات DOM مكثفة داخل scroll؛ حالياً العملية O(1).
 * آخر تحديث: 2025-09-02
 * ===================================================================== */
// ✅ استيراد مكتبات الطرف الثالث (Third-party libraries)
// استيراد انتقائي من Bootstrap بدل الحزمة الكاملة لتقليل حجم vendor


// استخدام نسخة CSS من Font Awesome بدل حزمة JS الضخمة



document.addEventListener('DOMContentLoaded', function () {
  var navbar = document.getElementById('global-navbar');
  var navCollapse = document.getElementById('navbarNav');
  var backBtn = document.getElementById('nav-back-btn');

  // وظيفة لإغلاق القائمة المنسدلة دائماً (منع استرجاع حالة قديمة عند الرجوع)
  function resetNavCollapse() {
    if (navCollapse && navCollapse.classList.contains('show')) {
      navCollapse.classList.remove('show');
    }
    // ضبط حالة زر التوجّل (toggler) إن وجد
    var toggler = document.querySelector('[data-bs-target="#navbarNav"]');
    if (toggler) {
      toggler.setAttribute('aria-expanded', 'false');
      // إزالة الكلاس "collapsed" غير مطلوب دائماً لكن نضمن الحالة الابتدائية
      if (!toggler.classList.contains('collapsed')) {
        toggler.classList.add('collapsed');
      }
    }
  }

  // إغلاق القائمة عند التحميل الأول (ضمان الحالة)
  resetNavCollapse();
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // زر الرجوع في الشريط العلوي (إن وُجد)
  if (backBtn) {
    // تحديد ما إذا كان هناك صفحة سابقة صالحة داخل نفس النطاق
    var ref = document.referrer;
    var sameOriginRef = false;
    try {
      if (ref) {
        sameOriginRef = new URL(ref).origin === window.location.origin;
      }
    } catch (_) {
      sameOriginRef = false;
    }
    var canGoBack = window.history.length > 1 && sameOriginRef;
    function attemptBackWithFallback() {
      // احتفاظ بالرابط الحالي للفحص بعد محاولة الرجوع
      var current = window.location.href;
      var navigated = false;
      var onPop = function () {
        navigated = true;
        window.removeEventListener('popstate', onPop);
      };
      window.addEventListener('popstate', onPop, {
        once: true
      });
      window.history.back();
      // بعد مهلة قصيرة لو لم يحدث تغيير نوجه للرئيسية
      setTimeout(function () {
        if (!navigated && window.location.href === current) {
          window.location.assign('/');
        }
      }, 600);
    }
    if (!canGoBack) {
      // إظهار الزر لكن كمعطل وظيفياً ويذهب للرئيسية
      backBtn.classList.add('disabled');
      backBtn.setAttribute('aria-disabled', 'true');
      backBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.assign('/');
      });
      backBtn.addEventListener('keyup', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.assign('/');
        }
      });
    } else {
      backBtn.addEventListener('click', function (e) {
        e.preventDefault();
        attemptBackWithFallback();
      });
      backBtn.addEventListener('keyup', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          attemptBackWithFallback();
        }
      });
    }
  }

  // إعادة تعيين النماذج + إغلاق القائمة عند العودة (BFCache أو history back)
  window.addEventListener('pageshow', function (event) {
    if (event.persisted || window.performance && performance.navigation && performance.navigation.type === 2) {
      document.querySelectorAll('form').forEach(form => form.reset());
    }
    // دائماً أغلق القائمة لمنع استرجاع حالة مفتوحة
    resetNavCollapse();
  });
});

/***/ }),

/***/ 338:
/***/ (function(module) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 338;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 741:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/** =====================================================================
 * Module: assets/js/load-assets.js
 * الغاية:
 *   تسجيل الأصول (صور، خطوط، ملفات) ضمن رسم اعتماد Webpack لضمان نسخها للإخراج النهائي.
 * الآلية:
 *   - استخدام require.context لبناء قائمة ديناميكية لكل امتدادات نُسندها.
 *   - المخرجات تُدار عبر إعداد generator في webpack.config.js لتوليد المسارات.
 * التوسعة:
 *   - لإضافة نوع جديد أضف سياقاً Regex جديداً.
 *   - حافظ على استخدام woff2 قدر الإمكان لتقليل الحجم.
 * آخر تحديث: 2025-09-02
 * ===================================================================== */
// دالة مساعدة آمنة تحاول إنشاء context وإن فشل (المجلد غير موجود) تُعيد واجهة فارغة
function safeContext(path, recursive, pattern, label) {
  try {
    const ctx = __webpack_require__(338).context(path, recursive, pattern);
    ctx.keys().forEach(ctx);
    return ctx;
  } catch (err) {
    if (process && process.env && "production" !== 'production') {}
    return {
      keys: () => [],
      resolve: () => undefined,
      id: null
    };
  }
}

// 📦 تحميل الصور (اختياري – لن ينهار إن لم يوجد المجلد)
const images = safeContext('../images', true, /\.(png|jpe?g|gif|svg)$/i, 'images');

// 🔠 تحميل الخطوط
const fonts = safeContext('../fonts', true, /\.(woff2?|eot|ttf|otf)$/i, 'fonts');

// 📄 تحميل ملفات PDF أو غيرها
const files = safeContext('../files', true, /\.(pdf|docx?|xlsx?|zip)$/i, 'files');

// إمكانية توسعة لاحقة: safeContext('../videos', true, /\.(mp4|webm)$/i, 'videos');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			792: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkrtx_egy"] = self["webpackChunkrtx_egy"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [121], function() { return __webpack_require__(46); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;