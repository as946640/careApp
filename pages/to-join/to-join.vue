<template>
	<view class="page">
		<!-- 头部 -->
		<view class="header">
			<!-- 头部站位 -->
			<view class="headers"></view>
			<view class="search">
				<tui-navigation-bar :isFixed="false" splitLine backgroundColor="255,255,255" color="#fff">
					<view class="flex">
						<view class="tui-avatar-box" @tap="back">
							<view class="" style="padding-top: 20rpx;">
								<tui-icon name="arrowleft" :size="30" color="#fff"></tui-icon>
							</view>
						</view>
						<view class="tui-search-box">
							加盟代理申请
						</view>

					</view>
				</tui-navigation-bar>
			</view>
		</view>
		<!-- from提交-->
		<form @submit="formSubmit">
			<!-- 基础信息 -->
			<view class="from">
				<text style="color: #000000;">基础信息</text>
				<view class="content">
					<tui-list-cell :hover="false">
						<view class="tui-line-cell">
							<view class="tui-title">姓名：</view>
							<input placeholder-class="tui-phcolor" class="tui-input" name="name" placeholder="请输入姓名" maxlength="50" type="text" />
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false">
						<view class="tui-line-cell">
							<view class="tui-title">手机号：</view>
							<input placeholder-class="tui-phcolor" class="tui-input" name="mobile" placeholder="请输入手机号" maxlength="50" type="text" />
						</view>
					</tui-list-cell>
						<tui-list-cell :hover="false">
							<view class="tui-line-cell">
								<view class="tui-title">工作时间：</view>
									<view class="morning">
										<picker mode="time" :value="workTime.morning" data-type="0" start="00:01" end="24:59" @change="workdayTime">
										    <view class="uni-input" v-if="workTime.morning">{{workTime.morning}}</view>
											<view class="uni-input" v-else>请选择</view>
										 </picker>
									</view>
									<text  style="padding: 0 30rpx;">--</text>
									<view class="evening">
										<picker mode="time" :value="workTime.evening" data-type="1" start="00:01" end="24:59" @change="workdayTime">
										    <view class="uni-input" v-if="workTime.evening">{{workTime.evening}}</view>
											<view class="uni-input" v-else>请选择</view>
										 </picker>
									</view>
								<!-- <input placeholder-class="tui-phcolor" class="tui-input" name="mobile" placeholder="请选择工作时间" maxlength="50" type="text" /> -->
							</view>
						</tui-list-cell>
					<tui-list-cell :hover="false" arrow>
						<view class="tui-line-cell">
							<view class="tui-title">所属区域：</view>
							<view class="flex flex-y-center">
								<picker :value="value" mode="multiSelector" @change="picker" @columnchange="columnPicker" :range="multiArray">
									<view class="qu">
										<view class="result" v-if="text" >
											{{text}}
										</view>
										<view class="" v-else>
											请选择
										</view>
									</view>
								</picker>
							</view>
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false" arrow>
						<view class="tui-line-cell">
							<view class="tui-title">详细地址：</view>
							<view class="">
								<view class="qu">
									<picker @change="bindPickerChange" :value="index" :range="array">
										<view class="uni-input" v-if="index === null">请选择</view>
										<view class="uni-input" v-else>{{array[index]}}</view>
									</picker>
								</view>
							</view>
						</view>
					</tui-list-cell>
					<view class="mendian">
						<view class="">
							门店图片：
						</view>
						<view class="uploadimg" data-type='shopimg' @click="uploadImg">
							<image class="cover" :src="shopimg" mode=""></image>
						</view>
					</view>
					<view class="mendian">
						<view class="">
							门店简介：
						</view>
						<view class="jianj">
							<textarea value="" v-model="shoptext" placeholder="填写100子以内的店铺简介(必填)" />
							</view>
					</view>
				</view>
					
			</view>
			<!--  资质证件-->
			<view class="zizhi">
				<text style="color: #000000;">资质证件</text>
				<view class="content">
					法人身份证正面：
					<view class="uploadimg" data-type='card01' @click="uploadImg" style="background-image: url('/static/img/tojon/sfz1.png');">
						<image class="cover" :src="card01" mode=""></image>
					</view>
					法人身份证反面：
					<view class="uploadimg" data-type='card02' @click="uploadImg" style="background-image: url('/static/img/tojon/sfz2.png');">
						<image class="cover" :src="card02" mode=""></image>
					</view>
					其他说明：
					<view class="text">
						<textarea value="" v-model="cardtext" placeholder="请填写你的说明备注:" />
					</view>
					<!-- 同意协议 -->
					<view class="xieyi">
						<view class="checkbox">
							<checkbox-group @change="checkbox">
							    <label style="border-radius: 50%;">
									<checkbox  style="border-radius: 20rpx;transform:scale(0.7);" value="cb" :checked="checked" />
							    </label>
							 </checkbox-group>
						</view>
						<view>阅读并同意</view>
						<view style="color: #134AFF;" @click="shopProtocol">《门店协议》</view>
					</view>
					
					<view class="btn" >
						<button class="button"  hover-class="tui-button-hover" formType="submit" type="button ">确认提交</button>
					</view>
				</view>
			</view>
		</form>
		<view class="">
		</view>
	</view>
