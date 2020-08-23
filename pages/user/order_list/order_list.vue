<template>
	<view>
		<!-- 顶部导航 -->
		<view class="topTabBar" :style="{position:headerPosition,top:headerTop}">
			<view class="grid" v-for="(grid,tbIndex) in orderType" :key="tbIndex" @tap="showType(tbIndex)">
				<view class="text" :class="[tbIndex==tabbarIndex?'on':'']">{{grid}}</view>
			</view>
		</view>
		<!-- 考虑非APP端长列表和复杂的DOM使用scroll-view会卡顿，所以漂浮顶部选项卡使用page本身的滑动 -->
		<view class="order-list">
			<view class="list">
				<view class="onorder" v-if="orderList.length == 0">
					<image src="../../../static/img/noorder.png"></image>
					<view class="text">
						没有相关订单
					</view>
				</view>
				<view class="row" v-for="(row,index) in orderList" :key="index">
					<view class="type flex" v-if="status != 4">
						<view class="order_no flex" v-if="row.mch" @tap="goMerchant">
							{{row.mch.name}}
							<tui-icon name="arrowright" :size="20" color="#000"></tui-icon>
						</view>
						<view class="send" v-if="status == 1||status == 2">
							{{row.is_send ? '卖家已发货' : '等待卖家发货'}}
						</view>
						<view class="send" v-if="status == 0">
							请你立即付款
						</view>
					</view>
					
					<view class="order-info" 
							v-for="(item, index) in row.goods_list" 
							:key="index"
							@tap="goOrder(row)">
						<view class="left">
							<image :src="item.goods_pic"></image>
						</view>
						<view class="right">
							<view class="name">
								{{item.goods_name}}
							</view>
							<view class="spec">
								<block v-for="(attr, index) in item.attr_list" :key="index">
									<text>{{attr.attr_group_name}}:{{attr.attr_name}}</text>
								</block>
							</view>
							<view class="price-number flex">
								<view class="">×{{item.num}}</view>
								<view class="price">￥{{item.price}}</view>
							</view>
						</view>
					</view>
				
					<view class="detail" v-if="status != 4">
						<view class="number">共{{row.goods_list.length}}件商品</view>
						<view class="sum">合计￥<view class="price">{{row.pay_price}}</view>
						</view>
					</view>
					<view class="btns">
						<!-- 待付款 -->
						<block v-if="status == 0 && row.is_pay==0 ">
							<block v-if="row.is_pay==0 && row.pay_type != 2">
								<view class="default" @tap="cancelOrder(row)">{{row.is_pay ? "退款" : "取消"}}</view>
								<view class="pay" @tap="toPayment(row)">付款</view>
							</block>
						</block>
						<!-- 待发货 -->
						<block v-if="status == 1 && row.is_send == 0">
							<block v-if="row.is_send == 0">
								<block v-if="row.is_send==0">
									<view class="default" v-if="row.refund==1" @tap="after(row)">售后详情</view>
									<block v-if="row.apply_delete==1">
										<view class="default">退款申请中</view>
									</block>
									<block v-else>
										<view class="default" @tap="cancelOrder(row)">{{row.is_pay ? "退款" : "取消"}}</view>
									</block>
								</block>
							</block>

						</block>
						<!-- 待收货 -->
						<block v-if="status == 2 && row.is_send == 1">
							<block v-if="row.is_send == 1">
								<view class="default" @tap="showLogistics(row)">查看物流</view>
								<view class="default" v-if="row.refund==1" @tap="after(row)">售后详情</view>
								<view class="pay" @tap="orderConfirm(row.order_id)">确认收货</view>
							</block>
						</block>
						<!-- 待评价 -->
						<block v-if="status == 3">
							<view class="default" @tap="goComment(row.is_comment,row.order_id)">{{row.is_comment ? '已评价' : '评价'}}</view>
							<view class="default" v-if="row.refund==1" @tap="after(row)">售后详情</view>
						</block>
						<!-- 退换货 -->
						<block v-if="status == 4">
							<view class="after" v-if="status == 4">
								<block v-if="row.refund_type==1">
									退货退款：
									<text style="color: #ff4544">￥{{row.refund_price}}</text>
								</block>
								<block v-if="row.refund_type==2">
									换货
								</block>
							</view>
							<!-- 等待处理 -->
							<block v-if="row.refund_status==0">
								<block v-if="row.refund_type==1">
									<block v-if="row.is_agree==0">
										<view class="default">等待处理</view>
									</block>
									<block v-else>
										<block v-if="row.is_user_send==0">
											<view class="default">等待买家发货</view>
										</block>
										<block v-else>
											<view class="default">等待卖家处理</view>
										</block>
									</block>
								</block>
								<block v-else>
									<view class="default">等待卖家处理</view>
								</block>
							</block>
							<!-- 处理完成 -->
							<block v-if="row.refund_status==1">
								<view class="default">已同意并退款</view>
							</block>
							<block v-if="row.refund_status==2">
								<view class="default">已同意退换货</view>
							</block>
							<block v-if="row.refund_status==3">
								<view class="default" v-if="row.refund_type==1">已拒绝退货退款</view>
								<view class="default" v-if="row.refund_type==2">已拒绝换货</view>
							</block>
						</block>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				headerPosition: "fixed",
				headerTop: "0px",
				status: 0,
				typeText: {
					unpaid: '等待付款',
					back: '等待商家发货',
					unreceived: '商家已发货',
					received: '等待用户评价',
					completed: '交易已完成',
					refunds: '商品退货处理中',
					cancelled: '订单已取消'
				},
				orderType: ['待付款', '待发货', '待收货', '已完成', '退换货'],
				//订单列表 
				orderList: [],
				tabbarIndex: 0,
				pay_type_list: [],
				is_no_more:false,
				page:1
			};
		},
		onLoad(option) {
			//option为object类型，会序列化上个页面传递的参数
			console.log(option);
			this.status = option.status
			this.tabbarIndex = option.status
			//兼容H5下排序栏位置
			// #ifdef H5
			let Timer = setInterval(() => {
				let uniHead = document.getElementsByTagName('uni-page-head');
				if (uniHead.length > 0) {
					this.headerTop = uniHead[0].offsetHeight + 'px';
					clearInterval(Timer); //清除定时器
				}
			}, 1);
			// #endif
			console.log(option.status);

			this.loadOrderList(option.status)
		},
		onPageScroll(e) {
			return;
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
		},
		methods: {
			showType(tbIndex) {
				this.tabbarIndex = tbIndex;
				this.status = tbIndex;

				this.loadOrderList(this.status)
			},
			showLogistics(row) {
				console.log(row.order_id);
				uni.navigateTo({
					url:'/pages/express-detail/express-detail?id='+ row.order_id
				})
			},

			// 售后详情
			after(e) {
				uni.navigateTo({
					url:'/pages/user/order_list/order_list?order_id='+e.order_id+ '&&status=4'
				})
			},
			cancelOrder(row) {
				var that = this;
				uni.showModal({
					title: '取消订单',
					content: '确定取消此订单？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.showLoading({
								title: '操作中'
							});
							that.$request({
								url: that.$api.order.revoke,
								data: {
									order_id: row.order_id
								}
							}).then(res => {
								uni.hideLoading()
								uni.showModal({
									title: '提示',
									content: res.msg,
									showCancel: false,
									success: (res) => {
										if (res.confirm) {
											that.loadOrderList(that.status);
										}
									}
								})
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
							return true
						}
					}
				});
			},

			// 确认收货
			orderConfirm(id) {
				uni.showModal({
					title: "提示",
					content: "是否确认已收到货？",
					cancelText: "否",
					confirmText: "是",
					success: (res) => {
						if (res.confirm) {
							console.log('是');
							uni.showLoading({
								title: "操作中"
							});
							this.$request({
								url: this.$api.order.confirm,
								data: {
									order_id: id
								}
							}).then(res => {
								uni.hideLoading()
								uni.showToast({
									title: res.msg
								})
								if (res.code == 0) {
									this.loadOrderList(2)
								}
							})
						} else if (res.cancel) {
							return true;
						}
					}
				})
			},
			//去评价
			goComment(isComment,orderId){
				if(!isComment){
					uni.navigateTo({
						url:"/pages/user/order_list/comment/comment?order_id="+orderId+""
					})
				}
			},
			// 跳转商家
			goMerchant() {
				uni.showToast({
					title: '跳转商家'
				})
			},
			// 跳转详情
			goOrder(row) {
				console.log(row.order_refund_id);
				if(this.status == 4) {
					console.log('进入了');
					uni.navigateTo({
						url:'/pages/after-details/after-details?id='+ row.order_refund_id
					})
				}
				else {
					uni.navigateTo({
						url:'/pages/order-detail/order-detail?id='+ row.order_id
					})
				}
			},
			// 提交订单
			toPayment(row) {
				uni.showLoading({
					title: '正在获取订单...'
				})
				let pay_type_list = JSON.stringify(this.pay_type_list)
				uni.redirectTo({
					   url: "/pages/pay/payment/payment?order_id="+row.order_id+"&pay_type_list=" + pay_type_list+"&new_total_price="+ row.pay_price +"",
					   success:function () {
						   uni.hideLoading()
					   }
      			})
			},
			// 订单数据
			loadOrderList: function(status) {
				if (status == undefined) {
					status = this.tabbarIndex;
				}
				var self = this;
				if(this.is_no_more){
					return;
				}
				uni.showLoading({
					title: "正在加载",
					mask: true,
				});
				this.$request({
					url: this.$api.order.list,
					data: {
						status:status,
						page:this.page
					},
				}).then(res => {
					console.log(res);
					uni.hideLoading()
					if (res.code == 0) {
						self.orderList = res.data.list,
						self.pay_type_list = res.data.pay_type_list
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}

	.topTabBar {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #FFFFFF;
		height: 80upx;
		display: flex;
		justify-content: space-around;

		.grid {
			width: 20%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #828282;
			font-size: 28upx;

			.text {
				height: 76upx;
				display: flex;
				align-items: center;

				&.on {
					color: #000;
					border-bottom: solid 4upx #134AFF;
				}
			}

		}
	}

	.order-list {
		margin-top: 80upx;
		padding-top: 20upx;
		width: 100%;

		.list {
			width: 94%;
			margin: 0 auto;

			.onorder {
				width: 100%;
				height: 50vw;
				display: flex;
				justify-content: center;
				align-content: center;
				flex-wrap: wrap;

				image {
					width: 20vw;
					height: 20vw;
					border-radius: 100%;
				}

				.text {
					width: 100%;
					height: 60upx;
					font-size: 28upx;
					color: #444;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.row {
				width: calc(100% - 40upx);
				padding: 10upx 20upx;
				border-radius: 10upx;
				background-color: #fff;
				margin-bottom: 20upx;

				.type {
					font-size: 26upx;
					height: 60upx;
					padding-top: 10rpx;
					box-sizing: border-box;

					.order_no {
						width: 50%;
						padding-left: 15upx;
						font-size: 11pt;

						font-weight: 600;
					}

					.send {
						width: 50%;
						text-align: right;
						color: #ECB521;
					}
				}

				.order-info {
					width: 100%;
					display: flex;
					padding-top: 10rpx;
					padding-bottom: 10rpx;

					.left {
						flex-shrink: 0;
						width: 25vw;
						height: 25vw;

						image {
							width: 25vw;
							height: 25vw;
							border-radius: 10upx;
						}
					}

					.right {
						width: 100%;
						margin-left: 10upx;
						position: relative;

						.name {
							width: 80%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}

						.spec {
							color: #a7a7a7;
							font-size: 22upx;
							margin-top: 10rpx;

							text:last-child {
								margin-left: 20upx;
							}
						}

						.price-number {
							position: absolute;
							bottom: 0;
							width: 100%;
							display: flex;
							justify-content: flex-end;
							font-size: 22upx;
							color: #333;
							display: flex;
							align-items: flex-end;

							view {
								width: 50%;
							}

							.price {
								font-size: 24upx;
								text-align: right;
								margin-right: 5upx;
							}

						}
					}
				}

				.detail {
					display: flex;
					justify-content: flex-end;
					align-items: flex-end;
					height: 60upx;
					font-size: 26upx;
					color: #000;
					font-weight: 600;
					.sum {
						padding: 0 8upx;
						display: flex;
						align-items: flex-end;

						.price {
							font-size: 30upx;
						}
					}

				}

				.btns {
					height: 80upx;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					view {
						min-width: 120upx;
						height: 50upx;
						padding: 0 20upx;
						border-radius: 10rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28upx;
						margin-left: 20upx;
					}

					.default {
						border: solid 1upx #ccc;
						color: #666;
					}

					.pay {
						border: solid 1upx #ECB421;
						color: #ECB421;
					}

					.after {
						border: 1px solid #eee;
					}
				}
			}
		}
	}
</style>
