Ext.define('PDA.view.main.action.Event_Edit', {
    extend: 'Ext.panel.Panel',
    xtype: 'event_edit',
    scrollable: true,
    height: 500,
    bodyPadding: 10,
    controller: 'event',
    requires: ['PDA.model.Windows_Hosts'],
    initComponent: function () {
        var me = this;
        //me.html = 'this is policy edit';
        var dfp_data = [{
            type: 'Critical', value: 'Bad'
        },{
            type: 'Warning', value: 'Warning'
        },{
            type: 'Good', value: 'Good' 
        }];
        var pm_data = [{
            type: 'CPU Usage', value: 1
        },{
            type: 'Memeory Usage', value: 2
        },{
            type: 'Disk Read Throughput', value: 3
        },{
            type: 'Disk Write Throughput', value: 4
        },{
            type: 'Disk Read IOPS', value: 5
        },{
            type: 'Disk Write IOPS', value: 6
        },{
            type: 'Disk Read Latency', value: 7
        },{
            type: 'Disk Write Latency', value: 8
        }];
        var left_items = [{
            itemId: 'action_lbl',
            margin: '5 5 5 20',
            xtype: 'label',
            autoEl: 'div',
            html: 'Create Event'
        },{
            /*
            itemId: 'event_name',
            fieldLabel: 'Event Name*',
            required: true,
            placeHolder: 'required'
            */
            itemId: 'eventname_panel',
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
                html: 'Event Name*'
            },{
                xtype: 'label',
                cellCls: 'policy_td',
                itemCls: 'policy_td',
                html: 'event.'
            },{
                labelWidth: 0,
                width: 260,
                itemId: 'event_name',
                vtype: 'EAPname',
                fieldLabel: '',
                required: true,
                placeHolder: 'required'
            }]
        },{
            itemId: 'category',
            xtype: 'combobox',
            fieldLabel: 'Category',
            editable: false,
            store: {
                fields: ['category', 'value'],
                data: [{
                    category: 'Disk Failure Prediction', value: 1
                /*
                },{
                    category: 'Performance Matrix', value: 2
                */
                }]
            },
            value: 1,
            displayField: 'category',
            valueField: 'value',
            queryMode: 'local',
            listeners: {
                afterrender: function (cmp) {
                    console.log('==category afterrender==');
                    cmp.setValue(1);
                    cmp.fireEvent('change', cmp, 1);
                },
                change: function (cmp, newval) {
                    console.log('==category change==');
                    me.down('#type').store.removeAll();
                    me.down('#type').clearValue();
                    if (newval == 1) {
                        me.down('#type').store.loadRawData(dfp_data);
                    }
                    else {
                        me.down('#type').store.loadRawData(pm_data);
                    }
                    me.down('#type').setValue(me.down('#type').store.getAt(0));
                    me.down('#type').setFieldLabel(newval == 1 ? 'Severity*' : 'Metrics*');
                    me.down('#operand').setVisible(newval == 2);
                    me.down('#threshold').setVisible(newval == 2);
                    me.down('#threshold_unit').setVisible(newval == 2);
                }
            }
        },{
            itemId: 'type',
            xtype: 'combobox',
            fieldLabel: 'Severity*',
            editable: false,
            store: {
                fields: ['type', 'value'],
                data: dfp_data
            },
            value: 1,
            displayField: 'type',
            valueField: 'value',
            queryMode: 'local',
            listeners: {
                afterrender: function (cmp) {
                    cmp.setValue(1);
                },
                change: function (cmp, newval) {
                    if (me.down('#category').getValue() == 2) {
                        var val = '%';
                        switch (newval) {
                            case 1:
                            case 2:
                                val = '%';
                                break;
                            case 3:
                            case 4:
                                val = '(byte)';
                                break;
                            case 5:
                            case 6:
                                val = '(IOPS)';
                                break;
                            case 7:
                            case 8:
                                val = 'ms';
                                break;
                            default:
                                val = '%';
                                break
                        } 
                        me.down('#threshold_unit').setHtml(val);
                    }
                }
            }
        },{
            itemId: 'operand',
            xtype: 'combobox',
            fieldLabel: 'Operand*',
            editable: false,
            store: {
                fields: ['type', 'value'],
                data: [{
                    type: '>', value: 1
                },{
                    type: '>=', value: 2
                },{
                    type: '<', value: 3 
                },{
                    type: '<=', value: 4 
                },{
                    type: '==', value: 5 
                },{
                    type: '!=', value: 6 
                }]
            },
            value: 1,
            displayField: 'type',
            valueField: 'value',
            queryMode: 'local',
            listeners: {
                afterrender: function (cmp) {
                    cmp.setValue(1);
                },
                change: function (cmp, newval) {
                }
            }
        },{
            itemId: 'threshold',
            fieldLabel: 'Threshold*',
            required: true,
            value: '',
            placeHolder: 'required'
        },{
            itemId: 'threshold_unit',
            xtype: 'label',
            width: 550,
            html: 'unit',
            style: {
                'margin-left': '555px !important'
            }
        },{
            itemId: 'hosttype',
            xtype: 'combobox',
            fieldLabel: 'Type',
            editable: false,
            store: {
                fields: ['type', 'value'],
                data: [{
                    type: 'Physical', value: 1
                },{
                    type: 'Virtual', value: 2
                }]
            },
            value: 1,
            displayField: 'type',
            valueField: 'value',
            queryMode: 'local',
            listeners: {
                afterrender: function (cmp) {
                },
                change: function (cmp, newval) {
                   if (this.value == 1) {
                        Ext.ComponentQuery.query('#host')[0].setVisible(true);
                        Ext.ComponentQuery.query('#hypervisor')[0].setVisible(false);
                        Ext.ComponentQuery.query('#vm')[0].setVisible(false);
                    }
                    else {
                        Ext.ComponentQuery.query('#host')[0].setVisible(false);
                        Ext.ComponentQuery.query('#hypervisor')[0].setVisible(true);
                        Ext.ComponentQuery.query('#vm')[0].setVisible(true);
                    }
                }
            }
        },{
            itemId: 'host',
            xtype: 'combobox',
            fieldLabel: 'Physical Host',
            editable: false,
            store: Ext.getStore('win_host_store'), 
            value: '',
            displayField: 'display',
            valueField: 'name',
            queryMode: 'local',
            listeners: {
                afterrender: function (cmp) {
                },
                change: function (cmp, newval) {
                }
            }
        },{
            itemId: 'hypervisor',
            xtype: 'combobox',
            fieldLabel: 'Hypervisor Host',
            editable: false,
            store: Ext.create('PDA.store.Windows_Hosts', {
                storeId: 'hypervisor_host_store'
            }),
            value: '',
            displayField: 'display',
            valueField: 'name',
            queryMode: 'local',
            listeners: {
                afterrender: function (cmp) {
                    this.setVisible(false);
                },
                change: function (cmp, newval) {
                	if (this.value != PDA.Global.HYPERVISOR_ALL) {
                        var hypervisor_domainid = this.store.data.items[this.store.find('name', this.value)].data.domainId
                	}
                	else {
                        var hypervisor_domainid = 'ALL'
                	}
                    PDA.view.main.Utils_Api.callApi({
                        method: 'GET',
                        timeout: 120000,
                        title: 'Vm',
                        apiUrl: 'pda_api/' + window.sessionStorage.getItem('host') + '/hosts/' + hypervisor_domainid + '/vms',
                        apiCallback: function (options, success, response) {
                            var j_data = Ext.JSON.decode(response.responseText, true) || null;
                            if (success && j_data && j_data.res && j_data.success) {
                                me.down('#vm').store.removeAll();
                                if (hypervisor_domainid != 'ALL') {
                                    var vm_as_rec = Ext.create('PDA.model.Windows_Hosts', {
                                        name: PDA.Global.VM_ALL,
                                        id: PDA.Global.VM_ALL
                                    });
                                }
                                else {
                                	var vm_as_rec = Ext.create('PDA.model.Windows_Hosts', {
                                        name: PDA.Global.VM_DEFAULT,
                                        id: PDA.Global.VM_DEFAULT
                                    });
                                }
                                me.down('#vm').store.insert(0, [vm_as_rec]);
                                for (var i = 0; i < j_data.res.length; i++) {
                                    me.down('#vm').store.add(j_data.res[i])
                                }
                                if (me.down('#vm').store.findRecord('name', me.down('#vm').value) == null || me.down('#vm').store.findRecord('name', me.down('#vm')) == '') {
                                    me.down('#vm').setValue(me.down('#vm').store.getAt(0));
                                }
                            }
                            
                        }
                    });
                }
            }
        },{
            itemId: 'vm',
            xtype: 'combobox',
            fieldLabel: 'Virtual Host',
            editable: false,
            store: Ext.create('PDA.store.Windows_Hosts', {
                storeId: 'vm_host_store'
            }),
            value: '',
            displayField: 'display',
            valueField: 'name',
            queryMode: 'local',
            listeners: {
                afterrender: function (cmp) {
                	this.setVisible(false);
                },
                change: function (cmp, newval) {
                }
            }
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
                console.log('===event edit activate===');
                me.loadData();
                me.setBtns();
            }
        };
        me.callParent();
    },

    activateGrid: function () {
        var me = this;
        var parentCtl = me.up('event_event') || null;
        if (parentCtl) {
            parentCtl.setActiveItem('event_grid');
        }
    },

    dataValidation: function () {
        var me = this;
        var ret = true;
        var txtflds = me.query('textfield[xtype=textfield][required=true], textfield[xtype=textarea][required=true]') || null;
        if (txtflds) {
            for (var i = 0; i < txtflds.length; i++) {
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
        var parentCtl = me.up('event_event') || null;
        if (parentCtl && parentCtl.actionParam) {
            var action = parentCtl.actionParam.action;
            me.setPage(parentCtl.actionParam);
            if (action == "create") {
                me.down('#action_lbl').update("Create Event");
            }
            else {
                me.down('#action_lbl').update("Edit Event");
            }
        }
        var win_store = me.down('#host').store;
        var hypervisor_store = me.down('#hypervisor').store;
        var vm_store = me.down('#vm').store;
        win_store.on('beforeload', function (store, operation, e) {
            store.getProxy().url = window.location.origin + '/pda_api/' + window.sessionStorage.getItem('host') + '/hosts';
            var params = store.getProxy().extraParams;
            params.user = window.sessionStorage.getItem('user');
            params.password = window.sessionStorage.getItem('password');
        });
        win_store.load({
            callback: function (records, operation, success) {
            	hypervisor_store.loadData(win_store.data.items);
                var hypervisor_as_rec = Ext.create('PDA.model.Windows_Hosts', {
                    name: PDA.Global.HYPERVISOR_ALL,
                    id: PDA.Global.HYPERVISOR_ALL
                });
                hypervisor_store.insert(0, [hypervisor_as_rec]);
                
                vm_store.loadData(win_store.data.items);
                var vm_as_rec = Ext.create('PDA.model.Windows_Hosts', {
                    name: PDA.Global.VM_ALL,
                    id: PDA.Global.VM_ALL
                });
                vm_store.insert(0, [vm_as_rec]);
                
                var as_rec = Ext.create('PDA.model.Windows_Hosts', {
                    name: PDA.Global.HOST_ALL,
                    id: PDA.Global.HOST_ALL
                });
                win_store.insert(0, [as_rec]);
                
                var host_delete_list = [];
                var hypervisor_delete_list = [];
                var vm_delete_list = [];
                for (var i = 1; i < win_store.data.length; i++) {
                	if (win_store.data.items[i].data.hostType == null || (win_store.data.items[i].data.hostType != null && win_store.data.items[i].data.hostType.toUpperCase() != 'WINDOWS')) {
                		host_delete_list.push(win_store.data.items[i].data.id)
                    }
                    if (win_store.data.items[i].data.hostType == null || (win_store.data.items[i].data.hostType != null && win_store.data.items[i].data.hostType.toUpperCase() != 'VMWARE')) {
                    	hypervisor_delete_list.push(win_store.data.items[i].data.id)
                    }
                    if (win_store.data.items[i].data.hostType != null) {
                    	vm_delete_list.push(win_store.data.items[i].data.id)
                    }
                }
                for (var i = 0; i < host_delete_list.length; i++) {                  
                    win_store.removeAt(win_store.find('id', host_delete_list[i]))
                }
                for (var i = 0; i < hypervisor_delete_list.length; i++) {                  
                    hypervisor_store.removeAt(hypervisor_store.find('id', hypervisor_delete_list[i]))
                }
                for (var i = 0; i < vm_delete_list.length; i++) {                  
                    vm_store.removeAt(vm_store.find('id', vm_delete_list[i]))
                }
                if (parentCtl.actionParam.action == "create") {
                    me.down('#host').setValue(me.down('#host').store.getAt(0));
                    me.down('#hypervisor').setValue(me.down('#hypervisor').store.getAt(0));
                    me.down('#vm').setValue(me.down('#vm').store.getAt(0));
                    
                }
                else {
                    var rec = parentCtl.actionParam.record || null;
                    var cat = me.getCategory(rec.get('conditional'), PDA.Global.EVENT_PREDICTED_NEAR_FAILURE);
                    if (cat) {
                    	var host = me.getCategory(rec.get('conditional').substring(rec.get('conditional').indexOf(PDA.Global.EVENT_HOST) - 1), PDA.Global.EVENT_HOST);
                        var hypervisor =  me.getCategory(rec.get('conditional').substring(rec.get('conditional').indexOf(PDA.Global.EVENT_HYPERVISOR) - 1), PDA.Global.EVENT_HYPERVISOR);
                        var vm =  me.getCategory(rec.get('conditional').substring(rec.get('conditional').indexOf(PDA.Global.EVENT_VM) - 1), PDA.Global.EVENT_VM);
                        if (Object.keys(host).length != 0) {
                            host.value = host.value.split(/[ ,()]+/)[0]
                        }
                        if (Object.keys(hypervisor).length != 0) {
                            hypervisor.value = hypervisor.value.split(/[ ,()]+/)[0]
                        }
                        if (Object.keys(vm).length != 0) {
                            vm.value = vm.value.split(/[ ,()]+/)[0]
                        }
                        /*
                        if (Object.keys(host).length == 0) {
                            me.down('#host').setValue(PDA.Global.HOST_ALL);
                        }
                        else {
                            me.down('#host').setValue(host.value.replace(/["']/g, ""));
                        }
                        */
                        if (host.value != null && hypervisor.value == null && vm.value == null) {
                        	var host_value = host.value.replace(/["']/g, "")
                            me.down('#hosttype').setValue(1);
                            me.down('#hypervisor').setValue(PDA.Global.HYPERVISOR_ALL);
                            me.down('#vm').setValue(PDA.Global.VM_ALL);
                            if (win_store.findRecord('name', host_value) == null || win_store.findRecord('name', host_value) == '') {
                                me.down('#host').setValue(me.down('#host').store.getAt(0));
                            }
                            else {
                            	me.down('#host').setValue(host_value);
                            }
                        }
                        else if (host.value == null && hypervisor.value != null) {
                        	var hypervisor_value = hypervisor.value.replace(/["']/g, "")
                            me.down('#hosttype').setValue(2);
                            me.down('#host').setValue(PDA.Global.HOST_ALL);
                            me.down('#vm').setValue(PDA.Global.VM_ALL);
                            if (hypervisor_store.findRecord('name', hypervisor_value) == null || hypervisor_store.findRecord('name', hypervisor_value) == '') {
                                me.down('#hypervisor').setValue(me.down('#hypervisor').store.getAt(0));
                            }
                            else {
                                me.down('#hypervisor').setValue(hypervisor_value);
                            }
                        }
                        else if (host.value == null && hypervisor.value == null && vm.value != null) {
                        	var vm_value = vm.value.replace(/["']/g, "")
                        	me.down('#hosttype').setValue(2);
                            me.down('#host').setValue(PDA.Global.HOST_ALL);
                            me.down('#hypervisor').setValue(PDA.Global.HYPERVISOR_ALL);
                            vm_store.removeAt(vm_store.find('name', PDA.Global.VM_ALL))
                            var default_as_rec = Ext.create('PDA.model.Windows_Hosts', {
                                name: PDA.Global.VM_DEFAULT,
                                id: PDA.Global.VM_DEFAULT
                            });
                            vm_store.insert(0, [default_as_rec]);

                            if (vm_store.findRecord('name', vm_value) == null || vm_store.findRecord('name', vm_value) == '') {
                                me.down('#vm').setValue(me.down('#vm').store.getAt(0));
                            }
                            else {
                                me.down('#vm').setValue(vm_value);
                            }
                        }
                        else {
                        	me.down('#hosttype').setValue(1);
                            me.down('#host').setValue(PDA.Global.HOST_ALL);
                            me.down('#hypervisor').setValue(PDA.Global.HYPERVISOR_ALL);
                            me.down('#vm').setValue(PDA.Global.VM_ALL);
                        }
                    }
                }
            }
        });
    },

    setPage: function (param) {
        var me = this;
        if (param.action == "create") {
            me.down('#event_name').setValue('');
            me.down('#event_name').setDisabled(false);
            me.down('#category').setValue(me.down('#category').store.getAt(0));
            me.down('#type').setValue(me.down('#type').store.getAt(0));
            me.down('#operand').setValue(me.down('#operand').store.getAt(0));
            me.down('#threshold').setValue('');
        }
        else {
            var rec = param.record;
            //need to load record into components
            me.down('#event_name').setValue(rec.get('id').substring(6,));
            me.down('#event_name').setDisabled(true);
            var cat = me.getCategory(rec.get('conditional'), PDA.Global.EVENT_PREDICTED_NEAR_FAILURE);
            if (cat) {
                me.down('#category').setValue(me.down('#category').store.getAt(0));
                me.down('#type').setValue(cat.value.replace(/["']/g, ""));
            }
            else {
                me.down('#category').setValue(me.down('#category').store.getAt(1));
                me.down('#type').setValue(me.down('#type').store.getAt(0));
                me.down('#operand').setValue(me.down('#operand').store.getAt(0));
                me.down('#threshold').setValue('');
            }
        }
    },

    setData: function (test) {
        var me = this;
        var parentCtl = me.up('event_event') || null
        if (me.dataValidation()) {
            var id = me.down('#event_name').getValue();
            var host = me.down('#host').getValue();
            var hypervisor = me.down('#hypervisor').getValue();
            var hypervisor_store = me.down('#hypervisor').store;
            var vm = me.down('#vm').getValue();
            var id = ("event.") + id;
            if (parentCtl.actionParam.action == "edit") {
                id = parentCtl.actionParam.record.get('id'); 
            }
            var category = me.down('#category').getValue()
            var type = me.down('#type').getValue();
            var conditional = ''; 
            if (category == 1) {
                conditional = '{near_failure} == "' + type + '"';
                if (hypervisor != PDA.Global.HYPERVISOR_ALL && vm == PDA.Global.VM_ALL) {
                	var hypervisor_domainid = hypervisor_store.data.items[hypervisor_store.find('name', hypervisor)].data.domainId
                	var vm_conditional = '{hypervisor} == "' + hypervisor + '"';
                    PDA.view.main.Utils_Api.callApi({
                        method: 'GET',
                        timeout: 120000,
                        title: 'Vm',
                        apiUrl: 'pda_api/' + window.sessionStorage.getItem('host') + '/hosts/' + hypervisor_domainid + '/vms',
                        apiCallback: function (options, success, response) {
                            var j_data = Ext.JSON.decode(response.responseText, true) || null;
                            if (success && j_data && j_data.res && j_data.success) {
                            	for (var i = 0; i < j_data.res.length; i++) {
                            		vm_conditional = vm_conditional + ' or {vm_name} == "' + j_data.res[i].name + '"';
                            	}
                            }
                            conditional = conditional + ' and (' + vm_conditional + ')';
                            var severity = "Medium";
                            if (type == "Bad") {
                                severity = "Critical";
                            }
                            else if (type == "Warning") {
                                severity = "High";
                            }
                            var metadata = {
                                "event": {
                                    "display": id,
                                    "conditional": conditional,
                                    "severity": severity
                                }
                            };
                            var method = "PUT";
                            var s_msg = "Update event successfully";
                            var f_msg = "Update event failed";
                            var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/events/' + id;
                            if (parentCtl.actionParam.action == "create") {
                                method = "POST";
                                api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/events/';
                                metadata["id"] = id;
                                var s_msg = "Create event successfully";
                                var f_msg = "Create event failed";
                            }
                            me.getController().onSaveClick({method: method, url: api_url, metadata: metadata, title: 'Event', s_msg: s_msg, f_msg: f_msg, callback_fun: me.activateGrid});
                        }
                    });
                }
                else {
                    if (vm != PDA.Global.VM_DEFAULT && vm != PDA.Global.VM_ALL) {
                        conditional = conditional + ' and {vm_name} == "' + vm + '"';
                    }
                    else if (host != PDA.Global.HOST_ALL) {
                        conditional = conditional + ' and {host} == "' + host + '"';
                    }
                    var severity = "Medium";
                    if (type == "Bad") {
                        severity = "Critical";
                    }
                    else if (type == "Warning") {
                        severity = "High";
                    }
                    var metadata = {
                        "event": {
                            "display": id,
                            "conditional": conditional,
                            "severity": severity
                        }
                    };
                    var method = "PUT";
                    var s_msg = "Update event successfully";
                    var f_msg = "Update event failed";
                    var api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/events/' + id;
                    if (parentCtl.actionParam.action == "create") {
                        method = "POST";
                        api_url = 'pda_api/' + window.sessionStorage.getItem('host') + '/events/';
                        metadata["id"] = id;
                        var s_msg = "Create event successfully";
                        var f_msg = "Create event failed";
                    }
                    me.getController().onSaveClick({method: method, url: api_url, metadata: metadata, title: 'Event', s_msg: s_msg, f_msg: f_msg, callback_fun: me.activateGrid});
                }
            }
        }
    },

    getCategory: function (contional, key) {
        var me = this;
        var con_arr = contional.split('and') || null;
        var ret = {};
        if (con_arr && con_arr.length > 0) {
            for (var i = 0; i < con_arr.length; i++) {
                if (con_arr[i].indexOf(key) > 0) {
                    var con_item_arr = con_arr[i].split('==') || null;
                    if (con_item_arr && con_item_arr.length > 1) {
                        ret["key"] = Ext.String.trim(key);
                        ret["value"] = Ext.String.trim(con_item_arr[1]);
                    }
                }
            }
        }
        return ret;
    }
});

