Ext.define("apps.user.controller.UserController",{
	extend:"Ext.app.Controller",
	
	init:function(){
		var self = this;
		coreApp = self;
	},
	//界面层,加载组建
	views:['apps.user.view.UserPanel']
	//views: ['UserPanel']
});
