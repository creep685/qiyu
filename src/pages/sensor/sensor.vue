<template>
  <view class="sensor-container">
    <!-- 顶部导航栏 -->
    <view class="gradient-bg text-white shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300" style="top: 0; padding-top: 44px;">
      <view class="container mx-auto px-4 py-4 flex justify-between items-center">
        <text class="text-xl font-bold">{{ pageTitle }}</text>
        <view class="flex items-center space-x-3">
          <text class="text-sm opacity-90">{{ updateTime }}</text>
          <button v-if="showRefresh" @click="refreshData" class="p-2 rounded-full hover:bg-white/20 transition-colors">
            <text class="fa fa-refresh"></text>
          </button>
        </view>
      </view>
    </view>

    <!-- 主内容区 -->
    <view class="container mx-auto px-4" style="padding-top: 120px; padding-bottom: 80px;">
      <!-- 仪表盘页面 -->
      <view v-if="currentPage === 'dashboard'" class="page-transition page-active">
        <!-- 状态指示器 -->
        <view class="flex items-center mb-6">
          <view class="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></view>
          <text class="text-sm text-gray-600">实时数据监控中</text>
          <view v-if="distanceAlert" class="ml-4 flex items-center text-danger text-sm">
            <text class="fa fa-exclamation-circle mr-1"></text>
            <text>激光距离过近警报</text>
          </view>
        </view>
        
        <!-- 传感器数据卡片 -->
        <view class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <!-- 温度卡片 -->
          <view class="bg-white rounded-2xl p-5 card-shadow transform transition-all duration-300 hover:scale-[1.02]">
            <view class="flex justify-between items-start mb-3">
              <view class="flex items-center">
                <view class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-danger mr-3">
                  <text class="fa fa-thermometer-half text-xl"></text>
                </view>
                <text class="text-lg font-semibold">温度</text>
              </view>
              <text class="text-xs px-2 py-1 bg-blue-50 text-primary rounded-full">实时</text>
            </view>
            <view class="flex items-end">
              <text class="text-4xl font-bold">{{ sensorData.temperature }}</text>
              <text class="text-xl ml-1 mb-1">°C</text>
            </view>
          </view>
          
          <!-- 湿度卡片 -->
          <view class="bg-white rounded-2xl p-5 card-shadow transform transition-all duration-300 hover:scale-[1.02]">
            <view class="flex justify-between items-start mb-3">
              <view class="flex items-center">
                <view class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-3">
                  <text class="fa fa-tint text-xl"></text>
                </view>
                <text class="text-lg font-semibold">湿度</text>
              </view>
              <text class="text-xs px-2 py-1 bg-blue-50 text-primary rounded-full">实时</text>
            </view>
            <view class="flex items-end">
              <text class="text-4xl font-bold">{{ sensorData.humidity }}</text>
              <text class="text-xl ml-1 mb-1">%</text>
            </view>
          </view>
          
          <!-- 激光测距卡片 -->
          <view class="bg-white rounded-2xl p-5 card-shadow transform transition-all duration-300 hover:scale-[1.02]">
            <view class="flex justify-between items-start mb-3">
              <view class="flex items-center">
                <view class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-accent mr-3">
                  <text class="fa fa-arrows-h text-xl"></text>
                </view>
                <text class="text-lg font-semibold">激光测距</text>
              </view>
              <view class="flex items-center">
                <text class="text-xs px-2 py-1 bg-blue-50 text-primary rounded-full mr-2">实时</text>
                <view v-if="distanceAlert" class="text-danger">
                  <text class="fa fa-exclamation-triangle"></text>
                </view>
              </view>
            </view>
            <view class="flex items-end">
              <text class="text-4xl font-bold">{{ sensorData.distance }}</text>
              <text class="text-xl ml-1 mb-1">m</text>
            </view>
            <view v-if="distanceAlert" class="mt-2 text-sm text-danger flex items-center">
              <text class="fa fa-warning mr-1"></text>
              <text>距离过近！请注意安全！</text>
            </view>
          </view>
          
          <!-- 位置信息卡片 -->
          <view class="bg-white rounded-2xl p-5 card-shadow transform transition-all duration-300 hover:scale-[1.02]">
            <view class="flex justify-between items-start mb-3">
              <view class="flex items-center">
                <view class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <text class="fa fa-map-marker text-xl"></text>
                </view>
                <text class="text-lg font-semibold">位置信息</text>
              </view>
              <text class="text-xs px-2 py-1 bg-blue-50 text-primary rounded-full">实时</text>
            </view>
            <view class="space-y-2">
              <view class="flex justify-between">
                <text class="text-gray-500">经度:</text>
                <text class="font-semibold">{{ sensorData.longitude }}</text>
              </view>
              <view class="flex justify-between">
                <text class="text-gray-500">纬度:</text>
                <text class="font-semibold">{{ sensorData.latitude }}</text>
              </view>
            </view>
            <view class="mt-3">
              <button @click="showMap" class="text-primary text-sm flex items-center">
                <text class="fa fa-map-o mr-1"></text>
                <text>查看地图</text>
              </button>
            </view>
          </view>
        </view>
      </view>

      <!-- 地图页面 -->
      <view v-if="currentPage === 'map'" class="page-transition page-active">
        <view class="bg-white rounded-2xl p-5 card-shadow mb-6">
          <view class="flex justify-between items-center mb-4">
            <text class="text-lg font-semibold">位置地图</text>
            <button @click="backToDashboard" class="text-primary flex items-center">
              <text class="fa fa-arrow-left mr-1"></text>
              <text>返回</text>
            </button>
          </view>
          <view class="map-container">
            <view class="text-center">
              <text class="fa fa-map-marker text-4xl mb-4 text-primary"></text>
              <text class="text-lg font-medium mb-2">点击下方按钮打开高德地图</text>
              <text class="text-sm mb-4">经度: {{ sensorData.longitude }}, 纬度: {{ sensorData.latitude }}</text>
              <button @click="openAmapLocation" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                <text class="fa fa-external-link mr-2"></text>
                <text>打开高德地图</text>
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <view class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2" style="bottom: 0;">
      <view class="flex justify-around">
        <button @click="showDashboard" class="flex flex-col items-center py-2" :class="currentPage === 'dashboard' ? 'text-primary' : 'text-gray-400'">
          <text class="fa fa-dashboard text-xl mb-1"></text>
          <text class="text-xs">仪表盘</text>
        </button>
        <button @click="showHistory" class="flex flex-col items-center py-2 text-gray-400">
          <text class="fa fa-history text-xl mb-1"></text>
          <text class="text-xs">历史</text>
        </button>
        <button @click="showSettings" class="flex flex-col items-center py-2 text-gray-400">
          <text class="fa fa-cog text-xl mb-1"></text>
          <text class="text-xs">设置</text>
        </button>
        <button @click="showProfile" class="flex flex-col items-center py-2 text-gray-400">
          <text class="fa fa-user text-xl mb-1"></text>
          <text class="text-xs">我的</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 'dashboard',
      pageTitle: '传感器监控',
      showRefresh: true,
      updateTime: '更新于: 加载中...',
      distanceAlert: false,
      sensorData: {
        temperature: '25.6',
        humidity: '62',
        distance: '4.8',
        longitude: '116.403874',
        latitude: '39.914885'
      }
    }
  },
  onLoad() {
    this.initSensorData()
    this.startDataUpdate()
  },
  methods: {
    initSensorData() {
      // 初始化传感器数据
      this.updateTime = `更新于: ${new Date().toLocaleTimeString()}`
    },
    
    startDataUpdate() {
      // 模拟数据更新
      setInterval(() => {
        this.sensorData.temperature = (25 + Math.random() * 2).toFixed(1)
        this.sensorData.humidity = (60 + Math.random() * 10).toFixed(0)
        this.sensorData.distance = (4 + Math.random() * 2).toFixed(1)
        this.updateTime = `更新于: ${new Date().toLocaleTimeString()}`
        
        // 检查距离警报
        this.distanceAlert = parseFloat(this.sensorData.distance) < 2.0
      }, 5000)
    },
    
    refreshData() {
      uni.showToast({ title: '数据已刷新', icon: 'success' })
      this.updateTime = `更新于: ${new Date().toLocaleTimeString()}`
    },
    
    showDashboard() {
      this.currentPage = 'dashboard'
      this.pageTitle = '传感器监控'
      this.showRefresh = true
    },
    
    showMap() {
      this.currentPage = 'map'
      this.pageTitle = '位置地图'
      this.showRefresh = false
    },
    
    backToDashboard() {
      this.showDashboard()
    },
    
    openAmapLocation() {
      const longitude = this.sensorData.longitude
      const latitude = this.sensorData.latitude
      
      // 检测设备类型
      const userAgent = navigator.userAgent.toLowerCase()
      const isIOS = /iphone|ipad|ipod/i.test(userAgent)
      const isAndroid = /android/i.test(userAgent)
      
      let amapUrl = ''
      
      if (isIOS) {
        amapUrl = `iosamap://viewMap?sourceApplication=传感器监控&poiname=传感器位置&lat=${latitude}&lon=${longitude}&dev=0`
      } else if (isAndroid) {
        amapUrl = `androidamap://viewMap?sourceApplication=传感器监控&poiname=传感器位置&lat=${latitude}&lon=${longitude}&dev=0`
      } else {
        amapUrl = `https://uri.amap.com/marker?position=${longitude},${latitude}&name=传感器位置&src=传感器监控`
      }
      
      // 在APP中使用plus.runtime.openURL
      if (typeof plus !== 'undefined') {
        plus.runtime.openURL(amapUrl, (error) => {
          // 如果App打开失败，使用网页版
          plus.runtime.openURL(`https://uri.amap.com/marker?position=${longitude},${latitude}&name=传感器位置&src=传感器监控`)
        })
      } else {
        // 在H5中使用window.open
        window.open(amapUrl, '_blank')
      }
      
      uni.showToast({ title: '正在打开高德地图...', icon: 'none' })
    },
    
    showHistory() {
      uni.showToast({ title: '历史记录功能开发中', icon: 'none' })
    },
    
    showSettings() {
      uni.showToast({ title: '设置功能开发中', icon: 'none' })
    },
    
    showProfile() {
      uni.showToast({ title: '个人中心功能开发中', icon: 'none' })
    }
  }
}
</script>

<style scoped>
.sensor-container {
  min-height: 100vh;
  background: #f2f4f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.gradient-bg {
  background: linear-gradient(135deg, #165DFF 0%, #36CFC9 100%);
}

.card-shadow {
  box-shadow: 0 10px 30px -5px rgba(22, 93, 255, 0.1);
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.page-transition {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.page-active {
  opacity: 1;
  transform: translateY(0);
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
