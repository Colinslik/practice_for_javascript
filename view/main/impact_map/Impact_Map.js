Ext.define('PDA.view.main.impact_map.Impact_Map', {
    extend: 'Ext.panel.Panel',
    xtype: 'impactmap_impactmap',
    bodyPadding: 10,
    scrollable: true,
    cls: 'reload',
    bodyStyle: {
        'background-color': '#f1f1f1'
    },
    style: {
        'background-color': '#f1f1f1'
    },
    forceSelect: false,
    selectWin: null,
    requires: ['PDA.store.Windows_Hosts', 'PDA.store.BackupInfo', 'PDA.view.main.Utils'],
    initComponent: function () {
        var me = this;
        me.win_store = Ext.getStore('win_host_store');//Ext.create('PDA.store.Windows_Hosts');
        me.bk_store = Ext.create('PDA.store.BackupInfo');
        me.items = [{
            itemId: 'win_grid',
            height: 300,
            xtype: 'grid',
            store: me.win_store,
            border: true,
            cls: 'pda_grid', 
            //bodyCls: 'pda_grid',
            dockedItems: [{
                xtype: 'toolbar',
                height: 50,
                dock: 'top',
                border: true,
                items: [{
                    itemId: 'refresh_btn',
                    action: 'refresh',
                    xtype: 'button',
                    iconCls: 'x-fa fa-refresh',
                    handler: function () {
                        me.win_store.reload();
                    }
                }]
            }],
            columns: [{
                text: 'Host Name', dataIndex: 'name', flex: 1.5, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (Ext.isDefined(record.data.guest_hostname) && record.data.guest_hostname != '') {
                       return record.data.guest_hostname + ' ( ' + value + ' )'
                    }
                    else {
                       return value
                    }
                }
            },{
                text: 'IP Address', dataIndex: 'hostIp', flex: 1, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (Ext.isDefined(record.data.hostIp) && record.data.hostIp != '') {
                       return value
                    }
                    else {
                       return '---'
                    }
                }
            },{
                text: 'O.S.', dataIndex: 'osName', flex: 1, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (Ext.isDefined(record.data.osName) && record.data.osName != '') {
                       return value
                    }
                    else {
                       return '---'
                    }
                }
            },{
                text: 'Windows Version', dataIndex: 'osVersion', flex: 1, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (Ext.isDefined(record.data.osVersion) && record.data.osVersion != '') {
                       return value
                    }
                    else {
                       return '---'
                    }
                }
            },{
                text: 'Critical Disks', dataIndex: 'critical_disks', flex: 1, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (Ext.isDefined(record.data.critical_disks) && record.data.critical_disks != null) {
                       return value
                    }
                    else {
                       return '---'
                    }
                }
            },{
                text: 'Warning Disks', dataIndex: 'warning_disks', flex: 1, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (Ext.isDefined(record.data.warning_disks) && record.data.warning_disks != null) {
                       return value
                    }
                    else {
                       return '---'
                    }
                }
            },{
                text: 'Normal Disks', dataIndex: 'normal_disks', flex: 1, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (Ext.isDefined(record.data.normal_disks) && record.data.normal_disks != null) {
                       return value
                    }
                    else {
                       return '---'
                    }
                }
            },{
                text: 'Insufficient Data Disks', dataIndex: 'insufficient_data_disks', flex: 1, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    if (Ext.isDefined(record.data.insufficient_data_disks) && record.data.insufficient_data_disks != null) {
                       return value
                    }
                    else {
                       return '---'
                    }
                }
            },/*{
                text: 'Capacity', dataIndex: 'capacity', flex: 1, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                    return PDA.view.main.Utils.toSizeString(value);
                }
            },*/
            {
                text: 'CPU', dataIndex: 'cpu', flex: 1, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                	if (Ext.isDefined(record.data.cpu) && record.data.cpu != null) {
                       return value.toFixed(2) + '%';
                    }
                    else {
                       return '---'
                    }
                }
            },{
                text: 'Memory', dataIndex: 'memory', flex: 1, align: 'left', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                	if (Ext.isDefined(record.data.memory) && record.data.memory != null) {
                       return value.toFixed(2) + '%';
                    }
                    else {
                       return '---'
                    }
                }
            }],
            listeners: {
                select: function (cmp, record, index, e) {
                    me.onWinSelect(cmp, record, index);
                }
            }
        },{
            itemId: 'jobs_grid',
            margin: '20 0 0 0',
            height: 150,
            xtype: 'grid',
            store: me.bk_store,
            border: true,
            cls: 'pda_grid', 
            columns: [{
                text: 'Job Name', dataIndex: 'name', flex: 1, align: 'left'
            },{
                text: 'Backup Server', dataIndex: 'server', flex: 1, align: 'left'
            },{
                text: 'Job No.', dataIndex: 'no', flex: 1, align: 'left'
            },{
                text: 'Job ID', dataIndex: 'id', flex: 1, align: 'left'
            },{
                text: 'Status', dataIndex: 'status', flex: 1, align: 'left'
            },{
                text: 'Description', dataIndex: 'description', flex: 1, align: 'left'
            },{
                text: 'Execution Time', dataIndex: 'execTime', flex: 1, align: 'left'
            },{
                text: 'Job Type', dataIndex: 'type', flex: 1, align: 'left'
            },{
                text: 'Owner', dataIndex: 'owner', flex: 1, align: 'left'
            }],
            listeners: {
            }
        },{
            margin: '20 0 0 0',
            height: 500,
            xtype: 'tabpanel',
            cls: 'pda_tab',
            tabConfig: {
                border: 2
            },
            style: {
                'border': '1px solid #d5d5d5 !important'
            },
            tabBar: {
                style: {
                    'border-bottom': '2px solid #ddd !important'
                },
            },
            items: [{
                title: 'Impact',
                xtype: 'panel',
                bodyPadding: 10,
                padding: 10,
                html: '<div class="vmware-map"><div class="panel-setting"><div class="panel-body" style="padding-right:250px"><div class="paper-container joint-paper"></div><div class="right-container right-side-corner" auto-height="140" style="width: 225px"><div class="panel panel-default"><div class="properties-container auto-height" style="height: auto"><div class="toolbar-container joint-tools"></div><div class="selection-container" hidden="true" name="properties" ng-if="osType === \'vmware\'"><div ng-if="currentItem" style="margin-top: 15px"><div class="clearfix"><label class="pull-left" style="font-size:14px;font-weight:bold">Properties</label><div class="pull-right cl-horizontal-divider divider-adjust"></div></div><br><div name="type" class="list-item"><label>Type</label> <span action="type">type</span></div><div name="name" class="list-item"><label>Name</label> <span action="name">Name</span></div><div name="size" class="list-item" ng-if="currentItem.size"><label>Size</label> <span action="size">Size</span></div><div name="model" class="list-item" ng-if="currentItem.model"><label>Model</label> <span action="model">Model</span></div></div></div><div class="panel panel-default"><div class="panel-heading"><div class="clearfix"><label class="pull-left" style="font-size:14px;font-weight:bold">Zoom</label><div class="pull-right cl-horizontal-divider divider-adjust"></div></div></div><br><div class="panel-body no-padding"><div class="navigator-container" style="overflow: hidden;"></div></div></div></div></div></div></div></div>'
            }]
        }];
        me.listeners = {
            afterrender: function (cmp) {
                //me.impact_test();
                me.initializeMap();
                me.loadData();
            },
            activate: function (cmp) {
                //me.impact_test();
                me.loadData();
            }
        };
        me.callParent();
    },
    
    loadData: function () {
        var me = this;
        me.win_store.on('beforeload', function (store, operation, e) {
            store.getProxy().url = window.location.origin + '/pda_api/' + window.sessionStorage.getItem('host') + '/hosts';
            var params = store.getProxy().extraParams;
            params.user = window.sessionStorage.getItem('user');
            params.password = window.sessionStorage.getItem('password');
            //params.url = PDA.Global.FED_PUT_URL + '/pda_api/' + window.sessionStorage.getItem('host') + '/hosts';
        });
        me.win_store.load({
            callback: function (records, operation, success) {
                if (success && records.length > 0) {
                    if (me.forceSelect == true && me.selectWin != null) {
                        var w_rec = me.down('#win_grid').store.findRecord('name', me.selectWin, 0, false, true, true) || null;
                        if (w_rec) {
                            me.down('#win_grid').view.getSelectionModel().select(w_rec);
                            me.down('#win_grid').fireEvent('select', me.down('#win_grid'), w_rec);
                        }
                    }
                    else {
                        me.down('#win_grid').view.getSelectionModel().select(records[0]);
                        me.down('#win_grid').fireEvent('select', me.down('#win_grid'), records[0]);
                    }
                }
                else {
                    me.down('#win_grid').store.removeAll();
                }
                me.forceSelect = false;
                me.selectWin = null;
            }
        });
    },

    onWinSelect: function (cmp, record, index) {
        var me = this;
        var win_name = record.get('name') || null;
        var guest_hostname = record.get('guest_hostname') || null;
        var domainId = record.get('domainId') || null;
        var vm_bk_store = Ext.create('PDA.store.BackupInfo');
        if (win_name) {
            me.bk_store.on('beforeload', function (store, operation, e) {
                var params = store.getProxy().extraParams;
                params.Urls = PDA.Global.FED_PUT_URL + 'pda_api/' + window.sessionStorage.getItem('host') + '/backups/' + win_name;
                params.user = window.sessionStorage.getItem('user');
                params.password = window.sessionStorage.getItem('password');
            });
            me.bk_store.load({
                callback: function (records, operation, success) {
                    if (success && records.length > 0) {
                    	if (guest_hostname) {
                            vm_bk_store.on('beforeload', function (store, operation, e) {
                                var params = store.getProxy().extraParams;
                                params.Urls = PDA.Global.FED_PUT_URL + 'pda_api/' + window.sessionStorage.getItem('host') + '/backups/' + guest_hostname;
                                params.user = window.sessionStorage.getItem('user');
                                params.password = window.sessionStorage.getItem('password');
                            });
                            vm_bk_store.load({
                                callback: function (records, operation, success) {
                                    if (success && records.length > 0) {
                                         me.bk_store.add(vm_bk_store.data.items)
                                    }
                                    else {
                                        vm_bk_store.removeAll();
                                    }
                                }
                            });
                        }
                    }
                    else {
                        me.bk_store.removeAll();
                    }
                }
            });
            PDA.view.main.Utils_Api.callApi({
                method: 'GET',
                timeout: 120000,
                title: 'Disk Prophet',
                apiUrl: 'pda_api/' + window.sessionStorage.getItem('host') + '/hosts/' + domainId + '/corelation',
                apiCallback: function (options, success, response) {
                    var j_data = Ext.JSON.decode(response.responseText, true) || null;
                    if (success && j_data && j_data.success && j_data.res) {
                    	try {
                            hostType = record.get('hostType');
                            me.impact_test({data: j_data.res, ostype: record.get('osType'), hostType: hostType});
                        }
                        catch (ex) {
                            me.impact_test({data: j_data.res, ostype: record.get('osType')});
                        }
                    }
                    else {
                        me.impact_test(null);
                    }
                }
            });
        }
    },

    addWindowsElement: function (data) {
        var me = this;
        var impact = new WindowsImpact(this._map, this._builder.shapes);
        impact.addElements(data);
    },

    addESXiElement: function (data) {
        var me = this;
        var impact = new VMwareImpact(this._map, this._builder.shapes);
        impact.addElements(data);
    },
    
    addVMwareElement: function (data) {
        var me = this;
        var impact = new VMwareImpact(this._map, this._builder.shapes);
        impact.addVirtualMachine(data);
    },

    initializeMap: function () {
        var me = this;
        if (this._builder) {
            delete this._builder;
        }
        this._builder = new MapBuilder();
        if (this._map) {
            delete this._map;
        }
        this._map = this._builder.createMap();
        me.initializePaper();
    },

    initializePaper: function () {
        this._map.initializePaper('.paper-container', function (item) {
            if (!item || !item.attributes || !item.attributes.type) {
                if (Ext.query('div[name=properties]') && Ext.query('div[name=properties]').length > 0) {
                    Ext.query('div[name=properties]')[0].hidden = true;
                }
            }
            else {
                if (Ext.query('div[name=properties]') && Ext.query('div[name=properties]').length > 0) {
                    Ext.query('div[name=properties]')[0].hidden = false;
                }
                if (item.attributes.type) {
                    if (Ext.query('div[name=type]') && Ext.query('div[name=type]').length > 0) {
                        Ext.query('div[name=type]')[0].hidden = false;
                        if (Ext.query('span[action=type]') && Ext.query('span[action=type]').length > 0) {
                            Ext.query('span[action=type]')[0].innerHTML = item.attributes.type.split('.').pop(); 
                        }
                    }
                }
                else {
                    if (Ext.query('div[name=type]') && Ext.query('div[name=type]').length > 0) {
                        Ext.query('div[name=type]')[0].hidden = true;
                    }
                }
                if (item.attributes.name) {
                    if (Ext.query('div[name=name]') && Ext.query('div[name=name]').length > 0) {
                        Ext.query('div[name=name]')[0].hidden = false;
                        if (Ext.query('span[action=name]') && Ext.query('span[action=name]').length > 0) {
                            Ext.query('span[action=name]')[0].innerHTML = item.attributes.name;
                        }
                    }
                }
                else {
                    if (Ext.query('div[name=name]') && Ext.query('div[name=name]').length > 0) {
                        Ext.query('div[name=name]')[0].hidden = true;
                    }
                }
                if (item.attributes.dsize) {
                    if (Ext.query('div[name=size]') && Ext.query('div[name=size]').length > 0) {
                        Ext.query('div[name=size]')[0].hidden = false;
                        if (Ext.query('span[action=size]') && Ext.query('span[action=size]').length > 0) {
                            Ext.query('span[action=size]')[0].innerHTML = item.attributes.dsize;
                        }
                    }
                }
                else {
                    if (Ext.query('div[name=size]') && Ext.query('div[name=size]').length > 0) {
                        Ext.query('div[name=size]')[0].hidden = true;
                    }
                }
                if (item.attributes.model) {
                    if (Ext.query('div[name=model]') && Ext.query('div[name=model]').length > 0) {
                        Ext.query('div[name=model]')[0].hidden = false;
                        if (Ext.query('span[action=model]') && Ext.query('span[action=model]').length > 0) {
                            Ext.query('span[action=model]')[0].innerHTML = item.attributes.model;
                        }
                    }
                }
                else {
                    if (Ext.query('div[name=model]') && Ext.query('div[name=model]').length > 0) {
                        Ext.query('div[name=model]')[0].hidden = true;
                    }
                }
            }
        });
        this._map.initializeToolbar('.toolbar-container');
        this._map.initializeNavigator('.navigator-container');
    },

    impact_test: function (param) {
        var me = this;
        var data = param.data;

        /*data = {"host":{"id":8,"domainId":"481068a045a7d46f4c0e0439e3ef63e6","name":"WIN-6J4L56AGV6J","time":1528883173962256200,"diskDegradation":0.0,"disks":[{"id":9,"domainId":"5000039ff1c7bb86","name":"/dev/sdb","time":1528883173961254700,"model":"TOSHIBA DT01ACA050","size":"500 GB","nearFailure":"Warning","volumes":[{"id":4,"domainId":"\\\\.\\PHYSICALDRIVE1_481068a045a7d46f4c0e0439e3ef63e6","name":"disk 1","time":1528883173964258500,"logicalVolumes":[{"id":3,"domainId":"\\\\?\\Volume{470e92db-6a2e-11e8-80b1-806e6f6e6963}\\_481068a045a7d46f4c0e0439e3ef63e6","name":"C:","time":1528883173964258500}]}]},{"id":11,"domainId":"5000c50066ed5305","name":"/dev/sda","time":1528883173959252300,"model":"ST2000DM001-1CH164","size":"2.00 TB","nearFailure":"Good","volumes":[{"id":10,"domainId":"\\\\.\\PHYSICALDRIVE0_481068a045a7d46f4c0e0439e3ef63e6","name":"disk 0","time":1528883173959252300}]},{"id":7,"domainId":"5000039ff1c77ba7","name":"/dev/sdc","time":1528883173963257300,"model":"TOSHIBA DT01ACA050","size":"500 GB","nearFailure":"Good","volumes":[{"id":6,"domainId":"\\\\.\\PHYSICALDRIVE2_481068a045a7d46f4c0e0439e3ef63e6","name":"disk 2","time":1528883173965259700,"logicalVolumes":[{"id":5,"domainId":"\\\\?\\Volume{6e88e333-6a2e-11e8-80b2-6805ca1a3fc6}\\_481068a045a7d46f4c0e0439e3ef63e6","name":"D:","time":1528883173965259700}]}]}]}};{
            "host": {
                "id": 40,
                "domainId": "607e967a80c7bfdf71cc96396f9d40b1",
                "name": "WIN-5P3HBFNP7B6",
                "time": 1528681643022719000,
                "diskDegradation": 0.0,
                "disks": [{
                    "id": 62,
                    "domainId": "524693e2016c0305",
                    "name": "/dev/sdx",
                    "time": 1528681643024718500, 
                    "model": "SATADOM-SL 3IE3 V2",
                    "size": "64.0 GB",
                    "nearFailure": "Good",
                    "volumes": [{
                        "id":61,
                        "domainId": "\\\\.\\PHYSICALDRIVE24_607e967a80c7bfdf71cc96396f9d40b1",
                        "name": "disk 24",
                        "time": 1528681643025719200,
                        "logicalVolumes": [{
                            "id":60,
                            "domainId": "\\\\?\\Volume{00023837-0000-0000-0000-100000000000}\\_607e967a80c7bfdf71cc96396f9d40b1",
                            "name":"C:","time":1528681643025719200
                        }]
                    }]
                }]
            }
        };*/
        /*
        this._builder = new MapBuilder();
        this._map = this._builder.createMap();
        this._map.initializePaper('.paper-container', function (item) {
            if (!item || !item.attributes || !item.attributes.type) {
                if (Ext.query('div[name=properties]') && Ext.query('div[name=properties]').length > 0) {
                    Ext.query('div[name=properties]')[0].hidden = true;
                }
            }
            else {
                if (Ext.query('div[name=properties]') && Ext.query('div[name=properties]').length > 0) {
                    Ext.query('div[name=properties]')[0].hidden = false;
                }
                if (item.attributes.type) {
                    if (Ext.query('div[name=type]') && Ext.query('div[name=type]').length > 0) {
                        Ext.query('div[name=type]')[0].hidden = false;
                        if (Ext.query('span[action=type]') && Ext.query('span[action=type]').length > 0) {
                            Ext.query('span[action=type]')[0].innerHTML = item.attributes.type.split('.').pop(); 
                        }
                    }
                }
                else {
                    if (Ext.query('div[name=type]') && Ext.query('div[name=type]').length > 0) {
                        Ext.query('div[name=type]')[0].hidden = true;
                    }
                }
                if (item.attributes.name) {
                    if (Ext.query('div[name=name]') && Ext.query('div[name=name]').length > 0) {
                        Ext.query('div[name=name]')[0].hidden = false;
                        if (Ext.query('span[action=name]') && Ext.query('span[action=name]').length > 0) {
                            Ext.query('span[action=name]')[0].innerHTML = item.attributes.name;
                        }
                    }
                }
                else {
                    if (Ext.query('div[name=name]') && Ext.query('div[name=name]').length > 0) {
                        Ext.query('div[name=name]')[0].hidden = true;
                    }
                }
                if (item.attributes.dsize) {
                    if (Ext.query('div[name=size]') && Ext.query('div[name=size]').length > 0) {
                        Ext.query('div[name=size]')[0].hidden = false;
                        if (Ext.query('span[action=size]') && Ext.query('span[action=size]').length > 0) {
                            Ext.query('span[action=size]')[0].innerHTML = item.attributes.dsize;
                        }
                    }
                }
                else {
                    if (Ext.query('div[name=size]') && Ext.query('div[name=size]').length > 0) {
                        Ext.query('div[name=size]')[0].hidden = true;
                    }
                }
                if (item.attributes.model) {
                    if (Ext.query('div[name=model]') && Ext.query('div[name=model]').length > 0) {
                        Ext.query('div[name=model]')[0].hidden = false;
                        if (Ext.query('span[action=model]') && Ext.query('span[action=model]').length > 0) {
                            Ext.query('span[action=model]')[0].innerHTML = item.attributes.model;
                        }
                    }
                }
                else {
                    if (Ext.query('div[name=model]') && Ext.query('div[name=model]').length > 0) {
                        Ext.query('div[name=model]')[0].hidden = true;
                    }
                }
            }
        });
        this._map.initializeToolbar('.toolbar-container');
        this._map.initializeNavigator('.navigator-container');
        */

        var osType = param.ostype;
        switch (osType) {
            case 'vmware':
                if (Ext.isDefined(param.hostType)) {
                    me.addESXiElement(data);
                }
                else {
                    me.addVMwareElement(data);
                }
                break;
            case 'windows':
            default:
                me.addWindowsElement(data);
                break;
        }
        //me.addWindowsElement(data);
    }
});
