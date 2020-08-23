<template>
	<view>
		<!-- 占位 -->
		<view class="place"></view>
			<!-- 搜索 -->
				<!-- 状态栏 -->
				<view class="status"></view>
				<!-- 顶部导航栏 -->
				<view class="header">
					<!-- 定位城市 -->
					<view class="addr">
						<view class="icon location"></view>
						{{city}}
					</view>
					<!-- 搜索框 -->
					<view class="input-box">
						<input placeholder="搜索商品" placeholder-style="color:#fff;" @tap="toSearch()" disabled="true" />
						<view class="icon search"></view>
					</view>
					<!-- 右侧图标按钮 -->
					<view class="icon-btn">
						<view class="icon tongzhi" @tap="toMsg"></view>
					</view>
				</view>

			<!-- 轮播图 -->
			
				<view class="swiper">
					<view class="swiper-box">
						<swiper circular="true" autoplay="true" @change="swiperChange">
							<swiper-item v-for="(item, index) in swiperList" :key="item.id">
								<image :src="item.pic_url" @tap="toSwiper(swiper)"></image>
							</swiper-item>
						</swiper>
						<view class="indicator">
							<view class="dots" v-for="(swiper, index) in swiperList" :class="[currentSwiper >= index ? 'on' : '']" :key="index"></view>
						</view>
					</view>
				</view>
			

			<!-- 分类列表 -->
			
				<u-catrgoty :cateList="categoryList"   @classifyitme="classifyitme" />
			

			<!-- 广告图 -->
			
				<view class="banner">
					<image :src="active_list"></image>
				</view>
			


			<!-- 活动区 -->
			
				<view class="promotion">
					<view class="text">优惠专区</view>
					<view class="list">
						<view class="column" v-for="(row, index) in Promotion" @tap="toPromotion(row)" :key="index">
							<view class="top">
								<view class="title">{{ row.title }}</view>
								<view class="countdown" v-if="row.countdown">
									<view>{{ row.countdown.h }}</view>
									:
									<view>{{ row.countdown.m }}</view>
									:
									<view>{{ row.countdown.s }}</view>
								</view>
							</view>
							<view class="left">
								<view class="ad">{{ row.ad }}</view>
								<view class="into">点击进入</view>
							</view>
							<view class="right">
								<image :src="row.img"></image>
							</view>
						</view>
					</view>
				</view>
			

			<!-- 所有分类商品列表列表 -->
		
				<!-- 导航猜你喜欢头部 -->

				<!-- 分类 -->
				<view class="goods-list">
					<view class="title">
						<scroll-view id="tab-bar" scroll-with-animation="true" class="tui-scroll-h" scroll-x="true" show-scrollbar="false"
						 :scroll-into-view="scrollInto">
							<view v-for="(tab, index) in tabBars" :key="tab.id" class="tui-tab-item" :id="tab.id" :data-current="index"
							 @click="tabClick">
								<text class="tui-tab-item-title" :class="{ 'tui-tab-item-title-active': tabIndex == index }">{{tab.name}}</text>
							</view>
						</scroll-view>
					</view>

					<!-- 商品item -->
				
						<view class="product-list">
							<view class="product" v-for="(item,index) in goods_list" :key="item.id" @tap="toGoods(item)">
								<image mode="scaleToFill" :src="item.pic_url"></image>
								<view class="name">{{ item.name }}</view>
								<view class="info">
									<view class="price"><text style="font-size: 10pt;">¥</text>{{ item.price }}</view>
									<view class="slogan">售出{{item.virtual_sales}}</view>
								</view>
							</view>
						</view>
					

				</view>

			

			<!--  -->
			<!-- tabbar -->
			<view class="tab-bar">
				<tui-tabbar :tabBar="tabBar" unlined :hump="true" :current="current" @click="tabbarSwitch"></tui-tabbar>
			</view>

		
	</view>
</template>

