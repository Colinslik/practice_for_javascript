Ext.define('PDA.view.main.settings.DiskProphetSettings', {
    extend: 'Ext.panel.Panel',
    requires: [
        'PDA.view.main.settings.SettingsController'
    ],
    xtype: 'settings_diskprophet',
    bodyPadding: 10,
    bosyStyle: {
        'background-color': '#f1f1f1'
    },
    style: {
        'background-color': '#f1f1f1'
    },
    controller: 'settings',
    initComponent: function () {
        var me = this;
        me.defaults = {
            xtype: 'textfield',
            labelWidth: 100,
            width: 300,
            labelSeparator: '',
            margin: '5 5 5 20',
            listeners: {
                change: function (cmp, newval) {
                    me.setBtns();
                }
            }
        };
        me.items = [{
            itemId: 'dp_host',
            fieldLabel: 'Host*',
            placeHolder: 'required',
        /*
        },{
            xtype: 'combobox',
            itemId: 'dp_type',
            fieldLabel: 'Type',
            editable: false,
            store: {
                fields: ['type', 'value'],
                data: [{
                    type: 'Cloud', value: 'cloud'
                },{
                    type: 'On-Premise', value: 'on-premise'
                }]
            },
            value: 'on-premise',
            displayField: 'value',
            valueField: 'type',
            queryMode: 'local',
        */
        },{
            itemId: 'dp_username',
            fieldLabel: 'Username*',
            placeHolder: 'required',
        },{
            itemId: 'dp_password',
            fieldLabel: 'Passowrd*',
            placeHolder: 'required',
            inputType: 'password',
        },{
            xtype: 'container',
            layout: 'hbox',
            items: [{
                itemId: 'save_btn',
                xtype: 'button',
                disabledCls: 'login-btn1-diabled',
                disabled: true,
                formBind: true,
                text: 'Save',
                cls: 'btn-primary',
                handler: function () {
                    me.setData(false);
                }
            /*
            },{
                itemId: 'test_btn',
                margin: '0 0 0 10',
                xtype: 'button',
                disabledCls: 'login-btn1-diabled',
                disabled: true,
                text: 'Test',
                cls: 'btn-primary',
                handler: function () {
                    me.setData(true);
                }
            */
            }]
        }];
        me.listeners = {
            afterrender: function (cmp) {
            },
            activate: function (cmp) {
                console.log('===activate diskprophet===');
                me.loadData();
            }
        };
        me.callParent(arguments);
    },

    setData: function (test) {
        var me = this;
        if (me.dataValidation()) {
            var host = me.down('#dp_host').getValue();
            /*
            var type = me.down('#dp_type').getValue();
            */
            var username = me.down('#dp_username').getValue();
            var password = me.down('#dp_password').getValue();
            var metadata = {
                "diskprophet": {
                    "dp.host": host,
                    /*
                    "dp.api.type": type,
                    */
                    "dp.api.user": username,
                    "dp.api.passwd": password,
                    "dp.api.endpoint": 'http://' + host + ':50055/apis/v3'
                }
            };
            var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/settings/diskprophet';
            if (test) {
                api_url += ('?action=test');
            }
            me.getController().onSaveClick({url: api_url, metadata: metadata, title: 'Disk Prophet', test: test});
        }
    },

    loadData: function () {
        var me = this;
        PDA.view.main.Utils_Api.callApi({
            method: 'GET',
            timeout: 120000,
            title: 'Disk Prophet',
            apiUrl: 'pda_api/' + window.sessionStorage.getItem('host') + '/settings/diskprophet',
            apiCallback: function (options, success, response) {
                console.log('===dp: ', response);
                var j_data = Ext.JSON.decode(response.responseText, true) || null;
                me.reiniPage();
                if (success && j_data && j_data.res && j_data.success) {
                    if (j_data.res.diskprophet && j_data.res.diskprophet["dp.host"] != undefined) {
                        me.down('#dp_host').setValue(j_data.res.diskprophet["dp.host"]);
                    }
                    /*
                    if (j_data.res.diskprophet && j_data.res.diskprophet["dp.api.type"]) {
                        me.down('#dp_type').setValue(j_data.res.diskprophet["dp.api.type"]);
                    }
                    */
                    if (j_data.res.diskprophet && j_data.res.diskprophet["dp.api.user"] != undefined) {
                        me.down('#dp_username').setValue(j_data.res.diskprophet["dp.api.user"]);
                    }
                    if (j_data.res.diskprophet && j_data.res.diskprophet["dp.api.passwd"] != undefined) {
                        me.down('#dp_password').setValue(j_data.res.diskprophet["dp.api.passwd"]);
                    }
                }
            }
        });
    },

    reiniPage: function () {
        var me = this;
        me.down('#dp_host').setValue('');
        me.down('#dp_username').setValue('');
        me.down('#dp_password').setValue('');
    },

    dataValidation: function () {
        var me = this;
        var ret = true;
        var txtflds = me.query('textfield[xtype=textfield]') || null;
        if (txtflds) {
            for (var i = 0; i < txtflds.length; i++) {
                if (txtflds[i].getValue() == '') {
                    ret = false;
                    break;
                }
            }
        }
        return ret;
    },

    setBtns: function () {
        var me = this;
        var val = me.dataValidation() || false;
        me.down('#save_btn') && me.down('#save_btn').setDisabled(!val);
        //me.down('#test_btn') && me.down('#test_btn').setDisabled(!val);
    }
});
