"use strict";

exports.default = void 0;

var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));

var _constants = require("../constants");

var _uiScheduler = _interopRequireDefault(require("./ui.scheduler.timeline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TIMELINE_CLASS = 'dx-scheduler-timeline-day';

var SchedulerTimelineDay = /*#__PURE__*/function (_SchedulerTimeline) {
  _inheritsLoose(SchedulerTimelineDay, _SchedulerTimeline);

  function SchedulerTimelineDay() {
    return _SchedulerTimeline.apply(this, arguments) || this;
  }

  var _proto = SchedulerTimelineDay.prototype;

  _proto._getElementClass = function _getElementClass() {
    return TIMELINE_CLASS;
  };

  _proto._needRenderWeekHeader = function _needRenderWeekHeader() {
    return this._isWorkSpaceWithCount();
  };

  _createClass(SchedulerTimelineDay, [{
    key: "type",
    get: function get() {
      return _constants.VIEWS.TIMELINE_DAY;
    }
  }]);

  return SchedulerTimelineDay;
}(_uiScheduler.default);

(0, _component_registrator.default)('dxSchedulerTimelineDay', SchedulerTimelineDay);
var _default = SchedulerTimelineDay;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;