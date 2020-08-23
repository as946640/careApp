<template>
	<view class="body">
		<view class="header" style="background-image: url(../../static/img/user/huiyuan-bg.png);">
			<view class="header-img">
				<image src="/static/img/face.jpg"></image>
			</view>
			<view class="nickname">阿森</view>
			<view class="progress">
				<schedule :percent="42" :show-info="false" stroke-color="#E5AB2F" :stroke-width='5' :success-percent="info.percent" status="active"></schedule>
			</view>
			<view class="consumption">已经消费150元 升级还需要220元</view>
			<view class="level">
				<tui-icon name="member-fill" :size="26" color="#E5AB2F"></tui-icon>
				<view>二级会员</view>
			</view>
		</view>
		<view class="money">
			<view>账户余额500元</view>
			<view><navigator url="/pages/user/deposit/deposit">充值</navigator></view>
		</view>
		<view class="discount-box">
			<view class="discount">
				<tui-icon name="member-fill" :size="26" color="#E5AB2F"></tui-icon>
				<view>我的会员权益</view>
			</view>
			<view class="discount-item">折扣9.5折</view>
		</view>
	</view>
</template>

<script>
	import schedule from '@/components/cmd-progress/cmd-progress.vue'
	export default{
		components:{
			schedule
		},
		data(){
			return{
				info:{},
				user_info:{},
				now_level:{}
			}
		},
		onLoad() {
			uni.showLoading({
				title:"加载中"
			});
			this.$request({
				url: this.$api.user.member,
				method: 'POST'
			}).then((res)=>{
				console.log(res);
				uni.hideLoading();
				if (res.code == 0) {
					this.info = res.data;
					this.user_info = res.data.user_info;
					this.now_level = res.data.now_level;
				}
			})
		},
	}
</script>

<style>
	.header{
		width: 100%;
		padding-top: 40rpx;
		background-color: #F06C7A;
		position: relative;
		background-position: top center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		padding-bottom: 30rpx;
	}
	.header-img{
		width: 120rpx;
		height: 120rpx;
		margin: auto;
	}
	.header-img>image{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 1px solid #FFFFFF;
	}
	.nickname{
		text-align: center;
		width: 100%;
		font-size: 34rpx;
		color: #FFFFFF;
		padding-top: 10rpx;
		padding-bottom:0rpx ;
	}
	.progress{
		width: 500rpx;
		margin: auto;
	}
	.consumption{
		text-align: center;
		color: #FFFFFF;
	}
	.money{
		display: flex;
		background-color: #3B312C;
		color:#FFFFFF;
		padding: 20rpx;
		box-sizing: border-box;
		align-items: center;
	}
	.money>view:nth-of-type(2){
		margin-left: auto;
		border: 1px solid #FFFFFF;
		border-radius: 100rpx;
		padding: 5rpx 20rpx;
	}
	.level{
		position: absolute;
		right: 0;
		top: 70rpx;
		font-size: 30rpx;
		display: flex;
		align-items: center;
		background-color: #3C3642;
		color: #FFFFFF;
		padding-bottom: 5rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}
	.discount-box{
		background-color: #FFFFFF;
	}
	.discount{
		display: flex;
		align-items: center;
		border-top: 1px solid #F0F0F0;
		padding: 10rpx;
	}
	.discount-item{
		padding: 20rpx;
		border-top: 1px solid #F0F0F0;
	}
</style>
