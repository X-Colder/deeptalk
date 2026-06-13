const { callCloud } = require('../../utils/cloud');

Page({
  data: {
    question: null,
    loading: true,
    inviteReason: '',
    inviteReasonLength: 0,
    minInviteReasonLength: 8,
    evaluationTags: [
      { name: '具体', selected: false },
      { name: '真诚', selected: false },
      { name: '尊重边界', selected: false },
      { name: '有洞察', selected: false }
    ],
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
        question.authorDisplay = question.authorName || (question.authorSnapshot && question.authorSnapshot.nickname) || '匿名提问者';
        question.authorPortrait = question.authorSnapshot && question.authorSnapshot.portraitSummary
          ? question.authorSnapshot.portraitSummary
          : '画像将根据持续提问、回答和他人评价生成。';
        question.visibilityLabel = question.visibilityLabel || (question.visibility === 'private' ? '私密深聊' : '公开问答');
        question.communityTags = question.communityTags || question.qualityTags || [];
        question.featuredAnswer.communityTags = question.featuredAnswer.communityTags || [];
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
    const value = event.detail.value || '';
    this.setData({
      inviteReason: value,
      inviteReasonLength: value.trim().length
    });
  },

  sendInvite() {
    const reason = this.data.inviteReason.trim();
    if (reason.length < this.data.minInviteReasonLength) {
      wx.showToast({
        title: `至少写 ${this.data.minInviteReasonLength} 个字`,
        icon: 'none'
      });
      return;
    }

    callCloud('interactions', {
      action: 'createInvite',
      questionId: this.data.question._id,
      targetProfileId: this.data.question.profileId || (this.data.question.authorSnapshot && this.data.question.authorSnapshot.profileId),
      reason
    }).then((res) => {
      if (!res.ok) {
        wx.showToast({
          title: res.message || '发送失败',
          icon: 'none'
        });
        return;
      }

      wx.showToast({
        title: '已发送邀请',
        icon: 'success'
      });
      this.setData({
        inviteReason: '',
        inviteReasonLength: 0
      });
    });
  },

  writeAnswer() {
    wx.setStorageSync('pendingAnswerQuestion', {
      questionId: this.data.question._id,
      title: this.data.question.title,
      authorName: this.data.question.authorDisplay,
      visibility: this.data.question.visibility
    });

    wx.switchTab({
      url: '/pages/compose/compose'
    });
  },

  toggleEvaluation(event) {
    const name = event.currentTarget.dataset.name;
    this.setData({
      evaluationTags: this.data.evaluationTags.map((item) => ({
        ...item,
        selected: item.name === name ? !item.selected : item.selected
      }))
    });
  },

  submitEvaluation() {
    const tags = this.data.evaluationTags
      .filter((item) => item.selected)
      .map((item) => item.name);

    if (!tags.length) {
      wx.showToast({
        title: '请选择一个评价',
        icon: 'none'
      });
      return;
    }

    callCloud('interactions', {
      action: 'createEvaluation',
      questionId: this.data.question._id,
      answerId: this.data.question.featuredAnswer.answerId,
      targetName: this.data.question.featuredAnswer.userName,
      tags
    }).then((res) => {
      if (!res.ok) {
        wx.showToast({
          title: res.message || '评价失败',
          icon: 'none'
        });
        return;
      }

      wx.showToast({
        title: '评价已记录',
        icon: 'success'
      });
    });
  }
});
