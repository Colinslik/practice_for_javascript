Ext.define('PDA.model.Policy', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id'
    },{
        name: 'enabled'
    },{
        name: 'type'
    },{
        name: 'event'
    },{
        name: 'actions'
    },{
        name: 'actions.start'
    },{
        name: 'actions.end'
    },{
        name: 'log.level'
    },{
        name: 'suppression'
    },{
        name: 'pdahome'
    }]
});
