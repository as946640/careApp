<template>
	<view class="body">
		<view class="top" :style="'background-image:url('+shop_info.header_bg+')'">
			<view class="shop-info">
				<view class="shop-img">
					<image :src="shop_info.logo" mode="aspectFill"></image>
				</view>
				<view class="shop-name">
					<view>{{shop_info.name}}</view>
					<view>
						<text>商品：{{shop_info.goods_num}}</text>
						<text>已售：{{shop_info.sale_num}}</text>
					</view>
				</view>
				<view class="service" @tap="serveiceShow">
					<image src="../../static/img/shop/shop-kf.png"/></image>
					<view>客服</view>
				</view>
			</view>
		</view>
		<view class="shop-tab" :class="imbibition?'inTop':''">
			<view class="shop-tab-list">
				<view class="shop-tab-item" :class="tab==1?'active':''" @tap="tabSelect(1)">
					<image src="../../static/img/shop/icon-shouye-active.png" v-if="tab==1"></image>
					<image src="../../static/img/shop/icon-shouye.png" v-else></image>
					<view>店铺首页</view>
				</view>
				<view class="shop-tab-item" :class="tab==2?'active':''" @tap="tabSelect(2)">
					<image src="../../static/img/shop/icon-quanbu-active.png" v-if="tab==2"></image>
					<image src="../../static/img/shop/icon-quanbu.png" v-else></image>
					<view>全部商品</view>
				</view>
				<view class="shop-tab-item" :class="tab==3?'active':''" @tap="tabSelect(3)">
					<image src="../../static/img/shop/icon-xinpin-active.png" v-if="tab==3"></image>
					<image src="../../static/img/shop/icon-xinpin.png" v-else></image>
					<view>新品上架</view>
				</view>
				<view class="shop-tab-item" :class="tab==4?'active':''" @tap="tabSelect(4)">
					<image src="../../static/img/shop/icon-summary.png"></image>
					<view>店铺简介</view>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="aaa" v-if="imbibition"></view>
		<!-- 内容 -->
		<view class="shop-cont">
			<block v-if="tab==1">
				<view class="hot-goods">
					<view class="goods-title">热销商品</view>
					<view class="goods-list">
						<view class="goods-item" v-for="(item,index) in hot_list" :key="index" @tap="toGoods(item.id)">
							<!-- <navigator :url="'/pages/goods/goods?cid='+item.id+''"> -->
							<view class="goods-img">
								<image :src="item.cover_pic"></image>
							</view>
							<view class="goods-name">{{item.name}}</view>
							<view class="goods-price">￥{{item.price}}</view>
						</view>
					</view>
				</view>
			</block>
			
			<block v-if="tab==2">
				<view class="all-goods">
					<view class="header">
						<view class="target" :class="sort_id==0?'target-active':''" @tap="sortSelect(0)">分类<image src="../../static/img/shop/icon-fenlei.png" class="sort"></image></view>
						<view class="target" :class="sort_id==1?'target-active':''" @tap="sortSelect(1)">综合</view>
						<view class="target" :class="sort_id==2?'target-active':''" @tap="sortSelect(2)">销量</view>
						<view class="target" :class="(sort_id==3||sort_id==4)?'target-active':''" @tap="sortSelect(3)" v-if="sort_id<3">
							价格
							<image src="../../static/img/shop/icon-jiage-1.png" class="price"></image>
						</view>
						<view class="target" :class="(sort_id==3||sort_id==4)?'target-active':''" @tap="sortSelect(4)" v-if="sort_id==3">
							价格
							<image src="../../static/img/shop/icon-jiage-2.png" class="price"></image>
						</view>
						<view class="target" :class="(sort_id==3||sort_id==4)?'target-active':''" @tap="sortSelect(3)" v-if="sort_id==4">
							价格
							<image src="../../static/img/shop/icon-jiage-3.png" class="price"></image>
						</view>
					</view> 
					<view class="goods-list">
						<view class="goods-item" v-for="(item,index) in goods_list" :key="index">
							<navigator :url="'/pages/goods/goods?cid='+item.id+''">
								<view class="goods-img">
									<image :src="item.cover_pic"></image>
								</view>
								<view class="goods-name">{{item.name}}</view>
								<view class="goods-price">￥{{item.price}}</view>
							</navigator>
						</view>
					</view>
				</view>	
			</block>
			
			<block v-if="tab==3">
				<view class="new-goods_box">
					<view class="new-goods" v-for="(item,index) in new_list" :key="index">
						<view class="new-date">{{item.date}}</view>
						<view class="goods-list">
							<view class="goods-item" v-for="(goods,i) in item.list">
								<navigator :url="'/pages/goods/goods?cid='+goods.id+''">
									<view class="goods-img">
										<image :src="goods.cover_pic"></image>
									</view>
									<view class="goods-name">{{goods.name}}</view>
									<view class="goods-price">￥{{goods.price}}</view>
								</navigator>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		
		<!-- 左抽屉 -->
		<tui-drawer mode="left" :visible="leftDrawer" @close="closeDrawer">
			<scroll-view scroll-y="true" class="drawer">
				<view class="drawer-item" v-for="(item,index) in targetList">
					<view class="drawer-item-title" @tap="selectSort(item.id)">
						<view>{{item.name}}</view>
						<view><image src="../../static/img/shop/icon-jiantou-you.png"/></view>
					</view>
					<view class="drawer-child-box" v-if="item.list.length>0">
						<view class="drawer-child" v-for="child in item.list" @tap="selectSort(child.id)">{{child.name}}</view>
					</view>
				</view>
			</scroll-view>
		</tui-drawer>
		
		<!-- 客服联系方式 -->
		<view class="service-model" v-if="service_show">
			<view class="service-box">
				<image @tap="closeService" src="../../static/img/cha.png"></image>
				<view class="model-title">联系客服</view>
				<view class="model-cont">
					<view>店家微信</view>
					<view>{{shop_info.wechat_name}}</view>
				</view>
				<view class="model-cont">
					<view>客服电话</view>
					<view>{{shop_info.service_tel}}</view>
				</view>
				<view class="model-btn">
					<view @tap="copyWechat">复制微信</view>
					<view @tap="call">拨打电话</view>
				</view>
			</view>
		</view>
		
		<view class="footer" v-if="tab!=3">
			<view class="loading">
				<block v-if="is_no_more">没有商品了~</block>
				<!-- <block v-else><image src="../../static/img/shop/loading.gif"></image></block> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab:1,//店铺选项卡
				sort_id:1,//分类选项卡id
				temp_sort_id:0,
				cat_id:"",//分类id
				page:1,//页数
				shop_info:{},
				hot_list:[],
				goods_list:[],
				new_list:[],
				imbibition:false,
				statusHeight:0, //状态栏高度
				is_no_more:false,
				leftDrawer:false, //抽屉的显示
				targetList:[] ,//分类列表
				service_show:false
			}
		},
		onLoad(options) {
			uni.getSystemInfo({
			    success: function (res) {
			        console.log(res.statusBarHeight);
					this.statusHeight = res.statusBarHeight
			    }
			});
			console.log(options);
			if(options.mch_id){
				this.mch_id = options.mch_id;
			}else{
				uni.showModal({
					title:"提示",
					content:"店铺不存在,店铺id错误",
					showCancel:false,
					success: function (res) {
						if (res.confirm) {
							uni.navigateBack({
							    delta: 1
							});
						}
					}
				})
			}
			this.tab = options.tab?options.tab:1;
			this.sort_id = options.sort_id;
			this.getShopInfo();
		},
		onPageScroll(e){
			// console.log(e.scrollTop);
			let info = uni.createSelectorQuery().select('.shop-tab'); //获取这个节点的信息
			let info2 = uni.createSelectorQuery().select('.shop-cont'); //获取这个节点的信息
			
			info.boundingClientRect((data) => { //获取这个节点的信息
				if (data) {
					this.fromTop = data.top; //获取元素距离顶部的距离.
					if(data.top <= (0+this.statusHeight)){
						this.imbibition = true;
					}
				}
			}).exec();
			info2.boundingClientRect((data) => { //获取这个节点的信息
				if (data) {
					if(data.top >= 55){
						this.imbibition = false;
					}
				}
			}).exec();
		},
		onReachBottom() {
			this.getGoodsList();
		},
		methods: {
			
			// 联系客服
			serveiceShow(){
				this.service_show = true;
			},
			closeService(){
				this.service_show = false;
			},
			// 关闭分类抽屉
			closeDrawer(){
				this.leftDrawer = false;
				this.sort_id = this.temp_sort_id;
			},
			//复制微信
			copyWechat(){
				uni.setClipboardData({
				    data: this.shop_info.wechat_name,
				    success: function (res) {
				        console.log(res);
				    }
				});
			},
			call(){
				uni.makePhoneCall({
				    phoneNumber: this.shop_info.service_tel //仅为示例
				});
			},
			
			
			//跳转至商品详情页面
			toGoods(goods_id){
				uni.navigateTo({
					url:'/pages/goods/goods?cid='+goods_id+''
				})
			},
			//获取商铺信息
			getShopInfo(id){
				uni.showLoading({
					title:"加载中"
				})
				this.$request({
					url:this.$api.mch.shop,
					data:{
						mch_id: this.mch_id,
						tab: this.tab,
						sort: this.sort_id,
						page: 1,
						cat_id: this.cat_id,
					}
				}).then((res) => {
					console.log(res)
					uni.hideLoading();
					if(res.code == 0){
						this.shop_info = res.data.shop;
						this.hot_list = res.data.goods_list;
						this.goods_list = res.data.goods_list;
						this.new_list = res.data.new_list;
						this.page+=1;
					}
				});
			},
			getGoodsList(){
				if (this.tab == 3) {
					return;
				}
				if (this.is_no_more) {
					return;
				}
				var current_page = this.page || 0;
				var target_page = current_page + 1;
				this.$request({
					url: this.$api.mch.shop,
					data: {
						mch_id: this.mch_id,
						tab: this.tab,
						sort: this.sort_id,
						page: target_page,
						cat_id: this.cat_id,
					}
				}).then((res) => {
					if (res.code == 0) {
						if (this.tab == 1) {
							if (res.data.goods_list && res.data.goods_list.length) {
								this.hot_list = this.hot_list.concat(res.data.goods_list);
								this.page = target_page;
							} else {
								this.is_no_more = true
							}
						}
						if (this.tab == 2) {
							if (res.data.goods_list && res.data.goods_list.length) {
								this.goods_list = this.goods_list.concat(res.data.goods_list);
								this.page = target_page
							} else {
								this.is_no_more = true
							}
						}
					}
				});
			},
			// 店铺选项卡
			tabSelect(tab){
				
				if(tab == 2){
					this.sort_id = 1;
				}
				if(tab == 4){
					uni.navigateTo({
						url:"/pages/shop/shop-info/shop-info?mch_id="+this.mch_id+""
					})
					return;
				}
				this.tab = tab;
				this.getShopInfo();
			},
			
			//点击分类选项卡
			sortSelect(sort_id){
				this.temp_sort_id = this.sort_id;
				this.sort_id = sort_id;
				if(sort_id == 0){
					this.leftDrawer = true;
					this.$request({
						url:this.$api.mch.shop_cat,
						data:{
							mch_id:this.mch_id
						}
					}).then((res) => {
						if(res.code == 0){
							this.targetList = res.data.list
						}
						console.log(this.targetList);
					});
				}else{
					this.getShopInfo();
				}
				
			},
			// 选择分类
			selectSort(cat_id){
				this.cat_id = cat_id;
				this.leftDrawer = false;
				console.log(this.cat_id);
				this.getShopInfo();
			},
			
		}
	}
