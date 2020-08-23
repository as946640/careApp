<template>
	<view>
		<view class="content">
			<uParse :content="content"></uParse>
		</view>
	</view>
</template>

<script>
	// 富文本解析器
	import uParse from '@/components/u-parse/u-parse.vue';
	export default {
		components: {
			uParse
		},
		data() {
			return {
				content:''
			};
		}
	}
</script>

<style lang="less">
.content {
	padding: 20rpx;
}
</style>
