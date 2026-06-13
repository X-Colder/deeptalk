const { callCloud } = require('../../utils/cloud');

Page({
  data: {
    loading: true,
    profile: null,
    editing: false,
    draft: {
      nickname: '',
      bio: ''
    },
    statusText: {
      active: '正常',
      observe: '观察期',
      muted: '限言',
      banned: '封禁'
    },
    permissionCards: [
      {
        title: '新用户',
        desc: '可提问、可回答；主动深聊邀请每日 3 次。'
      },
      {
        title: '可信表达者',
        desc: '高质量回答稳定通过后，提高邀请额度和精选曝光。'
      },
      {
        title: '观察期',
        desc: '重复敷衍、越界、引流或被多次举报后，限制主动邀请。'
      }
    ]
  },

  onShow() {
    this.loadProfile();
  },

  loadProfile() {
    this.setData({ loading: true });
    callCloud('users', { action: 'stats' })
      .then((res) => {
        const profile = this.normalizeProfile(res.data);
        this.setData({
          loading: false,
          profile,
          draft: {
            nickname: profile.nickname,
            bio: profile.bio
          }
        });

        const app = getApp();
        if (app && app.globalData) {
          app.globalData.profile = profile;
        }
      })
      .catch(() => {
        this.setData({ loading: false });
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  },

  normalizeProfile(profile) {
    const fallbackStats = {
      questions: 0,
      answers: 0,
      invitesSent: 0
    };

    return {
      ...profile,
      avatarInitial: profile.nickname ? profile.nickname.substring(0, 1) : '深',
      statusLabel: this.data.statusText[profile.status] || '正常',
      portraitSummary: profile.portraitSummary || '画像将根据公开问答、深聊反馈和读者评价持续生成。',
      evaluationSource: profile.evaluationSource || '画像来自内容和他人评价，不由用户手动选择。',
      stats: profile.stats || {},
      liveStats: profile.liveStats || profile.stats || fallbackStats
    };
  },

  startEdit() {
    this.setData({ editing: true });
  },

  cancelEdit() {
    this.setData({
      editing: false,
      draft: {
        nickname: this.data.profile.nickname,
        bio: this.data.profile.bio
      }
    });
  },

  onNicknameInput(event) {
    this.setData({
      'draft.nickname': event.detail.value
    });
  },

  onBioInput(event) {
    this.setData({
      'draft.bio': event.detail.value
    });
  },

  saveProfile() {
    const nickname = this.data.draft.nickname.trim();
    const bio = this.data.draft.bio.trim();

    if (nickname.length < 2) {
      wx.showToast({
        title: '昵称至少 2 个字',
        icon: 'none'
      });
      return;
    }

    callCloud('users', {
      action: 'updateProfile',
      profile: {
        nickname,
        bio
      }
    }).then((res) => {
      this.setData({
        profile: this.normalizeProfile(res.data),
        editing: false
      });
      wx.showToast({
        title: '已保存',
        icon: 'success'
      });
    });
  }
});
