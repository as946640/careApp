<template>
	<view class="page">
		<!-- 头部 -->
		<view class="header">
			<!-- 头部站位 -->
			<view class="headers"></view>
			<view class="search">
				<tui-navigation-bar :isFixed="false" splitLine backgroundColor="255,255,255" color="#fff">
					<view class="flex">
						<!-- <view class="tui-avatar-box" @tap="back">
							<view class="" style="padding-top: 20rpx;">
								<tui-icon name="arrowleft" :size="30" color="#fff"></tui-icon>
							</view>
						</view> -->
						<view class="tui-search-box">
							服务网点
						</view>
						
					</view>
				</tui-navigation-bar>
			</view>
		</view>
		
		<!-- 区域选择 -->
		<view class="branch flex">
			<view class="flex flex-y-center ">
				<view class="">
					<tui-icon name="position" :size="20" color="#134AFF"></tui-icon>
				</view>
				<view class="">
					区域
				</view>
			</view>
			<view class="left">
				<view class="">
					<picker :value="value" mode="multiSelector" @change="picker" @columnchange="columnPicker" :range="multiArray">
						<view class="qu">
							
							<view  shape="circle" v-if="!text">请选择区街</view>
							<view class="result" v-else>
								{{text}}
							</view>
							<view class="">
								<tui-icon name="turningdown" color="#111524" :size="24"></tui-icon>
							</view>
						</view>
					</picker>
				</view>
			</view>
		</view>
		<!-- 网点选择 -->
		<view class="content">
			<view class="branch-item" v-for="(item, index) in serveBranch" :key='index' @click="branchD(item)">
				<view class="top">
					<view class="">
						<tui-icon name="shop-fill" :size="25" color="#134AFF"></tui-icon>
					</view>
					<view class="title">
						<text>{{item.name}}</text>
					</view>
					<view class="link">
						<block v-if="item.link">
							<tui-icon name="star-fill" :size="22" color="#F3B124"></tui-icon>
						</block>
						<block v-else>
							<tui-icon name="star" :size="22" color="#F3B124"></tui-icon>
						</block>
					</view>
				</view>
				<view class="bottom flex">
					<view class="left">
						<view class="left-top">
							<view class="time">
								<view class="shij">
									时间：
								</view>
								<view class="shijs">
									<view class="">
										<text>工作日：{{item.time.gz}}</text>
									</view>
									<view class="">
										<text>周末及假期：{{item.time.zm}}</text>
									</view>
								</view>
							</view>
							<view class="site">
								<view class="">
									地址：
								</view>
								<view class="">
									{{item.position}}
								</view>
							</view>
						</view>
						<view class="left-bottom">
							<view class="flex flex-y-center">
								<tui-icon name="position" :size="20" color="#F"></tui-icon>路线
							</view>
							<view class="flex flex-y-center">
								<tui-icon name="voipphone" :size="20" color="#134AFF"></tui-icon>电话
							</view>
						</view>
					</view>
					<view class="right">
						<image src="../../static/img/shop/1.jpg" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		
		<view class="tab-bar">
			<tui-tabbar :tabBar="tabBar" unlined :hump="true" :current="current" @click="tabbarSwitch"></tui-tabbar>
		</view>
	
	</view>
</template>

