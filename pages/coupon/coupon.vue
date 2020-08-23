<template>
	<view>
		<view class="tabr" :style="{top:headerTop}">
			<view :class="{on:typeClass=='valid'}" @tap="switchType('valid',0)">可用</view>
			<view :class="{on:typeClass=='invalid'}" @tap="switchType('invalid',1)">已使用</view>
			<view class="border" :class="typeClass"></view>
		</view>
		<view class="place"></view>
		<view class="list">
			<!-- 优惠券列表 -->
			<view class="sub-list valid">
				<view class="row" v-for="(row,index) in couponValidList" :key="index">
					<!-- content -->
					<view class="carrier">
						<view class="left">
							<view class="title">
								{{row.event_desc}}
							</view>
							<!-- 使用期限 -->
							<view class="term">
								{{row.begin_time}} ~ {{row.end_time}}
								<block v-if="row.cat.length == 0">
									<view>
										全场通用
									</view>
								</block>
								<block v-if="row.cat.length != 0" v-for="(cat,index) in row.cat">
									<view>
										仅限<text>{{cat.name}}</text>产品使用
									</view>

								</block>
							</view>
							<view class="gap-top"></view>
							<view class="gap-bottom"></view>
						</view>
						<view class="right">
							<view class="ticket">
								<view class="num">
									{{row.sub_price}}元
								</view>
							</view>
							<view class="criteria">
								满{{row.min_price}}使用
							</view>
							<view class="criteria" v-if="row.is_use == 1">
								已使用
							</view>
						</view>
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
				couponValidList: [],
				headerTop: 0,
				//控制滑动效果
				typeClass: 'valid',
				subState: '',
				theIndex: null,
				oldIndex: null,
				isStop: false
			}
		},
		onPageScroll(e) {

		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad() {
			//兼容H5下排序栏位置
			// #ifdef H5
			//定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
			let Timer = setInterval(() => {
				let uniHead = document.getElementsByTagName('uni-page-head');
				if (uniHead.length > 0) {
					this.headerTop = uniHead[0].offsetHeight + 'px';
					clearInterval(Timer); //清除定时器
				}
			}, 1);
			// #endif
			// 默认请求0
			this.getCounpon(0)

		},
		methods: {

			switchType(type, e) {
				console.log(e);

				if (this.typeClass == type) {
					return;
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.typeClass = type;
				this.subState = this.typeClass == '' ? '' : 'show' + type;
				setTimeout(() => {
					this.oldIndex = null;
					this.theIndex = null;
					this.subState = this.typeClass == 'valid' ? '' : this.subState;
				}, 200)
				this.getCounpon(e)
			},
			//控制左滑删除效果-begin
			touchStart(index, event) {
				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
			},
			touchMove(index, event) {
				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];

				if (this.isStop || Math.abs(moveX) < 5) {
					return;
				}
				if (Math.abs(moveY) > Math.abs(moveX)) {
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}

				if (moveX < 0) {
					this.theIndex = index;
					this.isStop = true;
				} else if (moveX > 0) {
					if (this.theIndex != null && this.oldIndex == this.theIndex) {
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(() => {
							this.oldIndex = null;
						}, 150)
					}
				}
			},

			touchEnd(index, $event) {
				//解除禁止触发状态
				this.isStop = false;
			},

			// 获取优惠卷信息
			getCounpon(status) {
				this.$request({
					url: this.$api.coupon.index,
					data: {
						status: status
					}
				}).then(res => {
					console.log(res);
					this.couponValidList = res.data.list
				})
			},
			
			// go领卷
			goCoupon() {
				uni.navigateTo({
					url: '/pages/user/get-discounts/get-discounts'
				})
			},

		}
	}
