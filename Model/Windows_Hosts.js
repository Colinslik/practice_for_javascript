Ext.define('PDA.model.Windows_Hosts', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'name'
    },{
        name: 'id'
    },{ 
        name: 'hostIp'
    },{ 
        name: 'osName'
    },{
        name: 'osVersion'
    },{
        name: 'osType'
    },{
        name: 'display',
        convert: function (v, record) {
            var ret = 0;
            try {
            	if (Ext.isDefined(record.data.guest_hostname) && record.data.guest_hostname != '') {
                   ret = record.data.guest_hostname + ' ( ' + record.data.name + ' )'
                }
                else {
                   ret = record.data.name
                }
            }
            catch (ex) {
                return
            }
            return ret;
        }
    },{
        name: 'critical_disks', 
        convert: function (v, record) {
            var ret = 0;
            try {
                ret = record.data.diskStats.criticalDiskCount;
            }
            catch (ex) {
            	return
            }
            return ret;
        }
    },{
        name: 'warning_disks',
        convert: function (v, record) {
            var ret = 0;
            try {
                ret = record.data.diskStats.warningDiskCount;
            }
            catch (ex) {
            	return
            }
            return ret;
        }
    },{
        name: 'normal_disks',
        convert: function (v, record) {
            var ret = 0;
            try {
                ret = record.data.diskStats.normalDiskCount;
            }
            catch (ex) {
            	return
            }
            return ret;
        }
    },{
        name: 'insufficient_data_disks',
        convert: function (v, record) {
            var ret = 0;
            try {
                ret = record.data.diskStats.unknownDiskCount;
            }
            catch (ex) {
            	return
            }
            return ret;
        }
    },{
        name: 'capacity',
        convert: function (v, record) {
            var ret = 0;
            try {
                ret = record.data.metrics.totalCapacity;
            }
            catch (ex) {
            	return -1;
            }
            if (Ext.isDefined(ret)) {
                return ret;
            }
            else {
            	return -1;
            }
        }
    },{
        name: 'cpu',
        convert: function (v, record) {
            var ret = 0;
            try {
                ret = record.data.metrics.cpu;
            }
            catch (ex) {
            	return
            }
            return ret;
        }
    },{
        name: 'memory',
        convert: function (v, record) {
            var ret = 0;
            try {
                ret = record.data.metrics.memory;
            }
            catch (ex) {
            	return
            }
            return ret;
        }
    }]
});
