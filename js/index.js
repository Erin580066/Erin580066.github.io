 (function(){
	var datas = tools.store("miaov")
	
	if(datas&&!datas.files){
		datas = data;
		tools.store("miaov",datas);
	}
	
	var filesSet = tools.$('.filesSet')[0];
	var filebox = tools.$('.filebox')[0];
	var allLi = tools.$("li",filesSet);//filesSet下面的li
	var hiddenInput = tools.$(".hiddenInput")[0];//隐藏的input
	var loadNum = tools.$('.loadNum')[0];
	var span1 =tools.$('span',loadNum)[0]
	var files_nav = tools.$(".files_nav")[0];//导航菜单
	var info = tools.$('.otherinfo')[0];
	var selectNum = tools.$('.selectNum')[0];
	var span =tools.$('span',selectNum)[0];//统计选中的span
	var createFolder = tools.$('.createfile')[0];//创建文件夹按钮
	
	var names = null;
	getPidChild(0);
	span1.innerHTML = allLi.length
	function getPidChild(pid){
		for (var i = 0; i < datas.files.length; i++) {
			if(datas.files[i].pid == pid){
				var li = createLi({
					name:datas.files[i].name,
					id:datas.files[i].id,
					pid:datas.files[i].pid
				})
				filesSet.appendChild(li);
				handleLi(li);
			}
		}
	}
	function getIdItem(id){
		for( var i = 0; i < datas.files.length; i++ ){
			if( datas.files[i].id == id ){
				return datas.files[i];
			}
		}
	}
	
	//新建文件夹
	tools.addEvent(createFolder,'click',function(){
		if( this.isCreateStatus ){
			names.select();
			return;
		};
		seletedNum = 0;	
		span.innerHTML = '0';
		allSelected.checked = false;
		var random = new Date().getTime();//根据时间戳来创建文件夹
		var newLi = createLi(
			{
				id:random
			}
		);
		filesSet.appendChild(newLi);
		names = tools.$(".names",newLi)[0];//修改名字的输入框
		var strong = tools.$("strong",newLi)[0];
		var edtor = tools.$(".edtor",newLi)[0];
		strong.style.display = "none";
		edtor.style.display = "block";//新建的时候让输入框显示
		names.select();//正在创建的状态
		this.isCreateStatus = true;
		handleLi(newLi);
		tools.each(allLi,function(item){//取消掉所有li中的样式
			cancelStyle(item);
		})
	})
	var navArr = [{filename:'返回上一级'},{filename:'全部文件',currentId:0}];
	//处理li的事件
	function handleLi(li){
		var icon = tools.$(".icon",li)[0];
		var checkInput = tools.$(".checkInput",li)[0];
		var ok = tools.$(".ok",li)[0];
		var cancel = tools.$(".cancel",li)[0];
		var strong = tools.$("strong",li)[0];
		var edtor = tools.$(".edtor",li)[0];
		var names = tools.$(".names",li)[0];
		// √键的绑定事件
		tools.addEvent(ok,"click",function(ev){
			strong.innerHTML = isRename(hiddenInput.value,names.value);
			strong.style.display = "block";
			edtor.style.display = "none";
			span1.innerHTML = allLi.length
			createFolder.isCreateStatus = false;
			if(rename.isRename){
				var currentItem = getIdItem(li.id);
				currentItem.name = names.value;
				rename.isRename = false;
			}else{
				datas.files.push({
					id:li.id,
					pid:hiddenInput.value,
					name:strong.innerHTML
				})
				tools.store("miaov",datas);
			}
			ev.stopPropagation();
		});
		// X键的绑定事件
		tools.addEvent(cancel,"click",function (ev){
			if(!rename.isRename){
				filesSet.removeChild(li);
				createFolder.isCreateStatus = false;
			}else{
				strong.style.display = "block";
				edtor.style.display = "none";
				rename.isRename = false;
			}
			ev.stopPropagation();
		});
		// 鼠标移进去的绑定事件
		tools.addEvent(li,"mouseenter",function (){
			if( !createFolder.isCreateStatus && !rename.isRename ){
				icon.style.borderColor = "#2e80dc";	
				checkInput.style.display = "block";	
			}
		})
		// 鼠标离开的绑定事件
		tools.addEvent(li,"mouseleave",function (){
			if( !checkInput.checked ){
				icon.style.borderColor = "#fff";	
				checkInput.style.display = "none";	
			}
		});
		tools.addEvent(li,'click',function(){
			filesSet.innerHTML = "";
			getPidChild(this.id);
			hiddenInput.value = this.id;
			navArr.push({
				filename:strong.innerHTML,
				currentId:this.id
			});
			seletedNum=0;//点进去的时候清空
			span.innerHTML = '0';
			renderNav(navArr);
		});
		tools.addEvent(names,"click",function (ev){
			ev.stopPropagation();	
		});
		//每一个input
		var checkInput1 = tools.$(".checkInput",filesSet);
		tools.addEvent(checkInput,'click',function(ev){
			if( this.checked ){
				seletedNum++;
				//选中的状态
				allSelected.checked = true;
				//只要有一个没选中，就不选中
				tools.each(checkInput1,function (input){
					if( !input.checked ){
						allSelected.checked = false;
					}	
				});
				info.style.display = "block";

			}else{
				seletedNum--;
				allSelected.checked = false;
				if(seletedNum == 0){
					info.style.display = "none";
					span.innerHTML = '0';
				}
			};
//			console.log(seletedNum)
			span.innerHTML = seletedNum;
			ev.stopPropagation();
		})
	}
	///导航的处理事件
	tools.addEvent(files_nav,"click",function (ev){
		var target = ev.target;
		if(target.nodeName === 'A'){
			var currentId = target.getAttribute("currentId");
			filesSet.innerHTML = "";
			getPidChild(currentId);
			tools.each(navArr,function (item,index){
				if( item.currentId == currentId ){
					navArr.length = index+1;
				}
			});
			//如果点击的是 全部文件 那么从第二个开始渲染
			var startIndex = 0;
			if( currentId == 0 ){
				startIndex = 1;
			}
			renderNav(navArr,startIndex);
		}
	})
	//判断是否重命名
	function isRename(pid,name){
		var num1 = 0;
		tools.each(datas.files,function(item,index){
			if(item.pid==pid&&item.name.indexOf(name)!= -1){
				num1++
			}
		})
		if(num1 ==0){
			return name;
		}else{
			return name+'('+num1+')';
		}
	}
	//渲染导航
	function renderNav(navArr,startIndex){
		var str = "",startIndex = startIndex || 0;
		for( var i = startIndex; i < navArr.length-1; i++ ){
			if( i === 0 ){
				str += '<a href="javascript:;" index='+i+' currentId='+navArr[navArr.length-2].currentId+' class="nav_level">'+navArr[i].filename+'</a>|'
			}else{
				str += '<a href="javascript:;" index='+i+' currentId='+navArr[i].currentId+' class="nav_level">'+navArr[i].filename+'</a>>>>'
			}
		}
		str += '<span>'+navArr[navArr.length-1].filename+'</span>'
		files_nav.innerHTML = str;
	}
	function cancelStyle(li){
		var icon = tools.$(".icon",li)[0];
		var checkInput = tools.$(".checkInput",li)[0];
		icon.style.borderColor = "#fff";	
		checkInput.style.display = "none";
		checkInput.checked = false;
	};
	function createLi(options){
		options = options || {};
		//传进来的对象，某些调用函数的时候，可能只不会传入很多值，只会传入需要的值
		var defaults = {
			name:options.name || "新建文件夹",
			id:options.id || 0
		};
		var li = document.createElement("li");
		var str =   '<div class="icon">'
							+'<input type="checkbox"  class="checkInput" />'
						+'</div>'
						+'<strong>'+defaults.name+'</strong>'
						+'<div class="clearFix edtor">'
							+'<input type="text" value="'+defaults.name+'" class="names"  />'
							+'<input type="button" value="√" class="ok" />'
							+'<input type="button" value="×" class="cancel" />'
						+'</div>';
				;
		li.innerHTML = str;
		li.id = defaults.id;
		return li;
	}
	///全选按钮
	var allSelected = tools.$(".allSelected")[0];///全选按钮 
	var icon = tools.$(".icon",filesSet);//filesSet下面的icon
	var checkInput = tools.$(".checkInput",filesSet);
	var seletedNum = 0;  //统计多少条被选中了

	tools.addEvent(allSelected,"click",function (){
		var _this = this;
		tools.each(icon,function (item,i){
			icon[i].style.borderColor = _this.checked ? "#2e80dc" : "#fff";
			checkInput[i].style.display = _this.checked ? "block" : "none";
			checkInput[i].checked = _this.checked;	
		});
		seletedNum = this.checked ? checkInput.length : 0;
		if( this.checked ){
			info.style.display = "block";
			seletedNum = icon.length;
			span.innerHTML = seletedNum;
		}else{
			info.style.display = "none";
			seletedNum = 0;
			span.innerHTML = seletedNum;
		}
	});
	//获取删除按钮和重命名按钮
	var delectItem = tools.$(".delectItem")[0];
	var rename = tools.$(".rename")[0];
	//删除事件
	tools.addEvent(delectItem,'click',function(){
		if(rename.isRename) {
			names &&　names.select();
			return;
		}
		var selectLiArr = whoSelect();
		tools.each(selectLiArr,function (item){
			//找到着对应的值，删除掉
			for( var i = 0; i < datas.files.length; i++ ){
				if( datas.files[i].id == item.id ){
					datas.files.splice(i,1);
					break;
				};
			};
			tools.store("miaov",datas);

			filesSet.removeChild(item);
		});
		span1.innerHTML = allLi.length
		allSelected.checked = false;
		info.style.display = "none";
	});
	//重命名
	tools.addEvent(rename,"click",function (){
		if( this.isRename ){
			names.select();
			return;
		}
		this.isRename = true;
		var selectLiArr = whoSelect();
		if( selectLiArr.length === 1 ){
			//当只有一项选中
			var icon = tools.$(".icon",selectLiArr[0])[0];
			var checkInput = tools.$(".checkInput",selectLiArr[0])[0];
			var ok = tools.$(".ok",selectLiArr[0])[0];
			var cancel = tools.$(".cancel",selectLiArr[0])[0];
			var strong = tools.$("strong",selectLiArr[0])[0];
			var edtor = tools.$(".edtor",selectLiArr[0])[0];
			var reName_names = tools.$(".names",selectLiArr[0])[0];

			strong.style.display = "none";
			edtor.style.display = "block";
			reName_names.select();
			names = reName_names;
		}
		//	enter键功能
		tools.addEvent(document,'keydown',function(li){
			var e = ev || event;
			if(e.keyCode == 13){
				strong.innerHTML = isRename(hiddenInput.value,names.value);
				strong.style.display = "block";
				edtor.style.display = "none";
				span1.innerHTML = allLi.length
				createFolder.isCreateStatus = false;
				if(rename.isRename){
					var currentItem = getIdItem(li.id);
					currentItem.name = names.value;
					rename.isRename = false;
				}else{
					datas.files.push({
						id:li.id,
						pid:hiddenInput.value,
						name:strong.innerHTML
					})
					tools.store("miaov",datas);
				}
//				ev.stopPropagation();
			}
		})
	});

	//复制按钮弹出遮罩层
	var copy = tools.$('.copy')[0];//按钮复制  弹出遮罩层
	var cover = tools.$(".cover")[0];
	var foot_cancel = tools.$('.foot_cancel')[0];
	var dialog_close = tools.$('.dialog_close')[0]//关闭遮罩层
	var movement = tools.$('.movement')[0]//按钮移动 弹出遮罩层
	var select_text = tools.$('.select_text')[0];
	tools.addEvent(movement,'click',function(){
		cover.style.display = 'block';
		select_text.innerHTML = '移动到'
	})
	tools.addEvent(copy,'click',function(){
		cover.style.display = 'block';
		select_text.innerHTML = '复制到'
	})
	//X按钮把遮罩层关掉
	tools.addEvent(dialog_close,'click',function(){
		cover.style.display = 'none';
	})
	//点取消时把遮罩层去掉
	tools.addEvent(foot_cancel,'click',function(){
		cover.style.display = 'none';
	})
	//获取选中的li
	function whoSelect(){
		var arr = [];
		tools.each(checkInput,function (item){
			if( item.checked ){
				arr.push(tools.parents(item,"LI"));
			}		
		});
		return arr;
	};
	//拖拽的面向对象组件
	var option_title = tools.$('#option_title');
	function Drag(id){/////封装一个构造函数
		this.obj = null;
		this.disX = 0;
		this.disY = 0;
		this.settings = {///////默认参数
			toDown:function(){},
			toUp:function(){}
		};
	}
	Drag.prototype.init = function(opt){
		var _this=this;
		this.obj = document.getElementById(opt.id)
		extend(this.settings,opt)
		this.obj.onmousedown = function(ev){
			var e = ev || event;
			_this.down(e);
			_this.settings.toDown();
			document.onmousemove = function(ev){
				var e = ev || event;
				_this.move(e);
			}
			document.onmouseup = function(){
				_this.up();
				_this.settings.toUp();
				
			}
			return false;
		}
	}
	Drag.prototype.down = function(e){
		this.disX = e.clientX - this.obj.parentNode.offsetLeft;
		this.disY = e.clientY - this.obj.parentNode.offsetTop;
	}
	Drag.prototype.move = function(e){
		this.obj.parentNode.style.left = e.clientX - this.disX +'px';
		this.obj.parentNode.style.top = e.clientY - this.disY +'px';
	}
	Drag.prototype.up = function(e){
		document.onmousemove = document.onmouseup = null;
	}
	function extend(obj1,obj2){
		for(var attr in obj2){
			obj1[attr]=obj2[attr];
		}
	}
	var tab1 = new Drag();
	tab1.init({
		id:'option_title'
	});

	//碰撞框选
	var filebox = tools.$(".filebox")[0];
	//获取所有的li
	var allLi = tools.$("li",tools.$(".filesSet")[0]);
	tools.addEvent(filebox,'mousedown',function(ev){
		
		var e = ev || event;
		var disX = e.clientX;
		var disY = e.clientY;
		var oDiv = document.createElement('div');
		oDiv.className = 'collision';
		document.body.appendChild(oDiv);
		tools.addEvent(document,'mousemove',handleMove);
		tools.addEvent(document,'mouseup',up);
		function handleMove(ev){
			var e = ev || event;
			if(e.clientX>disX){
				oDiv.style.left = disX + 'px';
			}else{
				oDiv.style.left = e.clientX + 'px';
			}
			if(e.clientY>disY){
				oDiv.style.top = disY + 'px';
			}else{
				oDiv.style.top = e.clientY + 'px';
			}
			oDiv.style.width = Math.abs(e.clientX -disX) + 'px';
			oDiv.style.height = Math.abs(e.clientY -disY) + 'px';
			seletedNum=0;
			for (var i = 0; i < allLi.length; i++) {
				if(tools.collisionRect(oDiv,allLi[i])){
					icon[i].style.borderColor = '#2e80dc';
					checkInput[i].style.display = 'block';
					checkInput[i].checked = true;
					seletedNum++;
				}else{
					icon[i].style.borderColor = '#fff';
					checkInput[i].style.display = 'none';
					checkInput[i].checked = false;
				}
				info.style.display = 'block';
			}
			if(seletedNum == 0){//鼠标按下没碰上的时候info不显示
				info.style.display = 'none';
			}
			if(seletedNum==allLi.length){
				allSelected.checked = true;
			}else{
				allSelected.checked = false;
			}
			span.innerHTML = seletedNum;
		}
		function up(){
			tools.removeEvent(document,'mousemove',handleMove );
			tools.removeEvent(document,'mouseup',up );
			if(oDiv){
				document.body.removeChild(oDiv);
			}
			if(seletedNum == 0){
				info.style.display = 'none';
			}
		}
		ev.preventDefault();
	});	
	
})()
/////数组去重
var arr3 = [1,2,3,4,5,6,4,3,3]
//console.log(fnQc(arr3))
function fnQc(arr){
	var arr2 = [];
	var json = {};
	for (var i = 0; i < arr.length; i++) {
		if(!json[arr[i]]){
			arr2.push(arr[i]);
			json[arr[i]]=1;
		}
	}
	return arr2;
}
