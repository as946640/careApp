<template>
	<view class="body">
		<view class="order-detail">
			<view class="detail-top">
				<view>订单详情</view>
				<view>状态：{{order_detail.status_text}}</view>
			</view>
			<view class="order-info">
				<view>订单编号：{{order_detail.order_no}}</view>
				<view>下单时间：{{order_detail.addtime}}</view>
			</view>
			<view class="order-goods-list">
				<view class="order-goods-item" v-for="(item,index) in order_detail.goods_list" :key="index">
					<view class="goods-img">
						<image :src="item.cover_pic"></image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{item.name}}</view>
						<view class="goods-scale"><text v-for="(row,row_index) in item.attr">{{row.attr_group_name}}:{{row.attr_name}}</text></view>
						<view class="goods-price">
							<view>x{{item.num}}</view>
							<view>￥{{item.total_price}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="order-freight">
				<view>运费</view>
				<view>+￥{{order_detail.express_price}}</view>
			</view>
			<view class="order-total">
				<view>实际付款</view>
				<view>￥{{order_detail.pay_price}}</view>
			</view>
			<view class="change-price" v-if="order_detail.is_pay == 0">
				<view></view>
				<view @tap="openChangePrice">改价</view>
			</view>
		</view>
		
		<view class="receiving-info">
			<view class="receiving-top">
				<view>收货信息</view>
				<view>{{order_detail.express_type}}</view>
			</view>
			<view class="addr-info">
				<view class="people-name">
					<view>收货人：</view>
					<view>{{order_detail.name}}</view>
				</view>
				<view class="people-phone">
					<view>联系电话：</view>
					<view>{{order_detail.mobile}}</view>
				</view>
				<view class="people-addr">
					<view>收货地址：</view>
					<view>{{order_detail.address}}</view>
				</view>
			</view>
			<block v-if="order_detail.is_pay == 1">
				<block v-if="order_detail.is_send == 0">
					<view class="deliver">
						<view>买家已付款，请及时发货</view>
						<view @tap="openModel">发货</view>
					</view>
				</block>
				<block v-else>
					<view class="logistics">
						<view class="change" v-if="order_detail.is_confirm==0">
							<view @tap="openModel">修改物流信息</view>
						</view>
						<view class="logistics-cont" v-if="order_detail.is_express==1">
							<view class="logistics-num">
								<view>物流单号：</view>
								<view>{{order_detail.express_no}}</view>
							</view>
							<view class="logistics-company">
								<view>快递公司：</view>
								<view>{{order_detail.express}}</view>
							</view>
							<view class="logistics-info">
								<view>物流信息：</view>
								<view class="logistics-info-list">
									<view class="logistics-info-item" v-for="(logistics,loIndex) in order_detail.express_data.data.list">
										<view class="info-item-circular"></view>
										<view class="info-item-cont">
											<view>{{logistics.detail}}</view>
											<view>{{logistics.datetime}}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
			</block>	
		</view>
		<model :show="model_show" @closeModel="closeModel" :order_id="order_id"></model>
		
		<view class="change-price-model" v-if="change_price_show">
			<view class="change-price-box">
				<view class="change-price-tab">
					<view :class="type=='sub'?'change-price-tab-active':''" @tap="changePriceTab('sub')">优惠</view>
					<view :class="type=='add'?'change-price-tab-active':''" @tap="changePriceTab('add')">加价</view>
				</view>
				<view class="change-price-money">
					<input type="number" placeholder="请输入优惠金额(元)" v-if="type=='sub'" v-model="sub_price"/>
					<input type="number" placeholder="请输入加价金额(元)" v-if="type=='add'" v-model="add_price"/>
				</view>
				<view class="change-price-rule">
					<view v-if="type=='sub'">最多还可优惠{{order_detail.max_sub_price}}元</view>
					<view v-if="type=='add'">加价金额无限制</view>
				</view>
				<view class="change-price-btn">
					<view @tap="closeChangePrice">取消</view>
					<view @tap="subChangePrice">确认</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import model from '@/components/deliver-goods/deliver-goods.vue'
	export default {
		components:{
			model
		},
		data() {
			return {
				order_id:0,
				order_detail:{},
				model_show:false,
				change_price_show:false,
				type:'sub',
				sub_price:"",
				add_price:""
			}
		},
		onLoad(options) {
			console.log(options);
			this.order_id = options.order_id;
			this.getDetail();
		},
		methods: {
			getDetail(){
				uni.showLoading({
					title:"正在加载"
				});
				this.$request({
					url:this.$api.mch.order.detail,
					data:{
						id:this.order_id
					}
				}).then((res) => {
					uni.hideLoading();
					if(res.code == 0){	
						this.order_detail = res.data.order;
					}
					if(res.code == 1){
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
					console.log(res);
				})
			},
			
			//修改物流信息，发货
			openModel(id){
				this.model_show = true;
			},
			closeModel(){
				this.model_show = false;
			},
			
			//商品改价
			closeChangePrice(){
				this.change_price_show = false;
			},
			openChangePrice(){
				this.change_price_show = true;
			},
			changePriceTab(type){
				this.type = type;
			},
			subChangePrice(){
				uni.showLoading({
					title:"正在提交改价"
				});
				this.$request({
					url:this.$api.mch.order.edit_price,
					method:'POST',
					data:{
						order_id: this.order_id,
						type: this.type,
						price: (this.type == 'sub') ? this.sub_price : this.add_price,
					}
				}).then((res)=>{
					uni.hideLoading()
					
					if(res.code == 0){
						uni.showModal({
							title:"提示",
							content:"修改成功",
							showCancel:false,
							success:(res)=> {
								if (res.confirm) {
									uni.redirectTo({
										url:"/mch/m/order-detail/order-detail?order_id="+this.order_id+""
									})
								}
							}
						});
					}
					if(res.code == 1){
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			}
				
		}
	}
</script>

<style scoped>
	.order-detail{
		background-color: #FFFFFF;
		padding: 0 20rpx;
		border-top: 1px solid #F0F0F0;
		border-bottom: 1px solid #F0F0F0;
		margin-bottom: 20rpx;
	}
	.detail-top{
		display: flex;
		padding: 20rpx 0;
		border-bottom: 1px solid #F0F0F0;
		font-size: 34rpx;
	}
	.detail-top>view:nth-of-type(1){
		color: #25B6ED;
	}
	.detail-top>view:nth-of-type(2){
		margin-left: auto;
	}
	.order-info{
		padding: 20rpx 0;
	}
	.order-info>view{
		padding: 5rpx 0;
	}
	.order-goods-item{
		padding: 10rpx 0;
		box-sizing: border-box;
		display: flex;
	}
	.goods-img{
		width: 190rpx;
		height: 190rpx;
	}
	.goods-img>image{
		width: 100%;
		height: 100%;
	}
	.goods-info{
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
	.goods-price{
		display: flex;
		font-size: 32rpx;
	}
	.goods-price>view:nth-of-type(2){
		margin-left: auto;
		color: #FF4544;
	}
	.order-freight{
		padding: 20rpx 0;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #F0F0F0;
	}
	.order-freight>view:nth-of-type(2){
		margin-left: auto;
	}
	.order-total{
		display: flex;
		padding: 20rpx 0;
		font-size: 34rpx;
	}
	.order-total>view:nth-of-type(2){
		margin-left: auto;
	}
	.change-price{
		display: flex;
		margin-bottom: 20rpx;
		font-size: 30rpx;
	}
	.change-price>view:nth-of-type(2){
		margin-left: auto;
		border: 1px solid #CCCCCC;
		border-radius: 10rpx;
		padding: 10rpx 25rpx;
	}
	.receiving-info{
		background-color: #FFFFFF;
		border-top: 1px solid #F0F0F0;
		border-bottom: 1px solid #F0F0F0;
		padding: 0 20rpx;
		margin-bottom: 80rpx;
	}
	.receiving-top{
		padding: 20rpx 0;
		font-size: 34rpx;
		display: flex;
		border-bottom: 1px solid #F0F0F0;
	}
	.receiving-top>view:nth-of-type(1){
		color: #25B6ED;
	}
	.receiving-top>view:nth-of-type(2){
		margin-left: auto;
	}
	.addr-info{
		padding: 20rpx 0;
	}
	.addr-info>view{
		display: flex;
		padding-bottom: 15rpx;
		font-size: 34rpx;
		
	}
	.addr-info>view>view:nth-of-type(1),.logistics-cont>view>view:nth-of-type(1){
		width: 180rpx;
		text-align: justify;
		text-align-last: justify;
	}
	.addr-info>view>view:nth-of-type(2),.logistics-cont>view>view:nth-of-type(2){
		flex: 1;
	}
	.logistics{
		border-top: 1px solid #F0F0F0;
		padding: 20rpx 0;
	}
	.logistics-cont{
		padding: 20rpx 0;
	}
	.logistics-cont>view{
		padding-bottom: 15rpx;
	}
	.order-tips{
		border-top: 1px solid #F0F0F0;
	}
	.deliver{
		display: flex;
		padding: 20rpx 0;
		align-items: center;
		font-size: 34rpx;
		border-top: 1px solid #F0F0F0;
	}
	.deliver>view:nth-of-type(2){
		margin-left: auto;
		padding: 10rpx 30rpx;
		border: 1px solid #CCCCCC;
		font-size: 32rpx;
		border-radius:10rpx ;
	}
	.change{
		display: flex;
	}
	.change>view{
		margin-left: auto;
		padding: 10rpx 30rpx;
		border: 1px solid #CCCCCC;
		border-radius: 10rpx;
	}
	.logistics-cont>view{
		display: flex;
		font-size: 34rpx;
	}
	.logistics-info-item{
		display: flex;
		font-size: 32rpx;
		align-items: center;
		margin-bottom: 15rpx;
	}
	.info-item-circular{
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		background-color: #888888;
		border: 2px solid #CCCCCC;
	}
	.logistics-info-item:nth-of-type(1)>.info-item-circular{
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		background-color: #25AE5F;
		border: 2px solid #B7E8BD;
	}
	.info-item-cont{
		margin-left: 10rpx;
	}
	.logistics-info-item:nth-of-type(1)>.info-item-cont>view:nth-of-type(1){
		color: #25AE5F;
	}
	.info-item-cont>view:nth-of-type(2){
		color: #888888;
	}
	
	
	
	.change-price-model{
		width: 100vw;
		height: 100vh;
		position: fixed;
		z-index: 999;
		background-color: rgba(0,0,0,0.5);
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.change-price-box{
		background-color: #FFFFFF;
		border-radius: 20rpx;
		width: 75vw;
		overflow: hidden;
	}
	.change-price-tab{
		display: flex;
		
		font-size: 34rpx;
		border-bottom: 1px solid #F0F0F0;
	}
	.change-price-tab>view{
		flex: 1;
		text-align: center;
		padding: 25rpx 0;
	}
	.change-price-tab-active{
		background-color: #FF4544;
		color: #FFFFFF;
	}
	.change-price-money{
		margin-top: 40rpx;
		padding: 0 40rpx;
	}
	.change-price-money>input{
		border-bottom: 1px solid #E8E8E8;
		padding-bottom: 20rpx;
		font-size: 32rpx;
		color: #8E8E8E;
	}
	.change-price-rule{
		padding:20rpx 40rpx ;
		font-size: 32rpx;
		color: #8E8E8E;
	}
	.change-price-btn{
		display: flex;
		padding: 30rpx 0;
		font-size: 34rpx;
	}
	.change-price-btn>view{
		flex: 1;
		text-align: center;
	}
	.change-price-btn>view:nth-of-type(2){
		color: #FF4544;
	}
</style>
