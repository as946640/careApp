<template>
	<view class="pages">
		<!-- 商品信息 -->
		<view class="order flex">
			<view class="left">
				<image :src="order.goods_pic" mode="widthFix"></image>
			</view>
			<view class="right">
				<view class="">
					物流状态：{{order.status_text}}
				</view>
				<view class="" style="color: #888888;">
					物流公司：{{order.express}}
				</view>
				<view class="" style="color: #888888;">
					快递单号：{{order.express_no}}
				</view>
			</view>
		</view>
		<!-- 物流信息 -->
		<view class="express">
			<tui-time-axis>
			
				<tui-timeaxis-item backgroundColor="transparent">
					<template v-slot:node>
						<view class="tui-node" :style="{backgroundColor:backgroundColor}">
							<tui-icon name="check" color="#fff" :size="14" :bold="true"></tui-icon>
						</view>
					</template>
			
					<template v-slot:content>
						<view>
							<view class="tui-order-title">已签收</view>
							<view class="tui-order-desc">您的订单已由本人签收。感谢您在商城购物，欢迎再次光临。</view>
							<view class="tui-order-time tui-gray">2019-05-01 18:48:26</view>
						</view>
					</template>
				</tui-timeaxis-item>
			
				<tui-timeaxis-item backgroundColor="transparent">
					<template v-slot:node>
						<view class="tui-node">
							<tui-icon name="people" color="#fff" :size="13"></tui-icon>
						</view>
					</template>
					<template v-slot:content>
						<view class="tui-order-title tui-gray">派送中</view>
						<view class="tui-order-desc tui-light-gray">您的订单正在配送途中（快递员：echo.，电话：
							<text class='tui-primary'>13822448855</text>），请您耐心等待。</view>
						<view class="tui-order-time tui-gray">2019-05-01 16:29:07</view>
					</template>
				</tui-timeaxis-item>
			
				<tui-timeaxis-item backgroundColor="transparent">
					<template v-slot:node>
						<view class="tui-node">
							<tui-icon name="transport" color="#fff" :size="13"></tui-icon>
						</view>
					</template>
					<template v-slot:content>
						<view class="tui-order-title tui-gray">运输中</view>
						<view class="tui-order-desc tui-light-gray">您的订单已到达XX【北京XX营业部】</view>
						<view class="tui-order-time tui-gray">2019-05-01 16:17:32</view>
					</template>
				</tui-timeaxis-item>
			
				<tui-timeaxis-item backgroundColor="transparent">
					<template v-slot:node>
						<view class="tui-node-dot"></view>
					</template>
			
					<template v-slot:content>
						<view class="tui-order-desc tui-light-gray tui-ptop">您的订单已在XX【北京XX营业部】收货完成</view>
						<view class="tui-order-time tui-gray">2019-05-01 08:40:32</view>
					</template>
				</tui-timeaxis-item>
			
				<tui-timeaxis-item backgroundColor="transparent">
					<template v-slot:node>
						<view class="tui-node-dot"></view>
					</template>
					<template v-slot:content>
						<view class="tui-order-desc tui-light-gray tui-ptop">您的订单由XXXX送往XX【北京XX营业部】</view>
						<view class="tui-order-time tui-gray">2019-05-01 08:17:32</view>
					</template>
				</tui-timeaxis-item>
			
				<tui-timeaxis-item backgroundColor="transparent">
					<template v-slot:node>
						<view class="tui-node">
							<tui-icon name="notice" color="#fff" :size="12"></tui-icon>
						</view>
					</template>
					<template v-slot:content>
						<view class="tui-order-title tui-gray">温馨提示</view>
						<view class="tui-order-desc tui-light-gray">您的订单预计5月1日送达您手中</view>
						<view class="tui-order-time tui-gray">2019-05-01 02:05:16</view>
					</template>
				</tui-timeaxis-item>
			
				<tui-timeaxis-item backgroundColor="transparent">
					<template v-slot:node>
						<view class="tui-node">
							<tui-icon name="order" color="#fff" :size="12"></tui-icon>
						</view>
					</template>
					<template v-slot:content>
						<view class="tui-order-title tui-gray">已下单</view>
						<view class="tui-order-desc tui-light-gray">您提交了订单，请等待第三方卖家系统弄确认</view>
						<view class="tui-order-time tui-gray">2019-05-01 02:04:16</view>
					</template>
				</tui-timeaxis-item>
			
			</tui-time-axis>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order:{},
				 backgroundColor:"#5677fc"
			}
		},
		onLoad:function(options){
			console.log(options);
			if (options.inId){
			            var data = {
			                order_id:options.inId,
			                type:'IN'
			            }
			        }else{
			            var data = {
			                order_id: options.id,
			                type: 'mall'
			            }
			        }
			this.getEX(data)
		},
		methods: {
			getEX(data) {
				this.$request({
					url: this.$api.order.express_detail,
					data: data
				}).then(res => {
					console.log(res);
					this.order = res.data
				})
			}
		}
	}
</script>

<style lang="scss">
.pages {
	background-color: #eee;
	height: 100vh;
	padding-top:10rpx;
}
 .order {
	 width: 94%;
	 height: 200rpx;
	 padding: 20rpx;
	 margin: 10rpx auto;
	 font-size: 11pt;
	 background-color: #fff;
	 border: 1px solid #eee;
	 border-radius: 20rpx;
	 box-sizing: border-box;
		.left {
			width: 20%;
			min-width: 20%;
			padding: 20rpx;
				image { 
					width: 100%;
					height: 100%;
				}
		}
		.right {
			width: 70%;
			min-width: 70%;
			padding: 20rpx;
			box-sizing: border-box;
				view {
					line-height: 50rpx;
				}
		}
 }
 
 
 // 物流
 
 .express {
	 padding: 30rpx;
	 width: 94%;
	 min-width: 94%;
	 box-sizing: border-box;
	 margin: 0 3%;
	 border-radius: 20rpx;
	 background-color: #fff;
 }
 
 .tui-text {
 	font-size: 28rpx;
 	color: #333;
 	padding: 4rpx;
 }
 
 .tui-bold {
 	font-weight: bold;
 }
 
 .tui-node {
 	height: 44rpx;
 	width: 44rpx;
 	border-radius: 50%;
 	background-color: #ddd;
 	display: flex;
 	align-items: center;
 	justify-content: center;
 	color: #fff;
 	flex-shrink: 0;
 }
 
 .tui-node-dot {
 	height: 16rpx;
 	width: 16rpx;
 	background-color: #ddd;
 	border-radius: 50%;
 	/* transform: translateY(45%); */
 	margin-top: 6rpx;
 }
 
 .tui-bg-primary {
 	background: #EB0909 !important;
 }
 
 .tui-order-tracking {
 	padding: 30rpx 30rpx 30rpx 40rpx;
 	background: #fff;
 	margin-top: 20rpx;
 	box-sizing: border-box;
 }
 
 .tui-order-title {
 	padding-bottom: 12rpx;
 	font-size: 32rpx;
 	color: #333;
 	font-weight: bold;
 }
 
 .tui-order-desc {
 	padding-bottom: 12rpx;
 	font-size: 28rpx;
 	color: #333;
 }
 
 .tui-ptop {
 	display: flex;
 	justify-content: flex-start;
 	line-height: 28rpx;
 }
 
 .tui-order-time {
 	font-size: 24rpx;
 	font-weight: bold;
 }
 
 .tui-gray {
 	color: #848484 !important;
 }
 
 .tui-light-gray {
 	color: #888 !important;
 }
 
 .tui-primary {
 	color: #5677fc;
 }
</style>
