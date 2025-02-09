"use strict";

exports.viewFunction = exports.TimePanelCellProps = exports.TimePanelCell = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _cell = require("../cell");

var _excluded = ["allDay", "ariaLabel", "children", "className", "contentTemplate", "contentTemplateProps", "endDate", "groupIndex", "groups", "index", "isFirstGroupCell", "isLastGroupCell", "startDate", "text", "timeCellTemplate"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(viewModel) {
  return (0, _inferno.createComponentVNode)(2, _cell.CellBase, {
    "isFirstGroupCell": viewModel.props.isFirstGroupCell,
    "isLastGroupCell": viewModel.props.isLastGroupCell,
    "contentTemplate": viewModel.props.timeCellTemplate,
    "contentTemplateProps": viewModel.timeCellTemplateProps,
    "className": "dx-scheduler-time-panel-cell dx-scheduler-cell-sizes-vertical ".concat(viewModel.props.className),
    children: (0, _inferno.createVNode)(1, "div", null, viewModel.props.text, 0)
  });
};

exports.viewFunction = viewFunction;
var TimePanelCellProps = _cell.CellBaseProps;
exports.TimePanelCellProps = TimePanelCellProps;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var TimePanelCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(TimePanelCell, _BaseInfernoComponent);

  function TimePanelCell(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.__getterCache = {};
    return _this;
  }

  var _proto = TimePanelCell.prototype;

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    if (this.props["groupIndex"] !== nextProps["groupIndex"] || this.props["groups"] !== nextProps["groups"] || this.props["index"] !== nextProps["index"] || this.props["startDate"] !== nextProps["startDate"] || this.props["text"] !== nextProps["text"]) {
      this.__getterCache["timeCellTemplateProps"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        contentTemplate: getTemplate(props.contentTemplate)
      }),
      timeCellTemplateProps: this.timeCellTemplateProps,
      restAttributes: this.restAttributes
    });
  };

  _createClass(TimePanelCell, [{
    key: "timeCellTemplateProps",
    get: function get() {
      var _this2 = this;

      if (this.__getterCache["timeCellTemplateProps"] !== undefined) {
        return this.__getterCache["timeCellTemplateProps"];
      }

      return this.__getterCache["timeCellTemplateProps"] = function () {
        var _this2$props = _this2.props,
            groupIndex = _this2$props.groupIndex,
            groups = _this2$props.groups,
            index = _this2$props.index,
            startDate = _this2$props.startDate,
            text = _this2$props.text;
        return {
          data: {
            date: startDate,
            groups: groups,
            groupIndex: groupIndex,
            text: text
          },
          index: index
        };
      }();
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          allDay = _this$props.allDay,
          ariaLabel = _this$props.ariaLabel,
          children = _this$props.children,
          className = _this$props.className,
          contentTemplate = _this$props.contentTemplate,
          contentTemplateProps = _this$props.contentTemplateProps,
          endDate = _this$props.endDate,
          groupIndex = _this$props.groupIndex,
          groups = _this$props.groups,
          index = _this$props.index,
          isFirstGroupCell = _this$props.isFirstGroupCell,
          isLastGroupCell = _this$props.isLastGroupCell,
          startDate = _this$props.startDate,
          text = _this$props.text,
          timeCellTemplate = _this$props.timeCellTemplate,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return TimePanelCell;
}(_inferno2.BaseInfernoComponent);

exports.TimePanelCell = TimePanelCell;
TimePanelCell.defaultProps = TimePanelCellProps;