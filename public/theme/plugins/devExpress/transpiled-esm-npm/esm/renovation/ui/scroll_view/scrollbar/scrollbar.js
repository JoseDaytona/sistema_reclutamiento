import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["bounceEnabled", "containerHasSizes", "containerSize", "contentSize", "direction", "maxOffset", "minOffset", "rtlEnabled", "scrollByThumb", "scrollLocation", "scrollLocationChange", "showScrollbar", "visible"];
import { createVNode } from "inferno";
import { InfernoEffect, InfernoComponent, normalizeStyles } from "@devextreme/runtime/inferno";
import { combineClasses } from "../../../utils/combine_classes";
import domAdapter from "../../../../core/dom_adapter";
import { DIRECTION_HORIZONTAL, SCROLLABLE_SCROLLBAR_CLASS, SCROLLABLE_SCROLL_CLASS, SCROLLABLE_SCROLL_CONTENT_CLASS, SCROLLABLE_SCROLLBAR_ACTIVE_CLASS, HOVER_ENABLED_STATE, ShowScrollbarMode } from "../common/consts";
import { subscribeToDXPointerDownEvent, subscribeToDXPointerUpEvent, subscribeToMouseEnterEvent, subscribeToMouseLeaveEvent } from "../../../utils/subscribe_to_event";
import { BaseWidgetProps } from "../../common/base_props";
import { inRange } from "../../../../core/utils/math";
import { clampIntoRange } from "../utils/clamp_into_range";
import { ScrollbarProps } from "../common/scrollbar_props";
import { ScrollableSimulatedProps } from "../common/simulated_strategy_props";
var OUT_BOUNDS_ACCELERATION = 0.5;
export var THUMB_MIN_SIZE = 15;
export var viewFunction = viewModel => {
  var {
    hidden,
    scrollbarClasses,
    scrollbarRef,
    thumbClasses,
    thumbRef,
    thumbStyles
  } = viewModel;
  return createVNode(1, "div", scrollbarClasses, createVNode(1, "div", thumbClasses, createVNode(1, "div", SCROLLABLE_SCROLL_CONTENT_CLASS), 2, {
    "style": normalizeStyles(thumbStyles)
  }, null, thumbRef), 2, {
    "hidden": hidden
  }, null, scrollbarRef);
};
export var ScrollbarPropsType = {
  get direction() {
    return ScrollbarProps.direction;
  },

  get containerHasSizes() {
    return ScrollbarProps.containerHasSizes;
  },

  get containerSize() {
    return ScrollbarProps.containerSize;
  },

  get contentSize() {
    return ScrollbarProps.contentSize;
  },

  get visible() {
    return ScrollbarProps.visible;
  },

  get scrollLocation() {
    return ScrollbarProps.scrollLocation;
  },

  get minOffset() {
    return ScrollbarProps.minOffset;
  },

  get maxOffset() {
    return ScrollbarProps.maxOffset;
  },

  get rtlEnabled() {
    return BaseWidgetProps.rtlEnabled;
  },

  get showScrollbar() {
    return ScrollableSimulatedProps.showScrollbar;
  },

  get scrollByThumb() {
    return ScrollableSimulatedProps.scrollByThumb;
  },

  get bounceEnabled() {
    return ScrollableSimulatedProps.bounceEnabled;
  }

};
import { createRef as infernoCreateRef } from "inferno";
export class Scrollbar extends InfernoComponent {
  constructor(props) {
    super(props);
    this.scrollbarRef = infernoCreateRef();
    this.scrollRef = infernoCreateRef();
    this.rightScrollLocation = 0;
    this.prevScrollLocation = 0;
    this.thumbRef = infernoCreateRef();
    this.__getterCache = {};
    this.state = {
      pendingPointerUp: false,
      hovered: false,
      expanded: false
    };
    this.pointerDownEffect = this.pointerDownEffect.bind(this);
    this.pointerUpEffect = this.pointerUpEffect.bind(this);
    this.mouseEnterEffect = this.mouseEnterEffect.bind(this);
    this.mouseLeaveEffect = this.mouseLeaveEffect.bind(this);
    this.isThumb = this.isThumb.bind(this);
    this.isScrollbar = this.isScrollbar.bind(this);
    this.initHandler = this.initHandler.bind(this);
    this.moveHandler = this.moveHandler.bind(this);
    this.scrollStep = this.scrollStep.bind(this);
    this.moveTo = this.moveTo.bind(this);
    this.syncScrollLocation = this.syncScrollLocation.bind(this);
    this.moveToMouseLocation = this.moveToMouseLocation.bind(this);
  }

