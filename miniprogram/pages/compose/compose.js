const { callCloud } = require('../../utils/cloud');

Page({
  data: {
    modes: ['回答问题', '提出问题'],
    activeMode: '回答问题',
    topic: '',
    content: '',
    selectedTags: ['具体', '尊重边界'],
    availableTags: [
      { name: '具体', selected: true },
      { name: '自省', selected: false },
      { name: '尊重边界', selected: true },
      { name: '有经历', selected: false },
      { name: '能讨论分歧', selected: false },
      { name: '不煽动对立', selected: false }
    ],
    mediaItems: [
      { type: 'image', label: '补充一张图', enabled: true, hint: '图片必须服务文字，不进入晒图流。' },
      { type: 'voice', label: '留一段语音', enabled: false, hint: '完成一次文字深聊后解锁。' },
      { type: 'video', label: '申请视频深聊', enabled: false, hint: '只在高信任关系和主题房间中开放。' }
    ]
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

  toggleTag(event) {
    const tag = event.currentTarget.dataset.tag;
    const selected = this.data.selectedTags.slice();
    const index = selected.indexOf(tag);

    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(tag);
    }

    this.setData({
      selectedTags: selected,
      availableTags: this.data.availableTags.map((item) => ({
        ...item,
        selected: selected.indexOf(item.name) >= 0
      }))
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
    if (content.length < 80) {
      wx.showToast({
        title: '至少写 80 字，才适合进入 DeepTalk',
        icon: 'none'
      });
      return;
    }

    callCloud('interactions', {
      action: this.data.activeMode === '提出问题' ? 'createQuestion' : 'createAnswer',
      topic: this.data.topic,
      content,
      tags: this.data.selectedTags
    }).then(() => {
      wx.showToast({
        title: '已提交',
        icon: 'success'
      });
      this.setData({
        topic: '',
        content: ''
      });
    });
  }
});
