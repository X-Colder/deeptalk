const { cloudConfig } = require('./utils/config');

App({
  globalData: {
    cloudReady: false,
    useMock: true
  },

  onLaunch() {
    if (!wx.cloud || !cloudConfig.envId || cloudConfig.envId === 'YOUR_CLOUD_ENV_ID') {
      this.globalData.useMock = true;
      return;
    }

    wx.cloud.init({
      env: cloudConfig.envId,
      traceUser: true
    });

    this.globalData.cloudReady = true;
    this.globalData.useMock = false;
  }
});
