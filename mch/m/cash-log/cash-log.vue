<template>
	<view class="body">
		<view class="list">
			<view class="item" v-if="list.length>0" v-for="(item,index) in list" :key="item.id">
				<view class="info">
					<view :class="[item.status==1?'status1':'',item.status==2?'status2':'']">
						<block v-if="item.status==0">待审核</block>
						<block v-else-if="item.status==1">已转账</block>
						<block v-else-if="item.status==2">已拒绝</block>
					</view>
					<view>{{item.addtime}}</view>
				</view>
				<view class="money">{{item.money}}</view>
			</view>
		</view>
		<view class="footer">没有更多了</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page:1,
				list:[]
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			getList(){
				uni.showLoading({
					title:"正在加载"
				})
				this.$request({
					url:this.$api.mch.user.cash_log,
					data:{
						page: this.page,
						year: '',
						month: '',
					}
				}).then((res)=>{
					uni.hideLoading()
					if(res.code == 0){
						this.list = res.data.list;
					}
					if(res.code == 1){
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
					console.log(res);
				})
			}
		}
	}
</script>

<style scoped>
	.list{
		background-color: #FFFFFF;
		border-top: 1px solid #EEEEEE;
	}
	.item{
		display: flex;
		padding: 20rpx 30rpx;
		align-items: center;
		border-bottom: 1px solid #EEEEEE;
	}
	.item>view:nth-of-type(1){
		max-width: 430rpx;
	}
	.item>view:nth-of-type(2){
		margin-left: auto;
	}
	.info>view:nth-of-type(1){
		padding: 5rpx 0;
		font-size: 34rpx;
		word-break:break-all;
		width: 100%;
	}
	.info>view:nth-of-type(2){
		font-size: 30rpx;
		padding: 5rpx 0;
		color: #888888;
	}
	.money{
		font-size: 38rpx;
		font-weight: bold;
		color: #FF4544;
	}
	.status1{
		color: #3FC24C;
	}
	.status2{
		color: #FF4544;
	}
	.footer{
		line-height: 100rpx;
		text-align: center;
	}
</style>
