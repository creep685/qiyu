# 传感器数据服务器

这是一个用于接收和处理可穿戴设备传感器数据的Node.js服务器。

## 功能

- 接收来自可穿戴设备的传感器数据（GPS位置、激光测距、温度、湿度）
- 存储和管理传感器数据
- 提供API接口获取最新和历史数据
- 支持设置和获取传感器警报阈值
- 自动检测传感器数据是否超出阈值并触发警报

## 安装与运行

1. 安装依赖：

```bash
cd server
npm install
```

2. 启动服务器：

```bash
# 生产模式
npm start

# 开发模式（自动重启）
npm run dev
```

服务器将在 http://localhost:3000 上运行。

## API 接口

### 接收传感器数据

**请求**:
```
POST /api/sensor-data
Content-Type: application/json

{
  "longitude": 118.72167,
  "latitude": 32.20722,
  "distance": 4.8,
  "temperature": 25.6,
  "humidity": 62,
  "timestamp": 1686789200000
}
```

**响应**:
```json
{
  "success": true,
  "message": "传感器数据已接收",
  "alerts": [
    {
      "type": "distance",
      "message": "激光测距过近: 1.5米 (阈值: 2.0米)",
      "severity": "high"
    }
  ]
}
```

### 获取最新传感器数据

**请求**:
```
GET /api/sensor-data/latest
```

**响应**:
```json
{
  "location": {
    "longitude": 118.72167,
    "latitude": 32.20722,
    "timestamp": 1686789200000
  },
  "distance": {
    "value": 4.8,
    "timestamp": 1686789200000
  },
  "temperature": {
    "value": 25.6,
    "timestamp": 1686789200000
  },
  "humidity": {
    "value": 62,
    "timestamp": 1686789200000
  }
}
```

### 获取历史传感器数据

**请求**:
```
GET /api/sensor-data/history?sensorType=temperature&startTime=2023-06-01T00:00:00.000Z&endTime=2023-06-15T23:59:59.999Z
```

**响应**:
```json
[
  {
    "timestamp": 1686789200000,
    "temperature": 25.6
  },
  {
    "timestamp": 1686789201000,
    "temperature": 25.7
  }
]
```

### 设置警报阈值

**请求**:
```
POST /api/alert-thresholds
Content-Type: application/json

{
  "minDistance": 2.0,
  "maxTemperature": 35.0,
  "minTemperature": 10.0,
  "maxHumidity": 80.0,
  "minHumidity": 20.0
}
```

**响应**:
```json
{
  "success": true,
  "message": "警报阈值已更新",
  "thresholds": {
    "minDistance": 2.0,
    "maxTemperature": 35.0,
    "minTemperature": 10.0,
    "maxHumidity": 80.0,
    "minHumidity": 20.0
  }
}
```

### 获取警报阈值

**请求**:
```
GET /api/alert-thresholds
```

**响应**:
```json
{
  "minDistance": 2.0,
  "maxTemperature": 35.0,
  "minTemperature": 10.0,
  "maxHumidity": 80.0,
  "minHumidity": 20.0
}
```

## 测试

项目包含一个测试文件 `src/static/test/sensorData.js`，用于模拟传感器数据并测试前端显示。

在浏览器控制台中，可以使用以下命令进行测试：

```javascript
// 获取当前传感器数据
window.sensorTestData.getSensorData();

// 更新传感器数据（模拟变化）
window.sensorTestData.updateSensorData();

// 手动设置传感器数据
window.sensorTestData.setSensorData({
  location: {
    longitude: 118.722,
    latitude: 32.208
  },
  distance: 3.5,
  temperature: 26.0,
  humidity: 65
});

// 模拟发送数据到前端
window.sensorTestData.simulateDataSending();
```

## 与前端集成

前端页面通过 `src/static/api/sensorApi.js` 与后端服务器通信。该文件封装了所有API调用，前端可以通过以下方式使用：

```javascript
// 发送传感器数据
sensorApi.sendSensorData({
  longitude: 118.72167,
  latitude: 32.20722,
  distance: 4.8,
  temperature: 25.6,
  humidity: 62
});

// 获取最新传感器数据
sensorApi.getLatestSensorData().then(data => {
  console.log('最新传感器数据:', data);
});

// 获取历史传感器数据
sensorApi.getHistoricalSensorData({
  sensorType: 'temperature',
  startTime: '2023-06-01T00:00:00.000Z',
  endTime: '2023-06-15T23:59:59.999Z'
}).then(data => {
  console.log('历史传感器数据:', data);
});

// 设置警报阈值
sensorApi.setAlertThresholds({
  minDistance: 1.5,
  maxTemperature: 30.0
}).then(response => {
  console.log('警报阈值设置结果:', response);
});
```

## 注意事项

1. 当前版本使用内存存储数据，服务器重启后数据会丢失。在生产环境中应使用数据库（如MongoDB、MySQL等）持久化存储数据。
2. 警报阈值目前存储在内存中，同样在服务器重启后会重置为默认值。
3. 在实际部署时，需要修改 `src/static/api/sensorApi.js` 中的 `API_BASE_URL` 为实际的服务器地址。
