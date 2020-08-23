<template>
	<view class="page">
		<!-- 头部 -->
		<view class="header">
			<!-- 头部站位 -->
			<view class="headers"></view>
			<view class="search">
				<tui-navigation-bar :isFixed="false" splitLine backgroundColor="255,255,255" color="#fff">
					<view class="flex">
						<view class="tui-avatar-box">
							<view class="" style="padding-top: 20rpx;">
								<tui-icon name="position" :size="28" color="#fff"></tui-icon>
							</view>
						</view>
						<view class="tui-search-box">
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
		</view>
		<!-- 分类导航 -->

		<scroll-view class="scrollList" ref="scrool"  scroll-y scroll-with-animation :scroll-into-view="scrollViewId" :style="{height:winHeight+'px'}">

			<view v-if="!inputVal">
				<view class="hot-city">
					<view class="title" style="font-size: 20pt; color: #000000;">热门品牌</view>
					<view class="city-names">
						<view class="item" v-for="(item,index) in hotCity" :key="index" @click="cityClick(item)">
							<view class="item_img">
								<image :src="item.pic" mode=""></image>
							</view>
							<text>{{item.name}}</text>
						</view>
					</view>
				</view>
				<view class="tui-list city-list">
					<block v-for="(list,index) in lists" :key="index" v-if="list.data[0]">
						<view class="tui-list-cell-divider" :id="index === 0 ? 'suoyin' : list.letter">
							{{list.letter}}
						</view>
						<view class="tui-list-cell" hover-class="tui-list-cell-hover" v-for="(item,index2) in list.data" :key="index2"
						 @tap="selectCity" :data-name="item.cityName" :hover-stay-time='150'>
							<view class="tui-list-cell-navigate flex flex flex-y-center" :class="[list.data.length-1==index?'last':'']">
								<view class="cell_img">
									<image :src="item.pic" mode=""></image>
								</view>

								<text style=" padding-left: 20rpx;">{{item.name}}</text>
							</view>
						</view>
					</block>
				</view>
			</view>
		</scroll-view>
		<view class="tui-indexed-list-bar" :style="{height:indexBarHeight+'px'}" @touchstart="touchStart" @touchmove.stop="touchMove"
		 @touchend.stop="touchEnd" @touchcancel.stop="touchCancel" v-if="!inputVal">
			<text v-for="(items,index) in lists"  :key="index" class="tui-indexed-list-text" :style="{height:indexBarItemHeight+'px'}">
				{{items.letter}}
			</text>
		</view>
		<view class="tui-indexed-list-alert" v-if="touchmove && lists[touchmoveIndex].letter">
			{{lists[touchmoveIndex].letter}}
		</view>
	</view>
</template>

