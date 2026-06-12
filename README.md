# DeepTalk 小程序云开发测试版

这是 DeepTalk 的第一版微信小程序原型，围绕“真诚表达筛选同频者”的核心闭环设计：

- 问题广场：用深度问题替代用户卡片流。
- 回答即名片：先看表达质量，再决定是否深聊。
- 同频邀请：必须写明欣赏的表达和想继续聊的问题。
- 慢信件：低频、长文、重上下文。
- 多媒体边界：文字优先，图片辅助，语音和视频按信任关系逐步解锁。

## 目录结构

```text
miniprogram/
  app.js
  app.json
  app.wxss
  data/mock.js
  pages/home/        问题广场
  pages/question/    问题详情与同频邀请
  pages/compose/     提问和回答
  pages/letter/      慢信件
  utils/config.js    云环境配置
  utils/cloud.js     云函数调用与 mock 回退

cloudfunctions/
  bootstrap/         创建集合并写入种子问题
  questions/         问题列表和详情
  interactions/      创建问题、回答、同频邀请
```

## 本地预览

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择当前仓库。
4. AppID 可以先使用测试号或你自己的小程序 AppID。
5. 未配置云环境时，前端会自动使用 `miniprogram/data/mock.js` 的数据。

## 接入微信云开发

1. 在微信开发者工具中开通云开发环境。
2. 将 [miniprogram/utils/config.js](miniprogram/utils/config.js) 里的 `YOUR_CLOUD_ENV_ID` 替换为真实环境 ID。
3. 右键上传并部署这些云函数：
   - `cloudfunctions/bootstrap`
   - `cloudfunctions/questions`
   - `cloudfunctions/interactions`
4. 在开发者工具的云开发控制台里调用一次 `bootstrap` 云函数。
5. 重新编译小程序，首页会从云数据库读取问题。

## 云数据库集合

`bootstrap` 会尝试创建这些集合：

- `questions`
- `answers`
- `invites`
- `letters`
- `profiles`
- `reports`

当前测试版只实际读写 `questions`、`answers`、`invites`。

## 后续建议

第一轮测试先验证三个问题：

- 用户是否愿意认真回答深度问题。
- 用户是否会因为一段高质量回答发起深聊。
- 慢信件是否比即时聊天更适合这个人群。

进入真实上线前，需要继续补齐：

- 微信内容安全接口。
- 举报、拉黑、限频和人工复核。
- 用户隐私协议与授权弹窗。
- 云数据库权限规则。
- 图片、语音、视频文件上传和审核流程。
# deeptalk
