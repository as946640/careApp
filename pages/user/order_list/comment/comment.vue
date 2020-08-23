<template>
	<view class="body">
		<view class="list">
			<view class="item" v-for="(item,index) in goodsList" @tap="upload(index)">
				<view class="top">
					<view class="goods-img">
						<image :src="item.goods_pic"></image>
					</view>
					<view class="icon-box">
						<view class="icon" @tap="selected(index,3)" :class="item.score==3?'active':''">
							<tui-icon class="tui-icon" name="satisfied" :size="25" color="#BBBBBB" :color="item.score==3?'#FF4544':''"></tui-icon>
							<text>好评</text>
						</view>
						<view class="icon" @tap="selected(index,2)" :class="item.score==2?'active':''">
							<tui-icon class="tui-icon" name="soso" :size="25" color="#BBBBBB" :color="item.score==2?'#FF4544':''"></tui-icon>
							<text>中评</text>
						</view>
						<view class="icon" @tap="selected(index,1)" :class="item.score==1?'active':''">
							<tui-icon class="tui-icon" name="dissatisfied" :size="25" color="#BBBBBB" :color="item.score==1?'#FF4544':''"></tui-icon>
							<text>差评</text>
						</view> 
					</view>
				</view>
				<view class="comment-cont">
					<textarea @blur="commentCont" placeholder="评价内容" maxlength="200"></textarea>
					<view class="tui-box-upload">
						<tui-upload :serverUrl="serverUrl" :limit="6" @complete="result" fileKeyName="image" @remove="remove"></tui-upload>
					</view>
				</view>
			</view>
		</view>
		<view class="btn" @tap="subComment">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serverUrl:"",
				selectedIndex:0,
				order_id:0,
				type:"",
				goodsList:[],
				tempIndex:0
			}
		},
		onLoad(options) {
			this.serverUrl = this.$api.default.upload_image;
			let data={};
			if (options.inId) {
				data = {
					order_id: options.inId,
					type: 'IN'
				}
			} else {
				data = {
					order_id: options.order_id,
					type: 'mall'
				}
			}
			this.order_id = data.order_id;
			this.type = data.type;
			uni.showLoading({
				title:"正在加载"
			})
			this.$request({
				url:this.$api.order.comment_preview,
				data:data
			}).then((res) => {
				uni.hideLoading();
				if(res.code == 0){
					console.log(res);
					for (var i in res.data.goods_list) {
						res.data.goods_list[i].score = 3;//评分
						res.data.goods_list[i].content = "";//评论内容
						res.data.goods_list[i].pic_list = [];//图片列表 
						res.data.goods_list[i].uploaded_pic_list = [];//上传图片列表
					}
					this.goodsList = res.data.goods_list;
				}
				if(res.code == 1){
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				}
			});
		},
		methods: {
			// 选择评论好坏
			selected(index,score){
				this.goodsList[index].score = score;
			},
			upload(index){
				console.log(index);
				this.tempIndex = index;
			},
			result(res){
				if(res.status == 1){
					this.goodsList[this.tempIndex].uploaded_pic_list=res.imgArr;
					console.log(this.goodsList);
				}
				if(res.status == 3){
					uni.showToast({
						title:"图片上传失败",
						icon:"none"
					})
				}
			},
			remove(res){
				console.log(this.goodsList);
			},
			commentCont(e){
				console.log(e);
				this.goodsList[this.tempIndex].content=e.detail.value
			},
			// 提交评论
			subComment(){
				uni.showLoading({
					title:"正在提交",
				})
				console.log(this.goodsList);
				for(let i=0;i<this.goodsList.length;i++){
					if(this.goodsList[i].content=="" && this.goodsList[i].pic_list.length==0){
						uni.showToast({
							title:"评论至少要有一个内容或图片",
							icon:"none"
						});
						return;
					}
				}
				this.$request({
					url:this.$api.order.comment,
					method:"POST",
					data:{
						order_id: this.order_id,
						goods_list: JSON.stringify(this.goodsList),
						type: this.type
					}
				}).then((res) => {
					uni.hideLoading();
					if(res.code == 0){
						uni.showModal({
							title:"提示",
							content:res.msg,
							showCancel:false,
							success: function (res) {
								if (res.confirm) {
									if(res.type == 'IN'){
										uni.redirectTo({
											url: "/pages/integral-mall/order/order?status=3",
										});
									}else{
										uni.redirectTo({
											url: "/pages/user/order_list/order_list?status=3",
										});
									}
								}
							}
						})
					}
				});
			}
		}
	}
</script>

<style scoped>
	.list{
		margin-bottom: 120upx;
	}
	.item{
		margin-bottom: 20upx;
	}
	.top{
		height: 120upx;
		width: 100%;
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		padding: 30upx;
		box-sizing: border-box;
		border-top:1px solid #E3E3E3 ;
		border-bottom:1px solid #E3E3E3 
	}
	.goods-img{
		width: 85upx;
		height: 85upx;
	}
	.goods-img>image{
		width: 100%;
		height: 100%;
	}
	.icon-box{
		display: flex;
		flex: 1;
	}
	.icon{
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: center;
	}
	.active{
		color: #FF4544;
	}
	.icon>text{
		font-size: 30upx;
		margin-left: 10upx;
	}
	.comment-cont{
		width: 100%;
		background-color: #FFFFFF;
		padding: 30upx;
		box-sizing: border-box;
	}
	.comment-cont>textarea{
		height: 260upx;
		font-size: 34upx;
	}
	.tui-box-upload{
		background-color: #FFFFFF;
	}
	.btn{
		width: 100%;
		height: 100upx;
		background-color: #FF4544;
		color: #FFFFFF;
		line-height: 100upx;
		text-align: center;
		position: fixed;
		bottom: 0;
		left: 0;
	}
</style>
