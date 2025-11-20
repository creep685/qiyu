// 数据管理模块
// 用于管理测试数据和真实传感器数据的优先级

// 数据状态
const DATA_SOURCE = {
    TEST: 'test',        // 测试数据
    REAL: 'real'         // 真实传感器数据
};

// 当前数据源
let currentDataSource = DATA_SOURCE.TEST;

// 传感器数据存储
let sensorData = {
    // GPS位置信息
    location: {
        longitude: 118.72167,  // 经度
        latitude: 32.20722,    // 纬度
        timestamp: Date.now()
    },

    // 激光测距数据
    distance: {
        value: 4.9,           // 距离值，单位：米
        timestamp: Date.now()
    },

    // 温度数据
    temperature: {
        value: 25.6,          // 温度值，单位：摄氏度
        timestamp: Date.now()
    },

    // 湿度数据
    humidity: {
        value: 62,            // 湿度值，单位：百分比
        timestamp: Date.now()
    }
};

// 更新传感器数据
function updateSensorData(data, source = DATA_SOURCE.TEST) {
    // 如果是真实传感器数据，则更新数据源
    if (source === DATA_SOURCE.REAL) {
        currentDataSource = DATA_SOURCE.REAL;
    }
    // 如果是测试数据，且当前数据源不是真实数据，则允许更新
    else if (currentDataSource === DATA_SOURCE.TEST) {
        currentDataSource = DATA_SOURCE.TEST;
    }
    // 如果是测试数据，但当前数据源是真实数据，则忽略测试数据
    else {
        console.log('忽略测试数据，当前使用真实传感器数据');
        return sensorData;
    }

    // 更新时间戳
    const now = Date.now();

    // 更新位置数据
    if (data.location) {
        sensorData.location = {
            longitude: data.location.longitude,
            latitude: data.location.latitude,
            timestamp: now
        };
    }

    // 更新距离数据
    if (data.distance !== undefined) {
        sensorData.distance = {
            value: data.distance,
            timestamp: now
        };
    }

    // 更新温度数据
    if (data.temperature !== undefined) {
        sensorData.temperature = {
            value: data.temperature,
            timestamp: now
        };
    }

    // 更新湿度数据
    if (data.humidity !== undefined) {
        sensorData.humidity = {
            value: data.humidity,
            timestamp: now
        };
    }

    // 触发自定义事件，通知前端数据已更新
    window.dispatchEvent(new CustomEvent('sensorDataUpdate', { 
        detail: sensorData 
    }));

    // 在控制台输出数据，便于调试
    console.log(`传感器数据已更新 (来源: ${source}):`, sensorData);

    return sensorData;
}

// 获取当前传感器数据
function getSensorData() {
    return sensorData;
}

// 获取当前数据源
function getDataSource() {
    return currentDataSource;
}

// 重置为测试数据模式
function resetToTestDataMode() {
    currentDataSource = DATA_SOURCE.TEST;
    console.log('已重置为测试数据模式');
}

// 接收真实传感器数据
function receiveRealSensorData(data) {
    return updateSensorData(data, DATA_SOURCE.REAL);
}

// 接收测试数据
function receiveTestData(data) {
    return updateSensorData(data, DATA_SOURCE.TEST);
}

// 设置位置数据
function setLocation(longitude, latitude) {
    sensorData.location = {
        longitude: longitude,
        latitude: latitude,
        timestamp: Date.now()
    };
    
    // 更新数据后立即通知前端
    notifyFrontend();
    
    return sensorData;
}

// 设置距离数据
function setDistance(value) {
    sensorData.distance = {
        value: value,
        timestamp: Date.now()
    };
    
    // 更新数据后立即通知前端
    notifyFrontend();
    
    return sensorData;
}

// 设置温度数据
function setTemperature(value) {
    sensorData.temperature = {
        value: value,
        timestamp: Date.now()
    };
    
    // 更新数据后立即通知前端
    notifyFrontend();
    
    return sensorData;
}

// 设置湿度数据
function setHumidity(value) {
    sensorData.humidity = {
        value: value,
        timestamp: Date.now()
    };
    
    // 更新数据后立即通知前端
    notifyFrontend();
    
    return sensorData;
}

// 通知前端数据已更新
function notifyFrontend() {
    // 触发自定义事件，通知前端数据已更新
    window.dispatchEvent(new CustomEvent('sensorDataUpdate', {
        detail: sensorData
    }));
    
    // 如果有更新函数，直接调用
    if (window.updateFromTestData) {
        window.updateFromTestData();
    }
    
    if (window.updateSensorDisplay) {
        window.updateSensorDisplay();
    }
    
    // 在控制台输出数据，便于调试
    console.log('传感器数据已更新:', sensorData);
}

// 暴露函数到全局作用域，便于调试和测试
window.dataManager = {
    DATA_SOURCE,
    updateSensorData,
    getSensorData,
    getDataSource,
    resetToTestDataMode,
    receiveRealSensorData,
    receiveTestData,
    setLocation,
    setDistance,
    setTemperature,
    setHumidity,
    notifyFrontend
};
