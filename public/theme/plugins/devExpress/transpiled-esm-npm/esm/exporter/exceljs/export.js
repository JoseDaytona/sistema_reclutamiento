import { isDefined, isString, isDate, isObject, isFunction } from '../../core/utils/type';
import { ExportFormat } from './export_format';
import { MergedRangesManager } from './export_merged_ranges_manager';
import { extend } from '../../core/utils/extend';
import { ExportLoadPanel } from '../common/export_load_panel';
import { hasWindow } from '../../core/utils/window'; // docs.microsoft.com/en-us/office/troubleshoot/excel/determine-column-widths - "Description of how column widths are determined in Excel"

var MAX_DIGIT_WIDTH_IN_PIXELS = 7; // Calibri font with 11pt size
// support.office.com/en-us/article/change-the-column-width-and-row-height-72f5e3cc-994d-43e8-ae58-9774a0905f46 - "Column.Max - 255"
// support.office.com/en-us/article/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3 - "Column width limit - 255 characters"

var MAX_EXCEL_COLUMN_WIDTH = 255;
export var Export = {
  getFullOptions(options) {
    var fullOptions = extend({}, options);

    if (!(isDefined(fullOptions.worksheet) && isObject(fullOptions.worksheet))) {
      throw Error('The "worksheet" field must contain an object.');
    }

    if (!isDefined(fullOptions.topLeftCell)) {
      fullOptions.topLeftCell = {
        row: 1,
        column: 1
      };
    } else if (isString(fullOptions.topLeftCell)) {
      var {
        row,
        col
      } = fullOptions.worksheet.getCell(fullOptions.topLeftCell);
      fullOptions.topLeftCell = {
        row,
        column: col
      };
    }

    if (!isDefined(fullOptions.keepColumnWidths)) {
      fullOptions.keepColumnWidths = true;
    }

    if (!isDefined(fullOptions.loadPanel)) {
      fullOptions.loadPanel = {};
    }

    if (!isDefined(fullOptions.loadPanel.enabled)) {
      fullOptions.loadPanel.enabled = true;
    }

    return fullOptions;
  },

  convertDateForExcelJS(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  },

  setNumberFormat(excelCell, numberFormat) {
    excelCell.numFmt = numberFormat;
  },

  getCellStyles(dataProvider) {
    var styles = dataProvider.getStyles();
    styles.forEach(style => {
      var numberFormat = this.tryConvertToExcelNumberFormat(style.format, style.dataType);

      if (isDefined(numberFormat)) {
        numberFormat = numberFormat.replace(/&quot;/g, '"');
      }

      style.numberFormat = numberFormat;
    });
    return styles;
  },

  tryConvertToExcelNumberFormat(format, dataType) {
    var newFormat = ExportFormat.formatObjectConverter(format, dataType);
    var currency = newFormat.currency;
    format = newFormat.format;
    dataType = newFormat.dataType;
    return ExportFormat.convertFormat(format, newFormat.precision, dataType, currency);
  },

  setAlignment(excelCell, wrapText, horizontalAlignment) {
    excelCell.alignment = excelCell.alignment || {};

    if (isDefined(wrapText)) {
      excelCell.alignment.wrapText = wrapText;
    }

    if (isDefined(horizontalAlignment)) {
      excelCell.alignment.horizontal = horizontalAlignment;
    }

    excelCell.alignment.vertical = 'top';
  },

  setColumnsWidth(worksheet, widths, startColumnIndex) {
    if (!isDefined(widths)) {
      return;
    }

    for (var i = 0; i < widths.length; i++) {
      var columnWidth = widths[i];

      if (typeof columnWidth === 'number' && isFinite(columnWidth)) {
        worksheet.getColumn(startColumnIndex + i).width = Math.min(MAX_EXCEL_COLUMN_WIDTH, Math.floor(columnWidth / MAX_DIGIT_WIDTH_IN_PIXELS * 100) / 100);
      }
    }
  },

  export(options, helpers) {
    var _component$_getIntern;

    var {
      customizeCell,
      component,
      worksheet,
      topLeftCell,
      autoFilterEnabled,
      keepColumnWidths,
      selectedRowsOnly,
      loadPanel,
      mergeRowFieldValues,
      mergeColumnFieldValues
    } = options;
    var internalComponent = ((_component$_getIntern = component._getInternalInstance) === null || _component$_getIntern === void 0 ? void 0 : _component$_getIntern.call(component)) || component;
    var initialLoadPanelEnabledOption = internalComponent.option('loadPanel').enabled;
    component.option('loadPanel.enabled', false);

    if (loadPanel.enabled && hasWindow()) {
      var $targetElement = helpers._getLoadPanelTargetElement(component);

      var $container = helpers._getLoadPanelContainer(component);

      this._loadPanel = new ExportLoadPanel(component, $targetElement, $container, loadPanel);

      this._loadPanel.show();
    }

    var wrapText = !!component.option('wordWrapEnabled');
    worksheet.properties.outlineProperties = {
      summaryBelow: false,
      summaryRight: false
    };
    var cellRange = {
      from: {
        row: topLeftCell.row,
        column: topLeftCell.column
      },
      to: {
        row: topLeftCell.row,
        column: topLeftCell.column
      }
    };
    var dataProvider = component.getDataProvider(selectedRowsOnly);
    return new Promise(resolve => {
      dataProvider.ready().done(() => {
        var columns = dataProvider.getColumns();
        var dataRowsCount = dataProvider.getRowsCount();

        if (keepColumnWidths) {
          this.setColumnsWidth(worksheet, dataProvider.getColumnsWidths(), cellRange.from.column);
        }

        var mergedRangesManager = new MergedRangesManager(dataProvider, helpers, mergeRowFieldValues, mergeColumnFieldValues);
        var styles = this.getCellStyles(dataProvider);

        for (var rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
          var row = worksheet.getRow(cellRange.from.row + rowIndex);

          helpers._trySetOutlineLevel(dataProvider, row, rowIndex);

          this.exportRow(dataProvider, helpers, mergedRangesManager, rowIndex, columns.length, row, cellRange.from.column, customizeCell, wrapText, styles);

          if (rowIndex >= 1) {
            cellRange.to.row++;
          }
        }

        mergedRangesManager.applyMergedRages(worksheet);
        cellRange.to.column += columns.length > 0 ? columns.length - 1 : 0;
        var worksheetViewSettings = worksheet.views[0] || {};

        if (component.option('rtlEnabled')) {
          worksheetViewSettings.rightToLeft = true;
        }

        if (helpers._isFrozenZone(dataProvider)) {
          if (Object.keys(worksheetViewSettings).indexOf('state') === -1) {
            extend(worksheetViewSettings, helpers._getWorksheetFrozenState(dataProvider, cellRange));
          }

          helpers._trySetAutoFilter(dataProvider, worksheet, cellRange, autoFilterEnabled);
        }

        if (Object.keys(worksheetViewSettings).length > 0) {
          worksheet.views = [worksheetViewSettings];
        }

        resolve(cellRange);
      }).always(() => {
        component.option('loadPanel.enabled', initialLoadPanelEnabledOption);

        if (loadPanel.enabled && hasWindow()) {
          this._loadPanel.dispose();
        }
      });
    });
  },

  exportRow(dataProvider, helpers, mergedRangesManager, rowIndex, cellCount, row, startColumnIndex, customizeCell, wrapText, styles) {
    for (var cellIndex = 0; cellIndex < cellCount; cellIndex++) {
      var cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
      var excelCell = row.getCell(startColumnIndex + cellIndex);
      mergedRangesManager.updateMergedRanges(excelCell, rowIndex, cellIndex);
      var cellInfo = mergedRangesManager.findMergedCellInfo(rowIndex, cellIndex);

      if (isDefined(cellInfo) && excelCell !== cellInfo.masterCell) {
        excelCell.style = cellInfo.masterCell.style;
        excelCell.value = cellInfo.masterCell.value;
      } else {
        if (isDate(cellData.value)) {
          excelCell.value = this.convertDateForExcelJS(cellData.value);
        } else {
          excelCell.value = cellData.value;
        }

        if (isDefined(excelCell.value)) {
          var {
            bold,
            alignment: horizontalAlignment,
            numberFormat
          } = styles[dataProvider.getStyleId(rowIndex, cellIndex)];

          if (isDefined(numberFormat)) {
            this.setNumberFormat(excelCell, numberFormat);
          } else if (isString(excelCell.value) && /^[@=+-]/.test(excelCell.value)) {
            this.setNumberFormat(excelCell, '@');
          }

          helpers._trySetFont(excelCell, bold);

          this.setAlignment(excelCell, wrapText, horizontalAlignment);
        }
      }

      if (isFunction(customizeCell)) {
        customizeCell(helpers._getCustomizeCellOptions(excelCell, cellData.cellSourceData));
      }
    }
  }

};