Ext.define('PDA.view.main.action_center.Action_Center', {
    extend: 'Ext.panel.Panel',
    xtype: 'actioncenter_actioncenter',
    bodyPadding: '0 10 0 10',
    scrollable: 'y',
    offset: 0,
    rec_size: 0,
    total_size: 0,
    first_load: true,
    loading: false,
    cls: 'loading-info',
    //width: '100%',
    bodyCls: 'loading-info1',
    bodyStyle: {
        'background-color': '#f1f1f1'
    },
    style: {
        'background-color': '#f1f1f1'
    },
    config: {
        host: PDA.Global.HOST_ALL,
        severity: PDA.Global.HOST_ALL,
        event: PDA.Global.HOST_ALL,
        action1: PDA.Global.HOST_ALL,
        policy: PDA.Global.HOST_ALL,
        from_date: '',
        from_time: '',
        to_date: '',
        to_time: ''
    },
    requires: ['PDA.store.Event_Severity', 'PDA.store.Windows_Hosts', 'PDA.store.Event', 'PDA.store.Action', 'PDA.store.Policy'],
    dis_seq: [{key: 'time', value: 'Time'}, {key: 'event', value: 'Event'}, {key: 'host_name', value: 'Host'}, /*{key: 'severity', value: 'Severity'},*/ {key: 'disk_name', value: 'Disks'}, {key: 'policy', value: 'Policy'}, {key: 'status', value: 'Status'}, {key: 'action', value: 'Action'}, {key: 'action_result', value: 'Result'}],
    indent_item: ['host_name', 'disk_name', 'status', 'action_result'],
    initComponent: function () {
        var me = this;
        me.event_severity_store = Ext.create('PDA.store.Event_Severity');
        me.event_severity_store.insert(0, {
            'display': PDA.Global.HOST_ALL, 'value': PDA.Global.HOST_ALL
        });
        me.win_host_store = Ext.create('PDA.store.Windows_Hosts');
        me.event_store = Ext.create('PDA.store.Event');
        me.action_store = Ext.create('PDA.store.Action');
        me.policy_store = Ext.create('PDA.store.Policy');
        me.dockedItems= [{
            xtype: 'toolbar',
            height: 130,
            dock: 'top',
            border: true,
            layout: {
                tableAttrs: {
                    //width: 900,
                },
                tdAttrs: {
                    //width: 30,
                },
                trAttrs: {
                    //width: 900,
                    height: 40,
                },
                type: 'table',
                columns: 16 
            },
            items: [{
            /*
                colspan: 1,
                itemId: 'refresh_btn',
                action: 'refresh',
                xtype: 'button',
                iconCls: 'x-fa fa-refresh',
                handler: function () {
                    me.loadData(true);
                }
            },{
                colspan: 4,
                itemId: 'total',
                xtype: 'displayfield',
                fieldStyle: ['padding-top: 4px !important'],
                labelStyle: ['padding-top: 12px !important'],
                labelWidth: 40,
                fieldLabel: 'Total ',
                value: ''
            },{
            */
                width: 300,
                colspan: 4,
                labelWidth: 40,
                //margin: '0 0 0 20',
                itemId: 's_host',
                xtype: 'combobox',
                fieldLabel: 'Host',
                store: me.win_host_store,
                value: me.getHost(),//PDA.Global.HOST_ALL,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'name',
                listeners: {
                    change: function (cmp) {
                        me.setHost(cmp.getValue());
                    }
                }
            },{
                width: 285,
                colspan: 4,
                labelWidth: 50,
                //margin: '0 0 0 20',
                itemId: 's_severity',
                xtype: 'combobox',
                fieldLabel: 'Severity',
                store: me.event_severity_store,
                value: me.getSeverity(),//PDA.Global.HOST_ALL,
                queryMode: 'local',
                displayField: 'display',
                valueField: 'value',
                listeners: {
                    change: function (cmp) {
                        me.setSeverity(cmp.getValue());
                    }
                }
            },{
                colspan: 12,
                xtype: 'tbspacer'
            },{
                width: 300,
                colspan: 4,
                labelWidth: 40,
                margin: '0 0 0 0',
                padding: '0 10 0 0',
                itemId: 's_event',
                xtype: 'combobox',
                fieldLabel: 'Event',
                store: me.event_store, 
                value: me.getEvent(),//PDA.Global.HOST_ALL,
                queryMode: 'local',
                displayField: 'id',
                valueField: 'id',
                listeners: {
                    change: function (cmp) {
                        me.setEvent(cmp.getValue());
                    }
                }
            },{
                width: 285,
                colspan: 4,
                labelWidth: 50,
                //margin: '0 0 0 20',
                itemId: 's_action',
                xtype: 'combobox',
                fieldLabel: 'Action',
                store: me.action_store,
                value: me.getAction1(),//PDA.Global.HOST_ALL,
                queryMode: 'local',
                displayField: 'id',
                valueField: 'id',
                listeners: {
                    change: function (cmp) {
                        me.setAction1(cmp.getValue());
                    }
                }
            },{
                width: 330,
                colspan: 4,
                labelWidth: 50,
                //margin: '0 0 0 20',
                itemId: 's_policy',
                xtype: 'combobox',
                fieldLabel: 'Policy',
                store: me.policy_store,
                value: me.getPolicy(),//PDA.Global.HOST_ALL,
                queryMode: 'local',
                displayField: 'id',
                valueField: 'id',
                listeners: {
                    change: function (cmp) {
                        me.setPolicy(cmp.getValue());
                    }
                }
            },{
                colspan: 4,
                xtype: 'tbspacer'
            },{
                itemId: 's_fromdate',
                colspan: 3,
                labelWidth: 40,
                xtype: 'datefield',
                fieldLabel: 'From',
                value: me.getFrom_date(),
                listeners: {
                    change: function (cmp) {
                        me.setFrom_date(cmp.getValue());
                    }
                }
            },{
                itemId: 's_fromtime',
                colspan: 3,
                labelWidth: 0,
                xtype: 'timefield',
                fieldLabel: '',
                value: me.getFrom_time(),
                listeners: {
                    change: function (cmp) {
                        me.setFrom_time(cmp.getValue());
                    }
                }
            },{
                itemId: 's_todate',
                colspan: 2,
                //margin: '0 0 0 20',
                labelWidth: 20,
                xtype: 'datefield',
                fieldLabel: 'To',
                value: me.getTo_date(),
                listeners: {
                    change: function (cmp) {
                        me.setTo_date(cmp.getValue());
                    }
                }
            },{
                itemId: 's_totime',
                colspan: 2,
                labelWidth: 0,
                xtype: 'timefield',
                fieldLabel: '',
                value: me.getTo_time(),
                listeners: {
                    change: function (cmp) {
                        me.setTo_time(cmp.getValue());
                    }
                }
            },{
                colspan: 1,
                xtype: 'button',
                iconCls: 'x-fa fa-search',
                handler: function () {
                    me.loadData(true);
                }
            },{
                colspan: 1,
                itemId: 'refresh_btn',
                action: 'refresh',
                xtype: 'button',
                iconCls: 'x-fa fa-refresh',
                handler: function () {
                	me.down('#s_host').setValue(me.down('#s_host').store.getAt(0));
                    me.down('#s_severity').setValue(me.down('#s_severity').store.getAt(0));
                    me.down('#s_event').setValue(me.down('#s_event').store.getAt(0));
                    me.down('#s_action').setValue(me.down('#s_action').store.getAt(0));
                    me.down('#s_policy').setValue(me.down('#s_policy').store.getAt(0));
                    me.down('#s_fromdate').setValue('');
                    me.down('#s_fromtime').setValue('');
                    me.down('#s_todate').setValue('');
                    me.down('#s_totime').setValue('');
                    me.loadData(true);
                }
            },{
                colspan: 4,
                itemId: 'total',
                xtype: 'displayfield',
                fieldStyle: ['padding-top: 4px !important'],
                labelStyle: ['padding-top: 12px !important'],
                labelWidth: 40,
                fieldLabel: 'Total ',
                value: ''
            }]
        }];
        this.loadTask = {
            run: me.loadData,
            interval: 3000,
            scope: me
        };
        me.listeners = {
            afterrender: function (cmp) {
                me.loadData();
                me.loadWinHost();
                me.loadEvent();
                me.loadAction();
                me.loadPolicy();
                //console.log('===action center afterrender===');
                $('.loading-info1').scroll(function () {
                    //console.log('===panel scroll===');
                    if ($('.loading-info1').scrollTop() + $('.loading-info1').height() >= $('.loading-info1 .x-autocontainer-innerCt').height()) {
                        if (me.loading === false) {
                            me.loading = true;
                            //console.log("===start to loaddata===");
                            me.loadData();
                        }
                    }
                });
            },
            activate: function (cmp) {
                //Ext.TaskManager.start(this.loadTask);
                me.loadData(true);
                me.loadWinHost();
                me.loadEvent();
                me.loadAction();
                me.loadPolicy();
            },
            destroy: function (cmp) {
            }
        };
        me.callParent();
    },

    loadPolicy: function () {
        var me = this;
        me.policy_store.on('beforeload', function (store, operation, e) {
            var params = store.getProxy().extraParams;
            params.Urls = PDA.Global.FED_PUT_URL + 'pda_api/' + window.sessionStorage.getItem('host') + '/policies';
            params.user = window.sessionStorage.getItem('user');
            params.password = window.sessionStorage.getItem('password');
        });
        me.policy_store.load({
            callback: function (records, option, success) {
                var p_rec = Ext.create('PDA.model.Policy', {
                    id: PDA.Global.HOST_ALL
                });
                me.policy_store.insert(0, [p_rec]);
            }
        });
    },

    loadAction: function () {
        var me = this;
        me.action_store.on('beforeload', function (store, operation, e) {
            var params = store.getProxy().extraParams;
            params.Urls = PDA.Global.FED_PUT_URL + 'pda_api/' + window.sessionStorage.getItem('host') + '/actions';
            params.user = window.sessionStorage.getItem('user');
            params.password = window.sessionStorage.getItem('password');
        });
        me.action_store.load({
            callback: function (records, option, success) {
                var a_rec = Ext.create('PDA.model.Action', {
                    id: PDA.Global.HOST_ALL
                });
                me.action_store.insert(0, [a_rec]);
            }
        });
    },
     
    loadEvent: function () {
        var me = this;
        me.event_store.on('beforeload', function (store, operation, e) {
            var params = store.getProxy().extraParams;
            params.Urls = PDA.Global.FED_PUT_URL + 'pda_api/' + window.sessionStorage.getItem('host') + '/events';
            params.user = window.sessionStorage.getItem('user');
            params.password = window.sessionStorage.getItem('password');
        });
        me.event_store.load({
            callback: function (records, option, success) {
                var e_rec = Ext.create('PDA.model.Event', {
                    id: PDA.Global.HOST_ALL,
                    display: PDA.Global.HOST_ALL
                });
                me.event_store.insert(0, [e_rec]);
            }
        });
    },

    loadWinHost: function () {
        var me = this;
        me.win_host_store.on('beforeload', function (store, operation, e) {
            store.getProxy().url = window.location.origin + '/pda_api/' + window.sessionStorage.getItem('host') + '/hosts';
            var params = store.getProxy().extraParams;
            params.user = window.sessionStorage.getItem('user');
            params.password = window.sessionStorage.getItem('password');
        });
        me.win_host_store.load({
            callback: function (records, operation, success) {
                var as_rec = Ext.create('PDA.model.Windows_Hosts', {
                    name: PDA.Global.HOST_ALL,
                    id: PDA.Global.HOST_ALL
                });
                me.win_host_store.insert(0, [as_rec]);
                /*
                var c_rec = me.win_host_store.findRecord('name', me.getHost(), 0, false, true, true) || null;
                if (c_rec) {
                    me.down('#s_host').setValue(c_rec);
                }
                else {
                    me.down('#s_host').setValue(PDA.Global.HOST_ALL);
                }
                */
            }
        });
    },

    loadData: function (reinitial) {
        var me = this;
        var lbl_width1 = 100;
        if (reinitial) {
            me.offset = 0;
            me.total_size = 0;
        }
        var para_str = '';
        if (me.down('#s_host').getValue() != PDA.Global.HOST_ALL) {
            para_str += ('&host=' + me.down('#s_host').getValue());
        }
        if (me.down('#s_severity').getValue() != PDA.Global.HOST_ALL) {
            para_str += ('&severity=' + me.down('#s_severity').getValue());
        }
        if (me.down('#s_event').getValue() != PDA.Global.HOST_ALL) {
            para_str += ('&event=' + me.down('#s_event').getValue());
        }
        if (me.down('#s_action').getValue() != PDA.Global.HOST_ALL) {
            para_str += ('&action=' + me.down('#s_action').getValue());
        }
        if (me.down('#s_policy').getValue() != PDA.Global.HOST_ALL) {
            para_str += ('&policy=' + me.down('#s_policy').getValue());
        }
        if (me.down('#s_fromdate') && me.down('#s_fromdate').getValue()) {
            var f_t = Ext.Date.format(new Date(me.down('#s_fromdate').getValue()), 'U') || null;
            if (f_t && me.down('#s_fromtime').getValue() && me.down('#s_fromtime').value) {
                f_t = parseInt(f_t);
                var t_t = (me.down('#s_fromtime').value.getHours() * 3600) + (me.down('#s_fromtime').value.getMinutes() * 60) || null;
                if (t_t) {
                    t_t = parseInt(t_t);
                    f_t += t_t;
                }
            }
            if(f_t) {
                para_str += ("&tsfrom='" + Ext.Date.format(new Date(f_t * 1000), 'C') + "'");
            }
        }
        if (me.down('#s_todate') && me.down('#s_todate').getValue()) {
            var f_t = Ext.Date.format(new Date(me.down('#s_todate').getValue()), 'U') || null;
            if (f_t && me.down('#s_totime').getValue() && me.down('#s_totime').value) {
                f_t = parseInt(f_t);
                var t_t = (me.down('#s_totime').value.getHours() * 3600) + (me.down('#s_totime').value.getMinutes() * 60) || null;
                if (t_t) {
                    t_t = parseInt(t_t);
                    f_t += t_t;
                }
            }
            if(f_t) {
                para_str += ("&tsto='" + Ext.Date.format(new Date(f_t * 1000), 'C') + "'");
            }
        }
        PDA.view.main.Utils_Api.callApi({
            method: 'GET',
            timeout: 120000,
            title: 'Disk Prophet',
            apiUrl: 'pda_api/' + window.sessionStorage.getItem('host') + '/jobs?limit=' + PDA.Global.DEFAULT_PAGE_SIZE + '&offset=' + me.offset +para_str,
            apiCallback: function (options, success, response) {
                var j_data = Ext.JSON.decode(response.responseText, true) || null;
                var total = 0;
                if (success && j_data && j_data.success && j_data.res && j_data.res.jobs) {
                    if (reinitial) {
                        me.removeAll();
                    }
                    var overlap_offset = 0;
                    total = j_data.res.total;
                    if (me.total_size == 0) {
                        me.total_size = j_data.res.total;
                    }
                    else {
                        if (me.total_size != j_data.res.total) {
                            overlap_offset = (j_data.res.total - me.total_size);
                            me.total_size = j_data.res.total;
                        }
                    }
                    me.offset = j_data.res.offset + j_data.res.count + overlap_offset;
                    var jobs = j_data.res.jobs;
                    var content_items = [];
                    var n_item = [];
                    if (j_data.res.total == 0) {
                        me.removeAll();
                        content_items.push({
                            xtype: 'panel',
                            margin: '10 0 10 0',
                            bodyPadding: 5,
                            border: false,
                            bodyStyle: {
                                'background-color': '#fff'
                            },
                            style: {
                            },
                            defaults: {
                                xtype: 'panel',
                                layout: 'hbox'
                            },
                            items: [{
                                margin: '0 0 0 0',
                                items: [{
                                    margin: '0 0 0 5',
                                    html: 'No Rows To Show'
                                }]
                            }]
                        });
                    }
                    else {
                        for (var i = overlap_offset; i < jobs.length; i++) {
                            n_item = [];
                            var n_item_detail = [];
                            var n_rec = jobs[i];
                            var de_bk = "#fff";
                            var de_bw = "2px !important";
                            switch (jobs[i]["severity"]) {
                                case "Critical":
                                    de_bk = "#ff0000 !important";
                                    break;
                                case "High":
                                    de_bk = "#f5960b !important";
                                    break;
                                case "Medium":
                                    de_bk = "#ffeb9c !important";
                                    de_bw = "0px important";
                                    break;
                                case "Low":
                                default:
                                    de_bw = "0px !important";
                                    de_bk = "#91b8ff !important";
                                break;
                            }
                            for (var z = 0; z < me.dis_seq.length; z++) {
                                for (var j = 0; j < Object.keys(n_rec).length; j++) {
                                    if (Object.keys(n_rec)[j] == 'action_result' &&  n_rec[Object.keys(n_rec)[j]] == '') {
                                        continue;
                                    }
                                    if (me.dis_seq[z].key == Object.keys(n_rec)[j]) {
                                        var indent = false;
                                        if (Ext.Array.contains(me.indent_item, me.dis_seq[z].key)) {
                                            indent = true;
                                        }
                                        n_item_detail = [];
                                        n_item_detail.push({
                                            width: indent ? (lbl_width1 - 10) : lbl_width1,
                                            html: me.dis_seq[z].value + ':'
                                        });
                                        var val = n_rec[Object.keys(n_rec)[j]];
                                        if (Object.keys(n_rec)[j] == 'time') {
                                            var t_t = new Date(val);
                                            val = Ext.Date.format(t_t, 'Y-m-d H:i:s O');
                                        }
                                        else if (Object.keys(n_rec)[j] == 'host_name') {
                                        	if (n_rec['vm_name'] != '') {
                                        		val = ('<a href="#" class="link_host" style="color:#1565c0;text-decoration:none" link_key="' +  n_rec['vm_name'] + '"key="' + Object.keys(n_rec)[j] + '">' + val + ' ( ' + n_rec['vm_name'] + ' )' + '</a>');
                                        	}
                                        	else {
                                                val = ('<a href="#" class="link_host" style="color:#1565c0;text-decoration:none" link_key="' + val + '"key="' + Object.keys(n_rec)[j] + '">' + val + '</a>');
                                        	}
                                        }
                                        /*
                                        if (Object.keys(n_rec)[j] == 'action_result') {
                                            val = val.replace(/(?:\r\n|\r|\n)/g, '<br>');
                                            val = val.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
                                            val = val.replace(/ /g, '\u00a0');
                                        }
                                        */
                                        else if (Object.keys(n_rec)[j] == 'action_result') {
                                            val = ('<pre style="font-size: 13px;font-weight:300;font-family:\'Open Sans\', \'Helvetica Neue\', helvetica, arial, verdana, sans-serif;">' + val + '</pre>');
                                        }
                                        else if (Object.keys(n_rec)[j] == 'status') {
                                            val = '<span style="color:' + PDA.view.main.Utils.getColorForStatus(val) + '">' + val + '</span>';
                                        }
                                        n_item_detail.push({
                                            flex: 1,
                                            margin: '0 0 0 5',
                                            html: val,//n_rec[Object.keys(n_rec)[j]]
                                            object_key: Object.keys(n_rec)[j],
                                            scope: me,
                                            listeners: {
                                                afterrender: function (cmp) {
                                                    cmp.mon(cmp.getEl(), 'click', function (e, h) {
                                                        if (h.getAttribute('key') == 'host_name') {
                                                            //this.component.scope.linkToImpactMap(h.innerText);
                                                        	this.component.scope.linkToImpactMap(h.getAttribute('link_key'));
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                        n_item.push({
                                            margin:  indent ? '0 0 0 10' : '0 0 0 0',
                                            items: n_item_detail
                                        }); 
                                        break;
                                    }
                                }
                            }
                            content_items.push({
                                xtype: 'panel',
                                margin: '10 0 10 0',
                                bodyPadding: 5,
                                bodyStyle: {
                                    'background-color': '#fff',
                                    'border-color': de_bk,
                                    'border-width': de_bw//'2px !important'
                                },
                                style: {
                                },
                                defaults: {
                                    xtype: 'panel',
                                    layout: 'hbox'
                                },
                                items: n_item
                            });
                        }
                    }
                    me.add(content_items);
                }
                else {
                    me.removeAll();
                }
                me.loading = false;
                me.down('#total').setValue(total);
                me.updateLayout();
            }
        });
    },

    linkToImpactMap: function (id) {
        var me = this;
        var container = me.ownerCt || null;
        if (container) {
            var impact_page = container.down('impactmap_impactmap') || null;
            if (impact_page) {
                impact_page.forceSelect = true;
                impact_page.selectWin = id;
                container.getLayout().setActiveItem(impact_page);
            }
        }
    },

    loadData1: function () {
        var me = this;
        var lbl_width1 = 100;
        me.removeAll();
        me.insert(0, {
            xtype: 'panel',
            margin: '10 0 10 0',
            bodyPadding: 5,
            border: false,
            bodyStyle: {
                'background-color': '#fff'
            },
            style: {
            },
            //html: '<div>item: unknown<br>title: action1<br>content: this is a test</div>'
            defaults: {
                xtype: 'panel',
                layout: 'hbox'
            },
            items: [{
                items: [{
                    width: lbl_width1,
                    html: "Time:"
                },{
                    flex: 1,
                    margin: '0 0 0 5',
                    html: "Thursday, May 31, 2018 10:17 AM"
                }]
            },{
                margin: '5 0 0 0',
                items: [{
                    width: lbl_width1,
                    html: "Event:"
                },{
                    flex: 1,
                    margin: '0 0 0 5',
                    html: "Disk failure prediction - Critical<br>Host: WIN-A4AQ4781FJH<br>Disk: HGST Travelstar 7k1000 HTS721010A9E630 JR1000D33EM9UE SATA"
                }]
            },{
                margin: '5 0 0 0',
                items: [{
                    width: lbl_width1,
                    html: "Actions:"
                },{
                    flex: 1,
                    margin: '0 0 0 5',
                    html: "Email Alert: <br>Receiver: admin@pda.com<br>Title: Disk failure prediction - Critical"
                }]
            },{
                margin: '5 0 0 0',
                items: [{
                    width: lbl_width1,
                    html: "Backup Job:"
                },{
                    flex: 1,
                    margin: '0 0 0 5',
                    html: "Source: WIN-A4AQ4781FJH<br>Target: WIN-E503KHCK43N<br>Schedule: Run Once, 5/31/10 10:27 AM<br>Method: Full(Keep Archive Bit)"
                }]
            }]
        });
        me.insert(0, {
            xtype: 'panel',
            margin: '10 0 10 0',
            bodyPadding: 5,
            border: false,
            bodyStyle: {
                'background-color': '#fff'
            },
            style: {
            },
            //html: '<div>item: unknown<br>title: action1<br>content: this is a test</div>'
            defaults: {
                xtype: 'panel',
                layout: 'hbox'
            },
            items: [{
                items: [{
                    width: lbl_width1,
                    html: "Time:"
                },{
                    flex: 1,
                    margin: '0 0 0 5',
                    html: "Thursday, May 31, 2018 10:17 AM"
                }]
            },{
                margin: '5 0 0 0',
                items: [{
                    width: lbl_width1,
                    html: "Event:"
                },{
                    flex: 1,
                    margin: '0 0 0 5',
                    html: "Disk failure prediction - Warning<br>Host: WIN-A4AQ4781FJH<br>Disk: HGST Travelstar 7k1000 HTS721010A9E630 JR1000D33EM9UE SATA"
                }]
            },{
                margin: '5 0 0 0',
                items: [{
                    width: lbl_width1,
                    html: "Actions:"
                },{
                    flex: 1,
                    margin: '0 0 0 5',
                    html: "Email Alert: <br>Receiver: admin@pda.com<br>Title: Disk failure prediction - Warning"
                }]
            },{
                margin: '5 0 0 0',
                items: [{
                    width: lbl_width1,
                    html: "Backup Job:"
                },{
                    flex: 1,
                    margin: '0 0 0 5',
                    html: "Pool Name: BRAIN<br>Rotation Scheme Name: <5-day weekly incremental backup. full backup on Friday><br>Source: WIN-E503KHICK43N(C:\\test)<br>Target: WIN-E503KHCK43N<tr>Device Group: DAILY<br>Schedule: Every 1 Day(s)<tr>Execute Date and Time: 6/1/10 9:53 AM<tr>Job Submmited: 5/31/19 9:58 AM<<br>Method:<br>Sunday: No Backup<br>Monday: Incremental, Based on Archive Bit for windows and Last Modified Date for UNIX/Linux<br>Tuesday: Incremental, Based on Archive Bit for windows and Last Modified Date for UNIX/Linux"
                }]
            }]
        });
    }
});
