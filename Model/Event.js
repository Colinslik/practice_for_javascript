Ext.define('PDA.model.Event', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id'
    },{
        name: 'display'
    },{
        name: 'conditional'
    },{
        name: 'log.level'
    },{
        name: 'pdahome'
    }]
});
