Ext.define('PDA.view.main.policy.Policy_Gird', {
    extend: 'Ext.grid.Panel',
    xtype: 'policy_grid',
    scrollable: true,
    maxHeight: 500,
    border: true,
    cls: 'pda_grid',
    controller: 'policy',
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
                    me.store.reload();
                }
            }]
        }];

        me.store = Ext.create('PDA.store.Policy');

        me.columns = [{
            text: 'Policy Name', dataIndex: 'id', flex: 2, align: 'left'
        },{
            text: 'Type', dataIndex: 'type', flex: 1, align: 'left'
        },{
            text: 'Enabled', dataIndex: 'enabled', flex: 0.4, align: 'left'
        },{
            text: 'Event', dataIndex: 'event', flex: 1.5, align: 'left'
        },{
            text: 'Action', dataIndex: 'actions', flex: 2, align: 'left', renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                if (record.get('type').toLowerCase() == 'start-end') {
                    return 'actions.start: ' + record.get('actions.start') + ' action.end: ' + record.get('actions.end');
                }
                return value;
            }
        },{
            text: 'Suppression', dataIndex: 'suppression', flex: 1, align: 'left'
        },{
            text: 'Log Level', hidden: true, dataIndex: 'log.level', flex: 1, align: 'left'
        }];

        me.listeners = {
            afterrender: function (cmp) {
            },
            select: function (cmp, record, index, e) {
                me.down('#edit_btn') && me.down('#edit_btn').setDisabled(record == null ? true : false);
                me.down('#delete_btn') && me.down('#delete_btn').setDisabled(record == null ? true : false);
            },
            activate: function (cmp) {
                console.log('===activate policy grid==');
                me.loadData();
            }
        };
        me.callParent();
    },

    loadData: function () {
        var me = this;
        me.store.on('beforeload', function (store, operation, e) {
            var params = store.getProxy().extraParams;
            params.Urls = PDA.Global.FED_PUT_URL + 'pda_api/' + window.sessionStorage.getItem('host') + '/policies';
            params.user = window.sessionStorage.getItem('user');
            params.password = window.sessionStorage.getItem('password');
        });
        me.store.load({
            callback: function (records, option, success) {
                console.log('====policy records: ', records);
            }
        });
    },

    activateEdit: function (action) {
        var me = this;
        var parentCtl = me.up('policy_policy') || null
        if (parentCtl) {
            parentCtl.actionParam.action = action;
            if (action == "edit") {
                parentCtl.actionParam.record = me.getSelection()[0]
            }
            parentCtl.setActiveItem('policy_edit');
        }
    },

    deleteRec: function () {
        var me = this;
        if (me.getSelection() && me.getSelection().length == 1) {
            var id = me.getSelection()[0].get('id');
            Ext.MessageBox.confirm('Delete', 'Are you sure to delete ' + id + '?', function(btn) {
                if (btn === "yes") {
                    var method = "DELETE";
                    var s_msg = "delete policy successfully";
                    var f_msg = "delete policy failed";
                    var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/policies/' + id;
                    me.getController().onSaveClick({method: 'delete', url: api_url, title: 'Policy', s_msg: s_msg, f_msg: f_msg, callback_fun: me.loadData});
                }
                else {
                }
            });
        }
    }
});

