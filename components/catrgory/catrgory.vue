<template>
	<view>
		<!-- 分类列表 -->
		<view class="category-list">
			<view class="category" v-for="(row, index) in cateList" :key="index" @tap="toCategory(row)">
				<view class="img" >
					<image :src="row.pic_url"></image>
				</view>
				<view class="text">{{row.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'uCategory',
		props: {
			cateList: {
				type: Array,
				default: []
			},
			bgc: {
				type: String,
				default: ''
			},
			padd: {
				type: String,
				default: '0rpx'
			}
		},
		data() {
			return {


			}
		},
		onLoad: function(options) {
			// 	if(this.categoryList.length == 0){
			// 		this.categoryList=this.categoryList2
			// }
			console.log(this.cateList)
		},
		methods: {
			toCategory(e) {
				// console.log('你点击了第'+e.id);
				this.$emit('classifyitme', e)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.category-list {
		width: 92%;
		margin: 0 4%;
		padding: 0 0 30upx 0;
		border-radius: 20rpx;
		border-bottom: solid 2upx #f6f6f6;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.category {
			width: 25%;
			margin-top: 30rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;

			.img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				padding: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
				 background-image: linear-gradient(to right, #52F5EA , #8EE8B2);
				 box-shadow: 5rpx 6rpx 4rpx #ccc;
				image {
					width: 100%;
					height: 100%;
				}
			}

			.text {
				margin-top: 16upx;
				width: 100%;
				display: flex;
				justify-content: center;
				font-size: 24upx;
				color: #3c3c3c;
			}
		}
	}
</style>
