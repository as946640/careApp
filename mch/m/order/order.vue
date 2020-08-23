<template>
	<view class="body" @tap="colseMore">
		<view class="header">
			<view class="search">
				<input type="text" placeholder="搜索" @confirm="search" :value="keyword"/>
			</view>
			<view class="tab">
				<view class="tab-item" @tap="select(1)">
					<text :class="status==1?'active':''">待付款</text>
				</view>
				<view class="tab-item" @tap="select(2)">
					<text :class="status==2?'active':''">待发货</text>
				</view>
				<view class="tab-item" @tap="select(3)">
					<text :class="status==3?'active':''">待收货</text>
				</view>
				<view class="tab-item more" :class="(status==4||status==5||status==6)?'more-active':''">
					<view @tap.stop="menuShow">
						<view :class="(status==4||status==5||status==6)?'more-text-active':''">更多</view>
						<view>
							<block v-if="status==4||status==5||status==6"><image src="../../../static/img/mch/gengduo-active.png"></image></block>
							<block v-else><image src="../../../static/img/mch/gengduo.png"></image></block>
						</view>
					</view>
					<view class="more-menu" v-if="menu_show">
						<view @tap="select(4)">已完成</view>
						<view @tap="select(5)">售后</view>
						<view @tap="select(6)">取消</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="order-list">
			<view class="order-item" v-for="(item,index) in orderList" @tap="toOrderDetail(item.id)">
				<view class="order-top">
					<view>{{item.order_no}}</view>
					<view>{{item.addtime}}</view>
				</view>
				<view class="order-cont" v-for="(row,num) in item.goods_list">
					<view class="order-img">
						<image :src="row.cover_pic"></image>
					</view>
					<view class="order-info">
						<view class="goods-name">{{row.name}}</view>
						<view class="goods-scale"><text v-for="scale in row.attr">{{scale.attr_group_name}}:{{scale.attr_name}}</text></view>
						<view class="order-price">
							<view>x{{row.num}}</view>
							<view>￥{{row.total_price}}</view>
						</view>
					</view>
				</view>
				<view class="order-total">
					<view>合计：￥{{item.total_price}}</view>
					<block v-if="item.is_pay == 1 && item.is_send==0">
						<view @tap.stop="openModel(item.id)">发货</view>
					</block>
				</view>
			</view>
		</view>
		
		<view class="footer">
			<block v-if="orderList.length == 0">没有更多</block>
		</view>
		
		<model :show="model_show" :order_id="order_id" @closeModel="closeModel"></model>
	</view>
</template>

<script>
	import model from "@/components/deliver-goods/deliver-goods.vue"
	export default {
		components:{
			model
		},
		data() {
			return {
				menu_show:false,
				orderList:[],
				status:1,
				page:1,
				keyword:"",
				model_show:false,
				order_id:0,
			}
		},
		onLoad(options) {
			if(options.status){
				this.status = options.status;
			}
			this.getOrderInfo();
		},
		methods: {
			menuShow(){
				this.menu_show = !this.menu_show;
			},
			getOrderInfo(){
				uni.showLoading({
					title:"正在加载"
				});
				this.$request({
					url:this.$api.mch.order.list,
					data:{
						status: this.status,
						page: this.page,
						keyword: this.keyword,
					}
				}).then((res) => {
					uni.hideLoading();
					if(res.code == 0){
						this.orderList = res.data.list
					}
					if(res.code == 1){
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			},
			//选项卡
			select(status){
				this.status = status;
				this.orderList = [];
				this.menu_show = false;
				this.keyword = "";
				this.getOrderInfo();
			},
			//搜索
			search(e){
				this.keyword = e.detail.value;
				this.orderList = [];
				this.getOrderInfo();
			},
			colseMore(){
				this.menu_show = false;
			},
			toOrderDetail(order_id){
				uni.navigateTo({
					url:"/mch/m/order-detail/order-detail?order_id="+order_id+""
				})
			},
			
			//发货，修改物流
			openModel(order_id){
				this.model_show = true;
				this.order_id = order_id;
			},
			closeModel(){
				this.model_show = false;
			}
		}
	}
</script>

<style scoped>
	.header{
		width: 100%;
		position: fixed;
		left: 0;
		z-index: 10;
	}
	.search {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 110rpx;
		background-color: #EFEFF4;
	}
	
	.search>input {
		background-color: #FFFFFF;
		width: 88vw;
		height: 60rpx;
		border-radius: 70rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 32rpx;
	}
	.tab {
		height: 90rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #F0F0F0;
	}
	
	.tab>view {
		flex: 1;
		text-align: center;
		height: 90rpx;
		line-height: 90rpx;
	}
	
	.tab>view>text.active {
		display: inline-block;
		line-height: 90rpx;
		border-bottom: 1px solid #FF4544;
		color: #FF4544;
	}
	.more>view:nth-of-type(1){
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tab-item{
		margin: 0 20rpx;
		box-sizing: border-box;
	}
	.more{
		position: relative;
	}
	.more-active{
		border-bottom: 1px solid #FF4544;
	}
	.more-text-active{
		color: #FF4544;
	}
	/* .more>view:nth-of-type(2){
		width: 35rpx;
		height: 32rpx;
		margin-left: 5rpx;
	} */
	.more>view:nth-of-type(1) image{
		width: 30rpx;
		height: 30rpx;
	}
	.more-menu{
		position: absolute;
		width: 100%;
		border-top: 1px solid #FFFFFF;
		border-bottom: 1px solid #F0F0F0;
		border-left: 1px solid #F0F0F0;
		border-right: 1px solid #F0F0F0;
		top: 90rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
	}
	.more-menu>view{
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
	}
	.order-list{
		padding-top: 200rpx;
	}
	.order-item{
		background-color: #FFFFFF;
		padding: 0 20rpx;
		border-bottom: 1px solid #F0F0F0;
		border-top: 1px solid #F0F0F0;
		margin-bottom: 20rpx;
	}
	.order-top{
		padding: 20rpx 0;
		box-sizing: border-box;
		display: flex;
		font-size: 30rpx;
		color: #888888;
		border-bottom: 1px solid #F0F0F0;
	}
	.order-top>view:nth-of-type(2){
		margin-left: auto;
	}
	.order-cont{
		padding: 20rpx 0;
		box-sizing: border-box;
		display: flex;
		border-bottom: 1px solid #F0F0F0;
	}
	.order-img{
		width: 190rpx;
		height: 190rpx;
	}
	.order-img>image{
		width: 100%;
		height: 100%;
	}
	.order-info{
		margin-left: 20rpx;
		flex: 1;
	}
	.goods-name{
		font-size: 34rpx;
		height: 88rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.goods-scale{
		padding: 10rpx 0;
		color: #888888;
	}
	.order-price{
		display: flex;
		font-size: 34rpx;
	}
	.order-price>view:nth-of-type(2){
		margin-left: auto;
		color: #FF4544;
	}
	.order-total{
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		box-sizing: border-box;
	}
	.order-total>view:nth-of-type(1){
		font-size: 34rpx;
	}
	.order-total>view:nth-of-type(2){
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1px solid #D9D9D9;
		margin-left: auto;
		border-radius: 10rpx;
	}
	.footer{
		height: 50rpx;
		padding-top: 30rpx;
		text-align: center;
	}
</style>
