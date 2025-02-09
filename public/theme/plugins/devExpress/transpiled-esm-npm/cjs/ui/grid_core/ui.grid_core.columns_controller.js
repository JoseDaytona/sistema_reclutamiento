"use strict";

exports.columnsControllerModule = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));

var _variable_wrapper = _interopRequireDefault(require("../../core/utils/variable_wrapper"));

var _data = require("../../core/utils/data");

var _type = require("../../core/utils/type");

var _iterator = require("../../core/utils/iterator");

var _position = require("../../core/utils/position");

var _extend = require("../../core/utils/extend");

var _array = require("../../core/utils/array");

var _config = _interopRequireDefault(require("../../core/config"));

var _object = require("../../core/utils/object");

var _ui = _interopRequireDefault(require("../widget/ui.errors"));

var _uiGrid_core = _interopRequireDefault(require("./ui.grid_core.modules"));

var _uiGrid_core2 = _interopRequireDefault(require("./ui.grid_core.utils"));

var _inflector = require("../../core/utils/inflector");

var _date_serialization = _interopRequireDefault(require("../../core/utils/date_serialization"));

var _number = _interopRequireDefault(require("../../localization/number"));

var _date = _interopRequireDefault(require("../../localization/date"));

var _message = _interopRequireDefault(require("../../localization/message"));

var _deferred = require("../../core/utils/deferred");

var _abstract_store = _interopRequireDefault(require("../../data/abstract_store"));

var _data_source = require("../../data/data_source/data_source");

var _utils = require("../../data/data_source/utils");

