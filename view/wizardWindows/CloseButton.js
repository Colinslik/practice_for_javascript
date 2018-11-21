Ext.define('PDA.view.wizardWindows.CloseButton', {
    alias: 'widget.fed_closebtn',
    extend : 'Ext.Component',
    hideMode: 'visibility',
    closeBtnWidth:29,
    closeBtnHeight:29,
    shadow: false,
    autoEl : {
        tag : "a",
        html : "X",
        href : "#",
        /*
        children:[{
            tag: 'img',
            src: 'resources/images/close-button.png'
        }]
        */
    }
});
