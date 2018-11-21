Ext.define('PDA.view.main.settings.SMTPSettings', {
    extend: 'Ext.panel.Panel',
    requires: [
        'PDA.view.main.settings.SettingsController'
    ],
    xtype: 'settings_smtp',
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
        var left_items = [{
        /*
            margin: '5 5 5 20',
            xtype: 'label',
            autoEl: 'div',
            html: 'Configuration'
        },{
            itemId: 'smtp_status',
            xtype: 'combobox',
            fieldLabel: 'Status',
            editable: false,
            store: {
                fields: ['enabled', 'value'],
                data: [{
                    enabled: true, value: 'Enabled'
                },{
                    enabled: false, value: 'Disabled'
                }]
            },
            value: 'Disabled',
            displayField: 'value',
            valueField: 'enabled',
            queryMode: 'local',
        },{
            itemId: 'smtp_level',
            xtype: 'combobox',
            fieldLabel: 'Level',
            editable: false,
            store: {
                fields: ['level', 'value'],
                data: [{
                    level: 'Critical', value: 'critical'
                },{
                    level: 'Error', value: 'error'
                },{
                    level: 'Warning', value: 'warning'
                },{
                    level: 'Info', value: 'info'
                }]
            },
            value: 'error',
            displayField: 'level',
            valueField: 'value',
            queryMode: 'local'
        },{
            xtype: 'container',
            layout: {
                type: 'table',
                columns: 3
            },
            items: [{
                width: 135,
                xtype: 'label',
                autoEl: 'div',
                html: 'Interval'
            },{
                width: 80,
                itemId: 'smtp_num_combo',
                xtype: 'combobox',
                fieldLabel: '',
                store: {
                    fields: ['number'],
                    data:[{number:5},{number:10},{number:15},{number:30}]
                },
                valueField: 'number',
                displayField: 'number',
                value: 5,
                queryMode: 'local'
            },{
                width: 110,
                style: {
                    'margin-left': '5px'
                },
                itemId: 'smtp_unit_combo',
                xtype: 'combobox',
                fieldLabel: '',
                store: {
                    fields: ['type', 'display'],
                    data:[{type:'minute', display: 'MINUTE'}, {type:'hour', display: 'HOUR'}]
                },
                valueField: 'type',
                displayField: 'display',
                value: 'minute',
                queryMode: 'local',
                listeners: {
                    change: function(cmp, newValue, oldValue, eOpts) {
                        var n_itvl_combo = me.down('#smtp_num_combo');
                        if (newValue == 'minute') {
                            n_itvl_combo.bindStore({
                                fields:['number'],
                                data:[{number:5},{number:10},{number:15},{number:30}]
                            });
                            n_itvl_combo.setValue(5);
                        }
                        else {
                            n_itvl_combo.bindStore({
                                fields:['number'],
                                data:[{number:1},{number:2},{number:3},{number:4},{number:6},{number:8},{number:12},{number:24}]
                            });
                            n_itvl_combo.setValue(1);
                        }
                    }
                }
            }]
        },{
            margin: '5 5 5 20',
            xtype: 'label',
            autoEl: 'div',
            html: 'SMTP'
        },{
        */
            itemId: 'server',
            fieldLabel: 'Server*',
            placeHolder: 'required'
        },{
            itemId: 'port',
            xtype: 'numberfield',
            value: 25,
            fieldLabel: 'Port*',
        },{
            itemId: 'smtp_conn_sec',
            xtype: 'combobox',
            fieldLabel: 'Connection Security',
            editable: false,
            store: {
                fields: ['value', 'display'],
                data: [{
                    value: 'None', display: 'None'
                },{
                    value: 'SSL', display: 'SSL'
                },{
                    value: 'STARTTLS', display: 'STARTTLS'
                }]
            },
            value: 'None',
            displayField: 'display',
            valueField: 'value',
            queryMode: 'local',
            listeners: {
                change: function (cmp, newval) {
                    if (newval == 'SSL') {
                        me.down('#port').setValue(465);
                    }
                    else if (newval == 'STARTTLS') {
                        me.down('#port').setValue(587);
                    }
                    else {
                        me.down('#port').setValue(25);
                    }
                }
            }
        },{
            itemId: 'user',
            fieldLabel: 'Username',
            required: false,
            placeHolder: 'required'
        },{
            itemId: 'password',
            fieldLabel: 'Password',
            inputType: 'password',
            required: false,
            placeHolder: 'required'
        },{
            xtype: 'label',
            autoEl: 'div',
            html: '(Only provide username and password if authentication is required for your SMTP server)'
        },{
            xtype: 'container',
            layout: {
                type: 'table',
                columns: 2 
            },
            style: {
                'maring-top': '200px',
                'margin-left': '100px'
            },
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
                        var host = me.down('#server').getValue();
                        var port = parseInt(me.down('#port').getValue());
                        var security = me.down('#smtp_conn_sec').getValue();
                        var user = me.down('#user').getValue();
                        var password = me.down('#password').getValue();
                        var metadata = {
                            "smtp": {
                                "smtp.host": host,
                                "smtp.port": port,
                                "smtp.security": security,
                                "smtp.username": user,
                                "smtp.password": password
                            }
                        };
                        me.getController().onSaveClick({url: 'pda_api/' + window.sessionStorage.getItem('host') + '/settings/smtp', metadata: metadata, title: 'SMTP'});
                    }
                    */
                }
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
            }]
        }];
        /*
        var right_items = [{
            margin: '5 5 5 20',
            xtype: 'label',
            autoEl: 'div',
            html: 'Message'
        },{
            itemId: 'from',
            fieldLabel: 'From*',
            placeHolder: 'required'
        },{
            itemId: 'to',
            fieldLabel: 'To*',
            placeHolder: 'required'
        },{
            itemId: 'cc',
            xtype: 'textarea',
            fieldLabel: 'CC',
        },{
            margin: '5 5 5 165',
            xtype: 'label',
            autoEl: 'div',
            html: '(Please add comma between e-mail addresses in the To/CC field)'
        },{
            xtype: 'tbspacer',
            height: 130
        },{
            xtype: 'container',
            layout: {
                type: 'table',
                columns: 3
            },
            style: {
                'maring-top': '200px',
                'margin-left': '100px'
            },
            items: [{
                xtype: 'tbspacer',
                width: 420,
            },{
                itemId: 'save_btn',
                xtype: 'button',
                disabledCls: 'login-btn1-diabled',
                disabled: true,
                formBind: true,
                text: 'Save',
                cls: 'btn-primary'
            },{
                itemId: 'test_btn',
                margin: '0 0 0 10',
                xtype: 'button',
                disabledCls: 'login-btn1-diabled',
                disabled: true,
                text: 'Test',
                cls: 'btn-primary'
            }]
        }];
        */
        me.layout= {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
        };
        me.items = [{
            xtype: 'container',
            width: 400,
            defaults: {
                xtype: 'textfield',
                labelWidth: 130,
                width: 330,
                labelSeparator: '',
                bodyPadding: 5,
                margin: '5 5 5 20',
                required: true,
                listeners: {
                    change: function (cmp, newval) {
                        me.setBtns();
                    }
                }
            },
            items: left_items
        /*
        },{
            xtype: 'container',
            width: 600,
            defaults: {
                xtype: 'textfield',
                labelWidth: 130,
                width: 530,
                labelSeparator: '',
                bodyPadding: 5,
                margin: '5 5 5 30',
                required: true,
                listeners: {
                    change: function (cmp, newval) {
                        me.setBtns();
                    }
                }
            },
            items: right_items
            */
        }];
        me.listeners = {
            activate: function (cmp) {
                console.log('===activate smtp===');
                me.loadData();
            }
        };
        me.callParent(arguments);
    },

    setData: function (test) {
        var me = this;
        if (me.dataValidation()) {
            var host = me.down('#server').getValue();
            var port = parseInt(me.down('#port').getValue());
            var security = me.down('#smtp_conn_sec').getValue();
            var user = me.down('#user').getValue();
            var password = me.down('#password').getValue();
            var metadata = {
                "smtp": {
                    "smtp.host": host,
                    "smtp.port": port,
                    "smtp.security": security,
                    "smtp.username": user,
                    "smtp.password": password
                }
            };
            var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/settings/smtp';
            if (test) {
                api_url += ('?action=test');
            }
            me.getController().onSaveClick({url: api_url, metadata: metadata, title: 'SMTP', test: test});
        }
    },

    dataValidation: function () {
        var me = this;
        var ret = true;
        var txtflds = me.query('textfield[xtype=textfield][required=true],textfield[xtype=numberfield][required=true]') || null;
        if (txtflds) {
            for (var i = 0; i < txtflds.length; i++) {
                if (txtflds[i].getValue() == '' || txtflds[i].getValue() == null) {
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
        me.down('#test_btn') && me.down('#test_btn').setDisabled(!val);
    },

    loadData: function () {
        var me = this;
        PDA.view.main.Utils_Api.callApi({
            method: 'GET',
            timeout: 120000,
            title: 'SMTP',
            apiUrl: 'pda_api/' + window.sessionStorage.getItem('host') + '/settings/smtp',
            apiCallback: function (options, success, response) {
                console.log('===smtp: ', response);
                me.reiniPage();
                var j_data = Ext.JSON.decode(response.responseText, true) || null;
                if (success && j_data && j_data.res && j_data.success) {
                    if (j_data.res.smtp && j_data.res.smtp["smtp.host"] != undefined) {
                        me.down('#server').setValue(j_data.res.smtp["smtp.host"]);
                    }
                    if (j_data.res.smtp && j_data.res.smtp["smtp.port"] != undefined) {
                        me.down('#port').setValue(j_data.res.smtp["smtp.port"]);
                    }
                    if (j_data.res.smtp && j_data.res.smtp["smtp.security"] != undefined) {
                        me.down('#smtp_conn_sec').setValue(j_data.res.smtp["smtp.security"]);
                    }
                    if (j_data.res.smtp && j_data.res.smtp["smtp.username"] != undefined) {
                        me.down('#user').setValue(j_data.res.smtp["smtp.username"]);
                    }
                    if (j_data.res.smtp && j_data.res.smtp["smtp.password"] != undefined) {
                        me.down('#password').setValue(j_data.res.smtp["smtp.password"]);
                    }
                }
            }
        });
    },

    reiniPage: function () {
        var me = this;
        me.down('#server').setValue('');
        me.down('#port').setValue(25);
        me.down('#smtp_conn_sec').setValue(me.down('#smtp_conn_sec').store.getAt(0));
        me.down('#user').setValue('');
        me.down('#password').setValue('');
    }
});
