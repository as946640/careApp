<template>
	<view class="body">
		<view class="content">
			<view class="label">
				<view :class="selected=='score_all'?'active':''">
					全部({{comment_count.score_all}})
				</view>
				<view>
					好评({{comment_count.score_3}})
				</view>
				<view>
					中评({{comment_count.score_2}})
				</view>
				<view>
					差评({{comment_count.score_1}})
				</view>
			</view>

			<!-- 评论列表 -->
			<view class="list">
				<view class="row" v-for="(row,Rindex) in ratingsList">
					<view class="left flex">
						<view class="face flex-y-center">
							<image :src="row.avatar_url"></image>
						</view>
					</view>
					<view class="right">
						<view class="name-date">
							<view class="username">
								{{row.nickname}}
							</view>
							<view class="date">
								{{row.addtime}}
							</view>
						</view>
						<view class="spec">
							{{row.content}}
						</view>
						<view class="first">
							<view class="rat" style="display: none;">

							</view>
							<view class="img-video">
								<view class="box" v-for="(item,index) in row.pic_list" @tap="showBigImg(row.pic_list,index)">
									<image mode="aspectFill" :src="item"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<block v-if="is_no_more">没有更多</block>
			<block v-else>正在加载...</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				labelList: ['全部', '好评', '中评', '差评'],
				comment_count: {},
				selected: "score_all",
				ratingsList: [],
				videoDirection: 0,
				showFullscreenBtn: true,
				showPlayBtn: true,
				isPlayVideo: true,
				videoSrc: '',
				page: 1,
				is_no_more: false,
				goods_id: ''
			};
		},

		onLoad: function(options) {
			this.goods_id = options.id
			console.log(options.id);
			this.getCommentList(this.goods_id)
		},

		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
			this.getCommentList(this.goods_id)
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			this.getCommentList(this.goods_id)
		},
		methods: {
			loadRatings(select) {
				this.selected = select;
			},

			// 评论信息
			getCommentList(id) {
				var self = this;
				if (self.is_no_more) {
					return
				}
				uni.showLoading({
					title:"加载中"
				})
				self.$request({
					url: self.$api.default.comment_list,
					data: {
						goods_id: id,
						page: self.page
					}
				}).then(res => {
					uni.hideLoading();
					console.log(res);
					if (res.code == 0) {
						this.comment_count = res.data.comment_count;
						if (this.page == 1) {
							this.ratingsList = res.data.list;
						}
						if (this.page > 1) {
							this.ratingsList = this.ratingsList.concat(res.data.list)
						}
						if(this.page < res.data.page_count){
							this.page++ ;
						}
						if (this.page >= res.data.page_count) {
							this.is_no_more = true;
							return
						}
						
					}
				})
			},

			playVideo(path) {
				this.videoSrc = path;
				// this.isPlayVideo = true;
				this.$nextTick(function() {
					this.videoContext.requestFullScreen({
						direction: 0
					});
				});

			},
			stopPlayVideo() {
				this.videoContext.pause();
			},
			videoPause() {
				// this.isPlayVideo = false;
				this.videoSrc = '';
			},
			viderFullscreen(e) {
				if (e.detail.fullScreen) {
					this.videoContext.play();
				} else {
					this.stopPlayVideo();
				}
			},

			//显示大图
			showBigImg(src, index) {
				uni.previewImage({
					current: index, //预览图片的下标
					urls: src //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #eee;
	}
	
	.myVideo {
		position: fixed;
		top: 50%;
		right: 100%;
	}
	.footer{
		text-align: center;
		line-height: 100rpx;
	}
	.content {
		view {
			display: flex;
		}

		width: 94%;
		padding: 0 3%;

		.label {
			width: 100%;
			background-color: #fff;
			margin: 10rpx auto;
			border-radius: 20rpx;
			padding: 20rpx 50rpx;
			box-sizing: border-box;
			justify-content: space-between;
			
			view {
				padding: 0 20rpx;
				height: 50rpx;
				border-radius: 20rpx;
				border: solid 1rpx #ddd;
				align-items: center;
				color: #555;
				font-size: 26rpx;
				background-color: #f9f9f9;
			}
			
			.active{
				background-color: #FF4544;
				color: #FFFFFF;
			}
		}

		.list {
			width: 100%;
			flex-wrap: wrap;

			box-sizing: border-box;

			.row {
				width: 100%;
				padding: 10rpx;
				background-color: #fff;
				margin: 10rpx auto;
				box-sizing: border-box;
				border-radius: 20rpx;
				border-bottom: 1px solid #eee;

				.left {
					width: 10vw;
					flex-shrink: 0;
					margin-right: 10rpx;

					.face {
						width: 100%;

						image {
							width: 10vw;
							height: 10vw;
							border-radius: 100%;
						}

					}
				}

				.right {
					width: 100%;
					padding-left: 10rpx;
					flex-wrap: wrap;

					.name-date {
						width: 100%;
						justify-content: space-between;
						padding-top: 15rpx;
						align-items: baseline;

						.username {
							font-size: 32rpx;
							color: #555;
						}

						.date {
							font-size: 28rpx;
							color: #aaa;
						}
					}

					.spec {
						width: 100%;
						margin-top: 20rpx;
						color: #aaa;
						font-size: 10pt;
					}

					.first {
						width: 100%;
						flex-wrap: wrap;

						.rat {
							font-size: 30rpx;
						}

						.img-video {
							width: 100%;
							flex-wrap: wrap;

							.box {
								width: calc((84.6vw - 50rpx)/4);
								height: calc((84.6vw - 50rpx)/4);
								margin: 5rpx 5rpx;
								position: relative;
								justify-content: center;
								align-items: center;

								image {
									position: absolute;
									width: 100%;
									height: 100%;
									border-radius: 10rpx;
								}

								.playbtn {
									position: absolute;

									.icon {
										font-size: 80rpx;
										color: rgba(255, 255, 255, .9)
									}
								}
							}
						}
					}

					.append {
						width: 100%;
						flex-wrap: wrap;

						.date {
							width: 100%;
							height: 40rpx;
							border-left: 10rpx solid #f06c7a;
							padding-left: 10rpx;
							align-items: center;
							font-size: 32rpx;
							margin: 20rpx 0;
						}

						.rat {
							font-size: 30rpx;
						}

						.img-video {
							width: 100%;
							flex-wrap: wrap;

							.box {
								width: calc((84.6vw - 10rpx - (10rpx * 4))/4);
								height: calc((84.6vw - 10rpx - (10rpx * 4))/4);
								margin: 5rpx 5rpx;
								position: relative;
								justify-content: center;
								align-items: center;

								image {
									position: absolute;
									width: 100%;
									height: 100%;
									border-radius: 10rpx;
								}

								.playbtn {
									position: absolute;

									.icon {
										font-size: 80rpx;
										color: rgba(255, 255, 255, .9);
									}
								}
							}
						}
					}
				}
			}
		}
	}

	/*
* <view class="list">
				<view class="row">

					<view class="right">
						
						<view class="spec">
							规格：XL
						</view>
						<view class="first">
							<view class="rat">
								好看，可以，不愧是专业的，才拿到手上就研究了半天才装上
							</view>
							<view class="img-video">
								<view class="box">
									<image src="https://ae01.alicdn.com/kf/HTB1wREwTXzqK1RjSZFvq6AB7VXaT.jpg"></image>
									<view class="playbtn">
										<view class="icon bofang"></view>
									</view>
								</view>
								<view class="box">
									<image src="https://ae01.alicdn.com/kf/HTB1wREwTXzqK1RjSZFvq6AB7VXaT.jpg"></image>
								</view>
								<view class="box">
									<image src="https://ae01.alicdn.com/kf/HTB1wREwTXzqK1RjSZFvq6AB7VXaT.jpg"></image>
								</view>
							</view>
						</view>
						<view class="append">
							<view class="date">
								65天后追加
							</view>
							<view class="rat">
								好看，可以，不愧是专业的，才拿到手上就研究了半天才装上
							</view>
							<view class="img-video">
								<view class="box">
									<image src="https://ae01.alicdn.com/kf/HTB1wREwTXzqK1RjSZFvq6AB7VXaT.jpg"></image>
								</view>
								<view class="box">
									<image src="https://ae01.alicdn.com/kf/HTB1wREwTXzqK1RjSZFvq6AB7VXaT.jpg"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			* 
			* */
</style>
