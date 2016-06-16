/////根据指定的ID查找其下面的一级子数据
function getChildren(pid){
	var arr = [];
	for (var i = 0; i < datas.files.length; i++) {
		if(datas.files[i].pid == pid){
			arr.push(datas.files[i]);
		}
	}
	return arr;
}
function getInfo(id) {
    for ( var i=0; i<datas.files.length; i++ ) {
        if (datas.files[i].id == id) {
            return datas.files[i];
        }
    }
}

function getMaxId() {
    var maxId = datas.files[0].id;
    for ( var i=1; i<datas.files.length; i++ ) {
        if (datas.files[i].id > maxId) {
            maxId = datas.files[i].id;
        }
    }
    return maxId;
}