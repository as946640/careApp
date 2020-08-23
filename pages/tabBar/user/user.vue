<template>
	<view class="page">
		<view class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<view class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="addr"></view>
			<view class="input-box">
				
			</view>
			<view class="icon-btn">
				<view class="icon tongzhi" @tap="toMsg"></view>
				<view class="icon setting" @tap="toSetting"></view>
			</view>
		</view>
		<!-- 占位 -->
		<view  class="place"></view>
		<!-- 用户信息 -->
		<view class="user">
			<!-- 头像 -->
			<view class="left">
				<image src="/static/img/face.jpg" @tap="toSetting"></image>
			</view>
			<!-- 昵称,个性签名 -->
			<view class="right">
				<view class="username" @tap="toLogin">阿森</view>
				<view class="signature" @tap="toSetting" >二级会员</view>
				<!-- <view class="signature" @tap="toSetting" >点击登陆注册</view> -->
			</view>
			<!-- 二维码按钮 -->
			<view class="erweima" @tap="toMyQR">
				<view class="icon qr"></view>
			</view>
		</view>
		<!-- VIP banner -->
		<view class="VIP" @click="geoVip">
			<view class="img">
				<image src="/static/img/VIP.png"></image>
			</view>
			<view class="title" >二级会员</view>
			<view class="tis">会员特权</view>
		</view>
		<!-- 订单-余额 -->
		<view class="order">
			<!-- 订单类型 -->
			<block v-if="orderList"></block>
			<view class="list" v-if="orderList.length > 0">
				<view class="box" v-for="(item, index) in orderList" :key="index"  @tap="toOrderList('/pages/user/order_list/order_list?status=' + 0)">
					<view class="img">
						<image :src="item.pic_url" mode=""></image>
					</view>
					<view class="text">{{item.name}}</view>
					<view class="icon-num" >
						<text>{{item.num}}</text>
					</view>
				</view>
		
				
			</view>
			<!-- 余额 -->
			
				<view class="balance-info flex">
					<view class="left flex">
						<view class="box" @tap="toIntegral()">
							<view class="num">999</view>
							<view class="text">
								积分
								<image  src="/static/img/face.png" mode=""></image>
							</view>
						</view>
						
							<view class="box" @tap="toBalance">
								<view class="num">500</view>
								<view class="text">
									余额
									<image  src="/static/img/face.png" mode=""></image>
								</view>
							</view>
						
					</view>
					<view class="right">
					
							<view class="box" @tap="toDeposit">
								<view class="img">
									<view class="icon chongzhi"></view>
								</view>
								<view class="text">钱包</view>
							</view>
						
					</view>
				</view>
			
		</view>
		
		
		
		<!-- 工具栏 -->
		<view class="toolbar">
			<view class="title">我的工具栏</view>
			<view class="list">
				<view class="box" v-for="(row,index) in mytoolbarList" :key="index" @tap="toPage(row)">
					<view class="img">
						<image :src="row.icon"></image>
					</view>
					<view class="text">{{row.name}}</view>
				</view>
			</view>
		</view>
		
		
		<!-- 占位 -->
		<!-- tabbar -->
		<!-- #ifdef APP-PLUS || H5 -->
		<view class="tab-bar">
			<tui-tabbar :tabBar="tabBar" unlined :hump="true" :current="current" @click="tabbarSwitch"></tui-tabbar>
		</view>
		<!-- #endif -->
		<!-- <view class="place-bottom"></view> -->
	</view>
