Ext.define('PDA.view.main.event.EventController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.event',
    requires: ['Ext.window.Toast'],

    onSaveClick: function (param) {
        console.log('===metadata: ', param.metadata);
        PDA.view.main.Utils_Api.callApi({
            method: param.method,
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
                        if (param && param.callback_fun && Ext.isFunction(param.callback_fun)) {
                            Ext.callback(param.callback_fun, this.getView());
                        }
                    /*
                        if (this.getView() && Ext.isFunction(this.getView().loadData) && (param.test == false)) {
                            console.log('===setting loadData in Controller===');
                            this.getView().loadData();
                        }
                        */
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
    }
});
