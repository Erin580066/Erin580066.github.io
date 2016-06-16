(function(){
	var tools = {
		$:function(selector,context){/////获取元素封装
			context = context||document;//这里是做一个兼容，默认是document
			if(selector.indexOf(' ')!= -1){//判断有没有空格
				return context.querySelectorAll(seletor)
			}else if(selector.charAt(0)==='#'){//判断是否是id
				return document.getElementById(selector.slice(1));
			}else if(selector.charAt(0)==='.'){//判断是否是class
				return context.getElementsByClassName(selector.slice(1));
			}else{
				return context.getElementsByTagName(selector);//判断是否是一组
			}
		},
		addEvent:function(ele,eventName,eventFn){//添加事件封装
			ele.addEventListener(eventName,eventFn,false);
		},
		removeEvent:function(ele,eventName,eventFn){//删除事件封装
			ele.removeEventListener(eventName,eventFn,false);
		},
		containClass:function(ele,classNames){
			var classNameArr = ele.className.split(" ");
			for( var i = 0; i < classNameArr.length; i++ ){
				if( classNameArr[i] === classNames ){
					return true;
				}
			}
			return false;
		},
		parents:function(obj,selector){
			/*
			 * selector
			 * id
			 * class
			 * 标签
			 * */
			if( selector.charAt(0) === "#" ){
				while(obj.id !== selector.slice(1)){
					obj = obj.parentNode;
				}
			}else if( selector.charAt(0) === "." ){
				while(!tools.containClass(obj,selector.slice(1))){
					obj = obj.parentNode;
				}
			}else{
				while(obj && obj.nodeName !== selector){
					obj = obj.parentNode;
				}
			}
			
			return obj;
		},
		each:function(obj,callBack){//递归的封装
			for (var i = 0; i < obj.length; i++) {
				callBack(obj[i],i)
			}
		},
		getEleRect:function(obj){
			return obj.getBoundingClientRect();
		},
		collisionRect:function(obj1,obj2){//碰撞检测
			var obj1Rect = tools.getEleRect(obj1);
			var obj2Rect = tools.getEleRect(obj2);
			
			var obj1W = obj1Rect.width;
			var obj1H = obj1Rect.height;
			var obj1L = obj1Rect.left;
			var obj1T = obj1Rect.top;

			var obj2W = obj2Rect.width;
			var obj2H = obj2Rect.height;
			var obj2L = obj2Rect.left;
			var obj2T = obj2Rect.top;
			//碰上返回true 否则返回false
			if( obj1W+obj1L>obj2L && obj1T+obj1H > obj2T && obj1L < obj2L+obj2W && obj1T<obj2T+obj2H ){
				return true
			}else{
				false;
			}
		},
		store:function (namespace, data){//本地存储
			if (data) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			}
			var store = localStorage.getItem(namespace);
			return (store && JSON.parse(store)) || [];
		}
	}
	window.tools = tools;
})()
