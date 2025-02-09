import _extends from "@babel/runtime/helpers/esm/extends";
import dateUtils from "../../../../core/utils/date";
import { BaseWidgetProps } from "../../common/base_props";
export var WorkSpaceProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(BaseWidgetProps), Object.getOwnPropertyDescriptors({
  intervalCount: 1,

  get groups() {
    return [];
  },

  groupByDate: false,
  groupOrientation: "horizontal",
  crossScrollingEnabled: false,
  startDayHour: 0,
  endDayHour: 24,
  firstDayOfWeek: 0,
  hoursInterval: 0.5,
  showAllDayPanel: false,
  allDayPanelExpanded: false,
  allowMultipleCellSelection: true,

  get indicatorTime() {
    return new Date();
  },

  get indicatorUpdateInterval() {
    return 5 * dateUtils.dateToMilliseconds("minute");
  },

  shadeUntilCurrentTime: true,

  get selectedCellData() {
    return [];
  },

  get scrolling() {
    return {
      mode: "standard"
    };
  },

  cellDuration: 30,
  showCurrentTimeIndicator: true,
  type: "week"
})));
export var CurrentViewConfigType = {
  get intervalCount() {
    return WorkSpaceProps.intervalCount;
  },

  get groups() {
    return WorkSpaceProps.groups;
  },

  get groupByDate() {
    return WorkSpaceProps.groupByDate;
  },

  get groupOrientation() {
    return WorkSpaceProps.groupOrientation;
  },

  get crossScrollingEnabled() {
    return WorkSpaceProps.crossScrollingEnabled;
  },

  get startDayHour() {
    return WorkSpaceProps.startDayHour;
  },

  get endDayHour() {
    return WorkSpaceProps.endDayHour;
  },

  get firstDayOfWeek() {
    return WorkSpaceProps.firstDayOfWeek;
  },

  get hoursInterval() {
    return WorkSpaceProps.hoursInterval;
  },

  get showAllDayPanel() {
    return WorkSpaceProps.showAllDayPanel;
  },

  get allDayPanelExpanded() {
    return WorkSpaceProps.allDayPanelExpanded;
  },

  get allowMultipleCellSelection() {
    return WorkSpaceProps.allowMultipleCellSelection;
  },

  get indicatorTime() {
    return WorkSpaceProps.indicatorTime;
  },

  get indicatorUpdateInterval() {
    return WorkSpaceProps.indicatorUpdateInterval;
  },

  get shadeUntilCurrentTime() {
    return WorkSpaceProps.shadeUntilCurrentTime;
  },

  get selectedCellData() {
    return WorkSpaceProps.selectedCellData;
  },

  get scrolling() {
    return WorkSpaceProps.scrolling;
  },

  get cellDuration() {
    return WorkSpaceProps.cellDuration;
  },

  get showCurrentTimeIndicator() {
    return WorkSpaceProps.showCurrentTimeIndicator;
  },

  get type() {
    return WorkSpaceProps.type;
  },

  get focusStateEnabled() {
    return WorkSpaceProps.focusStateEnabled;
  },

  get tabIndex() {
    return WorkSpaceProps.tabIndex;
  }

};