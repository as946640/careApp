<template>
	<view class="page">
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
							网点详情
						</view>
						
					</view>
				</tui-navigation-bar>
			</view>
			<!-- 网点卡片 -->
			<view class="branch-item">
				<view class="name">
					<tui-icon name="shop-fill" :size="40" color="#134AFF"></tui-icon>
					<view class="">
						<text>广州市白云区汽车维护服务地点</text>
					</view>
				</view>
				<view class="branch-img">
					<image src="/static/img/shop/1.jpg" mode="aspectFill"></image>
				</view>
				<view class="time">
					<view style="font-size: 12pt;">
						时间
					</view>
					<view style="color: #717171;">
						<text>工作日：8：30至16：00</text>
						<text>周末及假期：8：30至11：00</text>
					</view>
				</view>
				<view class="time">
					<view style="font-size: 12pt;">
						地址
					</view>
					<view style="color: #717171;">
						<text>广州市白云机场路3698号</text>
					</view>
				</view>
				<view class="lianxi flex">
					<view class="item">
						<tui-icon name="position" :size="15" color="#134AFF" />路线
					</view>
					<view class="item">
						<tui-icon name="voipphone" :size="15" color="#134AFF" />电话
					</view>
					<view class="item">
						<tui-icon name="voipphone" :size="15" color="#134AFF" />电话
					</view>
				</view>
				<view class="shoc">
					收藏网点
				</view>
			
			</view>
		
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},
		}
	}
</script>

<style scoped lang="scss">
.page {
	background-color: #EEEEEE;
	height: 100vh;
}
.header {
		padding: 10rpx;
		height: 550rpx;
		box-sizing: border-box;
		background-size: 100%;
		background-repeat: no-repeat;
		background-image: url('/static/img/home/header.png');
		.headers {
			height: var(--status-bar-height);
		}
		.search {
			width: 100%;
			padding-left: 10rpx;
			padding-right: 20rpx;
			box-sizing: border-box;
			
				.tui-avatar-box {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
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
			align-items: center;
		
		}
		}
		.branch-item {
			width: 94%;
			background-color: #FFFFFF;
			margin: 0 auto;
			border-radius: 20rpx;
			text-align: center;
			padding: 40rpx 100rpx;
			box-sizing: border-box;
			box-shadow: 0rpx 8rpx 10rpx #C4C3C3;
				.name {
					font-size: 12pt;
					font-weight: 600;
				}
				.branch-img {
					width: 100%;
					height: 300rpx;
					margin: 40rpx auto;
					border-radius: 10rpx;
						image {
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}
				}
				.time {
					font-size: 9pt;
					text-align: center;
					padding-bottom: 20rpx;
				}
				.lianxi {
					margin-top: 20rpx;
					padding-top: 10rpx;
					border-top: 1px solid #eee;
					font-size: 10pt;
						.item {
							padding: 10rpx;
							color: #134AFF;
							flex: 1;
							border-right: 1px solid #eee;
						}
						.item:last-child {
							border-right: none;
						}
				}
				.shoc {
					color: #134AFF;
					border: 1px solid #134AFF;
					margin: 50rpx auto;
					margin-bottom: 10rpx;
					border-radius: 50rpx;
					padding: 20rpx 0;
				}
		}
	}
	
</style>
