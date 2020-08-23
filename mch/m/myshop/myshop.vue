<template>
	<view class="body">
		<view class="shop-info">
			<view class="money-title">今日付款金额（元）</view>
			<view class="money">{{shop_info.data1}}</view>
			<view class="info-list">
				<view class="info-item">
					<view>浏览人数</view>
					<view>{{shop_info.data2}}</view>
				</view>
				<view class="info-item">
					<view>付款订单数</view>
					<view>{{shop_info.data3}}</view>
				</view>
				<view class="info-item">
					<view>付款件数</view>
					<view>{{shop_info.data4}}</view>
				</view>
			</view>
		</view>
		<view class="manage-list">
			<view class="manage-item" v-for="(item,index) in manage_list" @tap="toPage(item.url)">
				<view class="manage-img"><image :src="item.img"></image></view>
				<view class="manage-name">{{item.name}}</view>
			</view>
		</view>
		<view class="pc">
			<text @tap="toCpoyPc">PC端管理网址</text>
		</view>
		
		<view class="pcUrl" v-if="copyShow">
			<view>{{shop_info.pc_url}}</view>
			<view @tap="copyPc">复制链接</view>
		</view>
		<view class="shade" v-if="shadeShow" @tap="close"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				manage_list:[
					{
						"name":"店铺管理",
						"img":"/static/img/mch/menu-1.png",
						"url":"/mch/m/setting/setting"
					},
					{
						"name":"商品管理",
						"img":"/static/img/mch/menu-2.png",
						"url":"/mch/m/goods/goods"
					},
					{
						"name":"订单管理",
						"img":"/static/img/mch/menu-3.png",
						"url":"/mch/m/order/order"
					},
					// {
					// 	"name":"数据统计",
					// 	"img":"/static/img/mch/menu-4.png",
					// 	"url":"/mch/m/tongji/tongji"
					// },
					{
						"name":"资产",
						"img":"/static/img/mch/menu-5.png",
						"url":"/mch/m/account/account"
					},
					// {
					// 	"name":"店铺二维码",
					// 	"img":"/static/img/mch/menu-6.png"
					// }
				],
				shop_info:{},
				copyShow:false,
				shadeShow:false
			}
		},
		onLoad() {
			this.getShopInfo();
		},
		methods: {
			//打开地址弹窗
			toCpoyPc(){
				this.copyShow = true;
				this.shadeShow = true;
			},
			//关闭遮罩层和弹窗
			close(){
				this.copyShow = false;
				this.shadeShow = false;
			},
			//复制内容，真机可用
			copyPc(){
				uni.setClipboardData({
				    data: this.shop_info.pc_url,
				    success: function () {
				    }
				});
				this.close();
			},
			
			//获取店铺信息
			getShopInfo(){
				uni.showLoading({
					title:"加载中"
				})
				this.$request({
					url:this.$api.mch.user.myshop
				}).then((res) => {
					uni.hideLoading();
					if(res.code == 0){
						if (res.data.mch.is_open === 0) {
							uni.showModal({
								title: '提示',
								content: '店铺已被关闭！请联系管理员',
								showCancel: false,
								success: function (e) {
									if (e.confirm) {
										uni.navigateBack();
									}
								}
							});
						}
						this.pc_url = res.data.pc_url;
						this.shop_info = res.data
					}
					//未申请入驻
					if (res.code == 1) {
						uni.redirectTo({
							url: '/mch/apply/apply',
						});
					}
				})
			},
			
			// 跳转页面
			toPage(url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style scoped>
	.shop-info{
		width: 100%;
		background-image: linear-gradient(to bottom,#f09495,#F06C7A);
		padding: 40rpx 0 20rpx 0;
		box-sizing: border-box;
	}
	.money-title{
		text-align: center;
		color: #FFFFFF;
		font-size: 34rpx;
	}
	.money{
		font-size: 60rpx;
		font-weight: bold;
		color: #FFFFFF;
		text-align: center;
		padding: 40rpx 0;
	}
	.info-list{
		display: flex;
		align-items: center;
		height: 100rpx;
	}
	.info-list>view{
		flex: 1;
		text-align: center;
		color: #FFFFFF;
	}
	.info-list>view:not(:last-child){
		border-right: 1px solid rgba(255,255,255,0.5);
	}
	.info-item>view:nth-of-type(2){
		padding-top: 8rpx;
	}
	.manage-list{
		display: flex;
		flex-wrap: wrap;
		background-color: #FFFFFF;
		padding: 40rpx 0;
	}
	.manage-list>view{
		text-align: center;
		width: 33%;
		padding: 40rpx 0;
	}
	.manage-img{
		width: 80rpx;
		height: 80rpx;
		margin: 0 auto;
	}
	.manage-name{
		padding-top: 10rpx;
	}
	.manage-img>image{
		width: 100%;
		height: 100%;
	}
	.pc{
		color: #888888;
		text-align: center;
		line-height: 100rpx;
	}
	.pcUrl{
		width: 500rpx;
		word-break:break-all;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		position: fixed;
		top: 300rpx;
		left: calc(50% - 250rpx);
		z-index: 9;
		padding: 30rpx;
		box-sizing: border-box;
	}
	.pcUrl>view:nth-of-type(2){
		margin-top: 20rpx;
		text-align: center;
	}
	.shade{
		width: 100vw;
		height: 100vh;
		background-color: rgba(0,0,0,0.5);
		position: fixed;
		top: 0;
		left: 0;
	}
</style>
