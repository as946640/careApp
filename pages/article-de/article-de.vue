<template>
	<view>
		<!-- 文章标题 -->
		<view class="top_title">
			文章教学第一章，1.01：论润滑油的使用方法有多少种！！！
		</view>
		<!-- 作者 -->
		<view class="author  ">
			<view class="item flex flex-y-center">
			<view class="author_img">
				<image src="../../static/img/im/face/face_2.jpg" mode=""></image>
			</view>
			<view class="author_info">
				<view class="">
					骑士菌
				</view>
				<view class="">
					2020-05-20发布
				</view>
			</view>
			<view class="dingy" >
				<view class="flex flex-y-center">
					<tui-icon name="plus" :size="18" color="#fff"></tui-icon>订阅
				</view>
			</view>
		</view>
		</view>
		<!--富文本 -->
		<view class="content">
			<uParse :content="content"></uParse>
		</view>
		<!-- 广告 -->
		<view class="gg">
			<view class="item flex ">
				<view class="left">
					<image src="../../static/img/im/face/face_4.jpg" mode="aspectFill"></image>
				</view>
				<view class="right">
					<view class="title">
						汽车到你挂机和齿轮的机油25 H大苏打实打实大苏打asdasda
					</view>
					<view class="right_bottom flex flex-y-bottom">
						<view class="price">
							<text style="font-size: 15pt;">¥463</text>
							<text>卷后</text>
						</view>
						<view class="youh ">
								省¥65.00
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 富文本解析器
	import uParse from '@/components/u-parse/u-parse.vue';
	export default {
		components:{
			uParse
		},
		data() {
			return {
				content: ''
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
.top_title {
	padding: 20rpx;
	font-size: 12pt;
	border-top: 1px solid #eee;
}
.author {
	width: 100%;
	padding: 20rpx;
	border-bottom: 1px solid #eee;
	box-sizing: border-box;
		.item {
			width: 100%;
		}
		.author_img {
			width: 15%;
			height: 100rpx;
			border-radius: 50%;
				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
		}
		.author_info {
			padding-left: 20rpx;
			font-size: 10pt;
				view {
					height: 50rpx;
					font-size: 11pt;
				}
				view:last-child{
					font-size: 8pt;
					color: #878787;
				}
		}
		.dingy {
			margin-left: auto;
				view {
					color: #fff;
					font-size: 10pt;
					padding: 5rpx;
					padding-left: 20rpx;
					padding-right: 20rpx;
					border-radius: 50rpx;
					background-color: #0293EB;
				}
		}
}
.content {
	
	background-color: #eee;
}
.gg {
	width: 94%;
	height: 160rpx;
	margin: 20rpx auto;
		.item {
			width: 100%;
			background-color: #F7F7F7;
			padding: 10rpx;
				.left {
					width: 30%;
					height: 150rpx;
						image {
							width: 100%;
							height: 100%;
						}
				}
				.right {
					width: 70%;
					padding-right: 20rpx;
					box-sizing: border-box;
					padding-left: 20rpx;
						.title {
							height: 30%;
							font-size: 11pt;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							overflow: hidden;
						}
						.right_bottom {
							height: 70%;
							.price {
								color: #BB0B0B;
								font-size: 10pt;
							}
							.youh {
								display: block;
								font-size: 10pt;
								padding: 5rpx;
								padding-left: 10rpx;
								padding-right: 10rpx;
								color: #7A3004;
								background-color: #FDEEC5;
								margin-left: auto;
							}
						}
						
				}
		}
}



</style>
