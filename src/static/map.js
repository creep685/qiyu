// 地图相关功能
let map = null;
let marker = null;

// 初始化地图
function initMap() {
    // 从页面元素获取经纬度
    const longitude = parseFloat(document.querySelector('.longitude-value').textContent);
    const latitude = parseFloat(document.querySelector('.latitude-value').textContent);

    // 创建地图实例
    map = new AMap.Map('map-container', {
        zoom: 15,
        center: [longitude, latitude],
        viewMode: '2D'
    });

    // 添加标记
    marker = new AMap.Marker({
        position: [longitude, latitude],
        title: '传感器位置'
    });

    // 将标记添加到地图
    map.add(marker);

    // 添加信息窗体
    const info = new AMap.InfoWindow({
        content: `<div class="info-window">
            <h4>传感器位置</h4>
            <p>经度: ${longitude}°E</p>
            <p>纬度: ${latitude}°N</p>
        </div>`,
        offset: new AMap.Pixel(0, -30)
    });

    // 打开信息窗体
    info.open(map, marker.getPosition());

    console.log('地图初始化完成');
}

// 更新地图位置
function updateMapLocation() {
    if (!map) {
        initMap();
        return;
    }

    // 从页面元素获取当前经纬度
    const longitude = parseFloat(document.querySelector('.longitude-value').textContent);
    const latitude = parseFloat(document.querySelector('.latitude-value').textContent);

    // 更新地图中心点
    map.setCenter([longitude, latitude]);

    // 更新标记位置
    if (marker) {
        marker.setPosition([longitude, latitude]);
    } else {
        // 如果标记不存在，创建新标记
        marker = new AMap.Marker({
            position: [longitude, latitude],
            title: '传感器位置'
        });
        map.add(marker);
    }

    // 更新信息窗体内容
    const info = new AMap.InfoWindow({
        content: `<div class="info-window">
            <h4>传感器位置</h4>
            <p>经度: ${longitude}°E</p>
            <p>纬度: ${latitude}°N</p>
        </div>`,
        offset: new AMap.Pixel(0, -30)
    });

    // 打开信息窗体
    info.open(map, marker.getPosition());

    showToast('地图位置已更新');
}

// 打开高德地图定位（改为在网页内显示）
function openAmapLocation() {
    if (map) {
        updateMapLocation();
    } else {
        initMap();
    }
}

// 在页面加载完成后初始化地图
document.addEventListener('DOMContentLoaded', function() {
    // 当地图页面显示时初始化地图
    const viewMapBtn = document.getElementById('view-map-btn');
    if (viewMapBtn) {
        viewMapBtn.addEventListener('click', function() {
            // 延迟初始化地图，确保DOM已完全渲染
            setTimeout(function() {
                initMap();
                // 初始化后立即从测试文件获取数据并更新地图位置
                setTimeout(updateMapFromTestData, 100);
            }, 300);
        });
    }

    // 刷新位置按钮
    const refreshLocationBtn = document.getElementById('refresh-location');
    if (refreshLocationBtn) {
        refreshLocationBtn.addEventListener('click', function() {
            // 从测试文件获取数据并更新地图位置
            updateMapFromTestData();
        });
    }

    // 从测试文件获取数据并更新地图位置
    function updateMapFromTestData() {
        if (map && window.sensorTestData) {
            const data = window.sensorTestData.getSensorData();
            if (data && data.location) {
                // 更新页面元素
                document.querySelector('.longitude-value').textContent = data.location.longitude.toFixed(6);
                document.querySelector('.latitude-value').textContent = data.location.latitude.toFixed(6);
                
                // 延迟更新地图位置，确保页面元素已更新
                setTimeout(updateMapLocation, 100);
            }
        }
    }
    
    // 页面加载完成后立即更新一次地图位置
    setTimeout(updateMapFromTestData, 500);
});
