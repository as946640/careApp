<template>
	<view class="pages">
		<view class="send flex flex-y-center">
			<view class="right">
				{{order.status}}
			</view>
			<view class="left">
				<image src="" mode="widthFix"></image>
			</view>
		</view>
		
		<!-- 用户信息 -->
		<view class="user flex flex-y-center">
			<view class="right">
				<image src="/static/img/user/order/linkman.png" mode="widthFix"></image>
			</view>
			<view class="left">
				<view class="user_linkman flex">
					<view class="">
						联系人：{{order.name}}
					</view>
					<view class="">
						{{order.mobile}}
					</view>
				</view>
				<view class="">
					地址：{{order.address}}
				</view>
			</view>
		</view>
		
		<!-- 快递信息 -->
		<block v-if="order.express">
			<view class="expressage flex flex-y-center" @tap="goExpressage">
				<view class="right">
					<image src="/static/img/user/order/expressage.png" mode="widthFix"></image>
				</view>
				<view class="left">
					<view class="">
						快递公司：{{order.express}}
					</view>
					<view class="">
						快递单号：{{order.express_no}}
					</view>
					<view class="go_right">
						<tui-icon name="arrowright" :size="25"></tui-icon>
					</view>
				</view>
			</view>
		</block>
		<!-- 订单信息 -->
		<block >
			<view class="expressage flex flex-y-center">
				<view class="right">
					<image src="/static/img/user/order/tree-round (2).png" mode="widthFix"></image>
				</view>
				<view class="left">
					<view class="">
						订单编号：{{order.order_no}}
					</view>
					<view class="">
						下单时间：{{order.addtime}}
					</view>
				</view>
			</view>
		</block>
		
		<!-- 商品信息 -->
		<view class="order">
			<view class="order_info" v-for="(item, index) in order.goods_list" :key="index">
				<view class="flex">
					<view class="left"  @tap="goOrder(item.goods_id)">
						<image :src="item.goods_pic" mode="aspectFill"></image>
					</view>
					<view class="right">
						<view class="goods_title">
							{{item.name}}
						</view>
						<view class="attr">
							<text v-for="(attr, index) in item.attr" :key="index">{{attr.attr_group_name}}:{{attr.attr_name}}</text>
						</view>
						<view class="price">
							<view>×{{item.num}}</view>
							<view>￥{{item.total_price}}</view>
						</view>

						<view class="bottom flex flex-y-bottom">
							<view class="btnitem " v-if="item.is_level && item.is_level == 1">
								<tui-tag size="20rpx"  type="light-brownish">会员折扣</tui-tag>
							</view>
							<view class="btnitem" v-if="item.order_refund_enable==1">
								<view v-if="item.is_order_refund==0" @tap="after(item.order_detail_id)"><tui-tag size="20rpx"  type="danger">申请售后</tui-tag></view>
								<view v-if="item.is_order_refund==1"><tui-tag size="24rpx"  type="light-green" >已申请售后</tui-tag></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 订单信息 -->
		<view class="goods">
			<view class="order_list">
				<view class="list flex">
					<view class="">
						商品总额
					</view>
					<view class="">
						{{order.goods_total_price}}
					</view>
				</view>
				<view class="list flex">
					<view class="">
						商品数量
					</view>
					<view class="">
						×{{order.num}}
					</view>
				</view>
				<view class="list flex" v-if="order.user_coupon_id">
					<view class="">
						优惠卷优惠
					</view>
					<view class="">
						{{order.coupon_sub_price}}
					</view>
				</view>
				<view class="list flex" v-if="order.integral && order.integral.forehead > 0">
					<view class="">
						积分抵扣
					</view>
					<view class="">
						-￥{{order.integral.forehead}}
					</view>
				</view>
				<view class="list flex" v-if="order.discount<10 && order.discount">
					<view class="">
						会员折扣
					</view>
					<view class="">
						{{order.discount}}折
					</view>
				</view>
				<view class="list flex">
					<view class="">
						运费
					</view>
					<view class="">
						{{order.express_price}}
					</view>
				</view>
				<view class="list flex" v-if="order.content">
					<view class="left">
						买家留言
					</view>
					<view class="">

					</view>
				</view>
				<view class="list flex" v-if="order.content">
					<view class="left">
						{{order.content}}
					</view>
				</view>
			</view>
			<view class="sum">
				合计：<text style="color: #FF4544; font-weight: 600; font-size: 12pt;">￥{{order.pay_price}}</text>
			</view>
		</view>
		<!-- 底部状态 -->
		<view class="btn flex " v-if="order.apply_delete">
			<view class="btnitem" v-if="order.is_send==0 && order.apply_delete==1">
				退款申请中
			</view>
			<view class="btnitem" v-if="order.is_send==0 && order.is_pay == 1 && order.apply_delete == 0" @tap="orderRevoke(order.order_id)">
				申请退款
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order_id: '',
				bgc:'http://gc.sinbel.cn/web/statics//wxapp/images/img-order-status-bar.png',
				order: {}
			}
		},
		onLoad: function(options) {
			console.log(options);
			this.order_id = options.id
			this.getOrder()
		},
		onShow:function() {
			this.getOrder()
		},
		methods: {
			// 获取订单数据
			getOrder() {
				this.$request({
					url: this.$api.order.detail,
					data: {
						order_id: this.order_id
					}
				}).then(res => {
					this.order = res.data;
				})
			},
			// 申请售后
			after(id) {
				console.log(id);
				uni.navigateTo({
					url: '/pages/order-refund-detail/order-refund-detail?id=' + id
				})
			},
			// 申请退款
			orderRevoke(id) {
				console.log(id);
			},
			// 跳转商品
			goOrder(cid) {
				uni.navigateTo({
					url: '/pages/goods/goods?cid=' + cid
				})
				console.log(id);
			},
			// 物流
			goExpressage() {
				uni.navigateTo({
					url: '/pages/express-detail/express-detail?id=' + this.order.order_id + '&order_type=' + this.order.order_type
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #EEEEEE;
	}
	.pages {
		font-size: 11pt;
		width: 94%;
		margin: 20rpx auto;
		padding-bottom:15%;
	

	.send {
		font-size: 12pt;
		color: #fff;
		background-size: 100%;
		background-image: url(http://gc.sinbel.cn/web/statics//wxapp/images/img-order-status-bar.png);
		
		padding: 50rpx;
		border-radius: 15rpx;
		.left {
			width: 60%;

			image {
				width: 100rpx;
				height: 100rpx;
				display: block;
				margin-left: auto;
			}
		}
	}

	.expressage {
		line-height: 50rpx;
		padding: 20rpx;
		position: relative;
		background-color: #FFFFFF;
		margin: 20rpx auto;
		border-radius: 15rpx;

		.right {
			width: 15%;
			padding: 10rpx;
			box-sizing: border-box;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.go_right {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 20rpx;
		}
	}

	.user {
		padding: 20rpx;
		background-color: #FFFFFF;
		margin: 20rpx 0;
		border-radius: 15rpx;

		.right {
			width: 15%;
			padding: 5px;
			box-sizing: border-box;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.user_linkman {
			view {
				width: 100%;
			}

			view:last-child {
				text-align: right;
			}
		}
	}

	.order {
		padding: 20rpx;
		height: 100%;
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		border-radius: 15rpx;
		background-color: #fff;

		.order_info {
			width: 100%;

			font-size: 10pt;
			background-color: #FFFFFF;

			.left {
				
				width: 200rpx;
				height: 200rpx;

				image {
					width: 200rpx;
					height: 200rpx;
				}

			}

			.right {
				flex: 1;
				font-size: 10pt;
				padding: 10rpx;
				margin-left: 30rpx;
				box-sizing: border-box;

				.goods_title {
					width: 90%;
					font-size: 11pt;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.attr {
					color: #BCBCBC;
					width: 95%;
					font-size: 30rpx;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}

				.price {
					display: flex;
					margin-top: 15%;
					font-size: 11pt;
					text-align: right;
					view:nth-of-type(2){
						margin-left: auto;
						color: #FF5756;
					}
				}
			}

			.bottom {
				width: 100%;
				display: flex;
				margin-top: 10rpx;
				justify-content: flex-end;
				.btnitem {
					width: 50%;
					height: 50rpx;
					font-size: 9pt;
					color: #555555;
					margin-right: 5rpx;
					text-align: center;
					line-height: 50rpx;
					border-radius: 20rpx;
				}
			}
		}
	}
	
	.goods {
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		margin: 20rpx 0;
		border-radius: 15rpx;

		.order_list {
			.list {
				view {
					width: 50%;
					margin-top: 5rpx;
				}

				.left {
					width: 100%;
					text-align: left !important;
				}

				view:last-child {
					text-align: right;
				}
			}
		}

		.sum {
			text-align: right;
			height: 100rpx;
			line-height: 100rpx;
			border-top: 1px solid #EEEEEE;
		}
	}

	.btn {
		width: 94%;
		position: fixed;
		box-sizing: border-box;
		left: 50%;
		transform: translateX(-50%);
		bottom: 20rpx;
		background-color: #F15E00;
		border-radius: 20rpx;

		.btnitem {
			width: 100%;
			height: 80rpx;
			font-size: 10pt;
			color: #fff;
			text-align: center;
			line-height: 80rpx;
			border-radius: 20rpx;
			
		}
	}
}
</style>
