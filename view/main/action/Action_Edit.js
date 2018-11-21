Ext.define('Ext.ux.CustomSpinner', {
    extend: 'Ext.form.field.Spinner',
    alias: 'widget.customspinner',

    // override onSpinUp
    onSpinUp: function() {
        var me = this;
        if (!me.readOnly) {
            var val = parseInt(me.getValue().split(' '), 10)||0;
            var index = me.numList.indexOf(val);
            if (index + me.step >= me.numList.length) {
                num = me.numList[me.numList.length - 1];
            }
            else if (index + me.step <= 0) {
                num = me.numList[0];
            }
            else {
                num = me.numList[index + me.step]
            }
            me.setValue(num);
        }
    },

    // override onSpinDown
    onSpinDown: function() {
        var me = this;
        if (!me.readOnly) {
           var val = parseInt(me.getValue().split(' '), 10)||0;
           var index = me.numList.indexOf(val);
           if (index - me.step <= 0) {
                num = me.numList[0];
           }
           else if (index - me.step >= me.numList.length) {
                num = me.numList[me.numList.length - 1];
           }
           else {
                num = me.numList[index - me.step]
           }
           me.setValue(num);
        }
    }
});

Ext.define('PDA.view.main.action.Action_Edit', {
    extend: 'Ext.panel.Panel',
    xtype: 'action_edit',
    scrollable: true,
    height: 500,
    bodyPadding: 10,
    controller: 'action',
    initComponent: function () {
        var me = this;
        //me.html = 'this is policy edit';
        var left_items = [{
            itemId: 'action_lbl',
            margin: '5 5 5 20',
            xtype: 'label',
            autoEl: 'div',
            html: 'Create Action'
        },{
            /*
            itemId: 'action_name',
            fieldLabel: 'Action Name*',
            required: true,
            placeHolder: 'required'
            */
            itemId: 'actionname_panel',
            xtype: 'container',
            height: 33,
            layout: {
                type: 'table',
                columns: 3
            },
            defaults: {
                xtype: 'textfield',
                labelSeparator: '',
                bodyPadding: 5,
                listeners: {
                    change: function (cmp, newval) {
                        me.setBtns();
                    }
                }
            },
            items: [{
                tdAttrs: {
                    'width': 132
                },
                xtype: 'label',
                html: 'Action Name*'
            },{
                itemId: 'action_prefix',
                xtype: 'label',
                cellCls: 'policy_td',
                itemCls: 'policy_td',
                html: 'action.email.'
            },{
                labelWidth: 0,
                width: '100%',
                itemId: 'action_name',
                vtype: 'EAPname',
                fieldLabel: '',
                required: true,
                placeHolder: 'required'
            }]
        },{
            itemId: 'edit_name',
            xtype: 'displayfield',
            fieldLabel: 'Action Name*',
            value: ''
        },{
            itemId: 'type',
            xtype: 'combobox',
            fieldLabel: 'Type',
            editable: false,
            store: {
                fields: ['type', 'value'],
                data: []
            },
            value: 1,
            displayField: 'type',
            valueField: 'value',
            queryMode: 'local',
            listeners: {
                afterrender: function (cmp) {
                    cmp.setValue(1);
                    me.cmpControl(1);
                },
                change: function (cmp, newval) {
                    me.cmpControl(newval);
                    var a_prefix = PDA.Global.ACTION_EMAIL_PREFIX;
                    if (newval == 1) {
                        a_prefix = PDA.Global.ACTION_EMAIL_PREFIX;
                    }
                    else if (newval == 2) {
                        a_prefix = PDA.Global.ACTION_ARCSERVE_PREFIX;
                    }
                    else if (newval == 3) {
                        a_prefix = PDA.Global.ACTION_CMD_RAW_PREFIX;
                    }
                    else if (newval == 4) {
                        a_prefix = PDA.Global.ACTION_PS_CMD_PREFIX;
                    }
                    else if (newval == 5) {
                        a_prefix = PDA.Global.ACTION_SMS_TWILIO_PREFIX;
                    }
                    else if (newval == 6) {
                        a_prefix = PDA.Global.ACTION_DRP_UPDATE_PREFIX;
                    }
                    else if (newval == 7) {
                        a_prefix = PDA.Global.ACTION_DRP_RESTORE_PREFIX;
                    }
                    else if (newval == 8) {
                        a_prefix = PDA.Global.ACTION_DRP_SNAPSHOT_PREFIX;
                    }
                    me.down('#action_prefix').update(a_prefix);
                }
            }
        },{
            itemId: 'subject',
            fieldLabel: 'Subject*',
            required: true,
            group: 'email',
            placeHolder: 'required'
        },{
            itemId: 'from',
            fieldLabel: 'From*',
            required: true,
            group: 'email',
            placeHolder: 'required'
        },{
            itemId: 'sms_to',
            fieldLabel: 'To*',
            required: true,
            group: 'sms',
            emptyText: '+886912345678'
        },{
            itemId: 'to',
            fieldLabel: 'To*',
            required: true,
            group: 'email',
            placeHolder: 'required'
        },{
            itemId: 'cc',
            group: 'email',
            fieldLabel: 'CC',
        },{
            itemId: 'bcc',
            group: 'email',
            fieldLabel: 'BCC',
        },{
            itemId: 'sms_body',
            xtype: 'textarea',
            group: 'sms',
            fieldLabel: 'Body',
        },{
            itemId: 'body',
            xtype: 'textarea',
            group: 'email',
            fieldLabel: 'Body',
        },{
            margin: '5 5 5 165',
            xtype: 'label',
            group: 'email',
            autoEl: 'div',
            html: '(Please add comma between e-mail addresses in the To/CC/BCC field)'
        },{
            itemId: 'schedule_panel',
            xtype: 'container',
            height: 33,
            layout: {
                type: 'table',
                columns: 3
            },
            items: [{
                width: 135,
                xtype: 'label',
                autoEl: 'div',
                html: 'Schedule Interval'
            },{
            	width: 245,
                itemId: 'num_spinner',
                xtype: 'customspinner',
                fieldLabel: '',
                numList : [],
                step: 1
            },{
                width: 165,
                style: {
                    'margin-left': '5px'
                },
                itemId: 'unit_combo',
                xtype: 'combobox',
                fieldLabel: '',
                store: {
                    fields: ['type', 'display'],
                    data:[{
                        type:'minute', display: PDA.Global.SCHEDULER_PATTERN_MINUTE
                    },{
                        type:'hour', display: PDA.Global.SCHEDULER_PATTERN_HOUR
                    },{
                        type:'day', display: PDA.Global.SCHEDULER_PATTERN_DAY
                    }]
                },
                valueField: 'type',
                displayField: 'display',
                value: 'hour',
                queryMode: 'local',
                listeners: {
                    afterrender: function (cmp) {
                        me.loadIntervalData('hour');
                    },
                    change: function(cmp, newValue, oldValue, eOpts) {
                        me.loadIntervalData(newValue);
                    }
                }
            }] 
        },{
        	itemId: 'restore_label',
            margin: '5 5 5 165',
            xtype: 'label',
            autoEl: 'div',
            html: '(Restore to the saved schedule when start action executed.)'
        },{
            itemId: 'arc_command',
            xtype: 'textarea',
            required: true,
            group: 'arc',
            fieldLabel: 'Command*',
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
                    me.setData();
                }
            },{
                itemId: 'test_btn',
                margin: '0 0 0 10',
                xtype: 'button',
                disabledCls: 'login-btn1-diabled',
                text: 'Cancel',
                cls: 'btn-cancel',
                handler: me.activateGrid
            }]
        }];
        me.layout= {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
        };
        me.items = [{
            xtype: 'container',
            width: 550,
            defaults: {
                xtype: 'textfield',
                labelWidth: 130,
                width: 550,
                labelSeparator: '',
                bodyPadding: 5,
                margin: '5 5 5 30',
                listeners: {
                    change: function (cmp, newval) {
                        me.setBtns();
                    }
                }
            },
            items: left_items
        }];
        me.listeners = {
            afterrender: function (cmp) {
            },
            activate: function (cmp) {
                var action_store = Ext.ComponentQuery.query("action_edit")[0].down("#type").store;
                action_store.removeAll();
                var app = window.sessionStorage.getItem('application');
                action_store.add({'type': PDA.Global.ACTION_EMAIL, 'value': 1});
                action_store.add({'type': PDA.Global.ACTION_SMS_TWILIO, 'value': 5});
                if (app == PDA.Global.APPLICATION_ARCSERVE) {
                    action_store.add({'type': PDA.Global.ACTION_ARCSERVE, 'value': 2});
                    action_store.add({'type': PDA.Global.ACTION_CMD_RAW, 'value': 3});
                    action_store.add({'type': PDA.Global.ACTION_PS_CMD, 'value': 4});
                }
                if (app == PDA.Global.APPLICATION_DRPROPHET) {
                    action_store.add({'type': PDA.Global.ACTION_DRP_UPDATE, 'value': 6});
                    action_store.add({'type': PDA.Global.ACTION_DRP_RESTORE, 'value': 7});
                    action_store.add({'type': PDA.Global.ACTION_DRP_SNAPSHOT, 'value': 8});
                }

                me.loadData();
                me.setBtns();
            }
        };
        me.callParent();
    },

    loadIntervalData: function (newValue) {
        var me = this;
        var n_itvl_spin = me.down('#num_spinner');
        if (newValue == 'minute') {
        	n_itvl_spin.numList = [10, 15, 30]
        	n_itvl_spin.setValue(10);
        }
        else if (newValue == 'hour') {
        	n_itvl_spin.numList = [1, 2, 3, 4, 6, 8, 12]
            n_itvl_spin.setValue(4);
        }
        else if (newValue == 'day') {
        	n_itvl_spin.numList = []
        	for (var i = 1; i <= 31; i++) {
                n_itvl_spin.numList.push(i);
            }
            n_itvl_spin.setValue(15);
        }
    },
    
    activateGrid: function () {
        var me = this;
        var parentCtl = me.up('action_action') || null;
        if (parentCtl) {
            parentCtl.setActiveItem('action_grid');
        }
    },

    dataValidation: function () {
        var me = this;
        var ret = true;
        var txtflds = me.query('textfield[xtype=textfield][required=true], textfield[xtype=textarea][required=true]') || null;
        if (txtflds) {
            for (var i = 0; i < txtflds.length; i++) {
                console.log('==txtfld: ', txtflds[i]);
                if (txtflds[i].isVisible() && (txtflds[i].getValue() == '' || txtflds[i].getValue() == null)) {
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
    },

    loadData: function (action, record) {
        var me = this;
        var parentCtl = me.up('action_action') || null;
        if (parentCtl && parentCtl.actionParam) {
            var action = parentCtl.actionParam.action;
            me.setPage(parentCtl.actionParam);
            if (action == "create") {
                me.down('#action_lbl').update("Create Action");
            }
            else {
                me.down('#action_lbl').update("Edit Action");
            }
            me.down('#actionname_panel').setVisible(action == "create" ? true : false);
            me.down('#action_name').setVisible(action == "create" ? true : false);
            me.down('#edit_name').setVisible(action == "create" ? false : true);
        }
    },

    cmpControl: function (type) {
        var me = this;
        var grp_email = me.query('[group=email]') || [];
        var grp_arc = me.query('[group=arc]') || [];
        var grp_sms = me.query('[group=sms]') || [];
        for (var i = 0; i < grp_email.length; i++) {
            grp_email[i].setVisible(type == 1 ? true : false);
        }
        for (var i = 0; i < grp_arc.length; i++) {
            grp_arc[i].setVisible((type == 2 || type == 3 || type == 4) ? true : false);
            me.down('#schedule_panel').setVisible(type == 6 ? true : false);
            me.down('#restore_label').setVisible(type == 7 ? true : false);
        }
        for (var i = 0; i < grp_sms.length; i++) {
            grp_sms[i].setVisible(type == 5 ? true : false);
        }
        me.setBtns();
    },

    setPage: function (param) {
        var me = this;
        if (param.action == "create") {
            me.down('#action_name').setValue('');
            me.down('#type').setValue(me.down('#type').store.getAt(0));
            me.down('#subject').setValue('');
            me.down('#from').setValue('');
            me.down('#to').setValue('');
            me.down('#cc').setValue('');
            me.down('#bcc').setValue('');
            me.down('#body').setValue('');
            me.down('#arc_command').setValue('');
            me.down('#sms_to').setValue('');
            me.down('#sms_body').setValue('');
        }
        else {
            var rec = param.record;
            //need to load record into components
            /*
            if (rec.get('command') != undefined) {
                me.down('#type').setValue(2);
            }
            else {
                me.down('#type').setValue(1);
            }
            */
            if (rec.get('id').indexOf(PDA.Global.ACTION_EMAIL_PREFIX, 0) >= 0) {
                me.down('#type').setValue(1);
            }
            else if (rec.get('id').indexOf(PDA.Global.ACTION_ARCSERVE_PREFIX , 0) >= 0) {
                me.down('#type').setValue(2);
            }
            else if (rec.get('id').indexOf(PDA.Global.ACTION_CMD_RAW_PREFIX, 0) >= 0) {
                me.down('#type').setValue(3);
            }
            else if (rec.get('id').indexOf(PDA.Global.ACTION_SMS_TWILIO_PREFIX, 0) >= 0) {
                me.down('#type').setValue(5);
            }
            else if (rec.get('id').indexOf(PDA.Global.ACTION_DRP_UPDATE_PREFIX, 0) >= 0) {
                me.down('#type').setValue(6);
            }
            else if (rec.get('id').indexOf(PDA.Global.ACTION_DRP_RESTORE_PREFIX, 0) >= 0) {
                me.down('#type').setValue(7);
            }
            else if (rec.get('id').indexOf(PDA.Global.ACTION_DRP_SNAPSHOT_PREFIX, 0) >= 0) {
                me.down('#type').setValue(8);
            }
            else {
                me.down('#type').setValue(4);
            }
            me.down('#edit_name').setValue(rec.get('id'));
            me.down('#subject').setValue(rec.get('subject'));
            me.down('#from').setValue(rec.get('from'));
            me.down('#to').setValue(rec.get('to'));
            me.down('#sms_to').setValue(rec.get('to'));
            me.down('#cc').setValue(rec.get('cc'));
            me.down('#bcc').setValue(rec.get('bcc'));
            me.down('#body').setValue(rec.get('body'));
            me.down('#sms_body').setValue(rec.get('body'));
            me.down('#arc_command').setValue(rec.get('command'));
        }
    },
    
    setData: function (test) {
        var me = this;
        var parentCtl = me.up('action_action') || null
        if (me.dataValidation()) {
            var id = me.down('#action_name').getValue();
            id = me.down('#action_prefix').html  + id;
            if (parentCtl.actionParam.action == "edit") {
                id = me.down('#edit_name').getValue();
            }
            var subject = me.down('#subject').getValue();
            var to = me.down('#to').getValue();
            var from = me.down('#from').getValue();
            var cc = me.down('#cc').getValue();
            var bcc = me.down('#bcc').getValue();
            var body = me.down('#body').getValue();
            var command = me.down('#arc_command').getValue();
            var type = me.down('#type').getValue();
            var sms_to = me.down('#sms_to').getValue();
            var sms_body = me.down('#sms_body').getValue();
            var schedule_unit = me.down('#unit_combo').getValue();
            var schedule_num = me.down('#num_spinner').getValue();
            var metadata = {
                "action": {
                }
            };
            if (type == 1) {
                metadata["action"]["subject"] = subject;
                metadata["action"]["to"] = to;
                metadata["action"]["from"] = from;
                metadata["action"]["cc"] = cc;
                metadata["action"]["bcc"] = bcc;
                metadata["action"]["body"] = body;
            }
            else if (type == 5) {
                metadata["action"]["to"] = sms_to;
                metadata["action"]["body"] = sms_body;
            }
            else if (type == 6) {
            	metadata["action"]["command"] = '{backupjob}';
            	cron_str = ''
            	index = 0
            	if (schedule_unit == 'minute') {
                    index = 0;
                }
                else if (schedule_unit == 'hour') {
                    index = 1;
                }
                else if (schedule_unit == 'day') {
                	index = 2;
                }
                for (var i = 0; i < 5; i++) {
                	if (i != index) {
                		cron_str += '*'
                	}
                	else {
                		cron_str += '*/' + schedule_num
                	}
                	if (i != 4) {
                		cron_str += ' '
                	}
                }
            	metadata["action"]["schedule"] = cron_str ;
            }
            else if (type == 7) {
            	metadata["action"]["command"] = '{removejob}';
            }
            else if (type == 8) {
                metadata["action"]["command"] = '{fullbackup}';
            }
            else {
                metadata["action"]["command"] = command;
            }
            var method = "PUT";
            var s_msg = "Update action successfully";
            var f_msg = "Update action failed";
            var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/actions/' + id;
            if (parentCtl.actionParam.action == "create") {
                method = "POST";
                metadata["id"] = id;
                api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/actions/';
                var s_msg = "Create action successfully";
                var f_msg = "Create action failed";
            }
            me.getController().onSaveClick({method: method, url: api_url, metadata: metadata, title: 'Action', s_msg: s_msg, f_msg: f_msg, callback_fun: me.activateGrid});
        }
    }
});

