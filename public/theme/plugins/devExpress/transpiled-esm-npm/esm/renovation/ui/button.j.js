import registerComponent from "../../core/component_registrator";
import BaseComponent from "../component_wrapper/button";
import { Button as ButtonComponent, defaultOptions } from "./button";
export default class Button extends BaseComponent {
  getProps() {
    var props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }

  focus() {
    var _this$viewRef;

    return (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.focus(...arguments);
  }

  activate() {
    var _this$viewRef2;

    return (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.activate(...arguments);
  }

  deactivate() {
    var _this$viewRef3;

    return (_this$viewRef3 = this.viewRef) === null || _this$viewRef3 === void 0 ? void 0 : _this$viewRef3.deactivate(...arguments);
  }

  _getActionConfigs() {
    return {
      onClick: {
        excludeValidators: ["readOnly"]
      },
      onSubmit: {}
    };
  }

  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: ["onSubmit"],
      templates: ["template"],
      props: ["activeStateEnabled", "hoverStateEnabled", "icon", "iconPosition", "onClick", "onSubmit", "pressed", "stylingMode", "template", "text", "type", "useInkRipple", "useSubmitBehavior", "validationGroup", "templateData", "className", "accessKey", "disabled", "focusStateEnabled", "height", "hint", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width"]
    };
  }

  get _viewComponent() {
    return ButtonComponent;
  }

}
registerComponent("dxButton", Button);
Button.defaultOptions = defaultOptions;