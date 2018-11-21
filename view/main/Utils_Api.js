Ext.define('PDA.view.main.Utils_Api', {
    singleton: true,
    reqUrl: 'rest/couchdbproxy/index.php',
    pollUrl: 'rest/couchdbproxy/index.php',
    reqParams: {},
    pollParams: {},
    asyncTaskMgr: null,
    constructor: function(config) {
        var me = this;
        if (me.asyncTaskMgr == null) {
            me.asyncTaskMgr = new Ext.util.HashMap();
        }
    },
    asyncTask: null,
    title: null,
    apiUrl: null,
    showWin: true,
    showSuccessWin: true,//only apply while showWin is true
    showFailWin: true,//only apply while showWin is true
    method:'get',
    reqBody: {},
    timeout: 120000,
    successMsg: 'Opertaion is successful.',
    errorMsg: 'Operation is failed.',
    ignoreFloatLogLoading: false,
    apiCallback: null,
    scope: null,
    callApi: function(options) {
        var  me = this, method = options.method || 'get', reqBody = options.reqBody, apiCallback = options.apiCallback,  apiUrl = options.apiUrl, scope1 = options.scope, asyncTask = me.asyncTask = options.asyncTask, title = options.title || me.title, timeout = options.timeout || me.timeout, index = 0 || options.index, errorMsg = options.errorMsg || me.errorMsg, successMsg = options.successMsg || me.successMsg, showWin = me.showWin, failMsg = options.failMsg, showSuccessWin = me.showSuccessWin, showFailWin = me.showFailWin, reqUrl = options.reqUrl || me.reqUrl, reqParams = options.reqParams || me.reqParams, ignoreFloatLogLoading = options.ignoreFloatLogLoading || me.ignoreFloatLogLoading, ReplParams = options.ReplParams || null;
        if (options.showWin === false) {
            showWin = options.showWin;
        }
        if (options.showSuccessWin === false) {
            showSuccessWin = options.showSuccessWin;
        }
        if (options.showFailWin === false) {
            showFailWin = options.showFailWin;
        }
        var params = Ext.apply({
            Urls: PDA.Global.FED_PUT_URL + apiUrl,
            logintime:window.sessionStorage.getItem('logintime'),
            user: window.sessionStorage.getItem('user'),
            password: window.sessionStorage.getItem('password'),
            index: index
        }, reqParams);

        Ext.Ajax.request({
            url: reqUrl,
            unauthLogout: options.unauthLogout === false? false: true,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: timeout,
            jsonData: {
                Urls: PDA.Global.FED_PUT_URL + apiUrl ,
                JsonData: Ext.JSON.encode(reqBody),
                user: window.sessionStorage.getItem('user'),
                password: window.sessionStorage.getItem('password'),
                logintime:window.sessionStorage.getItem('logintime'),
                ReplParams: ReplParams,
                index:index
            },
            params: params/* {
                Urls: PDA.Global.FED_PUT_URL + apiUrl,
                logintime:window.sessionStorage.getItem('logintime')
            }*/,
            callback: function(options_1, success, response){
                Ext.callback(apiCallback, scope1, [options_1, success, response]);

                var jsondata = Ext.JSON.decode(response.responseText, true);
                if (jsondata && success && jsondata.success){
                    /*
                    if (showWin && showSuccessWin){
                        var removeWin = Ext.create('Federator.view.wizardWindows.BaseInfoWindows', {
                            headerText: title,
                            bodyText: successMsg
                        });
                        removeWin.mon(removeWin, {
                            beforedestroy: function(){
                            },
                            destroy: function(){
                                Ext.defer(function(){
                                    Federator.utils.Utils.refreshGrid();
                                }, 500);
                            }
                        })
                        removeWin.show();
                    }

                    if (asyncTask != null) {
                        if (asyncTask.asyncTaskId == null || !me.asyncTaskMgr.containsKey(asyncTask.asyncTaskId)) {
                            if (asyncTask.apiUrl != null || (jsondata.header && Federator.utils.Utils.getHeaderLocation(jsondata.header) != '')) {
                                me.pollingStatus(asyncTask, jsondata, options_1, success, response);
                            }
                            else if (jsondata.res && jsondata.res.length > 0 && Federator.utils.Utils.getHeaderLocation(jsondata.res[0].header) != '') {
                                me.pollingStatus(asyncTask, jsondata, options_1, success, response);
                            }
                        }
                    }
                    */
                }
                else {
                    //!ignoreFloatLogLoading && Federator.utils.PageDisplay.loadFloatLogOnApiComplete(false);
                    if (showWin && showFailWin) {
                        if (failMsg) {
                            //me.showWindow(title, failMsg);
                        }
                        else {
                            me.popupWindow(title, success, jsondata);
                        }
                    }
                }
            }
        });
    },
    pollingStatus: function (asyncTask, resJsonData, p_options, p_success, p_response) {
        //must check it at first
        if (asyncTask.apiUrl == null) {
            asyncTask['apiUrl'] = Federator.utils.Utils.getHeaderLocation(resJsonData.header).split(PDA.Global.FED_PUT_URL)[1];
        }
        var me = this, method = asyncTask.method, apiUrl = Ext.String.trim(asyncTask.apiUrl), pollingCallback = asyncTask.pollingCallback, pollingCompleteCallback = asyncTask.pollingCompleteCallback, scope1 = asyncTask.scope, title = asyncTask.title || me.title, reqBody = asyncTask.reqBody, timeout = asyncTask.timeout || 120000, errorMsg = asyncTask.errorMsg || me.errorMsg, successMsg = asyncTask.successMsg || me.successMsg, showWin = me.showWin, failMsg = asyncTask.failMsg, showSuccessWin = me.showSuccessWin, showFailWin = me.showFailWin, pollUrl = asyncTask.pollUrl || me.pollUrl, pollParams = asyncTask.pollParams || me.pollParams, pollingInterval = asyncTask.pollingInterval || 3000, keepPollingAtFail = asyncTask.keepPollingAtFail || false;

        var params = Ext.apply({
            Urls: PDA.Global.FED_PUT_URL + apiUrl,
            logintime:window.sessionStorage.getItem('logintime')
        }, pollParams);


        if (asyncTask.showWin === false) {
            showWin = asyncTask.showWin;
        }
        if (asyncTask.showSuccessWin === false) {
            showSuccessWin = asyncTask.showSuccessWin;
        }
        if (asyncTask.showFailWin === false) {
            showFailWin = asyncTask.showFailWin;
        }

        Ext.Ajax.request({
            url: pollUrl || 'rest/couchdbproxy/',
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: timeout,
            params: params/* {
                Urls: Glboal.FED_PUT_URL + apiUrl,
                logintime: window.sessionStorage.getItem('logintime')
            }*/,
            jsonData: {
                Urls: PDA.Global.FED_PUT_URL + apiUrl,
                JsonData: Ext.JSON.encode(Ext.isFunction(reqBody)? reqBody(p_options, p_success, p_response): reqBody),
                logintime: window.sessionStorage.getItem('logintime')
            },
            callback: function(options_1, success, response) {
                if (pollingCallback) {
                    Ext.callback(pollingCallback, scope1, [options_1, success, response]);
                }

                var jsondata = Ext.JSON.decode(response.responseText, true);
                if (jsondata && success && jsondata.success) {
                    if (!Federator.utils.Utils.compareStr(jsondata.res.completionStatus, 'processing', true, false)) {
                        if (pollingCompleteCallback) {
                            Ext.callback(pollingCompleteCallback, scope1, [options_1, success, response]);
                        }
                        Ext.defer(function() {
                            Federator.utils.Utils.refreshGrid();
                        }, 500);
                        if(showWin && showSuccessWin){
                            if (Federator.utils.Utils.compareStr(jsondata.res.completionStatus, 'completed', true, false)) {
                            }
                            else {
                            }
                        }
                        Federator.utils.PageDisplay.loadFloatLogOnApiComplete(true);
                    }
                    else {
                        Ext.defer(function () {
                            me.pollingStatus(asyncTask, resJsonData, p_options, p_success, p_response);
                        }, pollingInterval);
                    }
                }
                else {
                    if (keepPollingAtFail) {
                        Ext.defer(function () {
                            me.pollingStatus(asyncTask, resJsonData, p_options, p_success, p_response);
                        }, pollingInterval);
                    }
                    else {
                        if (showWin && showFailWin) {
                            if (failMsg) {
                                //Federator.utils.Utils.msgbox(title, failMsg);
                            }
                            else {
                                //me.ghostWindow(title, success, jsondata);
                            }
                        }
                    }
                    //popup error window here
                }
            }
        });
    },
    popupWindow: function(title, success, jsondata){
        var me = this;
        var msg = '';
        if(!success){
            msg =  '';//MSG.ID_1929 + ': ' + MSG.ID_1160;
        }else if(jsondata && !jsondata.success){
            msg = jsondata.msg;
        }
        //me.showWindow(title, msg);

    }
});