  createEffects() {
    return [new InfernoEffect(this.pointerDownEffect, []), new InfernoEffect(this.pointerUpEffect, []), new InfernoEffect(this.mouseEnterEffect, [this.props.showScrollbar]), new InfernoEffect(this.mouseLeaveEffect, [this.props.showScrollbar]), new InfernoEffect(this.syncScrollLocation, [this.props.containerHasSizes, this.props.scrollLocation, this.props.direction, this.props.rtlEnabled, this.props.maxOffset, this.props.scrollLocationChange])];
  }

  updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3;

    (_this$_effects$ = this._effects[2]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.showScrollbar]);
    (_this$_effects$2 = this._effects[3]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.showScrollbar]);
    (_this$_effects$3 = this._effects[4]) === null || _this$_effects$3 === void 0 ? void 0 : _this$_effects$3.update([this.props.containerHasSizes, this.props.scrollLocation, this.props.direction, this.props.rtlEnabled, this.props.maxOffset, this.props.scrollLocationChange]);
  }

  pointerDownEffect() {
    return subscribeToDXPointerDownEvent(this.thumbRef.current, () => {
      this.setState(__state_argument => ({
        pendingPointerUp: true
      }));
      this.setState(__state_argument => ({
        expanded: true
      }));
    });
  }

  pointerUpEffect() {
    return subscribeToDXPointerUpEvent(domAdapter.getDocument(), () => {
      this.setState(__state_argument => ({
        expanded: false
      }));
      this.setState(__state_argument => ({
        pendingPointerUp: false
      }));
    });
  }

  mouseEnterEffect() {
    if (this.isHoverMode) {
      return subscribeToMouseEnterEvent(this.scrollbarRef.current, () => {
        this.setState(__state_argument => ({
          hovered: true
        }));
      });
    }

    return undefined;
  }

  mouseLeaveEffect() {
    if (this.isHoverMode) {
      return subscribeToMouseLeaveEvent(this.scrollbarRef.current, () => {
        this.setState(__state_argument => ({
          hovered: false
        }));
      });
    }

    return undefined;
  }

  syncScrollLocation() {
    if (this.props.containerHasSizes) {
      var newScrollLocation = this.props.scrollLocation;

      if (this.isHorizontal && this.props.rtlEnabled) {
        if (this.props.maxOffset === 0) {
          this.rightScrollLocation = 0;
        }

        newScrollLocation = this.props.maxOffset - this.rightScrollLocation;
      }

      if (this.prevScrollLocation !== newScrollLocation) {
        this.moveTo(newScrollLocation);
      }
    }
  }

  get axis() {
    return this.isHorizontal ? "x" : "y";
  }

  get fullScrollProp() {
    return this.isHorizontal ? "scrollLeft" : "scrollTop";
  }

  get dimension() {
    return this.isHorizontal ? "width" : "height";
  }

  get isHorizontal() {
    return this.props.direction === DIRECTION_HORIZONTAL;
  }

  moveToMouseLocation(event, offset) {
    var mouseLocation = event["page".concat(this.axis.toUpperCase())] - offset;
    var delta = mouseLocation / this.containerToContentRatio - this.props.containerSize / 2;
    this.moveTo(Math.round(-delta));
  }

  get scrollSize() {
    return Math.max(this.props.containerSize * this.containerToContentRatio, THUMB_MIN_SIZE);
  }

  get containerToContentRatio() {
    return this.props.contentSize ? this.props.containerSize / this.props.contentSize : this.props.containerSize;
  }

  get scrollRatio() {
    var scrollOffsetMax = Math.abs(this.props.maxOffset);

    if (scrollOffsetMax) {
      return (this.props.containerSize - this.scrollSize) / scrollOffsetMax;
    }

    return 1;
  }

  get scrollbarClasses() {
    var classesMap = {
      [SCROLLABLE_SCROLLBAR_CLASS]: true,
      ["dx-scrollbar-".concat(this.props.direction)]: true,
      [SCROLLABLE_SCROLLBAR_ACTIVE_CLASS]: this.state.expanded,
      [HOVER_ENABLED_STATE]: this.isExpandable,
      "dx-state-invisible": this.hidden,
      "dx-state-hover": this.isExpandable && this.state.hovered
    };
    return combineClasses(classesMap);
  }

  get thumbStyles() {
    if (this.__getterCache["thumbStyles"] !== undefined) {
      return this.__getterCache["thumbStyles"];
    }

    return this.__getterCache["thumbStyles"] = (() => {
      return {
        [this.dimension]: this.scrollSize || THUMB_MIN_SIZE,
        transform: this.isNeverMode ? "none" : this.thumbTransform
      };
    })();
  }

  get thumbTransform() {
    var translateValue = -this.props.scrollLocation * this.scrollRatio;

    if (this.isHorizontal) {
      return "translate(".concat(translateValue, "px, 0px)");
    }

    return "translate(0px, ".concat(translateValue, "px)");
  }

  get thumbClasses() {
    return combineClasses({
      [SCROLLABLE_SCROLL_CLASS]: true,
      "dx-state-invisible": !this.isThumbVisible
    });
  }

  get hidden() {
    return this.isNeverMode || this.props.maxOffset === 0 || this.props.containerSize < 15;
  }

  get isThumbVisible() {
    if (this.hidden) {
      return false;
    }

    if (this.isHoverMode) {
      return this.props.visible || this.state.hovered || this.state.pendingPointerUp;
    }

    if (this.isAlwaysMode) {
      return true;
    }

    return this.props.visible;
  }

  get isExpandable() {
    return (this.isHoverMode || this.isAlwaysMode) && this.props.scrollByThumb;
  }

  get isHoverMode() {
    return this.props.showScrollbar === ShowScrollbarMode.HOVER;
  }

  get isAlwaysMode() {
    return this.props.showScrollbar === ShowScrollbarMode.ALWAYS;
  }

  get isNeverMode() {
    return this.props.showScrollbar === ShowScrollbarMode.NEVER;
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  isThumb(element) {
    return this.scrollbarRef.current.querySelector(".".concat(SCROLLABLE_SCROLL_CLASS)) === element || this.scrollbarRef.current.querySelector(".".concat(SCROLLABLE_SCROLL_CONTENT_CLASS)) === element;
  }

  isScrollbar(element) {
    return element === this.scrollbarRef.current;
  }

  initHandler(event, thumbScrolling, offset) {
    var {
      target
    } = event.originalEvent;
    var scrollbarClicked = this.props.scrollByThumb && this.isScrollbar(target);

    if (scrollbarClicked) {
      this.moveToMouseLocation(event, offset);
    }

    if (thumbScrolling) {
      this.setState(__state_argument => ({
        expanded: true
      }));
    }
  }

  moveHandler(delta, minOffset, maxOffset, thumbScrolling) {
    var resultDelta = delta;

    if (thumbScrolling) {
      resultDelta = -Math.round(delta / this.containerToContentRatio);
    }

    var isOutBounds = !inRange(this.props.scrollLocation, maxOffset, minOffset);

    if (isOutBounds) {
      resultDelta *= OUT_BOUNDS_ACCELERATION;
    }

    this.scrollStep(resultDelta, minOffset, maxOffset);
  }

  scrollStep(delta, minOffset, maxOffset) {
    var moveToValue = this.props.scrollLocation + delta;
    this.moveTo(this.props.bounceEnabled ? moveToValue : clampIntoRange(moveToValue, minOffset, maxOffset));
  }

  moveTo(location) {
    var _this$props$scrollLoc, _this$props2;

    var scrollDelta = Math.abs(this.prevScrollLocation - location);
    this.prevScrollLocation = location;
    this.rightScrollLocation = this.props.maxOffset - location;
    (_this$props$scrollLoc = (_this$props2 = this.props).scrollLocationChange) === null || _this$props$scrollLoc === void 0 ? void 0 : _this$props$scrollLoc.call(_this$props2, {
      fullScrollProp: this.fullScrollProp,
      location: -location,
      needFireScroll: scrollDelta >= 1
    });
  }

  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();

    if (this.props["direction"] !== nextProps["direction"] || this.props["containerSize"] !== nextProps["containerSize"] || this.props["contentSize"] !== nextProps["contentSize"] || this.props["showScrollbar"] !== nextProps["showScrollbar"] || this.props["scrollLocation"] !== nextProps["scrollLocation"] || this.props["maxOffset"] !== nextProps["maxOffset"]) {
      this.__getterCache["thumbStyles"] = undefined;
    }
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      pendingPointerUp: this.state.pendingPointerUp,
      hovered: this.state.hovered,
      expanded: this.state.expanded,
      scrollbarRef: this.scrollbarRef,
      scrollRef: this.scrollRef,
      thumbRef: this.thumbRef,
      axis: this.axis,
      fullScrollProp: this.fullScrollProp,
      dimension: this.dimension,
      isHorizontal: this.isHorizontal,
      moveToMouseLocation: this.moveToMouseLocation,
      scrollSize: this.scrollSize,
      containerToContentRatio: this.containerToContentRatio,
      scrollRatio: this.scrollRatio,
      scrollbarClasses: this.scrollbarClasses,
      thumbStyles: this.thumbStyles,
      thumbTransform: this.thumbTransform,
      thumbClasses: this.thumbClasses,
      hidden: this.hidden,
      isThumbVisible: this.isThumbVisible,
      isExpandable: this.isExpandable,
      isHoverMode: this.isHoverMode,
      isAlwaysMode: this.isAlwaysMode,
      isNeverMode: this.isNeverMode,
      restAttributes: this.restAttributes
    });
  }

}
Scrollbar.defaultProps = ScrollbarPropsType;