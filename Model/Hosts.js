Ext.define('PDA.model.Hosts', {
    extend: 'Ext.data.Model',
    alias: 'model.hosts',
    fields: [
        //'name', 'ip', 'os', 'version', 'critical_disks', 'warning_disks', 'normal_disks', 'insufficient_data_disks', 'capacity', 'cpu', 'memory'
        'id', 'application', 'lastUpdated', 'status'
    ]
});
