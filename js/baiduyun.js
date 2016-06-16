//var arr = [1,2,3];
//var arr2 = [];
//
////for(var attr in arr){
////	arr2[attr] = arr[attr]
////}
////arr2.push(1111111)
//var obj ={
//	a:1,
//	b:2
//}
//var obj2 = {}
////console.log(arr2);
//for(var attr in obj){
//	obj2[attr]=obj[attr]
//}
//
//console.log(obj.c)
//console.log(obj2.c)

//var arr = [1,2,3]
//var obj = {
//	a:1,
//	b:{
//		c:123,
//		exe:function(){
//			alert(1);
//		}
//	}
//}
//function extend(obj){
//	var newArr = obj.constructor === Array?[]:{};
//	for(var attr in obj){
//		if(typeof obj[attr]==='object'){
//			newArr[attr]=extend(obj[attr]);
//		}else{
//			newArr[attr]=obj[attr];
//		}
//	}
//	return newArr;
//}
//console.log(extend(arr))
//var Newarr2 = extend(arr)

//function extend2(obj,b1){
//	var newArr = obj.constructor === Array?[]:{};
//	for(var attr in obj){
//		if(typeof obj[attr]==='object'&&b1){
//			newArr[attr]=extend2(obj[attr]);
//		}else{
//			newArr[attr]=obj[attr];
//		}
//	}
//	return newArr;
//}
//console.log(extend2(obj,true))

//var value = localStorage.getItem('miao');
////if(!value){
////	localStorage.getItem('miao',1);
////}else{
////	localStorage.getItem('miao',134567);
////}
////localStorage.setItem('miao',1);
//if(!miao){ 
//	localStorage.setItem('miao',1);
//}
//var miao = parseInt(localStorage.getItem('miao'))
//alert(miao++)
//localStorage.setItem('miao',miao);
var datas = tools.store('miaov');
if(data&&!datas.files){
	datas = data;
	tools.store('miaov',datas);
}
