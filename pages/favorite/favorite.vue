<template>
	<view>
		<view class="zhanw">
			
		</view>
		<view class="header flex flex-y-center">
			<view class="" style="width: 10%;" @tap="back">
				<tui-icon name="arrowleft" color="#fff"></tui-icon>
			</view>
			<view class="title" style="font-size: 15pt;">
				<text>地址管理</text>
			</view>
		</view>
		
		
		
		<view class="tabr" :style="{top:headerTop}">
			<view :class="{on:typeClass=='goods'}" @tap="switchType('goods')">商品({{goodsList.length}})</view>
			<view :class="{on:typeClass=='shop'}"  @tap="switchType('shop')">店铺({{serveBranch.length}})</view>
			<view class="border" :class="typeClass"></view>
		</view>
		
		<view class="list">
			<!-- 收藏列表 -->
			<view class="sub-list goods" :class="subState">
				<view class="tis" v-if="goodsList.length==0">没有数据~</view>
				
				<view class="row" v-for="(row,index) in goodsList" :key="index" >
					
					<!-- content -->
					<view class="carrier" :class="[typeClass=='goods'?theIndex==index?'open':oldIndex==index?'close':'':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
						<view class="goods-info" @tap="toGoods(row)">
							<view class="img">
								<image :src="row.goods_pic"></image>
							</view>
							<view class="info">
								<view class="title">{{row.name}}</view>
								<view class="price-number">
									<view class="keep-num" v-if="row.is_negotiable == 1">
										到店面议
									</view>
									<view class="price">￥{{row.price}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 店铺列表 -->
			<view class="sub-list shop" :class="subState">
				<!-- 网点选择 -->
				<view class="content">
					<view class="branch-item" v-for="(item, index) in serveBranch" :key='index' @click="branchD(item)">
						<view class="top">
							<view class="">
								<tui-icon name="shop-fill" :size="25" color="#134AFF"></tui-icon>
							</view>
							<view class="title">
								<text>{{item.name}}</text>
							</view>
							<view class="link">
								<block v-if="item.link">
									<tui-icon name="star-fill" :size="22" color="#F3B124"></tui-icon>
								</block>
								<block v-else>
									<tui-icon name="star" :size="22" color="#F3B124"></tui-icon>
								</block>
							</view>
						</view>
						<view class="bottom flex flex-y-center">
							<view class="left">
								<view class="left-top">
									<view class="time">
										<view class="shij">
											时间：
										</view>
										<view class="shijs">
											<view class="">
												<text>工作日：{{item.time.gz}}</text>
											</view>
											<view class="">
												<text>周末及假期：{{item.time.zm}}</text>
											</view>
										</view>
									</view>
									<view class="site">
										<view class="">
											地址：
										</view>
										<view class="">
											{{item.position}}
										</view>
									</view>
								</view>
								<view class="left-bottom">
									<view class="flex flex-y-center">
										<tui-icon name="position" :size="20" color="#F"></tui-icon>路线
									</view>
									<view class="flex flex-y-center">
										<tui-icon name="voipphone" :size="20" color="#134AFF"></tui-icon>电话
									</view>
								</view>
							</view>
							<view class="right">
								<image src="/static/img/shop/1.jpg" mode="aspectFill"></image>
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
				goodsList:[
					
				],
				shopList:[
					{id:1,name:"冰鲜专卖店",img:"/static/img/shop/1.jpg"},
					{id:2,name:"果蔬天下",img:"/static/img/shop/2.jpg"},
					{id:3,name:"办公耗材用品店",img:"/static/img/shop/3.jpg"},
					{id:4,name:"天天看好书",img:"/static/img/shop/4.jpg"}
				],
				headerTop:0,
				//控制滑动效果
				typeClass:'goods',
				subState:'',
				theIndex:null,
				oldIndex:null,
				isStop:false,
				page:1,
				is_no_more: false,
				serveBranch: [
					{
						name: '广州市白云区汽车维护服务点',
						time: {
							gz:'8:30至16：00',
							zm:'8:30至11：00'
						},
						position: '机场路3698号',
						link: true,
						url: '/pages/branch-details/branch-details'
					},
					{
						name: '广州市白云区汽车维护服务点',
						time: {
							gz:'8:30至11：00',
							zm:'8:30至11：00'
						},
						position: '机场路3698号',
						link: true
					},
					{
						name: '广州市白云区汽车维护服务点',
						time: {
							gz:'8:30至11：00',
							zm:'8:30至11：00'
						},
						position: '机场路3698号',
						link: true
					},
					{
						name: '广州市白云区汽车维护服务点',
						time: {
							gz:'8:30至11：00',
							zm:'8:30至11：00'
						},
						position: '机场路3698号',
						link: true
					}
					
				],
							
			}
		},
		onPageScroll(e){
			
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {
			//兼容H5下排序栏位置
			// #ifdef H5
				//定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
				let Timer = setInterval(()=>{
					let uniHead = document.getElementsByTagName('uni-page-head');
					if(uniHead.length>0){
						this.headerTop = uniHead[0].offsetHeight+'px';
						clearInterval(Timer);//清除定时器
					}
				},1);
			// #endif
			
			this.getFvorite({
				reload: true,
				page: this.page,
			})
		},
		methods: {
			switchType(type){
				if(this.typeClass==type){
					return ;
				}
				uni.pageScrollTo({
					scrollTop:0,
					duration:0
				})
				this.typeClass = type;
				this.subState = this.typeClass==''?'':'show'+type;
				setTimeout(()=>{
					this.oldIndex = null;
					this.theIndex = null;
					this.subState = this.typeClass=='goods'?'':this.subState;
				},200)
			},
			//控制左滑删除效果-begin
			touchStart(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				
				if(moveX<0){
					this.theIndex = index;
					this.isStop = true;
				}else if(moveX>0){
					if(this.theIndex!=null&&this.oldIndex==this.theIndex){
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(()=>{
							this.oldIndex = null;
						},150)
					}
				}
			},
			
			touchEnd(index,$event){
				//解除禁止触发状态
				this.isStop = false;
			},
			
			//删除商品
			deleteCoupon(id,List){
				let len = List.length;
				for(let i=0;i<len;i++){
					if(id==List[i].id){
						List.splice(i, 1);
						break;
					}
				}
				this.oldIndex = null;
				this.theIndex = null;
			},
			// 收藏数据
			getFvorite(args) {
				
				if(this.is_no_more) {
					uni.showToast({
						title:'没有更多'
					})
					return
				}
				uni.showLoading({
					title:"加载中"
				})
				this.$request({
					url:this.$api.user.favorite_list,
					data: {
						page: args.page
					}
				}).then(res => {
					console.log(res);
					if(res.code == 0) {
						if(this.page == 1) {
							this.goodsList = res.data.list;
						}
						if(this.page < res.data.page_count) {
							this.page ++;
						}
						if(this.page > 1) {
							this.goodsList = this.goodsList.concat(res.data.list)
						}
						if(this.page == res.data.page_count) {
							this.is_no_more = true
						}
						uni.hideLoading()
					}
				})
			},
			branchD(e){
				uni.navigateTo({
					url:e.url
				})
			},
			back() {
				uni.navigateBack()
			},
			
			
			
		}
	}
