Ext.define('PDA.model.Action', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id'
    },{
        name: 'log.level'
    },{
        name: 'command',
        convert: function (v, record) {
            var ret = null;
            if (record.data && record.data.command != undefined) {
                ret = record.data.command;
            }
            return ret;
        }
    },{
        name: 'bcc'
    },{
        name: 'body'
    },{
        name: 'cc'
    },{
        name: 'from'
    },{
        name: 'subject'
    },{
        name: 'to'
    },{
        name: 'pdahome'
    }]
});
