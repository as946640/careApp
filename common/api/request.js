//公共js,以及基本方法封装 nvue里使用


const fetch = {
	toast: function(tips) {
		uni.showToast({
			title: tips || "出错啦~",
			icon: 'none',
			duration: 2000
		})
	},
	setToken: function(token) {
		uni.setStorageSync("token", token)
	},
	getToken() {
		return uni.getStorageSync("token")
	},
	isLogin: function() {
		return uni.getStorageSync("token") ? true : false
	},
	logout: function() {
		uni.removeStorageSync("token");
		uni.removeStorageSync('userInfo');
		fetch.toast('登出成功')
		uni.reLaunch({
			url: '/pages/index/index'
		})
	},
	// 获取当前环境
	getPlatform() {
		let platform = 'h5';
		// #ifdef H5
		platform = 'h5';
		// #endif
		// #ifdef MP-WEIXIN
		platform = 'mpwx'
		// #endif
		// #ifdef APP-PLUS
		platform = 'app'
		// #endif
		return platform;
	},
	getUrlParam: function(name, pageObj) {

		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
		// let url = window.location.href.split('#')[0]
		let url = window.location.href;
		let search = url.split('?')[1]
		if (search) {
			var r = search.substr(0).match(reg)
			if (r !== null) {
				return unescape(r[2])
			}
			return null
		} else {
			return null
		}
	},
	request: function(requestData) {
		
		let platform = fetch.getPlatform();
		let url = requestData.url,
			postData = requestData.data,
			method = requestData.method,
			showLoading = requestData.showLoading;
		//接口请求
		method = (method === 'post' || method === 'POST') ? 'POST' : 'GET';
		if (showLoading) {
			uni.showLoading({
				mask: true,
				title: '请稍候...'
			})
		}
		
		if(method=='POST'){


			//postData=JSON.stringify(postData);
		}

		const access_token = '5v4XagxWb8tkrP9Npxb6K_46lEeq4OTQ';
		return new Promise((resolve, reject) => {
			uni.request({
				url: url+"&store_id=1",
				data:postData,
				header: {
					// 'content-type': 'application/json',
					'content-type': 'application/x-www-form-urlencoded',
					// 'x-mall-id': uni.getStorageSync("mall_id") || 4,
					'x-mall-id': uni.getStorageSync("mall_id") || 5,
					// 'x-access-token': 'wQvjP_WY1OjrBWNwBF6DX6DRTCEZMwqI',
					'x-access-token': access_token,
					'x-parent-id': uni.getStorageSync('pid') || -1,
					'x-platform': platform
				},
				method: method,
				dataType: 'json',
				success: (res) => {

					if (res.statusCode === 500) {
						fetch.toast("服务错误~")
						reject(res)
					}
					showLoading && uni.hideLoading()
					if (res.data.code == -1) {
						
						// #ifdef H5
						let pages = getCurrentPages();
						let curPage = pages[pages.length - 1];
						let preUrl = curPage.$route.fullPath;
						uni.setStorageSync("_login_pre_url", preUrl);
						// #endif
						uni.removeStorageSync("token")
						uni.removeStorageSync("initMenus")
						// uni.redirectTo({
						// 	url: '/pages/login/login'
						// })
					} else if (res.data.code == 2) {
						console.log("未绑定手机号");
						uni.navigateTo({
							url: `/pages/login/bind`
						})
					}
					resolve(res.data)
				},
				fail: (res) => {
					fetch.toast("网络不给力，请稍后再试~")
					reject(res)
				}
			})
		})
	},
	// 上传头像
	uploadFile: function(requestData) {

		let {
			serverUrl,
			file,
			fileKeyName
		} = requestData;
		let platform = fetch.getPlatform();
		const access_token = fetch.getToken() || "";

		return new Promise((resolve, reject) => {

			uni.uploadFile({
				url: serverUrl,
				name: fileKeyName,
				header: {
					'x-mall-id': uni.getStorageSync("mall_id") || 5,
					'x-access-token': access_token,
					'x-parent-id': uni.getStorageSync('parentId') || -1,
					'x-app-platform': platform
				},
				formData: {},
				filePath: file,
				success: function(res) {
					if (res.statusCode === 500) {
						fetch.toast("服务错误~")
						reject(res)
					}
					resolve(JSON.parse(res.data))
				},
				fail: function(err) {
					fetch.toast("网络不给力，请稍后再试~")
					reject(err)
				}
			})

		})

	}
}

module.exports = {
	request: fetch.request,
	uploadFile: fetch.uploadFile,
	toast: fetch.toast,
	isLogin: fetch.isLogin,
	setToken: fetch.setToken,
	getUrlParam: fetch.getUrlParam,
	logout: fetch.logout
}
