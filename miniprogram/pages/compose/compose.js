const { callCloud } = require('../../utils/cloud');

Page({
  data: {
    modes: ['提出问题', '回答问题'],
    activeMode: '提出问题',
    topic: '',
    content: '',
    selectedQuestion: null,
    visibility: 'public',
    visibilityOptions: [
      {
        key: 'public',
        name: '公开问答',
        desc: '进入问题广场，其他用户可以公开回答。'
      },
      {
        key: 'private',
        name: '私密深聊',
        desc: '不进入公开广场，仅用于被邀请后的深度沟通。'
      }
    ],
    mediaItems: [
      { type: 'image', label: '补充一张图', enabled: true, hint: '图片必须服务文字，不进入晒图流。' },
      { type: 'voice', label: '留一段语音', enabled: false, hint: '完成一次文字深聊后解锁。' },
      { type: 'video', label: '申请视频深聊', enabled: false, hint: '只在高信任关系和主题房间中开放。' }
    ]
  },

  onShow() {
    const pendingQuestion = wx.getStorageSync('pendingAnswerQuestion');
    if (pendingQuestion && pendingQuestion.questionId) {
      this.setData({
        activeMode: '回答问题',
        selectedQuestion: pendingQuestion,
        topic: pendingQuestion.title
      });
    }
  },

  switchMode(event) {
    this.setData({
      activeMode: event.currentTarget.dataset.mode
    });
  },

  onTopicInput(event) {
    this.setData({ topic: event.detail.value });
  },

  onContentInput(event) {
    this.setData({ content: event.detail.value });
  },

  selectVisibility(event) {
    this.setData({
      visibility: event.currentTarget.dataset.visibility
    });
  },

  chooseImage(event) {
    if (!event.currentTarget.dataset.enabled) {
      wx.showToast({
        title: '该媒介暂未解锁',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: () => {
        wx.showToast({
          title: '已选择图片',
          icon: 'success'
        });
      }
    });
  },

  submit() {
    const content = this.data.content.trim();
    const topic = this.data.topic.trim();

    if (this.data.activeMode === '提出问题' && topic.length < 6) {
      wx.showToast({
        title: '请写清楚问题',
        icon: 'none'
      });
      return;
    }

    if (this.data.activeMode === '回答问题' && !this.data.selectedQuestion) {
      wx.showToast({
        title: '请先从问题详情选择提问者',
        icon: 'none'
      });
      return;
    }

    if (content.length < 80) {
      wx.showToast({
        title: '至少写 80 字，才适合进入 DeepTalk',
        icon: 'none'
      });
      return;
    }

    callCloud('interactions', {
      action: this.data.activeMode === '提出问题' ? 'createQuestion' : 'createAnswer',
      topic,
      content,
      visibility: this.data.visibility,
      questionId: this.data.selectedQuestion && this.data.selectedQuestion.questionId,
      questionAuthorName: this.data.selectedQuestion && this.data.selectedQuestion.authorName
    }).then((res) => {
      if (!res.ok) {
        wx.showToast({
          title: res.message || '提交失败',
          icon: 'none'
        });
        return;
      }

      wx.showToast({
        title: '已提交',
        icon: 'success'
      });
      this.setData({
        topic: '',
        content: '',
        selectedQuestion: null
      });
      wx.removeStorageSync('pendingAnswerQuestion');
    });
  }
});
