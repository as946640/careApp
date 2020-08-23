<template>
	<view class="pages">
		<!-- 售后状态 -->
		<!-- 换货 -->
		<block v-if="order_refund.refund_type==1">
			<block v-if="order_refund.refund_status==0">
				<block v-if="order_refund.is_agree==0">
					<view class="after">等待审核中</view>
				</block>
				<block v-else>
					<block v-if="order_refund.is_user_send==0">
						<view class="after">已同意换货，请及时发货</view>
					</block>
					<block v-else>
						<view class="after">已发货，待平台确认</view>
					</block>
				</block>
			</block>
			<block v-if="order_refund.refund_status==1">
				<view class="after">已同意退货并已退款</view>
			</block>
			<block v-if="order_refund.refund_status==3">
				<view class="after">已拒绝退货</view>
			</block>
		</block>
		<!-- 换货 -->
		<block v-else>
			<block v-if="order_refund.refund_status==0">
				<view class="after">等待审核中</view>
			</block>
			<block v-if="order_refund.refund_status==2">
				<view class="after">已同意换货</view>
			</block>
			<block v-if="order_refund.refund_status==3">
				<view class="after">已拒绝换货</view>
			</block>
		</block>
		<!-- 收件人信息 -->
		<view class="user_info" v-if="(order_refund.refund_type==1 && order_refund.refund_status==0 && order_refund.is_agree!=0) || order_refund.refund_status==2">
			<view class="name">收件人信息</view>
			<view class="user flex">
				<text>{{order_refund.re_name}}</text>
				<text>{{order_refund.re_mobile}}</text>
			</view>
			<view class="dizhi">{{order_refund.re_address}}</view>
			<view class="tishi">
				<text>未与卖家协商一致情况下，请勿寄到付或者平邮</text>
				<text>请填写真实有效物流信息</text>
			</view>
		</view>
		<!-- 快递 -->
		<form @submit="sendFormSubmit" report-submit="true">
			<block v-if="order_refund.is_agree==1">
				<block v-if="order_refund.is_user_send==0">
					<view class="exporess">
						<view class="item flex">
							<tui-list-cell unlined :hover="false" :radius="true" :arrow="true">
								<view class="flex">
									<text>快递公司：</text>
									<view class="picker">
										<picker @change="bindPickerChange" mode="selector" value="index" :range="array" range-key="name">
											<block v-if="index!==null">
												<view class="uni-input">{{array[index].name}}</view>
											</block>
											<block v-else>
												<view class="uni-input">请选择快递公司</view>
											</block>
										</picker>
									</view>
								</view>
							</tui-list-cell>
						</view>
						<view class="item flex">
							<tui-list-cell unlined :radius="true">
								<view class="flex">
									<text>快递单号：</text>
									<input name="express_no" v-model="express.odd" placeholder="请填写快递单号" />
								</view>
							</tui-list-cell>
						</view>
					</view>
				</block>
				<block v-else>
					<!-- 已发货 -->
					<view class="exporess">
						<view class="item">
							<tui-list-cell unlined :radius="true">
								<view class="flex">
									<text>快递公司</text>
									<text style="padding-left: 20rpx">{{order_refund.user_send_express}}</text>
								</view>
							</tui-list-cell>
							<tui-list-cell unlined :radius="true">
								<view class="flex">
									<text>快递单号：</text>
									<text style="padding-left: 20rpx">{{order_refund.user_send_express_no}}</text>
								</view>
							</tui-list-cell>
						</view>
					</view>
				</block>
			</block>

			<!-- 商品信息 -->
			<view class="goods">
				<view class="flex">
					<view class="left">
						<image :src="order_refund.goods_pic" alt />
					</view>
					<view class="right">
						<view class="name">{{order_refund.name}}</view>
						<view class="attr flex">
							<view class>
								<text style="display: block;" v-for="(attr,index) in order_refund.attr" :key="attr.id">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
							</view>
							<view class="flex-y-center">
								<text>×{{order_refund.num}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 售后描述 -->
			<view class="describe">
				<view class="list">
					<text>售后类型：</text>
					<text style="padding-left: 20rpx">{{order_refund.refund_type==1?'退货退款':'换货'}}</text>
				</view>
				<view class="list">
					<text>退款金额：</text>
					<text style="padding-left: 20rpx; color:#FF4544">￥{{order_refund.refund_price}}</text>
				</view>
				<view class="list">
					<text>申请原因:</text>
					<text style="padding-left: 20rpx">{{order_refund.refund_desc}}</text>
				</view>
				<view class="list" v-if="order_refund.refund_status == 3">
					<text>拒绝原因：:</text>
					<text style="padding-left: 20rpx">{{order_refund.refuse_desc}}</text>
				</view>
				<view class="descImg flex flex-row">
					<view class v-for="(item, index) in order_refund.refund_pic_list" :key="index">
						<image :src="item" alt />
					</view>
				</view>
			</view>
			<view class="food" v-if="order_refund.is_agree==1 && order_refund.is_user_send==0">
				<button formType="submit">确认发货</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: null,
				array: [],
				order_refund: {},
				express: {}

			};
		},
		onLoad: function(options) {
			console.log(options.id);
			this.getShouh(options.id);
		},
		methods: {
			bindPickerChange: function(e) {
				console.log(e);
				this.index = e.target.value;
			},
			getShouh(id) {
				this.$request({
					url: this.$api.order.refund_detail,
					data: {
						order_refund_id: id,
					},
				}).then((res) => {
					console.log(res);
					this.array = res.data.express_list;
					this.order_refund = res.data;
				});
			},
			// 确认发货
			sendFormSubmit(e) {
				var data = {
					order_refund_id: this.order_refund.order_refund_id,
					express: this.order_refund.express_list[this.index].name,
					express_no: this.express.odd,
					orderType: 'STORE'
				}

				this.$request({
					url: this.$api.order.refund_send,
					method: 'post',
					data: data
				}).then(res => {
					console.log(e);
					uni.showModal({
						title: '提示',
						content: res.msg,
						showCancel: false,
						success: (e) => {
							if (res.code == 0) {
								uni.redirectTo({
									url: '/pages/user/order_list/order_list?status=4'
								});
							}
						}
					});
				})
			},
		},
	};
