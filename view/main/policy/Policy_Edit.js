Ext.define('PDA.view.main.policy.Policy_Edit', {
    extend: 'Ext.panel.Panel',
    xtype: 'policy_edit',
    scrollable: true,
    height: 500,
    bodyPadding: 10,
    controller: 'policy',
    status_switch: null,
    initComponent: function () {
        var me = this;
        //me.html = 'this is policy edit';
        var left_items = [{
            itemId: 'action_lbl',
            margin: '5 5 5 20',
            xtype: 'label',
            autoEl: 'div',
            html: 'Create Policy'
        },{
            xtype: 'container',
            height: 28,
            layout: 'hbox',
            items: [{
                margin: '5 0 0 0',
                width: 130,
                xtype: 'label',
                autoEl: 'div',
                html: 'Enabled'
            },{
                xtype: 'label',
                html: '<input type="hidden" id="on-off-switch" value="1">',
                listeners: {
                    afterrender: function (cmp) {
                        me.status_switch = new DG.OnOffSwitch({
                            el: '#on-off-switch',
                            textOn: 'On',
                            textOff: 'Off',
                            checked: true,
                            isCheckbox: false 
                        });
                    }
                }
            }]
            /*
            itemId: 'status',
            xtype: 'combobox',
            fieldLabel: 'Enabled',
            editable: false,
            store: {
                fields: ['enabled', 'value'],
                data: [{
                    enabled: 'True', value: 'True'
                },{
                    enabled: 'False', value: 'False'
                }]
            },
            value: 'Disabled',
            displayField: 'value',
            valueField: 'enabled',
            queryMode: 'local'
            */
        },{
            itemId: 'policyname_panel',
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
                html: 'Policy Name*'
            },{
                xtype: 'label',
                cellCls: 'policy_td',
                itemCls: 'policy_td',
                html: 'policy.'
            },{
                labelWidth: 0,
                width: 260,
                itemId: 'policy_name',
                fieldLabel: '',
                required: true,
                vtype: 'EAPname',
                placeHolder: 'required'
            }]
        },{
            itemId: 'type',
            xtype: 'combobox',
            fieldLabel: 'Type',
            editable: false,
            store: {
                fields: ['type', 'value'],
                data: [{
                    type: 'Every Time', value: 'every-time'
                },{
                    type: 'Start End', value: 'start-end'
                }]
            },
            value: 'every-time',
            displayField: 'type',
            valueField: 'value',
            queryMode: 'local',
            listeners: {
                afterrender: function (cmp) {
                    cmp.setValue('every-time');
                    me.cmpControl('every-time');
                },
                change: function (cmp, newval) {
                    me.cmpControl(newval);
                }
            }
        },{
            itemId: 'suppression_panel',
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
                html: 'Suppression'
            },{
                width: 130,
                itemId: 'num_combo',
                xtype: 'combobox',
                fieldLabel: '',
                store: {
                    fields: ['number'],
                    data:[{number:5},{number:10},{number:15},{number:30}]
                },
                valueField: 'number',
                displayField: 'number',
                value: 24,
                queryMode: 'local'
            },{
                width: 160,
                style: {
                    'margin-left': '5px'
                },
                itemId: 'unit_combo',
                xtype: 'combobox',
                fieldLabel: '',
                store: {
                    fields: ['type', 'display'],
                    data:[{
                        type:'minute', display: 'MINUTE'
                    },{
                        type:'hour', display: 'HOUR'
                    },{
                        type:'day', display: 'DAY'
                    },{
                        type:'week', display: 'WEEK'
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
            itemId: 'event',
            xtype: 'combobox',
            fieldLabel: 'Event',
            editable: false,
            store: Ext.getStore('event_store'),
            value: '',
            displayField: 'id',
            valueField: 'id',
            queryMode: 'local',
            listerners: {
                change: function (cmp, newval) {
                }
            }
        },{
            itemId: 'action',
            xtype: 'container',
            layout: {
                type: 'table',
                columns: 2
            },
            style: {
                'margin-top': '15px'
            },
            items: [{
                width: 135,
                xtype: 'label',
                autoEl: 'div',
                html: 'Action*'
            },{
                itemId: 'action_menu',
                width: 295,
                height: 150,
                xtype: 'menu',
                floating: false,
                group: 'every-time',
                renderTo: this.getEl(),
                defaults: {
                    cls: 'pda_menu',
                    xtype: 'menucheckitem',
                    listeners: {
                        checkchange: function (cmp) {
                            me.setMenu(cmp);
                            me.setBtns();
                        }
                    }
                },
                /*
                listeners: {
                    afterlayout: function (cmp) {
                        var c_items = cmp.query('menucheckitem[checked=true]') || [];
                        if (c_items.length > 0) {
                            c_items[0].el.dom.scrollIntoView();
                        }
                    }
                },
                */
                items: [{
                    text: 'Action1'
                },{
                    text: 'Action2',
                    checked: true
                },{
                    text: 'Action3',
                    checked: true
                },{
                    text: 'Action4'
                },{
                    text: 'Action5'
                }]
            }]
        /*
            itemId: 'action',
            xtype: 'combobox',
            fieldLabel: 'Action',
            editable: false,
            store: {
                fields: ['action', 'value'],
                data: [{
                    action: 'Action1', value: 1
                },{
                    action: 'Action2', value: 2
                }]
            },
            value: 'Action1',
            displayField: 'action',
            valueField: 1,
            queryMode: 'local',
            listerners: {
                change: function (cmp, newval) {
                }
            }
        */
        },{
            itemId: 'start_action',
            xtype: 'container',
            layout: {
                type: 'table',
                columns: 2
            },
            style: {
                'margin-top': '15px'
            },
            items: [{
                width: 135,
                xtype: 'label',
                autoEl: 'div',
                html: 'Start Action*'
            },{
                itemId: 'start_action_menu',
                width: 295,
                height: 150,
                xtype: 'menu',
                floating: false,
                group: 'start-end',
                renderTo: this.getEl(),
                defaults: {
                    cls: 'pda_menu',
                    xtype: 'menucheckitem',
                    listeners: {
                        checkchange: function (cmp) {
                            me.setMenu(cmp);
                            me.setBtns();
                        }
                    }
                },
                items: [{
                    text: 'Action1'
                },{
                    text: 'Action2',
                    checked: true
                },{
                    text: 'Action3',
                    checked: true
                },{
                    text: 'Action4'
                },{
                    text: 'Action5'
                }]
            }]
        /*
            xtype: 'combobox',
            fieldLabel: 'Start Action',
            editable: false,
            store: {
                fields: ['action', 'value'],
                data: [{
                    action: 'Action1', value: 1
                },{
                    action: 'Action2', value: 2
                }]
            },
            value: 'Action1',
            displayField: 'action',
            valueField: 1,
            queryMode: 'local',
            listerners: {
                change: function (cmp, newval) {
                }
            }
        */
        },{
            itemId: 'end_action',
            xtype: 'container',
            layout: {
                type: 'table',
                columns: 2
            },
            style: {
                'margin-top': '15px'
            },
            items: [{
                width: 135,
                xtype: 'label',
                autoEl: 'div',
                html: 'End Action*'
            },{
                itemId: 'end_action_menu',
                width: 295,
                height: 150,
                xtype: 'menu',
                group: 'start-end',
                floating: false,
                renderTo: this.getEl(),
                defaults: {
                    cls: 'pda_menu',
                    xtype: 'menucheckitem',
                    listeners: {
                        checkchange: function (cmp) {
                            me.setMenu(cmp);
                            me.setBtns();
                        }
                    }
                },
                items: [{
                    text: 'Action1'
                },{
                    text: 'Action2',
                    checked: true
                },{
                    text: 'Action3',
                    checked: true
                },{
                    text: 'Action4'
                },{
                    text: 'Action5'
                }]
            }]
        /*
            xtype: 'combobox',
            fieldLabel: 'End Action',
            editable: false,
            store: {
                fields: ['action', 'value'],
                data: [{
                    action: 'Action1', value: 1
                },{
                    action: 'Action2', value: 2
                }]
            },
            value: 'Action1',
            displayField: 'action',
            valueField: 1,
            queryMode: 'local',
            listerners: {
                change: function (cmp, newval) {
                }
            }
        */
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
                    //me.activateGrid
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
            width: 500,
            defaults: {
                xtype: 'textfield',
                labelWidth: 130,
                width: 430,
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
                console.log('===activate policy edit==');
                me.loadData();
            }
        };
        me.callParent();
    },

    activateGrid: function () {
        var me = this;
        var parentCtl = me.up('policy_policy') || null
        if (parentCtl) {
            parentCtl.setActiveItem('policy_grid');
        }
    },

    dataValidation: function () {
        var me = this;
        var ret = true;
        var txtflds = me.query('textfield[xtype=textfield][required=true]') || null;
        var menus = me.query('menu') || null;
        if (txtflds) {
            for (var i = 0; i < txtflds.length; i++) {
                if (txtflds[i].getValue() == '' || txtflds[i].getValue() == null) {
                    ret = false;
                    break;
                }
            }
        }
        if (menus) {
            for (var i = 0; i < menus.length; i++) {
                if (menus[i].group == me.down('#type').getValue()) {
                    var checkitems = menus[i].query('menucheckitem') || [];
                    var checkedcounter = 0;
                    for (var j = 0; j < checkitems.length; j++) {
                        if (checkitems[j].checked) {
                            checkedcounter++;
                        }
                    }
                    if (checkedcounter != 1) {
                        ret = false;
                        break;
                    }
                }
            }
        }
        return ret;
    },

     setData: function (test) {
        var me = this;
        var parentCtl = me.up('policy_policy') || null
        if (me.dataValidation()) {
            var id = me.down('#policy_name').getValue();
            id = ("policy.") + id;
            //var enabled = me.down('#status').getValue();
            var enabled = me.status_switch.getValue() ? "True" : "False";
            var type = me.down('#type').getValue();
            var event = me.down('#event').getValue();
            var supp_val = me.down('#num_combo').getValue();
            var supp_unit = me.down('#unit_combo').getValue();
            var metadata = {
                "id": id,
                "policy": {
                    "enabled": enabled,
                    "type": type,
                    "event": event
                }
            };
            var method = "PUT";
            var s_msg = "Update policy successfully";
            var f_msg = "Update policy failed";
            var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/policies/' + id;
            if (parentCtl.actionParam.action == "create") {
                method = "POST";
                api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/policies/';
                var s_msg = "Create policy successfully";
                var f_msg = "Create policy failed";
            }
            if (type == 'every-time') {
                var action_menu = me.down('#action_menu');
                var action = me.getActionItem(action_menu) || null;
                var suppression = parseInt(supp_val) * PDA.view.main.Utils.getSuppressionUnit(supp_unit);
                if (action) {
                    metadata["policy"]["actions"] = action;
                    metadata["policy"]["suppression"] = suppression;
                }
            }
            else {
                var s_action_menu = me.down('#start_action_menu');
                var e_action_menu = me.down('#end_action_menu');
                var s_action = me.getActionItem(s_action_menu);
                var e_action = me.getActionItem(e_action_menu);
                if (s_action) {
                    metadata["policy"]["actions.start"] = s_action;
                    metadata["policy"]["actions.end"] = e_action;
                }
            }
            me.getController().onSaveClick({method: method, url: api_url, metadata: metadata, title: 'Policy', s_msg: s_msg, f_msg: f_msg, callback_fun: me.activateGrid});
        }
    },

    setBtns: function () {
        var me = this;
        var val = me.dataValidation() || false;
        me.down('#save_btn') && me.down('#save_btn').setDisabled(!val);
    },

    loadData: function () {
        var me = this;
        var parentCtl = me.up('policy_policy') || null;
        if (parentCtl && parentCtl.actionParam) {
            var action = parentCtl.actionParam.action;
            me.setPage(parentCtl.actionParam);
            if (action == "create") {
                me.down('#action_lbl').update("Create Policy");
            }
            else {
                me.down('#action_lbl').update("Edit Policy");
            }
        }
    },

    setPage: function (param) {
        var me = this;
        if (param.action == "create") {
            //me.down('#status').setValue(me.down('#status').store.getAt(0));
            me.status_switch.uncheck();
            me.down('#policy_name').setValue('');
            me.down('#policy_name').setDisabled(false);
            me.down('#type').setValue(me.down('#type').store.getAt(0));
            me.down('#num_combo').setValue(me.down('#num_combo').store.getAt(0));
            me.down('#unit_combo').setValue(me.down('#unit_combo').store.getAt(0));
        }
        else {
            var rec = param.record;
            //need to load record into components
            //me.down('#status').setValue(rec.get('enabled'));
            if (rec.get('enabled') == "True") {
                me.status_switch.check();
            }
            else {
                me.status_switch.uncheck();
            }
            me.down('#policy_name').setValue(rec.get('id').substring(7,));
            me.down('#policy_name').setDisabled(true);
            me.down('#type').setValue(rec.get('type'));
            if (rec.get('suppression')) {
                var suppression_obj = PDA.view.main.Utils.suppressionUnit(rec.get('suppression'));
                me.down('#num_combo').setValue(suppression_obj.value);
                me.down('#unit_combo').setValue(suppression_obj.unit);
            }
        }
        var action_store = Ext.getStore('action_store');
        action_store.reload({
            callback: function (records, operation, success) {
                me.down('#action_menu').removeAll();
                me.down('#start_action_menu').removeAll();
                me.down('#end_action_menu').removeAll();
                var a_arr = [];
                var s_arr = [];
                var e_arr = [];
                if (success && records.length > 0) {
                    for (var i = 0; i < records.length; i++) {
                        var a_checked = false, s_checked = false, e_checked = false;
                        if (param.action == "edit" && param.record) {
                            if (records[i].get('id') == param.record.get('actions')) {
                                a_checked = true;
                            }
                            if (records[i].get('id') == param.record.get('actions.start')) {
                                s_checked = true;
                            }
                            if (records[i].get('id') == param.record.get('actions.end')) {
                                e_checked = true;
                            }
                        }
                        a_arr.push({text: records[i].get('id'), checked: a_checked, tooltip: Ext.String.htmlEncode(records[i].get('id'))});
                        s_arr.push({text: records[i].get('id'), checked: s_checked, tooltip: Ext.String.htmlEncode(records[i].get('id'))});
                        e_arr.push({text: records[i].get('id'), checked: e_checked, tooltip: Ext.String.htmlEncode(records[i].get('id'))});
                    }
                }
                PDA.view.main.Utils.arr_sort(a_arr, 'text');
                PDA.view.main.Utils.arr_sort(s_arr, 'text');
                PDA.view.main.Utils.arr_sort(e_arr, 'text');
                me.down('#action_menu').add(a_arr);
                me.down('#start_action_menu').add(s_arr);
                me.down('#end_action_menu').add(e_arr);
                var a_checkeditem = me.down('#action_menu').query('menucheckitem[checked=true]') || [];
                var m_arr = me.query('menu') || [];
                for (var i = 0; i < m_arr.length; i++) {
                    var checkeditem = m_arr[i].query('menucheckitem[checked=true]') || [];
                    if (checkeditem.length > 0) {
                        checkeditem[0].on('boxready', function (cmp) {
                            cmp.el.dom.scrollIntoView();
                        });
                    }
                }
                me.setBtns();
            }
        });
        var event_store = Ext.getStore('event_store');
        event_store.reload({
            callback: function (records, operation, success) {
                if (success && records.length > 0) {
                    if (param.action == "create") {
                        me.down('#event').setValue(records[0]);
                    }
                    else {
                        var e_rec = records[0].store.findRecord('id', param.record.get('event'), 0, false, true, true) || null;
                        if (e_rec) {
                            me.down('#event').setValue(e_rec);
                        }
                    }
                }
                me.setBtns();
            }
        });
    },

    loadIntervalData: function (newValue) {
        var me = this;
        var n_itvl_combo = me.down('#num_combo');
        n_itvl_combo.clearValue();
        var num_store = n_itvl_combo.store;
        num_store.removeAll();
        if (newValue == 'minute') {
            for (var i = 30; i <= 60; i++) {
                num_store.add({number: i});
            }
            n_itvl_combo.setValue(30);
        }
        else if (newValue == 'hour') {
            for (var i = 1; i <= 24; i++) {
                num_store.add({number: i});
            }
            n_itvl_combo.setValue(24);
        }
        else if (newValue == 'day') {
            for (var i = 1; i <= 31; i++) {
                num_store.add({number: i});
            }
            n_itvl_combo.setValue(1);
        }
        else if (newValue == 'week') {
            for (var i = 1; i <= 54; i++) {
                num_store.add({number: i});
            }
            n_itvl_combo.setValue(1);
        }
    },

    setMenu: function (cmp) {
        if (cmp.checked) {
            var menu = cmp.up('menu') || null;
            if (menu) {
                var items = menu.query('menucheckitem') || [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].text != cmp.text && items[i].checked) {
                        items[i].setChecked(false); 
                    }
                }
            }
        }
    },

    getActionItem: function (menu) {
        if (menu) {
            var items = menu.query('menucheckitem') || [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].checked) {
                    return items[i].text;
                }
            }
        }
        return null;
    },

    cmpControl: function (type) {
        var me = this;
        me.down('#suppression_panel').setVisible(type == 'every-time' ? true : false);
        me.down('#action').setVisible(type == 'every-time' ? true : false)
        me.down('#start_action').setVisible(type == 'every-time' ? false : true);
        me.down('#end_action').setVisible(type == 'every-time' ? false : true);
        me.setBtns();
    }
});

