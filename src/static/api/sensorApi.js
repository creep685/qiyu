// 传感器API接口文件
// 此文件定义了与可穿戴设备通信的API接口

// API基础URL - 在实际部署时需要替换为真实的后端服务器地址
const API_BASE_URL = 'http://localhost:3000/api';

// 传感器数据API对象
const sensorApi = {
    /**
     * 发送传感器数据到服务器
     * @param {Object} data - 传感器数据对象
     * @param {number} data.longitude - 经度
     * @param {number} data.latitude - 纬度
     * @param {number} data.distance - 激光测距值（米）
     * @param {number} data.temperature - 温度值（摄氏度）
     * @param {number} data.humidity - 湿度值（百分比）
     * @returns {Promise} - 返回API调用结果
     */
    async sendSensorData(data) {
        try {
            const response = await fetch(`${API_BASE_URL}/sensor-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    timestamp: Date.now()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('发送传感器数据失败:', error);
            throw error;
        }
    },

    /**
     * 获取最新的传感器数据
     * @returns {Promise} - 返回最新的传感器数据
     */
    async getLatestSensorData() {
        try {
            const response = await fetch(`${API_BASE_URL}/sensor-data/latest`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取传感器数据失败:', error);
            throw error;
        }
    },

    /**
     * 获取历史传感器数据
     * @param {Object} params - 查询参数
     * @param {string} params.sensorType - 传感器类型（location, distance, temperature, humidity）
     * @param {string} params.startTime - 开始时间（ISO格式）
     * @param {string} params.endTime - 结束时间（ISO格式）
     * @returns {Promise} - 返回历史传感器数据
     */
    async getHistoricalSensorData(params) {
        try {
            const queryParams = new URLSearchParams(params);
            const response = await fetch(`${API_BASE_URL}/sensor-data/history?${queryParams}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取历史传感器数据失败:', error);
            throw error;
        }
    },

    /**
     * 设置传感器警报阈值
     * @param {Object} thresholds - 警报阈值对象
     * @param {number} thresholds.minDistance - 最小距离阈值（米）
     * @param {number} thresholds.maxTemperature - 最高温度阈值（摄氏度）
     * @param {number} thresholds.minTemperature - 最低温度阈值（摄氏度）
     * @param {number} thresholds.maxHumidity - 最高湿度阈值（百分比）
     * @param {number} thresholds.minHumidity - 最低湿度阈值（百分比）
     * @returns {Promise} - 返回设置结果
     */
    async setAlertThresholds(thresholds) {
        try {
            const response = await fetch(`${API_BASE_URL}/alert-thresholds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(thresholds)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('设置警报阈值失败:', error);
            throw error;
        }
    },

    /**
     * 获取当前警报阈值
     * @returns {Promise} - 返回当前警报阈值
     */
    async getAlertThresholds() {
        try {
            const response = await fetch(`${API_BASE_URL}/alert-thresholds`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取警报阈值失败:', error);
            throw error;
        }
    },

    /**
     * 获取警报设置
     * @returns {Promise} - 返回警报设置
     */
    async getAlertSettings() {
        try {
            const response = await fetch(`${API_BASE_URL}/alert-settings`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取警报设置失败:', error);
            throw error;
        }
    },

    /**
     * 更新警报设置
     * @param {Object} settings - 警报设置对象
     * @returns {Promise} - 返回更新结果
     */
    async updateAlertSettings(settings) {
        try {
            console.log('发送警报设置请求到:', `${API_BASE_URL}/alert-settings`);
            console.log('发送的警报设置数据:', settings);
            
            const response = await fetch(`${API_BASE_URL}/alert-settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });

            console.log('响应状态:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('服务器响应错误:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const result = await response.json();
            console.log('服务器响应数据:', result);
            return result;
        } catch (error) {
            console.error('更新警报设置失败:', error);
            console.error('错误堆栈:', error.stack);
            throw error;
        }
    }
};

// 暴露API对象到全局作用域，便于调试和测试
window.sensorApi = sensorApi;

// 导出API对象（如果使用模块系统）
// export default sensorApi;
