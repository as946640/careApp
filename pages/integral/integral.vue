<template>
	<view class="body">
		<!-- 积分信息 -->
		<view class="top" style="background-image: url('http://gc.sinbel.cn/web/statics/wxapp/images/icon-integral-head.png');">
			<view class="title">我的积分<image class="icon-img" src="http://gc.sinbel.cn/web/statics/images/recharge/icon-balance-p.png"></image></view>
			<view class="integral">{{integral}}</view>
			<view class="info-box">
				<view>
					<image src="http://gc.sinbel.cn/web/statics/wxapp/images/icon-shuoming.png"></image>
					<view>我的兑换</view>
				</view>
				<view>
					<image src="http://gc.sinbel.cn/web/statics/wxapp/images/icon-integral-detail.png"></image>
					<view><navigator url="integral-detail/integral-detail">积分明细</navigator></view>
				</view>
			</view>
			<view class="sign">
				<image src="http://gc.sinbel.cn/web/statics/wxapp/images/icon-register.png" mode=""></image>
			</view>
		</view>
		
		<!-- 轮播图 -->
		<block v-if="banner_list.length > 0">
			<swiper class="banner" indicator-dots="true">
				<swiper-item v-for="(item,index) in banner_list">
					<image :src="item.pic_url" mode="aspectFill"/>
				</swiper-item>
			</swiper>
		</block>
		
		<!-- 优惠专区 -->
		<view class="discount">
			<view class="discount-title"><text>优惠购专区</text></view>
			<scroll-view scroll-x="true" class="discount-list">
				<view class="discount-item" @tap="selected(0)" :class="cat_id==0?'active':''">
					<image src="http://gc.sinbel.cn/web/statics/wxapp/images/icon-integral-all.png"></image>
					<view>全部</view>
				</view>
				<block v-for="(item,index) in catList">	
					<view class="discount-item" @tap="selected(item.id,index)" :class="cat_id==item.id?'active':''">
						<image :src="item.pic_url"></image>
						<view>{{item.name}}</view>
					</view>
				</block>
			</scroll-view>
			
			<view class="goods-list">
				<block v-for="(item,index) in goods_list">
					<view class="goods-item">
						<view class="goods-img">
							<image :src="item.cover_pic" mode="aspectFill"/>
						</view>
						<view class="goods-info">
							<view class="goods-name">{{item.name}}</view>
							<view class="goods-exchange">
								{{item.integral}}积分
								<block v-if="item.price > 0">+￥{{item.price}}</block>
							</view>
							<view class="goods-price">
								<view>￥{{item.original_price}}</view>
								<view>仅剩{{item.goods_num}}{{item.unit}}</view>
							</view>
							<view class="goods-btn">立即兑换</view>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goods_list:[],
				banner_list:[],
				coupon_list:[],
				catList:[],
				integral:0,
				page:1,
				cat_id:0,
				is_no_more:false
			}
		},
		onLoad() {
			this.$request({
				url:this.$api.integral.index
			}).then((res)=>{
				console.log(res);
				if(res.code == 0){
					this.banner_list = res.data.banner_list
					this.coupon_list = res.data.coupon_list
					this.integral = res.data.user.integral
					this.catList = res.data.cat_list
				}
			});
			
			this.getGoodsList();
		},
		methods: {
			getGoodsList(){
				if(this.is_no_more){
					uni.showToast({
						title:"没有更多",
						icon:"none"
					})
					return;
				}
				uni.showLoading({
					title:"加载中..."
				});
				this.$request({
					url:this.$api.integral.goods_list,
					data:{
						page:this.page,
						cat_id: this.cat_id
					}
				}).then((res) => {
					console.log(res);
					uni.hideLoading();
					if(res.code == 0){
						if(this.goods_list.length == 0){
							this.goods_list = res.data.list;
						}else{
							this.goods_list.concat(res.data.list)
						}
						this.page++;
						if(res.data.list.length == 0){
							uni.showToast({
								title:"没有更多",
								icon:"none"
							})
							this.is_no_more == true
						}
						
						// this.goods_list = res.data.list;
					}
					if(res.code == 1){
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			},
			selected(id,index){
				console.log(index);
				this.page = 1;
				this.is_no_more = false;
				this.goods_list = []
				if(id==0){
					this.cat_id = 0;
				}else{
					this.cat_id = this.catList[index].id;
				}
				this.getGoodsList();
			}
		}
	}
</script>

<style scoped>
	.top{
		width: 100%;
		height: 300rpx;
		padding: 40rpx 0;
		box-sizing: border-box;
		background-color: #F06C7A;
		background-position: top center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		position: relative;
	}
	.title{
		text-align: center;
		font-size: 32rpx;
		color: #999999;
	}
	.icon-img{
		width: 33rpx;
		height: 33rpx;
		margin-left: 10rpx;
	}
	.integral{
		text-align: center;
		padding: 20rpx 0;
		color: #ECB16C;
		font-size: 58rpx;
		font-weight: bold;
	}
	.info-box{
		width: 100%;
		display: flex;
	}
	.info-box>view{
		flex: 1;
		text-align: center;
		color: #FFFFFF;
		font-size: 34rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.info-box image{
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}
	.sign{
		position: absolute;
		width: 400rpx;
		height: 100rpx;
		color: #FFFFFF;
		text-align: center;
		border-radius: 100rpx;
		overflow: hidden;
		bottom: -50rpx;
		left: calc(50% - 200rpx);
	}
	.sign>image{
		width: 100%;
		height: 100%;
	}
	.banner{
		height: 200rpx;
		margin-top: 55rpx;
	}
	.banner image{
		width: 100%;
		height: 200rpx;
	}
	.discount{
		padding-top: 50rpx;
	}
	.discount-title{
		padding: 0 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 2px solid #ECECEC;
	}
	.discount-title>text{
		font-size: 36rpx;
		border-left: 2px solid #FF9561 ;
		padding: 0 20rpx;
	}
	.discount-list{
		width: 100%;
		border-bottom: 2px solid #ECECEC;
		padding: 20rpx 0;
		white-space: nowrap;
	}
	.discount-item{
		display: inline-block;
		padding: 0 30rpx;
		text-align: center;
	}
	.active{
		color: #FF4544;
	}
	.discount-item>image{
		width: 50rpx;
		height: 50rpx;
	}
	.goods-list{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content:space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	.goods-item{
		width: 49%;
		background-color: #FFFFFF;
		margin-top: 20rpx;
	}
	.goods-img{
		width: 100%;
	}
	.goods-img>image{
		width: 100%;
		height: 320rpx;
	}
	.goods-info{
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
	}
	.goods-name{
		width: 100%;
		height: 82rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.goods-exchange{
		padding-top: 10rpx;
		color: #FF8A71;
		font-size: 30rpx;
	}
	.goods-price{
		display: flex;
		color: #A2A2A5;
		font-size: 25rpx;
		padding: 10rpx 0;
	}
	.goods-price>view{
		flex: 1;
	}
	.goods-price>view:nth-of-type(1){
		text-decoration: line-through;
	}
	.goods-price>view:nth-of-type(2){
		text-align: right;
	}
	.goods-btn{
		font-size: 38rpx;
		background-image: linear-gradient(to right,#EFB17A,#E29B5B);
		height: 55rpx;
		line-height: 55rpx;
		color: #FFFFFF;
		text-align: center;
		border-radius: 55rpx;
	}
</style>
