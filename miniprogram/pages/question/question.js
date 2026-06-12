const { callCloud } = require('../../utils/cloud');

Page({
  data: {
    question: null,
    loading: true,
    inviteReason: '',
    mediaPolicy: [
      { name: '文字', desc: '默认开放，用来表达判断、经历和价值观。', active: true },
      { name: '图片', desc: '仅作补充证据，不做照片社交。', active: true },
      { name: '语音', desc: '完成一次文字深聊后解锁。', active: false },
      { name: '视频', desc: '高信任关系和主题房间再开放。', active: false }
    ]
  },

  onLoad(options) {
    this.loadQuestion(options.id);
  },

  loadQuestion(id) {
    callCloud('questions', { action: 'detail', id })
      .then((res) => {
        const question = res.data;
        question.avatarInitial = question.featuredAnswer.userName.substring(0, 1);
        this.setData({
          question,
          loading: false
        });
      })
      .catch(() => {
        this.setData({ loading: false });
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  },

  onReasonInput(event) {
    this.setData({
      inviteReason: event.detail.value
    });
  },

  sendInvite() {
    const reason = this.data.inviteReason.trim();
    if (reason.length < 20) {
      wx.showToast({
        title: '请写清楚你想继续聊什么',
        icon: 'none'
      });
      return;
    }

    callCloud('interactions', {
      action: 'createInvite',
      questionId: this.data.question._id,
      reason
    }).then(() => {
      wx.showToast({
        title: '已发送邀请',
        icon: 'success'
      });
      this.setData({ inviteReason: '' });
    });
  },

  writeAnswer() {
    wx.switchTab({
      url: '/pages/compose/compose'
    });
  }
});
