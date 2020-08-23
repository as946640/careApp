<template>
	<view class="body">
		<view class="header" :style="'background-image: url('+info.header_bg+');'">
			<view class="header-title">账户可用余额(元)</view>
			<view class="money">{{info.account_money}}</view>
			<view class="btn"><navigator url="/mch/m/cash/cash">提现</navigator></view>
		</view>
		<view class="record-list">
			<view class="record-item">
				<navigator url="/mch/m/account-log/account-log">
					<view>收支记录</view>
					<view><image src="../../../static/img/shop/icon-jiantou-you.png" /></view>
				</navigator>
			</view>
			<view class="record-item">
				<navigator url="/mch/m/cash-log/cash-log">
					<view>提现记录</view>
					<view><image src="../../../static/img/shop/icon-jiantou-you.png" /></view>
				</navigator>
			</view>
		</view>
		<view class="result-list">
			<view class="result-item" @tap="toSettleDetail(0)">
				<view>未结算金额</view>
				<view>￥{{info.no_settle_price}}</view>
				<view><image src="../../../static/img/shop/icon-jiantou-you.png" /></view>
			</view>
			<view class="result-item" @tap="toSettleDetail(1)">
				<view>已结算金额</view>
				<view>￥{{info.settle_price}}</view>
				<view><image src="../../../static/img/shop/icon-jiantou-you.png" /></view>
			</view>
		</view>
		<view class="footer" @tap="showExplain">交易手续费说明</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{}
			}
		},
		onShow() {
			uni.showLoading({
				title:"正在加载"
			})
			this.$request({
				url:this.$api.mch.user.account
			}).then((res)=>{
				uni.hideLoading();
				if(res.code == 0){
					this.info = res.data;
				}
				console.log(res);
			})
		},
		methods: {
			showExplain(){
				uni.showModal({
					title:"说明",
					content:this.info.desc,
					showCancel:false
				});
			},
			toSettleDetail(settle_type){
				uni.navigateTo({
					url:"/mch/m/settle_detail/settle_detail?settle_type="+settle_type+""
				})
			}
		}
	}
</script>

<style scoped>
	.header{
		width: 100vw;
		height: 320rpx;
		color: #FFFFFF;
		background-repeat: no-repeat;
		background-position: top center;
		background-size: 100% 100%;
		text-align: center;
		padding: 50rpx 0;
		box-sizing: border-box;
	}
	.money{
		padding: 22rpx 0;
		font-size: 60rpx;
		font-weight: bold;
	}
	.btn{
		margin: 0 auto;
		width: 170rpx;
		height: 58rpx;
		line-height: 56rpx;
		font-size: 30rpx;
		border-radius: 100rpx;
		border: 1px solid #FFFFFF;
	}
	.record-list{
		background-color: #FFFFFF;
		margin-top: 20rpx;
	}
	.record-item>navigator{
		display: flex;
		align-items: center;
		padding: 25rpx;
		border-bottom: 1px solid #F0F0F0;
		font-size: 32rpx;
	}
	.record-item>navigator>view:nth-of-type(2){
		width: 15rpx;
		height: 30rpx;
		margin-left: auto;
	}
	.record-item>navigator>view:nth-of-type(2)>image{
		width: 15rpx;
		height: 30rpx;
	}
	
	.result-list{
		background-color: #FFFFFF;
		margin-top: 20rpx;
	}
	.result-item{
		display: flex;
		align-items: center;
		padding: 25rpx;
		border-bottom: 1px solid #F0F0F0;
		font-size: 32rpx;
	}
	.result-item>view:nth-of-type(2){
		margin-left: auto;
		margin-right: 30rpx;
	}
	.result-item>view:nth-of-type(3){
		width: 15rpx;
		height: 36rpx;
	}
	.result-item>view:nth-of-type(3)>image{
		width: 15rpx;
		height: 30rpx;
	}

	.footer{
		width: 100vw;
		height: 100rpx;
		line-height: 100rpx;
		color: #397ED3;
		position: absolute;
		bottom: 0;
		text-align: center;
	}
</style>
