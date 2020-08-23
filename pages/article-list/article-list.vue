<template>
	<view>
		<tui-list-view >
			<tui-list-cell @click="detail(item.id)" :arrow="true" v-for="(item, index) in artcle_list" :key='index'>
				{{item.title}}
			</tui-list-cell>
		</tui-list-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				artcle_list: []
			}
		},
		onLoad() {
			this.getAritcle()
		},
		methods: {
			detail: function(id) {
				console.log('点击率'+id);
				uni.navigateTo({
					url: '/pages/article-detail/article-detail?id=' + id
				})
			},
			// 服务中心数据
			getAritcle() {
				this.$request({
					url: this.$api.default.article_list,
					data : {
						cat_id : 2
					}
				}).then(res => {
					console.log(res);
					this.artcle_list = res.data.list
				})
			}
		}
	}
</script>

<style>

</style>
