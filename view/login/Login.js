Ext.define('PDA.view.login.Login', {
    extend: 'Ext.window.Window',
    xtype: 'login',
    cls: 'login-win',

    requires: [
        'PDA.view.login.LoginController',
        'Ext.form.Panel'
    ],
    "keyMap": {
        enter: {
            handler: function () {
                if (this.down('#login_btn') && this.down('#login_btn').isDisabled()) {
                    return;
                }
                this.getController().onLoginClick();
            }
        }
    },

    controller: 'login',
    //bodyPadding: 10,
    width: 350,
    //title: 'Login Window',
    header: {
        style: {
            'padding-top': '15px',
            'padding-bottom': '12px',
            'background-color': '#1565c0',
            'border-width': '0px !important'
        }
    },
    title: {
        xtype: 'component',
        style: {
            'text-align': 'center'
        },
        autoEl: {
            tage: 'div',
            html: '<div><img src="resources/images/pda/Prophetstor-transparent-white.png" style="height: 32px;width: 214px;padding-top: 2px"/></div>'
        }
    },
    closable: false,
    autoShow: true,
    style: {
        'border-width': '0px !important'
    },
    bodyStyle: {
        'border-width': '0px !important'
    },
    defaults: {
        padding: '10 10 10 10'
    },
    host_store: Ext.create('Ext.data.Store', {
        model: 'PDA.model.Hosts',
        storeId: 'host_store',
    }),
    event_host_store: Ext.create('Ext.data.Store', {
        model: 'PDA.model.Hosts',
        storeId: 'event_host_store',
    }),
    win_store: Ext.create('PDA.store.Windows_Hosts', {
        storeId: 'win_host_store'
    }),
    items: {
        xtype: 'form',
        reference: 'form',
        items: [{
            xtype: 'component',
            style: {
                'text-align': 'center'
            },
            autoEl: {
                tag: 'div',
                html: '<div style="font-weight: bold">Predictive Data Adapter</div>'
            }
        },{
            xtype: 'component',
            style: {
                'text-align': 'center',
                'margin-top': '10px'
            },
            autoEl: {
                tag: 'div',
                html: '<div>Log in to Continue</div>'
            }
        },{
            itemId: 'application_list',
            xtype: 'combobox',
            fieldLabel: 'Application',
            editable: false,
            style: {
                'margin-top': '10px'
            },
            required: true,
            labelWidth: 80,
            labelSeparator: '',
            store: {
                fields: ['type', 'display'],
                data:[{
                    type:'app_drp', display: PDA.Global.APPLICATION_DRPROPHET
                },{
                    type:'app_arcserve', display: PDA.Global.APPLICATION_ARCSERVE
                }]
            },
            valueField: 'type',
            displayField: 'display',
            value: 'app_drp',
            queryMode: 'local',
            listeners: {
            	afterrender: function (cmp) {
                    this.setVisible(false);
                },
            	change: function () {
                var me = this;
                PDA.view.main.Utils.loadHost({
                    callback: function (options, success, response) {
                    	var j_data = Ext.JSON.decode(response.responseText, true) || null;
                    	var mystore = Ext.getStore('host_store');
                    	mystore.removeAll();
                    	for (var i = 0; i < j_data.res.instances.length; i++) {
                    		var record = me.getStore().findRecord(me.valueField, me.value);
                            if (j_data.res.instances[i].application != null) {
                            	if (record.get(me.displayField) == j_data.res.instances[i].application) {
                            		mystore.add({'id': j_data.res.instances[i].id, 'lastUpdated': j_data.res.instances[i].lastUpdated, 'stats': j_data.res.instances[i].status, 'application': j_data.res.instances[i].application});
                            	}
                            }
                            else {
                            	mystore.add({'id': j_data.res.instances[i].id, 'lastUpdated': j_data.res.instances[i].lastUpdated, 'stats': j_data.res.instances[i].status, 'application': j_data.res.instances[i].application});
                            }
                        }
                        if (mystore.data.items.length > 0) {
                        	Ext.ComponentQuery.query('#host_list')[0].setDisabled(false);
                            Ext.ComponentQuery.query('#host_list')[0].setValue(mystore.getAt(0));
                        }
                        else {
                        	Ext.ComponentQuery.query('#host_list')[0].setDisabled(true);
                        	Ext.ComponentQuery.query('#host_list')[0].setValue('');
                        }
                        'onHostComboClick';
                    }
                });
            }
          }
        },{
            itemId: 'host_list',
            xtype: 'combobox',
            fieldLabel: 'PDA Host',
            editable: false,
            style: {
                'margin-top': '10px'
            },
            required: true,
            labelWidth: 80,
            labelSeparator: '',
            store: Ext.getStore('host_store'),
            /*
            store: {
                fields: ['host', 'id']
            },
            */
            value: '',
            displayField: 'id',
            valueField: 'id',
            queryMode: 'local',
            listeners: {
            	afterrender: function (cmp) {
                    this.setVisible(false);
                },
                change: 'onHostComboClick'
            }
        },{
            itemId: 'username',
            xtype: 'textfield',
            style: {
                'margin-top': '10px',
                'width': '100%'
            },
            labelAlign: 'top',
            labelSeparator: '',
            name: 'username',
            fieldLabel: 'Username',
            labelStyle: [
                'font-size: 0.9em'
            ],
            cls: 'fa-txtfld',
            submitEmptyText: false,
            allowBlank: true,
            listeners: {
                change: 'onTextFieldChange'
            }
        },{
            itemId: 'password',
            xtype: 'textfield',
            style: {
                'margin-top': '10px',
                'width': '100%'
            },
            name: 'password',
            inputType: 'password',
            fieldLabel: 'Password',
            labelAlign: 'top',
            labelSeparator: '',
            labelStyle: [
                'font-size: 0.9em'
            ],
            cls: 'fa-txtfld',
            submitEmptyText: false,
            allowBlank: true,
            listeners: {
                change: 'onTextFieldChange'
            }
        },{
            itemId: 'login_msg_pnl',
            hidden: true,
            xtype: 'panel',
            bodyPadding: 10,
            border: true,
            bodyStyle: {
                'background-color': '#fed7de',
                'border-color': '#fc5f7c !important'
            },
            style: {
                'margin-top': '10px',
                'background-color': '#fed7de',
                'border-color': '#fc5f7c'
            },
            closable: true,
            title: false,
            header: false,
            html: '<div style="color: #fb1943">Unable to login. Reason : The username or password is incorrect. Try again.</div>'
        },{
            itemId: 'login_btn',
            xtype: 'button',
            text: 'LOG IN',
            disabled: true,
            cls: 'login-btn1',
            disabledCls: 'login-btn1-diabled',
            style: {
                'margin-top': '10px'
            },
            width: 330,
            height: 36,
            //formBind: true,
            listeners: {
                click: 'onLoginClick'
            }
        }],
        dockedItems: [{
            xtype: 'label',
            dock: 'bottom',
            height: 56,
            width: '100%',
            cls: 'fed_login1',
            style: {
                'margin-top': '15px',
                'background-color': '#f4f6f8',
                'border-top': '1px solid #eeeff1',
                'text-align': 'center'
            },
            html: '<div style="margin-top: 19px">Copyright &copy; 2018 ProphetStor Data Services, Inc.</div>'
        }]
    },

    initComponent: function () {
        var me = this;
        me.listeners = {
            afterrender: function (cmp) {
                me.loadHost();
            }
        };
        me.callParent(arguments);
    },

    loadHost: function () {
        var me = this;
        var n_itvl_combo = me.down('#application_list');
        PDA.view.main.Utils.loadHost({
            callback: function (options, success, response) {
                var host_store = Ext.getStore('host_store');
                host_store.find('application', n_itvl_combo.rawValue)
                for (var i = 0; i < host_store.data.items.length; i++) {
                	if (host_store.data.items[i].data.application != null && host_store.data.items[i].data.application != n_itvl_combo.rawValue) {
                		host_store.removeAt(i)
                	}
                }
                if (host_store.data.items.length > 0) {
                	me.down('#host_list').setDisabled(false);
                    me.down('#host_list').setValue(host_store.getAt(0));
                }
                else {
                    me.down('#host_list').setDisabled(true);
                    me.down('#host_list').setValue('');
                }
            }
        });
    }
});
