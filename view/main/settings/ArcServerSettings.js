Ext.define('PDA.view.main.settings.ArcServerSettings', {
    extend: 'Ext.panel.Panel',
    requires: [
        'PDA.view.main.settings.SettingsController'
    ],
    xtype: 'settings_arcserver',
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
            labelWidth: 120,
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
            itemId: 'host',
            fieldLabel: 'Host*',
            placeHolder: 'required',
        },{
            itemId: 'username',
            fieldLabel: 'Username*',
            placeHolder: 'required',
        },{
            itemId: 'password',
            fieldLabel: 'Passowrd*',
            placeHolder: 'required',
            inputType: 'password',
        },{
            itemId: 'agent_username',
            fieldLabel: 'Agent Username*',
            placeHolder: 'required',
        },{
            itemId: 'agent_password',
            fieldLabel: 'Agent Passowrd*',
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
                /*
                    if (me.dataValidation()) {
                        var host = me.down('#host').getValue();
                        var username = me.down('#username').getValue();
                        var password = me.down('#password').getValue();
                        var agent_username = me.down('#agent_username').getValue();
                        var agent_password = me.down('#agent_password').getValue();
                        var metadata = {
                            "arcserve": {
                                "host": host,
                                "username": username,
                                "password": password,
                                "agent_username": agent_username,
                                "agent_password": agent_password
                            }
                        };
                        me.getController().onSaveClick({url: 'pda_api/' + window.sessionStorage.getItem('host') + '/settings/arcserve', metadata: metadata, title: 'ArcServe'});
                    }
                    */
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
                console.log('===activate acrserver===');
                me.loadData();
            }
        };
        me.callParent(arguments);
    },

    setData: function (test) {
        var me = this;
        if (me.dataValidation()) {
            var host = me.down('#host').getValue();
            var username = me.down('#username').getValue();
            var password = me.down('#password').getValue();
            var agent_username = me.down('#agent_username').getValue();
            var agent_password = me.down('#agent_password').getValue();
            var metadata = {
                "arcserve": {
                    "host": host,
                    "username": username,
                    "password": password,
                    "agent_username": agent_username,
                    "agent_password": agent_password
                }
            };
            var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/settings/arcserve';
            if (test) {
                api_url += ('?action=test');
            }
            me.getController().onSaveClick({url: api_url, metadata: metadata, title: 'ArcServe', test: test});
        }
    },

    loadData: function () {
        var me = this;
        PDA.view.main.Utils_Api.callApi({
            method: 'GET',
            timeout: 120000,
            title: 'ArcServe',
            apiUrl: 'pda_api/' + window.sessionStorage.getItem('host') + '/settings/arcserve',
            apiCallback: function (options, success, response) {
                console.log('===arcserve: ', response);
                me.reiniPage();
                var j_data = Ext.JSON.decode(response.responseText, true) || null;
                if (success && j_data && j_data.res && j_data.success) {
                    if (j_data.res.arcserve && j_data.res.arcserve["host"] != undefined) {
                        me.down('#host').setValue(j_data.res.arcserve["host"]);
                    }
                    if (j_data.res.arcserve && j_data.res.arcserve["username"] != undefined) {
                        me.down('#username').setValue(j_data.res.arcserve["username"]);
                    }
                    if (j_data.res.arcserve && j_data.res.arcserve["password"] != undefined) {
                        me.down('#password').setValue(j_data.res.arcserve["password"]);
                    }
                    if (j_data.res.arcserve && j_data.res.arcserve["agent_username"] != undefined) {
                        me.down('#agent_username').setValue(j_data.res.arcserve["agent_username"]);
                    }
                    if (j_data.res.arcserve && j_data.res.arcserve["agent_password"] != undefined) {
                        me.down('#agent_password').setValue(j_data.res.arcserve["agent_password"]);
                    }
                }
            }
        });
    },

    reiniPage: function () {
        var me = this;
        me.down('#host').setValue('');
        me.down('#username').setValue('');
        me.down('#password').setValue('');
        me.down('#agent_username').setValue('');
        me.down('#agent_password').setValue('');
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
    }
});
