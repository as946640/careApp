<template>
	<view>
		<uParse :content="content"></uParse>
	</view>
</template>

<script>
	// 富文本解析器
	import uParse from '@/components/u-parse/u-parse.vue';
	export default {
		data() {
			return {
				title:'',
				content: ''
			}
		},
		components: {
			uParse
		},
		onLoad: function (options) {
			console.log(options);
			this.getDetall(options.id || 2)
		},
		methods: {
			getDetall(id) {
				this.$request({
					url : this.$api.default.article_detail,
					data: {
						id : id
					}
				}).then(res => {
					console.log(res);
					this.title = res.data.title;
					this.content = res.data.content;
				})
			}
		}
	}
</script>

<style>

</style>