</script>
<style lang="scss" scoped>
	.zhanw {
		width: 100%;
		height: var(--status-bar-height);
	}
	
	.header {
		height: 100rpx;
		width: 100%;
		background-image: url('/static/img/home/header.png');
		background-size: 50%;
		.title {
			width: 80%;
			color: #fff;
			justify-content: center;
			align-items: center;
			padding-right: 10%;
			text-align: center;
		}
	}	
	view{
		display: flex;
		flex-wrap: wrap;
	}
	page{position: relative;background-color: #f5f5f5;}
	
	
	.hidden{
		display: none !important;
	}
	.place{
		width: 100%;
		height: 95upx;
	}
	.tabr{
		background-color: #fff;
		width: 94%;
		height: 95upx;
		padding: 0 3%;
		border-bottom: solid 1upx #dedede;
		
		view{
			width: 50%;
			height: 90upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			color: #999;
		}
		.on{
			color: #134AFF;
		}
		.border{
			height: 4upx;
			background-color: #134AFF;
			transition: all .3s ease-out;
			&.shop{
				transform: translate3d(100%,0,0);
			}
		}
		
	}
	.list{
		width: 100%;
		display: block;
		position: relative;
	}
	@keyframes showGoods {
		0% {transform: translateX(-100%);}100% {transform: translateX(0);}
	}
	@keyframes showShop {
		0% {transform: translateX(0);}100% {transform: translateX(-100%);}
	}
	.sub-list{
		&.shop{
			position: absolute;
			top: 0;
			left:100%;
			display: none;
		}
		&.showgoods{
			display: flex;
			animation: showGoods 0.20s linear both;
		}
		&.showshop{
			display: flex;
			animation: showShop 0.20s linear both;
		}
		width: 100%;
		padding: 20upx 0 120upx 0;
		.tis{
			width: 100%;
			height: 60upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}
		&.shop{
			.row{
				height: 20vw;
				.left{
					width: 20vw;
					height: 20vw;
					padding-left: 20upx;
					align-items: center;
					image{
						width: 18vw;
						height: 18vw;
						border-radius: 100%;
					}
				}
				.right{
					height: 20vw;
					align-items: center;
					font-size: 32upx;
				}
			}
		}
		.row{
			width: 94%;
			height: 30vw; 
			margin:10rpx auto;
			align-items: center;
			border-radius: 20rpx;
			.carrier{
				
				background-color: #fff;
				width: 100%;
				padding: 0 0;
				height: 100%;
				flex-wrap: nowrap;
				border-radius: 20rpx;
				.goods-info{
					width: calc(100% - 40upx);
					padding: 20upx;
					flex-wrap: nowrap;
					.img{
						width: calc(30vw - 40upx);
						height: calc(30vw - 40upx);
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 20upx;
						image{
							width: calc(30vw - 40upx);
							height: calc(30vw - 40upx);
						}
					}
					.info{
						width: 100%;
						height: calc(30vw - 40upx);
						overflow: hidden;
						flex-wrap: wrap;
						align-content: space-between;
						position: relative;
						.title{
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						
						.price-number{
							width: 100%;
							justify-content: space-between;
							align-items: baseline;
							
							.keep-num{
								font-size: 26upx;
								color: #999;
							}
							.price{
								font-size: 30upx;
								color: #f06c7a;
							}
						}
					}
				}
			}

		}
		
	}
	
	.sub-list {
		.content {
			width: 100%;
			background-color: #F7F7F7;
				.branch-item {
					width: 94%;
					padding: 20rpx;
					margin: 10rpx auto;
					background-color: #FFFFFF;
					border-radius: 10rpx;
					box-shadow: 2rpx 2rpx 4rpx #ccc;
					box-sizing: border-box;
						.top {
							width: 100%;
							display: flex;
							align-items: center;
							height: 80rpx;
							border-bottom: 1px solid #F7F7F7;
							box-sizing: border-box;
								view:first-child {
									width: 10%;
									padding-left: 10rpx;
									min-width: 10%;
										image {
											width:60rpx;
											height: 60rpx;
										}
								}
								.title {
									width: 60%;
									display: flex;
									font-size: 11pt;
								}
								.link {
									margin-left: auto;
									padding-right: 10rpx;
								}
						}
						.bottom {
							width: 100%;
							padding-top: 10rpx;
							display: flex !important;
								.left {
									display: block !important;
									width: 60%;
									font-size: 10pt;
									margin: 0;
									padding-left: 10rpx;
										.left-top {
											width: 100%;
											margin: 0;
											margin-top: 5%;
											padding-right: 10rpx;
											.time {
												height: 150rpx;
												display: flex;
													.shij {
														width: 80rpx;
														min-width: 80rpx;
													}
												.shijs {
													width: 280rpx;
													min-width: 300rpx;
													font-size: 9pt;
														view:last-child {
															margin-top: 10%;
														}
												}
											 }
											 .site {
												
											 }
										}
											.site {
												display: flex;
												view: last-child {
													padding-left: 10rpx;
												}
											}
										
										
										.left-bottom {
											width: 100%;
											margin: 0;
											margin-top: 10rpx;
											display: flex;
											padding-left: 20rpx;
											color: #134AFF;
												view:first-child {
													width: 50%;
												}
										}
								}
								.right {
									width: 35%;
									height: 100%;
									display: block !important;
									padding-left: 10rpx;
										image {
											width: 100%;
											height: 100%;
											border-radius: 10rpx;
										}
								}
						}
				}
		}
		
	}
	
</style>
