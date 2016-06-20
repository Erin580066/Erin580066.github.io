//创建显示右键菜单
function showContextmenu(e,data){
	var contextmenuElement = document.getElementById("contextmenu");
	contextmenuElement.style.display = 'block';
	contextmenuElement.style.left = e.clientX + 'px';
	contextmenuElement.style.top = e.clientY + 'px';
	contextmenuElement.innerHTML = '';
	data.forEach(function(v,k){
		var li = document.createElement('li');
		li.innerHTML = v.name;
		li.onclick = v.exe;
		contextmenuElement.appendChild(li);
	})
}
//隐藏右键菜单
function hideContextmenu(){
	var contextmenuElement = document.getElementById("contextmenu");
	contextmenuElement.style.display = 'none';
}
