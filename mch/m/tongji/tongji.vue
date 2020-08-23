<template>
	<view class="body">
		<scroll-view scroll-x="true" :scroll-left="month_scroll_x">
			<view class="tab-box">
				<view class="tab"></view>
				<view class="tab"></view>
				<view class="month" v-if="year_list.length>0" v-for="(item,yearIndex) in year_list">
					<view class="box" v-if="item.month_list.length>0" v-for="(row,monIndex) in item.month_list"  @tap="changeMonth(yearIndex,monIndex)" :class="(item.active&&row.active)?'active':''" >
						<view>{{row.name_en}}</view>
						<view>{{row.name_cn}}</view>
					</view>
				</view>
				<view class="tab"></view>
				<view class="tab"></view>
			</view>	
		</scroll-view>
		<view class="year">{{current_year}}</view>
		<view class="cont">
			<view class="cont-item">
				<view>日均成交额</view>
				<view>22.26</view>
			</view>
			<view class="cont-item">
				<view>当月成交额</view>
				<view>0.00</view>
			</view>
			<view class="cont-item">
				<view>对比上月</view>
				<view>-</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				year_list:[],
				current_year:"",
				month_scroll_x:10000000000,
			}
		},
		onLoad() {
			uni.showLoading({
				title:"正在加载"
			})
			this.$request({
				url:this.$api.mch.user.tongji_year_list
			}).then((res) => {
				uni.hideLoading()
				console.log(res)
				if(res.code == 0){
					this.year_list = res.data.year_list;
					this.current_year = res.data.current_year;
					// this.setMonthScroll();
				}
				if(res.code == 1){
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				}
				
			})
			
		},
		onShow() {
			// this.setMonthScroll();
		},
		
		methods: {
			//月份改变
			changeMonth(yearIndex,monIndex) {
				let y_index = yearIndex;
				let m_index = monIndex;
				for (let i in this.year_list) {
					if (i == y_index) {
						this.year_list[i].active = true;
						this.current_year = this.year_list[i].year;
					} else {
						this.year_list[i].active = false;
					}
					for (let j in this.year_list[i].month_list) {
						if (i == y_index && j == m_index) {
							this.year_list[i].month_list[j].active = true;
							this.current_month = this.year_list[i].month_list[j].month;
						} else {
							this.year_list[i].month_list[j].active = false;
						}
					}
				}
				
				this.setMonthScroll();
				// this.getMonthData();
			},
			setMonthScroll(){
				let itemWidth = 0;
				let left_count = 0;
				let info = uni.createSelectorQuery().select('.tab-box'); //获取这个节点的信息
				info.boundingClientRect((data) => { //获取这个节点的信息
					if (data) {
						itemWidth = data.width/5; //获取元素距离顶部的距离.
					}
				}).exec();
				for (let i=0;i<this.year_list.length;i++) {
					let is_active = false;
					for (let j=0;j<this.year_list[i].month_list.length;j++) {
						if (this.year_list[i].month_list[j].active) {
							is_active = true;
							break;
						} else {
							left_count++;
							
						}
					}
					if (is_active){
						break;
					}
				}
				this.month_scroll_x = left_count * itemWidth;
				console.log(this.month_scroll_x);
			}
		}
	}
</script>

<style scoped>
	.body{
		background-color: #FFFFFF;
	}
	.tab-box{
		display: flex;
		flex-wrap: nowrap;
	}
	.tab{
		width: 20vw;
		flex-shrink: 0;
		border-top: 1px solid #F0F0F0;
		border-bottom: 1px solid #F0F0F0;
		padding: 20rpx 0;
	}
	.month{
		display: flex;
		flex-wrap: nowrap;
	}
	.box{
		width: 20vw;
		text-align: center;
		padding: 20rpx 0;
		border-top: 1px solid #F0F0F0;
		border-bottom: 1px solid #F0F0F0;
	}
	.active{
		color: #E9AD33;
	}
	.year{
		position: relative;
		top: -22rpx;
		background-color: #FFFFFF;
		display: inline-block;
		width: 100rpx;
		text-align: center;
		left: calc(50% - 50rpx);
		font-size: 28rpx;
		color: #888888;
	}
	.cont{
		display: flex;
		padding: 0rpx 30rpx 20rpx 30rpx;
	}
	.cont-item{
		flex: 1;
	}
	.cont-item:nth-of-type(1){
		text-align: left;
	}
	.cont-item:nth-of-type(2){
		text-align: center;
	}
	.cont-item:nth-of-type(3){
		text-align: right;
	}
</style>
