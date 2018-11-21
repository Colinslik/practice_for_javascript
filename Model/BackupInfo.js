Ext.define('PDA.model.BackupInfo', {
    extend: 'Ext.data.Model',
    idProperty: 'n_id',
    fields: [{
        name: 'n_id',
        convert: function(v, record) {
            return Ext.id();
        }
    },{
        name: 'name'
    },{
        name: 'id'
    },{ 
        name: 'no'
    },{ 
        name: 'owner'
    },{
        name: 'server'
    },{
        name: 'status'
    },{
        name: 'execTime'
    },{
        name: 'lastResult'
    },{
        name: 'type'
    },{
        name: 'description'
    }]
});
