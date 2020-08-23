<template>
	<view>
		<!-- 头部 -->
		<view class="header">
			<!-- 搜索 -->
			<view class="search">
				<tui-navigation-bar :isFixed="false" splitLine backgroundColor="255,255,255" color="#fff">
					<view class="flex">
						<view class="tui-avatar-box">
							<tui-icon name="position" :size="22" color="#fff"></tui-icon>
							<view class="flex flex-y-center">
								{{city}}
								<tui-icon name="turningdown" :size="25" color="#fff"></tui-icon>
							</view>
						</view>
						<view class="tui-search-box" @tap="goSerach">
							<tui-icon name="search-2" :size="18" color="#fff"></tui-icon>
							<input type="text" value="" placeholder-style="color: #fff; 
												   font-size: 10pt;" placeholder="请输入搜索内容">
							</input>
						</view>
						<view class="tui-notice-box">
							<image src="/static/img/home/service.png" mode=""></image>
						</view>
					</view>
				</tui-navigation-bar>
			</view>
			<!-- 站位 -->
			<view class="headers">
				
			</view>
			<!-- 轮播 -->
			<view class="banner" style="overflow: hidden;">
				 <container :swiperList="banner" ></container>
			</view>
		</view>
		<!-- 主体内容 -->
		<view class="content">
			<!-- 查询模块 -->
			<view class="inquire">
				<view style="box-shadow: 10rpx 10rpx 20rpx #BEBDC0;">
					<view class="top flex ">
						<view :class="iqeIndex == index? 'item-active' : ''" v-for="(item, index) in inquire" :key="index" @tap="inquireItem(index)">
							<block v-if="iqeIndex == index">
								<image :src="item.imgactive" mode=""></image>
							</block>
							<block v-else>
								<image :src="item.icon" mode=""></image>
							</block>
							<text>{{item.name}}</text>
						</view>
					</view>
					<view class="content">
						<view class="" @click="scanQR">
							<input type="text" value=""  placeholder="请输入车架号查询" /> 
							<image src="/static/img/home/seaarch-car.png" mode=""></image>
							<view class="badge" >
								拍照查询
							</view>
						</view>
					</view>
				</view>
				<view class="btn">
					立即查询
				</view>
			</view>
			<!-- nav导航 -->
			<view class="nav">
				<u-catrgoty :cateList="categoryList"  @classifyitme="classifyitme" />
			</view>
			<!-- 维修案列 -->
			<view class="maintain">
				<view class="top flex">
					<view style="font-weight: 600;">
						维修案列
					</view>
					<view class="" @click="more">
						更多
						<tui-icon name="arrowright" :size="20" color="C7C7C7"></tui-icon>
					</view>
				</view>
				<view class="conter">
					<view class="item flex" v-for="(item, index) in caseList" :key="index" @click="goArticle(item)">
						<view class="left" :class="index == caseList.length-1? 'nobor': ''">
							<view class="">
								{{item.title}}
							</view>
							<view class="flex">
								<text>{{item.time}}</text>
								<text style="padding-left: 30rpx;">阅读：{{item.sum}}</text>
							</view>
						</view>
						<view class="right">
							<image :src="item.pic_url" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<!-- 商城热卖 -->
			<view class="shop-rec">
				<view class="top flex">
					<view style="font-weight: 600;">
							商城热卖
					</view>
					<view class="">
							更多
						<tui-icon name="arrowright" :size="20"></tui-icon>
					</view>
				</view>
				<view class="shop">
					<view class="item flex" v-for="(item, index) in shopList" :key='index'>
						<view class="left">
							<image :src="item.pic_url" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="name">
								{{item.name}}
							</view>
							<view class="">
								<view class="coupon">
									<text v-for="(i, index) in item.counpn">{{i}}</text>
								</view>
								<view class="price flex flex-y-center">
									<view style="font-size: 9pt;">
										¥	<text style="
													color: #C80808;
													 padding-left: 6rpx;
													font-weight: 600; 
													font-size: 14pt;"
													>{{item.price}}
											</text>
									</view>
									<view class="">
										<tui-icon name="immore" :size="20" color="#BB0F0F" bold></tui-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- tabbar -->
		
			<tui-tabbar :tabBar="tabBar"   unlined :hump="true" :current="current" @click="tabbarSwitch"></tui-tabbar>
		
	
	</view>
</template>

