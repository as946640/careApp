<template>
	<view>
		<view class="content">
			<view class="row">
				<view class="nominal">
					收件人
				</view>
				<view class="input">
					<input placeholder="请输入收件人姓名" type="text" v-model="addressInfo.name" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					电话号码
				</view>
				<view class="input">
					<input placeholder="请输入收件人电话号码" type="text" v-model="addressInfo.mobile" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">
					所在地区
				</view>
				<view class="input" @tap="chooseCity">
					{{region}}
				</view>

			</view>
			<view class="row">
				<view class="nominal">
					详细地址
				</view>
				<view class="input">
					<textarea v-model="addressInfo.detail" auto-height="true" placeholder="输入详细地址"></textarea>
				</view>
			</view>
			<view class="row" v-if="editType=='edit'">
				<view class="nominal">
					设置默认地址
				</view>
				<view class="input switch">
					<switch color="#134AFF" :checked="addressInfo.is_default==1" @change=isDefaultChange />
				</view>
			</view>
			<view class="row" v-if="editType=='edit'" @tap="del">
				<view class="del">
					删除收货地址
				</view>
			</view>
		</view>
		<view class="save" @tap="save">
			<view class="btn">
				保存地址
			</view>
		</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker"  @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				editType: 'edit',
				addressInfo:{},
				themeColor: '#134AFF',
				region: ""
			};
		},
		methods: {
			// onCancel(e) {
			// 	// picker点击取消
			// 	console.log(e)
			// },
			chooseCity() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				// picker点击确定
				// console.log(e);
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
			isDefaultChange(e) {
				let is_default = 0;
				if(e.detail.value){
					is_default = 1
				}else{
					is_default = 0
				}
				this.addressInfo.is_default = is_default;
			},
			del() {
				uni.showModal({
					title: '删除提示',
					content: '你将删除这个收货地址',
					success: (res) => {
						if (res.confirm) {
							this.$request({
								url: this.$api.user.address_delete,
								data:{
									address_id:this.addressInfo.id
								}
							}).then(res => {
								console.log(res);
								uni.navigateTo({
									url:"/pages/user/address/address"
								})
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			save() {
				if (!this.addressInfo.name) {
					uni.showToast({
						title: '请输入收件人姓名',
						icon: 'none'
					});
					return;
				}
				if (!this.addressInfo.mobile) {
					uni.showToast({
						title: '请输入收件人电话号码',
						icon: 'none'
					});
					return;
				}
				if (!this.addressInfo.detail) {
					uni.showToast({
						title: '请输入收件人详细地址',
						icon: 'none'
					});
					return;
				}
				if (!this.addressInfo.province_id || !this.addressInfo.city_id || !this.addressInfo.district_id) {
					uni.showToast({
						title: '请选择所在地区',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '正在提交'
				})
				//实际应用中请提交ajax,模板定时器模拟提交效果
				this.$request({
					url: this.$api.user.address_save,
					method: "post",
					data:{
						address_id:this.addressInfo.id || "",
						name: this.addressInfo.name,
						mobile: this.addressInfo.mobile,
						province_id:this.addressInfo.province_id,
						city_id: this.addressInfo.city_id,
						district_id: this.addressInfo.district_id,
						detail: this.addressInfo.detail
					}
				}).then(res => {
					uni.hideLoading();
					if(res.code == 0){
						uni.navigateTo({
							url:"/pages/user/address/address"
						})
					}
					if(res.code == 1){}{
						uni.showModal({
							title:"提示",
							content:res.msg,
							showCancel:false
						})
					}
				});
			}
		},
		onLoad(e) {
			//获取传递过来的参数
			this.editType = e.type;
			if (e.type == 'edit') {//如果是修改地址页面则读取本地缓存中的地址信息
				uni.getStorage({
					key: 'address',
					success: (e) => {
						console.log(e);
						this.addressInfo = e.data;//地址信息
						this.region = e.data.province + "-" + e.data.city + "-" + e.data.district;
					}
				})
			}
		},
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		}
	};
</script>
<style lang="scss">
	.save {
		view {
			display: flex;
		}

		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn {
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #134AFF;
			color: #fff;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 10pt;
				justify-content: center;
				align-items: center;
			}

			font-size: 10pt;
		}
	}

	.content {
		display: flex;
		flex-wrap: wrap;
		background-color: #FFFFFF;
		padding-bottom: 40upx;

		view {
			display: flex;
		}

		.row {
			width: 94%;

			margin: 0 3%;
			border-top: solid 1upx #eee;

			.nominal {
				width: 30%;
				height: 120upx;
				font-weight: 200;
				font-size: 10pt;
				align-items: center;
			}

			.input {
				width: 70%;
				padding: 20upx 0;
				align-items: center;
				font-size: 10pt;

				&.switch {
					justify-content: flex-end;
				}

				.textarea {
					margin: 20upx 0;
					min-height: 120upx;
				}
			}

			.del {
				width: 100%;
				height: 100upx;
				justify-content: center;
				align-items: center;
				font-size: 10pt;
				color: #f06c7a;
				background-color: rgba(255, 0, 0, 0.05);
				border-bottom: solid 1upx #eee;
			}
		}
	}
</style>
