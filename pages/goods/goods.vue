<template>
	<view class="container">
		<!--header-->
		<view class="tui-header-box" :style="{ height: height + 'px', background: 'rgba(255,255,255,' + opcity + ')' }">
			<view class="tui-header" :style="{ paddingTop: top + 'px', opacity: opcity }">商品详情</view>
			<view class="tui-header-icon" :style="{ marginTop: top + 'px' }">
				<view class="tui-icon-box" :style="{ backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')' }" @tap="back">
					<tui-icon name="arrowleft" :size="30" :color="opcity >= 1 ? '#000' : '#fff'"></tui-icon>
				</view>

				<view class="tui-icon-box tui-icon-ml" :style="{backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')'}" @tap.stop="openMenu">
					<tui-icon name="more-fill" :size="20" :color="opcity >= 1 ? '#000' : '#fff'"></tui-icon>
					<!-- <tui-badge type="red" :scaleRatio="0.8" absolute top="0" right="-4rpx">5</tui-badge> -->
				</view>

			</view>
		</view>
		<!--header-->

		<!--banner-->
		<view class="tui-banner-swiper">
			<swiper :autoplay="true" :interval="5000" :duration="150" :circular="true" :style="{ height: scrollH + 'px' }"
			 @change="bannerChange">
				<block v-for="(item, index) in banner" :key="index">
					<swiper-item :data-index="index">
						<image :src="item.pic_url" class="tui-slide-image" :style="{ height: scrollH + 'px' }" />
					</swiper-item>
				</block>
			</swiper>
			<view class="tui-banner-tag">
				<tui-tag padding="12rpx 18rpx" type="translucent" shape="circleLeft" :scaleMultiple="0.82" originRight>{{ bannerIndex + 1 }}/{{ banner.length }}</tui-tag>
			</view>
		</view>
		<!--banner-->

		<!--商品标题价格 -->
		<view class="tui-pro-detail">
			<view class="tui-product-title tui-border-radius">
				<view class="tui-pro-pricebox tui-padding">
					
						<view class="tui-pro-price">
							<view class="flex flex-y-bottom">
								<text>￥</text>
								<text class="tui-price">45</text>
								<view style="padding-left: 10rpx;">
									<tui-tag size="20rpx" type="light-brownish">会员价</tui-tag>
								</view>
							</view>
						</view>
					
					<!-- 收藏 -->
					<view class="tui-collection tui-size" @tap="noCollecting" v-if="isCollect == 0">
						<tui-icon :name="isCollect == 1 ? 'like-fill' : 'like'" :color="'#333'" :size="20"></tui-icon>
						<view class="tui-scale-collection">收藏</view>
					</view>


					<view class="tui-collection tui-size" @tap="deleCollecting" v-if="isCollect == 1">
						<tui-icon :name="isCollect == 1 ? 'like-fill' : 'like'" :color="isCollect == 1? '#ff201f' : '#333'" :size="20"></tui-icon>
						<view class="tui-scale-collection tui-icon-red">已收藏</view>
					</view>
				</view>
				<view class="tui-pro-titbox">
					<view class="tui-pro-title">汽车商品测试</view>
					<!-- 分享 -->
					<button open-type="share" class="tui-share-btn tui-share-position" @tap="onShare">
						<tui-tag type="gray" shape="circleLeft" padding="12rpx 16rpx">
							<view class="tui-share-box" @tap="getGoodsQrcode">
								<tui-icon name="partake" color="#999" :size="15"></tui-icon>
								<text class="tui-share-text tui-gray tui-size">分享</text>
							</view>
						</tui-tag>
					</button>
				</view>
				<view class="pro-bottom flex">
					<text>￥50</text>
					<text>销量：100</text>
				</view>
			</view>
			<!-- 领卷模块 -->
			<view class="tui-discount-box tui-radius-all tui-mtop">


				<view class="tui-list-cell tui-last" @tap="showPopup">
					<view class="tui-bold tui-cell-title">促销</view>
					<view>
						<view class="tui-promotion-box">
							<tui-tag originLeft padding="12rpx 24rpx" :scaleMultiple="0.8" shape="circle" type="red" plain>多买优惠</tui-tag>
							<text>满1件，立减最低1件商品价格，包邮（限中国内地）</text>
						</view>
						<view class="tui-promotion-box">
							<tui-tag originLeft padding="12rpx 24rpx" :scaleMultiple="0.8" shape="circle" type="red" plain>满额返券</tui-tag>
							<text>满2件，立减最低2件商品价格，包邮（限中国内地）</text>
						</view>
						<view class="tui-promotion-box">
							<tui-tag originLeft padding="12rpx 24rpx" :scaleMultiple="0.8" shape="circle" type="red" plain>特别赠品</tui-tag>
							<text>满3件，立减最低3件商品价格，包邮（限中国内地）</text>
						</view>
					</view>
					<view class="tui-right">
						<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
					</view>
				</view>
			</view>

			<!-- 商品规格 -->
			<view class="tui-basic-info tui-mtop tui-radius-all">
				<!-- 用户选中的规格显示 -->
				<view class="tui-list-cell" @tap="showPopup">
					<view class="tui-bold tui-cell-title">已选</view>
					<block v-if="attr_group_list.length == 0">
						<view class="">
							请选择商品
						</view>
					</block>
					<view class="tui-selected-box" v-for="(item, index) in attr_list">{{item.attr_name}}{{number}}<text>个</text></view>
					<view class="tui-ml-auto">
						<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
					</view>
				</view>

				<!-- 配送信息 -->
				<view class="tui-list-cell" >
					<view class="tui-bold tui-cell-title">送至</view>
					<view class="tui-addr-box">
						<view class="tui-addr-item">广州市白云其机场路</view>
						<view class="tui-addr-item">今日23:59前完成下单，预计6月28日23:30前发货，7月1日24:00前送达</view>
					</view>
					<view class="tui-right">

					</view>
				</view>


				<!-- 运费信息 -->
				<view class="tui-list-cell tui-last" >
					<view class="tui-bold tui-cell-title">运费</view>
					<view class="tui-selected-box">买满一件包邮</view>
				</view>
				<!-- 商品服务信息 -->
				<view class="tui-guarantee">
					<view class="tui-guarantee-item" v-for="(item, index) in service_list">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">{{item}}</text>
					</view>
				</view>
			</view>
			<block v-if="goodsData.mch">
				<view class="mch flex flex-y-center">
					<view class="mchImg">
						<image :src="goodsData.mch.logo" mode=""></image>
					</view>
					<view class="mchname">
						<view class="name">
							{{goodsData.mch.name}}
						</view>
						<view class="mch-msg flex">
							<text>商品数量:{{goodsData.mch.goods_num}}</text>
							<text>已售:{{goodsData.mch.sale_num}}</text>
						</view>
					</view>
					<button plain="" type="default" @tap="goMch">进店逛逛</button>
				</view>
			</block>

			<!-- 商品评论  -->
			
				<view class="tui-cmt-box tui-mtop tui-radius-all">
					<view class="tui-list-cell tui-last tui-between">
						<view class="tui-bold tui-cell-title">评价</view>
						<view class="tui-flex-center" @tap="common">
							<text class="tui-cmt-all">查看全部</text>
							<tui-icon name="more-fill" :size="20" color="#ff201f"></tui-icon>
						</view>
					</view>

					<view class="tui-cmt-content tui-padding">
						<view class="tui-cmt-user">
							<image src="/static/img/face.jpg" class="tui-acatar"></image>
							<view>阿森</view>
							<view class="addtime" style="margin-left: auto;">
								2020-3.04
							</view>
						</view>
						<view class="tui-cmt">商品评论测试还不错</view>
						<view class="tui-attr" style="display: none;">颜色：叠层钛钢流苏耳环（A74）</view>
					</view>
					<view class="tui-cmt-btn">
						<tui-button width="240rpx" height="64rpx" :size="24" type="black" plain shape="circle" @click="common">查看全部评价</tui-button>
					</view>
				</view>
			
			<!-- 商品详情 -->
			<view class="tui-nomore-box">
				<tui-nomore text="宝贝详情" backgroundColor="#f7f7f7"></tui-nomore>
			</view>
			<view class="tui-product-img tui-radius-all">
				<uParse :content="goodsData.detail"></uParse>
			</view>
			<tui-nomore text="已经到最底了" backgroundColor="#f7f7f7"></tui-nomore>
			<view class="tui-safearea-bottom"></view>
		</view>

		<!--底部操作栏-->
		<view class="tui-operation">
			<view class="tui-operation-left tui-col-5">
				<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150">
					<tui-icon name="kefu" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">客服</view>
				</view>
				<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150">
					<tui-icon name="shop" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">店铺</view>
				</view>
				<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150" @click="goTOurl('/pages/cart/cart')">
					<tui-icon name="cart" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">购物车</view>
				</view>
			</view>
			<view class="tui-operation-right tui-right-flex tui-col-7 tui-btnbox-4">
				<view class="tui-flex-1">
					<tui-button height="68rpx" :size="26" type="danger" shape="circle" @click="showPopup">加入购物车</tui-button>
				</view>
				<view class="tui-flex-1">
					<tui-button height="68rpx" :size="26" type="warning" shape="circle" @click="showPopup">立即购买</tui-button>
				</view>
			</view>
		</view>

		<!--底部操作栏-->

		<!--顶部下拉菜单-->
		<tui-top-dropdown backgroundColor="rgba(76, 76, 76, 0.95)" :show="menuShow" :height="0" @close="closeMenu">
			<view class="tui-menu-box tui-padding tui-ptop">
				<view class="tui-menu-header" :style="{ paddingTop: top + 'px' }">功能直达</view>
				<view class="tui-menu-itembox">
					<block v-for="(item, index) in topMenu" :key="index">
						<view class="tui-menu-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="btnTopMenu(index)">
							<view class="tui-badge-box">
								<tui-icon :name="item.icon" color="#fff" :size="item.size"></tui-icon>
								<tui-badge type="red" :scaleRatio="0.8" absolute right="-8rpx" v-if="item.badge">{{ item.badge }}</tui-badge>
							</view>
							<view class="tui-menu-text">{{ item.text }}</view>
						</view>
					</block>
				</view>
				<view class="tui-icon-up_box">
					<tui-icon name="up" color="#fff" :size="26" @click="closeMenu"></tui-icon>
				</view>
			</view>
		</tui-top-dropdown>
		<!---顶部下拉菜单-->

		<!--底部选择层-->
		<tui-bottom-popup :show="popupShow" @close="hidePopup">
			<view class="tui-popup-box">
				<view class="tui-product-box tui-padding">
					<image src="https://www.thorui.cn/img/product/11.jpg" class="tui-popup-img"></image>
					<view class="tui-popup-price">
						<view class="tui-amount tui-bold">￥49.00</view>
						<view class="tui-number">编号:4373299399393</view>
					</view>
				</view>
				<scroll-view scroll-y class="tui-popup-scroll">
					<view class="tui-scrollview-box">
						<view class="tui-bold tui-attr-title">颜色</view>
						<view class="tui-attr-box">
							<view class="tui-attr-item">五角星钻耳线</view>
							<view class="tui-attr-item">米子珍珠耳线</view>
							<view class="tui-attr-item">花朵镶钻耳线</view>
							<view class="tui-attr-item">扇子珍珠流苏耳线</view>
							<view class="tui-attr-item tui-attr-active">扇子珍珠流苏耳线耳线</view>
						</view>
		
						<view class="tui-number-box tui-bold tui-attr-title">
							<view class="tui-attr-title">数量</view>
							<tui-numberbox :max="99" :min="1" :value="value" @change="change"></tui-numberbox>
						</view>
						<view class="tui-bold tui-attr-title">尺寸</view>
						<view class="tui-attr-box">
							<view class="tui-attr-item">5cm</view>
							<view class="tui-attr-item">8cm</view>
							<view class="tui-attr-item">12cm</view>
							<view class="tui-attr-item">16cm</view>
							<view class="tui-attr-item tui-attr-active">18cm</view>
						</view>
		
						<view class="tui-bold tui-attr-title">保障服务</view>
						<view class="tui-attr-box">
							<view class="tui-attr-item">半年掉钻保 ￥4.0</view>
						</view>
		
						<view class="tui-bold tui-attr-title">只换不修</view>
						<view class="tui-attr-box">
							<view class="tui-attr-item">三月意外换￥2.0</view>
							<view class="tui-attr-item">半年意外换￥2.0</view>
						</view>
					</view>
				</scroll-view>
				<view class="tui-operation tui-operation-right tui-right-flex tui-popup-btn">
					<view class="tui-flex-1">
						<tui-button height="72rpx" :size="28" type="danger" shape="circle" @click="hidePopup">加入购物车</tui-button>
					</view>
					<view class="tui-flex-1">
						<tui-button height="72rpx" :size="28" type="warning" shape="circle" @click="submit">立即购买</tui-button>
					</view>
				</view>
				<view class="tui-right">
					<tui-icon name="close-fill" color="#999" :size="20" @click="hidePopup"></tui-icon>
				</view>
			</view>
		</tui-bottom-popup>
		<!--底部选择层-->
		<!-- 分享 -->
		<!-- 遮罩 -->
		<view class="zhezhao" v-if="is_show">

		</view>
		<view class="shore" v-if="is_show">
			<view class="item">
				<view class="img">
					<image :src="share.pic_url" mode="widthFix"></image>
				</view>
				<block v-if="share.pic_url">
					<view class="bottom" @tap="sveImg">
						<button>保存图片</button>
					</view>
					<view class="del" @tap="del">
						×
					</view>
					保存至相册
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	// 富文本解析器
	import uParse from '@/components/u-parse/u-parse.vue';
	import amap from '@/common/SDK/amap-wx.js';
	export default {
		components: {
			uParse
		},
		data() {
			return {
				goods_id: '',
				imgobg: {
					mode: 'widthFix',
					width: '100%',
					height: '100%'
				},
				city: '北京',
				isCollect: 0, //是否收藏,未收藏
				height: 64, //header高度
				top: 26, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				iconOpcity: 0.5,
				// 商品轮播图
				banner: [
					{
						pic_url: '/static/img/shop/1.jpg'
					},
					{
						pic_url: '/static/img/shop/2.jpg'
					},
					{
						pic_url: '/static/img/shop/3.jpg'
					}
				],
				// 商品信息
				goodsData: [],
				service_list: [], //商家保障服务
				attr_group_list: [], //商品规格
				goodsinfo: {},
				attr: [],// 规格数据
				subIndex: [], //是否选中 
				attrIndex: 0,
				bannerIndex: 0,
				// 顶部下拉框选项
				topMenu: [{
						icon: 'message',
						text: '消息',
						size: 26,
						badge: 0
					},
					{
						icon: 'home',
						text: '首页',
						size: 23,
						badge: 0
					},
					{
						icon: 'people',
						text: '我的',
						size: 26,
						badge: 0
					},
					{
						icon: 'cart',
						text: '购物车',
						size: 23,
						badge: 0
					}
				],
				menuShow: false,
				popupShow: false,
				number: 1,
				collected: false,
				goods_id: '',
				page: 1,
				is_no_more: false,
				is_show: false,
				// 评价数据
				comment_list: [
					{
						
					}
					
					
					
				],
				// 评价好评差评信息
				comment_count: {},
				// 分享数据
				share: {},
				attr_list: [] ,//用户选中的规格
				max_num:99
			};
		},
		onLoad: function(options) {
			// 调用商品数据函数
			// console.log(options);
			var id = options.cid
			this.goods_id = options.cid
			this.getShoop(id)
			// 调用优惠卷函数
			this.getCommentList(id)
			this.getCoupon()

			var that = this;
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif

			setTimeout(() => {
				uni.getSystemInfo({
					success: res => {
						this.width = obj.left || res.windowWidth;
						this.height = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
						this.top = obj.top ? obj.top + (obj.height - 32) / 2 : res.statusBarHeight + 6;
						this.scrollH = res.windowWidth;
					}
				});
			}, 0);
			// 高德地图获取当前位置
			this.amapPlugin = new amap.AMapWX({
				//高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
				key: '7c235a9ac4e25e482614c6b8eac6fd8e'
			});
			//定位地址
			this.amapPlugin.getRegeo({
				success: function(data) {
					//成功回调
					console.log(data);
				},
				fail: function(info) {
					//失败回调
					console.log(info)
				}
			});
			setTimeout(function() {
				that.serviceSplite()
			}, 1000)
		},
		
		methods: {
			// 获取商品数据
			getShoop(id) {
				this.$request({
					url: this.$api.default.goods,
					data: {
						id: id
					}
				}).then(res => {
					console.log(res)
					if(res.code == 0){
						
					}
					if(res.code == 1){
						uni.showToast({
							title:res.msg,
							icon:"none"
						});
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},1000)
					}
				})
			},
			// 获取优惠卷信息
			getCoupon() {
				// this.$request({
				// 	url: this.$api.default.coupon_list
				// }).then(res => {
				// 	// 只渲染前两个优惠卷，余下跳转领取
				// 	let goodsC = res.data.list.slice(0, 2)
				// 	this.goodsCoupon = goodsC
				// })
			},
			// 评论信息
			getCommentList(id) {
				var self = this;
				// if (this.is_no_more) {
				// 	uni.showToast({
				// 		title: '没有更多了'
				// 	})
				// 	return
				// }
				// self.$request({
				// 	url: self.$api.default.comment_list,
				// 	data: {
				// 		goods_id: id,
				// 		page: self.page
				// 	}
				// }).then(res => {
				// 	if (res.code == 0) {
				// 		this.comment_count = res.data.comment_count;
				// 		if (this.page == 1) {
				// 			this.comment_list = res.data.list;
				// 		}
				// 		if (this.page > 1) {
				// 			this.page++
				// 			this.comment_list = this.comment_list.concat(res.data.list)
				// 		}
				// 		if (this.page == res.page_count) {
				// 			this.is_no_more = true;
				// 			return
				// 		}

				// 	}
				// })
			},

			// 路由跳转
			goTOurl(url) {
				console.log(url);
				uni.navigateTo({
					url: url
				});
			},

			// 显示规格选择
			hidePopup: function() {
				this.popupShow = false;
			},
			// 多规格选项存储
			attrClick: function(i, attr, n, index) {
				var self = this;

				let group_list = self.attr_group_list;

				let a = i;
				var obj = {
					'attr_group_id': attr.attr_group_id,
					'attr_group_name': attr.attr_group_name,
					'attr_id': a.attr_id,
					'attr_name': a.attr_name
				}
				self.attr_list[n] = obj;
				let attr_list = self.attr_list
				let spec = self.attr;
				let arr = [];
				
				for (let item of spec) {
					arr.push(item)
				}
				
				if (self.attr_list[n] == obj) {
					self.subIndex[n] = index;
				} else {
					self.attr_list[n] = "";
					self.subIndex[n] = -1; //去掉选中的颜色
				}
				this.$forceUpdate()
				let isAttr = null;

				if (attr_list.length != group_list.length) {
					return;
				}
				let index_1 = 0;
				for (let j = 0; j < arr.length; j++) {
					let item = arr[j];
					let isAttr = this.getAttrInfo(attr_list, item)
					console.log(isAttr);
					if (isAttr) {
						self.attr_group_list.pic = isAttr.pic;
						self.goodsData.num = isAttr.num;
						self.max_num = isAttr.num;
						break;
					}
				}
			},
			
			//获取多规格选中信息
			getAttrInfo(selectAttr, item) {
				let attr_list = item.attr_list
				console.log(attr_list);
				//只有一个默认规格的时候不更新商品信息
				if(attr_list.length==1 && !attr_list.attr_list){
					return;
				}
				let isAttr = null
				let isIndex = 0;
				for (let i = 0; i < selectAttr.length; i++) {

					for (let j = 0; j < attr_list.length; j++) {
						if (attr_list[j].attr_id == selectAttr[i].attr_id) {
							isIndex++;
							if (isIndex == attr_list.length) {
								isAttr = item
								return isAttr;
							}	
						}
					}
				}
			},
			// 添加到购物车
			addCart() {
				var that = this;
				if(this.attr_list.length<this.attr_group_list.length){
					uni.showToast({
						title:'请选择规格',
						icon:'none',
						mask: true,
					})
					return;
				}
				if(that.goodsData.num <= 0 || this.number > that.goodsData.num) {
					uni.showToast({
						title:'库存不足',
						icon:'none',
						mask: true,
					})
					return;
				}
				if(that.goodsData.num  > 0) {
					uni.showLoading({
						title: "正在提交",
						mask: true,
					});
					that.$request({
						url: that.$api.cart.add_cart,
						method: 'post',
						data: {
							goods_id: that.goodsData.id,
							attr: JSON.stringify(that.attr_list),
							num: that.number
						}
					}).then(res => {
						uni.hideLoading();
						that.popupShow = false;
						uni.showToast({
							title: res.msg,
							duration: 1500
						})
					})
				}
				
			},
			// 跳转到确认订单页面
			submit() {
				var that = this;
				if(this.attr_list.length<this.attr_group_list.length){
					uni.showToast({
						title:'请选择规格',
						icon:'none',
						mask: true,
					})
					return;
				}
				if(that.goodsData.num <= 0) {
					uni.showToast({
						title:'库存不足',
						icon:'none',
						mask: true,
					})
					return;
				}
				if(that.goodsData.num > 0) {
					that.popupShow = false;
						var mch_id = 0;
						if (that.goodsData.mch) {
							mch_id = that.goodsData.mch.id
						}
						let mch_list = [{
							"mch_id": mch_id,
							"goods_list": [{
								"goods_id": that.goodsData.id,
								"num": that.number,
								"attr": that.attr_list
							}]
						}]
						uni.redirectTo({
							url: '/pages/order/confirmation?mch_list=' + JSON.stringify(mch_list)
						})
					}
				},
			// 获取用户地址信息
			// 分割商家保障服务字符串
			serviceSplite() {
				let arr = this.service_list[0].split("，");
				this.service_list = arr;
			},

			bannerChange: function(e) {
				this.bannerIndex = e.detail.current;
			},
			back: function() {
				uni.navigateBack();
			},
			openMenu: function() {
				this.menuShow = true;
			},
			closeMenu: function() {
				this.menuShow = false;
			},
			showPopup: function() {
				this.popupShow = true;
			},
			change: function(e) {
				this.number = e.value;
			},
			// 商品收藏
			noCollecting: function() {
				var that = this;
				that.$request({
					url: this.$api.user.favorite_add,
					method: 'POST',
					data: {
						goods_id: that.goodsData.id
					}
				}).then(res => {

					this.isCollect = true
					uni.showToast({
						title: '已收藏'
					})
				})
			},
			// 商品取消
			deleCollecting: function() {
				var that = this;
				that.$request({
					url: this.$api.user.favorite_remove,
					method: 'POST',
					data: {
						goods_id: that.goodsData.id
					}
				}).then(res => {
					this.isCollect = 0;
					uni.showToast({
						title: '已取消收藏'
					})
				})
			},

			// 商品分享
			getGoodsQrcode() {

				this.$request({
					url: this.$api.default.goods_qrcode,
					data: {
						goods_id: this.goodsData.id
					}
				}).then(res => {
					console.log(res);
					this.share = res.data;
				})
			},

			common: function() {
				console.log('101');
				uni.navigateTo({
					url: './ratings/ratings?id=' + this.goods_id
				})
			},
			// 顶部下拉菜单跳转
			btnTopMenu(index) {
				this.closeMenu()
				let url = {
					0: '/pages/msg/msg',
					1: "/pages/mall-index/mall-index",
					2: '/pages/tabBar/user/user',
					3: '/pages/tabBar/cart/cart',
				}
				uni.navigateTo({
					url: url[0]
				})
				uni.switchTab({
					url: url[index]
				})
			},
			// 分享
			onShare() {
				this.is_show = true;
				this.getGoodsQrcode()
			},
			del() {
				this.is_show = false
			},
			// 保存图片
			sveImg() {
				uni.downloadFile({
						url: this.share.pic_url,
						success: (res) =>{
							if (res.statusCode === 200){
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success: function() {
										uni.showToast({
											title: "保存成功",
											icon: "none"
										});
									},
									fail: function() {
										uni.showToast({
											title: "保存失败，请稍后重试",
											icon: "none"
										});
									}
								});
							}
						}
					})
			},
			// 跳转到商家
			goMch() {
				uni.navigateTo({
					url: '/pages/shop/shop?mch_id=' + this.goodsData.mch.id
				})
			}
		},

		onPageScroll(e) {
			let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
			this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity);
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}

	.container {
		padding-bottom: 110rpx;
	}

	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 995;
	}

	.tui-header {
		width: 100%;
		font-size: 18px;
		line-height: 18px;
		font-weight: 500;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-header-icon {
		position: fixed;
		top: 0;
		left: 10px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		height: 32px;
		transform: translateZ(0);
		z-index: 9999;
	}

	.tui-header-icon .tui-badge {
		background: #e41f19 !important;
		position: absolute;
		right: -4px;
	}

	.tui-icon-ml {
		margin-left: 20rpx;
	}

	.tui-icon-box {
		position: relative;
		height: 20px !important;
		width: 20px !important;
		padding: 6px !important;

		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-banner-swiper {
		position: relative;
	}

	.tui-banner-tag {
		position: absolute;
		color: #fff;
		bottom: 30rpx;
		right: 0;
	}

	.tui-slide-image {
		width: 100%;
		display: block;
	}

	/*顶部菜单*/

	.tui-menu-box {
		box-sizing: border-box;
	}

	.tui-menu-header {
		font-size: 34rpx;
		color: #fff;
		height: 32px;
		display: flex;
		align-items: center;
	}

	.tui-menu-itembox {
		color: #fff;
		padding: 40rpx 10rpx 0 10rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		font-size: 26rpx;
	}

	.tui-menu-item {
		width: 22%;
		height: 160rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
		margin-right: 4%;
		margin-bottom: 4%;
	}

	.tui-menu-item:nth-of-type(4n) {
		margin-right: 0;
	}

	.tui-badge-box {
		position: relative;
	}

	.tui-badge-box .tui-badge-class {
		position: absolute;
		top: -8px;
		right: -8px;
	}

	.tui-msg-badge {
		top: -10px;
	}

	.tui-icon-up_box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-menu-text {
		padding-top: 12rpx;
	}

	.tui-opcity .tui-menu-text,
	.tui-opcity .tui-badge-box {
		opacity: 0.5;
		transition: opacity 0.2s ease-in-out;
	}

	/*顶部菜单*/

	/*内容 部分*/

	.tui-padding {
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-ml-auto {
		margin-left: auto;
	}

	/* #ifdef H5 */
	.tui-ptop {
		padding-top: 44px;
	}

	/* #endif */

	.tui-size {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-gray {
		color: #999;
	}

	.tui-icon-red {
		color: #ff201f;
	}

	.tui-border-radius {
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
	}

	.tui-radius-all {
		border-radius: 24rpx;
		overflow: hidden;
	}

	.tui-mtop {
		margin-top: 26rpx;
	}

	.tui-pro-detail {
		box-sizing: border-box;
		color: #333;
	}

	.tui-product-title {
		background: #fff;
		padding: 30rpx 0;
	}

	.tui-pro-pricebox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #ff201f;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 44rpx;
	}

	.tui-pro-price {
		display: flex;
		align-items: center;
	}

	.tui-price {
		font-size: 58rpx;
	}

	.tui-original-price {
		font-size: 26rpx;
		line-height: 26rpx;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-line-through {
		text-decoration: line-through;
	}

	.tui-collection {
		color: #333;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		height: 44rpx;
	}

	.tui-scale-collection {
		transform: scale(0.7);
		transform-origin: center 90%;
		line-height: 24rpx;
		font-weight: normal;
		margin-top: 4rpx;
	}

	.tui-pro-titbox {
		font-size: 32rpx;
		font-weight: 500;
		position: relative;
		padding: 0 150rpx 0 30rpx;
		box-sizing: border-box;
	}

	.tui-pro-title {
		padding-top: 20rpx;
	}

	.tui-share-btn {
		display: block;
		background: transparent;
		margin: 0;
		padding: 0;
		border-radius: 0;
		border: 0;
	}

	.tui-share-btn::after {
		border: 0;
	}

	.tui-share-box {
		display: flex;
		align-items: center;
	}

	.tui-share-position {
		position: absolute;
		right: 0;
		top: 30rpx;
	}

	.tui-share-text {
		padding-left: 8rpx;
	}

	.tui-sub-title {
		padding: 20rpx 0;
		line-height: 32rpx;
	}

	.tui-sale-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 30rpx;
	}

	.tui-discount-box {
		background: #fff;
	}

	.tui-list-cell {
		width: 100%;
		position: relative;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		line-height: 26rpx;
		padding: 36rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-right {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
	}

	.tui-top40 {
		top: 40rpx !important;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-list-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 126rpx;
	}

	.tui-last::after {
		border-bottom: 0 !important;
	}

	.tui-flex-center {
		display: flex;
		align-items: center;
	}


	.tui-cell-title {
		width: 66rpx;
		padding-right: 30rpx;
		flex-shrink: 0;
	}

	.tui-promotion-box {
		display: flex;
		align-items: center;
		padding: 10rpx 0;
		width: 80%;
	}

	.tui-promotion-box text {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-basic-info {
		background: #fff;
	}

	.tui-addr-box {
		width: 76%;
	}

	.tui-addr-item {
		padding: 10rpx;
		line-height: 34rpx;
	}

	.tui-guarantee {
		background: #fdfdfd;
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 30rpx 30rpx 30rpx;
		font-size: 24rpx;
	}

	.tui-guarantee-item {
		color: #999;
		padding-right: 30rpx;
		padding-top: 10rpx;
	}

	.tui-pl {
		padding-left: 4rpx;
	}

	.tui-cmt-box {
		background: #fff;
	}

	.tui-between {
		justify-content: space-between !important;
	}

	.tui-cmt-all {
		color: #ff201f;
		padding-right: 8rpx;
	}

	.tui-cmt-content {
		font-size: 26rpx;
	}

	.tui-cmt-user {
		display: flex;
		align-items: center;
	}

	.tui-acatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		display: block;
		margin-right: 16rpx;
	}

	.tui-cmt {
		padding: 14rpx 0;
	}

	.tui-attr {
		font-size: 24rpx;
		color: #999;
		padding: 6rpx 0;
	}

	.tui-cmt-btn {
		padding: 50rpx 0 30rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-nomore-box {
		padding-top: 10rpx;
	}

	.tui-product-img {
		display: flex;
		flex-direction: column;
		transform: translateZ(0);
	}

	.tui-product-img image {
		width: 100%;
		display: block;
	}

	/*底部操作栏*/

	.tui-col-7 {
		width: 58.33333333%;
	}

	.tui-col-5 {
		width: 41.66666667%;
	}

	.tui-operation {
		width: 100%;
		height: 100rpx;
		background: rgba(255, 255, 255, 0.98);
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		bottom: 0;
		left: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-operation::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-operation-left {
		display: flex;
		align-items: center;
	}

	.tui-operation-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
	}

	.tui-operation-text {
		font-size: 22rpx;
		color: #333;
	}

	.tui-opacity {
		opacity: 0.5;
	}

	.tui-scale-small {
		transform: scale(0.9);
		transform-origin: center center;
	}

	.tui-operation-right {
		height: 100rpx;
		padding-top: 0;
	}

	.tui-right-flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-flex-1 {
		flex: 1;
		padding: 16rpx;
	}

	/*底部操作栏*/

	/*底部选择弹层*/

	.tui-popup-class {
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-popup-box {
		position: relative;
		padding: 30rpx 0 100rpx 0;
	}

	.tui-popup-btn {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	/* .tui-popup-btn .tui-btn-class {
		width: 90% !important;
		display: block !important;
		font-size: 28rpx !important;
	} */

	/* .tui-icon-close {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
	} */

	.tui-product-box {
		display: flex;
		align-items: flex-end;
		font-size: 24rpx;
		padding-bottom: 30rpx;
	}

	.tui-popup-img {
		height: 200rpx;
		width: 200rpx;
		border-radius: 24rpx;
		display: block;
	}

	.tui-popup-price {
		padding-left: 20rpx;
		padding-bottom: 20rpx;
		width: 60%;
		height: 100%;
	}
	.tui-number {
		padding-top: 10%;
	}

	.tui-amount {
		color: #ff201f;
		font-size: 36rpx;
	}

	.tui-number {
		font-size: 24rpx;
		line-height: 24rpx;
		padding-top: 12rpx;
		color: #999;
	}

	.tui-popup-scroll {
		height: 600rpx;
		font-size: 26rpx;
	}

	.tui-scrollview-box {
		padding: 0 30rpx 60rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-attr-title {
		padding: 10rpx 0;
		color: #333;
	}

	.tui-attr-box {
		font-size: 0;
		padding: 20rpx 0;
	}

	.tui-attr-item {
		max-width: 100%;
		min-width: 200rpx;
		height: 64rpx;
		display: -webkit-inline-flex;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #f7f7f7;
		padding: 0 26rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		font-size: 26rpx;
	}

	.tui-attr-active {
		background: #fcedea !important;
		color: #e41f19;
		font-weight: bold;
		position: relative;
	}

	.tui-attr-active::after {
		content: '';
		position: absolute;
		border: 1rpx solid #e41f19;
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		left: 0;
		top: 0;
	}

	.tui-number-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0 30rpx 0;
		box-sizing: border-box;
	}

	.member {

		background-color: #FEEEEE;
	}

	.zhezhao {
		width: 100vh;
		height: 100vh;
		background: rgba(40, 44, 52, 0.5);
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 999;
	}

	.shore {
		width: 70%;
		
		border-radius: 20rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		text-align: center;
		z-index: 999;
		font-size: 10pt;
		color: #888888;

		.img {
			width: 80%;
			margin-bottom: 10rpx;
			margin: 20rpx auto;
			border-radius: 20rpx;
			// box-shadow:  -10rpx -10rpx  30rpx 2rpx #ccc;

			image {
				border-radius: 20rpx;
				width: 100%;
			}
		}

		.bottom {
			width: 80%;
			margin: 10rpx auto;

			button {
				width: 100%;
				height: 100%;
				color: #fff;
				background-color: #FF4544;
			}
		}

		.del {
			width: 60rpx;
			height: 60rpx;
			background-color: #ccc;
			position: absolute;
			top: -20rpx;
			right: -20rpx;
			text-align: center;
			line-height: 60rpx;
			color: #fff;
			font-size: 15pt;
			border-radius: 50%;
		}
	}

	/*底部选择弹层*/

	.pro-bottom {
		padding-left: 30rpx;
		padding-top: 30rpx;

		text {
			margin-right: 30rpx;
			color: #555555;
			font-size: 10pt;
		}

		text:nth-last-child(2) {
			text-decoration: line-through
		}
	}

	.mch {
		width: 100%;
		height: 150rpx;
		padding: 10rpx;
		background-color: #fff;
		box-sizing: border-box;
		margin-top: 30rpx;
		font-size: 10pt;
		border-radius: 20rpx;

		.mchImg {
			width: 15%;
			height: 100rpx;
			margin-left: 3%;

			image {
				width: 100%;
				height: 100%;
				margin: 0 auto;
			}
		}

		.mchname {
			width: 40%;

			.name {
				margin: 10rpx;
			}
		}

		.mch-msg {
			box-sizing: border-box;

			text {
				margin-left: 10rpx;
			}
		}

		button {
			width: 25%;
			font-size: 8pt;
			color: #555;
			border: 1px solid #eee;
			margin-right: 20rpx;
		}
	}
</style>
