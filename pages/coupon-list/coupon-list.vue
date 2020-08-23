<template>
	<view>
		<view class="list">
			<!-- 优惠券列表 -->
			<view class="sub-list valid" >
				<view class="tis" v-if="couponValidList.length==0">没有数据~</view>
				<view class="row" v-for="(row,index) in couponValidList" :key="index" >
					<!-- content -->
					<view class="carrier" v-if="row.is_receive == 0">
						<view class="left">
							<view class="title">
								{{row.name}}立减{{row.sub_price}}元
							</view>
							<!-- 使用期限 -->
							<view class="term">
								<text>有效日期：领取{{row.expire_day}}天内有效</text>
								<text>{{row.content}}</text>
							</view>
							<view class="gap-top"></view>
							<view class="gap-bottom"></view>
						</view>
						<view class="right">
							<view class="ticket">
								<view class="num">
									{{row.sub_price}}元
								</view>
								<view class="unit">
									元
								</view>
							</view>
							<view class="criteria">
								满{{row.min_price}}使用
							</view>
							<view class="use"@click="getReceive(row)">
								立即领取
							</view>
						</view>
					</view>
				
					<view class="carrier" v-if="row.is_receive == 1">
						<view class="left" style="background-color: #ccc;">
							<view class="title">
								{{row.name}}立减{{row.sub_price}}元
							</view>
							<!-- 使用期限 -->
							<view class="term">
								<text>有效日期：领取{{row.expire_day}}天内有效</text>
								<text>{{row.content}}</text>
							</view>
							<view class="gap-top"></view>
							<view class="gap-bottom"></view>
						</view>
						<view class="right"  style="background:#ccc;">
							<view class="ticket">
								<view class="num">
									{{row.sub_price}}元
								</view>
								<view class="unit">
									元
								</view>
							</view>
							<view class="criteria">
								满{{row.min_price}}使用
							</view>
							<view class="use" style="color: #ccc;">
								已领取
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
				couponValidList:[],  //优惠卷
				headerTop:0,
				//控制滑动效果
				isStop:false
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
			this.getDiscounts()
			
		},
		methods: {
	
			// 获取优惠卷
			getDiscounts() {
				this.$request({
					 url: this.$api.default.coupon_list,
				}).then(res => {
					console.log(res);
					this.couponValidList = res.data.list
				})
			},
			// 领取优惠卷
			getReceive(row){
				console.log('1010');
				uni.showLoading({
					title:'领取中'
				})
				this.$request({
					 url:this.$api.coupon.receive,
					 data:{
						 id:row.id
					 }
				}).then(res => {
					console.log(res);
					uni.hideLoading()
					uni.showToast({
						title:'领取成功'
					})
				})
			},
		}
	}
</script>
<style lang="scss">
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
	.list{
		width: 100%;
		display: block;
		position: relative;
	}

	.sub-list{
	
		width: 100%;
		padding: 20upx 0 120upx 0;
		.tis{
			width: 100%;
			height: 60upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}
		.row{
			width: 92%;
			height: 24vw; 
			margin: 20upx auto 10upx auto;
			border-radius: 8upx;
			// box-shadow: 0upx 0 10upx rgba(0,0,0,0.1);
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;
			.menu{
				.icon{
					color: #fff;
					font-size:50upx;
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
			.carrier{
			
				background-color: #fff;
				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				flex-wrap: nowrap;
				.left{
					width: 100%;
					.title{
						padding-top: 3vw;
						width: 90%;
						margin: 0 5%;
						font-size: 36upx;
					}
					.term{
						width: 90%;
						margin: 0 5%;
						font-size: 26upx;
						color: #999;
					}
					position: relative;
					.gap-top,.gap-bottom{
						position: absolute;
						width: 20upx;
						height: 20upx;
						right: -10upx;
						border-radius: 100%;
						background-color: #f5f5f5;
					}
					.gap-top{
						top: -10upx;
					}
					.gap-bottom{
						bottom: -10upx;
					}
					.shixiao{
						position: absolute;
						right: 20upx;
						font-size: 150upx;
						z-index: 6;
						color: rgba(153,153,153,0.2)
					}
				}
				.right{
					flex-shrink: 0;
					width: 28%;
					color: #fff;
					background:linear-gradient(to right,#ec625c,#ee827f);
					&.invalid{
						background:linear-gradient(to right,#aaa,#999);
						.use{
							color: #aaa;
						}
					}
					justify-content: center;
					.ticket,.criteria{width: 100%;}
					.ticket{
						padding-top: 1vw;
						justify-content: center;
						align-items: baseline;
						height: 6vw;
						.num{
							font-size: 42upx;
							font-weight: 600;
						}
						.unit{
							font-size: 24upx;
						}
					}
					.criteria{
						justify-content: center;
						
						font-size: 28upx;
					}
					.use{
						width: 60%;
						height: 50upx;
						justify-content: center;
						align-items: center;
						font-size: 24upx;
						background-color: #fff;
						color: #ee827f;
						border-radius: 20upx;
						padding: 0 10upx;
					}
				}
			}
		}
	}
	
</style>