<script>
	//高德SDK
	import amap from '@/common/SDK/amap-wx.js';
	import container from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	import uCatrgoty from '@/components/catrgory/catrgory.vue';
	export default {
		components: {
			container,
			uCatrgoty
		},
		data() {
			return {
				opcity: 0.85,
				city: '北京市',
				iqeIndex:0,
				mode: 'round',
				current: '',
				length: '',
				banner:  [
					{img: '/static/img/1.jpg'},
					{img: '/static/img/2.jpg'},
					{img: '/static/img/3.jpg'},
					],
				current: 0,
				inquire: [
						{
							'name': '油品查询',
							'icon': '/static/img/home/inquire01.png',
							'imgactive': '/static/img/home/inquire01-active.png'
						},
						{
							'name': '车型查询',
							'icon': '/static/img/home/inquire01.png',
							'imgactive': '/static/img/home/inquire01-active.png'
						},
				],
				// 分类数据
				categoryList:  [{
						id: 1,
						name: '维修案列',
						pic_url: '/static/img/home/case.png',
						
					},
					{
						id: 2,
						name: '在线商城',
						pic_url: '/static/img/home/shop.png',
						url:'/pages/mall-index/mall-index'
					},
					{
						id: 3,
						name: '促销活动',
						pic_url: '/static/img/home/activity.png',
					},
					{
						id: 4,
						name: '在线预约',
						pic_url: '/static/img/home/appointment.png',
					},
					{
						id: 5,
						name: '服务地点',
						pic_url: '/static/img/home/branch.png',
						url:'/pages/serve-branch/serve-branch'
					},
					{
						id: 6,
						name: '安装维修',
						pic_url: '/static/img/home/maintain.png',
					},
					{
						id: 7,
						name: '技术培训',
						pic_url: '/static/img/home/skill.png',
						url: '/pages/technology/technology'
					},
					{
						id: 8,
						name: '加盟合作',
						pic_url: '/static/img/home/join.png',
						url: '/pages/to-join/to-join'
					}
				],
				// 维修案列数据
				caseList : [
					{
						'title':"自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障",
						'time': '今天',
						'sum': 2876,
						'pic_url': '/static/img/im/face/face_1.jpg',
						'url':'/pages/article-de/article-de'
					},
					{
						'title':"自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障",
						'time': '今天',
						'sum': 2876,
						'pic_url': '/static/img/im/face/face_3.jpg'
					},
					{
						'title':"自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障",
						'time': '今天',
						'sum': 2876,
						'pic_url': '/static/img/im/face/face_4.jpg'
					},
					{
						'title':"自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障自动变速箱异响熄火等常见故障",
						'time': '今天',
						'sum': 2876,
						'pic_url': '/static/img/im/face/face_2.jpg'
					}
				],
				// 商城热卖数据
				shopList: [
					{
						'pic_url':'/static/img/shop/1.jpg',
						'name' : '壳牌超凡喜力CSL全合成机油',
						'counpn': ['卷','抢购'],
						'price' : 599,
					},
					{
						'pic_url':'/static/img/shop/1.jpg',
						'name' : '壳牌超凡喜力CSL全合成机油',
						'counpn': ['卷','抢购'],
						'price' : 599,
					},
					{
						'pic_url':'/static/img/shop/1.jpg',
						'name' : '壳牌超凡喜力CSL全合成机油',
						'counpn': ['卷','抢购'],
						'price' : 599,
					},
					{
						'pic_url':'/static/img/shop/1.jpg',
						'name' : '壳牌超凡喜力CSL全合成机油',
						'counpn': ['卷','抢购'],
						'price' : 599,
					},
					
				],
				
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
		onLoad: function() {
			this.current = 0;
			this.amapPlugin = new amap.AMapWX({
				//高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
				key: '53113b6d174107300961cadb8e07e709'
			});
			//定位地址
			this.amapPlugin.getRegeo({
				success: data => {
					this.city = data[0].regeocodeData.addressComponent.city;
					// // #ifdef APP-PLUS
					// this.nVueTitle.postMessage({
					// 	type: 'location',
					// 	city: this.city
					// });
					// // #endif
				}
			});
		},
		onShow:function(){
			this.current = 0;
		},
		methods: {
			change: function(e) {
				console.log(e);
				this.current = e.detail.current;
			},
			inquireItem:function(index) {
				this.iqeIndex = index;
			},
			classifyitme(e) {
				console.log(e);
				if(e.name == "在线商城") {
					uni.switchTab({
						url:e.url
					})
				}
				uni.navigateTo({
					url:e.url
				})
			},
			goArticle(item) {
				console.log(item);
				uni.navigateTo({
					url:item.url
				})
			},
			// 文章更多
			more(){
				uni.navigateTo({
					url:'/pages/paper-list/paper-list'
				})
			},
			// 扫码
			scanQR() {
				uni.chooseImage({
				    count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择,拍照
				    success:(res) => {
						// 上传的图片地址
						console.log(res);
						uni.showLoading({
							title:'识别中'
						})
						uni.uploadFile({
							url: this.$api.default.upload_image,
							filePath:res.tempFilePaths[0],
							name: 'image',
						    success: (res) => {
						        console.log(JSON.parse(res.data));
								let data = JSON.parse(res.data);
								if(data.code == 0) {
									uni.hideLoading()
								}
						    },
							fail: (err) => {
								console.log(err);
							}
						});
				    }
				});
			},
			goSerach(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			tabbarSwitch(e) {
				this.current = e.index
				console.log(e.index);
				uni.navigateTo({
					url:e.pagePath
				})
			},
		},
	}
</script>

<style scoped lang="scss">
	$boxShow: 0rpx 6rpx 10rpx #BEBDC0;
	
	.header {
		padding-top: 10rpx;
		box-sizing: border-box;
		height: 480rpx;
		background-size: 100%;
		background-repeat: no-repeat;
		background-image: url('/static/img/home/header.png');
		background-color: #eee;
		.headers {
			width: 100%;
			height: var(--status-bar-height);
		}
		.search {
			width: 100%;
			// position: absolute;
			// top: 0;
			// left: 0;
			padding-left: 10rpx;
			padding-right: 20rpx;
			box-sizing: border-box;
		}

		.banner {
			width: 94%;
			margin: 20rpx auto;
			//#ifdef H5
				margin-top: 100rpx;
			//#endif
			// margin-top: 200rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			box-shadow: 0rpx 4rpx 4rpx #B1B0B5;
				image {
					border-radius: 20rpx;
				}

		}
	}
	
	.content {
		width: 100%;
		height: 100%;
		background-color: #eee;
		margin: 0 auto;
		padding-top: 12%;
		box-sizing: border-box;
		padding-bottom: 80rpx;
			.inquire {
				width: 94%;
				height:300rpx;
				margin: 0 auto;
				background-color: #fff;
				border-radius: 10rpx;
				box-sizing: border-box;
				position: relative;
					.top {
						width: 100%;
						height: 100rpx;
						border-bottom: 1px solid #eee;
						border-top-left-radius: 20rpx;
						border-top-right-radius: 20rpx;
							view {
								text-align: center;
								font-size: 11pt;
								flex: 1;
								line-height: 100rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								border-right: 16rpx solid #F7F7F7;
									image {
										width: 60rpx;
										height: 60rpx;
										border-radius: 50%;
										margin-right: 10rpx;
									}
							}
							view:first-child{
								border-top-left-radius: 10rpx;
							}
							view:last-child {
								border-top-right-radius: 10rpx;
								border-right: none;
							}
							.item-active {
								color: #fff;
								background-color: #0293EB;
							}
					}
					.content {
						width: 100%;
						height: 250rpx;
						background-color: #fff;
						border-bottom-left-radius: 10rpx;
						border-bottom-right-radius: 10rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						padding: 0;
							view {
								width: 94%;
								position: relative;
									input {
										background-color: #E5E5E5;
										height: 80rpx;
										border-radius: 30rpx;
										padding-left: 20rpx;
											
									}
									image {
										width: 50rpx;
										height: 50rpx;
										position: absolute;
										right: 5%;
										top: 50%;
										transform: translateY(-50%);
									}
									.badge {
										width: 130rpx;
										font-size: 8pt;
										border-radius: 25rpx;
										text-align: center;
										color: #fff;
										background-image: linear-gradient(to right ,#F98A3B, #FB311A);
										position: absolute;
										right: 10%;
										top: 5rpx;
									}
							}
					}
					.btn {
						width: 50%;
						height: 100rpx;
						color: #FFFFFF;
						text-align: center;
						line-height: 100rpx;
						font-size: 12pt;
						border-radius: 50rpx;
						background-color: #0293EB;
						position: absolute;
						left: 50%;
						top: 100%;
						transform: translateX(-50%);
					}
			}
			.nav {
				width: 94%;
				margin: 20rpx auto;
				margin-top: 130rpx;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				box-shadow: $boxShow;
			}
			.maintain {
				width: 100%;
				margin:  20rpx auto;
				margin-top: 50rpx;
				box-sizing: border-box;
					.top {
						padding-left: 20rpx;
							view:first-child {
								padding-left: 10rpx;
								border-left: 4px solid #134AFF;
							}
							view:last-child {
								display: flex;
								color: #C7C7C7;
								margin-left: auto;
							}
					}
					.conter {
						background-color: #FFFFFF;
						margin-top: 20rpx;
						box-shadow: 0rpx 4rpx 1px #CECECE;
							.item {
								width: 100%;
								height: 200rpx;
								padding: 20rpx;
								box-sizing: border-box;
									.nobor {
										border-bottom: none !important;
									}
									.left {
										width: 80%;
										border-bottom: 1px solid #EEEEEE;
											view:first-child {
												width: 100%;
												height: 90rpx;
												font-size: 12pt;
												font-weight: 600;
												overflow: hidden;
												text-overflow: ellipsis;
												display: -webkit-box;
												-webkit-line-clamp: 2;
												-webkit-box-orient: vertical;
											}
											view:last-child {
												color: #C8C8C8;
												width: 100%;
												height: 60rpx;
												font-size: 10pt;
												margin-top: 6%;
											}
									}
									.right {
										width: 30%;
										padding-left: 20rpx;
										display: flex;
										justify-content: center;
										align-items: center;
											image {
												width: 100%;
												height: 100%;
												border-radius: 10rpx;
											}
									}
							}
					}
			}
			
			.shop-rec {
				width: 98%;
				padding: 10rpx;
				margin:  20rpx auto;
				box-sizing: border-box;
					.top {
						view:first-child {
							border-left: 4px solid #134AFF;
							padding-left: 10rpx;
						}
						view:last-child {
							display: flex;
							color: #CBCBCB;
							margin-left: auto;
						}
					}
					.shop {
						margin-top: 20rpx;
						width: 100%;
						
							.item {
								width: 98%;
								height: 230rpx;
								padding: 20rpx;
								box-sizing: border-box;
								border-radius: 20rpx;
								background-color: #FFFFFF;
								box-shadow: 0rpx 2rpx 4rpx #ADADAD;
								margin: 0 auto;
								margin-top: 20rpx;
									.left {
										width: 30%;
										border-radius: 20rpx;
											image {
												width: 100%;
												height: 100%;
												border-radius: 20rpx;
											}
									}
									.right {
										width: 60%;
										padding-left: 20rpx;
										.name {
											width: 100%;
											height: 50rpx;
											font-size: 12pt;
											font-weight: 600;
											margin-bottom: 5%;
											display: -webkit-box;
											flex-wrap: nowrap;
											overflow: hidden;
											text-overflow: ellipsis;
											-webkit-line-clamp: 1;
											-webkit-box-orient: vertical;
										}
										view:last-child {
											width: 100%;
											height: 60%;
											
											view {
												margin: 0;
											}
											.coupon {
												height: 50%;
												text {
													width: 100%;
													border-radius: 10rpx;
													padding-left: 10rpx;
													padding-right: 10rpx;
													margin-right: 10rpx;
													font-size: 10pt;
													border: 1px solid #BB0F0F;
												}
											}
											.price {
												height: 50%;
												margin-top: 2%;
												view {
													flex: 1;
													height: 100%;
												}
												view:last-child {
													margin-left: auto;
													text-align: right;
												}
											}
										}
									}
							}
					}
					
			}
			
	
	}
	.tui-content-box {
		width: 100%;
		height: 88rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;

	}

	.tui-avatar-box {

		height: 60rpx;
		padding-left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;

		view {
			width: 80%;
			padding-left: 10rpx;
			color: #fff;
		}
	}

	.tui-avatar {
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
	}

	.tui-search-box {
		height: 80rpx;
		margin: 0 28rpx;
		border-radius: 30rpx;
		font-size: 10pt;
		background: rgba(0,0,0,0.1);
		padding: 0 22rpx;
		box-sizing: border-box;
		color: #fff;
		display: flex;
		align-items: center;

		input {
			margin-left: 10rpx;
		}
	}

	.tui-bg-white {
		background-color: #ffffff !important;
	}

	.tui-search-text {
		padding-left: 10rpx;
	}

	.tui-notice-box {
		width: 80rpx;
		padding: 10rpx;
		position: relative;
			image {
				width: 100%;
				height: 100%;
			}
	}
</style>
