"use strict";

exports.CompactAppointmentsHelper = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _button = _interopRequireDefault(require("../button"));

var _translator = require("../../animation/translator");

var _message = _interopRequireDefault(require("../../localization/message"));

var _function_template = require("../../core/templates/function_template");

var _deferred = require("../../core/utils/deferred");

var _extend = require("../../core/utils/extend");

var _position = require("../../core/utils/position");

var _dataStructures = require("./dataStructures");

var _constants = require("./constants");

var _appointmentAdapter = require("./appointmentAdapter");

var _instanceFactory = require("./instanceFactory");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var APPOINTMENT_COLLECTOR_CLASS = 'dx-scheduler-appointment-collector';
var COMPACT_APPOINTMENT_COLLECTOR_CLASS = APPOINTMENT_COLLECTOR_CLASS + '-compact';
var APPOINTMENT_COLLECTOR_CONTENT_CLASS = APPOINTMENT_COLLECTOR_CLASS + '-content';
var WEEK_VIEW_COLLECTOR_OFFSET = 5;
var COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET = 1;

var CompactAppointmentsHelper = /*#__PURE__*/function () {
  function CompactAppointmentsHelper(instance) {
    this.instance = instance;
    this.key = this.instance.key;
    this.elements = [];
  }

  var _proto = CompactAppointmentsHelper.prototype;

  _proto.render = function render(options) {
    var isCompact = options.isCompact,
        items = options.items,
        buttonColor = options.buttonColor;

    var template = this._createTemplate(items.data.length, isCompact);

    var button = this._createCompactButton(template, options);

    var $button = button.$element();

    this._makeBackgroundColor($button, items.colors, buttonColor);

    this._makeBackgroundDarker($button);

    this.elements.push($button);
    $button.data('items', this._createTooltipInfos(items));
    return $button;
  };

  _proto.clear = function clear() {
    this.elements.forEach(function (button) {
      button.detach();
      button.remove();
    });
    this.elements = [];
  };

  _proto._createTooltipInfos = function _createTooltipInfos(items) {
    var _this = this;

    return items.data.map(function (appointment, index) {
      var _items$settings;

      var targetedAdapter = (0, _appointmentAdapter.createAppointmentAdapter)(appointment, _this.instance._dataAccessors, (0, _instanceFactory.getTimeZoneCalculator)(_this.key)).clone();

      if (((_items$settings = items.settings) === null || _items$settings === void 0 ? void 0 : _items$settings.length) > 0) {
        var info = items.settings[index].info;
        targetedAdapter.startDate = info.sourceAppointment.startDate;
        targetedAdapter.endDate = info.sourceAppointment.endDate;
      }

      return new _dataStructures.AppointmentTooltipInfo(appointment, targetedAdapter.source(), items.colors[index], items.settings[index]);
    });
  };

  _proto._onButtonClick = function _onButtonClick(e, options) {
    var $button = (0, _renderer.default)(e.element);
    this.instance.showAppointmentTooltipCore($button, $button.data('items'), this._getExtraOptionsForTooltip(options, $button));
  };

  _proto._getExtraOptionsForTooltip = function _getExtraOptionsForTooltip(options, $appointmentCollector) {
    return {
      clickEvent: this._clickEvent(options.onAppointmentClick).bind(this),
      dragBehavior: options.allowDrag && this._createTooltipDragBehavior($appointmentCollector).bind(this),
      dropDownAppointmentTemplate: this.instance.option().dropDownAppointmentTemplate,
      // TODO deprecated option
      isButtonClick: true
    };
  };

  _proto._clickEvent = function _clickEvent(onAppointmentClick) {
    var _this2 = this;

    return function (e) {
      var config = {
        itemData: e.itemData.appointment,
        itemElement: e.itemElement,
        targetedAppointment: e.itemData.targetedAppointment
      };
      var createClickEvent = (0, _extend.extendFromObject)(_this2.instance.fire('mapAppointmentFields', config), e, false);
      delete createClickEvent.itemData;
      delete createClickEvent.itemIndex;
      delete createClickEvent.itemElement;
      onAppointmentClick(createClickEvent);
    };
  };

  _proto._createTooltipDragBehavior = function _createTooltipDragBehavior($appointmentCollector) {
    var _this3 = this;

    return function (e) {
      var $element = (0, _renderer.default)(e.element);

      var workSpace = _this3.instance.getWorkSpace();

      var getItemData = function getItemData(itemElement) {
        var _$$data;

        return (_$$data = (0, _renderer.default)(itemElement).data(_constants.LIST_ITEM_DATA_KEY)) === null || _$$data === void 0 ? void 0 : _$$data.appointment;
      };

      var getItemSettings = function getItemSettings(_, event) {
        return event.itemSettings;
      };

      var initialPosition = (0, _translator.locate)($appointmentCollector);
      var options = {
        filter: ".".concat(_constants.LIST_ITEM_CLASS),
        isSetCursorOffset: true,
        initialPosition: initialPosition,
        getItemData: getItemData,
        getItemSettings: getItemSettings
      };

      workSpace._createDragBehaviorBase($element, options);
    };
  };

  _proto._getCollectorOffset = function _getCollectorOffset(width, cellWidth) {
    return cellWidth - width - this._getCollectorRightOffset();
  };

  _proto._getCollectorRightOffset = function _getCollectorRightOffset() {
    return this.instance.getRenderingStrategyInstance()._isCompactTheme() ? COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET : WEEK_VIEW_COLLECTOR_OFFSET;
  };

  _proto._makeBackgroundDarker = function _makeBackgroundDarker(button) {
    button.css('boxShadow', "inset ".concat((0, _position.getBoundingRect)(button.get(0)).width, "px 0 0 0 rgba(0, 0, 0, 0.3)"));
  };

  _proto._makeBackgroundColor = function _makeBackgroundColor($button, colors, color) {
    _deferred.when.apply(null, colors).done(function () {
      this._makeBackgroundColorCore($button, color, arguments);
    }.bind(this));
  };

  _proto._makeBackgroundColorCore = function _makeBackgroundColorCore($button, color, itemsColors) {
    var paintButton = true;
    var currentItemColor;
    color && color.done(function (color) {
      if (itemsColors.length) {
        currentItemColor = itemsColors[0];

        for (var i = 1; i < itemsColors.length; i++) {
          if (currentItemColor !== itemsColors[i]) {
            paintButton = false;
            break;
          }

          currentItemColor = color;
        }
      }

      color && paintButton && $button.css('backgroundColor', color);
    }.bind(this));
  };

  _proto._setPosition = function _setPosition(element, position) {
    (0, _translator.move)(element, {
      top: position.top,
      left: position.left
    });
  };

  _proto._createCompactButton = function _createCompactButton(template, options) {
    var _this4 = this;

    var $button = this._createCompactButtonElement(options);

    return this.instance._createComponent($button, _button.default, {
      type: 'default',
      width: options.width,
      height: options.height,
      onClick: function onClick(e) {
        return _this4._onButtonClick(e, options);
      },
      template: this._renderTemplate(template, options.items, options.isCompact)
    });
  };

  _proto._createCompactButtonElement = function _createCompactButtonElement(_ref) {
    var isCompact = _ref.isCompact,
        $container = _ref.$container,
        width = _ref.width,
        coordinates = _ref.coordinates,
        applyOffset = _ref.applyOffset,
        cellWidth = _ref.cellWidth;
    var result = (0, _renderer.default)('<div>').addClass(APPOINTMENT_COLLECTOR_CLASS).toggleClass(COMPACT_APPOINTMENT_COLLECTOR_CLASS, isCompact).appendTo($container);
    var offset = applyOffset ? this._getCollectorOffset(width, cellWidth) : 0;

    this._setPosition(result, {
      top: coordinates.top,
      left: coordinates.left + offset
    });

    return result;
  };

  _proto._renderTemplate = function _renderTemplate(template, items, isCompact) {
    return new _function_template.FunctionTemplate(function (options) {
      return template.render({
        model: {
          appointmentCount: items.data.length,
          isCompact: isCompact
        },
        container: options.container
      });
    });
  };

  _proto._createTemplate = function _createTemplate(count, isCompact) {
    this._initButtonTemplate(count, isCompact);

    return this.instance._getAppointmentTemplate('appointmentCollectorTemplate');
  };

  _proto._initButtonTemplate = function _initButtonTemplate(count, isCompact) {
    var _this5 = this;

    this.instance._templateManager.addDefaultTemplates({
      appointmentCollector: new _function_template.FunctionTemplate(function (options) {
        return _this5._createButtonTemplate(count, (0, _renderer.default)(options.container), isCompact);
      })
    });
  };

  _proto._createButtonTemplate = function _createButtonTemplate(appointmentCount, element, isCompact) {
    var text = isCompact ? appointmentCount : _message.default.getFormatter('dxScheduler-moreAppointments')(appointmentCount);
    return element.append((0, _renderer.default)('<span>').text(text)).addClass(APPOINTMENT_COLLECTOR_CONTENT_CLASS);
  };

  return CompactAppointmentsHelper;
}();

exports.CompactAppointmentsHelper = CompactAppointmentsHelper;