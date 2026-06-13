# DeepTalk 小程序云开发测试版

这是 DeepTalk 的第一版微信小程序原型，围绕“真诚表达筛选同频者”的核心闭环设计：

- 问题广场：用深度问题替代用户卡片流。
- 问题归属：每个问题关联提问者，回答前可以看到是谁提出的问题。
- 公开 / 私密：公开问题进入广场；私密问题用于邀请后的深度沟通。
- 回答即名片：先看表达质量和他人评价，再决定是否深聊。
- 同频邀请：必须写明欣赏的表达和想继续聊的问题。
- 慢信件：低频、长文、重上下文。
- 表达档案：基于微信 OpenID 自动创建匿名用户 profile，记录信誉、边界、标签和邀请额度。
- 他人评价：表达质量标签不由用户手动选择，而由读者评价和内容分析生成。
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
  pages/profile/     我的表达档案
  utils/config.js    云环境配置
  utils/cloud.js     云函数调用与 mock 回退

cloudfunctions/
  bootstrap/         创建集合并写入种子问题
  users/             用户 profile 初始化、读取、更新和统计
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

当前测试云环境：

```text
cloud1-d7g6ppwwhbce71043
```

1. 在微信开发者工具中开通云开发环境。
2. 确认 [miniprogram/utils/config.js](miniprogram/utils/config.js) 里的 `envId` 是当前测试云环境。
3. 右键上传并部署这些云函数，或直接运行 `npm run deploy:cloud`：
   - `cloudfunctions/bootstrap`
   - `cloudfunctions/users`
   - `cloudfunctions/questions`
   - `cloudfunctions/interactions`
4. 在开发者工具的云开发控制台里调用一次 `bootstrap` 云函数。
5. 重新编译小程序，首页会从云数据库读取问题。

## 自动化命令

```bash
npm run check
npm run deploy:cloud
npm run test:miniprogram
npm run verify
```

- `check`：检查小程序和云函数 JS 语法、JSON 配置。
- `deploy:cloud`：部署 `bootstrap`、`questions`、`interactions`、`users` 到当前云环境。
- `test:miniprogram`：使用 `miniprogram-automator` 控制微信开发者工具模拟器，执行首页、详情页、私密提问、用户档案冒烟测试。
- `verify`：按顺序执行检查、部署和冒烟测试。

自动化测试依赖微信开发者工具已登录，并开启自动化能力。若提示需要重新登录，先运行：

```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli login --port 24139 --lang zh
```

扫码登录后再运行：

```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli auto --project "$PWD" --auto-port 9421 --trust-project --lang zh
npm run test:miniprogram
```

## 云数据库集合

`bootstrap` 会尝试创建这些集合：

- `questions`
- `answers`
- `invites`
- `letters`
- `profiles`
- `reports`
- `blocks`
- `evaluations`

当前测试版实际读写 `profiles`、`questions`、`answers`、`invites`、`evaluations`。

## 用户体系 MVP

小程序启动后会尝试调用 `users` 云函数自动创建当前微信用户的匿名表达档案。默认字段包括：

- `nickname`：默认生成“安静的表达者 XXXX”。
- `bio`：表达档案简介。
- `valuesTags`：价值观标签。
- `communicationTags`：沟通特质。
- `portraitSummary`：根据问答内容和反馈生成的画像摘要。
- `evaluationSource`：画像来源说明，默认不允许用户手动选择标签。
- `boundaries`：沟通边界。
- `trustScore`：沟通信誉，初始值 60。
- `inviteQuota`：今日主动深聊邀请额度，初始值 3。
- `inviteQuotaDate`：邀请额度日期，跨天访问会自动恢复为 3。
- `status`：`active`、`observe`、`muted`、`banned`。
- `stats`：提问、回答、邀请、举报等统计。

互动云函数会在创建问题、回答、同频邀请时自动关联 profile。发送同频邀请会扣减 `inviteQuota`。

问题和回答模型遵循：

- `authorSnapshot`：记录发布当时的作者昵称、信誉和画像摘要。
- `visibility`：`public` 进入问题广场，`private` 用于私密深聊。
- `communityTags`：由读者评价和内容分析产生，不由作者自选。
- `evaluations`：记录读者对回答的标签评价。

## 后续建议

第一轮测试先验证三个问题：

- 用户是否愿意认真回答深度问题。
- 用户是否会因为一段高质量回答发起深聊。
- 慢信件是否比即时聊天更适合这个人群。
- 表达档案和邀请额度是否能筛掉低质量搭讪。

进入真实上线前，需要继续补齐：

- 微信内容安全接口。
- 举报、拉黑、限频和人工复核。
- 用户隐私协议与授权弹窗。
- 云数据库权限规则。
- 图片、语音、视频文件上传和审核流程。
# deeptalk
