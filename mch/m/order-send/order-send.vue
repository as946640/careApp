<template>
	<view class="body">
		<view class="send-info">
			<view class="cont">
				<view>快递公司</view>
				<view>
					<picker @change="selectExpress" :value="index" :range="array" range-key="express">
						<view class="uni-input">{{array[index].express}}</view>
					</picker>
				</view>
				<view class="picker-img">
					<image src="../../../static/img/shop/icon-jiantou-you.png"></image>
				</view>
			</view>
			<view class="cont">
				<view>快递单号</view>
				<view>
					<input type="text" placeholder="请输入您的快递单号" v-model="express_no"/>
				</view>
			</view>
			<view class="cont">
				<view>商家留言</view>
				<view>
					<input type="text" placeholder="选填" v-model="words"/>
				</view>
			</view>
		</view>
		<view class="btn" @tap="subExpress">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order_id:0,
				array:[
					{express:""}
				],
				index:0,
				express_no:"",
				words:""
			}
		},
		onLoad(options) {
			console.log(options);
			this.order_id = options.order_id;
			this.$request({
				url:this.$api.mch.order.detail,
				data:{
					id:options.order_id
				}
			}).then((res) => {
				console.log(res);
				if(res.code==0){
					this.array = res.data.order.express_list;
				}
				if(res.code==1){
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				}
			})
		},
		methods: {
			selectExpress(e){
				console.log(e);
				this.index = e.detail.value;
			},
			subExpress(){
				this.$request({
					url:this.$api.mch.order.send,
					method:"POST",
					data:{
						send_type: 'express',
						order_id: this.order_id,
						express: this.array[this.index].express,
						express_no: this.express_no,
						words: this.words,
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
			}
		}
	}
</script>

<style scoped>
	.send-info{
		background-color: #FFFFFF;
		border-top: 1px solid #E3E3E3;
	}
	.cont{
		border-bottom: 1px solid #E3E3E3;
		display: flex;
		font-size: 34rpx;
		align-items: center;
		padding: 25rpx 0;
	}
	.picker-img{
		width: 20rpx;
		height: 35rpx;
		margin-right: 30rpx;
	}
	.picker-img>image{
		width: 20rpx;
		height: 35rpx;
		transform: rotateZ(90deg);
	}
	input{
		font-size: 34rpx;
	}
	.cont>view:nth-of-type(1){
		width: 200rpx;
		text-align: right;
	}
	.cont>view:nth-of-type(2){
		margin-left: 20rpx;
		flex: 1;
	}
	.btn{
		width: 90vw;
		height: 90rpx;
		background-color: #FF4544;
		margin: 80rpx auto;
		line-height: 90rpx;
		text-align: center;
		color: #FFFFFF;
		font-size: 36rpx;
		border-radius: 15rpx;
	}
</style>
