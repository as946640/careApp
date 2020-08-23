import {
	request
} from './request.js'
import api from './api.js'
var jweixin = require('jweixin-module');
export default {
	getUrl(){
		let pages = getCurrentPages();
		let curPage = pages[pages.length - 1];
		let url = curPage.$route.fullPath;
		return url;
	},
	//判断是否在微信中  
	isWechat: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			// console.log('是微信客户端')
			return true;
		} else {
			// console.log('不是微信客户端')
			return false;
		}
	},
	//初始化sdk配置  
	initJssdk: function(callback, url) {
		// 这是我这边封装的 request 请求工具，实际就是 uni.request 方法。
		
		// let root_url = encodeURIComponent(window.location.href.split('#')[0]);
		let root_url = window.location.href.split('#')[0];
		request({
			url: api.wechat.jssdk_config,
			data: {
				url: root_url
			}
		}).then((res) => {
			if (res.code == 0) {

				let sdk = res.data.config;
				jweixin.config({
					debug: sdk.debug,
					appId: sdk.appId,
					timestamp: sdk.timestamp,
					nonceStr: sdk.nonceStr,
					signature: sdk.signature,
					jsApiList: sdk.jsApiList
				});
				//配置完成后，再执行分享等功能  

				if (callback) {
					callback(sdk);
				}

			}

		});
	},
	//在需支付
	pay: function(data, url, paramas) {
		url = url ? url : '/pages/user/user';
		if (!this.isWechat()) {
			return;
		}
		//每需要重新初始化
		this.initJssdk(function(sdk) {
			jweixin.ready(function() {
				//分享给朋友接口  
				jweixin.chooseWXPay({
					appId: data.appid,
					timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
					package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
					signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: data.paySign, // 支付签名
					success: function(res) {
						// 支付成功后的回调函数
						//	console.log(res);
						uni.redirectTo({
							url: url
						})
					},
					fail: function(e) {
						uni.showToast({
							title: '支付失败!'
						});
						setTimeout((res) => {
							uni.redirectTo({
								url: url
							})

						})
					}

				});
			});
		}, url);
	},
	share: function(param,diy) {
		
		if (!this.isWechat()) {
			return;
		}
		let title = '聚象商城全新上线',
			desc = '优惠多多',
			link = '',
			imgUrl = 'https://www.dogedoge.com/assets/new_logo.min.png';
		if(diy){
			title = diy.app_share_title || '聚象商城全新上线';
			desc = diy.app_share_desc || '优惠多多';
			imgUrl = diy.app_share_pic || 'https://www.dogedoge.com/assets/new_logo.min.png'
		}
		
		// 获取当前 URL
		let url = window.location.href.split("#")[0];
		
		// 截取 URL ?code 前面 URL
		url = url.split('?code')[0];
		
		// 获取 当前商城id
		let mall_id = uni.getStorageSync("mall_id");
		
		// 获取当前用户
		let user = uni.getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : {};
		
		// 判断 param 是否存在 存在则把参数里面字符截取出来 追加在 url 里
		if(param){
			param = param.split('&mall_id')[0];
			url = `${url}#${param}`;
		}
		// param 存在则 mall_id 前为 & 否则 mall_id 前为 ?
		url = param ? `${url}&mall_id=${mall_id}` : `${url}#/?mall_id=${mall_id}`;
		
		// 如果当前用户数据存在 则获取当前用户的id 追加在 url 末尾 为 pid的值
		if(user.user_id){
			url = url + `&pid=${user.user_id}`
		}
		// console.log(url,"分享url");
		//每需要重新初始化
		this.initJssdk(function(sdk) {
			
			jweixin.ready(() => {
				// 分享到朋友圈
				// jweixin.updateTimelineShareData({
				// 	title: '测试分享', // 分享标题
				// 	link: url,
				// 	imgUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
				// 	success: function() {
				// 		// 用户确认分享后执行的回调函数
				// 	},
				// 	cancel: function() {
				// 		// 用户取消分享后执行的回调函数
				// 	},
				// });
				
				// 分享给朋友
				jweixin.updateAppMessageShareData({
					title: title, // 分享标题
					desc: desc, // 分享描述
					link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: imgUrl, // 分享图标
					success: function(e) {
						// 用户点击了分享后执行的回调函数
					}
				});

			})

		}, '')
	}
}