</template>
<script>

	export default {
		data() {
			return {
				isfirst:true,
				headerPosition:"fixed",
				headerTop:null,
				statusTop:null,
				showHeader:true,
				current: 0,
				//个人信息,
				user:{
					username:'游客1002',
					face:'/static/img/face.jpg',
					signature:'点击昵称跳转登录/注册页',
					integral:0,
					balance:0,
					envelope:0
				},
				// 订单类型
				orderList:[
					{
						name: '待付款',
						pic_url: '/static/img/user/order/fuk.png',
						num: 1
					},
					{
						name: '待发货',
						pic_url: '/static/img/user/order/fahuo.png',
						num: 3
					},
					{
						name: '待收货',
						pic_url: '/static/img/user/order/shouhup.png',
						num: 4
					},
					{
						name: '已完成',
						pic_url: '/static/img/user/order/yiok.png',
						num: 5
					},
					{
						name: '售后',
						pic_url: '/static/img/user/order/shouh.png',
						num: 2
					},
					
				],
				// 工具栏列表
				mytoolbarList:[
					{
						icon: '/static/img/user/order/youhuij2.png',
						name: '我的优惠卷',
						url:'/pages/coupon/coupon'
					},
					{
						icon: '/static/img/user/order/yuhuij1.png',
						name: '领卷中心',
						url:'/pages/coupon-list/coupon-list'
					},
					{
						icon: '/static/img/user/order/shouc.png',
						name: '我的收藏'
					},
					{
						icon: '/static/img/user/order/kefu.png',
						name: '在线客服'
					},
					{
						icon: '/static/img/user/order/shouc.png',
						name: '联系我们'
					},
					{
						icon: '/static/img/user/order/shouhuo.png',
						name: '收货地址',
						url: '/pages/address/address'
					},
					{
						icon: '/static/img/user/order/shops.png',
						name: '入住商',
						url: '/mch/m/myshop/myshop'
					}
				],
				wallet:{},
				orderCount:{},//订单数量
				
				tabBar: [
					{
						"pagePath": "/pages/home/home",
						"text": "首页",
						"iconPath": "/static/img/home/tabBar/home.png",
						"selectedIconPath": "/static/img/home/tabBar/home-active.png"
					},
					{
						"pagePath": "/pages/mall-index/mall-index",
						"text": "商城",
						"iconPath": "/static/img/home/tabBar/shop.png",
						"selectedIconPath": "/static/img/home/tabBar/shop-active.png"
					},
					{
						"pagePath": "",
						"text": "拍一拍",
						"iconPath": "/static/img/home/pai.png",
						"hump": true,
						"selectedIconPath": "/static/img/home/pai.png"
					},
					{
						"pagePath": "/pages/serve-branch/serve-branch",
						"text": "网点",
						"iconPath": "/static/img/home/tabBar/branch.png",
						"selectedIconPath": "/static/img/home/tabBar/branch-active.png"
					},
					{
						"pagePath": "/pages/tabBar/user/user",
						"text": "我的",
						"iconPath": "/static/img/home/tabBar/mi.png",
						"selectedIconPath": "/static/img/home/tabBar/mi-active.png"
						
					}
				]
							
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.getUser()
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop>=0?"fixed":"absolute";
			this.headerTop = e.scrollTop>=0?null:0;
			this.statusTop = e.scrollTop>=0?null:-this.statusHeight+'px';
		},
		
		onLoad() {
			var self = this;
			this.getUser()
			this.statusHeight = 0;
			// #ifdef APP-PLUS
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
		},
		onReady(){
			//此处，演示,每次页面初次渲染都把登录状态重置
			uni.setStorage({
				key: 'UserInfo',
				data: false,
				success: function () {
				},
				fail:function(e){
				}
			});
		},
		onShow(){
			this.current = 4;
			this.getUser()
		},
		methods: {
			//消息列表
			toMsg(){
				uni.navigateTo({
					url:'../../msg/msg'
				})
			},
			toOrderList(url){
				uni.navigateTo({
					url:url
				})
			},
			toSetting(){
				uni.navigateTo({
					url:'../../user/setting/setting'
				})
			},
			toMyQR(){
				uni.navigateTo({
					url:'../../user/myQR/myQR'
				})
			},
			toLogin(){
				uni.showToast({title: '请登录'});
				uni.navigateTo({
					url:'../../login/login'
				})
				this.isfirst = false;
			},
			isLogin(){
				//实际应用中,用户登录状态应该用token等方法去维持登录状态.
				const value = uni.getStorageSync('UserInfo');
				if (value) {
					return true;
				}
				return false
			},
			toDeposit(){
				uni.navigateTo({
					url:'../../user/deposit/deposit'
				})
			},
			toPage(row){
				console.log(row.url);
				if(!row.url){
					if(row.open_type == 'tel') {
						uni.makePhoneCall({
						    phoneNumber: '10086'
						});
					}
					uni.showToast({title: '模板未包含此页面'});return;
				}
				uni.navigateTo({
					url:row.url
				})
			},
			
			// 用户中心数据
			getUser() {
				this.$request({
					url: this.$api.user.index
				}).then(res => {
					console.log(res);
					this.mytoolbarList = res.data.menus;
					this.user = res.data.user_info;
					this.wallet.wallet = res.data.wallet;
					this.wallet.wallets = res.data.wallets;
					this.orderCount = res.data.order_count;
					this.orderList = res.data.orders;
				})
			},
			// 会员
			geoVip() {
				uni.navigateTo({
					url:'/pages/member/member'
				})
			},
			
			toBalance(){
				uni.navigateTo({
					url:'/pages/balance/balance'
				})
			},
			toIntegral(){
				uni.navigateTo({
					url:"/pages/integral/integral"
				})
			},
			tabbarSwitch(e) {
				this.current = e.index
				console.log(e.index);
				uni.navigateTo({
					url:e.pagePath
				})
			},
		}
	} 
</script>
<style lang="scss">
	.page {
		width: 100;
		height: 100vh;
		padding-bottom: 100rpx;
	}
	.status {
		width: 100%;
		height: 0;
		position: fixed;
		background-image: url('/static/img/home/header.png');
		z-index: 10;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height);//覆盖样式
		/*  #endif  */
		
	}
	
	.header{
		width: 92%;
		padding: 0 4%;
		height: 100rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-image: url('/static/img/home/header.png');
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		.icon-btn{
			width: 120rpx;
			height: 60rpx;
			flex-shrink: 0;
			display: flex;
			.icon{
				color: #fff;
				width: 60rpx;
				height: 60rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42rpx;
			}
		}
	}
	.place{
		background-image: url('/static/img/home/header.png');
		height: 100rpx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.place-bottom{
		height: 300rpx;
	}
	.user{
		width: 92%;
		padding: 0 4%;
		padding-top: 20rpx;
		display: flex;
		align-items: center;
		// position: relative;
		background-image: url('/static/img/home/header.png');
		background-position: 50%;
		padding-bottom: 120rpx;
		.left{
			width: 20vw;
			height: 20vw;
			flex-shrink: 0;
			margin-right: 20rpx;
			border: solid 1rpx #fff;
			border-radius: 100%;
			image{
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}
			
		}
		.right{
			width: 100%;
			.username{
				font-size: 36rpx;
				color: #fff;
			}
			.signature{
				color: #eee;
				font-size: 28rpx;
			}
		}
		.erweima{
			flex-shrink: 0;
			width: 10vw;
			height: 10vw;
			margin-left: 5vw;
			border-radius: 100%;
		
			display: flex;
			justify-content: center;
			align-items: center;
			background: linear-gradient(to left, #fbbb37 0%,#fcf0d0 105%);
			.icon{
				color: #7b6335;
				font-size: 42rpx;
			}
		}
	}
	.order{
		width: 84%;
		margin: 30rpx 4% 30rpx 4%;
		padding: 30rpx 4% 20rpx 4%;
		background-color: #fff;
		box-shadow: 0rpx 0rpx 25rpx rgba(0,0,0,0.1);
		border-radius: 15rpx;
		.list{
			display: flex;
			border-bottom: solid 1rpx #17e6a1;
			padding-bottom: 10rpx;
			.box{
				width: 20%;
				position: relative;
				.img{
					width: 100%;
					display: flex;
					justify-content: center;
					.icon{
						font-size: 50rpx;
						color: #464646;
					}
					image {
						width: 55rpx;
						height: 55rpx;
					}
				}
				.text{
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 28rpx;
					color: #3d3d3d;

				}
				.icon-num{
					position: absolute;
					top: -10rpx;
					right: 10rpx;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					text-align: center;
					line-height: 30rpx;
					color: #FFFFFF;
					font-size: 22rpx;
					background-color: #f06c7a;
				}
			}
		}
		.balance-info{
			display: flex;
			padding: 10rpx 0;
			font-size: 10pt;
			.left{
				width: 75%;
				display: flex;
				.box{
					flex: 1;
					font-size: 10pt;
					
					.num{
						width: 100%;
						height: 50rpx;
						display: flex;
						justify-content: center;
						align-items: flex-end;
						color: #f9a453;
					}
					.text{
						width: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #3d3d3d;
						font-size: 28rpx;
							image{
								margin-left: 5rpx;
								width: 30rpx;
								height: 30rpx;
							}
					}
				}
			}
			.right{
				border-left: solid 1rpx #17e6a1;
				width: 25%;
				.box{
					
					.img{
						width: 100%;
						height: 50rpx;
						display: flex;
						justify-content: center;
						align-items: flex-end;
						.icon{
							font-size: 45rpx;
							color: #e78901;
						}
					}
					.text{
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 28rpx;
						color: #3d3d3d;
					}
				}
			}
		}
	}
	.VIP{
		width: 84%;
		margin: -65rpx auto 20rpx auto;
		padding: 30rpx 4%;
		background: linear-gradient(to left, #dea96d 0%,#f6d59b 100%);
		box-shadow: 0rpx 0rpx 25rpx rgba(0,0,0,0.2);
		border-radius: 15rpx;
		display: flex;
		align-items: center;
		.img{
			flex-shrink: 0;
			width: 60rpx;
			height: 60rpx;
			image{
				width: 60rpx;
				height: 60rpx;
			}
		}
		.title{
			width: 100%;
			color: #796335;
			font-size: 30rpx;
		}
		.tis{
			width: 100%;
			display: flex;
			justify-content: flex-end;
			color: #fcf0d0;
			font-size: 26rpx;
		}
	}
	.toolbar{
		width: 92%;
		margin: 0 4% 0 4%;
		padding: 0 0 20rpx 0;
		background-color: #fff;
		box-shadow: 0rpx 0rpx 25rpx rgba(0,0,0,0.1);
		border-radius: 15rpx;
		margin-bottom: 30rpx;
		.title{
			padding-top: 10rpx;
			margin: 0 0 10rpx 3%;
			font-size: 30rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			.box{
				width: 25%;
				margin-bottom: 30rpx;
				.img{
					width: 23vw;
					// height: 10.5vw;
					padding-bottom: 10rpx;
					display: flex;
					justify-content: center;
					
					image{
						width: 50rpx;
						height: 50rpx;
					}
				}
				.text{
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 26rpx;
					color: #3d3d3d;
				}
			}
		}
	}
	.tab-bar {
		width: 100%;
		height: 100rpx;
		background-color: #0062CC;
		position: fixed;
		bottom: 0;
		left: 0;
	}
</style>
