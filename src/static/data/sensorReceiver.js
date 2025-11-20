// 传感器数据接收模块
// 用于接收和处理来自可穿戴设备的真实传感器数据

// 接收真实传感器数据
function receiveSensorData(data) {
    console.log('接收到真实传感器数据:', data);

    // 使用数据管理器处理真实传感器数据
    if (window.dataManager) {
        return window.dataManager.receiveRealSensorData(data);
    } else {
        console.error('数据管理器不可用，无法处理传感器数据');
        return null;
    }
}

// 模拟接收传感器数据（用于测试）
function simulateRealSensorData() {
    // 生成模拟的真实传感器数据
    const data = {
        location: {
            longitude: 120.72167 + (Math.random() * 0.001 - 0.0005),
            latitude: 32.20722 + (Math.random() * 0.001 - 0.0005)
        },
        distance: 3.5 + (Math.random() * 2 - 1),
        temperature: 26.0 + (Math.random() * 4 - 2),
        humidity: 65 + Math.floor(Math.random() * 10) - 5
    };

    return receiveSensorData(data);
}

// 通过WebSocket接收传感器数据
function setupWebSocketSensorReceiver(url) {
    if (!window.WebSocket) {
        console.error('浏览器不支持WebSocket');
        return null;
    }

    try {
        const socket = new WebSocket(url);

        socket.onopen = function(event) {
            console.log('WebSocket连接已建立');
        };

        socket.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                receiveSensorData(data);
            } catch (error) {
                console.error('解析传感器数据失败:', error);
            }
        };

        socket.onerror = function(error) {
            console.error('WebSocket错误:', error);
        };

        socket.onclose = function(event) {
            console.log('WebSocket连接已关闭');
        };

        return socket;
    } catch (error) {
        console.error('创建WebSocket连接失败:', error);
        return null;
    }
}

// 通过HTTP轮询接收传感器数据
function setupHttpPollingSensorReceiver(url, interval = 5000) {
    let pollingInterval = null;

    function pollData() {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                receiveSensorData(data);
            })
            .catch(error => {
                console.error('轮询传感器数据失败:', error);
            });
    }

    // 立即执行一次
    pollData();

    // 设置定时轮询
    pollingInterval = setInterval(pollData, interval);

    // 返回停止轮询的函数
    return function stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    };
}

// 暴露函数到全局作用域，便于调试和测试
window.sensorReceiver = {
    receiveSensorData,
    simulateRealSensorData,
    setupWebSocketSensorReceiver,
    setupHttpPollingSensorReceiver
};

// 页面加载完成后，可以自动设置传感器数据接收
document.addEventListener('DOMContentLoaded', function() {
    // 这里可以根据需要自动设置WebSocket或HTTP轮询
    // 例如：
    // window.sensorReceiver.setupWebSocketSensorReceiver('ws://localhost:8080/sensor-data');
    // 或
    // window.sensorReceiver.setupHttpPollingSensorReceiver('/api/sensor-data/latest');
});
