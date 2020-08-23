<template>
	<view class="body">
		<view class="model" v-if="show">
			<view class="box">
				<view class="title">选择发货方式</view>
				<view class="mode">
					<view :class="index==1?'mode-active':''" @tap="changeMode(1)">快递配送</view>
					<view :class="index==2?'mode-active':''" @tap="changeMode(2)">无需物流</view>
				</view>
				<view class="btn">
					<view @tap="closeModel">取消</view>
					<view @tap="toSend">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			show:{
				type:Boolean,
				default:false
			},
			order_id:0
		},
		data() {
			return {
				index:1
			};
		},
		methods:{
			changeMode(index){
				this.index = index;
			},
			closeModel(){
				this.$emit('closeModel');
				this.index = 1;
			},
			toSend(){
				console.log(this.order_id);
				if(this.index == 1){
					uni.navigateTo({
						url:"/mch/m/order-send/order-send?order_id="+this.order_id+""
					})
					return;
				}
				if(this.index == 2){
					uni.showModal({
						title:"提示",
						content:"无需物流方式订单将直接标记成已发货，请确认操作。",
						success:(res) => {
							if (res.confirm) {
								this.$request({
									url:this.$api.mch.order.send,
									method:"POST",
									data:{
										send_type: 'none',
										order_id: this.order_id
									}
								}).then((res) => {
									console.log(res);
									if(res.code == 0){
										uni.showToast({
											title:res.msg,
											icon:"none"
										})
										setTimeout(()=>{
											uni.redirectTo({
												url:"/mch/m/order/order?status=3"
											});
										},500);
									}
									if(res.code == 1){
										uni.showToast({
											title:res.msg,
											icon:"none"
										})
									}
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					})
				}
				
			}
		}
	}
</script>

<style scoped>
	.model{
		width: 100vw;
		height: 100vh;
		background-color: rgba(0,0,0,0.5);
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}
	.box{
		background-color: #FFFFFF;
		border-radius: 20rpx;
		width: 75vw;
	}
	.title{
		text-align: center;
		font-size: 34rpx;
		padding: 30rpx;
	}
	.mode{
		display: flex;
		justify-content: center;
		margin-bottom: 40rpx;
		margin-top: 10rpx;
		justify-content: space-evenly;
	}
	.mode>view{
		padding: 20rpx 40rpx;
		border: 1px solid #E2E2E2;
		border-radius: 15rpx;
		/* margin: 0 5vw; */
	}
	.mode-active{
		color: #FFFFFF;
		background-color: #FF4544;
		border: 1px solid #FF4544;
	}
	.btn{
		display: flex;
		justify-content: space-around;
		border-top: 1px solid #EEEEEE;
		padding: 25rpx 0;
	}
	.btn>view:nth-of-type(2){
		color: #FF4544;
	}
</style>
