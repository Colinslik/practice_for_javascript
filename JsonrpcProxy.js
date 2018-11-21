Ext.define('PDA.JsonrpcProxy', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.jsonrpc',
    autoLoad: false,

    reader:{
        type: 'json',
        root: 'result'
    },

    writer: {
        type: 'json',
        encode: true
    },
    /**
     * @public
     * The url for POST request via JSON-Rpc
     */
    url: Ext.String.format('{0}:8345', window.location.origin),

    doRequest:function (operation, callback, scope) {
        var writer = this.getWriter(),
        request = this.buildRequest(operation, callback, scope);

        if(operation.allowWrite()) {
            request = writer.write(request);
        }

        Ext.apply(request, {
            url: this.url,
            timeout: 180000,
            scope: this,
            callback: this.createRequestCallback(request, operation, callback, scope),
            method: this.method,//'POST',
            disableCaching: false,
            username: window.sessionStorage.getItem('user'),
            password: window.sessionStorage.getItem('password'),
            headers: {
                'Content-Type': 'application/json',
            },
            jsonData: {
                id: (Math.random() * 32 | 0) + 1,
                //jsonrpc: Global.JSON_RPC_VERSION,
                method: this.method,
                params: this.extraParams.params
            }
        });

        Ext.Ajax.request(request);
        return request;
    }
});
