const mock = require('../../data/mock');

Page({
  data: {
    letters: mock.letters,
    draft: '',
    activeLetter: mock.letters[0]
  },

  selectLetter(event) {
    const id = event.currentTarget.dataset.id;
    this.setData({
      activeLetter: this.data.letters.find((item) => item._id === id)
    });
  },

  onDraftInput(event) {
    this.setData({
      draft: event.detail.value
    });
  },

  sendLetter() {
    if (this.data.draft.trim().length < 100) {
      wx.showToast({
        title: '慢信件至少 100 字',
        icon: 'none'
      });
      return;
    }

    wx.showToast({
      title: '已寄出',
      icon: 'success'
    });
    this.setData({ draft: '' });
  }
});
