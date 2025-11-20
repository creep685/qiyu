// Node.js 后端服务器
// 用于处理可穿戴设备发送的传感器数据

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors()); // 启用CORS
app.use(bodyParser.json()); // 解析JSON请求体

// 传感器数据存储（在实际应用中应使用数据库）
let sensorDataStorage = {
    latest: {
        location: { longitude: 118.72167, latitude: 32.20722, timestamp: Date.now() },
        distance: { value: 4.8, timestamp: Date.now() },
        temperature: { value: 25.6, timestamp: Date.now() },
        humidity: { value: 62, timestamp: Date.now() }
    },
    history: []
};

// 警报阈值设置
let alertThresholds = {
    minDistance: 2.0,          // 最小距离阈值（米）
    maxTemperature: 35.0,      // 最高温度阈值（摄氏度）
    minTemperature: 10.0,      // 最低温度阈值（摄氏度）
    maxHumidity: 80.0,         // 最高湿度阈值（百分比）
    minHumidity: 20.0          // 最低湿度阈值（百分比）
};

// API路由

// 接收传感器数据
app.post('/api/sensor-data', (req, res) => {
    try {
        const data = req.body;

        // 验证数据格式
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: '无效的数据格式' });
        }

        // 更新最新数据
        if (data.longitude !== undefined && data.latitude !== undefined) {
            sensorDataStorage.latest.location = {
                longitude: data.longitude,
                latitude: data.latitude,
                timestamp: data.timestamp || Date.now()
            };
        }

        if (data.distance !== undefined) {
            sensorDataStorage.latest.distance = {
                value: data.distance,
                timestamp: data.timestamp || Date.now()
            };
        }

        if (data.temperature !== undefined) {
            sensorDataStorage.latest.temperature = {
                value: data.temperature,
                timestamp: data.timestamp || Date.now()
            };
        }

        if (data.humidity !== undefined) {
            sensorDataStorage.latest.humidity = {
                value: data.humidity,
                timestamp: data.timestamp || Date.now()
            };
        }

        // 添加到历史记录（在实际应用中可能需要限制历史记录大小）
        sensorDataStorage.history.push({
            ...data,
            timestamp: data.timestamp || Date.now()
        });

        // 检查是否需要触发警报
        const alerts = checkAlerts(data);

        console.log('传感器数据已更新:', data);

        // 返回成功响应
        res.status(200).json({
            success: true,
            message: '传感器数据已接收',
            alerts: alerts.length > 0 ? alerts : undefined
        });
    } catch (error) {
        console.error('处理传感器数据时出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取最新传感器数据
app.get('/api/sensor-data/latest', (req, res) => {
    try {
        res.status(200).json(sensorDataStorage.latest);
    } catch (error) {
        console.error('获取最新传感器数据时出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取历史传感器数据
app.get('/api/sensor-data/history', (req, res) => {
    try {
        const { sensorType, startTime, endTime } = req.query;

        let filteredData = [...sensorDataStorage.history];

        // 按传感器类型过滤
        if (sensorType) {
            filteredData = filteredData.map(item => {
                const filteredItem = { timestamp: item.timestamp };
                if (item[sensorType] !== undefined) {
                    filteredItem[sensorType] = item[sensorType];
                }
                return filteredItem;
            }).filter(item => Object.keys(item).length > 1);
        }

        // 按时间范围过滤
        if (startTime) {
            const start = new Date(startTime).getTime();
            filteredData = filteredData.filter(item => item.timestamp >= start);
        }

        if (endTime) {
            const end = new Date(endTime).getTime();
            filteredData = filteredData.filter(item => item.timestamp <= end);
        }

        res.status(200).json(filteredData);
    } catch (error) {
        console.error('获取历史传感器数据时出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 设置警报阈值
app.post('/api/alert-thresholds', (req, res) => {
    try {
        const thresholds = req.body;

        // 更新阈值
        if (thresholds.minDistance !== undefined) {
            alertThresholds.minDistance = thresholds.minDistance;
        }
        if (thresholds.maxTemperature !== undefined) {
            alertThresholds.maxTemperature = thresholds.maxTemperature;
        }
        if (thresholds.minTemperature !== undefined) {
            alertThresholds.minTemperature = thresholds.minTemperature;
        }
        if (thresholds.maxHumidity !== undefined) {
            alertThresholds.maxHumidity = thresholds.maxHumidity;
        }
        if (thresholds.minHumidity !== undefined) {
            alertThresholds.minHumidity = thresholds.minHumidity;
        }

        console.log('警报阈值已更新:', alertThresholds);

        res.status(200).json({
            success: true,
            message: '警报阈值已更新',
            thresholds: alertThresholds
        });
    } catch (error) {
        console.error('设置警报阈值时出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取警报阈值
app.get('/api/alert-thresholds', (req, res) => {
    try {
        res.status(200).json(alertThresholds);
    } catch (error) {
        console.error('获取警报阈值时出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取警报设置
app.get('/api/alert-settings', (req, res) => {
    try {
        // 在实际应用中，这里应该从数据库获取警报设置
        // 现在返回默认设置
        const defaultAlertSettings = {
            soundAlert: true,
            vibrationAlert: true
        };
        
        res.status(200).json(defaultAlertSettings);
    } catch (error) {
        console.error('获取警报设置时出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 更新警报设置
app.post('/api/alert-settings', (req, res) => {
    try {
        const alertSettings = req.body;
        
        console.log('更新警报设置:', alertSettings);
        
        // 在实际应用中，这里应该将设置保存到数据库
        
        res.status(200).json({
            success: true,
            message: '警报设置已更新',
            settings: {
                soundAlert: alertSettings.soundAlert,
                vibrationAlert: alertSettings.vibrationAlert
            }
        });
    } catch (error) {
        console.error('更新警报设置时出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 检查警报条件
function checkAlerts(data) {
    const alerts = [];

    // 检查距离警报
    if (data.distance !== undefined && data.distance <= alertThresholds.minDistance) {
        alerts.push({
            type: 'distance',
            message: `激光测距过近: ${data.distance}米 (阈值: ${alertThresholds.minDistance}米)`,
            severity: 'high'
        });
    }

    // 检查温度警报
    if (data.temperature !== undefined) {
        if (data.temperature >= alertThresholds.maxTemperature) {
            alerts.push({
                type: 'temperature',
                message: `温度过高: ${data.temperature}°C (阈值: ${alertThresholds.maxTemperature}°C)`,
                severity: 'medium'
            });
        } else if (data.temperature <= alertThresholds.minTemperature) {
            alerts.push({
                type: 'temperature',
                message: `温度过低: ${data.temperature}°C (阈值: ${alertThresholds.minTemperature}°C)`,
                severity: 'medium'
            });
        }
    }

    // 检查湿度警报
    if (data.humidity !== undefined) {
        if (data.humidity >= alertThresholds.maxHumidity) {
            alerts.push({
                type: 'humidity',
                message: `湿度过高: ${data.humidity}% (阈值: ${alertThresholds.maxHumidity}%)`,
                severity: 'low'
            });
        } else if (data.humidity <= alertThresholds.minHumidity) {
            alerts.push({
                type: 'humidity',
                message: `湿度过低: ${data.humidity}% (阈值: ${alertThresholds.minHumidity}%)`,
                severity: 'low'
            });
        }
    }

    return alerts;
}

// 启动服务器
app.listen(PORT, () => {
    console.log(`传感器数据服务器运行在 http://localhost:${PORT}`);
});

// 导出应用（用于测试）
// module.exports = app;