</script>
<style lang="scss">
	view {
		display: flex;
		flex-wrap: wrap;

	}

	page {
		position: relative;
		background-color: #f5f5f5;
	}

	.hidden {
		display: none !important;
	}

	.place {
		width: 100%;
		height: 95upx;
	}

	.tabr {
		background-color: #fff;
		width: 94%;
		height: 95upx;
		padding: 0 3%;
		border-bottom: solid 1upx #dedede;
		position: fixed;
		top: 0;
		z-index: 10;

		view {
			width: 50%;
			height: 90upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			color: #999;
		}

		.on {
			color: #f06c7a;
		}

		.border {
			height: 4upx;
			background-color: #f06c7a;
			transition: all .3s ease-out;

			&.invalid {
				transform: translate3d(100%, 0, 0);
			}
		}

	}

	.list {
		width: 100%;
		display: block;
		position: relative;
	}

	@keyframes showValid {
		0% {
			transform: translateX(-100%);
		}

		100% {
			transform: translateX(0);
		}
	}

	@keyframes showInvalid {
		0% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(-100%);
		}
	}

	.sub-list {
		&.invalid {
			position: absolute;
			top: 0;
			left: 100%;
			display: none;
		}

		&.showvalid {
			display: flex;
			animation: showValid 0.20s linear both;
		}

		&.showinvalid {
			display: flex;
			animation: showInvalid 0.20s linear both;
		}

		width: 100%;
		padding: 20upx 0 120upx 0;

		.tis {
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}

		.row {
			width: 95%;
			height: 28vw;
			margin: 20upx auto 10upx auto;
			border-radius: 8upx;
			// box-shadow: 0upx 0 10upx rgba(0,0,0,0.1);
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;

			.menu {
				.icon {
					color: #fff;
					font-size: 50upx;
				}

				position: absolute;
				width: 28%;
				height: 100%;
				right: 0;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}

			.carrier {
				@keyframes showMenu {
					0% {
						transform: translateX(0);
					}

					100% {
						transform: translateX(-28%);
					}
				}

				@keyframes closeMenu {
					0% {
						transform: translateX(-28%);
					}

					100% {
						transform: translateX(0);
					}
				}

				&.open {
					animation: showMenu 0.25s linear both;
				}

				&.close {
					animation: closeMenu 0.15s linear both;
				}

				background-color: #fff;
				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				flex-wrap: nowrap;

				.left {
					width: 100%;

					.title {
						padding-top: 3vw;
						width: 90%;
						margin: 0 5%;
						font-size: 36upx;
					}

					.term {
						width: 100%;
						margin: 0 5%;
						font-size: 26upx;
						color: #999;
						margin: 0;
						padding-left: 10rpx;

						text {
							display: block;
						}
					}

					position: relative;

					.gap-top,
					.gap-bottom {
						position: absolute;
						width: 20upx;
						height: 20upx;
						right: -10upx;
						border-radius: 100%;
						background-color: #f5f5f5;
					}

					.gap-top {
						top: -10upx;
					}

					.gap-bottom {
						bottom: -10upx;
					}

					.shixiao {
						position: absolute;
						right: 20upx;
						font-size: 150upx;
						z-index: 6;
						color: rgba(153, 153, 153, 0.2)
					}
				}

				.right {
					flex-shrink: 0;
					width: 30%;
					color: #fff;
					background: linear-gradient(to right, #ec625c, #ee827f);

					&.invalid {
						background: linear-gradient(to right, #aaa, #999);

						.use {
							color: #aaa;
						}
					}

					justify-content: center;

					.ticket,
					.criteria {
						width: 100%;
					}

					.ticket {
						padding-top: 1vw;
						justify-content: center;
						align-items: baseline;
						height: 6vw;

						.num {
							font-size: 50upx;
							font-weight: 600;
						}

						.unit {
							font-size: 24upx;
						}
					}

					.criteria {
						justify-content: center;

						font-size: 28upx;
					}

					.use {
						width: 50%;
						height: 40upx;
						justify-content: center;
						align-items: center;
						font-size: 24upx;
						background-color: #fff;
						color: #ee827f;
						border-radius: 40upx;
						padding: 0 10upx;
					}
				}
			}

			/*
			<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
				<view class="left">
					<view class="title">
						10元日常用品类
					</view>
					<view class="term">
						2019-04-01~2019-05-30
					</view>
				</view>
				<view class="right">
					<view class="ticket">
						<view class="num">
							10
						</view>
						<view class="unit">
							元
						</view>
					</view>
					<view class="criteria">
						满50使用
					</view>
					<view class="use">
						去使用
					</view>
				</view>
			</view>
			* 
			* */
		}
	}
</style>
