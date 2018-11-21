Ext.define('PDA.view.main.settings.SettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings',
    requires: ['Ext.window.Toast'],

    onSaveClick1: function (param) {
        console.log('===metadata: ', param.metadata);
        var method = 'PUT';
        if (param && param.method) {
            method = param.method;
        }
        PDA.view.main.Utils_Api.callApi({
            method: method,
            timeout: 120000,
            title: param.title,
            apiUrl: param.url,
            reqBody: param.metadata,
            scope: this,
            apiCallback: function (options, success, response) {
                console.log('===put response: ', response);
                if (success) {
                    var j_data = Ext.JSON.decode(response.responseText, true) || null;
                    if (j_data && j_data.success) {
                        if (this.getView() && Ext.isFunction(this.getView().loadData) && (param.test == false)) {
                            console.log('===setting loadData in Controller===');
                            this.getView().loadData();
                        }
                        if (param && param.callback_fun && Ext.isFunction (param.callback_fun)) {
                            Ext.callback(param.callback_fun, this.getView(), [options, success, response, param.callbackArgs]);
                        }
                        Ext.toast({
                            html: param.s_msg,
                            cls: 'pda_toast_s',
                            bodyCls: 'pda_toast_body_s',
                            align: 'tr'
                        });
                        return;
                    }
                }
                Ext.toast({
                    html: param.f_msg,
                    cls: 'pda_toast',
                    bodyCls: 'pda_toast_body',
                    align: 'tr'
                });
                return;
            }
        });
    },

    onSaveClick: function (param) {
        console.log('===metadata: ', param.metadata);
        var method = 'PUT';
        if (param && param.method) {
            method = param.method;
        }
        PDA.view.main.Utils_Api.callApi({
            method: method,
            timeout: 120000,
            title: param.title,
            apiUrl: param.url,
            reqBody: param.metadata,
            scope: this,
            apiCallback: function (options, success, response) {
                console.log('===put response: ', response);
                if (success) {
                    var j_data = Ext.JSON.decode(response.responseText, true) || null;
                    if (j_data && j_data.success) {
                        if (this.getView() && Ext.isFunction(this.getView().loadData) && (param.test == false)) {
                            console.log('===setting loadData in Controller===');
                            this.getView().loadData();
                        }
                        if (param && param.callback_fun && Ext.isFunction (param.callback_fun)) {
                            Ext.callback(param.callback_fun, this.getView(), [options, success, response, param.callbackArgs]);
                        }
                        var msg = "Setup " + param.title + " successfully.";
                        if (param.test) {
                            msg = "Test " + param.title + " successfully.";
                        }
                        Ext.toast({
                            html: msg,
                            cls: 'pda_toast_s',
                            bodyCls: 'pda_toast_body_s',
                            align: 'tr'
                        });
                        return;
                    }
                }
                var msg = "Failed to setup " + param.title + ".";
                if (param.test) {
                    msg = "Failed to test " + param.title + "."
                }
                Ext.toast({
                    html: msg,
                    cls: 'pda_toast',
                    bodyCls: 'pda_toast_body',
                    align: 'tr'
                });
                return;
            }
        });
    }
});
