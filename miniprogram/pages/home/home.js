const { callCloud } = require('../../utils/cloud');

Page({
  data: {
    loading: true,
    moodOptions: ['想被认真理解', '关系边界', '自我成长', '价值观讨论'],
    activeMood: '想被认真理解',
    questions: []
  },

  onLoad() {
    this.loadQuestions();
  },

  onPullDownRefresh() {
    this.loadQuestions().finally(() => wx.stopPullDownRefresh());
  },

  loadQuestions() {
    this.setData({ loading: true });
    return callCloud('questions', { action: 'list' })
      .then((res) => {
        this.setData({
          questions: (res.data || []).map((item) => ({
            ...item,
            authorDisplay: item.authorName || (item.authorSnapshot && item.authorSnapshot.nickname) || '匿名提问者',
            visibilityLabel: item.visibilityLabel || (item.visibility === 'private' ? '私密深聊' : '公开问答'),
            communityTags: item.communityTags || item.qualityTags || []
          })),
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

  selectMood(event) {
    this.setData({
      activeMood: event.currentTarget.dataset.mood
    });
  },

  openQuestion(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/question/question?id=${id}`
    });
  },

  writeQuestion() {
    wx.switchTab({
      url: '/pages/compose/compose'
    });
  }
});