<script>
	const cityData = require('@/data/picker.city.js')
	export default {
		data() {
			return {
				selectList: cityData, //接口返回picker数据,此处就直接使用本地测试数据
				multiArray: [], //picker数据
				value: [0, 0, 0],
				text: "",
				current: 0,
				id: "",
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
				],		
				serveBranch: [
					{
						name: '广州市白云区汽车维护服务点',
						time: {
							gz:'8:30至16：00',
							zm:'8:30至11：00'
						},
						position: '机场路3698号',
						link: true,
						url: '/pages/branch-details/branch-details'
					},
					{
						name: '广州市白云区汽车维护服务点',
						time: {
							gz:'8:30至11：00',
							zm:'8:30至11：00'
						},
						position: '机场路3698号',
						link: false
					},
					{
						name: '广州市白云区汽车维护服务点',
						time: {
							gz:'8:30至11：00',
							zm:'8:30至11：00'
						},
						position: '机场路3698号',
						link: true
					},
					{
						name: '广州市白云区汽车维护服务点',
						time: {
							gz:'8:30至11：00',
							zm:'8:30至11：00'
						},
						position: '机场路3698号',
						link: false
					}
					
				],
			
			}
		},
		onLoad:function(){
			this.current = 3;
			this.multiArray = [
				this.toArr(this.selectList),
				this.toArr(this.selectList[0].children),
				this.toArr(this.selectList[0].children[0].children)
			]
		},
		methods: {
			picker: function(e) {
				let value = e.detail.value;
				if (this.selectList.length > 0) {
					let provice = this.selectList[value[0]].text
					let city = this.selectList[value[0]].children[value[1]].text
					let district = this.selectList[value[0]].children[value[1]].children[value[2]].text
					this.text = provice + " " + city + " " + district;
					this.id = this.selectList[value[0]].children[value[1]].children[value[2]].value
				}
			},
			toArr(object) {
				let arr = [];
				for (let i in object) {
					arr.push(object[i].text);
				}
				return arr;
			},
			columnPicker: function(e) {
				//第几列 下标从0开始
				let column = e.detail.column;
				//第几行 下标从0开始
				let value = e.detail.value;
				if (column === 0) {
					this.multiArray = [
						this.multiArray[0],
						this.toArr(this.selectList[value].children),
						this.toArr(this.selectList[value].children[0].children)
					];
					this.value = [value, 0, 0]
				} else if (column === 1) {
					this.multiArray = [
						this.multiArray[0],
						this.multiArray[1],
						this.toArr(this.selectList[this.value[0]].children[value].children)
					];
					this.value = [this.value[0], value, 0]
				}
			},
			back() {
				uni.navigateBack()
			},
			branchD(e){
				uni.navigateTo({
					url:e.url
				})
			},
			tabbarSwitch(e) {
				//获取登录状态，此处默认未登录
				let isLogin=false
				this.current = e.index
				console.log(e.index);
				uni.navigateTo({
					url:e.pagePath
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.page {
		padding-bottom: 100rpx;
	}
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
	
	.branch {
		width: 100%;
		height: 60rpx;
		background-color: #fff;
		font-size: 10pt;
			view:first-child {
				padding-left: 20rpx;
			}
			.left {
				flex: 1;
				display: flex;
				align-items: center;
					.qu {
						display: flex;
						align-items: center;
					}
			}
	}
	.content {
		width: 100%;
		padding-top: 20rpx;
		background-color: #F7F7F7;
			.branch-item {
				width: 94%;
				padding: 20rpx;
				padding-top: 0;
				margin: 20rpx auto;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				box-shadow: 2rpx 2rpx 4rpx #ccc;
				box-sizing: border-box;
					.top {
						width: 100%;
						display: flex;
						align-items: center;
						height: 80rpx;
						border-bottom: 1px solid #F7F7F7;
						box-sizing: border-box;
							view:first-child {
								width: 10%;
								padding-left: 10rpx;
								min-width: 10%;
									image {
										width:60rpx;
										height: 60rpx;
									}
							}
							.title {
								width: 60%;
								display: flex;
								font-size: 11pt;
							}
							.link {
								margin-left: auto;
								padding-right: 10rpx;
							}
					}
					.bottom {
						width: 100%;
						padding-top: 10rpx;
						display: flex;
							.left {
								width: 60%;
								font-size: 10pt;
								margin: 0;
								padding-left: 10rpx;
									.left-top {
										width: 100%;
										margin: 0;
										margin-top: 5%;
										padding-right: 10rpx;
										.time {
											height: 120rpx;
											display: flex;
												.shij {
													width: 80rpx;
													min-width: 80rpx;
												}
											.shijs {
												width: 450rpx;
												min-width: 300rpx;
												font-size: 9pt;
													view:last-child {
														margin-top: 10%;
													}
											}
										 }
										 .site {
											
										 }
									}
										.site {
											display: flex;
											view: last-child {
												padding-left: 10rpx;
											}
										}
									
									
									.left-bottom {
										width: 100%;
										margin: 0;
										margin-top: 10rpx;
										display: flex;
										padding-left: 20rpx;
										color: #134AFF;
											view:first-child {
												width: 50%;
											}
									}
							}
							.right {
								width: 40%;
								height: 100%;
								padding-left: 10rpx;
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
