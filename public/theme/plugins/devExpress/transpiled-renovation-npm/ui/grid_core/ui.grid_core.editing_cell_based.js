"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _window = require("../../core/utils/window");

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _type = require("../../core/utils/type");

var _click = require("../../events/click");

var _pointer = _interopRequireDefault(require("../../events/pointer"));

var _index = require("../../events/utils/index");

var _hold = _interopRequireDefault(require("../../events/hold"));

var _deferred2 = require("../../core/utils/deferred");

var _common = require("../../core/utils/common");

var _array_utils = require("../../data/array_utils");

var _uiGrid_core = require("./ui.grid_core.editing_constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FOCUS_OVERLAY_CLASS = 'focus-overlay';
var ADD_ROW_BUTTON_CLASS = 'addrow-button';
var DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
var EDITOR_CELL_CLASS = 'dx-editor-cell';
var ROW_CLASS = 'dx-row';
var CELL_MODIFIED_CLASS = 'dx-cell-modified';
var DATA_ROW_CLASS = 'dx-data-row';
var ROW_REMOVED = 'dx-row-removed';
var EDITING_EDITROWKEY_OPTION_NAME = 'editing.editRowKey';
var EDITING_EDITCOLUMNNAME_OPTION_NAME = 'editing.editColumnName';
var DATA_EDIT_DATA_REMOVE_TYPE = 'remove';
var _default = {
  extenders: {
    controllers: {
      editing: {
        init: function init() {
          var _this = this;

          var needCreateHandlers = !this._saveEditorHandler;
          this.callBase.apply(this, arguments);

          if (needCreateHandlers) {
            // chrome 73+
            var $pointerDownTarget;
            var isResizing;

            this._pointerUpEditorHandler = function () {
              var _this$getController;

              isResizing = (_this$getController = _this.getController('columnsResizer')) === null || _this$getController === void 0 ? void 0 : _this$getController.isResizing();
            };

            this._pointerDownEditorHandler = function (e) {
              return $pointerDownTarget = (0, _renderer.default)(e.target);
            };

            this._saveEditorHandler = this.createAction(function (e) {
              var event = e.event;
              var $target = (0, _renderer.default)(event.target);
              var targetComponent = event[_uiGrid_core.TARGET_COMPONENT_NAME];

              if ($pointerDownTarget && $pointerDownTarget.is('input') && !$pointerDownTarget.is($target)) {
                return;
              }

              function checkEditorPopup($element) {
                return $element && !!$element.closest(".".concat(DROPDOWN_EDITOR_OVERLAY_CLASS)).length;
              }

              if (this.isCellOrBatchEditMode() && !this._editCellInProgress) {
                var isEditorPopup = checkEditorPopup($target) || checkEditorPopup(targetComponent === null || targetComponent === void 0 ? void 0 : targetComponent.$element());
                var isDomElement = !!$target.closest((0, _window.getWindow)().document).length;
                var isAnotherComponent = targetComponent && !targetComponent._disposed && targetComponent !== this.component;
                var isAddRowButton = !!$target.closest(".".concat(this.addWidgetPrefix(ADD_ROW_BUTTON_CLASS))).length;
                var isFocusOverlay = $target.hasClass(this.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
                var isCellEditMode = this.isCellEditMode();

                if (!isResizing && !isEditorPopup && !isFocusOverlay && !(isAddRowButton && isCellEditMode && this.isEditing()) && (isDomElement || isAnotherComponent)) {
                  this._closeEditItem.bind(this)($target);
                }
              }
            });

            _events_engine.default.on(_dom_adapter.default.getDocument(), _pointer.default.up, this._pointerUpEditorHandler);

            _events_engine.default.on(_dom_adapter.default.getDocument(), _pointer.default.down, this._pointerDownEditorHandler);

            _events_engine.default.on(_dom_adapter.default.getDocument(), _click.name, this._saveEditorHandler);
          }
        },
        isCellEditMode: function isCellEditMode() {
          return this.option('editing.mode') === _uiGrid_core.EDIT_MODE_CELL;
        },
        isBatchEditMode: function isBatchEditMode() {
          return this.option('editing.mode') === _uiGrid_core.EDIT_MODE_BATCH;
        },
        isCellOrBatchEditMode: function isCellOrBatchEditMode() {
          return this.isCellEditMode() || this.isBatchEditMode();
        },
        _needToCloseEditableCell: function _needToCloseEditableCell($targetElement) {
          var $element = this.component.$element();
          var result = this.isEditing();
          var isCurrentComponentElement = !$element || !!$targetElement.closest($element).length;

          if (isCurrentComponentElement) {
            var isDataRow = $targetElement.closest('.' + DATA_ROW_CLASS).length;

            if (isDataRow) {
              var rowsView = this.getView('rowsView');
              var $targetCell = $targetElement.closest('.' + ROW_CLASS + '> td');
              var rowIndex = rowsView.getRowIndex($targetCell.parent());
              var columnIndex = rowsView.getCellElements(rowIndex).index($targetCell);

              var visibleColumns = this._columnsController.getVisibleColumns(); // TODO jsdmitry: Move this code to _rowClick method of rowsView


              var allowEditing = visibleColumns[columnIndex] && visibleColumns[columnIndex].allowEditing;
              result = result && !allowEditing && !this.isEditCell(rowIndex, columnIndex);
            }
          }

          return result || this.callBase.apply(this, arguments);
        },
        _closeEditItem: function _closeEditItem($targetElement) {
          if (this._needToCloseEditableCell($targetElement)) {
            this.closeEditCell();
          }
        },
        _focusEditorIfNeed: function _focusEditorIfNeed() {
          var _this2 = this;

          if (this._needFocusEditor && this.isCellOrBatchEditMode()) {
            var _this$_rowsView;

            var editColumnIndex = this._getVisibleEditColumnIndex();

            var $cell = (_this$_rowsView = this._rowsView) === null || _this$_rowsView === void 0 ? void 0 : _this$_rowsView._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex); // T319885

            if ($cell && !$cell.find(':focus').length) {
              this._focusEditingCell(function () {
                _this2._editCellInProgress = false;
              }, $cell, true);
            } else {
              this._editCellInProgress = false;
            }

            this._needFocusEditor = false;
          } else {
            this.callBase.apply(this, arguments);
          }
        },
        isEditing: function isEditing() {
          if (this.isCellOrBatchEditMode()) {
            var isEditRowKeyDefined = (0, _type.isDefined)(this.option(EDITING_EDITROWKEY_OPTION_NAME));
            var isEditColumnNameDefined = (0, _type.isDefined)(this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME));
            return isEditRowKeyDefined && isEditColumnNameDefined;
          }

          return this.callBase.apply(this, arguments);
        },
        _handleEditColumnNameChange: function _handleEditColumnNameChange(args) {
          var oldRowIndex = this._getVisibleEditRowIndex(args.previousValue);

          if (this.isCellOrBatchEditMode() && oldRowIndex !== -1 && (0, _type.isDefined)(args.value) && args.value !== args.previousValue) {
            var columnIndex = this._columnsController.getVisibleColumnIndex(args.value);

            var oldColumnIndex = this._columnsController.getVisibleColumnIndex(args.previousValue);

            this._editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex);
          }
        },
        _addRow: function _addRow(parentKey, deferred) {
          var _this3 = this;

          if (this.isCellEditMode() && this.hasChanges()) {
            var _deferred = new _deferred2.Deferred();

            this.saveEditData().done(function () {
              // T804894
              if (!_this3.hasChanges()) {
                _this3.addRow(parentKey).done(_deferred.resolve).fail(_deferred.reject);
              } else {
                _deferred.reject('cancel');
              }
            });
            return _deferred.promise();
          }

          return this.callBase.apply(this, arguments);
        },
        editCell: function editCell(rowIndex, columnIndex) {
          return this._editCell({
            rowIndex: rowIndex,
            columnIndex: columnIndex
          });
        },
        _editCell: function _editCell(options) {
          var _this4 = this;

          var d = new _deferred2.Deferred();
          var coreResult;
          this.executeOperation(d, function () {
            coreResult = _this4._editCellCore(options);
            (0, _deferred2.when)(coreResult).done(d.resolve).fail(d.reject);
          });
          return coreResult !== undefined ? coreResult : d.promise();
        },
        _editCellCore: function _editCellCore(options) {
          var _this5 = this;

          var dataController = this._dataController;
          var isEditByOptionChanged = (0, _type.isDefined)(options.oldColumnIndex) || (0, _type.isDefined)(options.oldRowIndex);

          var _this$_getNormalizedE = this._getNormalizedEditCellOptions(options),
              columnIndex = _this$_getNormalizedE.columnIndex,
              rowIndex = _this$_getNormalizedE.rowIndex,
              column = _this$_getNormalizedE.column,
              item = _this$_getNormalizedE.item;

          var params = {
            data: item === null || item === void 0 ? void 0 : item.data,
            cancel: false,
            column: column
          };

          if (item.key === undefined) {
            this._dataController.fireError('E1043');

            return;
          }

          if (column && item && (item.rowType === 'data' || item.rowType === 'detailAdaptive') && !item.removed && this.isCellOrBatchEditMode()) {
            if (!isEditByOptionChanged && this.isEditCell(rowIndex, columnIndex)) {
              return true;
            }

            var editRowIndex = rowIndex + dataController.getRowIndexOffset();
            return (0, _deferred2.when)(this._beforeEditCell(rowIndex, columnIndex, item)).done(function (cancel) {
              if (cancel) {
                return;
              }

              if (!_this5._prepareEditCell(params, item, columnIndex, editRowIndex)) {
                _this5._processCanceledEditingCell();
              }
            });
          }

          return false;
        },
        _beforeEditCell: function _beforeEditCell(rowIndex, columnIndex, item) {
          var _this6 = this;

          if (this.isCellEditMode() && !item.isNewRow && this.hasChanges()) {
            var d = new _deferred2.Deferred();
            this.saveEditData().always(function () {
              d.resolve(_this6.hasChanges());
            });
            return d;
          }
        },
        publicMethods: function publicMethods() {
          var publicMethods = this.callBase.apply(this, arguments);
          return publicMethods.concat(['editCell', 'closeEditCell']);
        },
        _getNormalizedEditCellOptions: function _getNormalizedEditCellOptions(_ref) {
          var oldColumnIndex = _ref.oldColumnIndex,
              oldRowIndex = _ref.oldRowIndex,
              columnIndex = _ref.columnIndex,
              rowIndex = _ref.rowIndex;
          var columnsController = this._columnsController;
          var visibleColumns = columnsController.getVisibleColumns();

          var items = this._dataController.items();

          var item = items[rowIndex];
          var oldColumn;

          if ((0, _type.isDefined)(oldColumnIndex)) {
            oldColumn = visibleColumns[oldColumnIndex];
          } else {
            oldColumn = this._getEditColumn();
          }

          if (!(0, _type.isDefined)(oldRowIndex)) {
            oldRowIndex = this._getVisibleEditRowIndex();
          }

          if ((0, _type.isString)(columnIndex)) {
            columnIndex = columnsController.columnOption(columnIndex, 'index');
            columnIndex = columnsController.getVisibleIndex(columnIndex);
          }

          var column = visibleColumns[columnIndex];
          return {
            oldColumn: oldColumn,
            columnIndex: columnIndex,
            oldRowIndex: oldRowIndex,
            rowIndex: rowIndex,
            column: column,
            item: item
          };
        },
        _prepareEditCell: function _prepareEditCell(params, item, editColumnIndex, editRowIndex) {
          if (!item.isNewRow) {
            params.key = item.key;
          }

          if (this._isEditingStart(params)) {
            return false;
          }

          this._pageIndex = this._dataController.pageIndex();

          this._setEditRowKey(item.key);

          this._setEditColumnNameByIndex(editColumnIndex);

          if (!params.column.showEditorAlways) {
            var _item$oldData;

            this._addInternalData({
              key: item.key,
              oldData: (_item$oldData = item.oldData) !== null && _item$oldData !== void 0 ? _item$oldData : item.data
            });
          }

          return true;
        },
        closeEditCell: function closeEditCell(isError, withoutSaveEditData) {
          var _this7 = this;

          var result = (0, _deferred2.when)();

          var oldEditRowIndex = this._getVisibleEditRowIndex();

          if (this.isCellOrBatchEditMode()) {
            var deferred = new _deferred2.Deferred();
            result = new _deferred2.Deferred();
            this.executeOperation(deferred, function () {
              _this7._closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData).always(result.resolve);
            });
          }

          return result.promise();
        },
        _closeEditCellCore: function _closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData) {
          var _this8 = this;

          var dataController = this._dataController;
          var deferred = new _deferred2.Deferred();
          var promise = deferred.promise();

          if (this.isCellEditMode() && this.hasChanges()) {
            if (!withoutSaveEditData) {
              this.saveEditData().done(function (error) {
                if (!_this8.hasChanges()) {
                  _this8.closeEditCell(!!error).always(deferred.resolve);

                  return;
                }

                deferred.resolve();
              });
              return promise;
            }
          } else {
            this._resetEditRowKey();

            this._resetEditColumnName();

            if (oldEditRowIndex >= 0) {
              var rowIndices = [oldEditRowIndex];

              this._beforeCloseEditCellInBatchMode(rowIndices);

              if (!isError) {
                dataController.updateItems({
                  changeType: 'update',
                  rowIndices: rowIndices
                });
              }
            }
          }

          deferred.resolve();
          return promise;
        },
        _resetModifiedClassCells: function _resetModifiedClassCells(changes) {
          var _this9 = this;

          if (this.isBatchEditMode()) {
            var columnsCount = this._columnsController.getVisibleColumns().length;

            changes.forEach(function (_ref2) {
              var key = _ref2.key;

              var rowIndex = _this9._dataController.getRowIndexByKey(key);

              if (rowIndex !== -1) {
                for (var columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
                  _this9._rowsView._getCellElement(rowIndex, columnIndex).removeClass(CELL_MODIFIED_CLASS);
                }
              }
            });
          }
        },
        _prepareChange: function _prepareChange(options, value, text) {
          var $cellElement = (0, _renderer.default)(options.cellElement);

          if (this.isBatchEditMode() && options.key !== undefined) {
            this._applyModified($cellElement, options);
          }

          return this.callBase.apply(this, arguments);
        },
        _cancelSaving: function _cancelSaving() {
          var dataController = this._dataController;

          if (this.isCellOrBatchEditMode()) {
            if (this.isBatchEditMode()) {
              this._resetEditIndices();
            }

            dataController.updateItems();
          }

          this.callBase.apply(this, arguments);
        },
        optionChanged: function optionChanged(args) {
          var fullName = args.fullName;

          if (args.name === 'editing' && fullName === EDITING_EDITCOLUMNNAME_OPTION_NAME) {
            this._handleEditColumnNameChange(args);

            args.handled = true;
          } else {
            this.callBase(args);
          }
        },
        _editCellFromOptionChanged: function _editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex) {
          var _this10 = this;

          var columns = this._columnsController.getVisibleColumns();

          if (columnIndex > -1) {
            (0, _common.deferRender)(function () {
              _this10._repaintEditCell(columns[columnIndex], columns[oldColumnIndex], oldRowIndex);
            });
          }
        },
        _handleEditRowKeyChange: function _handleEditRowKeyChange(args) {
          if (this.isCellOrBatchEditMode()) {
            var columnIndex = this._getVisibleEditColumnIndex();

            var oldRowIndexCorrection = this._getEditRowIndexCorrection();

            var oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue) + oldRowIndexCorrection;

            if ((0, _type.isDefined)(args.value) && args.value !== args.previousValue) {
              var _this$_editCellFromOp;

              (_this$_editCellFromOp = this._editCellFromOptionChanged) === null || _this$_editCellFromOp === void 0 ? void 0 : _this$_editCellFromOp.call(this, columnIndex, columnIndex, oldRowIndex);
            }
          } else {
            this.callBase.apply(this, arguments);
          }
        },
        deleteRow: function deleteRow(rowIndex) {
          var _this11 = this;

          if (this.isCellEditMode() && this.isEditing()) {
            var isNewRow = this._dataController.items()[rowIndex].isNewRow;

            var rowKey = this._dataController.getKeyByRowIndex(rowIndex); // T850905


            this.closeEditCell(null, isNewRow).always(function () {
              rowIndex = _this11._dataController.getRowIndexByKey(rowKey);

              _this11._checkAndDeleteRow(rowIndex);
            });
          } else {
            this.callBase.apply(this, arguments);
          }
        },
        _checkAndDeleteRow: function _checkAndDeleteRow(rowIndex) {
          if (this.isBatchEditMode()) {
            this._deleteRowCore(rowIndex);
          } else {
            this.callBase.apply(this, arguments);
          }
        },
        _refreshCore: function _refreshCore(isPageChanged) {
          var needResetIndexes = this.isBatchEditMode() || isPageChanged && this.option('scrolling.mode') !== 'virtual';

          if (this.isCellOrBatchEditMode()) {
            if (needResetIndexes) {
              this._resetEditColumnName();

              this._resetEditRowKey();
            }
          } else {
            this.callBase.apply(this, arguments);
          }
        },
        _allowRowAdding: function _allowRowAdding(params) {
          if (this.isBatchEditMode()) {
            return true;
          }

          return this.callBase.apply(this, arguments);
        },
        _afterDeleteRow: function _afterDeleteRow(rowIndex, oldEditRowIndex) {
          var dataController = this._dataController;

          if (this.isBatchEditMode()) {
            dataController.updateItems({
              changeType: 'update',
              rowIndices: [oldEditRowIndex, rowIndex]
            });
            return new _deferred2.Deferred().resolve();
          }

          return this.callBase.apply(this, arguments);
        },
        _updateEditRow: function _updateEditRow(row, forceUpdateRow, isCustomSetCellValue) {
          if (this.isCellOrBatchEditMode()) {
            this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
          } else {
            this.callBase.apply(this, arguments);
          }
        },
        _isDefaultButtonVisible: function _isDefaultButtonVisible(button, options) {
          if (this.isCellOrBatchEditMode()) {
            var isBatchMode = this.isBatchEditMode();

            switch (button.name) {
              case 'save':
              case 'cancel':
              case 'edit':
                return false;

              case 'delete':
                return this.callBase.apply(this, arguments) && (!isBatchMode || !options.row.removed);

              case 'undelete':
                return isBatchMode && this.allowDeleting(options) && options.row.removed;

              default:
                return this.callBase.apply(this, arguments);
            }
          }

          return this.callBase.apply(this, arguments);
        },
        _isRowDeleteAllowed: function _isRowDeleteAllowed() {
          var callBase = this.callBase.apply(this, arguments);
          return callBase || this.isBatchEditMode();
        },
        _beforeEndSaving: function _beforeEndSaving(changes) {
          if (this.isCellEditMode()) {
            var _changes$;

            if (((_changes$ = changes[0]) === null || _changes$ === void 0 ? void 0 : _changes$.type) !== 'update') {
              this.callBase.apply(this, arguments);
            }
          } else {
            if (this.isBatchEditMode()) {
              this._resetModifiedClassCells(changes);
            }

            this.callBase.apply(this, arguments);
          }
        },
        prepareEditButtons: function prepareEditButtons(headerPanel) {
          var editingOptions = this.option('editing') || {};
          var buttonItems = this.callBase.apply(this, arguments);

          if ((editingOptions.allowUpdating || editingOptions.allowAdding || editingOptions.allowDeleting) && this.isBatchEditMode()) {
            buttonItems.push(this.prepareButtonItem(headerPanel, 'save', 'saveEditData', 21));
            buttonItems.push(this.prepareButtonItem(headerPanel, 'revert', 'cancelEditData', 22));
          }

          return buttonItems;
        },
        _applyChange: function _applyChange(options, params, forceUpdateRow) {
          var isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;
          var showEditorAlways = options.column.showEditorAlways;
          var isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;
          var focusPreviousEditingCell = showEditorAlways && !forceUpdateRow && isUpdateInCellMode && this.hasEditData() && !this.isEditCell(options.rowIndex, options.columnIndex);

          if (focusPreviousEditingCell) {
            this._focusEditingCell();

            this._updateEditRow(options.row, true, isCustomSetCellValue);

            return;
          }

          return this.callBase.apply(this, arguments);
        },
        _applyChangeCore: function _applyChangeCore(options, forceUpdateRow) {
          var showEditorAlways = options.column.showEditorAlways;
          var isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;

          if (showEditorAlways && !forceUpdateRow) {
            if (isUpdateInCellMode) {
              this._setEditRowKey(options.row.key, true);

              this._setEditColumnNameByIndex(options.columnIndex, true);

              return this.saveEditData();
            } else if (this.isBatchEditMode()) {
              forceUpdateRow = this._needUpdateRow(options.column);
              return this.callBase(options, forceUpdateRow);
            }
          }

          return this.callBase.apply(this, arguments);
        },
        _processDataItemCore: function _processDataItemCore(item, _ref3) {
          var data = _ref3.data,
              type = _ref3.type;

          if (this.isBatchEditMode() && type === DATA_EDIT_DATA_REMOVE_TYPE) {
            item.data = (0, _array_utils.createObjectWithChanges)(item.data, data);
          }

          this.callBase.apply(this, arguments);
        },
        _processRemoveCore: function _processRemoveCore(changes, editIndex, processIfBatch) {
          if (this.isBatchEditMode() && !processIfBatch) {
            return;
          }

          return this.callBase.apply(this, arguments);
        },
        _processRemoveIfError: function _processRemoveIfError() {
          if (this.isBatchEditMode()) {
            return;
          }

          return this.callBase.apply(this, arguments);
        },
        _beforeFocusElementInRow: function _beforeFocusElementInRow(rowIndex) {
          this.callBase.apply(this, arguments);
          var editRowIndex = rowIndex >= 0 ? rowIndex : 0;
          var columnIndex = this.getFirstEditableColumnIndex();
          columnIndex >= 0 && this.editCell(editRowIndex, columnIndex);
        }
      }
    },
    views: {
      rowsView: {
        _createTable: function _createTable() {
          var $table = this.callBase.apply(this, arguments);
          var editingController = this._editingController;

          if (editingController.isCellOrBatchEditMode() && this.option('editing.allowUpdating')) {
            _events_engine.default.on($table, (0, _index.addNamespace)(_hold.default.name, 'dxDataGridRowsView'), 'td:not(.' + EDITOR_CELL_CLASS + ')', this.createAction(function () {
              if (editingController.isEditing()) {
                editingController.closeEditCell();
              }
            }));
          }

          return $table;
        },
        _createRow: function _createRow(row) {
          var $row = this.callBase.apply(this, arguments);

          if (row) {
            var editingController = this._editingController;
            var isRowRemoved = !!row.removed;

            if (editingController.isBatchEditMode()) {
              isRowRemoved && $row.addClass(ROW_REMOVED);
            }
          }

          return $row;
        }
      },
      headerPanel: {
        isVisible: function isVisible() {
          var editingOptions = this.getController('editing').option('editing');
          return this.callBase() || editingOptions && (editingOptions.allowUpdating || editingOptions.allowDeleting) && editingOptions.mode === _uiGrid_core.EDIT_MODE_BATCH;
        }
      }
    }
  }
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;