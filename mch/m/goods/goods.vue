<template>
	<view class="body" @tap="declickHide">
		<view class="header">
			<view class="search">
				<input type="text" placeholder="搜索" :value="keyword" @confirm="searchGoods"/>
			</view>
			<view class="tab">
				<view class="tab-item" @tap="queryStatus(1)">
					<text :class="status==1?'active':''">出售中</text>
				</view>
				<view class="tab-item" @tap="queryStatus(2)">
					<text :class="status==2?'active':''">售罄</text>
				</view>
				<view class="tab-item" @tap="queryStatus(3)">
					<text :class="status==3?'active':''">仓库中</text>
				</view>
				<view class="tab-item" @tap="queryStatus(4)">
					<text :class="status==4?'active':''">最新</text>
				</view>
			</view>
		</view>
		<view class="cont">
			<view class="item" v-for="(item,index) in goodsList" :key="index">
				<view class="img">
					<image :src="item.cover_pic"></image>
				</view>
				<view class="goods-info">
					<view class="goods-name">{{item.name}}</view>
					<view class="goods-price">￥{{item.price}}</view>
					<view class="goods-num">
						<view>库存：{{item.goods_num}}</view>
						<view>销量：{{item.sale_num}}</view>
					</view>
				</view>
				<view class="more">
					<image src="../../../static/img/mch/gengduomore10.png" @tap.stop="declick(index)"></image>
					<view class="more-cont" v-if="item.operation" :animation="animationData">
						<block v-if="item.status == 1">
							<view class="down" @tap="setGoods(item.id,0,index)">
								<image src="../../../static/img/mch/icon-xiajia.png"></image>
								<view>下架</view>
							</view>
						</block>
						<block v-if="item.status == 0">
							<view class="up" @tap="setGoods(item.id,1,index)">
								<image src="../../../static/img/mch/icon-xiajia.png"></image>
								<view>上架</view>
							</view>
						</block>
						<view class="del" @tap="delGoods(item.id)">
							<image src="../../../static/img/mch/icon-shanchu.png"></image>
							<view>删除</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="no_more">
			<block v-if="is_no_more">没有更多</block>
			<block v-else>加载中...</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				animationData:{},
				// operation: false,
				goodsList:[],
				is_no_more:false,
				status:1,
				page:1,
				keyword:""
			}
		},
		onShow() {
			// 初始化一个动画
			var animation = uni.createAnimation({
				duration: 500,
				timingFunction: 'ease',
			})
			this.animation = animation;
			
			this.getGoodsInfo();
		},
		methods: {
			declick(index) {
				this.operationShow()
				this.goodsList[index].operation = this.goodsList[index].operation?false:true;
				for(let i=0;i<this.goodsList.length;i++){
					if(index!=i){
						this.goodsList[i].operation = false;
					}
				}
			},
			declickHide(){
				for(let i=0;i<this.goodsList.length;i++){
					this.goodsList[i].operation = false;
				}
			},
			operationShow() {
				this.animation.opacity(1).step()
				this.animationData = this.animation.export()
			},
			getGoodsInfo(){
				uni.showLoading({
					title:"正在加载",
				});
				this.$request({
					url:this.$api.mch.goods.list,
					data:{
						page:this.page,
						status:this.status,
						keyword:this.keyword
					}
				}).then((res)=>{
					uni.hideLoading();
					console.log(res);
					if(res.code == 0){
						for(let i=0;i<res.data.list.length;i++){
							res.data.list[i].operation = false;
						}
						this.goodsList = res.data.list;
					}
					if(res.code == 1){
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
					this.is_no_more = true;
				})
			},
			queryStatus(status){
				this.status = status;
				this.keyword = "";
				this.goodsList = [];
				this.getGoodsInfo();
			},
			// 设置上下架
			setGoods(goods_id,status,index){
				this.keyword = "";
				uni.showLoading({
					title:"正在处理"
				})
				this.declick(index);
				this.$request({
					url:this.$api.mch.goods.set_status,
					data:{
						id:goods_id,
						status:status
					}
				}).then((res) => {
					uni.hideLoading();
					if(status == 0){
						this.goodsList = [];
						this.getGoodsInfo();
					}
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
					console.log(res);
				})
			},
			// 删除商品
			delGoods(goods_id){
				uni.showModal({
					title:"警告",
					content:"请确认是否要删除该商品",
					success:  (res) => {
						if (res.confirm) {
							this.$request({
								url:this.$api.mch.goods.delete,
								data:{
									id:goods_id
								}
							}).then((res) => {
								this.goodsList = [];
								this.keyword = "";
								this.getGoodsInfo();
								uni.showToast({
									title:res.msg,
									icon:"none"
								})
							})
						}
					}
				})
			},
			searchGoods(e){
				this.keyword = e.detail.value;
				this.goodsList = [];
				this.getGoodsInfo();
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
		border-bottom: 1px solid #E3E3E3;
	}

	.tab>view {
		flex: 1;
		text-align: center;
	}

	.tab>view>text.active {
		display: inline-block;
		line-height: 90rpx;
		border-bottom: 1px solid #FF4544;
		color: #FF4544;
	}

	.cont {
		background-color: #FFFFFF;
		padding-top: 200rpx;
	}

	.item {
		display: flex;
		padding: 30rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #E3E3E3;
	}

	.img {
		width: 170rpx;
		height: 170rpx;
	}

	.img>image {
		width: 100%;
		height: 100%;
	}

	.goods-info {
		flex: 3;
		margin-left: 30rpx;
	}

	.goods-name {
		height: 80rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.goods-price {
		color: #FF456E;
		padding-top: 8rpx;
	}

	.goods-num {
		display: flex;
		color: #888888;
	}

	.goods-num>view:nth-of-type(2) {
		margin-left: auto;
	}

	.more {
		flex: 1;
		text-align: right;
		font-size: 20rpx;
		position: relative;
	}

	.more>image {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		bottom: -8rpx;
		right: 0;
		color: #888888;
	}

	.more-cont {
		position: absolute;
		right: 0;
		bottom: 50rpx;
		border-radius: 10rpx;
		width: 200rpx;
		height: 110rpx;
		background-color: #404040;
		display: flex;
		align-items: center;
		text-align: center;
		opacity: 0;
	}

	.more-cont>view {
		flex: 1;
		font-size: 20rpx;
		color: #FFFFFF;
	}

	.more-cont>view>image {
		width: 40rpx;
		height: 40rpx;
	}
	.up>image{
		transform: rotateZ(180deg);
	}
	.del {
		position: relative;
	}
	.del::after {
		content: "";
		display: block;
		position: absolute;
		width: 0;
		height: 0;
		border-top: 35rpx solid #404040;
		border-left: 30rpx solid transparent;
		border-right: 30rpx solid transparent;
		right: 8rpx;
	}
	.no_more{
		text-align: center;
		line-height: 100rpx;
		color: #888888;
	}
</style>
