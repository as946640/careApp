<template>
	<view class="body">
		<form report-submit="true" @submit="formSubmit">
			<view class="balance">账户余额：{{money}}</view>
			<view class="sub-money">
				<text>￥</text><input type="digit" placeholder="输入提现金额" name="cash"/>
			</view>
			<view class="tips">可提现金额{{money>1?'1':'0'}}~{{money}}元</view>
			<view class="way">
				<view>提现方式：默认为微信打款</view>
				<view class="pay-list">
					<view class="pay-item" v-for="(item,index) in pay_list" @tap="selectedPay(item.id)" :class="selected==item.id?'active':''">
						<image class="pay-img" :src="item.icon"></image>
						<view>{{item.name}}</view>
						<image v-if="selected==item.id" class="select-img" src="../../../static/img/mch/icon-share-selected.png" />
					</view>
				</view>
			</view>
			<view class="info" v-if="selected!=0">
				<block v-if="selected==1">
					<view class="name">姓名<text>*</text><input type="text" placeholder="请输入正确姓名" name="name" v-model="name"/></view>
					<view class="account">账户<text>*</text><input type="text" placeholder="请输入正确的微信账号" name="mobile" v-model="mobile"/></view>
				</block>
				<block v-if="selected==2">
					<view class="name">姓名<text>*</text><input type="text" placeholder="请输入正确姓名" name="name" v-model="name"/></view>
					<view class="account">账户<text>*</text><input type="text" placeholder="请输入正确的支付宝账号" name="mobile" v-model="mobile"/></view>
				</block>
				<block v-if="selected==3">
					<view class="name">姓名<text>*</text><input type="text" placeholder="请输入正确姓名" name="name" v-model="name"/></view>
					<view class="account">开户行<text>*</text><input type="text" placeholder="请输入正确的银行名称" name="bank_name" v-model="bank_name"/></view>
					<view class="account">账户<text>*</text><input type="text" placeholder="请输入正确的微信账号" name="mobile" v-model="mobile"/></view>
				</block>
			</view>
			<button form-type="submit" class="sub">提交申请</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:0,
				pay_list:[],
				selected:0,
				name:"",
				bank_name:"",
				mobile:""
			}
		},
		onShow() {
			uni.showLoading({
				title:"正在加载"
			})
			this.$request({
				url:this.$api.mch.user.cash_preview
			}).then((res)=>{
				uni.hideLoading()
				if(res.code == 0){
					this.pay_list = res.data.type_list;
					this.money = res.data.money;
				}
				console.log(res);
			})
		},
		methods: {
			selectedPay(id){
				this.selected = id;
				this.name = "";
				this.mobile = "";
				this.bank_name = "";
			},
			formSubmit(e){
				let cash = parseFloat(parseFloat(e.detail.value.cash).toFixed(2));
				let name = e.detail.value.name;
				let mobile = e.detail.value.mobile;
				let bank_name = e.detail.value.bank_name;
				if(!cash){
					uni.showToast({
						title:"提现金额不能为空",
						icon:"none"
					});
					return;
				}
				if(cash>this.money){
					uni.showToast({
						title:"提现金额不能超过"+this.money+"元",
						icon:"none"
					});
					return;
				}
				if(cash<1){
					uni.showToast({
						title:"提现金额不能小于1元",
						icon:"none"
					});
					return;
				}
				if(this.selected == 1 || this.selected == 2 || this.selected == 3){
					if(!name || name==undefined){
						uni.showToast({
							title:"姓名不能为空",
							icon:"none"
						});
						return;
					}
					if(!mobile || mobile==undefined){
						uni.showToast({
							title:"账户不能为空",
							icon:"none"
						});
						return;
					}
				}
				if(this.selected == 3){
					uni.showToast({
						title:"开户行不能为空",
						icon:"none"
					});
					return;
				}else{
					bank_name = "";
				}
				if (this.selected == 4 || this.selected == 0) {
					bank_name = "";
					mobile = "";
					name = "";
				}
				uni.showLoading({
					title:"正在提交"
				});
				this.$request({
					url:this.$api.mch.user.cash,
					method: 'POST',
					data: {
						cash_val: cash,
						nickname: name,
						account: mobile,
						bank_name: bank_name,
						type: this.selected,
						scene: 'CASH'
					}
				}).then((res) => {
					uni.hideLoading();
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
					if(res.code == 0){
						setTimeout(()=>{
							uni.redirectTo({
								url:"/mch/m/cash-log/cash-log"
							})
						},500);
					}
				})
				console.log(e);
			},
			
			// 暂时没用
			showCashMaxDetail () {
				uni.showModal({
					title: "提示",
					content: "今日剩余提现金额=平台每日可提现金额-今日所有用户提现金额"
				});
			},
	}
	}
</script>

<style scoped>
	.balance{
		background-color: #FFFFFF;
		font-size: 40rpx;
		padding: 25rpx;
		border-top: 1px solid #F0F0F0;
		border-bottom: 1px solid #F0F0F0;
	}
	.sub-money{
		padding: 25rpx;
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		border-bottom: 1px solid #F0F0F0;
	}
	.sub-money>text{
		font-size: 46rpx;
		color: #FF4544;
	}
	.sub-money>input{
		margin-left: 20rpx;
	}
	.tips{
		color: #555555;
		padding: 25rpx;
	}
	.way{
		background-color: #FFFFFF;
		padding: 25rpx;
		font-size: 34rpx;
	}
	.pay-list{
		display: flex;
		margin-top: 30rpx;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 35rpx;
	}
	.pay-item{
		min-width: 140rpx;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 34rpx;
		border: 1px solid #e1e1e1;
		padding: 10rpx 20rpx;
		position: relative;
		margin-bottom: 20rpx;
	}
	.pay-img{
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
	.select-img{
		width: 32rpx;
		height: 32rpx;
		position: absolute;
		right: -2rpx;
		bottom: -2rpx;
	}
	.active{
		border: 1px solid #FF4544;
	}
	.sub{
		width: 85vw;
		height: 90rpx;
		line-height: 90rpx;
		color: #FFFFFF;
		margin-top: 40rpx;
		font-size: 34rpx;
		background-color: #FF4544;
	}
	.info>view{
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		margin-top: 20rpx;
		padding: 25rpx;
		font-size: 36rpx;
	}
	.info>view>text{
		color: #FF4544;
	}
	.info>view>input{
		margin-left: 20rpx;
	}
</style>