</script>

<style lang="scss" sped>
	$bgc: #f06c7a;

	.pages {
		background-color: #eee;
		height: 100vh;
		padding-bottom: 80rpx;

		.after {
			width: 94%;
			height: 150rpx;
			margin: 20rpx auto;
			padding-left: 10%;
			line-height: 150rpx;
			color: #fff;
			box-sizing: border-box;
			background-size: 100%;
			background-image: url(http://gc.sinbel.cn/web/statics/images/order-refund-status-bg.png);
			border-radius: 20rpx;
		}

		.user_info {
			width: 94%;
			background-color: #fff;
			margin: 20rpx auto;
			font-size: 11pt;
			padding-left: 20rpx;
			box-sizing: border-box;
			border-radius: 20rpx;

			view {
				height: 60rpx;
				line-height: 60rpx;
			}

			.name {
				width: 100%;
				color: #bababa;
			}

			.user {
				width: 100%;

				text {
					width: 50%;
					margin-top: 10rpx;
				}
			}

			.dizhi {
				border-bottom: 1px solid #eee;
			}

			.tishi {
				height: 100%;
				color: #bababa;
				line-height: 40rpx;
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				font-size: 9pt;

				text {
					display: block;
				}
			}
		}

		.exporess {
			width: 94%;
			margin: 20rpx auto;
			background-color: #fff;
			border-radius: 20rpx;

			.item {
				.picker {
					width: 70%;
				}

				text:last-child {
					margin-right: 20rpx;
				}

				input {
					margin-left: 10rpx;
					width: 70%;
					font-size: 11pt;
				}
			}
		}

		.goods {
			width: 94%;
			margin: 20rpx auto;
			background-color: #fff;
			padding: 20rpx;
			border-radius: 20rpx;
			box-sizing: border-box;

			.left {
				width: 40%;
				border-radius: 20rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
			}

			.right {
				width: 100%;
				padding: 10rpx;
				padding-top: 0;
				padding-right: 30rpx;
				box-sizing: border-box;

				.name {
					height: 70rpx;
					font-size: 10pt;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				view {
					width: 100%;
					height: 60%;
					padding-top: 10rpx;
					font-size: 10pt;
				}

				.attr {
					view {
						width: 80%;
					}

					view:last-child {
						width: 20%;
						text-align: right;
					}
				}
			}
		}

		.describe {
			width: 94%;
			margin: 20rpx auto;
			background-color: #fff;
			border-radius: 20rpx;
			font-size: 10pt;
			padding: 20rpx;
			box-sizing: border-box;

			.list {
				width: 100%;
				height: 60rpx;
			}

			.descImg {
				width: 100%;
				height: 100%;
				flex-wrap: wrap;
				margin-top: 20rpx;

				view {
					width: 200rpx;
					min-width: 200rpx;
					height: 200rpx;
					margin-right: 10rpx;
					margin-bottom: 20rpx;

					image {
						width: 200rpx;
						height: 200rpx;
					}
				}

				image:last-child {
					margin-right: 0;
				}
			}
		}

		.food {
			width: 94%;
			height: 80rpx;
			margin: 20rpx auto;
			border-radius: 20rpx;
			background-color: $bgc;
			position: fixed;
			left: 50%;
			transform: translateX(-50%);
			bottom: 20rpx;

			button {
				background-color: $bgc;
				color: #fff;
			}
		}
	}
</style>
