import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import { contextSrv } from 'app/core/core';
import kbn from 'app/core/utils/kbn';

import canvasRendering from './canvas/rendering';
import { JsformOptionsEditor } from './options-editor';
import './css/jsform-panel.css!';
import './css/flatpickr.css!';

const panelDefaults = {
  jsonSchema: '',
  submitButtonText: 'Submit',
  submitConfirmMsg: '',
  formActionUrl: '',
  formContentType: 'urlencoded',
  refreshOnSuccess: true,
  ajaxCredentials: false,
  ajaxSuccessPath: 'info',
  ajaxFailurePath: 'info',

  uploadHandler: '',
};

export class JSFormCtrl extends MetricsPanelCtrl {
  static templateUrl = 'module.html';

  constructor($scope, $injector, $rootScope, timeSrv, variableSrv) {
    super($scope, $injector);

    this.dataList = null;
    this.data = {};
    this.timeSrv = timeSrv;
    this.variableSrv = variableSrv;
    this.variableNames = _.map(variableSrv.variables, 'name');
    this.theme = contextSrv.user.lightTheme ? 'light' : 'dark';

    _.defaultsDeep(this.panel, panelDefaults);

    this.events.on('data-received', this.onDataReceived);
    this.events.on('data-snapshot-load', this.onDataReceived);
    this.events.on('init-edit-mode', this.onInitEditMode);
    this.events.on('render', this.onRender);
  }

  onDataReceived = (dataList) => {
    this.dataList = dataList;
    this.data = this.transformData(dataList);
    this.render();
  }

  onInitEditMode = () => {
    this.addEditorTab('Options', JsformOptionsEditor, 2);
    this.unitFormats = kbn.getUnitFormats();
  }

  onRender = () => {
    if (!this.dataList) { return; }
    this.data = this.transformData(this.dataList);
  }

  onSubmit = () => {
    this.events.emit('submit');
  }

  transformData(data) {
    return null;
  }

  link(scope, elem, attrs, ctrl) {
    canvasRendering(scope, elem, attrs, ctrl);
  }

  updateJsonSchema() {
    this.events.emit('update-json-schema');
  }
}
