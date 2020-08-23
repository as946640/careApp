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
							技术培训
						</view>
						
					</view>
				</tui-navigation-bar>
			</view>
		</view>
		<!-- 主体内容 -->
		<view class="content">
			<view class="item flex" v-for="(item, index) in technolog" :key="index">
				<view class="left">
					<image :src="item.pic" mode="aspectFill"></image>
					<view class="charge" v-if="item.shouf">
						收费
					</view>
					<view class="charge" v-else>
						免费
					</view>
				</view>
				<view class="right">
					<view class="title">
					{{item.titile}}
					</view>
					<view class="name">
						<view class="" style="padding-top: 10rpx;">
							<text> {{item.name}}</text>
							<text>{{item.gs}}</text>
						</view>
						<view class="flex flex-y-center" style="padding-top: 10rpx;">
							<view class="flex flex-y-center">
								<image src="/static/img/thechnology/eye.png" mode=""></image>
								<text style="padding-left: 5rpx;">{{item.num}}人/次</text>
							</view>
							<text>{{item.fens}}分</text>
						</view>
					</view>
					<view class="bottom flex flex-y-center">
						<view class="">
							修车手法
						</view>
						<view class="">
							修车手法
						</view>
						<view class="">
							修车手法
						</view>
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
				currentTab: 0,
				tabIndex: 0,
				scrollInto: '',
				scrollTop: 0,
				indexList: [],
				tabBars: [{
						'id': 'chexing',
						'name': '按车型'
					},
					{
						'id': 'ma',
						'name': 'VIN码'
					},
					{
						'id': 'OEbh',
						'name': 'OE编号'
					},
					{
						'id': 'biahao',
						'name': '编号'
					},
					{
						'id': 'faxian',
						'name': '发现'
					},
					{
						'id': 'bieke',
						'name': '别克'
					}
				],
				technolog : [
					{
						pic:'/static/img/shop/3.jpg',
						titile: '修车课程第一期：教你如何修车怎么样修车撒大苏打实打实大苏实打实打算打',
						name: '胡泽文',
						gs: '汽车科技有限公司',
						num: '10万',
						fens: '4.9',
						shouf: true
					},
					{
						pic:'/static/img/shop/3.jpg',
						titile: '修车课程第一期：教你如何修车怎么样修车撒大苏打实打实大苏打',
						name: '胡泽文',
						gs: '汽车科技有限公司',
						num: '10万',
						fens: '4.9',
						shouf: false
					},
					{
						pic:'/static/img/shop/1.jpg',
						titile: '修车课程第一期：教你如何修车怎么样修车撒大苏打实打实大苏打',
						name: '胡泽文',
						gs: '汽车科技有限公司',
						num: '10万',
						fens: '4.9',
						shouf: true
					},
					{
						pic:'/static/img/shop/1.jpg',
						titile: '修车课程第一期：教你如何修车怎么样修车撒大苏打实打实大苏打',
						name: '胡泽文',
						gs: '汽车科技有限公司',
						num: '10万',
						fens: '4.9',
						shouf: false
					}
				]
			}
		},
		methods: {
			tabClick(e) {
				console.log(e);
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.switchTab(index);
			},
			switchTab(index) {
				this.tabIndex = index;
				let scrollIndex = index - 1 < 0 ? 0 : index - 1;
				this.scrollInto = this.tabBars[scrollIndex].id;
			},
			back() {
				uni.navigateBack()
			},
		}
	}
</script>

<style scoped lang="scss">
	.header {
		padding: 10rpx;
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
			padding-left: 10rpx;
			padding-right: 20rpx;
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
			padding: 0 22rpx;
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
		height: 100rpx;
		// 分类导航
		.tui-scroll-h {
			width: 750rpx;
			height: 100rpx;
			background-color: #ffffff;
			flex-direction: row;
			/* #ifndef APP-PLUS */
			white-space: nowrap;
			/* #endif */
			/* #ifdef H5 */
			position: absolute;
			z-index: 1;
			/* #endif */
			display: flex;
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
			width: 18%;
			text-align: center;
			
		}
		
		.tui-tab-item-title {
			font-size: 10pt;
			height: 80rpx;
			line-height: 80rpx;
			flex-wrap: nowrap;
			/* #ifndef APP-PLUS */
			white-space: nowrap;
			/* #endif */
		}
		
		.tui-tab-item-title-active {
			font-size: 12pt;
			font-weight: bold;
			text-align: center;
			color: #0293EB;
			border-bottom: 3px solid #0293EB;
		}
	}
	.content {
		border-top: 20rpx solid #F7F7F7;
		background-color: #fff;
		.item{
			width: 94%;	
			margin: 20rpx auto;
			box-sizing: border-box;
				.left {
					width: 30%;
					padding: 10rpx;
					position: relative;
					image {
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
					.charge {
						position: absolute;
						left: 10rpx;
						bottom: 10rpx;
						width: 100rpx;
						font-size: 7pt;
						padding-right: 6rpx;
						text-align: center;
						color: #fff;
						background: rgba(0,0,0,0.5);
						border-top-right-radius: 100rpx;
						border-bottom-left-radius: 10rpx;
						box-sizing: border-box;
					}
				}
				.right {
					padding: 10rpx;
					width: 70%;
					box-sizing: border-box;
						.title {
							width: 100%;
							height: 80rpx;
							color: #000;
							font-size: 11pt;
							font-weight: 600;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						.name {
							font-size: 10pt;
							color: #808080;
							margin: 10rpx 0;
							view:first-child {
								text:last-child {
									padding-left: 20rpx;
									
								}
							}
							view:last-child {
								view {
									image {
										width: 30rpx;
										height: 30rpx;
									}
								}
								text:last-child {
									padding-left: 20rpx;
								}
							}
						}
						.bottom {
							width: 100%;
							view {
								font-size: 9pt;
								color: #fff;
								background-color: #0293EB;
								padding: 6rpx 20rpx;
								margin-right: 10rpx;
								border-radius: 50rpx;
							}
						}
				}
		}
	}





</style>
