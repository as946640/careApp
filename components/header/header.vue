<template>
	<view>
		<view class="header flex flex-y-center">
			<!-- 搜索 -->
			<view class="search">
				<tui-navigation-bar :isFixed="false" splitLine backgroundColor="255,255,255" color="#fff">
					<view class="flex">
						<slot name="left"></slot>
						<slot name="content"></slot>
						<slot name="right"></slot>
					</view>
				</tui-navigation-bar>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'header',
		props: {
			
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.header {
		padding-top: 10rpx;
		box-sizing: border-box;
		height: 420rpx;
		background-size: 100%;
		background-repeat: no-repeat;
		background-image: url('/static/img/home/header.png');

		.search {
			width: 100%;
			position: absolute;
			top: 20rpx;
			left: 0;
			padding-left: 10rpx;
			padding-right: 20rpx;
			box-sizing: border-box;
		}
	}
</style>
