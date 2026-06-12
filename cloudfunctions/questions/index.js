const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

function normalizeQuestion(item) {
  return {
    ...item,
    createdAt: formatTime(item.createdAt)
  };
}

function formatTime(value) {
  if (!value || typeof value !== 'number') {
    return '刚刚';
  }

  const diff = Date.now() - value;
  if (diff < 3600000) {
    return `${Math.max(1, Math.floor(diff / 60000))} 分钟前`;
  }
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`;
  }
  return `${Math.floor(diff / 86400000)} 天前`;
}

exports.main = async (event) => {
  const action = event.action || 'list';

  if (action === 'detail') {
    const result = await db.collection('questions').doc(event.id).get();
    return {
      ok: true,
      data: normalizeQuestion(result.data)
    };
  }

  const result = await db.collection('questions')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();

  return {
    ok: true,
    data: result.data.map(normalizeQuestion)
  };
};
