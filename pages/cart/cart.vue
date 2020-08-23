<template>
	<view>
		<view class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<view class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="" @tap="back">
				<tui-icon name="arrowleft" color="#fff"></tui-icon>
			</view>
			<view class="title">购物车</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="tis" v-if="goodsList.length==0 && mch_list.length==0">购物车是空的哦~</view>

			<!-- 平台自营 -->
			<block >
				<view class="goods-box">
					<view class="shop-name">
						<view class="checkbox-box">
							<view class="checkbox" @tap="selectShop('self')" v-if="selfBtnShow">
								<view :class="check_all_self?'on':''"></view>
							</view>
						</view>
						<view class="">平台自营</view>
					</view>
					<view class="row" v-for="(row,index) in goodsList" :key="index">
						<!-- 删除按钮 -->
						<!-- <view class="menu" @tap.stop="deleteGoods(row.cart_id)">
							<view class="icon shanchu"></view>
						</view> -->
						<!-- 商品 -->
						<view class="carrier" @touchstart="touchStart(row.cart_id,$event)"
						 @touchmove="touchMove(row.cart_id,$event)" @touchend="touchEnd(row.cart_id,$event)">
							<!-- checkbox -->
							<view class="checkbox-box">
								<view class="checkbox" v-if="!row.disabled" @tap="selected('self',index,0)">
									<view :class="[row.selected?'on':'']"></view>
								</view>
							</view>
							<!-- 商品信息 -->
							<view class="goods-info" @tap="toGoods(row.goods_id)">
								<view class="img">
									<image :src="row.goods_pic"></image>
								</view>
								<view class="info">
									<view class="title">{{row.goods_name}}</view>
									<view class="spec">
										<view v-for="(item,index) in row.attr_list">
											{{item.attr_group_name}}:{{item.attr_name}}
										</view>
									</view>
									<view class="price-number">
										<view class="price">￥{{row.unitPrice}}</view>
										<view class="number" v-if="row.max_num>0">
											<view class="sub" @tap.stop="sub($event,'self',index)" :id="row.cart_id">
												<view class="icon jian"></view>
											</view>
											<view class="input" @tap.stop="discard">
												<input type="number" v-model="row.num" @input="sum($event,index)" @blur="taol($event,index)" />
											</view>
											<view class="add" @tap.stop="add($event)" :id="row.cart_id">
												<view class="icon jia"></view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			
			<view class="no-more" v-if="isNoMore && (goodsList.length!=0 || mch_list.length!=0)">没有更多</view>
		</view>
		<!-- 脚部菜单 -->
		<view class="footer" :style="{bottom:footerbottom}">
			<view class="checkbox-box" @tap="allSelect">
				<view class="checkbox">
					<view :class="[isAllselected?'on':'']"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<view class="delBtn" @tap="deleteList" v-if="selectedList.length>0">删除</view>
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{sumPrice}}</view>
				</view>
				<view class="btn" @tap="toConfirmation">结算({{selectedList.length}})</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				sumPrice: '0.00',
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				showHeader: true,
				selectedList: [],
				isAllselected: false,
				goodsList: [
					{
						goods_pic: '/static/img/shop/1.jpg',
						goods_name: '商品测试1',
						unitPrice: 100
					},
					{
						goods_pic: '/static/img/shop/2.jpg',
						goods_name: '商品测试1',
						unitPrice: 100
					},
					{
						goods_pic: '/static/img/shop/3.jpg',
						goods_name: '商品测试1',
						unitPrice: 100
					}
					
					
				], //购物车商品数据列表
				mch_list: [], //商户列表
				check_all_self: false,
				footerbottom:0,
				//店铺按钮
				selfBtnShow:true,
				
				//控制滑动效果
				theIndex: null,
				oldIndex: null,
				isStop: false,
				//分页
				page: 1,
				isNoMore: false,
				
				actions: [
					{
						name: '删除',
						color: '#fff',
						fontsize: 30, //单位rpx
						width: 70, //单位px
						background: '#FD3B31'
					}
				],
			}
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom(){
			this.loadCartGoods();
		},
		onLoad() {
			this.loadCartGoods();
			//兼容H5下结算条位置
			// #ifdef H5
			this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight + 'px';
			// #endif
			// #ifdef APP-PLUS
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
		},
		onShow() {
			
		
		},
		onHide(){
			this.saveCart();
		},
		onUnload(){
			this.saveCart();
		},
		methods: {
			// 初始化数据
		
			//控制左滑删除效果-begin
			touchStart(index, event) {
				//多点触控不触发
				// console.log(index);
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
				// let i = this.selectedList.indexOf(this.goodsList[index].cart_id);
				// i>-1?this.selectedList.splice(i, 1):this.selectedList.push(this.goodsList[index].cart_id);
			},
			touchMove(index, event) {
				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];

				if (this.isStop || Math.abs(moveX) < 5) {
					return;
				}
				if (Math.abs(moveY) > Math.abs(moveX)) {
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}

				if (moveX < 0) {
					this.theIndex = index;
					this.isStop = true;
				} else if (moveX > 0) {
					if (this.theIndex != null && this.oldIndex == this.theIndex) {
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(() => {
							this.oldIndex = null;
						}, 150)
					}
				}
			},
			touchEnd(index, $event) {
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end

			//商品跳转
			toGoods(goodsId) {
				uni.navigateTo({
					url: '../../goods/goods?cid='+goodsId+''
				});
			},
			//跳转确认订单页面
			toConfirmation() {
				var self = this;
				var goodsList = self.goodsList;
				var mch_list = self.mch_list;
				var cart_id_list = [];
				var mch_id_list = [];
				var _mch_list = [];
				var goods_list = [];
				for (var i in goodsList) {
					if (goodsList[i].selected) {
						cart_id_list.push(goodsList[i].cart_id);
						goods_list.push({
							cart_id: goodsList[i].cart_id
						});
					}
				}
				if (cart_id_list.length > 0) {
					_mch_list.push({
						mch_id: 0,
						goods_list: goods_list
					});
				}
				
				for (var i in mch_list) {
					var id_list = [];
					var _goods_list = [];
					if (mch_list[i].list && mch_list[i].list.length) {
						for (var j in mch_list[i].list) {
							if (mch_list[i].list[j].selected) {
								id_list.push(mch_list[i].list[j].cart_id);
								_goods_list.push({
									cart_id: mch_list[i].list[j].cart_id
								});
							}
						}
					}
					if (id_list.length) {
						mch_id_list.push({
							id: mch_list[i].id,
							cart_id_list: id_list
						});
						_mch_list.push({
							mch_id: mch_list[i].id,
							goods_list: _goods_list
						});
					}
				}
				let tmpList = [];
				let len = this.goodsList.length;
				for (let i = 0; i < len; i++) {
					if (this.goodsList[i].selected) {
						tmpList.push(this.goodsList[i]);
					}
				}
				for(let i=0;i<this.mch_list.length;i++){
					for(let j=0; j<this.mch_list[i].list.length; j++){
						if(this.mch_list[i].list[j].selected){
							tmpList.push(this.mch_list[i].list[j]);
						}
					}
				}
				// if (cart_id_list.length == 0 && mch_id_list.length == 0) {
				// 	return true;
				// }
				if (tmpList.length < 1) {
					uni.showToast({
						title: '请选择商品结算',
						icon: 'none'
					});
					return;
				}
				for (let i = 0; i < tmpList.length; i++) {
					// console.log(tmpList[i]);
					if (tmpList[i].max_num <= 0 || tmpList[i].disabled) {
						uni.showModal({
							title: "提示",
							content: "有商品不能参与结算，请检查",
						});
						return;
					}
				}

				self.saveCart(function() {
					uni.navigateTo({
						url: '/pages/order/confirmation?mch_list=' + JSON.stringify(_mch_list)
					});
				});
			},


			// 离开页面时再次提交购物车信息
			saveCart(callback) {
				var self = this;
				var cart = JSON.stringify(self.goodsList);
				console.log(self.mch_list);
				this.$request({
					url: this.$api.cart.cart_edit,
					method: 'POST',
					data: {
						list: cart,
						mch_list: JSON.stringify(self.mch_list),
					}
				}).then((res) => {
					console.log(res);
					if (typeof(callback) == 'function') {
						callback();
					}
				});
			},

			//删除商品
			deleteGoods(id) {
				// 此处传递的参数id为购物车商品id
				let cart_id_list = [];
				cart_id_list.push(id);
				console.log(cart_id_list);
				uni.showModal({
					title: '提示',
					content: '确定删除商品',
					success: (res) => {
						if (res.confirm) {
							let len = this.goodsList.length;
							for (let i = 0; i < len; i++) {
								if (id == this.goodsList[i].cart_id) {
									this.goodsList.splice(i, 1);
									break;
								}
							}
							this.$request({
								url: this.$api.cart.delete,
								data: {
									cart_id_list: JSON.stringify(cart_id_list)
								}
							}).then(res => {
								uni.hideLoading();
								
								this.mch_list = [];
								this.sum();
								this.loadCartGoods();
							});
							this.selectedList.splice(this.selectedList.indexOf(id), 1);
							
							this.oldIndex = null;
							this.theIndex = null;
						}
					}
				});
			},
			// 删除商品s 
			deleteList() {
				// 删除选中的商品
				uni.showModal({
					title: '提示',
					content: '确定删除选中商品',
					success: (res) => {
						if (res.confirm) {
							let len = this.selectedList.length;
							this.$request({
								url: this.$api.cart.delete,
								data: {
									cart_id_list: JSON.stringify(this.selectedList)
								}
							}).then(res => {
								uni.hideLoading();
								this.mch_list = [];
								this.loadCartGoods();
								this.sum();
							});
							this.selectedList.splice(this.selectedList.indexOf(this.selectedList[0]), 1);
							this.oldIndex = null;
							this.theIndex = null;
							
							this.selectedList = [];
							this.isAllselected = this.selectedList.length == this.goodsList.length && this.goodsList.length > 0;
						}
					}
				});
			},
			// 选中商品
			selected(type,index,mch_index) {
				// console.log(index,mch_index);
				
				// this.goodsList[index].selected = this.goodsList[index].selected ? false : true;
				// let i = this.selectedList.indexOf(this.goodsList[index].cart_id);
				// i > -1 ? this.selectedList.splice(i, 1) : this.selectedList.push(this.goodsList[index].cart_id);
				// this.isAllselected = this.selectedList.length == this.goodsList.length;
				// this.sum();

				if (type == 'self') {
					this.goodsList[index].selected = this.goodsList[index].selected ? false : true;
					let i = this.selectedList.indexOf(this.goodsList[index].cart_id);
					i > -1 ? this.selectedList.splice(i, 1) : this.selectedList.push(this.goodsList[index].cart_id);
					let num1 = 0 , num2 = 0;
					for(let i=0;i<this.goodsList.length;i++){
						if(this.goodsList[i].selected){
							num1++;
						}
						if(!this.goodsList[i].disabled){
							num2++;
						}
					}
					this.check_all_self = num1==num2?true:false;
				}
				if (type == 'mch') {
					this.mch_list[mch_index].list[index].selected = this.mch_list[mch_index].list[index].selected ? false : true;
					let i = this.selectedList.indexOf(this.mch_list[mch_index].list[index].cart_id);
					i > -1 ? this.selectedList.splice(i, 1) : this.selectedList.push(this.mch_list[mch_index].list[index].cart_id);
					let num1 = 0 , num2 = 0;
					for(let i=0;i<this.mch_list[mch_index].list.length;i++){
						if(this.mch_list[mch_index].list[i].selected){
							num1++;
						}
						if(!this.mch_list[mch_index].list[i].disabled){
							num2++;
						}
					}
					this.mch_list[mch_index].selected_all = num1==num2?true:false;
				}
				this.judgeAllselect();
				this.sum();
			},
			//点击全选
			allSelect() {
				let len = this.goodsList.length;
				let arr = [];
				for (let i = 0; i < len; i++) {
					if (!this.goodsList[i].disabled) {
						this.goodsList[i].selected = this.isAllselected ? false : true;
						arr.push(this.goodsList[i].cart_id);
					}
				}
				for(let i=0;i<this.mch_list.length;i++){
					this.mch_list[i].selected_all = this.isAllselected ? false : true;
					for(let j=0;j<this.mch_list[i].list.length;j++){
						if (!this.mch_list[i].list[j].disabled) {
							this.mch_list[i].list[j].selected = this.isAllselected ? false : true;
							arr.push(this.mch_list[i].list[j].cart_id);
						}
					}
				}
				this.selectedList = this.isAllselected ? [] : arr;
				this.isAllselected = this.isAllselected ? false : true;
				this.check_all_self = this.isAllselected;
				this.sum();
			},
			
			//点击其他选择时判断是否全选
			judgeAllselect(){
				let mch_list_length = 0, goods_list_length = 0;
				for(let i=0;i<this.goodsList.length;i++){
					if(!this.goodsList[i].disabled){
						goods_list_length++;
					}
				}
				for(let i=0;i<this.mch_list.length;i++){
					for(let j=0;j<this.mch_list[i].list.length;j++){
						if(!this.mch_list[i].list[j].disabled){
							mch_list_length++;
						}
					}
				}
				
				this.isAllselected = this.selectedList.length == (mch_list_length+goods_list_length);
			},
			
			// 减少数量
			sub(e,type,index,mch_index) {
				// if (this.goodsList[index].num <= 1) {
				// 	return;
				// }
				// this.goodsList[index].num--;
				if (type && type == 'mch') {
					if(this.mch_list[mch_index].list[index].num > 1){						
						this.mch_list[mch_index].list[index].num = this.mch_list[mch_index].list[index].num - 1;
						this.mch_list[mch_index].list[index].price = this.mch_list[mch_index].list[index].num * this.mch_list[mch_index].list[index].unitPrice;
						this.mch_list = this.mch_list;
					}else{
						uni.showToast({
							title:"至少要有一件宝贝哦！",
							icon:"none"
						})
					}
					if(this.mch_list[mch_index].list[index].num <= this.mch_list[mch_index].list[index].max_num){
						this.mch_list[mch_index].list[index].disabled = false;
					}
				} 
				
				if(type == 'self'){
					var goodsList = this.goodsList;
					
					if(this.goodsList[index].num > 1){
						this.goodsList[index].num = this.goodsList[index].num-1;
						this.goodsList[index].price = this.goodsList[index].num * this.goodsList[index].unitPrice;
						this.goodsList = this.goodsList;
					}else{
						uni.showToast({
							title:"至少要有一件宝贝哦！",
							icon:"none"
						})
					}
					if(this.goodsList[index].num <= this.goodsList[index].max_num){
						this.goodsList[index].disabled = false;
					}
					// for (let i=0;i<goodsList.length;i++) {
					// 	if (e.currentTarget.id == goodsList[i]['cart_id']) {
					// 		if(goodsList[i].num > 1){
					// 			goodsList[i]['num'] = this.goodsList[i]['num'] - 1;
					// 			goodsList[i]['price'] = this.goodsList[i]['unitPrice'] * goodsList[i]['num'];
					// 			this.goodsList = goodsList;
					// 		}else{
					// 			uni.showToast({
					// 				title:"至少要有一件宝贝哦！",
					// 				icon:"none"
					// 			});
					// 		}
					// 	}
					// }
					
				}
				this.sum();
			},
			// 增加数量
			add(e,type,index,mch_index) {
				// console.log(e)
				// if (this.goodsList[index].max_num <= this.goodsList[index].num) {
				// 	uni.showToast({
				// 		title: "商品库存不足",
				// 		icon: "none"
				// 	})
				// 	return;
				// }
				// this.goodsList[index].num++;
				// console.log(this.mch_list)
				if (type && type == 'mch') {
					if(this.mch_list[mch_index].list[index].max_num > this.mch_list[mch_index].list[index].num){						
						this.mch_list[mch_index].list[index].num = this.mch_list[mch_index].list[index].num + 1;
						this.mch_list[mch_index].list[index].price = this.mch_list[mch_index].list[index].num * this.mch_list[mch_index].list[index].unitPrice;
						this.mch_list = this.mch_list;
					}else{
						uni.showToast({
							title: "不能添加更多宝贝哦！",
							icon: "none"
						});
					}
				} else {
					var goodsList = this.goodsList;
					for (var i in goodsList) {
						if (e.currentTarget.id == goodsList[i]['cart_id']) {
							if(goodsList[i].max_num > goodsList[i].num){
								goodsList[i]['num'] = this.goodsList[i]['num'] + 1;
								goodsList[i]['price'] = this.goodsList[i]['unitPrice'] * goodsList[i]['num'];
								this.goodsList = goodsList;
							}else{
								uni.showToast({
									title: "不能添加更多宝贝哦！",
									icon: "none"
								});
							}
						}	
					}
				}
				this.sum();
			},
			// 合计
			sum(e, index) {
				// console.log(e,index);
				this.sumPrice = 0;
				// 计算选中的平台自营的总价
				let len = this.goodsList.length;
				for (let i = 0; i < len; i++) {
					if (this.goodsList[i].selected) {
						if (e && i == index) {
							this.sumPrice = this.sumPrice + (e.detail.value * this.goodsList[i].unitPrice);
						} else {
							this.sumPrice = this.sumPrice + (this.goodsList[i].num * this.goodsList[i].unitPrice);
						}
					}
				}
				//计算选中的其他商家的商品总价
				for(let i=0;i<this.mch_list.length;i++){
					for(let j=0;j<this.mch_list[i].list.length;j++){
						if(this.mch_list[i].list[j].selected){
							if (e && i == index) {
								this.sumPrice = this.sumPrice + (e.detail.value * this.mch_list[i].list[j].unitPrice);
							} else {
								this.sumPrice = this.sumPrice + (this.mch_list[i].list[j].num * this.mch_list[i].list[j].unitPrice);
							}
						}
					}
				}
				this.sumPrice = this.sumPrice.toFixed(2);
			},
			
			//输入数量,失去焦点时提示
			taol(e,index,type,mch_index) {
				if(type && type == 'mch'){
					if (parseInt(e.detail.value) > this.mch_list[mch_index].list[index].max_num) {
						this.mch_list[mch_index].list[index].num = this.mch_list[mch_index].list[index].max_num;
						
						uni.showToast({
							title: "不能选择更多了哦！",
							icon: "none"
						})
					}
					if (parseInt(e.detail.value) < 1) {
						this.mch_list[mch_index].list[index].num = 1;
						uni.showToast({
							title: "不能小于一个哦！",
							icon: "none"
						})
					}
				}else{
					if (parseInt(e.detail.value) > this.goodsList[index].max_num) {
						this.goodsList[index].num = this.goodsList[index].max_num;
						uni.showToast({
							title: "超过上限",
							icon: "none"
						})
					}
					if (parseInt(e.detail.value) < 1) {
						this.goodsList[index].num = 1;
						uni.showToast({
							title: "不能选择更多了哦！",
							icon: "none"
						})
					}
				}
			},
			
			// 加载用户购物车数据
			loadCartGoods() {
				
			},
			
			// 店铺选中
			selectShop(type,mch_index){
				if (type == 'self') {
					for (var i in this.goodsList) {
						if(!this.goodsList[i].disabled){
							// console.log(this.check_all_self);
							this.goodsList[i].selected = !this.check_all_self;
							let x = this.selectedList.indexOf(this.goodsList[i].cart_id);
							if(x == -1){
								this.selectedList.push(this.goodsList[i].cart_id)
							}
							if(this.check_all_self){
								this.selectedList.splice(x, 1);
							}
							// x > -1 ? this.selectedList.splice(x, 1) : this.selectedList.push(this.goodsList[i].cart_id);
						}
					}
					this.check_all_self = !this.check_all_self;
					this.goodsList = this.goodsList;
				}
				if (type == 'mch') {
					for (var i in this.mch_list[mch_index].list) {
						if(!this.mch_list[mch_index].list[i].disabled){
							this.mch_list[mch_index].list[i].selected = this.mch_list[mch_index].selected_all ? false : true;
							let x = this.selectedList.indexOf(this.mch_list[mch_index].list[i].cart_id);
							if(x == -1){
								this.selectedList.push(this.mch_list[mch_index].list[i].cart_id);
							}
							if(this.mch_list[mch_index].selected_all){
								this.selectedList.splice(x, 1);
							}
							// x > -1 ? this.selectedList.splice(x, 1) : this.selectedList.push(this.mch_list[mch_index].list[i].cart_id);
						}
					}
					this.mch_list[mch_index].selected_all = this.mch_list[mch_index].selected_all ? false : true;
					this.mch_list = this.mch_list
				}
				this.judgeAllselect();
				this.sum();
			},
			
			// 店铺按钮的显示
			shopBtn(){
				let selfDisabled = 0;
				for(let i=0;i<this.goodsList.length;i++){
					if(this.goodsList[i].disabled){
						selfDisabled++;
					}
				}
				if(selfDisabled == this.goodsList.length){
					this.selfBtnShow = false;
				}
				for(let i=0;i<this.mch_list.length;i++){
					let mchDisabled = 0;
					for(let j=0;j<this.mch_list[i].list.length;j++){
						if(this.mch_list[i].list[j].disabled){
							mchDisabled++;
							this.mch_list[i].mch_disabled_num = mchDisabled;
						}
					}
				}
			},
			
			
			//阻止冒泡,不能删！！！不能删！！！
			discard(){
				
			},
			back() {
				uni.navigateBack()
			},
		}
	}