<script>
	const cityData = require('@/data/data.js')
	export default {
		data() {
			return {
				lists: [],
				touchmove: false, // 是否在索引表上滑动
				touchmoveIndex: -1,
				titleHeight: 0, // 索引二字距离窗口顶部的高度
				indexBarHeight: 0, // 索引表高度
				indexBarItemHeight: 0, // 索引表子项的高度
				scrollViewId: '', // scroll-view滚动到的子元素的id
				winHeight: 0,
				inputShowed: false, // 输入框是否显示
				inputVal: '', // 搜索框输入的内容
				hotCity: [{
						name: '大众',
						pic: '/static/img/category/6.png'
					},
					{
						name: '别克',
						pic: '/static/img/category/6.png'
					},
					{
						name: '福特',
						pic: '/static/img/category/6.png'
					},
					{
						name: '雪佛兰',
						pic: '/static/img/category/6.png'
					},
					{
						name: '本田',
						pic: '/static/img/category/6.png'
					},
					{
						name: '大众',
						pic: '/static/img/category/6.png'
					},
					{
						name: '别克',
						pic: '/static/img/category/6.png'
					},
					{
						name: '福特',
						pic: '/static/img/category/6.png'
					},
					{
						name: '雪佛兰',
						pic: '/static/img/category/6.png'
					},
					{
						name: '本田',
						pic: '/static/img/category/6.png'
					}

				], // 热门城市
				searchResult: [], // 搜索城市的结果
				localCity: '',

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
				currentTab: 0,
				tabIndex: 0,
				scrollInto: '',

			}
		},
		onLoad: function(options) {
			const that = this;
			that.localCity = options.currentCity || "深圳";
			setTimeout(() => {
				uni.getSystemInfo({
					success: function(res) {
						let winHeight = res.windowHeight
						let barHeight = winHeight - uni.upx2px(204);
						that.winHeight = winHeight;
						that.indexBarHeight = barHeight;
						that.indexBarItemHeight = barHeight / 25;
						that.titleHeight = uni.upx2px(132);
						that.lists = cityData.list
					}
				})
			}, 50)
		},
		methods: {
			showInput() {
				this.inputShowed = true
			},
			clearInput() {
				this.inputVal = "";
				this.inputShowed = false;
				this.searchResult = [];
				uni.hideKeyboard() //强行隐藏键盘
			},
			inputTyping(e) {
				this.inputVal = e.detail.value;
				this.searchCity()
			},
			// 热门选择
			cityClick(e) {
				console.log(e);
			},

			// 选择品牌
			selectCity(e) {
				let cityName = e.currentTarget.dataset.name;
				console.log(e);
			},
			touchStart(e) {
				console.log(e);
				var self = this;
				this.touchmove = true
				
				
				// let scrrorView = this.$refs.scrool
				// console.log(scrrorView);
				// scrrorView.offsetTop=0;
				uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
				}); 
				
				
				
				
				let pageY = e.touches[0].pageY - 10;
				
					let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight)
					let item = this.lists[index === 0 ? 1 : index]
					if (item) {
						this.scrollViewId = item.letter;
						this.touchmoveIndex = index;
					}
			},
			touchMove(e) {
				let tter = e.target.dataset.letter;
				let pageY = e.touches[0].pageY - 10;

				let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight)
				let item = this.lists[index === 0 ? 1 : index]
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index
				}
			},
			touchEnd() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			},
			touchCancel() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			},
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
		}
	}
</script>

