Ext.define('PDA.view.main.action.Action_Gird', {
    extend: 'Ext.grid.Panel',
    xtype: 'action_grid',
    scrollable: true,
    maxHeight: 500,
    border: true,
    cls: 'pda_grid reload',
    controller: 'action',
    initComponent: function () {
        var me = this;

        me.dockedItems = [{
            xtype: 'toolbar',
            height: 50,
            dock: 'top',
            border: true,
            items: [{
                itemId: 'create_btn',
                action: 'create',
                xtype: 'button',
                iconCls: 'x-fa fa-plus',
                handler: function () {
                    me.activateEdit("create");
                }
            },{
                itemId: 'edit_btn',
                action: 'edit',
                xtype: 'button',
                disabled: true,
                iconCls: 'x-fa fa-edit',
                handler: function () {
                    me.activateEdit("edit");
                }
            },{
                itemId: 'delete_btn',
                action: 'delete',
                xtype: 'button',
                disabled: true,
                iconCls: 'x-fa fa-trash',
                handler: function () {
                    me.deleteRec();
                }
            },{
                itemId: 'refresh_btn',
                action: 'refresh',
                xtype: 'button',
                iconCls: 'x-fa fa-refresh',
                handler: function () {
                    me.loadData();
                }
            }]
        }];

        me.store = Ext.getStore('action_store');

        me.columns = [{
            text: 'Action Name', dataIndex: 'id', flex: 1, align: 'left'
        },{
            text: 'Type', dataIndex: 'command', flex: 1, align: 'left', renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                if (record.get('id').indexOf(PDA.Global.ACTION_EMAIL_PREFIX, 0) >= 0) {
                    return PDA.Global.ACTION_EMAIL;
                }
                else if (record.get('id').indexOf(PDA.Global.ACTION_ARCSERVE_PREFIX , 0) >= 0) {
                    return PDA.Global.ACTION_ARCSERVE;
                }
                else if (record.get('id').indexOf(PDA.Global.ACTION_CMD_RAW_PREFIX, 0) >= 0) {
                    return PDA.Global.ACTION_CMD_RAW;
                }
                else if (record.get('id').indexOf(PDA.Global.ACTION_NOOP_PREFIX, 0) >= 0) {
                    return PDA.Global.ACTION_NOOP;
                }
                else if (record.get('id').indexOf(PDA.Global.ACTION_SMS_TWILIO_PREFIX, 0) >= 0) {
                    return PDA.Global.ACTION_SMS_TWILIO;
                }
                else if (record.get('id').indexOf(PDA.Global.ACTION_LOG_PREFIX, 0) >= 0) {
                    return PDA.Global.ACTION_LOG;
                }
                else if (record.get('id').indexOf(PDA.Global.ACTION_DRP_UPDATE_PREFIX, 0) >= 0) {
                    return PDA.Global.ACTION_DRP_UPDATE;
                }
                else if (record.get('id').indexOf(PDA.Global.ACTION_DRP_RESTORE_PREFIX, 0) >= 0) {
                    return PDA.Global.ACTION_DRP_RESTORE;
                }
                else if (record.get('id').indexOf(PDA.Global.ACTION_DRP_SNAPSHOT_PREFIX, 0) >= 0) {
                    return PDA.Global.ACTION_DRP_SNAPSHOT;
                }
                else {
                    return PDA.Global.ACTION_PS_CMD;
                }
            }
        },{
            text: 'Parameters', dataIndex: 'parameters', flex: 2, align: 'left', renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
            	type = record.get('id')
            	if ((type.indexOf(PDA.Global.ACTION_DRP_UPDATE_PREFIX, 0) >= 0) || (type.indexOf(PDA.Global.ACTION_DRP_RESTORE_PREFIX, 0) >= 0) || (type.indexOf(PDA.Global.ACTION_DRP_SNAPSHOT_PREFIX, 0) >= 0)) {
            		var v_str = ''
                    if (record.get('schedule')) {
                        if (v_str != '') {
                            v_str += ', ';
                        }
                        v_str += ('Schedule: ' + record.get('schedule'));
                    }
                    return v_str;
                }
                else {
                    if (record.get('command')) {
                        return 'Command: ' + record.get('command');
                    }
                    else {
                        var v_str = '';
                        if (record.get('subject')) {
                            v_str += ('Subject: ' + record.get('subject'));
                        }
                        if (record.get('to')) {
                            if (v_str != '') {
                                v_str += ', ';
                            }
                            v_str += ('To: ' + record.get('to'));
                        }
                        if (record.get('from')) {
                            if (v_str != '') {
                                v_str += ', ';
                            }
                            v_str += ('From: ' + record.get('from'));
                        }
                        if (record.get('cc')) {
                            if (v_str != '') {
                                v_str += ', ';
                            }
                            v_str += ('CC: ' + record.get('cc'));
                        }
                        if (record.get('bcc')) {
                            if (v_str != '') {
                                v_str += ', ';
                            }
                            v_str += ('bcc: ' + record.get('bcc'));
                        }
                        if (record.get('body')) {
                            if (v_str != '') {
                                v_str += ', ';
                            }
                            v_str += ('Body: ' + record.get('body'));
                        }
                            
                        return v_str;
                    }
                }
            }
        }];

        me.listeners = {
            afterrender: function (cmp) {
            },
            select: function (cmp, record, index, e) {
                var disabled = false;
                if (record == null || (record != null && (record.get('id').indexOf(PDA.Global.ACTION_NOOP_PREFIX, 0) >= 0 || record.get('id').indexOf(PDA.Global.ACTION_LOG_PREFIX, 0) >= 0))) {
                    disabled = true;
                }
                me.down('#edit_btn') && me.down('#edit_btn').setDisabled(disabled);
                me.down('#delete_btn') && me.down('#delete_btn').setDisabled(disabled);
            },
            activate: function (cmp) {
                console.log('===activate action edit==');
                me.loadData();
            }
        };
        me.callParent();
    },

    loadData: function () {
        var me = this;
        me.store.on('beforeload', function (store, operation, e) {
            var params = store.getProxy().extraParams;
            params.Urls = PDA.Global.FED_PUT_URL + 'pda_api/' + window.sessionStorage.getItem('host') + '/actions';
            params.user = window.sessionStorage.getItem('user');
            params.password = window.sessionStorage.getItem('password');
        });
        me.store.load({
            callback: function (records, option, success) {
                console.log('====action records: ', records);
            }
        });
    },

    activateEdit: function (action) {
        var me = this;
        var parentCtl = me.up('action_action') || null;
        if (parentCtl) {
            parentCtl.actionParam.action = action;
            if (action == "edit") {
                parentCtl.actionParam.record = me.getSelection()[0];
            }
            parentCtl.setActiveItem('action_edit');
        }
    },

    deleteRec: function () {
        var me = this;
        if (me.getSelection() && me.getSelection().length == 1) {
            var id = me.getSelection()[0].get('id');
            Ext.MessageBox.confirm('Delete', 'Are you sure to delete ' + id + '?', function(btn) {
                if (btn === "yes") {
                    var method = "DELETE";
                    var s_msg = "delete action successfully";
                    var f_msg = "delete action failed";
                    var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/actions/' + id;
                    me.getController().onSaveClick({method: 'delete', url: api_url, title: 'Action', s_msg: s_msg, f_msg: f_msg, callback_fun: me.loadData});
                }
                else {
                }
            });
        }
    }
});