</script>
<style lang="scss" scoped>
	page {
		position: relative;
		background-color: #fff;
	}

	.checkbox-box {
		display: flex;
		align-items: center;

		.checkbox {
			width: 35rpx;
			height: 35rpx;
			border-radius: 100%;
			border: solid 2rpx #f06c7a;
			display: flex;
			justify-content: center;
			align-items: center;

			.on {
				width: 25rpx;
				height: 25rpx;
				border-radius: 100%;
				background-color: #f06c7a;
			}
		}

		.text {
			font-size: 28rpx;
			margin-left: 10rpx;
		}
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-image: url('/static/img/home/header.png');
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 100rpx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-image: url('/static/img/home/header.png');
		background-position: 20%;
		background-size: 50%;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.title {
			font-size: 36rpx;
			margin: 0 auto;
			color: #fff;
		}
	}

	.place {
		background-image: url('/static/img/home/header.png');
		height: 100rpx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.goods-list {
		width: 100%;
		padding: 20rpx 0 120rpx 0;

		.tis {
			width: 100%;
			height: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
		}

		.goods-box {
			width: calc(92%);
			margin: 20rpx auto;
			border-radius: 15rpx;
			box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.1);
			.shop-name{
				padding-top: 20rpx;
				display: flex;
				align-items: center;
				padding-bottom: 20rpx;
				.checkbox-box{
					padding-left: 20rpx;
					flex-shrink: 0;
					width: 38rpx;
					margin-right: 20rpx;
				}
			}
			.row {
				width: 100%;
				height: calc(22vw + 40rpx);
				display: flex;
				align-items: center;
				position: relative;
				overflow: hidden;
				z-index: 4;
				border: 0;
				border-top: 1px solid #E3E3E3;

				.menu {
					.icon {
						color: #fff;
						// font-size: 25rpx;
					}
					position: absolute;
					width: 30%;
					height: 98%;
					right: 1px;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: red;
					color: #fff;
					z-index: 2;
				}

				.carrier {
					@keyframes showMenu {
						0% {
							transform: translateX(0);
						}

						100% {
							transform: translateX(-30%);
						}
					}

					@keyframes closeMenu {
						0% {
							transform: translateX(-30%);
						}

						100% {
							transform: translateX(0);
						}
					}

					&.open {
						animation: showMenu 0.25s linear both;
					}

					&.close {
						animation: closeMenu 0.15s linear both;
					}

					background-color: #fff;

					.checkbox-box {
						padding-left: 20rpx;
						flex-shrink: 0;
						height: 22vw;
						width: 38rpx;
						margin-right: 20rpx;
					}

					position: absolute;
					width: 100%;
					padding: 0 0;
					height: 100%;
					z-index: 3;
					display: flex;
					align-items: center;

					.goods-info {
						width: 100%;
						display: flex;
						padding-right: 20rpx;

						.img {
							width: 22vw;
							height: 22vw;
							border-radius: 10rpx;
							overflow: hidden;
							flex-shrink: 0;
							margin-right: 10rpx;

							image {
								width: 22vw;
								height: 22vw;
							}
						}

						.info {
							width: 100%;
							height: 22vw;
							overflow: hidden;
							display: flex;
							flex-wrap: wrap;
							position: relative;

							.title {
								width: 100%;
								height: 72rpx;
								font-size: 28rpx;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								// text-align: justify;
								overflow: hidden;
							}

							.spec {
								max-width: 92%;
								font-size: 20rpx;
								background-color: #f3f3f3;
								color: #a7a7a7;
								height: 30rpx;
								display: flex;
								align-items: center;
								padding: 0 10rpx;
								border-radius: 15rpx;
								position: absolute;
								bottom: 55rpx;
								overflow: hidden;
								white-space: nowrap;

								view {
									text-overflow: ellipsis;
									overflow: hidden;
									margin-right: 5rpx;
								}
							}

							.price-number {
								position: absolute;
								width: 100%;
								bottom: 0rpx;
								display: flex;
								justify-content: space-between;
								align-items: flex-end;
								font-size: 28rpx;
								height: 60rpx;

								.price {}

								.number {
									display: flex;
									justify-content: center;
									align-items: flex-end;

									.input {
										width: 50rpx;
										height: 50rpx;
										margin: 0 10rpx;
										background-color: #f3f3f3;

										input {
											width: 50rpx;
											height: 50rpx;
											display: flex;
											justify-content: center;
											align-items: center;
											text-align: center;
											font-size: 26rpx;
										}
									}

									.sub,
									.add {
										width: 45rpx;
										height: 45rpx;
										background-color: #f3f3f3;
										border-radius: 5rpx;

										.icon {
											font-size: 22rpx;
											width: 45rpx;
											height: 45rpx;
											display: flex;
											justify-content: center;
											align-items: center;

										}
									}
								}

								.max-num {
									color: red;
									font-size: 26rpx;
								}
							}
						}
					}
				}
			}
		}
		.no-more{
			text-align: center;
			line-height: 100rpx;
		}
	}


	.footer {
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		position: fixed;
		bottom: 0rpx;
		z-index: 5;

		.delBtn {
			border: solid 1rpx #f06c7a;
			color: #f06c7a;
			padding: 0 30rpx;
			height: 50rpx;
			border-radius: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.settlement {
			width: 60%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.sum {
				width: 50%;
				font-size: 28rpx;
				margin-right: 10rpx;
				display: flex;
				justify-content: flex-end;

				.money {
					font-weight: 600;
				}
			}

			.btn {
				padding: 0 30rpx;
				height: 50rpx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 30rpx;
			}
		}
	}

	.load {
		width: 100%;
		font-size: 32rpx;
		text-align: center;
	}
</style>
