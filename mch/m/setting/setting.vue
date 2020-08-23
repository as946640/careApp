<template>
	<view class="body">
		<form @submit="formSubmit">
			<view class="info">
				<view class="title">基本信息</view>
				<view class="item">
					<view>联系人</view>
					<view>
						<input type="text" :value="mch.realname" placeholder="必填" name="realname">
					</view>
				</view>
				<view class="item">
					<view>联系电话</view>
					<view>
						<input type="text" :value="mch.tel" placeholder="必填" name="tel">
					</view>
				</view>
				<view class="item">
					<view>微信号</view>
					<view>
						<input type="text" :value="mch.wechat_name" name="wechat_name">
					</view>
				</view>
			</view>
			<view class="info">
				<view class="title">店铺信息</view>
				<view class="item">
					<view>店铺名称</view>
					<view>
						<input type="text" :value="mch.name" placeholder="必填" name="name">
					</view>
				</view>
				<view class="item">
					<view>所在地区</view>
					<view>
						<input type="text" :value="region" disabled="true" @tap="chooseCity" name="province_id">
					</view>
					<view style="display: none">
						<input type="text" name="province_id" :value="addressInfo.province_id" />
						<input type="text" name="city_id" :value="addressInfo.city_id" />
						<input type="text" name="district_id" :value="addressInfo.district_id" />
					</view>
				</view>
				<view class="item">
					<view>详细地址</view>
					<view>
						<input type="text" placeholder="必填" :value="mch.address" name="address">
					</view>
				</view>
				<view class="item">
					<view>所售类目</view>
					<view>
						<picker @change="mchCommonCatChange" :value="index" :range="mch_common_cat_list" range-key="name" style="font-size:34rpx;">
							<view class="uni-input">{{mch_common_cat_list[index].name}}</view>
						</picker>
					</view>
					<view style="display: none;">
						<input type="text" name="mch_common_cat_id" :value="mch_common_cat_list[index].id"/>
					</view>
				</view>
				<view class="item">
					<view>客服电话</view>
					<view>
						<input type="text" placeholder="必填" :value="mch.service_tel" name="service_tel">
					</view>
				</view>
				<view class="item">
					<view>
						<view>店铺头像</view>
						<view>80x80</view>
					</view>
					<view>
						<view class="img1" @tap="openImg('logo')">
							<image :src="mch.logo"></image>
							<input class="img-input" type="text" :value="mch.logo" name="logo"/>
						</view>
					</view>
				</view>
				<view class="item">
					<view>
						<view>店铺背景</view>
						<view>484x130</view>
					</view>
					<view>
						<view class="img2" @tap="openImg('bg')">
							<image :src="mch.header_bg"></image>
							<input class="img-input" type="text" :value="mch.header_bg" name="header_bg"/>
						</view>
					</view>
				</view>
			</view>
			<button form-type="submit">提交</button>
		</form>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		components:{
			mpvueCityPicker
		},
		data() {
			return {
				themeColor: '#F06C7A',
				mch:{},
				edit_district:{},
				addressInfo:{},
				region:"",
				cat_list:[],
				index:0,
				img1:"",
				mch_common_cat_list:[
					{"id":0,"name":""}
				]
			}
		},
		onLoad() {
			this.getShopInfo();
		},
		methods: {
			chooseCity() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				// picker点击确定
				// 显示的省市区名字
				this.region = e.provinceName+"-"+e.cityName+"-"+e.areaName;
				//省市区ID
				this.addressInfo.province_id = e.provinceId;
				this.addressInfo.city_id = e.cityId;
				this.addressInfo.district_id = e.districtId;
				// 省市区名字
				this.addressInfo.province = e.provinceName;
				this.addressInfo.city = e.cityName;
				this.addressInfo.district = e.areaName;
			},
			openImg(flag){
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album','camera'], //从相册选择,拍照
				    success:  (res) => {
						console.log(res)
						uni.showLoading({
							title:"上传中"
						})
						uni.uploadFile({
							url: this.$api.default.upload_image,
							name:'image',
							filePath:res.tempFilePaths[0],
							success:(e) => {
								uni.hideLoading();
								let url = JSON.parse(e.data);
								console.log(url.data.url);
								if(flag === 'bg'){
									this.mch.header_bg = url.data.url;
								}else if(flag === 'logo'){
									this.mch.logo = url.data.url;
								}
							},
							fail:function(e){
								uni.showToast({
									title:e,
									icon:"none"
								})
							}
						})
				    }
				});
			},
			
			//获取店铺信息
			getShopInfo(){
				uni.showLoading({
					title:"加载中"
				})
				this.$request({
					url:this.$api.mch.user.setting
				}).then((res) =>{
					uni.hideLoading();
					let id = res.data.mch.mch_common_cat_id;
					this.mch = res.data.mch;
					for(let i=0;i<res.data.mch_common_cat_list.length;i++){
						if(res.data.mch_common_cat_list[i].id == id){
							this.index = i;
						}
					}
					this.mch_common_cat_list = res.data.mch_common_cat_list;
					this.edit_district = res.data.edit_district;
					//拼接省市区名称
					this.region = res.data.edit_district.province.name+"-"+res.data.edit_district.city.name+"-"+res.data.edit_district.district.name;
					//省市区ID
					this.addressInfo.province_id = res.data.mch.province_id;
					this.addressInfo.city_id = res.data.mch.city_id;
					this.addressInfo.district_id = res.data.mch.district_id;
					console.log(res);
				})
			},
			mchCommonCatChange(e){
				this.index = e.target.value;
			},
			formSubmit(e){
				console.log(e);
				let data = e.detail.value
				uni.showLoading({
					title:"正在提交",
				})
				this.$request({
					url: this.$api.mch.user.setting_submit,
					method: 'post',
					data: e.detail.value,
				}).then((res) => {
					uni.hideLoading()
					if(res.code == 0){
						uni.showToast({
							title:"保存成功"
						})
						setTimeout(function(){
							uni.redirectTo({
								url:"/mch/m/myshop/myshop"
							})
						},500)
					}
					if(res.code == 1){
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
	.info{
		padding-top: 30rpx;
	}
	.title{
		font-size: 36rpx;
		line-height: 60rpx;
		padding: 0 30rpx;
		color: #888888;
	}
	.item{
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-top: 1px solid #EEEEEE;
	}
	.item>view:nth-of-type(1){
		flex: 1;
		font-size: 34rpx;
	}
	.item>view:nth-of-type(1)>view:nth-of-type(2){
		font-size: 30rpx;
	}
	.item>view:nth-of-type(2){
		flex: 3;
	}
	.item>view:nth-of-type(2)>input{
		font-size: 34rpx;
	}
	.img1{
		width: 80rpx;
		height: 80rpx;
		margin-left: auto;
	}
	.img-input{
		display: none;
	}
	.img1>image{
		width: 100%;
		height: 100%;
	}
	.img2{
		width: 420rpx;
		height: 120rpx;
		margin-left: auto;
	}
	.img2>image{
		width: 100%;
		height: 100%;
	}
	button{
		width: 85vw;
		font-size: 34rpx;
		color: #FFFFFF;
		margin: 30rpx auto;
		background-color: #F06C7A;
	}
</style>
