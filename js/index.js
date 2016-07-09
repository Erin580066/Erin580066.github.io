
(function () {
	/*
	 * 动态调整整个页面高度
	 */
	var content = tools.$('.content')[0];
	content.style.height = document.documentElement.clientHeight -49 + 'px';
	window.onresize = function () {
		content.style.height = document.documentElement.clientHeight -49 + 'px';
	}
	//文件区盒子
	var fileBox = tools.$('#fileBox');
	fileBox.style.height = 500 + 'px';
	
	/*
 * 如果本地没有数据，直接加载预设数据,并进行存储，之后使用的数据，都将存在本地
 */
	var data = tools.store('baidu');
	if (data && !data.files) {
		data = datas;
		tools.store('baidu',data);
	}
	/*
	 * 全选按钮
	 */
	var selectAll = tools.$('.selAll')[0];
	selectAll.selected = false;
//	var 
	/*
	 * 新建文件夹
	 */
	var newfile = tools.$('.newfile')[0];
	//初始化新建状态
	newfile.isCreateStatus = false;
	/*
	 * 隐藏的input
	 */
	var pidRecoder = tools.$('.pidRecoder')[0];
	
	//文件夹父级ul
	var filelist = tools.$('.filelist')[0];
	
	/*
	 * 获取所有li
	 */
	var allLi = tools.$('li',filelist);
	var file_selects = tools.$('.file_select');
	/*
	 * 记录选中的个数
	 */
	var selectedNum = 0;
	var selectedSpan = tools.$('#selectedNum');
	var selectedOkArr = [];//确定选中的文件
	/*
	 * 当前目录下总共的文件数
	 */
	var totalFiles = tools.$('.file_num')[0];
	/*
	 * 删除按钮
	 */
	var deleteBtn = tools.$('.delete')[0];
	/*
	 * 操作按钮区
	 */
	var handleBar = tools.$('.btns')[0];
	/*
	 * 重命名
	 */
	var rename = tools.$('.rename')[0];
	rename.isRename = false;
	//没有文件时的背景
	var nofile_bg = tools.$('.nofile_bg')[0];
	var handle_btns = tools.$('.handle_btns')[0];
	/*
	 * 右键菜单
	 */
	var contextmenu = tools.$('#contextmenu');
	/*
	 * 文件路径
	 */
	var fileUrl = tools.$('.fileUrl')[0];
	var fileUrlArr = [{
						filename:"返回上一级"
					},{
						filename:"全部文件",
						currentId:0
					}];
	/*
	 * 生成每个文件
	 */
//	音乐导航功能
	function overplay(){
		var flieType = tools.$('.flie_type')[0];
		var aLi = tools.$('li',flieType);
		var oA = tools.$('#au');
		for (var i = 0; i < aLi.length; i++) {
			aLi[i].onmouseover = function(){
				oA.src = 'http://s8.qhimg.com/share/audio/piano1/'+this.getAttribute('au')+'4.mp3';
				oA.play();
			}
		} 
	}
	overplay();
	function creatLi(options) {
		options = options || {};
		var defaults = {
			name:options.name || '新建文件夹',
			type:options.type || 'folder',
			url:options.url
		}
		var li = document.createElement("li");
		li.type = defaults.type;
		li.url = defaults.url;
		var str = '<div class="icon">'
						+'<em class="spirit file_bg"></em>'
						+'<em class="spirit file_select"></em>'
					+'</div>'
					+'<a class="file_name" href="#" style="display:block;">'+defaults.name+'</a>'
					+'<div class="clearFix editor"  style="display:none;">'
						+'<input type="text" value="'+defaults.name+'" class="names" />'
						+'<em class="spirit ok"></em>'
						+'<em class="spirit cancel"></em>'
					+'</div>';
		li.innerHTML = str;
		var file_bg = tools.$('.file_bg',li)[0];
		if (li.type == 'img') {
			file_bg.style.background = 'url('+li.url+') no-repeat';
			file_bg.style.backgroundSize = 'cover';
		}else if (li.type == 'text') {
			file_bg.style.width = '50px';
			file_bg.style.height = '60px';
			file_bg.style.backgroundPosition = '-225px 0';
		}
		return li;
	}
	
	
	refreshDir(0);
	/*
	 * 点击新建文件夹
	 */
	tools.addEvent(newfile,'click',createNewFile);
	/*
	 * 键盘操作
	 */
	document.onkeyup = function (ev) {
		var ev = ev || event;
		if (ev.keyCode == 78 && ev.ctrlKey==true) {//新建
			createNewFile();
		}else if (ev.keyCode == 46 || ev.keyCode == 110) {//删除
			deleteFiles();
		}else if (ev.keyCode == 65 && ev.ctrlKey==true) {//全选
			if (!allLi.length) {
				return;
			}
			if (newfile.isCreateStatus) {
				return;
			}
			selectAll.style.backgroundPositionX = '-60px';
			tools.each(allLi,function (item) {
				tools.$('.icon',item)[0].style.borderColor = '#2e80dc';
				tools.$('.file_select',item)[0].style.backgroundPositionX = '-20px';
				tools.$('.file_select',item)[0].style.display = 'block';
				tools.$('.file_select',item)[0].selected = true;
				
			})
			selectAll.selected = true;
			selectedNum = allLi.length;
			handleBar.style.display = 'block';
			selectedSpan.innerHTML = selectedNum;
		}else if (ev.keyCode == 67 && ev.ctrlKey == true) {//复制
			selectedOkArr.isCut = false;
			var selectedLiArr = whoSelected();
			selectedOkArr.length = 0;
			tools.each(selectedLiArr,function (li) {
				tools.each(data.files,function (item) {
					if (li.id == item.id) {
						selectedOkArr.push(item);
					}
				})
			})
		}else if (ev.keyCode == 86 && ev.ctrlKey == true) {//粘贴
			if(!selectedOkArr.length) return;
			if(selectedOkArr.isCut){
				tools.each(selectedOkArr,function (item) {
					tools.each(data.files,function (datas) {
						if (item == datas.id) {
							datas.pid = pidRecoder.value;
						}
					})
				})
			}else {
				copy(selectedOkArr,pidRecoder.value);
			}

			tools.store('baidu',data);
			refreshDir(pidRecoder.value);
			selectedOkArr.length = 0;
		}else if (ev.keyCode == 88 && ev.ctrlKey == true) {//剪切
			var selectedLiArr = whoSelected();
			selectedOkArr.length = 0;
			selectedOkArr.isCut = true;
			tools.each(selectedLiArr,function (li) {
				selectedOkArr.push(li.id);
			})
		}
	}
	function createNewFile() {
		if (newfile.isCreateStatus || rename.isRename) {
			return;
		}
		nofile_bg.style.display = 'none';
		/*
		 * 所有li取消选中，不能其他操作
		 */
		selectAll.selected = false;
		selectAll.style.backgroundPositionX = '-41px';
		tools.each(allLi,function (item) {
			tools.$('.icon',item)[0].style.borderColor = '#fff';
			tools.$('.file_select',item)[0].style.backgroundPositionX = '0';
			tools.$('.file_select',item)[0].style.display = 'none';
			tools.$('.file_select',item)[0].selected = false;
		})
		handleBar.style.display = 'none';
			
		var newLi = creatLi();
		newfile.isCreateStatus = true;
		var icon = tools.$('.icon',newLi)[0];
		var file_select = tools.$('.file_select',icon)[0];
		var file_name = tools.$('.file_name',newLi)[0];
		var editor = tools.$('.editor',newLi)[0];
		var names = tools.$('.names',newLi)[0];
		var ok = tools.$('.ok',newLi)[0];
		var cancel = tools.$('.cancel',newLi)[0];
		editor.style.display = 'block';
		file_name.style.display = 'none';
		filelist.insertBefore(newLi,filelist.children[0]);
		names.select();
		/*
		 * 点击确定
		 */
		tools.addEvent(ok,'click',confirm)
		names.onkeydown = function (ev) {
			if (ev.keyCode ==13) {
				confirm(ev);
			}
		}
		function confirm(ev) {
		
			if (newfile.isCreateStatus) {	
				/*
			 * 生成随机id
		 	*/
		 		if (hasName(names.value)) {
		 			alert('重名了')
		 			return;
		 		}
				var random = new Date().getTime();
				
				data.files.push({
					name:names.value,
					id:random,
					pid:parseInt(pidRecoder.value)
				})
				newLi.id = random;
				newLi.pid = parseInt(pidRecoder.value);
				newLi.name = names.value;
				newfile.isCreateStatus = false;
			}
			editor.style.display = 'none';
			file_name.style.display = 'block';
			file_name.innerHTML = names.value;
		/*
		 * 给新建的文件添加事件处理函数
		 */
			handleLi(newLi);
			isNoFiles();
			/*
			 * 存一下数据
			 */
			tools.store('baidu',data);
			ev.stopPropagation();
				
		}
		/*
		 * 点击取消
		 */
		tools.addEvent(cancel,'click',function (ev) {
			if (newfile.isCreateStatus) {
				filelist.removeChild(newLi);
				newfile.isCreateStatus = false;
				isNoFiles();
				ev.stopPropagation();
			}
			
		})
	}
	/*
	 * 根据现有数据，渲染指定id值下的目录
	 */
	function refreshDir(id) {
		/*
		 * 刷新目录前，要做一些初始化
		 */
		filelist.innerHTML = '';
		selectedNum=0;
		selectAll.selected = false;
		selectAll.style.backgroundPositionX = '-41px';
		pidRecoder.value = 0;
		selectedSpan.innerHTML = 0;
		handleBar.style.display = 'none';
		/*
		 * 开始刷新目录
		 */
		for (var i = 0; i < data.files.length; i++) {
			if (data.files[i].pid == id) {
				var newLi = creatLi(data.files[i]);
				newLi.name = data.files[i].name;
				newLi.id = data.files[i].id;
				newLi.pid = data.files[i].pid;
				filelist.appendChild(newLi);
				handleLi(newLi);
			}
		}
		/*
		 * 计算当前目录下所有文件的个数
		 */
		isNoFiles();
		totalFiles.innerHTML = allLi.length;
	}
	
	/*
	 * 给每个li绑定事件处理程序
	 */
	function handleLi (li) {
		/*
		 * 获取li下的所有元素
		 */
		var icon = tools.$('.icon',li)[0];
		var file_select = tools.$('.file_select',icon)[0];
		var file_name = tools.$('.file_name',li)[0];
		var editor = tools.$('.editor',li)[0];
		var names = tools.$('.names',li)[0];
		var ok = tools.$('.ok',li)[0];
		var cancel = tools.$('.cancel',li)[0];
		file_select.selected = false;
		/*
		 * 单击文件夹，进入当前文件夹下的子目录
		 */
		tools.addEvent(li,'click',function () {
			if (!newfile.isCreateStatus && !rename.isRename) {
				if (this.type == 'img') {
					var coverDiv = document.createElement("div");
					coverDiv.className = 'coverDiv';
					coverDiv.style.background = 'rgba(0,0,0,1)';
					var img = new Image();
					var span = document.createElement("span");
					span.className = 'spirit';
					span.style.cssText = 'width:56px;height:56px;position: absolute;right: 0;top: 0;background-position: -224px -66px;'
					img.src = this.url;
					img.className = 'checkPic';
					coverDiv.appendChild(span);
					coverDiv.appendChild(img);
					
					document.body.appendChild(coverDiv);
					tools.addEvent(span,'mouseover',function () {
						this.style.backgroundPosition = '-224px -126px';
					})
					tools.addEvent(span,'mouseout',function () {
						this.style.backgroundPosition = '-224px -66px';
					})
					tools.addEvent(span,'click',function () {
						document.body.removeChild(coverDiv);
					})
				}else if (this.type == 'text') {
					var coverDiv = document.createElement("div");
					coverDiv.className = 'coverDiv';
					coverDiv.style.background = 'rgba(0,0,0,1)';
					var span = document.createElement("span");
					span.className = 'spirit';
					span.style.cssText = 'width:56px;height:56px;position: absolute;right: 0;top: 0;background-position: -224px -66px;'
					var p = document.createElement("p");
					p.style.cssText = 'width: 800px;height: 100%;border: 1px solid #000000;background: #fff;margin: 0 auto;'
					p.innerHTML = this.info;
					coverDiv.appendChild(span);
					coverDiv.appendChild(p);
					document.body.appendChild(coverDiv);
					tools.addEvent(span,'mouseover',function () {
						this.style.backgroundPosition = '-224px -126px';
					})
					tools.addEvent(span,'mouseout',function () {
						this.style.backgroundPosition = '-224px -66px';
					})
					tools.addEvent(span,'click',function () {
						document.body.removeChild(coverDiv);
					})
				}else{
					refreshDir(this.id);
					pidRecoder.value = this.id;
					//渲染导航的目录
		
					// "返回上一级" 全部文件 
		
					fileUrlArr.push({
						filename:file_name.innerHTML,
						currentId:this.id
					});
					renderUrl(fileUrlArr);
					isNoFiles();
				}
			}
		});
		/*
		 * 移入
		 */
		tools.addEvent(li,'mouseover',function () {
			if (!newfile.isCreateStatus && !rename.isRename) {
				this.style.cursor = 'pointer';
				icon.style.borderColor = '#2e80dc';
				file_select.style.display = 'block';
			}
		})
		/*
		 * 移出
		 */
		tools.addEvent(li,'mouseout',function () {
			if (!file_select.selected) {
				icon.style.borderColor = '#fff';
				file_select.style.display = 'none';
			}
		})
		/*
		 * 单选
		 */
		tools.addEvent(file_select,'click',function (ev) {
			if (this.selected) {//取消选中
				this.style.backgroundPositionX = '0';
				selectAll.selected = false;
				selectAll.style.backgroundPositionX = '-41px';
				selectedNum--;
			} else{//选中
				
				this.style.backgroundPositionX = '-20px';
				selectedNum++;
				if (selectedNum == allLi.length) {
					selectAll.selected = true;
					selectAll.style.backgroundPositionX = '-60px';
				}
			}
			if (selectedNum==0) {
				handleBar.style.display = 'none';
			}else{
				handleBar.style.display = 'block';
			}
			selectedSpan.innerHTML = selectedNum;
			this.selected = !this.selected;
			ev.stopPropagation();
		})
	}
	/*
	 * 重命名
	 */
	tools.addEvent(rename,'click',fnRename);
	function fnRename() {
		var selectedLiArr = whoSelected();
		if (selectedLiArr.length>1 || this.isRename) {
			return;
		}
		selectAll.selected = false;
		selectAll.style.backgroundPositionX = '-41px';
		tools.each(allLi,function (item) {
			tools.$('.icon',item)[0].style.borderColor = '#fff';
			tools.$('.file_select',item)[0].style.backgroundPositionX = '0';
			tools.$('.file_select',item)[0].style.display = 'none';
			tools.$('.file_select',item)[0].selected = false;
		})
		handleBar.style.display = 'none';
		rename.isRename = true;
		var li = selectedLiArr[0];
		var icon = tools.$('.icon',li)[0];
		var file_select = tools.$('.file_select',icon)[0];
		var file_name = tools.$('.file_name',li)[0];
		var editor = tools.$('.editor',li)[0];
		var names = tools.$('.names',li)[0];
		var ok = tools.$('.ok',li)[0];
		var cancel = tools.$('.cancel',li)[0];
		console.log(names);
		editor.style.display = 'block';
		names.select();
		file_name.style.display = 'none';
		/*
		 * 确定重命名
		 */
		tools.addEvent(ok,'click',confirm);
		function confirm(ev) {
			if (hasName(names.value)) {
	 			alert('重名了')
	 			return;
	 		}
			tools.each(data.files,function (item) {
				if (item.id == li.id) {
					item.name = names.value;;
				}
			})
			tools.store('baidu',data);
			file_name.innerHTML = names.value;
			editor.style.display = 'none';
			file_name.style.display = 'block';
			rename.isRename = false;
			ev.stopPropagation();
		}
		names.onkeydown = function (ev) {
			if (ev.keyCode == 13) {
				confirm(ev);
			}
		}
		/*
		 * 取消重命名
		 */
		tools.addEvent(cancel,'click',function (ev) {
			editor.style.display = 'none';
			file_name.style.display = 'block';
			rename.isRename = false;
			ev.stopPropagation();
		})
	}
	/*
	 * //文件路径的事件处理
	 */
	
	tools.addEvent(fileUrl,"click",function (ev){
		var target = ev.target;
		if( target.nodeName === "A" ){
			
			//["返回上一级", "全部文件", "我的文档", "4444"]

			var currentId = target.getAttribute("currentId");

			filelist.innerHTML = "";
			refreshDir(currentId);

			//循环数组中的所有项 判断出当前点击的id和数组中id是否一致

			// ["1"，2,3,4,5] length
			// ["上"，“全”]
			
			tools.each(fileUrlArr,function (item,index){
				if( item.currentId == currentId ){
					fileUrlArr.length = index+1;
				}
			});
			//如果点击的是 全部文件 那么从第二个开始渲染
			var startIndex = 0;
			if( currentId == 0 ){
				startIndex = 1;
			}
			renderUrl(fileUrlArr,startIndex);
		}
	});
	//渲染导航
	function renderUrl(fileUrlArr,startIndex){
		var str = "",startIndex = startIndex || 0;
		for( var i = startIndex; i < fileUrlArr.length-1; i++ ){
			if( i === 0 ){
				str += '<a href="javascript:;" index='+i+' currentId='+fileUrlArr[fileUrlArr.length-2].currentId+' class="nav_level">'+fileUrlArr[i].filename+'</a><span>&nbsp|&nbsp</span>'
			}else{
				str += '<a href="javascript:;" index='+i+' currentId='+fileUrlArr[i].currentId+' class="nav_level">'+fileUrlArr[i].filename+'</a>>'
			}
		}
		str += '<span>'+fileUrlArr[fileUrlArr.length-1].filename+'</span>'
		fileUrl.innerHTML = str;
	}
	/*
	 * 点击全选按钮
	 */
	tools.addEvent(selectAll,'click',function () {
		if (!allLi.length) {
			return;
		}
		if (newfile.isCreateStatus) {
			return;
		}
		if (!this.selected) {//全选
			this.style.backgroundPositionX = '-60px';
			tools.each(allLi,function (item) {
				tools.$('.icon',item)[0].style.borderColor = '#2e80dc';
				tools.$('.file_select',item)[0].style.backgroundPositionX = '-20px';
				tools.$('.file_select',item)[0].style.display = 'block';
				tools.$('.file_select',item)[0].selected = true;
				
			})
		} else{//取消全选
			this.style.backgroundPositionX = '-41px';
			tools.each(allLi,function (item) {
				tools.$('.icon',item)[0].style.borderColor = '#fff';
				tools.$('.file_select',item)[0].style.backgroundPositionX = '0';
				tools.$('.file_select',item)[0].style.display = 'none';
				tools.$('.file_select',item)[0].selected = false;
			})
		}
		this.selected = !this.selected;
		selectedNum = this.selected?allLi.length : 0;
		if (selectedNum==0) {
			handleBar.style.display = 'none';
		}else{
			handleBar.style.display = 'block';
		}
		selectedSpan.innerHTML = selectedNum;
	})
	/*
	 * 移动文件夹
	 */
	tools.addEvent(filelist,'mousedown',function (ev) {
		var target = ev.target;
		if (target = tools.parents(target,'LI')) {
			var file_select = tools.$(".file_select",target)[0];
			if (!file_select.selected) {
				return;
			}
			var oDiv = document.createElement("div");
			document.body.appendChild(oDiv);
			var x = ev.clientX;
			var y = ev.clientY;
			var disX = 0;
			var disY = 0;
			var oPid = null;
			if (allLi.length==0) {
				return;
			}
			
			oDiv.style.left = ev.clientX - 16 + 'px';
			oDiv.style.top = ev.clientY-16 + 'px';
	
			tools.addEvent(document,'mousemove',fnMove);
			tools.addEvent(document,'mouseup',fnUp);

			function fnMove (ev) {
				disX = ev.clientX - x;
				disY = ev.clientY - y;
				var Left = ev.clientX -16;
				var Top = ev.clientY -16;
				if (disX>10 || disY>10) {
					oDiv.className = 'movefile spirit';
					var selectedLiArr = whoSelected();
					selectedOkArr.length = 0;
					selectedOkArr.isCut = true;
					tools.each(selectedLiArr,function (li) {
						selectedOkArr.push(li.id);
					})
					oDiv.style.left = Left + 'px';
					oDiv.style.top = Top + 'px';
					for (var i = 0; i < allLi.length; i++) {
						if (arrTest(allLi[i],selectedLiArr)) {
							continue;
						}
						if (tools.collision(oDiv,allLi[i])) {//碰上了
							tools.$('.icon',allLi[i])[0].style.borderColor = '#2e80dc';
							tools.$('.file_select',allLi[i])[0].style.backgroundPositionX = '0';
							tools.$('.file_select',allLi[i])[0].style.display = 'block';
							oPid=allLi[i].id;
							console.log(oPid);
						}else{
							tools.$('.icon',allLi[i])[0].style.borderColor = '';
							tools.$('.file_select',allLi[i])[0].style.backgroundPositionX = '0';
							tools.$('.file_select',allLi[i])[0].style.display = 'none';
							oPid = pidRecoder.value;
							console.log(oPid);
						}
					}
				}
				
			}
			function fnUp () {
				if (selectedOkArr.isCut && oPid!=null) {
					tools.each(selectedOkArr,function (item) {
						tools.each(data.files,function (datas) {
							if (item == datas.id) {
								datas.pid = oPid;
							}
						})
					})
	
					tools.store('baidu',data);
					refreshDir(pidRecoder.value);
					selectedOkArr.length = 0;
					selectedOkArr.isCut = false;
				}
				tools.removeEvent(document,'mousemove',fnMove);
				tools.removeEvent(document,'mouseup',fnUp);
				if (oDiv) {
					document.body.removeChild(oDiv);
				}
			}
		};
	})
	/*
	 * 框选
	 */
	tools.addEvent(fileBox,'mousedown',function (ev) {
		var target = ev.target;
		if( target = tools.parents(target,"LI") ){
			var file_select = tools.$(".file_select",target)[0];
			if( file_select.selected ) {
				return;
			}
		};
		if (allLi.length==0) {
			return;
		}
		if (!newfile.isCreateStatus && !rename.isRename) {
			var disX = ev.clientX;
			var disY = ev.clientY;
			var div = document.createElement("div");
			div.className = 'collision';
			document.body.appendChild(div);
			ev.preventDefault();
			tools.addEvent(document,'mousemove',move);
			tools.addEvent(document,'mouseup',up);
			return false;
			
			function move(ev) {
				var w = ev.clientX - disX;
				var h = ev.clientY - disY;
				
				if (Math.abs(w)>20 || Math.abs(h)>20) {
					if (w>0) {
						div.style.left = disX + 'px';
					}else{
						div.style.left = ev.clientX + 'px';
					}
					if (h>0) {
						div.style.top = disY + 'px';
					} else{
						div.style.top = ev.clientY + 'px';
					}
					div.style.width = Math.abs(w) + 'px';
					div.style.height = Math.abs(h) + 'px';
					selectedNum = 0;
					tools.each(allLi,function (item) {
						if (tools.collision(div,item)) {//碰上了
							tools.$('.icon',item)[0].style.borderColor = '#2e80dc';
							tools.$('.file_select',item)[0].style.backgroundPositionX = '-20px';
							tools.$('.file_select',item)[0].style.display = 'block';
							tools.$('.file_select',item)[0].selected = true;
							selectedNum++;
						}else{//没碰上
							tools.$('.icon',item)[0].style.borderColor = '#fff';
							tools.$('.file_select',item)[0].style.backgroundPositionX = '0';
							tools.$('.file_select',item)[0].style.display = 'none';
							tools.$('.file_select',item)[0].selected = false;
						}
						if (selectedNum==0) {
							handleBar.style.display = 'none';
						}else{
							handleBar.style.display = 'block';
						}
						selectedSpan.innerHTML = selectedNum;	
					})
				}
				if (selectedNum == allLi.length) {
					selectAll.selected = true;
					selectAll.style.backgroundPositionX = '-60px';
				}else{
					selectAll.selected = false;
					selectAll.style.backgroundPositionX = '-41px';
				}
				ev.preventDefault();
				
			}
			function up() {
				tools.removeEvent(document,'mousemove',move);
				tools.removeEvent(document,'mouseup',up);
				if (div) {
					document.body.removeChild(div);
				}
			}
		}
	})
	/*
	 * 删除
	 */
	tools.addEvent(deleteBtn,'click',deleteFiles)
	function deleteFiles() {
		var coverDiv =  document.createElement("div");
		coverDiv.className = 'coverDiv';
		var str = '<div class="pannel" id="box">'
				+'<div class="pannel_head">确认删除</div>'
				+'<div class="pannel_main">'
					+'<div class="pannel_info">'
						+'<p>确认要把所选的文件放入回收站吗？</p>'
						+'<p>删除的文件在30天可以通过回收站还原</p>'
					+'</div>'
					+'<div class="pannel_btns">'
						+'<a href="#" class="confirm">确定</a>'
						+'<a href="#" class="cancel">取消</a>'
					+'</div>'
				+'</div>'
			+'</div>';
		coverDiv.innerHTML = str;
		var pannel = tools.$('.pannel',coverDiv)[0];
		document.body.appendChild(coverDiv);
		
		drag(pannel);
		var confirm = tools.$('.confirm',coverDiv)[0];
		var cancel = tools.$('.cancel',coverDiv)[0];
		confirm.onOff = true;
		/*
		 * 点击确认删除
		 */
		tools.addEvent(confirm,'click',confirmDelete);
		document.onkeyup = function (ev) {
			var ev = ev || event;
			if (ev.keyCode == 13 && confirm.onOff) {
				confirmDelete();
			}
			confirm.onOff = false;
		}
		function confirmDelete() {
			var selectedLiArr = whoSelected();
			tools.each(selectedLiArr,function (item) {
				for (var i = 0; i < data.files.length; i++) {
					if (item.id == data.files[i].id) {
						data.files.splice(i,1);
						break;
					}
				}
				filelist.removeChild(item);
				tools.store('baidu',data);
			})
			selectedNum=0;
			handleBar.style.display = 'none';
			selectAll.style.backgroundPositionX = '-41px';
			selectedSpan.innerHTML = 0;
			totalFiles.innerHTML = allLi.length;
			document.body.removeChild(coverDiv);
			isNoFiles();
		}
		/*
		 * 取消删除
		 */
		tools.addEvent(cancel,'click',function () {
			document.body.removeChild(coverDiv);
		})
		
	}
	/*
	 * 找出被选中的li
	 */
	function whoSelected() {
		var arr = [];
		tools.each(file_selects,function (item) {
			if (item.selected) {
				arr.push(tools.parents(item,'LI'));
			}
		})
		return arr;
	}
	/*
	 * 当前没有文件夹时，显示背景图
	 */
	function isNoFiles() {
		if (allLi.length==0) {
			nofile_bg.style.display = 'block';
			handle_btns.style.display = 'none';
		}else{
			nofile_bg.style.display = 'none';
			handle_btns.style.display = 'block';
		}
	}

		/*
	 * 根据数据，渲染右键菜单
	 */
	var contextmenu = tools.$('#contextmenu');
	function contextShow(ev,data) {
		contextmenu.innerHTML = '';
		contextmenu.style.display = 'block';
		contextmenu.style.left = ev.clientX + 'px';
		contextmenu.style.top = ev.clientY + 'px';
		data.forEach(function (v,k) {
			var li = document.createElement("li");
			li.innerHTML = v.name;
			contextmenu.appendChild(li);
		})
	}
	function contextmenuShow(e,data){
		contextmenu.style.display = 'block';
		contextmenu.style.left = e.clientX + 'px';
		contextmenu.style.top = e.clientY + 'px';
		
		/*
		 * 根据数据，生成右键菜单项
		 */
		
		contextmenu.innerHTML = '';
		data.forEach(function (v,k) {
			var li = document.createElement("li");
			li.innerHTML = v.name;
			li.name = v.name;
			contextmenu.appendChild(li);
			
		})	
	}
	function contextHide () {
		contextmenu.style.display = 'none';
	}
	tools.addEvent(fileBox,'contextmenu',fnContextmenu);
	function fnContextmenu(ev) {
		ev.preventDefault();
		var target = ev.target;
		target = target = tools.parents(target,'LI');
		
		if (target) {
			contextmenuShow(ev,data.contextMenu.folder);
			var icon = tools.$('.icon',target)[0];
			var file_select = tools.$('.file_select',icon)[0];
			var file_name = tools.$('.file_name',target)[0];
			var editor = tools.$('.editor',target)[0];
			var names = tools.$('.names',target)[0];
			var ok = tools.$('.ok',target)[0];
			var cancel = tools.$('.cancel',target)[0];
		}else{
			contextmenuShow(ev,data.contextMenu.common);
		}
		
		var allMenu = tools.$('li',contextmenu);
		/*
		 * 刷新
		 */
		tools.each(allMenu,function (item) {
			tools.addEvent(item,'click',function () {
				if (item.name =='刷新') {
					refreshDir(parseInt(pidRecoder.value));
				}else if(item.name =='打开') {
					if (!newfile.isCreateStatus && !rename.isRename) {
						refreshDir(target.id);
						pidRecoder.value = target.id;
			
						fileUrlArr.push({
							filename:file_name.innerHTML,
							currentId:target.id
						});
						renderUrl(fileUrlArr);
						isNoFiles();
					}
				}else if (item.name =='删除') {
					deleteFiles();
				}else if (item.name =='重命名') {
					fnRename();
				}else if (item.name =='新建文件夹') {
					createNewFile();
				}else if (item.name == '复制') {
					selectedOkArr.isCut = false;
					var selectedLiArr = whoSelected();
					selectedOkArr.length = 0;
					tools.each(selectedLiArr,function (li) {
						tools.each(data.files,function (item) {
							if (li.id == item.id) {
								selectedOkArr.push(item);
							}
						})
					})
				}else if (item.name == '粘贴') {
					if(!selectedOkArr.length) return;
					if(selectedOkArr.isCut){
						tools.each(selectedOkArr,function (item) {
							tools.each(data.files,function (datas) {
								if (item == datas.id) {
									datas.pid = pidRecoder.value;
								}
							})
						})
					}else {
						copy(selectedOkArr,pidRecoder.value);
					}

					tools.store('baidu',data);
					refreshDir(pidRecoder.value);
					selectedOkArr.length = 0;
				}else if(item.name == '剪切'){
					var selectedLiArr = whoSelected();
					selectedOkArr.length = 0;
					selectedOkArr.isCut = true;
					tools.each(selectedLiArr,function (li) {
						selectedOkArr.push(li.id);
					})
					
					
				}
			})
			
		})
	}
	tools.addEvent(document,'click',function () {
		contextHide();
	})
	/*
	 * 当没有文件时
	 */
	tools.addEvent(nofile_bg,'contextmenu',function (ev) {
		fnContextmenu(ev);
		ev.preventDefault();
	})
	/*
	 * 复制
	 */
	function copy (arr,opid) {
		var arr2 = [];
		var random = new Date().getTime();
		for (var i = 0; i < arr.length; i++) {
			random ++;
			arr2.push({
				name:arr[i].name,
				id:random,
				pid:opid
			})
			data.files.push({
				name:arr[i].name,
				id:random,
				pid:opid
			})
		}
		for (var i = 0; i < arr.length; i++) {
			
			for (var j = 0; j < data.files.length; j++) {
				if (data.files[j].pid == arr[i].id) {
					random++;
					arr.push(data.files[j]);
					arr2.push({
						name:data.files[j].name,
						id:random,
						pid:arr2[i].id
					})
					data.files.push({
						name:data.files[j].name,
						id:random,
						pid:arr2[i].id
					})
				}
			}
		}
		return arr2;
	}
	function arrTest(item,arr) {//判断数组中是否存在某项
		for (var i = 0; i < arr.length; i++) {
			if (arr[i]==item) {
				return true;
			}
		}
		return false;
	}
/*
 * 生成文件文件夹列表
 */
var copyBtn = tools.$('.copy')[0];
var cutBtn = tools.$('.remove')[0];
var pannelTitle = '';
tools.addEvent(copyBtn,'click',function () {
	pannelTitle = '复制到';
	listBox();
	var selectedLiArr = whoSelected();
	selectedOkArr.length = 0;
	tools.each(selectedLiArr,function (li) {
		tools.each(data.files,function (item) {
			if (li.id == item.id) {
				selectedOkArr.push(item);
			}
		})
	})
});
tools.addEvent(cutBtn,'click',function () {
	pannelTitle = '移动到';
	listBox();
	var selectedLiArr = whoSelected();
	selectedOkArr.length = 0;
	tools.each(selectedLiArr,function (li) {
		selectedOkArr.push(li.id);
	})
});
function subfile(father){   //循环每一级文件下面有没有文件夹
	for(var i=0;i<father.children.length;i++){
		if(getChildren(father.children[i].id).length>0){
			var ul = document.createElement("ul");
			for (var j=0;j<getChildren(father.children[i].id).length;j++) {
				var li = document.createElement("li");
				li.id = getChildren(father.children[i].id)[j].id;
				var h4 = document.createElement("h4");
				h4.innerHTML = "<span class='spirit foldicon'></span>"+getChildren(father.children[i].id)[j].name;
				
				ul.appendChild(li);
				li.appendChild(h4)
			}
			father.children[i].appendChild(ul);
			subfile(ul);
		}
	}
}

function listBox(){  //生成复制移动列表
	var pidRecode = null;
	var coverDiv = document.createElement("div");
	coverDiv.className = 'coverDiv';
	var pannel = document.createElement("div");
	pannel.className = 'cut_copy';
	
	var head = document.createElement("div");
	head.className = 'pannel_head';
	head.innerHTML = pannelTitle;
	var foot = document.createElement("div");
	foot.className = 'handlebtns';
	foot.innerHTML = '<a href="#" class="confirm">确定</a>'
					+'<a href="#" class="cancel">取消</a>';
	var listbox = document.createElement("ul");
	listbox.className = 'listbox';
	var uls = tools.$('ul',listbox);
	var h4s = tools.$("h4",listbox);
	var confirm = tools.$('.confirm',foot)[0];
	var cancel = tools.$('.cancel',foot)[0];
	confirm.onOff = true;
	console.log(confirm);
	var str = ""
	for (var i=0;i<getChildren(0).length;i++) {
		str+= "<li id='"+getChildren(0)[i].id+"'><h4><span class='spirit foldicon'></span>"+getChildren(0)[i].name+"</h4></li>"
	}
	listbox.innerHTML = str;
	subfile(listbox);
	pannel.appendChild(head);
	pannel.appendChild(listbox);
	pannel.appendChild(foot);
	coverDiv.appendChild(pannel);
	document.body.appendChild(coverDiv);
	drag(pannel);
	/*
	 * 添加加减号
	 */
	for (var i = 0; i < h4s.length; i++) {
		var em = document.createElement("em");
		h4s[i].insertBefore(em,h4s[i].children[0]);
		if (h4s[i].nextElementSibling) {
			em.className = 'hasChild spirit';
		}
	}
	
	
	tools.addEvent(cancel,'click',function () {//点击取消
		document.body.removeChild(coverDiv);
		
	})
	tools.addEvent(confirm,'click',fnConfirm); //点击确定
	document.onkeyup = function (ev) {
		var ev = ev || event;
		if (ev.keyCode == 13) {
			fnConfirm();
		}
		
	}
	function fnConfirm() {//点击确定
		if (pidRecode!=null && pannelTitle =='复制到') {
			copy(selectedOkArr,pidRecode);
		}else if (pidRecode!=null && pannelTitle =='移动到'){//移动到
			tools.each(selectedOkArr,function (item) {
				tools.each(data.files,function (datas) {
					if (item == datas.id) {
						datas.pid = pidRecode;
					}
				})
			})
		}
		tools.store('baidu',data);
		refreshDir(pidRecoder.value);
		selectedOkArr.length = 0;
		document.body.removeChild(coverDiv);
		confirm.onOff = false;
	}
	for (var i = 0; i < uls.length; i++) {
		uls[i].style.display = 'none';
	}
	for (var i=0;i<h4s.length;i++) {
		h4s[i].style.paddingLeft = '20px';
		h4s[i].onoff = true;
		h4s[i].onclick = function(){
			for (var i=0;i<h4s.length;i++) {
				h4s[i].style.backgroundColor = "";
			}
			this.style.background = "#e5f0fb";
			if(this.nextElementSibling){
				var uls=this.nextElementSibling.getElementsByTagName("ul");
				for(var i=0;i<uls.length;i++){//加号
					uls[i].style.display="none";
					uls[i].previousElementSibling.lastElementChild.style.backgroundPosition = "0 -447px";
					uls[i].previousElementSibling.firstElementChild.style.backgroundPosition =  "0 -466px";
					uls[i].previousElementSibling.onoff=true;
					
				}
			}
			
			if (this.nextElementSibling){
				if(this.onoff){//减号
					this.lastElementChild.style.backgroundPosition = "0 -447px";
					this.firstElementChild.style.backgroundPosition =  "-15px -466px";
					this.nextElementSibling.style.display = "block";
				}else{//加号
					this.lastElementChild.style.backgroundPosition = "0 -447px";
					this.firstElementChild.style.backgroundPosition =  "0 -466px";
					this.nextElementSibling.style.display = "none";
				}	
			}
			this.onoff = !this.onoff;
			console.log(this.parentNode.id);
			pidRecode = this.parentNode.id;//记录当前点击的id
		}	
	}
}
/*
 * 上传文件
 */
var upload = tools.$('.upload')[0];
var uploadBtn = tools.$('.uploadbtn',upload)[0];
tools.addEvent(uploadBtn,'change',function () {
	var file = this.files[0];
	var fr = new FileReader();
	fr.onload = function (ev) {
		var random = new Date().getTime();
		if (file.type.indexOf('image') !=-1) {
			data.files.push({
				name:'pic'+random,
				id:random,
				pid:pidRecoder.value,
				type:'img',
				url:ev.target.result
			})
		}else if (file.type.indexOf('text') !=-1) {
			data.files.push({
				name:'text'+random,
				id:random,
				pid:pidRecoder.value,
				type:'text',
				info:ev.target.result
			})
		}
		tools.store('baidu',data);
		refreshDir(pidRecoder.value);
	}
	fr.readAsDataURL(file);
})
/*
 * 拖拽
 */
function drag(obj) {
	tools.addEvent(obj,'mousedown',function (ev) {
		ev = ev || event;
		if (!tools.containClass(ev.target,'pannel_head')) {
			return false;
		}
		var disX = ev.clientX - obj.offsetLeft;
		var disY = ev.clientY - obj.offsetTop;
		tools.addEvent(document,'mousemove',fnMove);
		tools.addEvent(document,'mouseup',fnUp);
		function  fnMove(ev) {
			ev = ev || event;
			obj.style.left = ev.clientX - disX + 'px';
			obj.style.top = ev.clientY - disY +'px';
		}
		function fnUp () {
			tools.removeEvent(document,'mousemove',fnMove);
			tools.removeEvent(document,'mouseup',fnUp);
		}
		ev.cancelBubble = true;
	})
}
/*
 * 处理重名问题
 */
function hasName(names) {
	for (var i = 0; i < allLi.length; i++) {
		if (names == allLi[i].name) {
			return true;
		}
	}
	return false;
}
function getChildren(id) {
	var arr = [];
	for (var i = 0; i < data.files.length; i++) {
		if (data.files[i].pid == id) {
			arr.push(data.files[i]);
		}
	}
	return arr;
}
})();
/*
 * 音乐播放器
 */
