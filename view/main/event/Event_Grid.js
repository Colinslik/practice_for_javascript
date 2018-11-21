Ext.define('PDA.view.main.action.Event_Gird', {
    extend: 'Ext.grid.Panel',
    xtype: 'event_grid',
    scrollable: true,
    maxHeight: 500,
    border: true,
    cls: 'pda_grid reload',
    controller: 'event',
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

        me.store = Ext.getStore('event_store');

        me.columns = [{
            text: 'Event Name', dataIndex: 'display', flex: 1, align: 'left'
        },{
            text: 'Conditional', dataIndex: 'conditional', flex: 2, align: 'left'
        /*
        },{
            text: 'Log Level', dataIndex: 'log.level', flex: 1, align: 'left'
        */
        }];

        me.listeners = {
            afterrender: function (cmp) {
            },
            select: function (cmp, record, index, e) {
                me.down('#edit_btn') && me.down('#edit_btn').setDisabled(record == null ? true : false);
                me.down('#delete_btn') && me.down('#delete_btn').setDisabled(record == null ? true : false);
            },
            activate: function (cmp) {
                console.log('==activate event_grid==');
                me.loadData();
            }
        };
        me.callParent();
    },

     loadData: function () {
        var me = this;
        me.store.on('beforeload', function (store, operation, e) {
            var params = store.getProxy().extraParams;
            params.Urls = PDA.Global.FED_PUT_URL + 'pda_api/' + window.sessionStorage.getItem('host') + '/events';
            params.user = window.sessionStorage.getItem('user');
            params.password = window.sessionStorage.getItem('password');
        });
        me.store.load({
            callback: function (records, option, success) {
                console.log('====event records: ', records);
            }
        });
    },

    activateEdit: function (action) {
        var me = this;
        var parentCtl = me.up('event_event') || null;
        if (parentCtl) {
            parentCtl.actionParam.action = action;
            if (action == "edit") {
                parentCtl.actionParam.record = me.getSelection()[0];
            }
            parentCtl.setActiveItem('event_edit');
        }
    },

    deleteRec: function () {
        var me = this;
        if (me.getSelection() && me.getSelection().length == 1) {
            var id = me.getSelection()[0].get('id');
            Ext.MessageBox.confirm('Delete', 'Are you sure to delete ' + id + '?', function(btn) {
                if (btn === "yes") {
                    var method = "DELETE";
                    var s_msg = "delete event successfully";
                    var f_msg = "delete event failed";
                    var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/events/' + id;
                    me.getController().onSaveClick({method: 'delete', url: api_url, title: 'Event', s_msg: s_msg, f_msg: f_msg, callback_fun: me.loadData});
                }
                else {
                }
            });
        }
    }
});

