/**
 *  程序的外部组建引用
 */
 //启用下面两个，就可以启用提示
 //启用提示
Ext.QuickTips.init();
 //初始化提示工具框
Ext.tip.QuickTipManager.init();

//启用动态加载机制
Ext.Loader.setConfig({
	enabled:true,
	//调用类加载
	paths:{
		apps: 'web/apps'
	}
});

Ext.onReady(function(){
	Ext.application({
		name: 'core',
		appFoler: 'web/apps',
		launch: function(){
		},
		controllers: ['apps.user.controller.UserController']
	});
});


//Ext.require(['apps.user.app']);

//同步加载
Ext.syncRequire([
	//"baseUx.form.datetime.DateTimePicker",
    //"baseUx.form.datetime.DateTime"
]);