(function () {
	var musicBtn = tools.$('.music')[0];
	var musicBox = tools.$('#musicBox');
	var musicPlayer = tools.$('#player');
	var onOff = tools.$('.onOff',musicBox)[0];
	var timeAll = tools.$('.timeAll',musicBox)[0];
	var timeNow = tools.$('.timeNow',musicBox)[0];
	var mute = tools.$('.mute',musicBox)[0];
	var duration = 0;
	var timer = null;
	var volume = 0.3;
	/*
	 * 进度和音量的范围
	 */
	var progressAll = tools.$('.progressAll',musicBox)[0];
	var progressNow = tools.$('.progressNow',musicBox)[0];
	var progressBlock = tools.$('.progressBlock',musicBox)[0];
	var volAll = tools.$('.volControl',musicBox)[0];
	var volNow = tools.$('.volNow',musicBox)[0];
	var volBlock = tools.$('.volBlock',musicBox)[0];
	
	var maxProgress = 0;
	var maxVol = 0;
/*
 * 播放器的显示和隐藏
 */
	tools.addEvent(musicBtn,'click',function () {
		musicPlayer.volume = volume;
		if (this.show) {//隐藏
			move(musicBox,{
				left:{
					target:-document.documentElement.clientWidth,
					duration:1000,
					fx:'backIn'
				}
			});
		}else{//显示
			move(musicBox,{
				left:{
					target:0,
					duration:1000,
					fx:'bounceOut'
				}
			});
			maxProgress = progressAll.clientWidth - progressBlock.clientWidth;
			maxVol = volAll.clientWidth - volBlock.clientWidth;
			volBlock.style.left = maxVol*volume + 'px';
		}
		this.show =!this.show;
	})
	
	/*
	 * 初始化
	 */
	tools.addEvent(musicPlayer,'canplay',function () {
		init();
	})
	init();
	function init() {
		duration = musicPlayer.duration;
		timeAll.innerHTML = changeTime(duration);
		timeNow.innerHTML = changeTime(musicPlayer.currentTime);
		
	}
	
	/*
	 * 播放和暂停
	 */
	
	document.onkeydown = function (ev) {
		if (ev.keyCode == 32 && musicBox.offsetLeft ==0) {
			fnOnoff();
		}
	}
	tools.addEvent(onOff,'click',fnOnoff);
	function fnOnoff() {
		if (!musicPlayer.paused) {//暂停
			musicPlayer.pause();
			onOff.style.backgroundPosition = '-36px -23px';
			clearInterval(timer);
		} else{//播放
			musicPlayer.play();
			onOff.style.backgroundPosition = '0 -23px';
			timer = setInterval(fn1,1000)
		}
	}
	function fn1() {
		currentTime = musicPlayer.currentTime;
		timeNow.innerHTML = changeTime(currentTime);
		progressBlock.style.left = (currentTime/duration)*maxProgress + 'px';
		progressNow.style.width = (currentTime/duration)*maxProgress + 'px';
	}
	/*
	 * 拖动进度条
	 */
	tools.addEvent(progressBlock,'mousedown',function (ev) {
		var disX = ev.clientX - this.offsetLeft;
		tools.addEvent(document,'mousemove',fnMove);
		tools.addEvent(document,'mouseup',fnUp);
		clearInterval(timer);
		var Left = 0;
		function fnMove (ev) {
			Left = ev.clientX - disX;
			Left = Left<0? 0 : Left;
			Left = Left>maxProgress? maxProgress : Left;
			progressBlock.style.left = Left + 'px';
			progressNow.style.width = Left + 'px';
			
			
		}
		function fnUp() {
			//更新时间
			currentTime = Left/maxProgress*duration; 
			
			console.log(currentTime)
			
			timer = setInterval(fn1,1000)
			
			tools.removeEvent(document,'mousemove',fnMove);
			tools.removeEvent(document,'mouseup',fnUp);
		}
	})
	/*
	 * 点击进度条
	 */
	tools.addEvent(progressAll,'click',function (ev) {
		var disX = ev.clientX - this.offsetLeft;
		disX = disX>maxProgress? maxProgress : disX;
		progressBlock.style.left = disX + 'px';
		progressNow.style.width = disX + 'px';
		//更新时间
		musicPlayer.currentTime = disX/maxProgress*duration;
		timeNow.innerHTML = changeTime(musicPlayer.currentTime);
	})
	/*
	 * 静音
	 */
	tools.addEvent(mute,'click',function () {
		if (musicPlayer.muted) {//取消静音
			musicPlayer.muted = false;
			this.style.backgroundPositionX = 0;
		} else{//静音
			musicPlayer.muted = true;
			this.style.backgroundPositionX = '-36px';
		}
	})
	/*
	 * 控制音量
	 */
	tools.addEvent(volBlock,'mousedown',function (ev) {
		var disX = ev.clientX - this.offsetLeft;
		tools.addEvent(document,'mousemove',fnMove);
		tools.addEvent(document,'mouseup',fnUp);
		function fnMove(ev) {
			var Left = ev.clientX - disX;
			Left = Left<0? 0 : Left;
			Left = Left>maxVol? maxVol : Left;
			volBlock.style.left = Left + 'px';
			musicPlayer.volume = Left/maxVol;
			if (Left==0) {
				musicPlayer.muted = true;
				mute.style.backgroundPositionX = '-36px';
			}else{
				musicPlayer.muted = false;
				mute.style.backgroundPositionX = 0;
			}
		}
		function fnUp() {
			tools.removeEvent(document,'mousemove',fnMove);
			tools.removeEvent(document,'mouseup',fnUp);
		}
	})
	/*
	 * 点击音量条
	 */
	tools.addEvent(volAll,'click',function (ev) {
		var disX = ev.clientX - this.offsetLeft;
		disX = disX>maxVol? maxVol : disX;
		volBlock.style.left = disX + 'px';
		musicPlayer.volume = disX/maxVol;
	})
	/*
	 * 时间显示格式
	 */
	function changeTime(iNum){
		
		iNum = parseInt( iNum );
		
		var iM = toZero(Math.floor(iNum/60));
		var iS = toZero(Math.floor(iNum%60));
		
		return iM + ':' + iS;
		
	}
	/*
	 * 数字前面补零
	 */
	function toZero(num){
		if(num<=9){
			return '0' + num;
		}
		else{
			return '' + num;
		}
	}
})();
/*
 * 小游戏
 */
(function () {
	var content_right = tools.$('.content_right')[0];
	var games = tools.$('.games')[0];
	tools.addEvent(games,'click',function () {
		var oDiv = document.createElement("div");
		var str = '<header>'
						+'<h2>试试你的手速有多快！</h2>'
					+'</header>'
					+'<section class="wrap">'
						+'<div id="left">'
							+'<p>消除：0个</p>'
							+'<p>miss：0个</p>'
							+'<p>得分：0分</p>'
							+'<input type="button" id="startBtn" value="开始游戏" />'
						+'</div>'
						+'<div id="right"></div>'
					+'</section>';
		oDiv.className = 'gamesBox';
		oDiv.style.width = content_right.offsetWidth + 'px';
		oDiv.style.height = document.documentElement.clientHeight-49 + 'px';
		oDiv.innerHTML = str;
		content_right.appendChild(oDiv);
		
	})
})();




















