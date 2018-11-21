Ext.define('PDA.store.Event_Severity', {
    extend: 'Ext.data.Store',
    alias: 'store.event_severity',
    fields: [
        'display', 'value'
    ],
    data: [{
        display: 'Critical', value: 'Critical'
    },{
        display: 'High', value: 'High'
    },{
        display: 'Medium', value: 'Medium'
    },{
        display: 'Low', value: 'Low'
    }],
});
