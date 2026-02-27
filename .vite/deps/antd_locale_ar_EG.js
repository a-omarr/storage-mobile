import {
  __commonJS
} from "./chunk-7D4SUZUM.js";

// node_modules/@babel/runtime/helpers/interopRequireDefault.js
var require_interopRequireDefault = __commonJS({
  "node_modules/@babel/runtime/helpers/interopRequireDefault.js"(exports, module) {
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }
    module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@rc-component/pagination/lib/locale/ar_EG.js
var require_ar_EG = __commonJS({
  "node_modules/@rc-component/pagination/lib/locale/ar_EG.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var locale = {
      // Options
      items_per_page: "/ الصفحة",
      jump_to: "الذهاب إلى",
      jump_to_confirm: "تأكيد",
      page: "الصفحة",
      // Pagination
      prev_page: "الصفحة السابقة",
      next_page: "الصفحة التالية",
      prev_5: "خمس صفحات سابقة",
      next_5: "خمس صفحات تالية",
      prev_3: "ثلاث صفحات سابقة",
      next_3: "ثلاث صفحات تالية",
      page_size: "مقاس الصفحه"
    };
    var _default = exports.default = locale;
  }
});

// node_modules/@rc-component/picker/lib/locale/common.js
var require_common = __commonJS({
  "node_modules/@rc-component/picker/lib/locale/common.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.commonLocale = void 0;
    var commonLocale = exports.commonLocale = {
      yearFormat: "YYYY",
      dayFormat: "D",
      cellMeridiemFormat: "A",
      monthBeforeYear: true
    };
  }
});

// node_modules/@rc-component/picker/lib/locale/ar_EG.js
var require_ar_EG2 = __commonJS({
  "node_modules/@rc-component/picker/lib/locale/ar_EG.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _common = require_common();
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : String(i);
    }
    function _toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var locale = _objectSpread(_objectSpread({}, _common.commonLocale), {}, {
      locale: "ar_EG",
      today: "اليوم",
      now: "الأن",
      backToToday: "العودة إلى اليوم",
      ok: "تأكيد",
      clear: "مسح",
      week: "الأسبوع",
      month: "الشهر",
      year: "السنة",
      timeSelect: "اختيار الوقت",
      dateSelect: "اختيار التاريخ",
      monthSelect: "اختيار الشهر",
      yearSelect: "اختيار السنة",
      decadeSelect: "اختيار العقد",
      previousMonth: "الشهر السابق (PageUp)",
      nextMonth: "الشهر التالى(PageDown)",
      previousYear: "العام السابق (Control + left)",
      nextYear: "العام التالى (Control + right)",
      previousDecade: "العقد السابق",
      nextDecade: "العقد التالى",
      previousCentury: "القرن السابق",
      nextCentury: "القرن التالى"
    });
    var _default = exports.default = locale;
  }
});

// node_modules/antd/lib/time-picker/locale/ar_EG.js
var require_ar_EG3 = __commonJS({
  "node_modules/antd/lib/time-picker/locale/ar_EG.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var locale = {
      placeholder: "اختيار الوقت",
      rangePlaceholder: ["وقت البدء", "وقت الانتهاء"]
    };
    var _default = exports.default = locale;
  }
});

// node_modules/antd/lib/date-picker/locale/ar_EG.js
var require_ar_EG4 = __commonJS({
  "node_modules/antd/lib/date-picker/locale/ar_EG.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault().default;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _ar_EG = _interopRequireDefault(require_ar_EG2());
    var _ar_EG2 = _interopRequireDefault(require_ar_EG3());
    var locale = {
      lang: {
        placeholder: "اختيار التاريخ",
        rangePlaceholder: ["البداية", "النهاية"],
        yearFormat: "YYYY",
        monthFormat: "MMMM",
        monthBeforeYear: true,
        shortWeekDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
        shortMonths: ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
        ..._ar_EG.default
      },
      timePickerLocale: {
        ..._ar_EG2.default
      }
    };
    var _default = exports.default = locale;
  }
});

// node_modules/antd/lib/calendar/locale/ar_EG.js
var require_ar_EG5 = __commonJS({
  "node_modules/antd/lib/calendar/locale/ar_EG.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault().default;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _ar_EG = _interopRequireDefault(require_ar_EG4());
    var _default = exports.default = _ar_EG.default;
  }
});

