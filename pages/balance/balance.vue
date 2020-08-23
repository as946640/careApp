<template>
	<view class="body">
		<view class="top" :style="'background-image: url('+setting.pic_url+');'">
			<view class="title">账户余额(元)</view>
			<view class="money">{{money}}</view>
			<view class="recharge"><navigator url="/pages/user/deposit/deposit">充值</navigator></view>
			<view class="icon-image" @tap="explainShow"><image :src="setting.p_pic_url" /></view>
		</view>
		<view class="activity">
			<navigator>
				<image :src="setting.ad_pic_url" />
			</navigator>
		</view>
		<view class="detailed-box">
			<view class="detailed-title">
				<view class="icon xiangqian" @tap="dateDown"></view>
				<!-- <view class="time">{{date}}</view> -->
				<picker class="time" fields="month" mode="date" @change="dateChange">
					<view>{{date}}</view>
				</picker>
				<view class="icon xiangyou" @tap="dateUp"></view>
			</view>
			<view class="detailed-cont">
				<view class="detailed-item" v-for="(item,index) in list" @tap="goToDetail(index)">
					<view class="detailed-item-info">
						<view>{{item.content}}</view>
						<view>{{item.date}}</view>
					</view>
					<view class="detailed-item-money" :style="item.flag==1?'color:#3FC24C':'color:#FF4544'">{{item.price}}</view>
				</view>
			</view>
		</view>
		
		<!-- 充值规则 -->
		<view class="explain-model" v-if="explain_show">
			<view class="explain-box">
				<view class="explain-title">充值说明</view>
				<view class="explain-cont">{{setting.help}}</view>
				<view class="explain-btn" @tap="explainNone">我知道了</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:0,//用户余额
				list:[],//明细列表
				setting:{},//自定义的图片列表
				date_1:"",//没有转换的时间
				date:"",
				is_more:false,
				explain_show:false
			}
		},
		onLoad() {
			
			// 加载各项信息
			uni.showLoading({
				title: '加载中',
			});
			this.$request({
				url: this.$api.recharge.index,
			}).then((res) => {
				console.log(res);
				this.money = res.data.money,
				this.list = res.data.list,
				this.setting = res.data.setting,
				this.date_1 = res.data.date,
				this.date = res.data.date.replace('-', '年') + '月'
				uni.hideLoading();
			});
		},
		methods: {
			// 充值说明
			explainShow(){
				this.explain_show = true
			},
			explainNone(){
				this.explain_show = false
			},
			//获取对应时间的明细信息
			getData() {
				var self = this;
				uni.showLoading({
					title: '加载中',
				});
				this.$request({
					url: this.$api.recharge.record,
					data: {
						date: this.date_1 || ''
					}
				}).then( (res)=> {
					uni.hideLoading();
					if(res.code == 0){
						this.list = res.data.list,
						this.is_more = false;
					}
					if(res.code == 1){
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				});
			},
			// 减少月份
			dateDown() {
				if (this.is_more) {
					return;
				}
				this.is_more = true;
				var date_1 = this.date_1;
				var date = this.date;
				var d = new Date(date_1);
				d.setMonth(d.getMonth() - 1);
				var m = d.getMonth() + 1;
				m = m.toString();
				m = m[1] ? m : '0' + m;
				this.date = d.getFullYear() + '年' + m + '月';//转换后的时间
				this.date_1 = d.getFullYear() + '-' + m;//标准时间格式
				this.getData();
			},
			//增加月份
			dateUp() {
				if (this.is_more) {
					return;
				}
				this.is_more = true;
				var date_1 = this.date_1;
				var date = this.date;
				var d = new Date(date_1);
				d.setMonth(d.getMonth() + 1);
				var m = d.getMonth() + 1;
				m = m.toString();
				m = m[1] ? m : '0' + m;
				this.date = d.getFullYear() + '年' + m + '月';
				this.date_1 = d.getFullYear() + '-' + m;
				this.getData();
			},
			//picker 选择器发生改变时
			dateChange(e) {
				if (this.is_more) {
					return;
				}
				this.is_more = true;
				var date_1 = e.detail.value;
				var date = date_1.replace('-', '年') + '月';
				this.date = date;
				this.date_1 = date_1;
				this.getData();
			},
			goToDetail(index) {
				var list = this.list;
				var order = list[index];
				console.log(order);
				uni.navigateTo({
					url: '/pages/balance/detail/detail?order_type=' + order.order_type + '&id=' + order.id,
				})
			}
		}
	}
</script>

<style scoped>
	.body{
		background-color: #EFEFF4;
	}
	.top{
		width: 100%;
		height: 330upx;
		text-align: center;
		box-sizing: border-box;
		padding-top: 60upx;
		background: url(http://gc.sinbel.cn/web/statics/images/recharge/icon-balance-bg.png) no-repeat center top;
		background-size: 100% 100%;
		color: #FFFFFF;
	}
	.icon-image{
		width: 40upx;
		height: 40upx;
		position: absolute;
		border-radius: 50%;
		overflow: hidden;
		top: 30upx;
		right: 30upx;
	}
	.icon-image>image{
		width: 100%;
		height: 100%;
	}
	.title{
		font-size: 34upx;
	}
	.money{
		font-size: 68upx;
		padding: 10upx 0;
	}
	.recharge{
		border: 1px solid #FFFFFF;
		height: 50upx;
		width: 130upx;
		line-height: 48upx;
		margin:0 auto;
		margin-top: 10upx;
		font-size: 32upx;
		border-radius: 80upx;
	}
	.activity{
		width: 100%;
		height: 170upx;
		margin: 20upx 0;
	}
	.activity>navigator{
		width: 100%;
		height: 100%;
	}
	.activity>navigator>image{
		width: 100%;
		height: 100%;
	}
	
	.detailed-box{
		width: 100%;
		padding-bottom: 30upx;
		background-color: #FFFFFF;
	}
	.detailed-title{
		display: flex;
		align-items: center;
		height: 80upx;
	}
	.time{
		font-size: 40upx;
	}
	.time>view{
		width: 100%;
		text-align: center;
	}
	.detailed-title>view{
		flex: 1;
		text-align: center;
	}
	.detailed-title>.time{
		flex: 2;
		text-align: center;
	}
	.detailed-title>.icon{
		font-size: 30upx;
	}
	.detailed-title>.icon:nth-of-type(1){
		text-align: right;
	}
	.detailed-title>.icon:nth-of-type(2){
		text-align: left;
	}
	.detailed-item{
		box-sizing: border-box;
		padding: 30upx;
		display: flex;
		align-items: center;
		border-top: 1px solid #EDEDED;
	}
	.detailed-item-info{
		width: 460upx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.detailed-item-info>view:nth-of-type(1){
		width: 460upx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.detailed-item-info>view{
		padding: 6upx 0;
		font-size: 32upx;
	}
	.detailed-item-info>view:nth-of-type(2){
		font-size: 30upx;
		color: #999999;
	}
	.detailed-item-money{
		flex: 1;
		text-align: right;
	}
	.explain-model{
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background-color:rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.explain-box{
		width: 80vw;
		min-height: 260upx;
		box-sizing: border-box;
		padding: 40upx 20upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
	}
	.explain-title{
		text-align: center;
		font-size: 42upx;
	}
	.explain-cont{
		min-height: 50upx;
		margin: 30upx 0;
		font-size: 32upx;
	}
	.explain-btn{
		text-align: center;
		width: 85%;
		height: 70upx;
		line-height: 70upx;
		color: #FFFFFF;
		background-color: #FF4544;
		border-radius: 20upx;
		margin:0 auto;
		font-size: 36upx;
	}
</style>
