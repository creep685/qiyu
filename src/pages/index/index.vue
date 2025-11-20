<template>
  <view class="login-page">
    <view class="phone-frame">
      <view class="card">
        <view class="logo-wrap">
          <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
        </view>

        <view class="title-wrap">
          <text class="title">欢迎登录</text>
          <text class="subtitle">请输入您的账号信息</text>
        </view>

        <view class="form">
          <view class="form-item">
            <view class="prefix">
              <text class="prefix-icon">👤</text>
            </view>
            <input
              class="input"
              type="text"
              placeholder="请输入账号"
              v-model="form.username"
              :focus="focusField==='username'"
              @focus="focusField='username'"
              @blur="focusField=''"
            />
          </view>

          <view class="form-item">
            <view class="prefix">
              <text class="prefix-icon">🔒</text>
            </view>
            <input
              class="input"
              :password="!showPassword"
              placeholder="请输入密码"
              v-model="form.password"
              :focus="focusField==='password'"
              @focus="focusField='password'"
              @blur="focusField=''"
            />
          </view>

          <view class="extra">
            <text class="forgot" @click="handleForgot">忘记密码?</text>
          </view>

          <button class="btn" :disabled="loading" @click="handleLogin">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </view>
      </view>
    </view>
  </view>
  
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      showPassword: false,
      loading: false,
      focusField: ''
    }
  },
  methods: {
    async handleLogin() {
      if (!this.form.username || !this.form.password) {
        alert('请输入账号和密码')
        return
      }
      this.loading = true
      try {
        // TODO: 添加登录API调用
        // const response = await fetch('YOUR_LOGIN_API_URL', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(this.form)
        // })
        await new Promise(r => setTimeout(r, 1200))
        alert('登录成功')
        
        // 登录成功后跳转到传感器页面
        setTimeout(() => {
          window.location.href = '/src/static/sensor.html'
        }, 1500)
      } catch (e) {
        alert('登录失败')
      } finally {
        this.loading = false
      }
    },
    handleForgot() {
      alert('请联系管理员重置')
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f2f4f7;
  display: flex;
  align-items: stretch;
  justify-content: center;
  /* 贴边显示，保留安全区 */
  padding: constant(safe-area-inset-top) 0 constant(safe-area-inset-bottom);
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}

.phone-frame {
  width: 100%;
  max-width: 100%;
}

.card {
  background: #ffffff;
  border-radius: 0;
  padding: 64rpx 32rpx 48rpx;
  box-shadow: none;
  margin: 0; /* 关键：取消左右外边距，铺满宽度 */
  min-height: 100vh; /* 关键：高度填充屏幕 */
  box-sizing: border-box;
}

.logo-wrap {
  width: 128rpx;
  height: 128rpx;
  border-radius: 24rpx;
  margin: 0 auto 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #4f78ff 0%, #2c5bff 100%);
  box-shadow: 0 16rpx 40rpx rgba(76, 102, 255, 0.25);
}

.logo {
  width: 72rpx;
  height: 72rpx;
}

.title-wrap {
  text-align: center;
  margin-bottom: 36rpx;
}

.title {
  font-size: 44rpx;
  font-weight: 700;
  color: #111827;
}

.subtitle {
  display: block;
  font-size: 26rpx;
  color: #6b7280;
  margin-top: 8rpx;
}

.form { /* 容器保留以支持后续扩展，避免空规则 */
  /* 提供最小的布局作用，避免被视为空规则 */
  display: block;
}

.form-item {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 0 20rpx;
  height: 96rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #e5e7eb;
}

.form-item:focus-within {
  border-color: #4f78ff;
  box-shadow: 0 0 0 6rpx rgba(79, 120, 255, 0.15);
}


.prefix {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.prefix-icon {
  font-size: 36rpx;
}

.input {
  flex: 1;
  height: 100%;
  font-size: 30rpx;
}

.extra {
  display: flex;
  justify-content: flex-end;
  margin: 8rpx 0 24rpx;
}

.forgot {
  font-size: 26rpx;
  color: #3761ff;
}

.btn {
  height: 96rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #5473ff 0%, #2e5bff 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 16rpx 40rpx rgba(46, 91, 255, 0.25);
}
</style>
