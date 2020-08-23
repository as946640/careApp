<template>
	<view class="pages">
		<view class="goods flex">
			<view class="left">
				<image :src="order.goods_pic" mode="widthFix"></image>
			</view>
			<view class="right">
				<view class="title">
					{{order.name}}
				</view>
				<view class="flex attrs flex-y-center">
					<view class="attr" v-for="(item, index) in order.attr" :key="index">
						<text>{{item.attr_group_name}}:{{item.attr_name}}</text>
					</view>
					<view class="num flex-y-center">
						<text>×{{order.num}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="tab">
			<view class="container">
				<tui-tabs id="tab" :tabs="navbar" unlined :currentTab="currentTab>1?0:currentTab" @change="change" itemWidth="50%"
				 selectedColor="#F06C7A" sliderBgColor="#F06C7A"></tui-tabs>
			</view>
		</view>
		<!-- 退换货原因 -->
		<view class="cause flex" v-if="currentTab == 0">
			<view class="left flex-y-center">
				退款原因
			</view>
			<view class="right">
				<textarea ref="text" placeholder="请输入退款原因" rows="2" @input="descInput" v-model="text" :data-type="1"> </textarea>
			</view>
		</view>
		<view class="cause flex" v-if="currentTab == 1">
			<view class="left flex-y-center">
				换货原因
			</view>
			<view class="right">
				<textarea ref="text" v-model="text" placeholder="请输入换货原因" rows="2" @input="descInput" :data-type="2"> </textarea>
			</view>
		</view>
		<!-- 退款金额 -->
		<view class="price" v-if="currentTab == 0">
			<text>退款金额</text>
			<text style="padding-left: 30rpx; color: #FF4544;">￥{{order.max_refund_price}}</text>
		</view>
		<view class="voucher">
			<view class="tui-box-upload">
				<tui-upload :serverUrl="serverUrl" :limit="6" @complete="result" fileKeyName="image" @remove="remove"></tui-upload>
			</view>
		</view>
		<view class="food">
			<form v-if="currentTab == 0" :data-type="1" report-submit="true" @submit="refundSubmit">
				<button form-type="submit">提交</button>
			</form>
			<form v-if="currentTab == 1" :data-type="2" report-submit="true" @submit="refundSubmit">
				<button form-type="submit">提交</button>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: {},
				navbar: [{
					name: "退货退款"
				}, {
					name: "仅换货"
				}],
				text: '',
				currentTab: 0,
				currentPage: null,
				refund_data: {},
				//上传地址
				serverUrl: '',
				pageType: ''
			}
		},
		onLoad: function(options) {

			this.serverUrl = this.$api.default.upload_image;

			console.log(options);
			this.getGoods(options.id)
		},
		methods: {
			getGoods(id) {
				this.$request({
					url: this.$api.order.refund_preview,
					data: {
						order_detail_id: id
					}
				}).then(res => {
					console.log(res);
					this.order = res.data;
				})
			},
			change(e) {
				this.currentTab = e.index
				if (this.currentTab != 1) {
					this.text = ''
					this.refund_data.desc = '';
				}
				if (this.currentTab != 2) {
					this.text = ''
					this.refund_data.desc = '';
				}
			},
			descInput(e) {
				let type = e.currentTarget.dataset.type;
				let value = e.detail.value;
				if (type == 1) {
					this.refund_data.desc = this.text
				}
				if (type == 2) {
					this.refund_data.desc = this.text
				}
			},
			// 存储上传的img
			result(e) {
				this.refund_data.imgArr = e.imgArr;
				console.log(this.refund_data);
			},
			// 提交
			refundSubmit(e) {
				console.log(e);
				var that = this;
				var type = e.currentTarget.dataset.type;

				var pic_url_list = [];
				var pic_complete_count = 0;
				var httpUrl = that.$api.order.refund;
				var navigateToUrl = '';
				var pageType = that.pageType;
				var orderType = 'STORE';

				// 退货退款
				if (type == 1) {
					var desc = that.refund_data.desc || "";
					var pic_list = that.refund_data.imgArr || "";
					if (desc.length == 0) {
						uni.showToast({
							title: '请填写退货退款原因'
						});
						return
					}
					if (pic_list.length == 0) {
						uni.showToast({
							title: '请上传凭证',
							mask: true
						});
					} else {
						_submit()
						console.log(desc);
					}

					function _submit() {
						uni.showLoading({
							title: '正在提交'
						});
						that.$request({
							url: httpUrl,
							method: 'post',
							data: {
								type: 1,
								order_detail_id: that.order.order_detail_id,
								desc: desc,
								pic_list: JSON.stringify(pic_list),
								orderType: orderType
							}
						}).then(res => {
							uni.showToast({
								title: res.msg
							})
							uni.hideLoading()
							uni.navigateBack()
						})
					}

				}

				if (type == 2) {
					//换货
					var desc = that.refund_data.desc || "";
					var pic_list = that.refund_data.imgArr || "";
					if (desc.length == 0) {
						uni.showToast({
							title: "请填写换货说明"
						});
						return;
					}
					//如果有图片先上传图片
					if (pic_list.length == 0) {
						uni.showToast({
							title: '请上传凭证',
							mask: true
						});
					} else {
						_submit()
						console.log(desc);
					}

					function _submit() {
						uni.showLoading({
							title: "正在提交",
							mask: true,
						});

						that.$request({
							url: httpUrl,
							method: "post",
							data: {
								type: 2,
								order_detail_id: that.order.order_detail_id,
								desc: desc,
								pic_list: JSON.stringify(pic_url_list),
							}
						}).then(res => {
							uni.hideLoading();
							if (res.code == 0) {
								uni.showModal({
									title: "提示",
									content: res.msg,
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											uni.redirectTo({
												url: navigateToUrl
											});
										}
									}
								});
							}
							if (res.code == 1) {
								uni.showModal({
									title: "提示",
									content: res.msg,
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											getApp().core.navigateBack({
												delta: 2,
											});
										}
									}
								});
							}

						})
					}
				}
				/*--换货结束--*/

			}

		}
	}
