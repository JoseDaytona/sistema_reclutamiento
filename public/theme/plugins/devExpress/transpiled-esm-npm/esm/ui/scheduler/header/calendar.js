import $ from '../../../core/renderer';
import devices from '../../../core/devices';
import registerComponent from '../../../core/component_registrator';
import Widget from '../../widget/ui.widget';
import Popover from '../../popover';
import Popup from '../../popup';
import Calendar from '../../calendar';
import Scrollable from '../../scroll_view/ui.scrollable';
var CALENDAR_CLASS = 'dx-scheduler-navigator-calendar';
var CALENDAR_POPOVER_CLASS = 'dx-scheduler-navigator-calendar-popover';
export default class SchedulerCalendar extends Widget {
  show(target) {
    if (!this._isMobileLayout()) {
      this._popover.option('target', target);
    }

    this._popover.show();

    this._calendar.focus();
  }

  hide() {
    this._popover.hide();
  }

  _keyboardHandler(opts) {
    this._calendar._keyboardHandler(opts);
  }

  _init() {
    super._init();

    this.$element();
  }

  _render() {
    super._render();

    this._renderPopover();
  }

  _renderPopover() {
    this.$element().addClass(CALENDAR_POPOVER_CLASS);

    var isMobileLayout = this._isMobileLayout();

    var overlayType = isMobileLayout ? Popup : Popover;
    this._popover = this._createComponent(this.$element(), overlayType, {
      contentTemplate: () => this._createPopupContent(),
      defaultOptionsRules: [{
        device: () => isMobileLayout,
        options: {
          fullScreen: true,
          showCloseButton: false,
          toolbarItems: [{
            shortcut: 'cancel'
          }]
        }
      }]
    });
  }

  _createPopupContent() {
    var result = $('<div>').addClass(CALENDAR_CLASS);
    this._calendar = this._createComponent(result, Calendar, this._getCalendarOptions());

    if (this._isMobileLayout()) {
      var scrollable = this._createScrollable(result);

      return scrollable.$element();
    }

    return result;
  }

  _createScrollable(content) {
    var result = this._createComponent('<div>', Scrollable, {
      direction: 'vertical'
    });

    result.$content().append(content);
    return result;
  }

  _getCalendarOptions() {
    return {
      value: this.option('date'),
      min: this.option('min'),
      max: this.option('max'),
      firstDayOfWeek: this.option('firstDayOfWeek'),
      focusStateEnabled: this.option('focusStateEnabled'),
      onValueChanged: this.option('onValueChanged'),
      skipFocusCheck: true,
      tabIndex: this.option('tabIndex'),
      width: '100%'
    };
  }

  _isMobileLayout() {
    return !devices.current().generic;
  }

}
registerComponent('dxSchedulerCalendarPopup', SchedulerCalendar);