<template>
	<view class="body">
		<view class="list">
			<view class="item" v-if="list.length > 0" v-for="(item,index) in list">
				<view class="status">{{item.order_status}}</view>
				<view class="money">{{item.price}}元</view>
				<view class="info">
					<view class="order-no">
						<view>订单号</view>
						<view>{{item.order_no}}</view>
					</view>
					<view class="goods-name">
						<view>商品名称</view>
						<view>{{item.goods_name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="foooter">没有更多</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page:1,
				settle_type:0,
				list:[]
			}
		},
		onLoad(options) {
			console.log(options);
			this.settle_type = options.settle_type
			this.getSettleList();
		},
		methods: {
			getSettleList(){
				uni.showLoading({
					title:"正在加载"
				});
				this.$request({
					url:this.$api.mch.user.settle_log,
					data:{
						settle_type: this.settle_type,
						page: this.page
					}
				}).then((res)=>{
					uni.hideLoading();
					if(res.code == 0){
						this.list = res.data.list
					}
					console.log(res);
				})
			}
		}
	}
</script>

<style scoped>
	.item{
		background-color: #FFFFFF;
		margin-top: 20rpx;
		padding: 0 25rpx;
	}
	.status{
		font-size: 36rpx;
		padding: 20rpx;
	}
	.money{
		border-bottom: 1px solid #EEEEEE;
		text-align: center;
		font-size: 62rpx;
		padding-bottom: 20rpx;
	}
	.info{
		padding: 30rpx 0;
	}
	.order-no,.goods-name{
		padding: 10rpx 0;
		display: flex;
		align-items: center;
		font-size: 36rpx;
	}
	.order-no>view:nth-of-type(1),.goods-name>view:nth-of-type(1){
		width: 150rpx;
		text-align: justify;
		text-align-last: justify;
	}
	.order-no>view:nth-of-type(2),.goods-name>view:nth-of-type(2){
		margin-left: 20rpx;
		color: #888888;
	}
	.foooter{
		line-height: 100rpx;
		text-align: center;
		font-size: 32rpx;
		color: #888888;
	}
</style>
