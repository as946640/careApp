<template>
	<view>
		<view class="tab">
			<view :class="status==1?'active':''" @tap="selected(1)"><text>收入</text></view>
			<view :class="status==2?'active':''" @tap="selected(2)"><text>支出</text></view>
		</view>
		<view class="detail-list">
			<block v-if="list.length > 0">
				<view class="detail-item" v-for="(item,index) in list">
					<view class="item-title">{{item.content}}</view>
					<view class="integral-info">
						<view>{{item.integral}}积分</view>
						<view>{{item.content_1}}</view>
						<view>时间:{{item.addtime}}</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status:1,
				page:1,
				is_no_more:false,
				list:[]
			}
		},
		onLoad() {
			this.getIntegralInfo();
		},
		onReachBottom() {
			this.getIntegralInfo();
		},
		methods: {
			selected(status){
				this.status = status;
				this.page = 1;
				this.list = [];
				this.is_no_more = false;
				this.getIntegralInfo();
			},
			getIntegralInfo(){
				console.log(123);
				if(this.is_no_more){
					uni.showToast({
						title:"没有更多数据",
						icon:"none"
					})
					return;
				}
				uni.showLoading({
					title:"加载中..."
				})
				this.$request({
					url:this.$api.integral.integral_detail,
					data:{
						page:this.page,
						status: this.status
					}
				}).then((res) => {
					uni.hideLoading();
					if (res.code == 0) {
						var list = this.list
						if (list) {
							list = list.concat(res.data.list)
						} else {
							list = res.data.list
						}
						if (res.data.list.length <= 0) {
							this.is_no_more = true;
						}
						this.list = list;
						this.page++;
					}
					console.log(this.page)
				})
			}
		}
	}
</script>

<style scoped>
	.tab{
		width: 100%;
		height: 80rpx;
		background-color: #FFFFFF;
		border-top: 1px solid #E2E2E2;
		border-bottom: 1px solid #E2E2E2;
		display: flex;
		align-items: center;
		position: fixed;
		left: 0;
	}
	.tab>view{
		flex: 1;
		text-align: center;
	}
	.tab>view>text{
		display: inline-block;
		line-height: 80rpx;
		padding: 0 20rpx;
	}
	.active>text{
		border-bottom: 1px solid #FF6F28;
		color: #FF6F28;
	}
	.detail-list{
		width: 100%;
		background-color: #FFFFFF;
		padding-top: 80rpx;
	}
	.detail-item{
		padding: 40rpx 20rpx;
		border-bottom: 1px solid #E2E2E2;
		box-sizing: border-box;
	}
	.item-title{
		font-size: 36rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.detail-item>view{
		padding: 10rpx 0;
	}
	.integral-info{
		display: flex;
		align-items: center;
	}
	.integral-info>view:nth-of-type(1){
		font-size: 34rpx;
		color: #FF6F28;
	}
	.integral-info>view:not(:first-child){
		color: #999999;
	}
	.integral-info>view:nth-of-type(2){
		margin-left: auto;
		margin-right: 10rpx;
	}
</style>
