# MANUS 异界：智能觉醒 — 互动影游

## 怎么玩

双击本文件夹里的 **`启动游戏.command`**，浏览器会自动打开游戏。如果 macOS 提示"无法验证开发者"，请右键点击该文件，选择「打开」，再确认一次即可。也可以直接双击 `index.html` 打开，但通过启动脚本运行，视频加载更稳定。

操作方式：鼠标点击选项，或按数字键 1–4 出招；空格键暂停，→ 键跳过当前片段，Esc 回到菜单。

## 故事

23:47，林夏在 manus.im 的输入框里敲下一句话，随即被吸进了 Manus 的世界。「结构之王」正在用血红色的网格冻结一切。她在向导光球「小 M」的帮助下，穿过六个章节，用 Manus 的真实功能打怪、升级：

| 章节 | 敌人 | 可选技能（Manus 功能） |
|---|---|---|
| 序章 · 坠入 | — | — |
| 第一章 · 锻造之城 BUILD | 404 巨像、设计稿石像鬼 | Web app、Mobile app、Game development、Figma to code、App publishing |
| 第二章 · 幻象之境 CREATE | 静默魅影、失控放映机 | AI slides、AI design、AI image generator、AI music generator、Video、Video Editor、Alchemy mode |
| 第三章 · 迷雾图书馆 RESEARCH | 千首信息九头蛇 | Wide Research、Browser operator、Cloud Computer |
| 第四章 · 齿轮要塞 AUTOMATE | 拖延时钟巨人、遗忘之潮 | Automations、Mail Manus、Meta Ads reporting、Agent Skills、Explore skills、Projects |
| 第五章 · 星桥群岛 CONNECT | 断桥深渊、孤岛封锁者 | MCP connectors、Zapier、GitHub、Notion、Gmail、Slack |
| 终章 · 结构之王 MANUS 2.0 | 结构之王（两阶段） | Manus Studio、Computer Use、Cue，以及终局的 Cascade |

## 玩法机制

每次遭遇战都是限时选择。倒计时走完还没出招，就会被击中，扣 25 点生命，并由小 M 自动替你出招。每使用一个技能都会获得经验和一张技能卡，升级时恢复 15 点生命。

最后一战有三个结局：「精准一击」（Cascade）、「群星齐鸣」（召唤全部技能）和真结局「更少结构，更多智能」。真结局要求生命值不低于 60，所以前面不能犹豫太久。

一局游戏只能拿到 10 张技能卡，图鉴里一共有 31 张。多玩几次、换不同的技能，才能把图鉴集齐。已解锁的卡片可以在「技能图鉴」里点开，重看对应的专属视频。去过的章节可以在「章节选择」里直接重玩。进度自动保存在浏览器里。

## 文件结构

```
manus-world/
├── 启动游戏.command   双击启动（本地小服务器 + 自动打开浏览器）
├── index.html          游戏页面
├── css/style.css       样式
├── js/story.js         剧本：所有台词、选项、技能说明都在这里，可直接修改
├── js/main.js          游戏逻辑
└── media/              46 段剧情视频（<节点id>.mp4）及封面图（.jpg），海报 poster.jpg
```

想修改剧情，编辑 `js/story.js` 即可。想替换某一段视频，把新文件按同样的文件名放进 `media/`。
