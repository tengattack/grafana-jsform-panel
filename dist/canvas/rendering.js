'use strict';

System.register(['lodash', 'app/core/core', 'jquery', '../libs/jsoneditor'], function (_export, _context) {
  "use strict";

  var _, appEvents, contextSrv, $, JSONEditor, _typeof;

  function link(scope, elem, attrs, ctrl) {
    var data = void 0,
        panel = void 0,
        timeRange = void 0,
        editor = void 0,
        context = void 0;

    console.log('timeSrv', ctrl.timeSrv);

    var $panel = elem.find('.jsform-panel');

    updateJsonSchema();

    ctrl.events.on('render', function () {
      render();
      ctrl.renderingCompleted();
    });

    ctrl.events.on('update-json-schema', function () {
      updateJsonSchema();
    });

    ctrl.events.on('submit', function () {
      submit();
    });

    function onMouseDown(event) {
      if (!panel) {
        return;
      }

      $(document).one('mouseup', mouseUpHandler);
    }

    function onMouseUp() {
      $(document).unbind('mouseup', mouseUpHandler);
      mouseUpHandler = null;
    }

    function onMouseLeave() {
      if (!panel) {
        return;
      }
    }

    function onMouseMove(event) {
      if (!panel) {
        return;
      }
    }

    function mouseUpHandler() {
      onMouseUp();
    }

    function render() {
      data = ctrl.data;
      panel = ctrl.panel;
      timeRange = ctrl.range;
    }

    function updateJsonSchema() {
      if (editor) {
        editor.destroy();
        editor = null;
      }

      var $editor = $panel.find('.json-editor');
      var jsonSchema = void 0;
      try {
        jsonSchema = JSON.parse(ctrl.panel.jsonSchema);
      } catch (e) {
        // show errors
        $editor.html('JSON schema syntax error');
        return;
      }

      var uploadHandler = void 0;
      if (ctrl.panel.uploadHandler) {
        try {
          uploadHandler = eval('(' + ctrl.panel.uploadHandler + ')');
        } catch (e) {
          $editor.html('Upload handler syntax error');
          return;
        }
        if ((typeof uploadHandler === 'undefined' ? 'undefined' : _typeof(uploadHandler)) !== 'object') {
          $editor.html('Upload handler should be an object');
          return;
        }
      }
      // Specify upload handler
      JSONEditor.defaults.callbacks.upload = uploadHandler;

      $editor.html('');
      editor = new JSONEditor($editor[0], {
        disable_collapse: true,
        disable_edit_json: true,
        disable_properties: true,
        schema: jsonSchema
      });
    }

    function submit() {
      if (!editor) {
        return;
      }

      var $errmsg = $panel.find('.editor-submit .errmsg');
      $errmsg.hide();

      var errors = editor.validate();

      if (errors.length) {
        var optShowErrors = editor.options.show_errors;
        // Would change the option and call `onChange`
        editor.setOption('show_errors', 'always');
        editor.root.showValidationErrors(errors);
        editor.setOption('show_errors', optShowErrors);
        return;
      }

      if (ctrl.panel.submitConfirmMsg) {
        if (!window.confirm(ctrl.panel.submitConfirmMsg)) {
          return;
        }
      }

      var $submitBtn = $panel.find('.editor-submit button');
      $submitBtn.prop('disabled', true);

      var data = editor.getValue();
      var ajaxOpts = {
        method: 'POST',
        url: ctrl.panel.formActionUrl,
        data: data,
        dataType: 'json',
        success: function success(res) {
          var message = 'success';
          if ((typeof res === 'undefined' ? 'undefined' : _typeof(res)) === 'object') {
            if (ctrl.panel.ajaxSuccessPath) {
              message = _.get(res, ctrl.panel.ajaxSuccessPath);
            } else {
              message = JSON.stringify(res);
            }
          } else if (typeof res === 'string') {
            message = res;
          }
          $errmsg.css('color', 'green').text(message).show();
          $submitBtn.prop('disabled', false);
          if (ctrl.panel.refreshOnSuccess) {
            ctrl.timeSrv.refreshDashboard();
          }
        },
        error: function error(xhr, ajaxOptions, thrownError) {
          var message = 'error';
          if (!xhr.responseText) {
            message = 'Error: ' + xhr.status;
          } else {
            var res = void 0;
            try {
              res = JSON.parse(xhr.responseText);
            } catch (e) {
              // PASS
            }
            if ((typeof res === 'undefined' ? 'undefined' : _typeof(res)) === 'object') {
              if (ctrl.panel.ajaxFailurePath) {
                message = _.get(res, ctrl.panel.ajaxFailurePath);
              } else {
                message = JSON.stringify(res);
              }
            } else if (typeof res === 'string') {
              message = res;
            } else {
              message = xhr.responseText;
            }
          }
          $errmsg.css('color', 'red').text(message).show();
          $submitBtn.prop('disabled', false);
        }
      };
      if (ctrl.panel.formContentType === 'json') {
        ajaxOpts.data = JSON.stringify(data);
        ajaxOpts.contentType = 'application/json; charset=utf-8';
      }
      if (ctrl.panel.ajaxCredentials) {
        ajaxOpts.xhrFields = {
          withCredentials: true
        };
      }
      $.ajax(ajaxOpts);
    }

    $panel.on('mousedown', onMouseDown);
    $panel.on('mousemove', onMouseMove);
    $panel.on('mouseleave', onMouseLeave);
  }

  _export('default', link);

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreCore) {
      appEvents = _appCoreCore.appEvents;
      contextSrv = _appCoreCore.contextSrv;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_libsJsoneditor) {
      JSONEditor = _libsJsoneditor.JSONEditor;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }
  };
});
//# sourceMappingURL=rendering.js.map
