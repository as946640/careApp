<template>
	<view class="body">
		<view class="top" :style="'background-image:url('+shop_info.header_bg+')'">
			<view class="shop-info">
				<view class="shop-img"><image :src="shop_info.logo" /></view>
				<view class="shop-name">{{shop_info.name}}</view>
			</view>
		</view>
		<view class="info-cont">
			<block v-if="shop_info.main_content">
				<view class="sale-cont">
					<view>
						<image src="../../../static/img/shop/more.png"></image>
						经营内容
					</view>
					<view>{{shop_info.main_content}}</view>
				</view>
			</block>
			<block v-if="shop_info.service_tel">
				<view class="phone">
					<view>
						<image src="../../../static/img/shop/phone.png"></image>联系电话
						<view class="btn" @tap="call">拨打电话</view>
					</view>
					<view>{{shop_info.tel}}</view>
				</view>
			</block>
			<block v-if="shop_info.address">
				<view class="shop-addr">
					<view>
						<image src="../../../static/img/shop/addrs.png"></image>店铺地址
						<view class="btn" @tap="goHere">去到这里</view>
					</view>
					<view>{{shop_info.address}}</view>
				</view>
			</block>
			<block v-if="shop_info.summary">
				<view class="shop-introduce">
					<view>
						<image src="../../../static/img/shop/text.png"></image>店铺介绍
					</view>
					<view>{{shop_info.summary}}</view>
				</view>
			</block>
		</view>
		<view class="map">
			<!-- <map :latitude="latitude" :longitude="longitude"></map> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mch_id:0,
				shop_info:{},
				latitude:0,
				longitude:0
			}
		},
		onLoad(options) {
			this.mch_id = options.mch_id;
			this.getShopInfo();
		},
		methods: {
			getShopInfo(id){
				uni.showLoading({
					title:"加载中"
				})
				this.$request({
					url:this.$api.mch.shop,
					data:{
						mch_id: this.mch_id,
						tab:0,
						cat_id:0
					}
				}).then((res) => {
					// console.log(res)
					uni.hideLoading();
					if(res.code == 0){
						this.shop_info = res.data.shop;
						console.log(res);
						this.latitude = res.data.shop.latitude;
						this.longitude =res.data.shop.longitude;
						console.log(this.longitude+"---------"+this.latitude);
					}
				});
			},
			call(){
				uni.makePhoneCall({
				    phoneNumber: this.shop_info.tel //仅为示例
				});
			},
			goHere(){
				let self = this;
				console.log(this.latitude);
				if(this.latitude == 0 || this.longitude==0){
					uni.showToast({
						title:"经纬度错误",
						icon:"none"
					})
					return;
				}
				let latitude = parseFloat(this.latitude);
				let longitude = parseFloat(this.longitude);
				uni.getLocation({
				    type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				    success: function (res) {
				        uni.openLocation({
				            latitude: latitude,
				            longitude: longitude,
							name:self.shop_info.address,
				            success: function () {
				                console.log('success');
				            },fail:function(e){
								console.log(e)
				            }
				        });
				    }
				});
			}
		}
	}
</script>

<style scoped>
	.top{
		width: 100%;
		height: 260rpx;
		background-position:top center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		position: relative;
	}
	.shop-info{
		position: absolute;
		text-align: center;
		left: calc(50% - 60rpx);
		bottom: -130rpx;
	}
	.shop-img{
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		margin: 0 auto;
	}
	.shop-img>image{
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}
	.shop-name{
		line-height: 80rpx;
		font-size: 38rpx;
	}
	
	.info-cont{
		color: #000000;
		padding-top: 140rpx;
		box-sizing: border-box;
	}
	.info-cont>view{
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		margin-bottom: 10rpx;
	}
	.info-cont>view>view:nth-of-type(1){
		color: #3C3C3C;
		font-size: 38rpx;
		display: flex;
		align-items: center;
		height: 80rpx;
	}
	.info-cont>view>view:nth-of-type(1)>image{
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
	.info-cont>view>view:nth-of-type(2){
		padding: 10rpx 0;
		font-size: 32rpx;
	}
	.btn{
		margin-left: auto;
		padding: 8rpx 30rpx;
		border-radius: 10rpx;
		border: 1px solid #000000;
		font-size: 28rpx;
	}
	.map>map{
		padding-top: 50rpx;
		width: 100vw;
	}
</style>