var _filtering = _interopRequireDefault(require("../shared/filtering"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var USER_STATE_FIELD_NAMES_15_1 = ['filterValues', 'filterType', 'fixed', 'fixedPosition'];
var USER_STATE_FIELD_NAMES = ['visibleIndex', 'dataField', 'name', 'dataType', 'width', 'visible', 'sortOrder', 'lastSortOrder', 'sortIndex', 'groupIndex', 'filterValue', 'selectedFilterOperation', 'added'].concat(USER_STATE_FIELD_NAMES_15_1);
var IGNORE_COLUMN_OPTION_NAMES = {
  visibleWidth: true,
  bestFitWidth: true,
  bufferedFilterValue: true
};
var COMMAND_EXPAND_CLASS = 'dx-command-expand';
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991
/* IE11 */
;
var GROUP_COMMAND_COLUMN_NAME = 'groupExpand';
var regExp = /columns\[(\d+)\]\.?/gi;
var globalColumnId = 1;
var columnsControllerModule = {
  defaultOptions: function defaultOptions() {
    return {
      commonColumnSettings: {
        allowFiltering: true,
        allowHiding: true,
        allowSorting: true,
        allowEditing: true,
        encodeHtml: true,
        trueText: _message.default.format('dxDataGrid-trueText'),
        falseText: _message.default.format('dxDataGrid-falseText')
      },
      allowColumnReordering: false,
      allowColumnResizing: false,
      columnResizingMode: 'nextColumn',
      columnMinWidth: undefined,
      columnWidth: undefined,
      adaptColumnWidthByRatio: true,
      columns: undefined,

      /**
       * @name dxDataGridColumn.grouped
       * @type boolean
       * @hidden
       * @default false
       */

      /**
       * @name dxDataGridColumn.resized
       * @type function
       * @hidden
       * @default undefined
       */

      /**
       * @name dxDataGridOptions.regenerateColumnsByVisibleItems
       * @type boolean
       * @hidden
       * @default false
       */
      regenerateColumnsByVisibleItems: false,
      customizeColumns: null,
      dateSerializationFormat: undefined
    };
  },
  controllers: {
    columns: _uiGrid_core.default.Controller.inherit(function () {
      var DEFAULT_COLUMN_OPTIONS = {
        visible: true,
        showInColumnChooser: true
      };
      var DATATYPE_OPERATIONS = {
        'number': ['=', '<>', '<', '>', '<=', '>=', 'between'],
        'string': ['contains', 'notcontains', 'startswith', 'endswith', '=', '<>'],
        'date': ['=', '<>', '<', '>', '<=', '>=', 'between'],
        'datetime': ['=', '<>', '<', '>', '<=', '>=', 'between']
      };
      var COLUMN_INDEX_OPTIONS = {
        visibleIndex: true,
        groupIndex: true,
        grouped: true,
        sortIndex: true,
        sortOrder: true
      };
      var GROUP_LOCATION = 'group';
      var COLUMN_CHOOSER_LOCATION = 'columnChooser';

      var setFilterOperationsAsDefaultValues = function setFilterOperationsAsDefaultValues(column) {
        column.filterOperations = column.defaultFilterOperations;
      };

      var createColumn = function createColumn(that, columnOptions, userStateColumnOptions, bandColumn) {
        var commonColumnOptions = {};

        if (columnOptions) {
          if ((0, _type.isString)(columnOptions)) {
            columnOptions = {
              dataField: columnOptions
            };
          }

          that.setName(columnOptions);
          var result = {};

          if (columnOptions.command) {
            result = (0, _object.deepExtendArraySafe)(commonColumnOptions, columnOptions);
          } else {
            commonColumnOptions = that.getCommonSettings(columnOptions);

            if (userStateColumnOptions && userStateColumnOptions.name && userStateColumnOptions.dataField) {
              columnOptions = (0, _extend.extend)({}, columnOptions, {
                dataField: userStateColumnOptions.dataField
              });
            }

            var calculatedColumnOptions = that._createCalculatedColumnOptions(columnOptions, bandColumn);

            if (!columnOptions.type) {
              result = {
                headerId: "dx-col-".concat(globalColumnId++)
              };
            }

            result = (0, _object.deepExtendArraySafe)(result, DEFAULT_COLUMN_OPTIONS);
            (0, _object.deepExtendArraySafe)(result, commonColumnOptions);
            (0, _object.deepExtendArraySafe)(result, calculatedColumnOptions);
            (0, _object.deepExtendArraySafe)(result, columnOptions);
            (0, _object.deepExtendArraySafe)(result, {
              selector: null
            });
          }

          if (columnOptions.filterOperations === columnOptions.defaultFilterOperations) {
            setFilterOperationsAsDefaultValues(result);
          }

          return result;
        }
      };

      var createColumnsFromOptions = function createColumnsFromOptions(that, columnsOptions, bandColumn) {
        var result = [];

        if (columnsOptions) {
          (0, _iterator.each)(columnsOptions, function (index, columnOptions) {
            var userStateColumnOptions = that._columnsUserState && checkUserStateColumn(columnOptions, that._columnsUserState[index]) && that._columnsUserState[index];

            var column = createColumn(that, columnOptions, userStateColumnOptions, bandColumn);

            if (column) {
              if (bandColumn) {
                column.ownerBand = bandColumn;
              }

              result.push(column);

              if (column.columns) {
                result = result.concat(createColumnsFromOptions(that, column.columns, column));
                delete column.columns;
                column.hasColumns = true;
              }
            }
          });
        }

        return result;
      };

      var getParentBandColumns = function getParentBandColumns(columnIndex, columnParentByIndex) {
        var result = [];
        var parent = columnParentByIndex[columnIndex];

        while (parent) {
          result.unshift(parent);
          columnIndex = parent.index;
          parent = columnParentByIndex[columnIndex];
        }

        return result;
      };

      var _getChildrenByBandColumn = function getChildrenByBandColumn(columnIndex, columnChildrenByIndex, recursive) {
        var result = [];
        var children = columnChildrenByIndex[columnIndex];

        if (children) {
          for (var i = 0; i < children.length; i++) {
            var column = children[i];

            if (!(0, _type.isDefined)(column.groupIndex) || column.showWhenGrouped) {
              result.push(column);

              if (recursive && column.isBand) {
                result = result.concat(_getChildrenByBandColumn(column.index, columnChildrenByIndex, recursive));
              }
            }
          }
        }

        return result;
      };

      var getColumnByIndexes = function getColumnByIndexes(that, columnIndexes) {
        var result;
        var columns;
        var bandColumnsCache = that.getBandColumnsCache();

        var callbackFilter = function callbackFilter(column) {
          var ownerBand = result ? result.index : undefined;
          return column.ownerBand === ownerBand;
        };

        if (bandColumnsCache.isPlain) {
          result = that._columns[columnIndexes[0]];
        } else {
          columns = that._columns.filter(callbackFilter);

          for (var i = 0; i < columnIndexes.length; i++) {
            result = columns[columnIndexes[i]];

            if (result) {
              columns = that._columns.filter(callbackFilter);
            }
          }
        }

        return result;
      };

      var getColumnFullPath = function getColumnFullPath(that, column) {
        var result = [];
        var columns;
        var bandColumnsCache = that.getBandColumnsCache();

        var callbackFilter = function callbackFilter(item) {
          return item.ownerBand === column.ownerBand;
        };

        if (bandColumnsCache.isPlain) {
          var columnIndex = that._columns.indexOf(column);

          if (columnIndex >= 0) {
            result = ["columns[".concat(columnIndex, "]")];
          }
        } else {
          columns = that._columns.filter(callbackFilter);

          while (columns.length && columns.indexOf(column) !== -1) {
            result.unshift("columns[".concat(columns.indexOf(column), "]"));
            column = bandColumnsCache.columnParentByIndex[column.index];
            columns = column ? that._columns.filter(callbackFilter) : [];
          }
        }

        return result.join('.');
      };

      var calculateColspan = function calculateColspan(that, columnID) {
        var colspan = 0;
        var columns = that.getChildrenByBandColumn(columnID, true);
        (0, _iterator.each)(columns, function (_, column) {
          if (column.isBand) {
            column.colspan = column.colspan || calculateColspan(that, column.index);
            colspan += column.colspan || 1;
          } else {
            colspan += 1;
          }
        });
        return colspan;
      };

      var processBandColumns = function processBandColumns(that, columns, bandColumnsCache) {
        var rowspan;

        for (var i = 0; i < columns.length; i++) {
          var column = columns[i];

          if (column.visible || column.command) {
            if (column.isBand) {
              column.colspan = column.colspan || calculateColspan(that, column.index);
            }

            if (!column.isBand || !column.colspan) {
              rowspan = that.getRowCount();

              if (!column.command && (!(0, _type.isDefined)(column.groupIndex) || column.showWhenGrouped)) {
                rowspan -= getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex).length;
              }

              if (rowspan > 1) {
                column.rowspan = rowspan;
              }
            }
          }
        }
      };

      var getValueDataType = function getValueDataType(value) {
        var dataType = (0, _type.type)(value);

        if (dataType !== 'string' && dataType !== 'boolean' && dataType !== 'number' && dataType !== 'date' && dataType !== 'object') {
          dataType = undefined;
        }

        return dataType;
      };

      var getSerializationFormat = function getSerializationFormat(dataType, value) {
        switch (dataType) {
          case 'date':
          case 'datetime':
            return _date_serialization.default.getDateSerializationFormat(value);

          case 'number':
            if ((0, _type.isString)(value)) {
              return 'string';
            }

            if ((0, _type.isNumeric)(value)) {
              return null;
            }

        }
      };

      var updateSerializers = function updateSerializers(options, dataType) {
        if (!options.deserializeValue) {
          if (_uiGrid_core2.default.isDateType(dataType)) {
            options.deserializeValue = function (value) {
              return _date_serialization.default.deserializeDate(value);
            };

            options.serializeValue = function (value) {
              return (0, _type.isString)(value) ? value : _date_serialization.default.serializeDate(value, this.serializationFormat);
            };
          }

          if (dataType === 'number') {
            options.deserializeValue = function (value) {
              var parsedValue = parseFloat(value);
              return isNaN(parsedValue) ? value : parsedValue;
            };

            options.serializeValue = function (value, target) {
              if (target === 'filter') return value;
              return (0, _type.isDefined)(value) && this.serializationFormat === 'string' ? value.toString() : value;
            };
          }
        }
      };

      var getAlignmentByDataType = function getAlignmentByDataType(dataType, isRTL) {
        switch (dataType) {
          case 'number':
            return 'right';

          case 'boolean':
            return 'center';

          default:
            return (0, _position.getDefaultAlignment)(isRTL);
        }
      };

      var customizeTextForBooleanDataType = function customizeTextForBooleanDataType(e) {
        if (e.value === true) {
          return this.trueText || 'true';
        } else if (e.value === false) {
          return this.falseText || 'false';
        } else {
          return e.valueText || '';
        }
      };

      var getCustomizeTextByDataType = function getCustomizeTextByDataType(dataType) {
        if (dataType === 'boolean') {
          return customizeTextForBooleanDataType;
        }
      };

      var createColumnsFromDataSource = function createColumnsFromDataSource(that, dataSource) {
        var firstItems = that._getFirstItems(dataSource);

        var fieldName;
        var processedFields = {};
        var result = [];

        for (var i = 0; i < firstItems.length; i++) {
          if (firstItems[i]) {
            for (fieldName in firstItems[i]) {
              if (!(0, _type.isFunction)(firstItems[i][fieldName]) || _variable_wrapper.default.isWrapped(firstItems[i][fieldName])) {
                processedFields[fieldName] = true;
              }
            }
          }
        }

        for (fieldName in processedFields) {
          if (fieldName.indexOf('__') !== 0) {
            var column = createColumn(that, fieldName);
            result.push(column);
          }
        }

        return result;
      };

      var updateColumnIndexes = function updateColumnIndexes(that) {
        (0, _iterator.each)(that._columns, function (index, column) {
          column.index = index;
        });
        (0, _iterator.each)(that._columns, function (index, column) {
          if ((0, _type.isObject)(column.ownerBand)) {
            column.ownerBand = column.ownerBand.index;
          }
        });
        (0, _iterator.each)(that._commandColumns, function (index, column) {
          column.index = -(index + 1);
        });
      };

      var updateColumnGroupIndexes = function updateColumnGroupIndexes(that, currentColumn) {
        (0, _array.normalizeIndexes)(that._columns, 'groupIndex', currentColumn, function (column) {
          var grouped = column.grouped;
          delete column.grouped;
          return grouped;
        });
      };

      var updateColumnSortIndexes = function updateColumnSortIndexes(that, currentColumn) {
        (0, _iterator.each)(that._columns, function (index, column) {
          if ((0, _type.isDefined)(column.sortIndex) && !isSortOrderValid(column.sortOrder)) {
            delete column.sortIndex;
          }
        });
        (0, _array.normalizeIndexes)(that._columns, 'sortIndex', currentColumn, function (column) {
          return !(0, _type.isDefined)(column.groupIndex) && isSortOrderValid(column.sortOrder);
        });
      };

      var updateColumnVisibleIndexes = function updateColumnVisibleIndexes(that, currentColumn) {
        var key;
        var column;
        var bandColumns = {};
        var result = [];
        var bandColumnsCache = that.getBandColumnsCache();

        var columns = that._columns.filter(function (column) {
          return !column.command;
        });

        for (var i = 0; i < columns.length; i++) {
          column = columns[i];
          var parentBandColumns = getParentBandColumns(i, bandColumnsCache.columnParentByIndex);

          if (parentBandColumns.length) {
            var bandColumnIndex = parentBandColumns[parentBandColumns.length - 1].index;
            bandColumns[bandColumnIndex] = bandColumns[bandColumnIndex] || [];
            bandColumns[bandColumnIndex].push(column);
          } else {
            result.push(column);
          }
        }

        for (key in bandColumns) {
          (0, _array.normalizeIndexes)(bandColumns[key], 'visibleIndex', currentColumn);
        }

        (0, _array.normalizeIndexes)(result, 'visibleIndex', currentColumn);
      };

      var getColumnIndexByVisibleIndex = function getColumnIndexByVisibleIndex(that, visibleIndex, location) {
        var rowIndex = (0, _type.isObject)(visibleIndex) ? visibleIndex.rowIndex : null;
        var columns = location === GROUP_LOCATION ? that.getGroupColumns() : location === COLUMN_CHOOSER_LOCATION ? that.getChooserColumns() : that.getVisibleColumns(rowIndex);
        var column;
        visibleIndex = (0, _type.isObject)(visibleIndex) ? visibleIndex.columnIndex : visibleIndex;
        column = columns[visibleIndex];

        if (column && column.type === GROUP_COMMAND_COLUMN_NAME) {
          column = that._columns.filter(function (col) {
            return column.type === col.type;
          })[0] || column;
        }

        return column && (0, _type.isDefined)(column.index) ? column.index : -1;
      };

      var moveColumnToGroup = function moveColumnToGroup(that, column, groupIndex) {
        var groupColumns = that.getGroupColumns();
        var i;

        if (groupIndex >= 0) {
          for (i = 0; i < groupColumns.length; i++) {
            if (groupColumns[i].groupIndex >= groupIndex) {
              groupColumns[i].groupIndex++;
            }
          }
        } else {
          groupIndex = 0;

          for (i = 0; i < groupColumns.length; i++) {
            groupIndex = Math.max(groupIndex, groupColumns[i].groupIndex + 1);
          }
        }

        return groupIndex;
      };

      function checkUserStateColumn(column, userStateColumn) {
        return column && userStateColumn && (userStateColumn.name === column.name || !column.name) && (userStateColumn.dataField === column.dataField || column.name);
      }

      var applyUserState = function applyUserState(that) {
        var columnsUserState = that._columnsUserState;
        var ignoreColumnOptionNames = that._ignoreColumnOptionNames || [];
        var columns = that._columns;
        var columnCountById = {};
        var resultColumns = [];
        var allColumnsHaveState = true;
        var userStateColumnIndexes = [];
        var column;
        var userStateColumnIndex;
        var i;

        function applyFieldsState(column, userStateColumn) {
          if (!userStateColumn) return;

          for (var index = 0; index < USER_STATE_FIELD_NAMES.length; index++) {
            var fieldName = USER_STATE_FIELD_NAMES[index];
            if ((0, _array.inArray)(fieldName, ignoreColumnOptionNames) >= 0) continue;

            if (fieldName === 'dataType') {
              column[fieldName] = column[fieldName] || userStateColumn[fieldName];
            } else if ((0, _array.inArray)(fieldName, USER_STATE_FIELD_NAMES_15_1) >= 0) {
              if (fieldName in userStateColumn) {
                column[fieldName] = userStateColumn[fieldName];
              }
            } else {
              if (fieldName === 'selectedFilterOperation' && userStateColumn[fieldName]) {
                column.defaultSelectedFilterOperation = column[fieldName] || null;
              }

              column[fieldName] = userStateColumn[fieldName];
            }
          }
        }

        function findUserStateColumn(columnsUserState, column) {
          var id = column.name || column.dataField;
          var count = columnCountById[id] || 0;

          for (var j = 0; j < columnsUserState.length; j++) {
            if (checkUserStateColumn(column, columnsUserState[j])) {
              if (count) {
                count--;
              } else {
                columnCountById[id] = columnCountById[id] || 0;
                columnCountById[id]++;
                return j;
              }
            }
          }

          return -1;
        }

        if (columnsUserState) {
          for (i = 0; i < columns.length; i++) {
            userStateColumnIndex = findUserStateColumn(columnsUserState, columns[i]);
            allColumnsHaveState = allColumnsHaveState && userStateColumnIndex >= 0;
            userStateColumnIndexes.push(userStateColumnIndex);
          }

          for (i = 0; i < columns.length; i++) {
            column = columns[i];
            userStateColumnIndex = userStateColumnIndexes[i];

            if (that._hasUserState || allColumnsHaveState) {
              applyFieldsState(column, columnsUserState[userStateColumnIndex]);
            }

            if (userStateColumnIndex >= 0 && (0, _type.isDefined)(columnsUserState[userStateColumnIndex].initialIndex)) {
              resultColumns[userStateColumnIndex] = column;
            } else {
              resultColumns.push(column);
            }
          }

          var hasAddedBands = false;

          for (i = 0; i < columnsUserState.length; i++) {
            var columnUserState = columnsUserState[i];

            if (columnUserState.added && findUserStateColumn(columns, columnUserState) < 0) {
              column = createColumn(that, columnUserState.added);
              applyFieldsState(column, columnUserState);
              resultColumns.push(column);

              if (columnUserState.added.columns) {
                hasAddedBands = true;
              }
            }
          }

          if (hasAddedBands) {
            updateColumnIndexes(that);
            resultColumns = createColumnsFromOptions(that, resultColumns);
          }

          assignColumns(that, resultColumns);
        }
      };

      var updateIndexes = function updateIndexes(that, column) {
        updateColumnIndexes(that);
        updateColumnGroupIndexes(that, column);
        updateColumnSortIndexes(that, column);
        resetBandColumnsCache(that);
        updateColumnVisibleIndexes(that, column);
      };

      var resetColumnsCache = function resetColumnsCache(that) {
        that.resetColumnsCache();
      };

      function assignColumns(that, columns) {
        that._columns = columns;
        resetColumnsCache(that);
        that.updateColumnDataTypes();
      }

      var updateColumnChanges = function updateColumnChanges(that, changeType, optionName, columnIndex) {
        var columnChanges = that._columnChanges || {
          optionNames: {
            length: 0
          },
          changeTypes: {
            length: 0
          },
          columnIndex: columnIndex
        };
        optionName = optionName || 'all';
        optionName = optionName.split('.')[0];
        var changeTypes = columnChanges.changeTypes;

        if (changeType && !changeTypes[changeType]) {
          changeTypes[changeType] = true;
          changeTypes.length++;
        }

        var optionNames = columnChanges.optionNames;

        if (optionName && !optionNames[optionName]) {
          optionNames[optionName] = true;
          optionNames.length++;
        }

        if (columnIndex === undefined || columnIndex !== columnChanges.columnIndex) {
          delete columnChanges.columnIndex;
        }

        that._columnChanges = columnChanges;
        resetColumnsCache(that);
      };

      var fireColumnsChanged = function fireColumnsChanged(that) {
        var onColumnsChanging = that.option('onColumnsChanging');
        var columnChanges = that._columnChanges;
        var reinitOptionNames = ['dataField', 'lookup', 'dataType', 'columns'];

        var needReinit = function needReinit(options) {
          return options && reinitOptionNames.some(function (name) {
            return options[name];
          });
        };

        if (that.isInitialized() && !that._updateLockCount && columnChanges) {
          if (onColumnsChanging) {
            that._updateLockCount++;
            onColumnsChanging((0, _extend.extend)({
              component: that.component
            }, columnChanges));
            that._updateLockCount--;
          }

          that._columnChanges = undefined;

          if (needReinit(columnChanges.optionNames)) {
            that.reinit();
          } else {
            that.columnsChanged.fire(columnChanges);
          }
        }
      };

      var updateSortOrderWhenGrouping = function updateSortOrderWhenGrouping(that, column, groupIndex, prevGroupIndex) {
        var columnWasGrouped = prevGroupIndex >= 0;

        if (groupIndex >= 0) {
          if (!columnWasGrouped) {
            column.lastSortOrder = column.sortOrder;
          }
        } else {
          var sortMode = that.option('sorting.mode');
          var sortOrder = column.lastSortOrder;

          if (sortMode === 'single') {
            var sortedByAnotherColumn = that._columns.some(function (col) {
              return col !== column && (0, _type.isDefined)(col.sortIndex);
            });

            if (sortedByAnotherColumn) {
              sortOrder = undefined;
            }
          }

          column.sortOrder = sortOrder;
        }
      };

      var fireOptionChanged = function fireOptionChanged(that, options) {
        var value = options.value;
        var optionName = options.optionName;
        var prevValue = options.prevValue;
        var fullOptionName = options.fullOptionName;
        var fullOptionPath = "".concat(fullOptionName, ".").concat(optionName);

        if (!IGNORE_COLUMN_OPTION_NAMES[optionName] && that._skipProcessingColumnsChange !== fullOptionPath) {
          that._skipProcessingColumnsChange = fullOptionPath;

          that.component._notifyOptionChanged(fullOptionPath, value, prevValue);

          that._skipProcessingColumnsChange = false;
        }
      };

      var columnOptionCore = function columnOptionCore(that, column, optionName, value, notFireEvent) {
        var optionGetter = (0, _data.compileGetter)(optionName);
        var columnIndex = column.index;
        var columns;
        var changeType;
        var initialColumn;

        if (arguments.length === 3) {
          return optionGetter(column, {
            functionsAsIs: true
          });
        }

        var prevValue = optionGetter(column, {
          functionsAsIs: true
        });

        if (prevValue !== value) {
          if (optionName === 'groupIndex' || optionName === 'calculateGroupValue') {
            changeType = 'grouping';
            updateSortOrderWhenGrouping(that, column, value, prevValue);
          } else if (optionName === 'sortIndex' || optionName === 'sortOrder' || optionName === 'calculateSortValue') {
            changeType = 'sorting';
          } else {
            changeType = 'columns';
          }

          var optionSetter = (0, _data.compileSetter)(optionName);
          optionSetter(column, value, {
            functionsAsIs: true
          });
          var fullOptionName = getColumnFullPath(that, column);

          if (COLUMN_INDEX_OPTIONS[optionName]) {
            updateIndexes(that, column);
            value = optionGetter(column);
          }

          if (optionName === 'name' || optionName === 'allowEditing') {
            that._checkColumns();
          }

          fullOptionName && fireOptionChanged(that, {
            fullOptionName: fullOptionName,
            optionName: optionName,
            value: value,
            prevValue: prevValue
          });

          if (!(0, _type.isDefined)(prevValue) && !(0, _type.isDefined)(value) && optionName.indexOf('buffer') !== 0) {
            notFireEvent = true;
          }

          if (!notFireEvent) {
            // T346972
            if ((0, _array.inArray)(optionName, USER_STATE_FIELD_NAMES) < 0 && optionName !== 'visibleWidth') {
              columns = that.option('columns');
              initialColumn = that.getColumnByPath(fullOptionName, columns);

              if ((0, _type.isString)(initialColumn)) {
                initialColumn = columns[columnIndex] = {
                  dataField: initialColumn
                };
              }

              if (initialColumn && checkUserStateColumn(initialColumn, column)) {
                optionSetter(initialColumn, value, {
                  functionsAsIs: true
                });
              }
            }

            updateColumnChanges(that, changeType, optionName, columnIndex);
          } else {
            resetColumnsCache(that);
          }
        }
      };

      function isSortOrderValid(sortOrder) {
        return sortOrder === 'asc' || sortOrder === 'desc';
      }

      var addExpandColumn = function addExpandColumn(that) {
        var options = that._getExpandColumnOptions();

        that.addCommandColumn(options);
      };

      var defaultSetCellValue = function defaultSetCellValue(data, value) {
        var path = this.dataField.split('.');
        var dotCount = path.length - 1;

        if (this.serializeValue) {
          value = this.serializeValue(value);
        }

        for (var i = 0; i < dotCount; i++) {
          var name = path[i];
          data = data[name] = data[name] || {};
        }

        data[path[dotCount]] = value;
      };

      var getDataColumns = function getDataColumns(columns, rowIndex, bandColumnID) {
        var result = [];
        rowIndex = rowIndex || 0;
        columns[rowIndex] && (0, _iterator.each)(columns[rowIndex], function (_, column) {
          if (column.ownerBand === bandColumnID || column.type === GROUP_COMMAND_COLUMN_NAME) {
            if (!column.isBand || !column.colspan) {
              if (!column.command || rowIndex < 1) {
                result.push(column);
              }
            } else {
              result.push.apply(result, getDataColumns(columns, rowIndex + 1, column.index));
            }
          }
        });
        return result;
      };

      var _getRowCount = function getRowCount(that) {
        var rowCount = 1;
        var bandColumnsCache = that.getBandColumnsCache();
        var columnParentByIndex = bandColumnsCache.columnParentByIndex;

        that._columns.forEach(function (column) {
          var parents = getParentBandColumns(column.index, columnParentByIndex);
          var invisibleParents = parents.filter(function (column) {
            return !column.visible;
          });

          if (column.visible && !invisibleParents.length) {
            rowCount = Math.max(rowCount, parents.length + 1);
          }
        });

        return rowCount;
      };

      var isCustomCommandColumn = function isCustomCommandColumn(that, commandColumn) {
        return !!that._columns.filter(function (column) {
          return column.type === commandColumn.type;
        }).length;
      };

      var getFixedPosition = function getFixedPosition(that, column) {
        var rtlEnabled = that.option('rtlEnabled');

        if (column.command && !isCustomCommandColumn(that, column) || !column.fixedPosition) {
          return rtlEnabled ? 'right' : 'left';
        }

        return column.fixedPosition;
      };

      var processExpandColumns = function processExpandColumns(columns, expandColumns, type, columnIndex) {
        var customColumnIndex;
        var rowCount = this.getRowCount();
        var rowspan = columns[columnIndex] && columns[columnIndex].rowspan;
        var expandColumnsByType = expandColumns.filter(function (column) {
          return column.type === type;
        });
        columns.forEach(function (column, index) {
          if (column.type === type) {
            customColumnIndex = index;
            rowspan = columns[index + 1] ? columns[index + 1].rowspan : rowCount;
          }
        });

        if (rowspan > 1) {
          expandColumnsByType = (0, _iterator.map)(expandColumnsByType, function (expandColumn) {
            return (0, _extend.extend)({}, expandColumn, {
              rowspan: rowspan
            });
          });
        }

        expandColumnsByType.unshift.apply(expandColumnsByType, (0, _type.isDefined)(customColumnIndex) ? [customColumnIndex, 1] : [columnIndex, 0]);
        columns.splice.apply(columns, expandColumnsByType);
        return rowspan || 1;
      };

      var digitsCount = function digitsCount(number) {
        var i;

        for (i = 0; number > 1; i++) {
          number /= 10;
        }

        return i;
      };

      var numberToString = function numberToString(number, digitsCount) {
        var str = number ? number.toString() : '0';

        while (str.length < digitsCount) {
          str = '0' + str;
        }

        return str;
      };

      var mergeColumns = function mergeColumns(that, columns, commandColumns, needToExtend) {
        var column;
        var commandColumnIndex;
        var result = columns.slice().map(function (column) {
          return (0, _extend.extend)({}, column);
        });

        var isColumnFixing = that._isColumnFixing();

        var defaultCommandColumns = commandColumns.slice().map(function (column) {
          return (0, _extend.extend)({
            fixed: isColumnFixing
          }, column);
        });

        var getCommandColumnIndex = function getCommandColumnIndex(column) {
          return commandColumns.reduce(function (result, commandColumn, index) {
            var columnType = needToExtend && column.type === GROUP_COMMAND_COLUMN_NAME ? 'expand' : column.type;
            return commandColumn.type === columnType || commandColumn.command === column.command ? index : result;
          }, -1);
        };

        var callbackFilter = function callbackFilter(commandColumn) {
          return commandColumn.command !== commandColumns[commandColumnIndex].command;
        };

        for (var i = 0; i < columns.length; i++) {
          column = columns[i];
          commandColumnIndex = column && (column.type || column.command) ? getCommandColumnIndex(column) : -1;

          if (commandColumnIndex >= 0) {
            if (needToExtend) {
              result[i] = (0, _extend.extend)({
                fixed: isColumnFixing
              }, commandColumns[commandColumnIndex], column);

              if (column.type !== GROUP_COMMAND_COLUMN_NAME) {
                defaultCommandColumns = defaultCommandColumns.filter(callbackFilter);
              }
            } else {
              var columnOptions = {
                visibleIndex: column.visibleIndex,
                index: column.index,
                headerId: column.headerId,
                allowFixing: column.groupIndex === 0,
                allowReordering: column.groupIndex === 0,
                groupIndex: column.groupIndex
              };
              result[i] = (0, _extend.extend)({}, column, commandColumns[commandColumnIndex], column.type === GROUP_COMMAND_COLUMN_NAME && columnOptions);
            }
          }
        }

        if (columns.length && needToExtend && defaultCommandColumns.length) {
          result = result.concat(defaultCommandColumns);
        }

        return result;
      };

      var isColumnFixed = function isColumnFixed(that, column) {
        return (0, _type.isDefined)(column.fixed) || !column.type ? column.fixed : that._isColumnFixing();
      };

      var convertOwnerBandToColumnReference = function convertOwnerBandToColumnReference(columns) {
        columns.forEach(function (column) {
          if ((0, _type.isDefined)(column.ownerBand)) {
            column.ownerBand = columns[column.ownerBand];
          }
        });
      };

      var resetBandColumnsCache = function resetBandColumnsCache(that) {
        that._bandColumnsCache = undefined;
      };

      var findColumn = function findColumn(columns, identifier) {
        var identifierOptionName = (0, _type.isString)(identifier) && identifier.substr(0, identifier.indexOf(':'));
        var column;
        if (identifier === undefined) return;

        if (identifierOptionName) {
          identifier = identifier.substr(identifierOptionName.length + 1);
        }

        if (identifierOptionName) {
          column = columns.filter(function (column) {
            return '' + column[identifierOptionName] === identifier;
          })[0];
        } else {
          ['index', 'name', 'dataField', 'caption'].some(function (optionName) {
            column = columns.filter(function (column) {
              return column[optionName] === identifier;
            })[0];
            return !!column;
          });
        }

        return column;
      };

      var sortColumns = function sortColumns(columns, sortOrder) {
        if (sortOrder !== 'asc' && sortOrder !== 'desc') {
          return columns;
        }

        var sign = sortOrder === 'asc' ? 1 : -1;
        columns.sort(function (column1, column2) {
          var caption1 = column1.caption || '';
          var caption2 = column2.caption || '';
          return sign * caption1.localeCompare(caption2);
        });
        return columns;
      };

      var strictParseNumber = function strictParseNumber(text, format) {
        var parsedValue = _number.default.parse(text, format);

        if ((0, _type.isNumeric)(parsedValue)) {
          var formattedValue = _number.default.format(parsedValue, format);

          var formattedValueWithDefaultFormat = _number.default.format(parsedValue, 'decimal');

          if (formattedValue === text || formattedValueWithDefaultFormat === text) {
            return parsedValue;
          }
        }
      };

      return {
        _getExpandColumnOptions: function _getExpandColumnOptions() {
          return {
            type: 'expand',
            command: 'expand',
            width: 'auto',
            cssClass: COMMAND_EXPAND_CLASS,
            allowEditing: false,
            // T165142
            allowGrouping: false,
            allowSorting: false,
            allowResizing: false,
            allowReordering: false,
            allowHiding: false
          };
        },
        _getFirstItems: function _getFirstItems(dataSource) {
          var groupsCount;
          var items = [];

          var getFirstItemsCore = function getFirstItemsCore(items, groupsCount) {
            if (!items || !groupsCount) {
              return items;
            }

            for (var i = 0; i < items.length; i++) {
              var childItems = getFirstItemsCore(items[i].items || items[i].collapsedItems, groupsCount - 1);

              if (childItems && childItems.length) {
                return childItems;
              }
            }
          };

          if (dataSource && dataSource.items().length > 0) {
            groupsCount = _uiGrid_core2.default.normalizeSortingInfo(dataSource.group()).length;
            items = getFirstItemsCore(dataSource.items(), groupsCount) || [];
          }

          return items;
        },
        _endUpdateCore: function _endUpdateCore() {
          !this._skipProcessingColumnsChange && fireColumnsChanged(this);
        },
        init: function init() {
          var that = this;
          var columns = that.option('columns');
          that._commandColumns = that._commandColumns || [];
          that._columns = that._columns || [];
          that._isColumnsFromOptions = !!columns;

          if (that._isColumnsFromOptions) {
            assignColumns(that, columns ? createColumnsFromOptions(that, columns) : []);
            applyUserState(that);
          } else {
            assignColumns(that, that._columnsUserState ? createColumnsFromOptions(that, that._columnsUserState) : that._columns);
          }

          addExpandColumn(that);

          if (that._dataSourceApplied) {
            that.applyDataSource(that._dataSource, true);
          } else {
            updateIndexes(that);
          }

          that._checkColumns();
        },
        callbackNames: function callbackNames() {
          return ['columnsChanged'];
        },
        getColumnByPath: function getColumnByPath(path, columns) {
          var that = this;
          var column;
          var columnIndexes = [];
          path.replace(regExp, function (_, columnIndex) {
            columnIndexes.push(parseInt(columnIndex));
            return '';
          });

          if (columnIndexes.length) {
            if (columns) {
              column = columnIndexes.reduce(function (column, index) {
                return column && column.columns && column.columns[index];
              }, {
                columns: columns
              });
            } else {
              column = getColumnByIndexes(that, columnIndexes);
            }
          }

          return column;
        },
        optionChanged: function optionChanged(args) {
          var needUpdateRequireResize;

          switch (args.name) {
            case 'adaptColumnWidthByRatio':
              args.handled = true;
              break;

            case 'dataSource':
              if (args.value !== args.previousValue && !this.option('columns') && (!Array.isArray(args.value) || !Array.isArray(args.previousValue))) {
                this._columns = [];
              }

              break;

            case 'columns':
              needUpdateRequireResize = this._skipProcessingColumnsChange;
              args.handled = true;

              if (!this._skipProcessingColumnsChange) {
                if (args.name === args.fullName) {
                  this._columnsUserState = null;
                  this._ignoreColumnOptionNames = null;
                  this.init();
                } else {
                  this._columnOptionChanged(args);

                  needUpdateRequireResize = true;
                }
              }

              if (needUpdateRequireResize) {
                this._updateRequireResize(args);
              }

              break;

            case 'commonColumnSettings':
            case 'columnAutoWidth':
            case 'allowColumnResizing':
            case 'allowColumnReordering':
            case 'columnFixing':
            case 'grouping':
            case 'groupPanel':
            case 'regenerateColumnsByVisibleItems':
            case 'customizeColumns':
            case 'columnHidingEnabled':
            case 'dateSerializationFormat':
            case 'columnResizingMode':
            case 'columnMinWidth':
            case 'columnWidth':
              {
                args.handled = true;
                var ignoreColumnOptionNames = args.fullName === 'columnWidth' && ['width'];
                this.reinit(ignoreColumnOptionNames);
                break;
              }

            case 'rtlEnabled':
              this.reinit();
              break;

            default:
              this.callBase(args);
          }
        },
        _columnOptionChanged: function _columnOptionChanged(args) {
          var columnOptionValue = {};
          var column = this.getColumnByPath(args.fullName);
          var columnOptionName = args.fullName.replace(regExp, '');

          if (column) {
            if (columnOptionName) {
              columnOptionValue[columnOptionName] = args.value;
            } else {
              columnOptionValue = args.value;
            }

            this._skipProcessingColumnsChange = args.fullName;
            this.columnOption(column.index, columnOptionValue);
            this._skipProcessingColumnsChange = false;
          }
        },
        _updateRequireResize: function _updateRequireResize(args) {
          var component = this.component;

          if (args.fullName.replace(regExp, '') === 'width' && component._updateLockCount) {
            component._requireResize = true;
          }
        },
        publicMethods: function publicMethods() {
          return ['addColumn', 'deleteColumn', 'columnOption', 'columnCount', 'clearSorting', 'clearGrouping', 'getVisibleColumns', 'getVisibleColumnIndex'];
        },
        applyDataSource: function applyDataSource(dataSource, forceApplying) {
          var that = this;
          var isDataSourceLoaded = dataSource && dataSource.isLoaded();
          that._dataSource = dataSource;

          if (!that._dataSourceApplied || that._dataSourceColumnsCount === 0 || forceApplying || that.option('regenerateColumnsByVisibleItems')) {
            if (isDataSourceLoaded) {
              if (!that._isColumnsFromOptions) {
                var columnsFromDataSource = createColumnsFromDataSource(that, dataSource);

                if (columnsFromDataSource.length) {
                  assignColumns(that, columnsFromDataSource);
                  that._dataSourceColumnsCount = that._columns.length;
                  applyUserState(that);
                }
              }

              return that.updateColumns(dataSource, forceApplying);
            } else {
              that._dataSourceApplied = false;
            }
          } else if (isDataSourceLoaded && !that.isAllDataTypesDefined(true) && that.updateColumnDataTypes(dataSource)) {
            updateColumnChanges(that, 'columns');
            fireColumnsChanged(that);
            return new _deferred.Deferred().reject().promise();
          }
        },
        reset: function reset() {
          this._dataSourceApplied = false;
          this._dataSourceColumnsCount = undefined;
          this.reinit();
        },
        resetColumnsCache: function resetColumnsCache() {
          var that = this;
          that._visibleColumns = undefined;
          that._fixedColumns = undefined;
          that._rowCount = undefined;
          resetBandColumnsCache(that);
        },
        reinit: function reinit(ignoreColumnOptionNames) {
          this._columnsUserState = this.getUserState();
          this._ignoreColumnOptionNames = ignoreColumnOptionNames || null;
          this.init();

          if (ignoreColumnOptionNames) {
            this._ignoreColumnOptionNames = null;
          }
        },
        isInitialized: function isInitialized() {
          return !!this._columns.length || !!this.option('columns');
        },
        isDataSourceApplied: function isDataSourceApplied() {
          return this._dataSourceApplied;
        },
        getCommonSettings: function getCommonSettings(column) {
          var commonColumnSettings = (!column || !column.type) && this.option('commonColumnSettings') || {};
          var groupingOptions = this.option('grouping') || {};
          var groupPanelOptions = this.option('groupPanel') || {};
          return (0, _extend.extend)({
            allowFixing: this.option('columnFixing.enabled'),
            allowResizing: this.option('allowColumnResizing') || undefined,
            allowReordering: this.option('allowColumnReordering'),
            minWidth: this.option('columnMinWidth'),
            width: this.option('columnWidth'),
            autoExpandGroup: groupingOptions.autoExpandAll,
            allowCollapsing: groupingOptions.allowCollapsing,
            allowGrouping: groupPanelOptions.allowColumnDragging && groupPanelOptions.visible || groupingOptions.contextMenuEnabled
          }, commonColumnSettings);
        },
        isColumnOptionUsed: function isColumnOptionUsed(optionName) {
          for (var i = 0; i < this._columns.length; i++) {
            if (this._columns[i][optionName]) {
              return true;
            }
          }
        },
        isAllDataTypesDefined: function isAllDataTypesDefined(checkSerializers) {
          var columns = this._columns;

          if (!columns.length) {
            return false;
          }

          for (var i = 0; i < columns.length; i++) {
            if (!columns[i].dataField && columns[i].calculateCellValue === columns[i].defaultCalculateCellValue) {
              continue;
            }

            if (!columns[i].dataType || checkSerializers && columns[i].deserializeValue && columns[i].serializationFormat === undefined) {
              return false;
            }
          }

          return true;
        },
        getColumns: function getColumns() {
          return this._columns;
        },
        isBandColumnsUsed: function isBandColumnsUsed() {
          return this.getColumns().some(function (column) {
            return column.isBand;
          });
        },
        getGroupColumns: function getGroupColumns() {
          var result = [];
          (0, _iterator.each)(this._columns, function () {
            var column = this;

            if ((0, _type.isDefined)(column.groupIndex)) {
              result[column.groupIndex] = column;
            }
          });
          return result;
        },
        getVisibleColumns: function getVisibleColumns(rowIndex) {
          this._visibleColumns = this._visibleColumns || this._getVisibleColumnsCore();
          rowIndex = (0, _type.isDefined)(rowIndex) ? rowIndex : this._visibleColumns.length - 1;
          return this._visibleColumns[rowIndex] || [];
        },
        getFixedColumns: function getFixedColumns(rowIndex) {
          this._fixedColumns = this._fixedColumns || this._getFixedColumnsCore();
          rowIndex = (0, _type.isDefined)(rowIndex) ? rowIndex : this._fixedColumns.length - 1;
          return this._fixedColumns[rowIndex] || [];
        },
        getFilteringColumns: function getFilteringColumns() {
          return this.getColumns().filter(function (item) {
            return (item.dataField || item.name) && (item.allowFiltering || item.allowHeaderFiltering);
          }).map(function (item) {
            var field = (0, _extend.extend)(true, {}, item);

            if (!(0, _type.isDefined)(field.dataField)) {
              field.dataField = field.name;
            }

            field.filterOperations = item.filterOperations !== item.defaultFilterOperations ? field.filterOperations : null;
            return field;
          });
        },
        getColumnIndexOffset: function getColumnIndexOffset() {
          return 0;
        },
        _getFixedColumnsCore: function _getFixedColumnsCore() {
          var that = this;
          var result = [];
          var rowCount = that.getRowCount();

          var isColumnFixing = that._isColumnFixing();

          var transparentColumn = {
            command: 'transparent'
          };
          var transparentColspan = 0;
          var notFixedColumnCount;
          var transparentColumnIndex;
          var lastFixedPosition;

          if (isColumnFixing) {
            for (var i = 0; i <= rowCount; i++) {
              notFixedColumnCount = 0;
              lastFixedPosition = null;
              transparentColumnIndex = null;
              var visibleColumns = that.getVisibleColumns(i, true);

              for (var j = 0; j < visibleColumns.length; j++) {
                var prevColumn = visibleColumns[j - 1];
                var column = visibleColumns[j];

                if (!column.fixed) {
                  if (i === 0) {
                    if (column.isBand && column.colspan) {
                      transparentColspan += column.colspan;
                    } else {
                      transparentColspan++;
                    }
                  }

                  notFixedColumnCount++;

                  if (!(0, _type.isDefined)(transparentColumnIndex)) {
                    transparentColumnIndex = j;
                  }
                } else if (prevColumn && prevColumn.fixed && getFixedPosition(that, prevColumn) !== getFixedPosition(that, column)) {
                  if (!(0, _type.isDefined)(transparentColumnIndex)) {
                    transparentColumnIndex = j;
                  }
                } else {
                  lastFixedPosition = column.fixedPosition;
                }
              }

              if (i === 0 && (notFixedColumnCount === 0 || notFixedColumnCount >= visibleColumns.length)) {
                return [];
              }

              if (!(0, _type.isDefined)(transparentColumnIndex)) {
                transparentColumnIndex = lastFixedPosition === 'right' ? 0 : visibleColumns.length;
              }

              result[i] = visibleColumns.slice(0);

              if (!transparentColumn.colspan) {
                transparentColumn.colspan = transparentColspan;
              }

              result[i].splice(transparentColumnIndex, notFixedColumnCount, transparentColumn);
            }
          }

          return result.map(function (columns) {
            return columns.map(function (column) {
              var newColumn = _extends({}, column);

              if (newColumn.headerId) {
                newColumn.headerId += '-fixed';
              }

              return newColumn;
            });
          });
        },
        _isColumnFixing: function _isColumnFixing() {
          var isColumnFixing = this.option('columnFixing.enabled');
          !isColumnFixing && (0, _iterator.each)(this._columns, function (_, column) {
            if (column.fixed) {
              isColumnFixing = true;
              return false;
            }
          });
          return isColumnFixing;
        },
        _getExpandColumnsCore: function _getExpandColumnsCore() {
          return this.getGroupColumns();
        },
        getExpandColumns: function getExpandColumns() {
          var expandColumns = this._getExpandColumnsCore();

          var expandColumn;
          var firstGroupColumn = expandColumns.filter(function (column) {
            return column.groupIndex === 0;
          })[0];
          var isFixedFirstGroupColumn = firstGroupColumn && firstGroupColumn.fixed;

          var isColumnFixing = this._isColumnFixing();

          if (expandColumns.length) {
            expandColumn = this.columnOption('command:expand');
          }

          expandColumns = (0, _iterator.map)(expandColumns, function (column) {
            return (0, _extend.extend)({}, column, {
              visibleWidth: null,
              minWidth: null,
              cellTemplate: !(0, _type.isDefined)(column.groupIndex) ? column.cellTemplate : null,
              headerCellTemplate: null,
              fixed: !(0, _type.isDefined)(column.groupIndex) || !isFixedFirstGroupColumn ? isColumnFixing : true
            }, expandColumn, {
              index: column.index,
              type: column.type || GROUP_COMMAND_COLUMN_NAME
            });
          });
          return expandColumns;
        },
        getBandColumnsCache: function getBandColumnsCache() {
          if (!this._bandColumnsCache) {
            var columns = this._columns;
            var columnChildrenByIndex = {};
            var columnParentByIndex = {};
            var isPlain = true;
            columns.forEach(function (column) {
              var parentIndex = column.ownerBand;
              var parent = columns[parentIndex];

              if (column.hasColumns) {
                isPlain = false;
              }

              if (column.colspan) {
                column.colspan = undefined;
              }

              if (column.rowspan) {
                column.rowspan = undefined;
              }

              if (parent) {
                columnParentByIndex[column.index] = parent;
              } else {
                parentIndex = -1;
              }

              columnChildrenByIndex[parentIndex] = columnChildrenByIndex[parentIndex] || [];
              columnChildrenByIndex[parentIndex].push(column);
            });
            this._bandColumnsCache = {
              isPlain: isPlain,
              columnChildrenByIndex: columnChildrenByIndex,
              columnParentByIndex: columnParentByIndex
            };
          }

          return this._bandColumnsCache;
        },
        _isColumnVisible: function _isColumnVisible(column) {
          return column.visible && this.isParentColumnVisible(column.index);
        },
        _getVisibleColumnsCore: function _getVisibleColumnsCore() {
          var that = this;
          var i;
          var result = [];
          var rowspanGroupColumns = 0;
          var rowspanExpandColumns = 0;
          var rowCount = that.getRowCount();
          var positiveIndexedColumns = [];
          var negativeIndexedColumns = [];
          var notGroupedColumnsCount = 0;
          var isFixedToEnd;
          var rtlEnabled = that.option('rtlEnabled');
          var bandColumnsCache = that.getBandColumnsCache();
          var expandColumns = mergeColumns(that, that.getExpandColumns(), that._columns);
          var columns = mergeColumns(that, that._columns, that._commandColumns, true);
          var columnDigitsCount = digitsCount(columns.length);
          processBandColumns(that, columns, bandColumnsCache);

          for (i = 0; i < rowCount; i++) {
            result[i] = [];
            negativeIndexedColumns[i] = [{}];
            positiveIndexedColumns[i] = [{}, {}, {}];
          }

          (0, _iterator.each)(columns, function () {
            var column = this;
            var visibleIndex = column.visibleIndex;
            var indexedColumns;
            var parentBandColumns = getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex);

            var visible = that._isColumnVisible(column);

            if (visible && (!(0, _type.isDefined)(column.groupIndex) || column.showWhenGrouped)) {
              var rowIndex = parentBandColumns.length;

              if (visibleIndex < 0) {
                visibleIndex = -visibleIndex;
                indexedColumns = negativeIndexedColumns[rowIndex];
              } else {
                column.fixed = parentBandColumns.length ? parentBandColumns[0].fixed : column.fixed;
                column.fixedPosition = parentBandColumns.length ? parentBandColumns[0].fixedPosition : column.fixedPosition;

                if (column.fixed) {
                  isFixedToEnd = column.fixedPosition === 'right';

                  if (rtlEnabled && (!column.command || isCustomCommandColumn(that, column))) {
                    isFixedToEnd = !isFixedToEnd;
                  }

                  if (isFixedToEnd) {
                    indexedColumns = positiveIndexedColumns[rowIndex][2];
                  } else {
                    indexedColumns = positiveIndexedColumns[rowIndex][0];
                  }
                } else {
                  indexedColumns = positiveIndexedColumns[rowIndex][1];
                }
              }

              if (parentBandColumns.length) {
                visibleIndex = numberToString(visibleIndex, columnDigitsCount);

                for (i = parentBandColumns.length - 1; i >= 0; i--) {
                  visibleIndex = numberToString(parentBandColumns[i].visibleIndex, columnDigitsCount) + visibleIndex;
                }
              }

              indexedColumns[visibleIndex] = indexedColumns[visibleIndex] || [];
              indexedColumns[visibleIndex].push(column);
              notGroupedColumnsCount++;
            }
          });
          (0, _iterator.each)(result, function (rowIndex) {
            (0, _object.orderEach)(negativeIndexedColumns[rowIndex], function (_, columns) {
              result[rowIndex].unshift.apply(result[rowIndex], columns);
            });
            var firstPositiveIndexColumn = result[rowIndex].length;
            (0, _iterator.each)(positiveIndexedColumns[rowIndex], function (index, columnsByFixing) {
              (0, _object.orderEach)(columnsByFixing, function (_, columnsByVisibleIndex) {
                result[rowIndex].push.apply(result[rowIndex], columnsByVisibleIndex);
              });
            }); // The order of processing is important

            if (rowspanExpandColumns < rowIndex + 1) {
              rowspanExpandColumns += processExpandColumns.call(that, result[rowIndex], expandColumns, 'detailExpand', firstPositiveIndexColumn);
            }

            if (rowspanGroupColumns < rowIndex + 1) {
              rowspanGroupColumns += processExpandColumns.call(that, result[rowIndex], expandColumns, GROUP_COMMAND_COLUMN_NAME, firstPositiveIndexColumn);
            }
          });
          result.push(getDataColumns(result));

          if (!notGroupedColumnsCount && that._columns.length) {
            result[rowCount].push({
              command: 'empty'
            });
          }

          return result;
        },
        getInvisibleColumns: function getInvisibleColumns(columns, bandColumnIndex) {
          var that = this;
          var result = [];
          var hiddenColumnsByBand;
          columns = columns || that._columns;
          (0, _iterator.each)(columns, function (_, column) {
            if (column.ownerBand !== bandColumnIndex) {
              return;
            }

            if (column.isBand) {
              if (!column.visible) {
                hiddenColumnsByBand = that.getChildrenByBandColumn(column.index);
              } else {
                hiddenColumnsByBand = that.getInvisibleColumns(that.getChildrenByBandColumn(column.index), column.index);
              }

              if (hiddenColumnsByBand.length) {
                result.push(column);
                result = result.concat(hiddenColumnsByBand);
              }

              return;
            }

            if (!column.visible) {
              result.push(column);
            }
          });
          return result;
        },
        getChooserColumns: function getChooserColumns(getAllColumns) {
          var columns = getAllColumns ? this.getColumns() : this.getInvisibleColumns();
          var columnChooserColumns = columns.filter(function (column) {
            return column.showInColumnChooser;
          });
          var sortOrder = this.option('columnChooser.sortOrder');
          return sortColumns(columnChooserColumns, sortOrder);
        },
        allowMoveColumn: function allowMoveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
          var that = this;
          var columnIndex = getColumnIndexByVisibleIndex(that, fromVisibleIndex, sourceLocation);
          var sourceColumn = that._columns[columnIndex];

          if (sourceColumn && (sourceColumn.allowReordering || sourceColumn.allowGrouping || sourceColumn.allowHiding)) {
            if (sourceLocation === targetLocation) {
              if (sourceLocation === COLUMN_CHOOSER_LOCATION) {
                return false;
              }

              fromVisibleIndex = (0, _type.isObject)(fromVisibleIndex) ? fromVisibleIndex.columnIndex : fromVisibleIndex;
              toVisibleIndex = (0, _type.isObject)(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;
              return fromVisibleIndex !== toVisibleIndex && fromVisibleIndex + 1 !== toVisibleIndex;
            } else if (sourceLocation === GROUP_LOCATION && targetLocation !== COLUMN_CHOOSER_LOCATION || targetLocation === GROUP_LOCATION) {
              return sourceColumn && sourceColumn.allowGrouping;
            } else if (sourceLocation === COLUMN_CHOOSER_LOCATION || targetLocation === COLUMN_CHOOSER_LOCATION) {
              return sourceColumn && sourceColumn.allowHiding;
            }

            return true;
          }

          return false;
        },
        moveColumn: function moveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
          var that = this;
          var options = {};
          var prevGroupIndex;
          var fromIndex = getColumnIndexByVisibleIndex(that, fromVisibleIndex, sourceLocation);
          var toIndex = getColumnIndexByVisibleIndex(that, toVisibleIndex, targetLocation);
          var targetGroupIndex;

          if (fromIndex >= 0) {
            var column = that._columns[fromIndex];
            toVisibleIndex = (0, _type.isObject)(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;
            targetGroupIndex = toIndex >= 0 ? that._columns[toIndex].groupIndex : -1;

            if ((0, _type.isDefined)(column.groupIndex) && sourceLocation === GROUP_LOCATION) {
              if (targetGroupIndex > column.groupIndex) {
                targetGroupIndex--;
              }

              if (targetLocation !== GROUP_LOCATION) {
                options.groupIndex = undefined;
              } else {
                prevGroupIndex = column.groupIndex;
                delete column.groupIndex;
                updateColumnGroupIndexes(that);
              }
            }

            if (targetLocation === GROUP_LOCATION) {
              options.groupIndex = moveColumnToGroup(that, column, targetGroupIndex);
              column.groupIndex = prevGroupIndex;
            } else if (toVisibleIndex >= 0) {
              var targetColumn = that._columns[toIndex];

              if (!targetColumn || column.ownerBand !== targetColumn.ownerBand) {
                options.visibleIndex = MAX_SAFE_INTEGER;
              } else {
                if (isColumnFixed(that, column) ^ isColumnFixed(that, targetColumn)) {
                  options.visibleIndex = MAX_SAFE_INTEGER;
                } else {
                  options.visibleIndex = targetColumn.visibleIndex;
                }
              }
            }

            var isVisible = targetLocation !== COLUMN_CHOOSER_LOCATION;

            if (column.visible !== isVisible) {
              options.visible = isVisible;
            }

            that.columnOption(column.index, options);
          }
        },
        changeSortOrder: function changeSortOrder(columnIndex, sortOrder) {
          var that = this;
          var options = {};
          var sortingOptions = that.option('sorting');
          var sortingMode = sortingOptions && sortingOptions.mode;
          var needResetSorting = sortingMode === 'single' || !sortOrder;
          var allowSorting = sortingMode === 'single' || sortingMode === 'multiple';
          var column = that._columns[columnIndex];

          var nextSortOrder = function nextSortOrder(column) {
            if (sortOrder === 'ctrl') {
              if (!('sortOrder' in column && 'sortIndex' in column)) {
                return false;
              }

              options.sortOrder = undefined;
              options.sortIndex = undefined;
            } else if ((0, _type.isDefined)(column.groupIndex) || (0, _type.isDefined)(column.sortIndex)) {
              options.sortOrder = column.sortOrder === 'desc' ? 'asc' : 'desc';
            } else {
              options.sortOrder = 'asc';
            }

            return true;
          };

          if (allowSorting && column && column.allowSorting) {
            if (needResetSorting && !(0, _type.isDefined)(column.groupIndex)) {
              (0, _iterator.each)(that._columns, function (index) {
                if (index !== columnIndex && this.sortOrder) {
                  if (!(0, _type.isDefined)(this.groupIndex)) {
                    delete this.sortOrder;
                  }

                  delete this.sortIndex;
                }
              });
            }

            if (isSortOrderValid(sortOrder)) {
              if (column.sortOrder !== sortOrder) {
                options.sortOrder = sortOrder;
              }
            } else if (sortOrder === 'none') {
              if (column.sortOrder) {
                options.sortIndex = undefined;
                options.sortOrder = undefined;
              }
            } else {
              nextSortOrder(column);
            }
          }

          that.columnOption(column.index, options);
        },
        getSortDataSourceParameters: function getSortDataSourceParameters(useLocalSelector) {
          var that = this;
          var sortColumns = [];
          var sort = [];
          (0, _iterator.each)(that._columns, function () {
            if ((this.dataField || this.selector || this.calculateCellValue) && (0, _type.isDefined)(this.sortIndex) && !(0, _type.isDefined)(this.groupIndex)) {
              sortColumns[this.sortIndex] = this;
            }
          });
          (0, _iterator.each)(sortColumns, function () {
            var sortOrder = this && this.sortOrder;

            if (isSortOrderValid(sortOrder)) {
              var sortItem = {
                selector: this.calculateSortValue || this.displayField || this.calculateDisplayValue || useLocalSelector && this.selector || this.dataField || this.calculateCellValue,
                desc: this.sortOrder === 'desc'
              };

              if (this.sortingMethod) {
                sortItem.compare = this.sortingMethod.bind(this);
              }

              sort.push(sortItem);
            }
          });
          return sort.length > 0 ? sort : null;
        },
        getGroupDataSourceParameters: function getGroupDataSourceParameters(useLocalSelector) {
          var group = [];
          (0, _iterator.each)(this.getGroupColumns(), function () {
            var selector = this.calculateGroupValue || this.displayField || this.calculateDisplayValue || useLocalSelector && this.selector || this.dataField || this.calculateCellValue;

            if (selector) {
              var groupItem = {
                selector: selector,
                desc: this.sortOrder === 'desc',
                isExpanded: !!this.autoExpandGroup
              };

              if (this.sortingMethod) {
                groupItem.compare = this.sortingMethod.bind(this);
              }

              group.push(groupItem);
            }
          });
          return group.length > 0 ? group : null;
        },
        refresh: function refresh(updateNewLookupsOnly) {
          var deferreds = [];
          (0, _iterator.each)(this._columns, function () {
            var lookup = this.lookup;

            if (lookup && !this.calculateDisplayValue) {
              if (updateNewLookupsOnly && lookup.valueMap) {
                return;
              }

              if (lookup.update) {
                deferreds.push(lookup.update());
              }
            }
          });
          return _deferred.when.apply(_renderer.default, deferreds).done(resetColumnsCache.bind(null, this));
        },
        _updateColumnOptions: function _updateColumnOptions(column, columnIndex) {
          column.selector = column.selector || function (data) {
            return column.calculateCellValue(data);
          };

          (0, _iterator.each)(['calculateSortValue', 'calculateGroupValue', 'calculateDisplayValue'], function (_, calculateCallbackName) {
            var calculateCallback = column[calculateCallbackName];

            if ((0, _type.isFunction)(calculateCallback)) {
              if (!calculateCallback.originalCallback) {
                var context = {
                  column: column
                };

                column[calculateCallbackName] = function (data) {
                  return calculateCallback.call(context.column, data);
                };

                column[calculateCallbackName].originalCallback = calculateCallback;
                column[calculateCallbackName].columnIndex = columnIndex;
                column[calculateCallbackName].context = context;
              } else {
                column[calculateCallbackName].context.column = column;
              }
            }
          });

          if ((0, _type.isString)(column.calculateDisplayValue)) {
            column.displayField = column.calculateDisplayValue;
            column.calculateDisplayValue = (0, _data.compileGetter)(column.displayField);
          }

          if (column.calculateDisplayValue) {
            column.displayValueMap = column.displayValueMap || {};
          }

          updateSerializers(column, column.dataType);
          var lookup = column.lookup;

          if (lookup) {
            updateSerializers(lookup, lookup.dataType);
          }

          var dataType = lookup ? lookup.dataType : column.dataType;

          if (dataType) {
            column.alignment = column.alignment || getAlignmentByDataType(dataType, this.option('rtlEnabled'));
            column.format = column.format || _uiGrid_core2.default.getFormatByDataType(dataType);
            column.customizeText = column.customizeText || getCustomizeTextByDataType(dataType);
            column.defaultFilterOperations = column.defaultFilterOperations || !lookup && DATATYPE_OPERATIONS[dataType] || [];

            if (!(0, _type.isDefined)(column.filterOperations)) {
              setFilterOperationsAsDefaultValues(column);
            }

            column.defaultFilterOperation = column.filterOperations && column.filterOperations[0] || '=';
            column.showEditorAlways = (0, _type.isDefined)(column.showEditorAlways) ? column.showEditorAlways : dataType === 'boolean' && !column.cellTemplate;
          }
        },
        updateColumnDataTypes: function updateColumnDataTypes(dataSource) {
          var that = this;
          var dateSerializationFormat = that.option('dateSerializationFormat');

          var firstItems = that._getFirstItems(dataSource);

          var isColumnDataTypesUpdated = false;
          (0, _iterator.each)(that._columns, function (index, column) {
            var i;
            var value;
            var dataType;
            var lookupDataType;
            var valueDataType;
            var lookup = column.lookup;

            if (_uiGrid_core2.default.isDateType(column.dataType) && column.serializationFormat === undefined) {
              column.serializationFormat = dateSerializationFormat;
            }

            if (lookup && _uiGrid_core2.default.isDateType(lookup.dataType) && column.serializationFormat === undefined) {
              lookup.serializationFormat = dateSerializationFormat;
            }

            if (column.calculateCellValue && firstItems.length) {
              if (!column.dataType || lookup && !lookup.dataType) {
                for (i = 0; i < firstItems.length; i++) {
                  value = column.calculateCellValue(firstItems[i]);

                  if (!column.dataType) {
                    valueDataType = getValueDataType(value);
                    dataType = dataType || valueDataType;

                    if (dataType && valueDataType && dataType !== valueDataType) {
                      dataType = 'string';
                    }
                  }

                  if (lookup && !lookup.dataType) {
                    valueDataType = getValueDataType(_uiGrid_core2.default.getDisplayValue(column, value, firstItems[i]));
                    lookupDataType = lookupDataType || valueDataType;

                    if (lookupDataType && valueDataType && lookupDataType !== valueDataType) {
                      lookupDataType = 'string';
                    }
                  }
                }

                if (dataType || lookupDataType) {
                  if (dataType) {
                    column.dataType = dataType;
                  }

                  if (lookup && lookupDataType) {
                    lookup.dataType = lookupDataType;
                  }

                  isColumnDataTypesUpdated = true;
                }
              }

              if (column.serializationFormat === undefined || lookup && lookup.serializationFormat === undefined) {
                for (i = 0; i < firstItems.length; i++) {
                  value = column.calculateCellValue(firstItems[i], true);

                  if (column.serializationFormat === undefined) {
                    column.serializationFormat = getSerializationFormat(column.dataType, value);
                  }

                  if (lookup && lookup.serializationFormat === undefined) {
                    lookup.serializationFormat = getSerializationFormat(lookup.dataType, lookup.calculateCellValue(value, true));
                  }
                }
              }
            }

            that._updateColumnOptions(column, index);
          });
          return isColumnDataTypesUpdated;
        },
        _customizeColumns: function _customizeColumns(columns) {
          var that = this;
          var customizeColumns = that.option('customizeColumns');

          if (customizeColumns) {
            var hasOwnerBand = columns.some(function (column) {
              return (0, _type.isObject)(column.ownerBand);
            });

            if (hasOwnerBand) {
              updateIndexes(that);
            }

            customizeColumns(columns);
            assignColumns(that, createColumnsFromOptions(that, columns));
          }
        },
        updateColumns: function updateColumns(dataSource, forceApplying) {
          var _this = this;

          if (!forceApplying) {
            this.updateSortingGrouping(dataSource);
          }

          if (!dataSource || dataSource.isLoaded()) {
            var sortParameters = dataSource ? dataSource.sort() || [] : this.getSortDataSourceParameters();
            var groupParameters = dataSource ? dataSource.group() || [] : this.getGroupDataSourceParameters();
            var filterParameters = dataSource === null || dataSource === void 0 ? void 0 : dataSource.lastLoadOptions().filter;

            this._customizeColumns(this._columns);

            updateIndexes(this);
            var columns = this._columns;
            return (0, _deferred.when)(this.refresh(true)).always(function () {
              if (_this._columns !== columns) return;

              _this._updateChanges(dataSource, {
                sorting: sortParameters,
                grouping: groupParameters,
                filtering: filterParameters
              });

              fireColumnsChanged(_this);
            });
          }
        },
        _updateChanges: function _updateChanges(dataSource, parameters) {
          if (dataSource) {
            this.updateColumnDataTypes(dataSource);
            this._dataSourceApplied = true;
          }

          if (!_uiGrid_core2.default.equalSortParameters(parameters.sorting, this.getSortDataSourceParameters())) {
            updateColumnChanges(this, 'sorting');
          }

          if (!_uiGrid_core2.default.equalSortParameters(parameters.grouping, this.getGroupDataSourceParameters())) {
            updateColumnChanges(this, 'grouping');
          }

          var dataController = this.getController('data');

          if (dataController && !_uiGrid_core2.default.equalFilterParameters(parameters.filtering, dataController.getCombinedFilter())) {
            updateColumnChanges(this, 'filtering');
          }

          updateColumnChanges(this, 'columns');
        },
        updateSortingGrouping: function updateSortingGrouping(dataSource, fromDataSource) {
          var that = this;
          var sortParameters;
          var isColumnsChanged;

          var updateSortGroupParameterIndexes = function updateSortGroupParameterIndexes(columns, sortParameters, indexParameterName) {
            (0, _iterator.each)(columns, function (index, column) {
              delete column[indexParameterName];

              if (sortParameters) {
                for (var i = 0; i < sortParameters.length; i++) {
                  var selector = sortParameters[i].selector;
                  var isExpanded = sortParameters[i].isExpanded;

                  if (selector === column.dataField || selector === column.name || selector === column.selector || selector === column.calculateCellValue || selector === column.calculateGroupValue || selector === column.calculateDisplayValue) {
                    column.sortOrder = column.sortOrder || (sortParameters[i].desc ? 'desc' : 'asc');

                    if (isExpanded !== undefined) {
                      column.autoExpandGroup = isExpanded;
                    }

                    column[indexParameterName] = i;
                    break;
                  }
                }
              }
            });
          };

          if (dataSource) {
            sortParameters = _uiGrid_core2.default.normalizeSortingInfo(dataSource.sort());

            var groupParameters = _uiGrid_core2.default.normalizeSortingInfo(dataSource.group());

            var columnsGroupParameters = that.getGroupDataSourceParameters();
            var columnsSortParameters = that.getSortDataSourceParameters();

            if (!that._columns.length) {
              (0, _iterator.each)(groupParameters, function (index, group) {
                that._columns.push(group.selector);
              });
              (0, _iterator.each)(sortParameters, function (index, sort) {
                that._columns.push(sort.selector);
              });
              assignColumns(that, createColumnsFromOptions(that, that._columns));
            }

            if ((fromDataSource || !columnsGroupParameters && !that._hasUserState) && !_uiGrid_core2.default.equalSortParameters(groupParameters, columnsGroupParameters)) {
              updateSortGroupParameterIndexes(that._columns, groupParameters, 'groupIndex');

              if (fromDataSource) {
                updateColumnChanges(that, 'grouping');
                isColumnsChanged = true;
              }
            }

            if ((fromDataSource || !columnsSortParameters && !that._hasUserState) && !_uiGrid_core2.default.equalSortParameters(sortParameters, columnsSortParameters)) {
              updateSortGroupParameterIndexes(that._columns, sortParameters, 'sortIndex');

              if (fromDataSource) {
                updateColumnChanges(that, 'sorting');
                isColumnsChanged = true;
              }
            }

            if (isColumnsChanged) {
              fireColumnsChanged(that);
            }
          }
        },
        updateFilter: function updateFilter(filter, remoteFiltering, columnIndex, filterValue) {
          var that = this;
          if (!Array.isArray(filter)) return filter;
          filter = (0, _extend.extend)([], filter);
          columnIndex = filter.columnIndex !== undefined ? filter.columnIndex : columnIndex;
          filterValue = filter.filterValue !== undefined ? filter.filterValue : filterValue;

          if ((0, _type.isString)(filter[0]) && filter[0] !== '!') {
            var column = that.columnOption(filter[0]);

            if (remoteFiltering) {
              if ((0, _config.default)().forceIsoDateParsing && column && column.serializeValue && filter.length > 1) {
                filter[filter.length - 1] = column.serializeValue(filter[filter.length - 1], 'filter');
              }
            } else {
              if (column && column.selector) {
                filter[0] = column.selector;
                filter[0].columnIndex = column.index;
              }
            }
          } else if ((0, _type.isFunction)(filter[0])) {
            filter[0].columnIndex = columnIndex;
            filter[0].filterValue = filterValue;
          }

          for (var i = 0; i < filter.length; i++) {
            filter[i] = that.updateFilter(filter[i], remoteFiltering, columnIndex, filterValue);
          }

          return filter;
        },
        columnCount: function columnCount() {
          return this._columns ? this._columns.length : 0;
        },
        columnOption: function columnOption(identifier, option, value, notFireEvent) {
          var that = this;

          var columns = that._columns.concat(that._commandColumns);

          var column = findColumn(columns, identifier);

          if (column) {
            if (arguments.length === 1) {
              return (0, _extend.extend)({}, column);
            }

            if ((0, _type.isString)(option)) {
              if (arguments.length === 2) {
                return columnOptionCore(that, column, option);
              } else {
                columnOptionCore(that, column, option, value, notFireEvent);
              }
            } else if ((0, _type.isObject)(option)) {
              (0, _iterator.each)(option, function (optionName, value) {
                columnOptionCore(that, column, optionName, value, notFireEvent);
              });
            }

            fireColumnsChanged(that);
          }
        },
        clearSorting: function clearSorting() {
          var that = this;
          var columnCount = this.columnCount();
          that.beginUpdate();

          for (var i = 0; i < columnCount; i++) {
            that.columnOption(i, 'sortOrder', undefined);
          }

          that.endUpdate();
        },
        clearGrouping: function clearGrouping() {
          var that = this;
          var columnCount = this.columnCount();
          that.beginUpdate();

          for (var i = 0; i < columnCount; i++) {
            that.columnOption(i, 'groupIndex', undefined);
          }

          that.endUpdate();
        },
        getVisibleIndex: function getVisibleIndex(index, rowIndex) {
          var columns = this.getVisibleColumns(rowIndex);

          for (var i = columns.length - 1; i >= 0; i--) {
            if (columns[i].index === index) {
              return i;
            }
          }

          return -1;
        },
        getVisibleIndexByColumn: function getVisibleIndexByColumn(column, rowIndex) {
          var visibleColumns = this.getVisibleColumns(rowIndex);
          var visibleColumn = visibleColumns.filter(function (col) {
            return col.index === column.index && col.command === column.command;
          })[0];
          return visibleColumns.indexOf(visibleColumn);
        },
        getVisibleColumnIndex: function getVisibleColumnIndex(id, rowIndex) {
          var index = this.columnOption(id, 'index');
          return this.getVisibleIndex(index, rowIndex);
        },
        addColumn: function addColumn(options) {
          var that = this;
          var column = createColumn(that, options);
          var index = that._columns.length;

          that._columns.push(column);

          if (column.isBand) {
            that._columns = createColumnsFromOptions(that, that._columns);
            column = that._columns[index];
          }

          column.added = options;
          updateIndexes(that, column);
          that.updateColumns(that._dataSource);

          that._checkColumns();
        },
        deleteColumn: function deleteColumn(id) {
          var that = this;
          var column = that.columnOption(id);

          if (column && column.index >= 0) {
            convertOwnerBandToColumnReference(that._columns);

            that._columns.splice(column.index, 1);

            if (column.isBand) {
              var childIndexes = that.getChildrenByBandColumn(column.index).map(function (column) {
                return column.index;
              });
              that._columns = that._columns.filter(function (column) {
                return childIndexes.indexOf(column.index) < 0;
              });
            }

            updateIndexes(that);
            that.updateColumns(that._dataSource);
          }
        },
        addCommandColumn: function addCommandColumn(options) {
          var commandColumn = this._commandColumns.filter(function (column) {
            return column.command === options.command;
          })[0];

          if (!commandColumn) {
            commandColumn = options;

            this._commandColumns.push(commandColumn);
          }
        },
        getUserState: function getUserState() {
          var columns = this._columns;
          var result = [];
          var i;

          function handleStateField(index, value) {
            if (columns[i][value] !== undefined) {
              result[i][value] = columns[i][value];
            }
          }

          for (i = 0; i < columns.length; i++) {
            result[i] = {};
            (0, _iterator.each)(USER_STATE_FIELD_NAMES, handleStateField);
          }

          return result;
        },
        setName: function setName(column) {
          column.name = column.name || column.dataField || column.type;
        },
        setUserState: function setUserState(state) {
          var that = this;
          var dataSource = that._dataSource;
          var ignoreColumnOptionNames = that.option('stateStoring.ignoreColumnOptionNames');
          state === null || state === void 0 ? void 0 : state.forEach(this.setName);

          if (!ignoreColumnOptionNames) {
            ignoreColumnOptionNames = [];
            var commonColumnSettings = that.getCommonSettings();
            if (!that.option('columnChooser.enabled')) ignoreColumnOptionNames.push('visible');
            if (that.option('sorting.mode') === 'none') ignoreColumnOptionNames.push('sortIndex', 'sortOrder');
            if (!commonColumnSettings.allowGrouping) ignoreColumnOptionNames.push('groupIndex');
            if (!commonColumnSettings.allowFixing) ignoreColumnOptionNames.push('fixed', 'fixedPosition');
            if (!commonColumnSettings.allowResizing) ignoreColumnOptionNames.push('width', 'visibleWidth');
            var isFilterPanelHidden = !that.option('filterPanel.visible');
            if (!that.option('filterRow.visible') && isFilterPanelHidden) ignoreColumnOptionNames.push('filterValue', 'selectedFilterOperation');
            if (!that.option('headerFilter.visible') && isFilterPanelHidden) ignoreColumnOptionNames.push('filterValues', 'filterType');
          }

          that._columnsUserState = state;
          that._ignoreColumnOptionNames = ignoreColumnOptionNames;
          that._hasUserState = !!state;
          updateColumnChanges(that, 'filtering');
          that.init();

          if (dataSource) {
            dataSource.sort(that.getSortDataSourceParameters());
            dataSource.group(that.getGroupDataSourceParameters());
          }
        },
        _checkColumns: function _checkColumns() {
          var usedNames = {};
          var hasEditableColumnWithoutName = false;
          var duplicatedNames = [];

          this._columns.forEach(function (column) {
            var _column$columns;

            var name = column.name;
            var isBand = (_column$columns = column.columns) === null || _column$columns === void 0 ? void 0 : _column$columns.length;
            var isEditable = column.allowEditing && (column.dataField || column.setCellValue) && !isBand;

            if (name) {
              if (usedNames[name]) {
                duplicatedNames.push("\"".concat(name, "\""));
              }

              usedNames[name] = true;
            } else if (isEditable) {
              hasEditableColumnWithoutName = true;
            }
          });

          if (duplicatedNames.length) {
            _ui.default.log('E1059', duplicatedNames.join(', '));
          }

          if (hasEditableColumnWithoutName) {
            _ui.default.log('E1060');
          }
        },
        _createCalculatedColumnOptions: function _createCalculatedColumnOptions(columnOptions, bandColumn) {
          var calculatedColumnOptions = {};
          var dataField = columnOptions.dataField;

          if (Array.isArray(columnOptions.columns) && columnOptions.columns.length || columnOptions.isBand) {
            calculatedColumnOptions.isBand = true;
            dataField = null;
          }

          if (dataField) {
            if ((0, _type.isString)(dataField)) {
              var getter = (0, _data.compileGetter)(dataField);
              calculatedColumnOptions = {
                caption: (0, _inflector.captionize)(dataField),
                calculateCellValue: function calculateCellValue(data, skipDeserialization) {
                  var value = getter(data);
                  return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value;
                },
                setCellValue: defaultSetCellValue,
                parseValue: function parseValue(text) {
                  var column = this;
                  var result;
                  var parsedValue;

                  if (column.dataType === 'number') {
                    if ((0, _type.isString)(text) && column.format) {
                      result = strictParseNumber(text.trim(), column.format);
                    } else if ((0, _type.isDefined)(text) && (0, _type.isNumeric)(text)) {
                      result = Number(text);
                    }
                  } else if (column.dataType === 'boolean') {
                    if (text === column.trueText) {
                      result = true;
                    } else if (text === column.falseText) {
                      result = false;
                    }
                  } else if (_uiGrid_core2.default.isDateType(column.dataType)) {
                    parsedValue = _date.default.parse(text, column.format);

                    if (parsedValue) {
                      result = parsedValue;
                    }
                  } else {
                    result = text;
                  }

                  return result;
                }
              };
            }

            calculatedColumnOptions.allowFiltering = true;
          } else {
            calculatedColumnOptions.allowFiltering = !!columnOptions.calculateFilterExpression;
          }

          calculatedColumnOptions.calculateFilterExpression = function () {
            return _filtering.default.defaultCalculateFilterExpression.apply(this, arguments);
          };

          calculatedColumnOptions.createFilterExpression = function (filterValue) {
            var result;

            if (this.calculateFilterExpression) {
              result = this.calculateFilterExpression.apply(this, arguments);
            }

            if ((0, _type.isFunction)(result)) {
              result = [result, '=', true];
            }

            if (result) {
              result.columnIndex = this.index;
              result.filterValue = filterValue;
            }

            return result;
          };

          if (!dataField || !(0, _type.isString)(dataField)) {
            (0, _extend.extend)(true, calculatedColumnOptions, {
              allowSorting: false,
              allowGrouping: false,
              calculateCellValue: function calculateCellValue() {
                return null;
              }
            });
          }

          if (bandColumn) {
            calculatedColumnOptions.allowFixing = false;
          }

          if (columnOptions.dataType) {
            calculatedColumnOptions.userDataType = columnOptions.dataType;
          }

          if (columnOptions.selectedFilterOperation && !('defaultSelectedFilterOperation' in calculatedColumnOptions)) {
            calculatedColumnOptions.defaultSelectedFilterOperation = columnOptions.selectedFilterOperation;
          }

          if (columnOptions.lookup) {
            calculatedColumnOptions.lookup = {
              calculateCellValue: function calculateCellValue(value, skipDeserialization) {
                if (this.valueExpr) {
                  value = this.valueMap && this.valueMap[value];
                }

                return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value;
              },
              updateValueMap: function updateValueMap() {
                this.valueMap = {};

                if (this.items) {
                  var calculateValue = (0, _data.compileGetter)(this.valueExpr);
                  var calculateDisplayValue = (0, _data.compileGetter)(this.displayExpr);

                  for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    var displayValue = calculateDisplayValue(item);
                    this.valueMap[calculateValue(item)] = displayValue;
                    this.dataType = this.dataType || getValueDataType(displayValue);
                  }
                }
              },
              update: function update() {
                var that = this;
                var dataSource = that.dataSource;

                if (dataSource) {
                  if ((0, _type.isFunction)(dataSource) && !_variable_wrapper.default.isWrapped(dataSource)) {
                    dataSource = dataSource({});
                  }

                  if ((0, _type.isPlainObject)(dataSource) || dataSource instanceof _abstract_store.default || Array.isArray(dataSource)) {
                    if (that.valueExpr) {
                      var dataSourceOptions = (0, _utils.normalizeDataSourceOptions)(dataSource);
                      dataSourceOptions.paginate = false;
                      dataSource = new _data_source.DataSource(dataSourceOptions);
                      return dataSource.load().done(function (data) {
                        that.items = data;
                        that.updateValueMap && that.updateValueMap();
                      });
                    }
                  } else {
                    _ui.default.log('E1016');
                  }
                } else {
                  that.updateValueMap && that.updateValueMap();
                }
              }
            };
          }

          calculatedColumnOptions.resizedCallbacks = (0, _callbacks.default)();

          if (columnOptions.resized) {
            calculatedColumnOptions.resizedCallbacks.add(columnOptions.resized.bind(columnOptions));
          }

          (0, _iterator.each)(calculatedColumnOptions, function (optionName) {
            if ((0, _type.isFunction)(calculatedColumnOptions[optionName]) && optionName.indexOf('default') !== 0) {
              var defaultOptionName = 'default' + optionName.charAt(0).toUpperCase() + optionName.substr(1);
              calculatedColumnOptions[defaultOptionName] = calculatedColumnOptions[optionName];
            }
          });
          return calculatedColumnOptions;
        },
        getRowCount: function getRowCount() {
          this._rowCount = this._rowCount || _getRowCount(this);
          return this._rowCount;
        },
        getRowIndex: function getRowIndex(columnIndex, alwaysGetRowIndex) {
          var column = this._columns[columnIndex];
          var bandColumnsCache = this.getBandColumnsCache();
          return column && (alwaysGetRowIndex || column.visible && !(column.command || (0, _type.isDefined)(column.groupIndex))) ? getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex).length : 0;
        },
        getChildrenByBandColumn: function getChildrenByBandColumn(bandColumnIndex, onlyVisibleDirectChildren) {
          var that = this;
          var bandColumnsCache = that.getBandColumnsCache();

          var result = _getChildrenByBandColumn(bandColumnIndex, bandColumnsCache.columnChildrenByIndex, !onlyVisibleDirectChildren);

          if (onlyVisibleDirectChildren) {
            return result.filter(function (column) {
              return column.visible && !column.command;
            }).sort(function (column1, column2) {
              return column1.visibleIndex - column2.visibleIndex;
            });
          }

          return result;
        },
        isParentBandColumn: function isParentBandColumn(columnIndex, bandColumnIndex) {
          var result = false;
          var column = this._columns[columnIndex];
          var bandColumnsCache = this.getBandColumnsCache();
          var parentBandColumns = column && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);

          if (parentBandColumns) {
            // T416483 - fix for jquery 2.1.4
            (0, _iterator.each)(parentBandColumns, function (_, bandColumn) {
              if (bandColumn.index === bandColumnIndex) {
                result = true;
                return false;
              }
            });
          }

          return result;
        },
        isParentColumnVisible: function isParentColumnVisible(columnIndex) {
          var result = true;
          var bandColumnsCache = this.getBandColumnsCache();
          var bandColumns = columnIndex >= 0 && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);
          bandColumns && (0, _iterator.each)(bandColumns, function (_, bandColumn) {
            result = result && bandColumn.visible;
            return result;
          });
          return result;
        },
        getColumnId: function getColumnId(column) {
          if (column.command && column.type === GROUP_COMMAND_COLUMN_NAME) {
            if (isCustomCommandColumn(this, column)) {
              return 'type:' + column.type;
            }

            return 'command:' + column.command;
          }

          return column.index;
        },
        getCustomizeTextByDataType: getCustomizeTextByDataType,
        getHeaderContentAlignment: function getHeaderContentAlignment(columnAlignment) {
          var rtlEnabled = this.option('rtlEnabled');

          if (rtlEnabled) {
            return columnAlignment === 'left' ? 'right' : 'left';
          }

          return columnAlignment;
        }
      };
    }())
  }
};
exports.columnsControllerModule = columnsControllerModule;