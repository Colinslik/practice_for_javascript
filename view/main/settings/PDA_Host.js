Ext.define('PDA.view.main.settings.PDA_Host', {
    extend: 'Ext.grid.Panel',
    xtype: 'settings_pdahost',
    scollable: true,
    maxHeight: 500,
    border: true,
    cls: 'pda_grid',
    controller: 'settings',
    initComponent: function () {
        var me = this;

        me.dockedItems = [{
            xtype: 'toolbar',
            height: 50,
            dock: 'top',
            border: true,
            items: [{
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

        me.store = Ext.getStore('host_store');

        me.columns = [{
            text: 'ID', dataIndex: 'id', flex: 2, align: 'left'
        },{
            text: 'Application', dataIndex: 'application', flex: 2, align: 'left'
        },{
            text: 'Last Updated ( Server )', dataIndex: 'lastUpdated', flex: 2, align: 'left', renderer: function (value, record) {
                if (value) {
                    return Ext.Date.format(new Date(value * 1000), 'Y-m-d H:i:s O');
                }
                return '';
            }
        },{
            text: 'Agent Local Time', dataIndex: 'LocalTime', flex: 2, align: 'left', renderer: function (value, record, meta) {
                if (value) {
                	if (Math.abs(meta.data.lastUpdated - value) > 600) {
                		return '<span style="color:#ff0000">' + Ext.Date.format(new Date(value * 1000), 'Y-m-d H:i:s O') + '</span>';
                	}
                	else {
                		return Ext.Date.format(new Date(value * 1000), 'Y-m-d H:i:s O');
                	}
                }
                return '';
            }
        },{
            text: 'Agent Time Zone', dataIndex: 'TimeZone', flex: 2, align: 'left'
        },{
            text: 'Status', dataIndex: 'stats', flex: 1, align: 'left'
        }];

        me.listeners = {
            afterrender: function (cmp) {
            },
            select: function (cmp, record, index, e) {
                me.down('#delete_btn') && me.down('#delete_btn').setDisabled(record == null ? true : false);
            },
            activate: function (cmp) {
                me.loadData();
            }
        };

        me.callParent(arguments);
    },

    loadData: function () {
        var me = this;
        PDA.view.main.Utils.loadHost();
    },

    dele_callback: function (options, success, response, callbackArgs) {
        var me = this;
        me.loadData();
        var header = Ext.ComponentQuery.query('pda_header') || null;
        if (header && header.length > 0) {
            var h_com = header[0].down('#host_list') || null;
            if (h_com) {
                if (h_com.getValue() == callbackArgs.id) {
                    if (h_com.store.data.length > 0) {
                        h_com.setValue(h_com.store.getAt(0));
                    }
                    else {
                        h_com.clearValue();
                    }
                }
            }
        }
    },

    deleteRec: function () {
        var me = this;
        if (me.getSelection() && me.getSelection().length == 1) {
            var id = me.getSelection()[0].get('id');
            Ext.MessageBox.confirm('Delete', 'Are you sure to delete ' + id + '?', function(btn) {
                if (btn === "yes") {
                    var method = "DELETE";
                    var s_msg = "delete host successfully";
                    var f_msg = "delete host failed";
                    var api_url = 'pda_api/instances/' + id + '?purge=true';
                    me.getController().onSaveClick1({method: 'delete', url: api_url, title: 'Host', s_msg: s_msg, f_msg: f_msg, callback_fun: me.dele_callback, callbackArgs: {"id": id}});
                }
                else {
                }
            });
        }
    }
});