<style scoped lang="scss">
	page {
		height: 100%;
		overflow: hidden;
	}

	.page {
		height: 100%;
		overflow: hidden;
	}


	.header {
		padding-top: 10rpx;
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
			// position: absolute;
			// top: 20rpx;
			// left: 0;
			padding-left: 10rpx;
			padding-right: 20rpx;
			box-sizing: border-box;
		}

		.tui-content-box {
			width: 100%;
			height: 88rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;

		}

		.tui-notice-box {
			width: 80rpx;
			padding: 10rpx;
			position: relative;
			box-sizing: border-box;

			image {
				width: 70rpx;
				height: 70rpx;
			}
		}

		.tui-avatar-box {

			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;

			view {
				width: 80%;
				color: #fff;
			}
		}

		.tui-avatar {
			width: 56rpx;
			height: 56rpx;
			border-radius: 50%;
		}

		.tui-search-box {
			flex: 1;
			height: 80rpx;
			margin: 0 28rpx;
			border-radius: 30rpx;
			font-size: 10pt;
			background: rgba(0, 0, 0, 0.1);
			padding: 0 22rpx;
			box-sizing: border-box;
			color: #fff;
			display: flex;
			align-items: center;

			input {
				margin-left: 10rpx;
			}
		}
	}

	.nav {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		border: none;

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


	.scrollList {
		flex: 1;
	}

	.search-bar {
		display: flex;
		align-items: center;
		position: relative;
		padding: 27rpx 30rpx 35rpx;
		background-color: #fff;
	}

	.search-bar-form {
		flex: 1;
		position: relative;
		border-radius: 32rpx;
		background: #f2f5f7;
	}

	.search-bar-box {
		display: flex;
		align-items: center;
		position: relative;
		padding-left: 20rpx;
		padding-right: 20rpx;
		height: 64rpx;
		z-index: 1;
	}

	.search-bar-input {
		line-height: normal;
		width: 100%;
		padding-left: 20rpx;
		font-size: 30rpx;
		color: #333;
	}

	.phcolor {
		font-size: 30rpx;
	}

	.icon-clear {
		height: 38rpx;
	}

	.icon-clear .tui-icon-class {
		display: block
	}

	.search-bar-label {
		height: 64rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 2;
		border-radius: 32rpx;
		color: #ccc;
		background: #f2f5f7;
	}

	.icon-search {
		position: relative;
		height: 26rpx;
		margin-right: 20rpx;
		font-size: inherit;
	}

	.search-bar-text {
		font-size: 30rpx;
		line-height: 32rpx;
	}

	.cancel-btn {
		padding-left: 30rpx;
	}

	.search-result::before {
		display: none;
	}

	.search-result::after {
		display: none;
	}

	.tui-list-cell {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.tui-list-cell-hover {
		background-color: #eee !important;
	}

	.tui-list-cell-navigate {
		width: 100%;
		position: relative;
		padding: 10rpx 50rpx;
		font-size: 28rpx;
		box-sizing: border-box;
		color: #333;

		.cell_img {
			image {
				width: 80rpx;
				height: 80rpx;
			}
		}
	}

	.tui-list-cell-navigate::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 30rpx;
	}

	.current-city {
		padding: 0 30rpx 30rpx;
		background: #fff;
	}

	.tui-icon-class {
		margin-right: 10rpx;
	}

	.current-city .title {
		font-size: 24rpx;
		line-height: 24rpx;
		color: #999;
		height: 80rpx;
	}

	.city-name {
		display: flex;
		align-items: center;
		margin-top: 17rpx;
		font-size: 30rpx;
		font-weight: bold;
		line-height: 30rpx;
		color: #333;
	}

	.hot-city .title {
		height: 80rpx !important;
		padding-left: 30rpx;
		font-size: 24rpx !important;
		line-height: 80rpx !important;
		color: #999;
		background: #f2f5f7 !important;
	}

	.city-names {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: center;
		width: 630rpx;
		height: 280rpx;
		padding: 12rpx 90rpx 26rpx 30rpx;
		background: #fff;
	}

	.item {
		width: 20%;
		text-align: center;
		margin-top: 20rpx;
		font-size: 10pt;

		.item_img {
			image {
				display: block;
				margin: 0 auto;
				width: 80rpx;
				height: 80rpx;
			}

			padding-bottom: 10rpx;
		}

	}

	.city-name-item {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 140rpx;
		height: 56rpx;
		margin-top: 16rpx;
		/* border: solid 1rpx #ccc; */
		border-radius: 28rpx;
		font-size: 28rpx;
		color: #333;
		position: relative;
	}

	.city-name-item::before {
		content: "";
		position: absolute;
		width: 200%;
		height: 200%;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scale(0.5, 0.5);
		transform: scale(0.5, 0.5);
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		left: 0;
		top: 0;
		border-radius: 56rpx;
		border: 1px solid #ccc;
	}

	.tap-city {
		color: #fff;
		background: #5677fc;
		/* border: solid 1rpx #5677fc; */
	}

	.tui-list {
		background-color: #fff;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-list-cell-divider {
		height: 48rpx;
		padding-left: 30rpx;
		font-size: 24rpx;
		color: #999;
		background: #f2f5f7;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
	}

	.tui-indexed-list-bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		z-index: 9999;
		position: absolute;
		top: 180rpx;
		right: 0;
		padding-right: 10rpx;
		width: 44rpx;
	}

	.tui-indexed-list-text {
		font-size: 8pt;
		white-space: nowrap;
	}

	.tui-indexed-list-bar.active {
		background-color: rgb(200, 200, 200);
	}

	.tui-indexed-list-alert {
		position: absolute;
		z-index: 20;
		width: 160rpx;
		height: 160rpx;
		left: 50%;
		top: 50%;
		margin-left: -80rpx;
		margin-top: -80rpx;
		border-radius: 80rpx;
		text-align: center;
		line-height: 160rpx;
		font-size: 70rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
