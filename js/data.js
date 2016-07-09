
/*
 * 文件区数据
 */
var datas = {
	/*
	 * 右键菜单
	 */
	contextMenu:{
		/*
		 * 空白区右键菜单
		 */
		common:[
			{
				name:'刷新'
			},
			{
				name:'新建文件夹'
			},
			{
				name:'粘贴'
			}
		],
		folder:[
			{
				name:'打开',
				exe:function () {
					
				}
			},
			{
				name:'复制',
				exe:function () {
					
				}
			},
			{
				name:'剪切',
				exe:function () {
					
				}
			},
			{
				name:'重命名',
				exe:function () {
//					
				}
			},
			{
				name:'删除',
				exe:function () {
					if (confirm('确定要删除吗？')) {
						
					}
				}
			}
			
		]
	},
	files:[
		{
			id:1,
			pid:0,
			name:'技术'
		},
		{
			id:2,
			pid:0,
			name:'音乐'
		},
		{
			id:3,
			pid:0,
			name:'电影'
		},
		{
			id:4,
			pid:1,
			name:'HTML'
		},
		{
			id:5,
			pid:1,
			name:'CSS'
		},
		{
			id:6,
			pid:1,
			name:'Javascript'
		},
		{
			id:7,
			pid:2,
			name:'周杰伦'
		},
		{
			id:8,
			pid:2,
			name:'林俊杰'
		},
		{
			id:9,
			pid:3,
			name:'这个杀手不太冷'
		},
		{
			id:10,
			pid:3,
			name:'美人鱼'
		}
	],
	user:[
		{
			username:'css',
			password:'123456789'
		},
		{
			username:'html',
			password:'123456789'
		},
		{
			username:'js',
			password:'123456789'
		}
	]
}































































































