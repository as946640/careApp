<template>
	<view>
		<!-- 收货地址 -->
		<view class="addr" @tap="selectAddress">
			<view class="icon">
				<image src="../../static/img/addricon.png" mode=""></image>
			</view>
			<view class="right">
				<block v-if="recinfo">
					<view class="tel-name">
						<view class="name">
							{{recinfo.name}}
						</view>
						<view class="tel">
							{{recinfo.mobile}}
						</view>
					</view>
					<view class="addres">
						{{recinfo.address}}
					</view>
				</block>
				<block v-else>
					<view class="select">请选择收货地址</view>
				</block>
			</view>
		</view>
		<block v-for="(item,index) in mch_list">
			<!-- 购买商品列表 -->
			<view class="box">
				<view class="buy-list">
					<view class="shop-title">{{item.name}}</view>
					<view>
						<view class="row" v-for="(goods,index) in item.goods_list" :key="index">
							<view class="goods-info">
								<view class="img">
									<image :src="goods.goods_pic"></image>
								</view>
								<view class="info">
									<view class="title">{{goods.goods_name}}</view>
									<view class="spec">
										<view v-for="attr in goods.attr_list">{{attr.attr_group_name}}:{{attr.attr_name}}</view>
									</view>
									<view class="price-number">
										<view class="price vip-price" v-if="goods.is_level"><text>￥{{goods.price}}</text>会员折价￥{{goods.level_price}}</view>
										<view class="price" v-else>￥{{goods.price}}</view>
										<view class="number">
											X{{goods.num}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 提示-备注 -->
				<view class="order">
					<view class="row" @tap="useCounpon(index)"  v-if="item.coupon_list && item.coupon_list.length>0">
						<view class="left">
							优惠券 :
						</view>
						<view class="right coupon">
							<view v-if="item.picker_coupon && item.picker_coupon.sub_price > 0">-{{item.picker_coupon.sub_price}}元</view>
							<view v-else>您有{{item.coupon_list.length}}张优惠券可用</view>
						</view>
					</view>
					<view class="row">
						<view class="left">
							备注 :
						</view>
						<view class="right">
							<input placeholder="选填,备注内容" v-model="note" />
						</view>
					</view>
				</view>
				<!-- 明细 -->
				<view class="detail">
					<view class="row">
						<view class="nominal">
							运费
						</view>
						<view class="content">
							￥{{item.express_price|toFixed}}
						</view>
					</view>
					<view class="row">
						<view class="nominal">
							小计金额
						</view>
						<view class="content">
							￥{{item.level_price|toFixed}}
						</view>
					</view>
				</view>
			</view>
		</block>
		<view class="integral-box">
			<view class="left">
				积分：
			</view>
			<view class="middle">
				使用{{integral.forehead_integral}}积分抵扣<text>{{integral.forehead|toFixed}}</text>元
			</view>
			<view class="right">
				<switch @change="integralSwitchChange" style="transform: scale(0.5,0.5);margin-top: -10upx; margin-left: auto;" color="#f06c7a" />
			</view>
		</view>




		<view class="blck">

		</view>
		<view class="footer">
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{new_total_price}}</view>
				</view>
				<view class="btn" @tap="toPay">提交订单</view>
			</view>
		</view>



		<!-- 优惠券 -->
		<view class="coupon-box" v-if="couponShow">
			<view class="explain">注：优惠券只能抵消商品金额，不能抵消运费，商品金额最多优惠到0.01元</view>
			<view class="noSub" @tap="pickCoupon(-1)">不使用优惠券</view>
			<scroll-view class="coupon-list" scroll-y="true">
				<view class="coupon-item" v-if="coupon_list" v-for="(coupon_item,coupon_index) in coupon_list" @tap="pickCoupon(coupon_index)">
					<view class="money">
						<view class="price">￥<text>{{coupon_item.sub_price}}</text></view>
						<view class="cut-price">{{coupon_item.min_price_desc}}</view>
					</view>
					<view class="info">
						<view class="from">{{coupon_item.event_desc}}</view>
						<view class="time">{{coupon_item.begin_time}} ~ {{coupon_item.end_time}}</view>
					</view>
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				total_price: 0,
				address: null,
				express_price: 0.00,
				express_price_1: 0.00,
				integral_radio: 2, //1为启用积分，2为不启用
				new_total_price: 0,
				show_card: false,
				payment: -1,
				show_payment: false,
				show_more: false,
				index: -1,
				mch_offline: true,
				
				integral:{},
				buylist: [], //订单列表
				goodsPrice: 0.00, //商品合计价格
				sumPrice: 0.00, //用户付款价格
				freight: 0.00, //运费
				note: '', //备注
				int: 1200, //抵扣积分
				deduction: 0.00, //抵扣价格
				recinfo: null, //用户设置的默认地址
				mch_list: [],
				address_id: 0, //进入页面提交到服务器的默认地址信息，为0即可
				options: "", //页面加载时传递过来的数据
				pay_type_list: [] ,//支付方式
				
				couponShow:false //优惠券页面
			};
		},
		onShow() {

			var self = this;

			// //页面显示时，加载订单信息
			// uni.getStorage({
			// 	key: 'buylist',
			// 	success: (ret) => {
			// 		// console.log(ret);
			// 		this.buylist = ret.data;
			// 		this.goodsPrice = 0;
			// 		//合计
			// 		let len = this.buylist.length;
			// 		for (let i = 0; i < len; i++) {
			// 			let len2 = this.buylist[i].goods_list.length
			// 			for (let j = 0; j < len2; j++) {
			// 				console.log(this.buylist[i].goods_list[j]);
			// 				this.goodsPrice = this.goodsPrice + (this.buylist[i].goods_list[j].num * this.buylist[i].goods_list[j].price);
			// 			}
			// 		}
			// 		this.deduction = this.int / 100;
			// 		this.sumPrice = this.goodsPrice - this.deduction + this.freight;
			// 		console.log(this.buylist);
			// 	}
			// });

			// 获取选中的地址信息，取得后将本地缓存销毁
			uni.getStorage({
				key: 'selectAddress',
				success: (e) => {
					self.recinfo = e.data;
					if (e.data) {
						self.address_id = e.data.id
						self.getOrderData(this.options);
					}
					uni.removeStorage({
						key: 'selectAddress'
					})
				}
			});

		},
		onLoad(options) {
			// this.mch_list = JSON.parse(options.mch_list);
			// console.log(this.mch_list.length);
			this.options = options

			// 获取订单商品信息
			this.getOrderData(options);

			// 获取默认地址信息
			this.$request({
				url: this.$api.user.address_list,
			}).then(res => {
				if (res.code == 0) {
					for (let i = 0; i < res.data.list.length; i++) {
						if (res.data.list[i].is_default == 1) {
							this.recinfo = res.data.list[i];
							this.address_id = res.data.list[i].id
						}
					}
				}
			});
		},
		onBackPress() {
			//页面后退时候，清除订单信息
			this.clearOrder();
		},
		filters: {
			toFixed: function(x) {
				return parseFloat(x).toFixed(2);
			}
		},


		methods: {

			// 获取订单商品信息
			getOrderData(options) {
				// let mch_list = JSON.stringify(this.mch_list);
				let self = this;
				
				console.log(options.mch_list);
				this.$request({
					url: this.$api.order.new_submit_preview,
					method: "POST",
					data: {
						address_id: this.address_id, //传递地址id 初次进入页面传0，视作为默认地址
						longitude: "",
						latitude: "",
						mch_list: options.mch_list
					}
				}).then(res => {
					if (res.code == 1) {
						uni.showModal({
							title: "提示",
							content: res.msg,
							showCancel: false,
							confirmText: "返回",
							success: function(res) {
								if (res.confirm) {
									uni.navigateBack({
										delta: 1,
									});
								}
							}
						});
					}
					this.mch_list = res.data.mch_list;
					this.pay_type_list = res.data.pay_type_list; //所支持的支付方式
					this.integral = res.data.integral;//订单中可使用多少积分抵扣多少金额
					if (res.code == 0) {
						var input_data = uni.getStorageSync("INPUT_DATA");
						var res_data = res.data;
						var payment = -1;
						var integral_radio = 1;
						var mch_list = res_data.mch_list;
						var mch_list_other = [];
						if (input_data) {
							mch_list_other = input_data.mch_list;
							payment = input_data.payment;
							integral_radio = input_data.integral_radio;
						}

						// 是否选用积分
						res_data.integral_radio = integral_radio;

						// 支付方式
						for (var i in res_data.pay_type_list) {
							if (payment == res_data.pay_type_list[i].payment) {
								res_data.payment = payment;
								break;
							}
							if (res_data.pay_type_list.length == 1) {
								res_data.payment = res_data.pay_type_list[i].payment;
								break;
							}
						}

						for (var i in mch_list) {
							var shop = {};
							var picker_coupon = {};
							mch_list[i].show = false;
							mch_list[i].show_length = mch_list[i].goods_list.length - 1;
							// 判断是否有缓存的用户填写信息
							if (mch_list_other.length != 0) {
								for (var j in mch_list_other) {
									if (mch_list[i].mch_id == mch_list_other[j].mch_id) {
										mch_list[i].content = mch_list_other[j].content;
										mch_list[i].form = mch_list_other[j].form;
										shop = mch_list_other[j].shop;
										picker_coupon = mch_list_other[j].picker_coupon;
										mch_list[i].offline_name = mch_list_other[j].offline_name;
										mch_list[i].offline_mobile = mch_list_other[j].offline_mobile;
									}
								}
							}
							// 门店选择
							for (var j in mch_list[i].shop_list) {
								if (shop && shop.id == mch_list[i].shop_list[j].id) {
									mch_list[i].shop = shop;
									break;
								}
								if (mch_list[i].shop_list.length == 1) {
									mch_list[i].shop = mch_list[i].shop_list[j];
									break;
								}
								if (mch_list[i].shop_list[j].is_default == 1) {
									mch_list[i].shop = mch_list[i].shop_list[j];
									break;
								}
							}
							// 优惠券
							if (picker_coupon) {
								for (var j in mch_list[i].coupon_list) {
									if (picker_coupon.id == mch_list[i].coupon_list[j].id) {
										mch_list[i].picker_coupon = picker_coupon;
										break;
									}
								}
							}

							// 判断配送方式
							if (mch_list[i].send_type && mch_list[i].send_type == 2) {
								mch_list[i].offline = 1;
								self.setData({
									mch_offline: false
								});
							} else {
								mch_list[i].offline = 0;
							}
						}
						res_data.mch_list = mch_list;
						var index = this.index;
						if (index != -1 && mch_list[index].shop_list && mch_list[index].shop_list.length > 0) {
							self.setData({
								show_shop: true,
								shop_list: mch_list[index].shop_list
							});
						}

						// self.setData(res_data);
						// 计算总价
						self.getPrice();
						// this.totalPrice();
					}
					
				});
			},

			
			// Total price 总价
			// totalPrice() {
			// 	for (let i = 0; i < this.mch_list.length; i++) {
			// 		this.sumPrice += parseFloat(this.mch_list[i].level_price) + parseFloat(this.mch_list[i].express_price);
			// 	}
			// },

			/*计算总价*/
			getPrice() {
				var self = this;

				var mch_list = this.mch_list;
				var integral_radio = this.integral_radio;
				var integral = this.integral;
				var new_total_price = 0;
				var is_area = 0;
				var offer_rule = {};
				var coupon_price = 0;
				for (var i in mch_list) {
					var mch = mch_list[i];
					var total_price = parseFloat(mch.total_price);
					var level_price = parseFloat(mch.level_price);
					var price = level_price;
					var goods = mch_list[i].goods_list;
					coupon_price = 0;
					if (mch.picker_coupon && mch.picker_coupon.sub_price > 0) { // 计算优惠券

						if (mch.picker_coupon.appoint_type == 1 && mch.picker_coupon.cat_id_list != null) {
							goods.forEach(function(item, index, array) {
								for (var item1 in item.cat_id) {
									var sts = self.contains(mch.picker_coupon.cat_id_list, item.cat_id[item1]);
									if (sts != -1) {
										coupon_price = coupon_price + parseFloat(item.price);
									};
									continue;
								}
							})
						} else if (mch.picker_coupon.appoint_type == 2 && mch.picker_coupon.goods_id_list != null) {
							goods.forEach(function(item, index, array) {
								var sts = self.contains(mch.picker_coupon.goods_id_list, item.goods_id);
								if (sts != -1) {
									coupon_price = coupon_price + parseFloat(item.price);
								}
							})

						};
						if (mch.picker_coupon.sub_price > coupon_price && coupon_price > 0) {
							price = price - parseFloat(coupon_price);
						} else {
							price = price - mch.picker_coupon.sub_price;
						}

					}
					if (mch.integral && mch.integral.forehead > 0 && integral_radio == 1) { // 计算积分
						price = price - parseFloat(mch.integral.forehead);
					}
					if (mch.offline == 0) {
						if (mch.express_price) { // 计算运费
							price = price + mch.express_price;
						}
						if (mch.offer_rule && mch.offer_rule.is_allowed == 1) {
							offer_rule = mch.offer_rule;
						}
						if (mch.is_area == 1) {
							is_area = 1;
						}
					}
					new_total_price = new_total_price + parseFloat(price);
				}
				new_total_price = new_total_price >= 0 ? new_total_price : 0;
				self.new_total_price = new_total_price.toFixed(2),
				self.offer_rule = offer_rule,
				self.is_area = is_area
			},

			/*是否启用积分*/
			integralSwitchChange(e) {
				console.log('switch1 发生 change 事件，携带值为', e.target.value)
				var self = this;
				if (e.target.value != false) {
					self.integral_radio = 1
				} else {
					self.integral_radio = 2
				}
				self.getPrice();
			},

			clearOrder() {
				uni.removeStorage({
					key: 'buylist',
					success: (res) => {
						this.buylist = [];
						console.log('remove buylist success');
					}
				});
			},
			
			// 点击提交订单，去到付款页面
			toPay() {
				//判断订单信息
				if (this.recinfo == null || this.recinfo == "") {
					uni.showToast({
						title: "请选择收货地址",
						icon: "none"
					})
					return;
				}
				if (this.mch_list.length == 0) {
					uni.showToast({
						title: "订单信息有误请重新进入",
						icon: "none"
					})
					return;
				}

				uni.showLoading({
					title: '正在提交订单...'
				})

				console.log(this.address_id)
				// let mch_list = JSON.stringify(this.mch_list);
				// let pay_type_list = JSON.stringify(this.pay_type_list);
				// setTimeout(() => {
				// 	uni.redirectTo({
				// 		url: "../pay/payment/payment?address_id=" + this.address_id + "&mch_list=" + mch_list +
				// 			"&use_interal=1&pay_type_list=" + pay_type_list + "&sum_price=" + this.sumPrice + ""
				// 	})
				// }, 500)

				
				//提交订单  PS:此时只是创建一个未付款的订单。并且返回一个订单号
				let pay_type_list = JSON.stringify(this.pay_type_list);
				let use_integral = 2;
				let new_total_price = this.new_total_price
				this.integral_radio == 1 ? use_integral=1 : use_integral=2;
				this.$request({
					url: this.$api.order.new_submit,
					method: "POST",
					data: {
						address_id: this.address_id, //地址id
						mch_list: JSON.stringify(this.mch_list), //订单信息列表
						payment: this.payment,
						use_integral: use_integral,
						formId: undefined
					}
				}).then(res => {
					uni.hideLoading();
					console.log(res);
					if(res.code == 0){
						// 跳转至付款页面
						let order_id_list = JSON.stringify(res.data.order_id_list)
						uni.redirectTo({
							url: "../pay/payment/payment?order_id="+res.data.order_id+"&order_id_list="+order_id_list+"&pay_type_list=" + pay_type_list+"&new_total_price="+ new_total_price +""
						})
					}
					if(res.code == 1){
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				});
				
				// this.$request({
				// 	url: this.$api.order.new_submit,
				// 	method:"POST",
				// 	data: {
				// 		address_id:5,//地址id
				// 		mch_list:this.mch_list,//订单信息列表
				// 		use_integral:1,//使用的积分
				// 		payment:3,
				// 		formId:1,
				// 	}
				// }).then(res => {
				// 	console.log(res);
				// });
			},
			//选择收货地址
			selectAddress() {
				uni.navigateTo({
					url: '/pages/address/address?type=select'
				})
			},
			
			
			// 是否使用优惠券
			useCounpon(index){
				console.log(index);
				var self = this;
				var index = index;
				var mch_list = self.mch_list;
				// self.getInputData();
				if (mch_list[index].coupon_list && mch_list[index].coupon_list.length > 0) {
					self.couponShow = true;
					self.coupon_list = mch_list[index].coupon_list;
					self.index = index;
				}
			},
			// noCoupon(){
			// 	this.couponShow = false;
			// },
			
			// 选择优惠券
			pickCoupon(index) {
				var self = this;
				console.log(index);
				var index = index;
				var mch_index = self.index;
				// var data = getApp().core.getStorageSync(getApp().const.INPUT_DATA);
				// getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
				var mch_list = self.mch_list;
				if (index == '-1' || index == -1) {
					mch_list[mch_index].picker_coupon = false;
					self.couponShow = false;
				} else {
					mch_list[mch_index].picker_coupon = self.coupon_list[index];
					self.couponShow = false;
				}
				self.mch_list = mch_list;
				self.index = -1;
				// self.setData(data);
				self.getPrice();
			},
			
			
			
			
			
			contains(arr, obj) {
				//while
				var i = arr.length;
				while(i--) {
					if(arr[i] == obj) {
						return i;
					}
				}
				return -1;
			}
		}
	}
