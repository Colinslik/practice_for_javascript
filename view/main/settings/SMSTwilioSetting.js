Ext.define('PDA.view.main.settings.SMSTwilioSetting', {
    extend: 'Ext.panel.Panel',
    requires: [
        'PDA.view.main.settings.SettingsController'
    ],
    xtype: 'settings_smstwilio',
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
            width: 450,
            labelSeparator: '',
            margin: '5 5 5 20',
            listeners: {
                change: function (cmp, newval) {
                    me.setBtns();
                }
            }
        };
        me.items = [{
            itemId: 'endpoint',
            fieldLabel: 'End Point*',
            placeHolder: 'required',
        },{
            itemId: 'account',
            fieldLabel: 'Account*',
            placeHolder: 'required',
        },{
            itemId: 'token',
            fieldLabel: 'Token*',
            inputType: 'password',
            placeHolder: 'required',
        },{
            itemId: 'caller',
            fieldLabel: 'Caller*',
            emptyText: '+886912345678',
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
            }]
        }];
        me.listeners = {
            afterrender: function (cmp) {
            },
            activate: function (cmp) {
                console.log('===activate smstwilio===');
                me.loadData();
            }
        };
        me.callParent(arguments);
    },

    setData: function (test) {
        var me = this;
        if (me.dataValidation()) {
            var endpoint= me.down('#endpoint').getValue();
            var account = me.down('#account').getValue();
            var token = me.down('#token').getValue();
            var caller = me.down('#caller').getValue();
            var metadata = {
                "sms.twilio": {
                    "endpoint": endpoint,
                    "account": account,
                    "token": token,
                    "caller": caller
                }
            };
            var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/settings/sms.twilio';
            me.getController().onSaveClick({url: api_url, metadata: metadata, title: 'SMS Twilio', test: test});
        }
    },

    loadData: function () {
        var me = this;
        PDA.view.main.Utils_Api.callApi({
            method: 'GET',
            timeout: 120000,
            title: 'SMS Twilio',
            apiUrl: 'pda_api/' + window.sessionStorage.getItem('host') + '/settings/sms.twilio',
            apiCallback: function (options, success, response) {
                console.log('===sms twilio: ', response);
                me.reiniPage();
                var j_data = Ext.JSON.decode(response.responseText, true) || null;
                if (success && j_data && j_data.res && j_data.success) {
                    if (j_data.res["sms.twilio"] && j_data.res["sms.twilio"]["endpoint"] != undefined) {
                        me.down('#endpoint').setValue(j_data.res["sms.twilio"]["endpoint"]);
                    }
                    if (j_data.res["sms.twilio"] && j_data.res["sms.twilio"]["account"] != undefined) {
                        me.down('#account').setValue(j_data.res["sms.twilio"]["account"]);
                    }
                    if (j_data.res["sms.twilio"] && j_data.res["sms.twilio"]["token"] != undefined) {
                        me.down('#token').setValue(j_data.res["sms.twilio"]["token"]);
                    }
                    if (j_data.res["sms.twilio"] && j_data.res["sms.twilio"]["caller"] != undefined) {
                        me.down('#caller').setValue(j_data.res["sms.twilio"]["caller"]);
                    }
                }
            }
        });
    },

    reiniPage: function () {
        var me = this;
        me.down('#endpoint').setValue('');
        me.down('#account').setValue('');
        me.down('#token').setValue('');
        me.down('#caller').setValue('');
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
