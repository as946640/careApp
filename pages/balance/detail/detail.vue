<template>
	<view class="body">
		<view class="money">
			<view>交易金额</view>
			<view :style="info.flag==1?'color:#3FC24C':'color:#FF4544'">{{info.pay_price}}</view>
		</view>
		<view class="bill-info">
			<view class="row">
				<view class="title">交易时间</view>
				<view>{{info.time}}</view>
			</view>
			<view class="row">
				<view class="title">交易内容</view>
				<view>{{info.content}}</view>
			</view>
			<view class="row">
				<view class="title">交易单号</view>
				<view>{{info.order_no}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{}
			}
		},
		onLoad(options) {
			console.log(options);
			
			uni.showLoading({
				title: '加载中',
			});
			this.$request({
				url: this.$api.recharge.detail,
				method: 'GET',
				data: {
					order_type: options.order_type,
					id: options.id
				}
			}).then((res) => {
				uni.hideLoading();
				if(res.code == 0){
					this.info = res.data;
				}
				if(res.code == 1){
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				}
				console.log(res);
			});
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.body{
		background-color: #FFFFFF;
	}
	.money{
		line-height: 150upx;
		border-top: 1px solid #E3E3E3;
		border-bottom: 1px solid #E3E3E3;
		display: flex;
	}
	.money>view{
		padding: 0 40upx;
	}
	.money>view:nth-of-type(1){
		color: #999999;
		flex: 1;
	}
	.money>view:nth-of-type(2){
		flex: 3;
	}
	.bill-info{
		border-bottom: 1px solid #E3E3E3;
	}
	.bill-info>.row{
		display: flex;
		padding: 20upx 0;
	}
	.row>view{
		padding: 0 40upx;
	}
	.row>view:nth-of-type(1){
		flex: 1;
		color: #999999;
	}
	.row>view:nth-of-type(2){
		flex: 3;
	}
</style>