</script>

<style lang="scss">
	.addr {
		width: 86%;
		padding: 20upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;
		display: flex;
		background-color: #FFFFFF;

		.icon {
			width: 80upx;
			height: 80upx;
			display: flex;
			align-items: center;

			image {
				width: 60upx;
				height: 60upx;
			}
		}

		.tel-name {
			width: 100%;
			display: flex;
			font-size: 32upx;

			.tel {
				margin-left: 40upx;
			}
		}

		.addres {
			width: 100%;
			font-size: 26upx;
			color: #999;
		}

		.select {
			line-height: 80upx;
		}
	}

	.box {
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		width: 86%;
		padding: 10upx 3%;
		margin: 30upx auto;
		border-radius: 20upx;
		background-color: #FFFFFF;

		.buy-list {
			width: 100%;

			.shop-title {
				font-size: 30upx;
				line-height: 40upx;
			}

			.row {
				margin: 10upx 0 20upx 0;

				.radio {
					width: 50px;
					height: 50px;
				}

				.goods-info {
					width: 100%;
					display: flex;

					.img {
						width: 22vw;
						height: 22vw;
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 10upx;

						image {
							width: 22vw;
							height: 22vw;
						}
					}

					.info {
						width: 100%;
						height: 22vw;
						overflow: hidden;
						display: flex;
						flex-wrap: wrap;
						position: relative;

						.title {
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							// text-align: justify;
							overflow: hidden;
						}

						.spec {
							font-size: 22upx;
							background-color: #f3f3f3;
							color: #a7a7a7;
							height: 40upx;
							display: flex;
							align-items: center;
							padding: 0 10upx;
							border-radius: 20upx;
							margin-bottom: 20vw;
						}

						.spec>view {
							margin-right: 10upx;
						}

						.price-number {
							position: absolute;
							width: 100%;
							bottom: 0upx;
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							font-size: 28upx;
							height: 40upx;

							.price {
								color: #f06c7a;
							}

							.vip-price {
								font-size: 24upx;
								max-width: 400upx;
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
							}

							.vip-price>text {
								font-size: 20upx;
								color: #999999;
								text-decoration: line-through;
								margin-right: 10upx;
							}

							.number {
								display: flex;
								justify-content: center;
								align-items: center;

							}
						}
					}
				}
			}
		}


		.order {
			width: 100%;
			padding: 10upx 3%;
			box-sizing: border-box;
			margin: 0 auto;
			margin-top: 30upx;
			// box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
			border-radius: 20upx;

			.row {
				margin: 20upx 0;
				height: 40upx;
				display: flex;

				// .rad{
				// 	width: 20upx;
				// 	height: 20upx;
				// }

				.left {
					font-size: 28upx;
				}

				.right {
					margin-left: 40upx;
					font-size: 26upx;
					color: #999;

					input {
						font-size: 26upx;
						color: #999;
					}
				}

				.coupon {
					margin-left: auto;
					color: #f06c7a;
				}

				.right>text {
					color: #f06c7a;
				}
			}
		}

		.detail {
			width: 100%;
			padding: 10upx 3%;
			box-sizing: border-box;
			margin: 20upx auto;
			margin-top: 10upx;
			// box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
			border-radius: 20upx;

			.row {
				height: 60upx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.nominal {
					font-size: 28upx;
				}

				.content {
					font-size: 26upx;
					color: #f06c7a;
				}
			}
		}

	}
	.integral-box{
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		width: 86%;
		padding: 10upx 3%;
		margin: 30upx auto;
		border-radius: 20upx;
		display: flex;
		font-size: 30upx;
		align-items: center;
		background-color: #FFFFFF;
		.right{
			margin-left: auto;
			width: 100upx;
		}
		.middle>text{
			color: #f06c7a;
		}
	}

	.blck {
		width: 100%;
		height: 100upx;
	}

	.footer {
		width: 92%;
		padding: 0 4%;
		background-color: #FFFFFF;
		height: 100upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;

		.settlement {
			width: 80%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.sum {
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;

				.money {
					font-weight: 600;
				}
			}

			.btn {
				padding: 0 30upx;
				height: 60upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				border-radius: 40upx;
			}
		}
	}
	.coupon-box{
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #FFFFFF;
		padding: 35upx;
		box-sizing: border-box;
		z-index: 999;
		.explain{
			font-size: 34upx;
			color: #9A9A9A;
		}
		.noSub{
			width: 100%;
			height: 80upx;
			border: 2px solid #E5E5E5;
			border-radius: 6upx;
			line-height: 70upx;
			text-align: center;
			color: #9A9A9A;
			margin: 20upx auto;
			box-sizing: border-box;
		}
		.coupon-list{
			box-sizing: border-box;
			height: 80vh;
			
			.coupon-item{
				height: 180upx;
				display: flex;
				align-items: center;
				background-image: url(../../static/img/img-coupon-bg-0.png);
				background-repeat: no-repeat;
				background-position: left;
				background-size: 115% 100%;
				margin-bottom: 20upx;
				.money{
					width: 230upx;
					text-align: center;
					color: #FFFFFF;
					margin-right: 20upx;
					
					.price>text{
						font-size: 60upx;
					}
					.cut-price{
						font-size: 28upx;
					}
				}
				.info{
					.from{
						font-size: 40upx;
						font-weight: bold;
						margin-bottom: 10upx;
					}
					.time{
						font-size: 24upx;
					}
				}
			}
		}
	}
</style>
