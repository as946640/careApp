<template>
	<view
		class="upload-img"
		:style="{
			width: width + 'rpx',
			height: height + 'rpx',
			'background-image': 'url(' + bgsrc + ')'
		}"
		@tap="handleAddNewImage"
	>
		<image class="cover" :src="currentImage" mode="aspectFill"></image>
	</view>
</template>

<script >
export default {
	props: {
		width: {
			type: Number,
			default: 300
		},
		height: {
			type: Number,
			default: 190
		},
		types: {
			type:String,
			default: 'shopimg'
		},
		bgsrc: {
			type: String
		}
	},
	data() {
		return {
			currentImage: '',
			choosed:false
		};
	},
	methods: {
		handleAddNewImage() {
			var _that = this;
			uni.chooseImage({
				count: 1,
				sourceType: ['album', 'camera'],
				success:function(res){
					console.log(res);
					_that.choosed = true;
					uni.showLoading({
						title:"上传中"
					})
					// uni.uploadFile({
					// 	url:_that.$api.default.upload_image,
					// 	name: "image",
					// 	filePath: res.tempFilePaths[0],
					// 	success:function (res){
					// 		let data = JSON.parse(res.data);
					// 		console.log(data);
					// 		if(res.statusCode == 200) {
					// 			if(data.code ==0) {
					// 				_that.currentImage =data.data.url;
					// 				// 传递给父组件
					// 				_that.$emit('chooseimg', {
					// 					src: _that.currentImage,
					// 					type:_that.types
					// 				});
					// 				uni.hideLoading()
					// 			}
					// 			if(data.code == 1) {
					// 				uni.showToast({
					// 					title:data.msg
					// 				})
					// 				_that.choosed = false;
					// 			}
					// 		}
					// 	},
					// 	fail: function (fail) {
					// 		console.log(fail);
					// 		console.log('进入错误');
					// 		uni.showToast({
					// 			title:fail
					// 		})
					// 	}
					// })
				}
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.upload-img {
	position: relative;
	background-size: 100% 100%;
	-webkit-background-size: 100% 100%;
	border: 2px dashed #ccc;
	box-sizing: border-box;
	.cover {
		display: inline-block;
		width: 100%;
		height: 100%;
		
	}
	.plusicon{
		position: absolute;
	}
}
</style>
