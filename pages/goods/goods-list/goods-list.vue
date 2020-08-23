<template>
	<view>
		<!-- 自定义头部 -->
		<view class="headers flex flex-y-center">
			<view class="" style="width: 80rpx;" @tap="back">
				<tui-icon name="arrowleft" color="#fff"></tui-icon>
			</view>
			
			<view class="" style="text-align: center; padding-right: 90rpx; color: #fff;">
				<text class="name">汽车用品</text>
			</view>
			
		</view>
		<!-- :style="{position:headerPosition,top:headerTop}" -->
		<view class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="target" v-for="(target,index) in orderbyList" @tap="select(index)" :key="index" :class="[target.selected?'on':'']">
				{{target.text}}
				<view v-if="target.orderbyicon" class="icon" :class="target.orderbyicon[target.orderby]"></view>
			</view>
		</view> 
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(goods) in goodsList" :key="goods.id" @tap="toGoods(goods.id)">
					<image mode="aspectFill" :src="goods.pic_url" style="height: 340upx;"></image>
					<view class="name">{{goods.name}}</view>
					<view class="info">
						<view class="price">￥{{goods.price}}</view>
						<view class="slogan">售出{{goods.virtual_sales}}</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cat_id:0,//分类id
				page:1,//分页
				sort:0,//分类选项卡，即0为综合，1为最新，2为价格，3为销量
				sort_type:-1,//-1为其他，0为价格升序，1为价格降序
				row_count:0,//商品总数
				goodsList:[],//商品列表
				loadingText:"正在加载...",
				isNoMore:false,
				headerTop:"80rpx",
				headerPosition:"fixed",
				orderbyList:[
					{text:"综合",selected:true,orderbyicon:false,orderby:0},
					{text:"最新",selected:false,orderbyicon:false,orderby:0},
					{text:"价格",selected:false,orderbyicon:['sheng','jiang'],orderby:0},
					{text:"销量",selected:false,orderbyicon:false,orderby:0}
				],
				orderby:"sheng"
			};
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			this.cat_id=option.cid; //分类id
			this.loadGoodsList();//加载商品列表
			let len = this.goodsList.length;
			
			
			// 设置头部标题为传递过来的分类名字
			uni.setNavigationBarTitle({
				title: option.name
			});
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(()=>{
				// this.reload();
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom(){

			// if(this.isNoMore){
			// 	this.loadingText="没有更多商品";
			// }else{
			// 	this.loadGoodsList();
			// 	this.loadingText="正在加载...";
			// }
			
			this.loadGoodsList();
			// let end_goods_id = this.goodsList[len-1].goods_id;
			// for(let i=1;i<=10;i++){
			// 	let goods_id = end_goods_id+i;
			// 	let p = { goods_id: goods_id, img: '/static/img/goods/p'+(goods_id%10==0?10:goods_id%10)+'.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' };
			// 	this.goodsList.push(p);
			// }
		},
		onPageScroll: function(e) {
			console.log(e.scrollTop);
			if(e.scrollTop == 0) {
				this.headerTop = 80+'rpx'
			}
			if(e.scrollTop > 80) {
				this.headerTop = 0+ 'rpx'
			}
		},
		methods:{
			// reload(){
			// 	console.log("reload");
			// 	let tmpArr = []
			// 	this.goodsList = [];
			// 	let end_goods_id = 0;
			// 	for(let i=1;i<=10;i++){
			// 		let goods_id = end_goods_id+i;
			// 		let p = { goods_id: goods_id, img: '/static/img/goods/p'+(goods_id%10==0?10:goods_id%10)+'.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168', slogan:'1235人付款' };
			// 		this.goodsList.push(p);
			// 	}
			// },
			//商品跳转
			toGoods(id){
				// uni.showToast({title: '商品'+e.goods_id,icon:"none"});
				console.log(id)
				uni.navigateTo({
					url: '../goods?cid='+id+'' 
				});
			},
			
			//排序类型
			select(index){
				//切换分类时初始化数据
				this.page = 1;
				this.isNoMore = false;
				this.goodsList = [];
				this.loadingText = '正在加载...';
				
				this.sort=index;// 设置当前选中项
				// 判断是否为价格排序
				if(this.sort!=2){
					this.sort_type=-1;
				}
				let tmpTis = this.orderbyList[index].text+"排序 "
				if(this.orderbyList[index].orderbyicon){
					let sort_type = this.orderbyList[index].orderby==0?0:1; //如果选中的为价格排序，则判断是升序还是降序，升序为0，降序为1
					let type = this.orderbyList[index].orderby==0?'升序':'降序';
					if(this.orderbyList[index].selected){
						type = this.orderbyList[index].orderby==0?'降序':'升序';
						sort_type = this.orderbyList[index].orderby==0?1:0; //判断当前价格排序是否为选中状态，如果为选中状态则改变升降排序的状态
						this.orderbyList[index].orderby = this.orderbyList[index].orderby==0?1:0;
					}
					tmpTis+=type
					this.sort_type = sort_type;
					// console.log(this.sort_type);
				}
				this.orderbyList[index].selected = true;
				let len = this.orderbyList.length;
				for(let i=0;i<len;i++){
					if(i!=index){
						this.orderbyList[i].selected = false;
					}
				}
				uni.showToast({title:tmpTis,icon:"none"});
				
				this.loadGoodsList();
			},
			//请求排序商品数据
			// loadSortList(){
			// 	this.page = 1;
			// 	uni.showLoading({
			// 		title:"正在加载"
			// 	});
			// 	this.$request({
			// 		url: this.$api.default.goods_list,
			// 		data:{
			// 			cat_id:this.cat_id,
			// 			page:this.page,
			// 			sort: this.sort,
			// 			sort_type: this.sort_type
			// 		}
			// 	}).then(res=>{
			// 		uni.hideLoading();
			// 		console.log(res);
			// 	});
			// },
			
			//请求商品数据列表
			loadGoodsList(){
				console.log(this.isNoMore);
				if(this.isNoMore){
					this.loadingText="没有更多商品";
					uni.showToast({
						title:"到底了",
						icon:'none'
					})
					return;
				}
				uni.showLoading({
					title:"正在加载"
				});
				this.$request({
					url: this.$api.default.goods_list,
					data:{
						cat_id:this.cat_id,
						page:this.page,
						sort: this.sort,
						sort_type: this.sort_type
					}
				}).then(res=>{
					console.log(res);
					if(res.code == 0){
						let list = this.goodsList;//保存已有的商品列表
						if (this.page == 1) {//如果页码为1则数据列表就显示为当前查询的内容
							list = res.data.list;
						}
						if (this.page > 1) {//如果页码大于1，则将查询到的内容合并到数据列表
							list = list.concat(res.data.list)
						}
						this.goodsList = list;//设置商品列表
						if (res.data.page_count > this.page) {//如果返回的总页数大于本地的页数
							let p = this.page + 1;//每请求一次则将本地的页码加一
							this.page = p;
						} else {//如果总页数不大于本地页数，则将“没有更多”的状态设置为true
							this.isNoMore = true;
						}
						this.row_count = res.data.row_count;
						if(this.isNoMore){
							this.loadingText="没有更多商品";
						}
						uni.hideLoading();
						// this.categoryList=res.data.list;
					};
				});
			},
			back() {
				uni.navigateBack()
			}
		}
		
	}
</script>

<style lang="scss">
	.headers {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		padding-left: 10rpx;
		background-image: url('/static/img/home/header.png');
		background-size: 50%;
			view {
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				.name {
					margin: 0 auto;
					line-height: 100rpx;
				}
			}
	}
	
	
	.icon {
		font-size:26upx;
	}
	.header{
		width: 92%;
		padding: 0 4%;
		height: 79upx;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		background-color: #fff;
		position: fixed;
		z-index: 10;
		border-bottom: solid 1upx #eee;
		.target{
			width: 20%;
			height: 78upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			margin-bottom: -2upx;
			color: #aaa;
			&.on{
				color: #000;
				border-bottom: 4upx solid #134AFF;
				font-weight: 600;
				font-size: 33upx;
			}
			
			
		}
	}
.place{
		height: 100rpx;
	}
.goods-list{
		.loading-text{
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}
		.product-list{
			width: 92%;
			padding: 0 4% 3vw 4%; 
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.product{
				width: 48%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0,0,0,0.1);
				image{
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}
				.name{
					width: 92%;
					padding: 10upx 4%;
					height: 70upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}
				.info{
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10upx 4% 10upx 4%;
					
					.price{
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
					}
					.slogan{
						color: #807c87;
						font-size: 24upx;
					}
				}
			}
			
		}
	}
</style>
