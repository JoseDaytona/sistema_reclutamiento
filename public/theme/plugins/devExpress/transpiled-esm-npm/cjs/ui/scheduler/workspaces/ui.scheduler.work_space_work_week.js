"use strict";

exports.default = void 0;

var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));

var _work_week = require("../../../renovation/ui/scheduler/view_model/to_test/views/utils/work_week");

var _uiScheduler = _interopRequireDefault(require("./ui.scheduler.work_space_week"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';

var SchedulerWorkSpaceWorkWeek = /*#__PURE__*/function (_SchedulerWorkSpaceWe) {
  _inheritsLoose(SchedulerWorkSpaceWorkWeek, _SchedulerWorkSpaceWe);

  function SchedulerWorkSpaceWorkWeek() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _SchedulerWorkSpaceWe.call.apply(_SchedulerWorkSpaceWe, [this].concat(args)) || this;
    _this._getWeekendsCount = _work_week.getWeekendsCount;
    return _this;
  }

  var _proto = SchedulerWorkSpaceWorkWeek.prototype;

  _proto._getElementClass = function _getElementClass() {
    return WORK_WEEK_CLASS;
  };

  _createClass(SchedulerWorkSpaceWorkWeek, [{
    key: "type",
    get: function get() {
      return _constants.VIEWS.WORK_WEEK;
    }
  }]);

  return SchedulerWorkSpaceWorkWeek;
}(_uiScheduler.default);

(0, _component_registrator.default)('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);
var _default = SchedulerWorkSpaceWorkWeek;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;