<script>
	// 缓存最多页数
	const MAX_CACHE_PAGEINDEX = 3;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;
	var ttt = 0;
	//高德SDK
	import amap from '@/common/SDK/amap-wx.js';
	import uCatrgoty from '@/components/catrgory/catrgory.vue';

	export default {
		components: {
			uCatrgoty
		},
		data() {
			return {
				tabBars: [
					{
						name: '汽车用品',
						id: 'qiche'
					},
					{
						name: '汽车1',
						id: 'qiche1'
					},
					{
						name: '汽车',
						id: 'qiche2'
					},
					{
						name: '汽车',
						id: 'qiche3'
					},
					{
						name: '汽车',
						id: 'qiche4'
					},
					{
						name: '汽车',
						id: 'qiche'
					},
					
				],
				tabIndex: 0,
				scrollInto: '',
				current: 1,
				module_list: [],
				showHeader: true,
				afterHeaderOpacity: 1, //不透明度
				headerPosition: 'fixed',
				headerTop: 0,
				statusTop: 0,
				nVueTitle: 0,
				page: 1,
				is_no_more: false,
				city: '北京',
				currentSwiper: 0,
				// 轮播图片
				swiperList: [
					{
						pic_url: '/static/img/1.jpg'
					},
					{
						pic_url: '/static/img/2.jpg'
					},
					{
						pic_url: '/static/img/3.jpg'
					}
				],
				// 分类菜单
				categoryList: [
					{
						pic_url: '/static/img/category/1.png',
						name: '购物车',
						url: '/pages/cart/cart'
					},
					{
						pic_url: '/static/img/category/1.png',
						name: '分类',
						url: '/pages/cat/cat'
					},
					{
						pic_url: '/static/img/category/1.png',
						name: '领卷'
					},
					{
						pic_url: '/static/img/category/1.png',
						name: '入住商'
					}
				],
				// 广告图
				active_list: '/static/img/banner.jpg',
				Promotion: [],
				module_list: [],
				tabBar: [{
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
				],
				goods_list: [
					{
						pic_url: '/static/img/shop/1.jpg',
						name: '商品1测试',
						price: 100,
						virtual_sales: 100
					},
					{
						pic_url: '/static/img/shop/2.jpg',
						name: '风萧萧易水寒',
						price: 120,
						virtual_sales: 20
					},
					{
						pic_url: '/static/img/shop/3.jpg',
						name: '此情可待成追忆',
						price: 999,
						virtual_sales: 30
					},
					{
						pic_url: '/static/img/shop/4.jpg',
						name: '山高不可壮远',
						price: 80,
						virtual_sales: 60
					},
					{
						pic_url: '/static/img/shop/3.jpg',
						name: '飞流直下三千尺',
						price: 50,
						virtual_sales: 10
					},
					{
						pic_url: '/static/img/shop/1.jpg',
						name: '疑似黄河落九千',
						price: 100,
						virtual_sales: 50
					}
				]

			};
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
			this.getHomeGoods()
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			this.getHomeGoods()
		},


		onLoad() {
			// 请求首页数据
			this.getHomeGoods()

			this.amapPlugin = new amap.AMapWX({
				//高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
				key: '53113b6d174107300961cadb8e07e709'
			});
			//定位地址
			this.amapPlugin.getRegeo({
				success: (data) => {
					console.log(data);
					this.city = data[0].regeocodeData.addressComponent.city.replace(/市/g, ''); //把"市"去掉
				},
				fail: function(e) {
					console.log(e)
				}
			});

			//开启定时器
			this.Timer();
			//加载活动专区
			this.loadPromotion();
		},
		methods: {
			// 首页数据
			getHomeGoods() {
				var self = this;

				self.$request({
					url: self.$api.default.index
				}).then(res => {
					if (res.code == 0) {
						console.log(res);
						self.module_list = res.data.module_list
						// self.categoryList = res.data.nav_icon_list
						self.active_list = res.data.block_list[0].data.pic_list[0].pic_url
						self.productList = res.data.cat_list
						// self.tabBars = res.data.cat_list
					}

				})
			},

			//加载Promotion 并设定倒计时,,实际应用中应该是ajax加载此数据。
			loadPromotion() {
				let cutTime = new Date();
				let yy = cutTime.getFullYear(),
					mm = cutTime.getMonth() + 1,
					dd = cutTime.getDate();
				let tmpcountdown = yy + '/' + mm + '/' + dd + ' 23:59:59';
				let tmpPromotion = [{
						title: '整点秒杀',
						ad: '整天秒杀专区',
						img: '/static/img/s1.jpg',
						countdown: false
					},
					{
						title: '限时抢购',
						ad: '每天23点上线',
						img: '/static/img/s2.jpg',
						countdown: tmpcountdown
					} //countdown为目标时间，程序会获取当前时间倒数
				];
				//检查倒计时
				for (let i = 0; i < tmpPromotion.length; i++) {
					let row = tmpPromotion[i];
					if (row.countdown) {
						let h = '00',
							m = '00',
							s = '00';
						let currentTime = new Date();
						let cutoffTime = new Date(tmpcountdown);
						if (!(currentTime >= cutoffTime)) {
							let countTime = parseInt(
								(cutoffTime.getTime() - currentTime.getTime()) / 1000
							);
							h = parseInt(countTime / 3600);
							m = parseInt((countTime % 3600) / 60);
							s = countTime % 60;
							h = h < 10 ? '0' + h : h;
							m = m < 10 ? '0' + m : m;
							s = s < 10 ? '0' + s : s;
						}
						tmpPromotion[i].countdown = {
							h: h,
							m: m,
							s: s
						};
					}
				}
				this.Promotion = tmpPromotion;
			},


			//定时器
			Timer() {
				setInterval(() => {
					if (this.Promotion.length > 0) {
						for (let i = 0; i < this.Promotion.length; i++) {
							let row = this.Promotion[i];
							if (row.countdown) {
								if (
									!(
										row.countdown.h == 0 &&
										row.countdown.m == 0 &&
										row.countdown.s == 0
									)
								) {
									if (row.countdown.s > 0) {
										row.countdown.s--;
										row.countdown.s =
											row.countdown.s < 10 ?
											'0' + row.countdown.s :
											row.countdown.s;
									} else if (row.countdown.m > 0) {
										row.countdown.m--;
										row.countdown.m =
											row.countdown.m < 10 ?
											'0' + row.countdown.m :
											row.countdown.m;
										row.countdown.s = 59;
									} else if (row.countdown.h > 0) {
										row.countdown.h--;
										row.countdown.h =
											row.countdown.h < 10 ?
											'0' + row.countdown.h :
											row.countdown.h;
										row.countdown.m = 59;
										row.countdown.s = 59;
									}
									this.Promotion[i].countdown = row.countdown;
								}
							}
						}
					}
				}, 1000);
			},
			//消息列表
			toMsg() {
				uni.navigateTo({
					url: '/pages/msg/msg'
				})
			},
			//搜索跳转
			toSearch() {
				// uni.showToast({ title: '建议跳转到新页面做搜索功能' });
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			//轮播图跳转
			toSwiper(e) {
				uni.showToast({
					title: e.src,
					icon: 'none'
				});
			},
			//分类跳转
			classifyitme(e) {
				console.log(e);
				uni.navigateTo({
					url: e.url
				});

			},
			//推荐商品跳转
			toPromotion(e) {
				uni.showToast({
					title: e.title,
					icon: 'none'
				});
			},
			//商品跳转
			toGoods(e) {
				console.log(e);
				uni.navigateTo({
					url: '/pages/goods/goods?&cid=' + 2
				});
			},
			//轮播图指示器
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			},
			tabClick(e) {
				console.log(e);
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.switchTab(index);
			},

			switchTab(index) {
				console.log(index);
				this.tabIndex = index;
				let scrollIndex = index - 1 < 0 ? 0 : index - 1;
				console.log(scrollIndex);
				this.scrollInto = this.tabBars[scrollIndex].id;
			},
			tabbarSwitch(e) {
				this.current = e.index
				console.log(e.index);
				uni.navigateTo({
					url: e.pagePath
				})
			},
		}
	};
</script>
<style lang="scss">
	page {
		position: relative;
		background-color: #fff;
		padding-bottom: 80rpx;
	}

	@font-face {
		font-family: 'HMfont-home';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	.pullDown-effects {
		position: fixed;
		//top: calc(100rpx - 36vw);
		top: 0;
		z-index: 9;
		width: 100%;
		height: 36vw;
		/*  #ifdef  APP-PLUS  */
		padding-top: var(--status-bar-height);

		/*  #endif  */
		image {
			width: 100%;
			height: 36vw;
		}
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		top: 0;
		left: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 100rpx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		background-image: url('/static/img/home/header.png');

		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */

		.addr {
			width: 120rpx;
			height: 60rpx;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #fff;

			.icon {
				height: 60rpx;
				margin-right: 5rpx;
				display: flex;
				align-items: center;
				font-size: 42rpx;
				color: #fff;
			}
		}

		.input-box {
			width: 100%;
			height: 60rpx;
			background: rgba(0, 0, 0, 0.1);
			border-radius: 30rpx;
			position: relative;
			display: flex;
			align-items: center;

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				top: 0;
				right: 0;
				width: 60rpx;
				height: 60rpx;
				font-size: 34rpx;
				color: #fff;
			}

			input {
				padding-left: 28rpx;
				height: 28rpx;
				font-size: 28rpx;
			}
		}

		.icon-btn {
			width: 60rpx;
			height: 60rpx;
			flex-shrink: 0;
			display: flex;

			.icon {
				width: 60rpx;
				height: 60rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42rpx;
				color: #fff;
			}
		}
	}

	.place {
		height: 100rpx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.swiper {
		width: 100%;
		margin-top: 10rpx;
		display: flex;
		justify-content: center;

		.swiper-box {
			width: 92%;
			height: 30.7vw;

			overflow: hidden;
			border-radius: 15rpx;
			box-shadow: 0rpx 8rpx 25rpx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;

			swiper {
				width: 100%;
				height: 30.7vw;

				swiper-item {
					image {
						width: 100%;
						height: 30.7vw;
					}
				}
			}

			.indicator {
				position: absolute;
				bottom: 20rpx;
				left: 20rpx;
				background-color: rgba(255, 255, 255, 0.4);
				width: 150rpx;
				height: 5rpx;
				border-radius: 3rpx;
				overflow: hidden;
				display: flex;

				.dots {
					width: 0rpx;
					background-color: rgba(255, 255, 255, 1);
					transition: all 0.3s ease-out;

					&.on {
						width: (100%/3);
					}
				}
			}
		}
	}

	.category-list {
		width: 92%;
		margin: 0 4%;
		padding: 0 0 30rpx 0;
		border-bottom: solid 2rpx #f6f6f6;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.category {
			width: 25%;
			margin-top: 50rpx;
			display: flex;
			flex-wrap: wrap;

			.img {
				width: 100%;
				display: flex;
				justify-content: center;

				image {
					width: 9vw;
					height: 9vw;
				}
			}

			.text {
				margin-top: 16rpx;
				width: 100%;
				display: flex;
				justify-content: center;
				font-size: 24rpx;
				color: #3c3c3c;
			}
		}
	}

	.banner {
		width: 92%;
		margin: 40rpx 4%;

		image {
			width: 100%;
			height: 20vw;
			border-radius: 10vw;
			box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.3);
		}
	}

	.promotion {
		width: 92%;
		margin: 0 4%;

		.text {
			width: 100%;
			height: 60rpx;
			font-size: 34rpx;
			font-weight: 600;
			margin-top: -10rpx;
		}

		.list {
			width: 100%;
			display: flex;
			justify-content: space-between;

			.column {
				width: 43%;
				padding: 15rpx 3%;
				background-color: #ebf9f9;
				border-radius: 10rpx;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.top {
					width: 100%;
					height: 40rpx;
					display: flex;
					align-items: center;
					margin-bottom: 5rpx;

					.title {
						font-size: 30rpx;
					}

					.countdown {
						margin-left: 20rpx;
						display: flex;
						height: 40rpx;
						display: flex;
						align-items: center;
						font-size: 20rpx;

						view {
							height: 30rpx;
							background-color: #f06c7a;
							display: flex;
							justify-content: center;
							align-items: center;
							color: #fff;
							border-radius: 4rpx;
							margin: 0 4rpx;
							padding: 0 2rpx;
						}
					}
				}

				.left {
					width: 50%;
					height: 18.86vw;
					display: flex;
					flex-wrap: wrap;
					align-content: space-between;

					.ad {
						margin-top: 5rpx;
						width: 100%;
						font-size: 22rpx;
						color: #acb0b0;
					}

					.into {
						width: 100%;
						font-size: 24rpx;
						color: #aaa;
						margin-bottom: 5rpx;
					}
				}

				.right {
					width: 18.86vw;
					height: 18.86vw;

					image {
						width: 18.86vw;
						height: 18.86vw;
					}
				}
			}
		}
	}

	.goods-list {

		// background-color: #f4f4f4;
		.title {
			width: 90%;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			height: 80rpx;
			color: #3B3B3B;
			font-size: 30rpx;
			margin-top: 10rpx;
			border: none;
			position: relative;
			margin: 0 auto;

			image {
				width: 30rpx;
				height: 30rpx;
			}

			.tab-bar {
				width: 94%;

			}
		}

		.loading-text {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60rpx;
			color: #979797;
			font-size: 24rpx;
		}

		.product-list {
			width: 92%;
			padding: 0 4% 3vw 4%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.product {
				width: 48%;
				border-radius: 20rpx;
				background-color: #fff;
				margin: 0 0 15rpx 0;
				box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);

				image {
					width: 100%;
					height: 320rpx;
					border-radius: 20rpx 20rpx 0 0;
				}

				.name {
					width: 92%;
					padding: 8rpx 4%;
					height: 75rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30rpx;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10rpx 4% 10rpx 4%;

					.price {
						font-size: 15pt;
						font-weight: 600;
						color: #BC1111;
					}

					.slogan {
						color: #807c87;
						font-size: 24rpx;
					}
				}
			}
		}
	}

	.tui-scroll-h {
		height: 100rpx;
		background-color: #ffffff;
		flex-direction: row;
		white-space: nowrap;
	}


	.tui-tab-item {
		display: inline-block;
		flex-wrap: nowrap;
		padding-left: 34rpx;
		padding-right: 34rpx;
	}

	.tui-tab-item-title {
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex-wrap: nowrap;
	}

	.tui-tab-item-title-active {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		color: #007AFF;
		border-bottom: 3px solid #007AFF;
	}
</style>