</template>

<script>
	const cityData = require('@/data/picker.city.js');
	const form = require("@/common/tui-validation/tui-validation.js")
	
	import uploadImg from '@/components/uploadimg/uploadimg.vue'
	import imgUpload from '@/components/imgUpload/imgUpload.vue';
	export default {
		components:{
			uploadImg,
			imgUpload
		},
		data() {
			return {
				selectList: cityData, //接口返回picker数据,此处就直接使用本地测试数据
				multiArray: [], //picker数据
				array: ['机场路', '白云街', '新丰街', '新市墟'],
				value: [0, 0, 0],
				text: "", //选中的区域信息
				id: "",
				index: null,
				villages: '', // 详细街道
				checked: false, //协议勾选
				workTime: { // 工作时间
						morning: '', //早上
						evening: '' // 晚上
				},
				imgPath: '', // 临时图片路径
				serverUrl: '', //上传图片地址
				imgArray: [],
				shopimg:'', // 门店图片
				shoptext:'', // 门店简介
				card01:'', // 身份证正面
				card02:'', // 身份证反面
				cardtext:'', // 身份证备注
			}
		},
		onLoad: function() {
			this.serverUrl = this.$api.default.upload_image;
			this.multiArray = [
				this.toArr(this.selectList),
				this.toArr(this.selectList[0].children),
				this.toArr(this.selectList[0].children[0].children)
			]
		},
		methods: {
			// 上传图片
			uploadImg(e) {
				var self = this;
				// 自定义类型
				var type = e.currentTarget.dataset.type
				
				uni.chooseImage({
				    count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择,拍照
				    success:(res) => {
						// 上传的图片地址
						console.log(res);
						uni.uploadFile({
							url: this.$api.default.upload_image,
							filePath:res.tempFilePaths[0],
							name: 'image',
						    success: (res) => {
						        console.log(JSON.parse(res.data));
								let data = JSON.parse(res.data);
								if(data.code == 0) {
									if(type == "shopimg") {
										self.shopimg = data.data.url
									}
									if(type == "card01") {
										self.card01 = data.data.url
									}
									if(type == "card02") {
										self.card02 = data.data.url
									}
									uni.hideLoading()
								}
						    },
							fail: (err) => {
								console.log(err);
							}
						});
				    }
				});
			
			},
			
			bindPickerChange: function(e) {
				this.index = e.target.value
			},
			picker: function(e) {
				console.log(e);
				let value = e.detail.value;
				if (this.selectList.length > 0) {
					let provice = this.selectList[value[0]].text
					let city = this.selectList[value[0]].children[value[1]].text
					let district = this.selectList[value[0]].children[value[1]].children[value[2]].text
					this.text = provice + " " + city + " " + district;
					this.id = this.selectList[value[0]].children[value[1]].children[value[2]].value
				}
			},
			toArr(object) {
				let arr = [];
				for (let i in object) {
					arr.push(object[i].text);
				}
				return arr;
			},
			columnPicker: function(e) {
				console.log(e);
				//第几列 下标从0开始
				let column = e.detail.column;
				//第几行 下标从0开始
				let value = e.detail.value;
				if (column === 0) {
					this.multiArray = [
						this.multiArray[0],
						this.toArr(this.selectList[value].children),
						this.toArr(this.selectList[value].children[0].children)
					];
					this.value = [value, 0, 0]
				} else if (column === 1) {
					this.multiArray = [
						this.multiArray[0],
						this.multiArray[1],
						this.toArr(this.selectList[this.value[0]].children[value].children)
					];
					this.value = [this.value[0], value, 0]
				}
			},
			formSubmit(e) {
				console.log(e);
				if(this.checked == false) {
					uni.showToast({
						title: "请勾选门店协议",
						icon: "none"
					});
					return
				}
				
				let rules = [
					{
						name: "name",
						rule: ["required", "isChinese", "minLength:2", "maxLength:6"], //可使用区间，此处主要测试功能
						msg: ["请输入姓名", "姓名必须全部为中文", "姓名必须2个或以上字符", "姓名不能超过6个字符"]
					},
					{
						name: "mobile",
						rule: ["required", "isMobile"],
						msg: ["请输入手机号", "请输入正确的手机号"]
					},
				]
				//进行表单检查
				let formData = e.detail.value;
				let checkRes = form.validation(formData, rules);
				formData.text = this.text;
				formData.villages = this.array[this.index];
				formData.workTime = this.workTime; //工作时间 对象包换早上晚上
				formData.shopimg = this.shopimg;
				formData.card01 = this.card01;
				formData.card02 = this.card02;
				formData.shoptext = this.shoptext;
				formData.cardtext = this.cardtext;
				console.log(formData);
					if(formData.name=="" || formData.mobile=="") {
						uni.showToast({
							title:checkRes,
							icon: "none"
						})
						return
					}
					if(this.text == '') {
						uni.showToast({
							title: "请选择区域!",
							icon: "none"
						});
						return
					}
					if(this.index === null) {
						uni.showToast({
							title: "请选择乡镇!",
							icon: "none"
						});
						return
					}
					if(this.card01==""&&this.card02==""&&this.shopimg=="") {
						console.log('100000000000');
						uni.showToast({
							title: "请上传门店图片和身份证信息",
							icon: "none"
						});
						return
					}
			},
			back() {
				uni.navigateBack()
			},
			bindTimeChange: function(e) {
				this.time = e.target.value
			},
			workdayTime(e) {
				let type = e.currentTarget.dataset.type;
				if(type == 0) {
					this.workTime.morning  = e.detail.value
				}else {
					this.workTime.evening  = e.detail.value
				}
			},
			checkbox(e) {
				this.checked = !this.checked
			},
			shopProtocol() {
				uni.navigateTo({
					url:'/pages/shop-protocol/shop-protocol'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page {
		background-color: #eee;
		height: 100%;
		padding-bottom: 20rpx;
	}

	.header {
		padding: 10rpx;
		box-sizing: border-box;
		background-size: 100%;
		background-repeat: no-repeat;
		background-image: url('/static/img/home/header.png');
		display: flex;
		align-items: center;
		justify-content: center;

		.headers {
			height: var(--status-bar-height);
		}

		.search {
			width: 100%;
			height: 100%;
			padding-left: 10rpx;
			padding-right: 20rpx;
			box-sizing: border-box;

			.tui-avatar-box {
				width: 60rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				left: 5;

			}

			.tui-search-box {
				flex: 1;
				height: 80rpx;
				border-radius: 30rpx;
				font-size: 13pt;
				padding: 0 22rpx;
				box-sizing: border-box;
				color: #fff;
				display: flex;
				justify-content: center;
				text-align: center;
				align-items: center;

			}
		}

	}

	.from {
		width: 94%;
		margin: 20rpx auto;
		border-radius: 30rpx;
		box-sizing: border-box;
		font-size: 10pt;
		color: #7B7B7B;
		
		.content {
			background-color: #fff;
			border-radius: 30rpx;
			padding: 10rpx 20rpx;
			margin-top: 20rpx;
				.gongzTime {
					width: 100%;
					height: 200rpx;
					font-size: 10pt;
						text {
							padding-left: 30rpx;
						}
				}
		}
		.qu {
			width: 50vw;
		}
		.mendian {
			width: 100%;
			padding: 20rpx;
			
			.uploadimg {
				width: 80%;
				margin: 20rpx auto;
				height: 360rpx;
				border-radius: 20rpx;
				background-size: 100%;
				border: 2px dashed #ccc;
				padding: 0;
				box-sizing: border-box;
				background-image: url("/static/img/tojon/unploadimg.png");
					image {
						width: 100%;
						height: 100%;
					}
			}
			.jianj {
				width: 94%;
				height: 200rpx;
				margin: 20rpx auto;
				border-radius: 10rpx;
				background-color: #f7f7f7;
					textarea {
						box-sizing: border-box;
						font-size: 10pt;
						padding: 20rpx;
						width: 100%;
						height: 100%;
					}
			}
		}
		.btn {
			height: 100rpx;
			padding: 40rpx 0;
			.button {
				width: 80%;
				height: 80rpx;
				line-height: 80rpx;
				background-color: #0293EB;
				border-radius: 50rpx;
				color: #fff;
			}
		}
		
		.tui-line-cell {
			width: 100%;
			box-sizing: border-box;
			display: flex;
			align-items: center;
		}

		.tui-title {
			line-height: 32rpx;
			min-width: 120rpx;
			flex-shrink: 0;
			border-radius: 20rpx;
		}

		.tui-input {
			font-size: 32rpx;
			color: #333;
			padding-left: 20rpx;
			flex: 1;
			overflow: visible;
		}

		.radio-group {
			margin-left: auto;
			transform: scale(0.8);
			transform-origin: 100% center;
			flex-shrink: 0;
		}

		.tui-radio {
			display: inline-block;
			padding-left: 28rpx;
			font-size: 36rpx;
			vertical-align: middle;
		}


		.tui-btn-box {
			padding: 40rpx 50rpx;
			box-sizing: border-box;
		}

		.tui-button-gray {
			margin-top: 30rpx;
		}

		.tui-tips {
			padding: 30rpx;
			color: #999;
			font-size: 24rpx;
		}
	}
	.zizhi {
		width: 94%;
		margin: 20rpx auto;
		border-radius: 30rpx;
		box-sizing: border-box;
		font-size: 10pt;
		color: #7B7B7B;
			.content {
				padding: 20rpx 50rpx;
				background-color: #fff;
				font-size: 11pt;
				color: #000;
				border-radius: 20rpx;
					.uploadimg {
						width: 100%;
						margin: 20rpx auto;
						height:300rpx;
						border-radius: 20rpx;
						background-size: 100%;
						position: relative;
						border: 2px dashed #ccc;
							image {
								width: 100%;
								height: 100%;
							}
					}
					.text {
						width: 100%;
						height: 200rpx;
						border-radius: 10rpx;
						padding: 20rpx;
						background-color: #f7f7f7;
						box-sizing: border-box;
							textarea {
								box-sizing: border-box;
								font-size: 10pt;
								padding: 20rpx;
								width: 100%;
								height: 100%;
							}
					}
					.xieyi {
						display: flex;
						margin: 40rpx 0;
							.checkbox {
								checkbox {
									border-radius: 50%;
								}
							}
					}
					.btn {
						button {
							border-radius: 50rpx;
							background-color: #134AFF;
							color: #fff;
						}
					}
			}
	}
</style>