</script>

<style lang="scss">
	$bgc:#F06C7A;

	.pages {
		height: 100vh;
		background-color: #eee;
		padding-top: 10px;
		box-sizing: border-box;
	}

	.goods {
		width: 98%;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #fff;
		margin: 0 auto;
		border-radius: 20rpx;

		.left {
			width: 30%;
			min-width: 30%;
			padding: 10rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.right {
			min-width: 70%;
			padding: 10rpx;

			.title {
				width: 80%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}

			.attrs {
				font-size: 8pt;
				width: 80%;
				text-align: center;
			}

			.num {
				padding-left: 15%;
				align-items: center;
				margin-top: 5%;
			}

			.attr {
				width: 80%;
				height: 50%;
				margin-top: 5%;
				text-align: left;

				text {
					flex: 1;
					white-space: nowrap;
				}
			}
		}
	}

	.tab {
		.container {
			width: 97% !important;
			padding: 5rpx;
			margin: 20rpx auto;
			border-radius: 10rpx !important;
				#tab {
					z-index: 1;
				}
		}
	}

	.cause {
		width: 95%;
		background-color: #fff;
		border-radius: 10rpx;
		margin: 20rpx auto;
		padding: 20rpx;
		box-sizing: border-box;

		.left {
			min-width: 30%;
		}

		.right {
			height: 300rpx;
			overflow: hidden;
		}
	}

	.price {
		width: 94%;
		height: 90rpx;
		margin: 0 auto;
		font-size: 11pt;
		line-height: 90rpx;
		border-radius: 10rpx;
		padding-left: 20rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
	}

	.voucher {
		width: 94%;
		padding: 20rpx;
		margin: 10rpx auto;
		box-sizing: border-box;
		background-color: #fff;

		.img-list {
			image {
				width: 160rpx;
				height: 160rpx;
			}
		}

		image {
			width: 160rpx;
			height: 160rpx;
		}
	}

	.food {
		width: 94%;
		background-color: $bgc;
		border-radius: 10rpx;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 20rpx;

		button {
			color: #fff;
			background-color: $bgc;
			border-radius: 10rpx;
		}
	}
</style>
