<template>
	<view>
		<view class="block">
			<view class="content">
				<view class="orderinfo">
					<!-- <view class="row">
						<view class="nominal">订单名称:</view><view class="text">{{orderName}}</view>
					</view> -->
					<view class="row">
						<view class="nominal">订单金额:</view>
						<view class="text">{{new_total_price}}元</view>
					</view>
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				选择支付方式
			</view>
			<view class="content">
				<view class="pay-list">
					<view class="row" @tap="payment=item.payment" v-for="(item,index) in pay_type_list">
						<view class="left">
							<image :src="item.icon"></image>
						</view>
						<view class="center">
							{{item.name}}
						</view>
						<view class="right">
							<radio :checked="payment==item.payment" color="#f06c7a" />
						</view>
					</view>
					<!-- <view class="row" @tap="paytype='wxpay'">
							<view class="left">
								<image src="/static/img/wxpay.png"></image>
							</view>
							<view class="center">
								微信支付
							</view>
							<view class="right">
								<radio :checked="paytype=='wxpay'" color="#f06c7a" />
							</view>
					</view> -->
				</view>
			</view>
		</view>
		<view class="pay">
			<view class="btn" @tap="doDeposit">立即支付</view>
			<view class="tis">
				点击立即支付，即代表您同意<view class="terms">
					《条款协议》
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount: 0,
				payment: 0, //支付类型
				mch_list: [],
				pay_type_list: [],
				address_id: 0,
				new_total_price: 0,//订单金额
				user_info:{} ,//用户信息
				order_id:0 ,//商品id
				order_id_list:[]
			};
		},
		onLoad(options) {
			console.log(options);
			this.pay_type_list = JSON.parse(options.pay_type_list);
			if(options.order_id == undefined){
				this.order_id = 0;
			}else{
				this.order_id = options.order_id;
			}
			if(options.order_id_list == undefined){
				this.order_id_list = "";
			}else{
				this.order_id_list = options.order_id_list;
			}
			this.new_total_price = options.new_total_price;
			// this.mch_list = JSON.parse(options.mch_list);
			// this.pay_type_list = JSON.parse(options.pay_type_list);
			// this.address_id = options.address_id;
			// this.sum_price = options.sum_price;

			this.getUser();
		},
		methods: {
			doDeposit() {
				let self = this;
				// 判断是否为余额支付
				if (self.payment == 3) {
					let pay_type = "BALANCE_PAY";
					uni.showModal({
						title: '当前账户余额：'+self.user_info.money,
						content: '是否确定使用余额支付',
						success: function(e) {
							if (e.confirm) {
								self.submit_pay(pay_type);
							}
						}
					})
				} else {
					self.submit_pay();
				}
			},


			// 用户中心数据
			getUser() {
				this.$request({
					url: this.$api.user.index
				}).then(res => {
					console.log(res);
					if(res.code == 0){
						this.user_info = res.data.user_info;
					}
					if(res.code == 1){
						uni.showModal({
							title:"提示",
							content:res.msg,
							showCancel:false
						});
					}
				})
			},


			// submit_pay() {
			// 	uni.showLoading({
			// 		title: "正在提交",
			// 		mask: true,
			// 	});
			// 	//提交订单
			// 	this.$request({
			// 		url: this.$api.order.new_submit,
			// 		method: "POST",
			// 		data: {
			// 			address_id: this.address_id, //地址id
			// 			mch_list: JSON.stringify(this.mch_list), //订单信息列表
			// 			payment: this.payment,
			// 			use_integral: 1,
			// 			formId: undefined
			// 		}
			// 	}).then(res => {
			// 		uni.hideLoading();
			// 		console.log(res);
			// 	});
			// }


			submit_pay(pay_type) {
				uni.showLoading({
					title: "正在提交",
					mask: true,
				});
				//提交订单
				console.log(this.order_id);
				this.$request({
					url: this.$api.order.pay_data,
					method: "get",
					data: {
						order_id: this.order_id || "",
						order_id_list: this.order_id_list || "",
						pay_type: pay_type,
						form_id: undefined,
						parent_user_id: 0,
						condition: 2
					}
				}).then(res => {
					uni.hideLoading();
					console.log(res);
				});
			}
		}
	}
</script>

<style lang="scss">
	.block {
		width: 94%;
		padding: 0 3% 40upx 3%;

		.title {
			width: 100%;
			font-size: 34upx;
		}

		.content {
			.orderinfo {
				width: 100%;
				border-bottom: solid 1upx #eee;

				.row {
					width: 100%;
					height: 90upx;
					display: flex;
					align-items: center;

					.nominal {
						flex-shrink: 0;
						font-size: 32upx;
						color: #7d7d7d;
					}

					.text {
						width: 70%;
						margin-left: 10upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size: 32upx;
					}
				}
			}

			.pay-list {
				width: 100%;
				border-bottom: solid 1upx #eee;

				.row {
					width: 100%;
					height: 120upx;
					display: flex;
					align-items: center;

					.left {
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						align-items: center;

						image {
							width: 80upx;
							height: 80upx;
						}
					}

					.center {
						width: 100%;
						font-size: 30upx;
					}

					.right {
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}

	.pay {
		margin-top: 20upx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		.btn {
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			background-color: #f06c7a;
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.2);
		}

		.tis {
			margin-top: 10upx;
			width: 100%;
			font-size: 24upx;
			display: flex;
			justify-content: center;
			align-items: baseline;
			color: #999;

			.terms {
				color: #5a9ef7;
			}
		}
	}
</style>
