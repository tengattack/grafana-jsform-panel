
import _ from 'lodash';
import { appEvents, contextSrv } from 'app/core/core';
import $ from 'jquery';

import { JSONEditor } from '../libs/jsoneditor';

export default function link(scope, elem, attrs, ctrl) {
  let data, panel, timeRange, editor, context;

  console.log('timeSrv', ctrl.timeSrv)

  const $panel = elem.find('.jsform-panel');

  updateJsonSchema();

  ctrl.events.on('render', () => {
    render();
    ctrl.renderingCompleted();
  });

  ctrl.events.on('update-json-schema', () => {
    updateJsonSchema();
  });

  ctrl.events.on('submit', () => {
    submit();
  });

  function onMouseDown(event) {
    if (!panel) { return; }

    $(document).one('mouseup', mouseUpHandler);
  }

  function onMouseUp() {
    $(document).unbind('mouseup', mouseUpHandler);
    mouseUpHandler = null;
  }

  function onMouseLeave() {
    if (!panel) { return; }
  }

  function onMouseMove(event) {
    if (!panel) { return; }
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

    const $editor = $panel.find('.json-editor')
    let jsonSchema
    try {
      jsonSchema = JSON.parse(ctrl.panel.jsonSchema)
    } catch (e) {
      // show errors
      $editor.html('JSON schema syntax error')
      return
    }

    let uploadHandler
    if (ctrl.panel.uploadHandler) {
      try {
        uploadHandler = eval('(' + ctrl.panel.uploadHandler + ')')
      } catch (e) {
        $editor.html('Upload handler syntax error')
        return
      }
      if (typeof uploadHandler !== 'object') {
        $editor.html('Upload handler should be an object')
        return
      }
    }
    // Specify template engine, translates to loadsh
    JSONEditor.defaults.options.template = 'underscore'
    // Specify upload handler
    JSONEditor.defaults.callbacks.upload = uploadHandler

    $editor.html('')
    editor = new JSONEditor($editor[0], {
      disable_collapse: true,
      disable_edit_json: true,
      disable_properties: true,
      schema: jsonSchema,
    })
  }

  function submit() {
    if (!editor) { return; }

    const $errmsg = $panel.find('.editor-submit .errmsg');
    $errmsg.hide();

    const errors = editor.validate();

    if (errors.length) {
      const optShowErrors = editor.options.show_errors;
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

    const $submitBtn = $panel.find('.editor-submit button');
    $submitBtn.prop('disabled', true);

    const data = editor.getValue();
    const ajaxOpts = {
      method: 'POST',
      url: ctrl.panel.formActionUrl,
      data: data,
      dataType: 'json',
      success: function (res) {
        let message = 'success';
        if (typeof res === 'object') {
          if (ctrl.panel.ajaxSuccessPath) {
            message = _.get(res, ctrl.panel.ajaxSuccessPath)
          } else {
            message = JSON.stringify(res)
          }
        } else if (typeof res === 'string') {
          message = res
        }
        $errmsg
          .css('color', 'green')
          .text(message)
          .show();
        $submitBtn.prop('disabled', false);
        if (ctrl.panel.refreshOnSuccess) {
          ctrl.timeSrv.refreshDashboard()
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        let message = 'error';
        if (!xhr.responseText) {
          message = 'Error: ' + xhr.status
        } else {
          let res
          try {
            res = JSON.parse(xhr.responseText)
          } catch (e) {
            // PASS
          }
          if (typeof res === 'object') {
            if (ctrl.panel.ajaxFailurePath) {
              message = _.get(res, ctrl.panel.ajaxFailurePath)
            } else {
              message = JSON.stringify(res)
            }
          } else if (typeof res === 'string') {
            message = res
          } else {
            message = xhr.responseText
          }
        }
        $errmsg
          .css('color', 'red')
          .text(message)
          .show();
        $submitBtn.prop('disabled', false);
      },
    };
    if (ctrl.panel.formContentType === 'json') {
      ajaxOpts.data = JSON.stringify(data);
      ajaxOpts.contentType = 'application/json; charset=utf-8';
    }
    if (ctrl.panel.ajaxCredentials) {
      ajaxOpts.xhrFields = {
        withCredentials: true,
      };
    }
    $.ajax(ajaxOpts);
  }

  $panel.on('mousedown', onMouseDown);
  $panel.on('mousemove', onMouseMove);
  $panel.on('mouseleave', onMouseLeave);
}
