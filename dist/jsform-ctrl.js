'use strict';

System.register(['app/plugins/sdk', 'lodash', 'app/core/core', 'app/core/utils/kbn', './canvas/rendering', './options-editor', './css/jsform-panel.css!', './css/flatpickr.css!'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, contextSrv, kbn, canvasRendering, JsformOptionsEditor, _createClass, panelDefaults, JSFormCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreCore) {
      contextSrv = _appCoreCore.contextSrv;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_canvasRendering) {
      canvasRendering = _canvasRendering.default;
    }, function (_optionsEditor) {
      JsformOptionsEditor = _optionsEditor.JsformOptionsEditor;
    }, function (_cssJsformPanelCss) {}, function (_cssFlatpickrCss) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      panelDefaults = {
        jsonSchema: '',
        submitButtonText: 'Submit',
        submitConfirmMsg: '',
        formActionUrl: '',
        formContentType: 'urlencoded',
        ajaxCredentials: false,
        ajaxSuccessPath: 'info',
        ajaxFailurePath: 'info',

        uploadHandler: ''
      };

      _export('JSFormCtrl', JSFormCtrl = function (_MetricsPanelCtrl) {
        _inherits(JSFormCtrl, _MetricsPanelCtrl);

        function JSFormCtrl($scope, $injector, $rootScope, timeSrv, variableSrv) {
          _classCallCheck(this, JSFormCtrl);

          var _this = _possibleConstructorReturn(this, (JSFormCtrl.__proto__ || Object.getPrototypeOf(JSFormCtrl)).call(this, $scope, $injector));

          _this.onDataReceived = function (dataList) {
            _this.dataList = dataList;
            _this.data = _this.transformData(dataList);
            _this.render();
          };

          _this.onInitEditMode = function () {
            _this.addEditorTab('Options', JsformOptionsEditor, 2);
            _this.unitFormats = kbn.getUnitFormats();
          };

          _this.onRender = function () {
            if (!_this.dataList) {
              return;
            }
            _this.data = _this.transformData(_this.dataList);
          };

          _this.onSubmit = function () {
            _this.events.emit('submit');
          };

          _this.dataList = null;
          _this.data = {};
          _this.timeSrv = timeSrv;
          _this.variableSrv = variableSrv;
          _this.variableNames = _.map(variableSrv.variables, 'name');
          _this.theme = contextSrv.user.lightTheme ? 'light' : 'dark';

          _.defaultsDeep(_this.panel, panelDefaults);

          _this.events.on('data-received', _this.onDataReceived);
          _this.events.on('data-snapshot-load', _this.onDataReceived);
          _this.events.on('init-edit-mode', _this.onInitEditMode);
          _this.events.on('render', _this.onRender);
          return _this;
        }

        _createClass(JSFormCtrl, [{
          key: 'transformData',
          value: function transformData(data) {
            return null;
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            canvasRendering(scope, elem, attrs, ctrl);
          }
        }, {
          key: 'updateJsonSchema',
          value: function updateJsonSchema() {
            this.events.emit('update-json-schema');
          }
        }]);

        return JSFormCtrl;
      }(MetricsPanelCtrl));

      _export('JSFormCtrl', JSFormCtrl);

      JSFormCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=jsform-ctrl.js.map