</script>

<style scoped>
	.top{
		width: 100%;
		height: 260rpx;
		background-position:top center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		position: relative;
	}
	.inTop{
		position: fixed;
		left: 0;
		top: 0px;
		z-index: 999;
	}
	.shop-info{
		width: 100%;
		height: 150rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
	}
	.shop-img{
		width: 100rpx;
		height: 100rpx;
		border-radius: 8rpx;
	}
	.shop-img>image{
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}
	.shop-name{
		flex: 1;
		margin-left: 20rpx;
		color: #FFFFFF;
	}
	.shop-name>view:nth-of-type(1){
		font-size: 38rpx;
	}
	.shop-name>view:nth-of-type(2)>text:nth-of-type(1){
		margin-right: 30rpx;
	}
	.service{
		width: 80rpx;
		height: 80rpx;
		text-align: center;
		color: #FFFFFF;
	}
	.service>image{
		width: 50rpx;
		height: 50rpx;
	}
	.aaa{
		width: 100%;
		height: 90rpx;
		padding: 25rpx 0;
	}
	.shop-tab{
		width: 100%;
		height: 90rpx;
		background-color: #FFFFFF;
		border-bottom: 2px solid #FAFAFA;
		padding: 25rpx 0;
	}
	.shop-tab-list{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.shop-tab-item{
		text-align: center;
		flex: 1;
		font-size: 32rpx;
	}
	.shop-tab-list>.active{
		color: #FF6D6C;
	}
	.shop-tab-item>image{
		width: 45rpx;
		height: 45rpx;
	}
	.hot-goods{
		width: 100%;
	}
	.goods-title{
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		line-height: 80rpx;
		background-color: #FFFFFF;
	}
	.goods-list{
		width: 100%;
		padding:20rpx 30rpx 30rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.goods-item{
		width: 47.5%;
		height: 460rpx;
		margin-bottom: 25rpx;
		background-color: #FFFFFF;
	}
	.goods-img{
		width: 100%;
		height: 310rpx;
	}
	.goods-img>image{
		width: 100%;
		height: 100%;
	}
	.goods-name{
		padding: 10rpx 20rpx;
		height: 62rpx;
		font-size: 28rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.goods-price{
		padding: 0 20rpx;
		padding-top: 15rpx;
		font-size: 30rpx;
		box-sizing: border-box;
		color: #FF5756;
	}
	.header{
		width: 100%;
		height: 90rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-bottom: 2px solid #FAFAFA;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.header>.target{
		flex: 1;
		text-align: center;
	}
	.target>image.sort{
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}
	.target>image.price{
		width: 16rpx;
		height: 26rpx;
		margin-left: 8rpx;
	}
	.target-active{
		color: #FF5756;
	}
	.new-date{
		text-align: center;
		padding: 20rpx 0;
	}
	.new-goods>.goods-list{
		padding-top:0;
		padding-bottom: 0;
	}
	.drawer{
		width: 80vw;
		height: 100vh;
		padding: 40rpx 20rpx;
		box-sizing: border-box;
		background-color: #F1F1F1;
	}
	.drawer-item{
		width: 100%;
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
		margin-bottom: 30rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
	}
	.drawer-item-title{
		width: 100%;
		display: flex;
		font-size: 36rpx;
		align-items: center;
		height: 100rpx;
	}
	.drawer-item-title>view:nth-of-type(2){
		width: 20rpx;
		height: 40rpx;
		margin-left: auto;
	}
	.drawer-item-title>view:nth-of-type(2)>image{
		width: 100%;
		height: 100%;
	}
	.drawer-child-box{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding-bottom: 20rpx;
	}
	.drawer-child{
		width: 49%;
		height: 70rpx;
		background-color: #F1F1F1;
		line-height: 70rpx;
		padding:0 10rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		border-radius: 10rpx;
	}
	.service-model{
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0,0,0,0.5);
	}
	.service-box{
		border-radius: 16rpx;
		min-width: 560rpx;
		background-color: #FFFFFF;
		position: relative;
	}
	.service-box>image{
		width: 35rpx;
		height: 35rpx;
		position: absolute;
		right: 25rpx;
		top: 25rpx;
	}
	.model-title{
		text-align: center;
		padding: 25rpx;
		font-size: 36rpx;
		border-bottom: 1px solid #CCCCCC;
	}
	.model-cont{
		display: flex;
		padding: 20rpx 30rpx;
	}
	.model-cont>view:nth-of-type(2){
		margin-left: 15rpx;
	}
	.model-btn{
		display: flex;
		justify-content: space-around;
		margin-top: 20rpx;
		margin-bottom: 30rpx;
	}
	.model-btn>view{
		width: 200rpx;
		height: 50rpx;
		text-align: center;
		border-radius: 50rpx;
		border: 1px solid #FF4544;
		color: #FF4544;
	}
	.footer{
		width: 100%;
		padding-bottom: 20rpx;
		text-align: center;
	}
	.loading{
		margin: 0 auto;
		color: #333;
	}
	.loading>image{
		width: 50rpx;
		height: 50rpx;
	}
</style>
