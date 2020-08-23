<template>
	<view>
		<!-- 头部 -->
		<view class="header">
			<!-- 头部站位 -->
			<view class="headers"></view>
			<view class="search">
				<tui-navigation-bar :isFixed="false" splitLine backgroundColor="255,255,255" color="#fff">
					<view class="flex">
						<view class="tui-avatar-box" @tap="back">
							<view class="" style="padding-top: 20rpx;">
								<tui-icon name="arrowleft" :size="30" color="#fff"></tui-icon>
							</view>
						</view>
						<view class="tui-search-box">
							文章列表
						</view>
					</view>
				</tui-navigation-bar>
			</view>
		</view>
		<!-- nav导航 -->
		<view class="nav flex flex-x-center">
			<view class="nav_item" v-for="(item, index) in tabBars" :key="item.id" @click="navClick(index)">
				<text :class="tabIndex == index? 'item_active': ''">{{item.name}}</text>
			</view>
		</view>
		
		<!-- 维修案列 -->
		<view class="maintain">
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollInto: '',
				tabIndex: 0,
				tabBars: [
					{
						name: '热门',
						id: 'hot'
					},
					{
						name: '娱乐',
						id: 'yule'
					},
					{
						name: '体育',
						id: 'sports'
					},
					{
						name: '国内',
						id: 'domestic'
					},
					{
						name: '财经',
						id: 'finance'
					},
					{
						name: '科技',
						id: 'keji'
					},
					{
						name: '教育',
						id: 'education'
					},
					{
						name: '汽车',
						id: 'car'
					}
				],		
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
			}
		},
		methods: {
			navClick(index) {
				this.tabIndex = index;
			},
			back() {
				uni.navigateBack()
			},
			
		}
	}
</script>

<style scoped lang="scss">
.header {
		box-sizing: border-box;
		background-size: 100%;
		background-repeat: no-repeat;
		background-image: url('/static/img/home/header.png');
		display: flex;
		align-items: center;
		justify-content: center;
		.headers {
			height: var(--status-bar-height);
		}
		.search {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			.tui-avatar-box {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			left: 5;
		
		}
		
		.tui-search-box {
			flex: 1;
			height: 80rpx;
			border-radius: 30rpx;
			font-size: 13pt;
			box-sizing: border-box;
			color: #fff;
			display: flex;
			justify-content: center;
			text-align: center;
			align-items: center;
		
		}
		}
		
	}
	.nav {
		width: 100%;
		height: 80rpx;
		background-color: #eee;
			.nav_item {
				flex: 1;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 11pt;
				text-align: center;
			}
			.item_active {
				color: #134AFF;
				font-size: 13pt;
				padding-bottom: 10rpx;
				border-bottom: 5rpx solid #134AFF;
			}
	}
	.tui-tabs {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		height: 90rpx;
		background-color: #fafafa;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
		
			.tui-scroll-h {
				width: 750rpx;
				height: 90rpx;
				background-color: #ffffff;
				flex-direction: row;
				/* #ifndef APP-PLUS */
				white-space: nowrap;
				/* #endif */
				/* #ifdef H5 */
				position: fixed;
				top: 44px;
				left: 0;
				z-index:999;
				/* #endif */
			}
			
			.tui-line-h {
				/* #ifdef APP-PLUS */
				height: 1rpx;
				background-color: #cccccc;
				/* #endif */
				position: relative;
			}
			/* #ifndef APP-PLUS*/
			.tui-line-h::after {
				content: '';
				position: absolute;
				border-bottom: 1rpx solid #cccccc;
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
				bottom: 0;
				right: 0;
				left: 0;
			}
			/* #endif */
			
			.tui-tab-item {
				/* #ifndef APP-PLUS */
				display: inline-block;
				/* #endif */
				flex-wrap: nowrap;
				padding-left: 34rpx;
				padding-right: 34rpx;
			}
			
			.tui-tab-item-title {
				color: #555;
				font-size: 30rpx;
				height: 80rpx;
				line-height: 80rpx;
				flex-wrap: nowrap;
				/* #ifndef APP-PLUS */
				white-space: nowrap;
				/* #endif */
			}
			
			.tui-tab-item-title-active {
				color: #5677fc;
				font-size: 36rpx;
				font-weight: bold;
				border-bottom: 6rpx solid #5677fc;
				text-align: center;
			}
	}
	.maintain {
		width: 100%;
		margin:  10rpx auto;
		
		box-sizing: border-box;
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
	
</style>