// node_modules/antd/lib/locale/ar_EG.js
var require_ar_EG6 = __commonJS({
  "node_modules/antd/lib/locale/ar_EG.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault().default;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _ar_EG = _interopRequireDefault(require_ar_EG());
    var _ar_EG2 = _interopRequireDefault(require_ar_EG5());
    var _ar_EG3 = _interopRequireDefault(require_ar_EG4());
    var _ar_EG4 = _interopRequireDefault(require_ar_EG3());
    var typeTemplate = "ليس ${label} من نوع ${type} صالحًا";
    var localeValues = {
      locale: "ar",
      Pagination: _ar_EG.default,
      DatePicker: _ar_EG3.default,
      TimePicker: _ar_EG4.default,
      Calendar: _ar_EG2.default,
      global: {
        placeholder: "يرجى التحديد",
        close: "إغلاق"
      },
      Table: {
        filterTitle: "الفلاتر",
        filterConfirm: "تأكيد",
        filterReset: "إعادة ضبط",
        selectAll: "اختيار الكل",
        selectInvert: "إلغاء الاختيار",
        selectionAll: "حدد جميع البيانات",
        sortTitle: "رتب",
        expand: "توسيع الصف",
        collapse: "طي الصف",
        triggerDesc: "ترتيب تنازلي",
        triggerAsc: "ترتيب تصاعدي",
        cancelSort: "إلغاء الترتيب"
      },
      Tour: {
        Next: "التالي",
        Previous: "السابق",
        Finish: "إنهاء"
      },
      Modal: {
        okText: "تأكيد",
        cancelText: "إلغاء",
        justOkText: "تأكيد"
      },
      Popconfirm: {
        okText: "تأكيد",
        cancelText: "إلغاء"
      },
      Transfer: {
        titles: ["", ""],
        searchPlaceholder: "ابحث هنا",
        itemUnit: "عنصر",
        itemsUnit: "عناصر"
      },
      Upload: {
        uploading: "جاري الرفع...",
        removeFile: "احذف الملف",
        uploadError: "مشكلة فى الرفع",
        previewFile: "استعرض الملف",
        downloadFile: "تحميل الملف"
      },
      Empty: {
        description: "لا توجد بيانات"
      },
      Icon: {
        icon: "أيقونة"
      },
      Text: {
        edit: "تعديل",
        copy: "نسخ",
        copied: "نقل",
        expand: "وسع"
      },
      Form: {
        defaultValidateMessages: {
          default: "خطأ في حقل الإدخال ${label}",
          required: "يرجى إدخال ${label}",
          enum: "${label} يجب أن يكون واحدا من [${enum}]",
          whitespace: "${label} لا يمكن أن يكون حرفًا فارغًا",
          date: {
            format: "${label} تنسيق التاريخ غير صحيح",
            parse: "${label} لا يمكن تحويلها إلى تاريخ",
            invalid: "تاريخ ${label} غير صحيح"
          },
          types: {
            string: typeTemplate,
            method: typeTemplate,
            array: typeTemplate,
            object: typeTemplate,
            number: typeTemplate,
            date: typeTemplate,
            boolean: typeTemplate,
            integer: typeTemplate,
            float: typeTemplate,
            regexp: typeTemplate,
            email: typeTemplate,
            url: typeTemplate,
            hex: typeTemplate
          },
          string: {
            len: "يجب ${label} ان يكون ${len} أحرف",
            min: "${label} على الأقل ${min} أحرف",
            max: "${label} يصل إلى ${max} أحرف",
            range: "يجب ${label} ان يكون مابين ${min}-${max} أحرف"
          },
          number: {
            len: "${len} ان يساوي ${label} يجب",
            min: "${min} الأدنى هو ${label} حد",
            max: "${max} الأقصى هو ${label} حد",
            range: "${max}-${min} ان يكون مابين ${label} يجب"
          },
          array: {
            len: "يجب أن يكون ${label} طوله ${len}",
            min: "يجب أن يكون ${label} طوله الأدنى ${min}",
            max: "يجب أن يكون ${label} طوله الأقصى ${max}",
            range: "يجب أن يكون ${label} طوله مابين ${min}-${max}"
          },
          pattern: {
            mismatch: "لا يتطابق ${label} مع ${pattern}"
          }
        }
      },
      QRCode: {
        expired: "انتهت صلاحية رمز الاستجابة السريعة",
        refresh: "انقر للتحديث",
        scanned: "تم المسح"
      },
      ColorPicker: {
        presetEmpty: "لا يوجد",
        transparent: "شفاف",
        singleColor: "لون واحد",
        gradientColor: "تدرج لوني"
      }
    };
    var _default = exports.default = localeValues;
  }
});

// node_modules/antd/locale/ar_EG.js
var require_ar_EG7 = __commonJS({
  "node_modules/antd/locale/ar_EG.js"(exports, module) {
    module.exports = require_ar_EG6();
  }
});
export default require_ar_EG7();
//# sourceMappingURL=antd_locale_ar_EG.js.map
