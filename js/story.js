/*
 * 《MANUS 异界：智能觉醒》剧情数据
 * 节点类型：
 *   scene     —— 剧情过场（视频 + 字幕 → next）
 *   encounter —— 遭遇战（视频 + 字幕 → 限时选择 Manus 技能）
 *   skill     —— 技能发动（每个 Manus 功能一段专属视频，获得经验和技能卡）
 *   ending    —— 结局
 * 视频文件统一放在 media/<节点 id>.mp4
 */
window.STORY = {
  title: "MANUS 异界：智能觉醒",
  start: "p01",
  maxHp: 100,
  timeoutDamage: 25,

  chapters: {
    p:  "序章 · 坠入",
    c1: "第一章 · 锻造之城 BUILD",
    c2: "第二章 · 幻象之境 CREATE",
    c3: "第三章 · 迷雾图书馆 RESEARCH",
    c4: "第四章 · 齿轮要塞 AUTOMATE",
    c5: "第五章 · 星桥群岛 CONNECT",
    c6: "终章 · 结构之王 MANUS 2.0",
    end: "结局"
  },

  nodes: {
    /* ================= 序章 ================= */
    p01: {
      type: "scene", chapter: "p",
      lines: [
        "23:47。林夏在 manus.im 的输入框里敲下：帮我把这个烂摊子收拾好。",
        "屏幕突然炸开一道白光，台灯熄灭，纸张狂飞。",
        "一股无法抗拒的力量，把她拽进了屏幕里。"
      ],
      next: "p02"
    },
    p02: {
      type: "scene", chapter: "p",
      lines: [
        "她醒来时，脚下是漂浮的白色岛屿。一团小小的光球飘到她肩旁。",
        "「我是小 M。What can I do for you？」光球眨了眨眼，「不过现在，是这个世界需要你。」",
        "天边，血红色的网格正在吞没一切——那是「结构之王」。",
        "「每使用一次 Manus 的能力，你就会变强。走吧，先去锻造之城！」"
      ],
      next: "c1e1"
    },

    /* ================= 第一章 · 锻造之城 BUILD ================= */
    c1e1: {
      type: "encounter", chapter: "c1",
      enemy: { name: "404 巨像", hp: 3 },
      lines: [
        "锻造之城正在崩塌。每一栋楼倒下，都只剩一行字：404 Not Found。",
        "一尊由断链和报错堆成的巨像，正朝林夏举起拳头！",
        "小 M 大喊：「快！告诉我你要造什么！」"
      ],
      choice: {
        prompt: "巨像的拳头砸下来了——你要用什么挡住它？",
        timeout: 10,
        options: [
          { label: "Web app", sub: "瞬间搭起一座全栈网站要塞", next: "f_webapp" },
          { label: "Mobile app", sub: "召唤 iOS 与 Android 双生光刃", next: "f_mobile" },
          { label: "Game development", sub: "造一个关卡，把巨像困进去", next: "f_game" }
        ]
      }
    },
    f_webapp: {
      type: "skill", chapter: "c1", next: "c1e2", xp: 120,
      skill: { name: "Web app", tag: "BUILD", desc: "用一句话构建带 AI 能力的全栈网站：前端、后端、数据库、登录一次到位。" },
      lines: [
        "「Build website！」林夏一声令下，地面裂开，一座网站要塞拔地而起。",
        "前端是城墙，后端是地基，数据库和登录系统层层合拢。",
        "巨像的拳头砸在城墙上，碎成了满地的 404。"
      ]
    },
    f_mobile: {
      type: "skill", chapter: "c1", next: "c1e2", xp: 120,
      skill: { name: "Mobile app", tag: "BUILD", desc: "构建原生 iOS 和 Android 应用，一份需求，两个平台。" },
      lines: [
        "林夏举起手机，屏幕裂成两道光刃：一道写着 iOS，一道写着 Android。",
        "她双刃交叉，冲进巨像的胸口。",
        "一份需求，两个平台——巨像被从中劈开。"
      ]
    },
    f_game: {
      type: "skill", chapter: "c1", next: "c1e2", xp: 130,
      skill: { name: "Game development", tag: "BUILD", desc: "用视频、图像和代码模型一起做出真正想要的游戏，还能一键开启多人联机。" },
      lines: [
        "「Create games！」一整个可玩的关卡在巨像脚下展开。",
        "平台、陷阱、Boss 战——巨像一步踏进去，就再也走不出来。",
        "小 M 笑出了声：「它卡在第一关了！」"
      ]
    },

    c1e2: {
      type: "encounter", chapter: "c1",
      enemy: { name: "设计稿石像鬼", hp: 2 },
      lines: [
        "城门上，一排排设计稿被冻成了石头，化作石像鬼睁开了眼睛。",
        "它们尖叫着：「我们永远只是图！永远不会变成产品！」",
        "石像鬼群扑了下来——"
      ],
      choice: {
        prompt: "石像鬼俯冲而下！你的选择是？",
        timeout: 10,
        options: [
          { label: "Figma to code", sub: "把设计稿直接变成能运行的网页", next: "f_figma" },
          { label: "App publishing", sub: "把测试版发到每一台真机上", next: "f_publish" }
        ]
      }
    },
    f_figma: {
      type: "skill", chapter: "c1", next: "c2e1", xp: 110,
      skill: { name: "Figma to code", tag: "BUILD", desc: "把 Figma 设计稿转换成可运行的网页应用。" },
      lines: [
        "林夏伸手按住一只石像鬼。石头外壳下，涌出一行行代码。",
        "图层变成组件，画板变成页面——石像鬼一只只活了过来，变成了真正的网站。",
        "「谢谢你，」它们说，「我们终于不只是图了。」"
      ]
    },
    f_publish: {
      type: "skill", chapter: "c1", next: "c2e1", xp: 110,
      skill: { name: "App publishing", tag: "BUILD", desc: "把应用测试版直接分享到真实手机上。" },
      lines: [
        "林夏按下发布。无数道光束射向天空，落进成千上万台手机里。",
        "每一台真机亮起，就有一只石像鬼碎裂。",
        "城门打开了。第一章，通关。"
      ]
    },

    /* ================= 第二章 · 幻象之境 CREATE ================= */
    c2e1: {
      type: "encounter", chapter: "c2",
      enemy: { name: "静默魅影", hp: 4 },
      lines: [
        "幻象之境本该五彩斑斓。现在，颜色和声音正被一点点抽干。",
        "一个没有脸的灰色魅影飘过，所到之处，只剩死寂。",
        "它转向林夏——她的手指开始变灰了！"
      ],
      choice: {
        prompt: "你正在失去颜色！用什么夺回来？",
        timeout: 10,
        options: [
          { label: "AI slides", sub: "用 Nano Banana Pro 铺开光之幻灯片", next: "f_slides" },
          { label: "AI design", sub: "从灵感到成品，重绘整个世界", next: "f_design" },
          { label: "AI image generator", sub: "凭空画出一切", next: "f_image" },
          { label: "AI music generator", sub: "用旋律击碎沉默", next: "f_music" }
        ]
      }
    },
    f_slides: {
      type: "skill", chapter: "c2", next: "c2e2", xp: 110,
      skill: { name: "AI slides", tag: "CREATE", desc: "用 Nano Banana Pro 生成高质量幻灯片。" },
      lines: [
        "「Create slides！」十二张发光的幻灯片在她身边展开，像一面面盾牌。",
        "图表、标题、配图一页页亮起，把魅影困在中间。",
        "最后一页写着：结论——你输了。"
      ]
    },
    f_design: {
      type: "skill", chapter: "c2", next: "c2e2", xp: 120,
      skill: { name: "AI design", tag: "CREATE", desc: "自动完成从灵感到交付的整个设计流程。" },
      lines: [
        "「Design！」林夏挥手，空中出现了调色盘、网格和字体。",
        "从草图到成稿，整个幻象之境被一笔一笔重新上色。",
        "魅影在鲜艳的色彩里尖叫着融化。"
      ]
    },
    f_image: {
      type: "skill", chapter: "c2", next: "c2e2", xp: 110,
      skill: { name: "AI image generator", tag: "CREATE", desc: "根据文字描述生成任何图像。" },
      lines: [
        "林夏闭上眼睛，描述了一头光做的巨鲸。",
        "下一秒，巨鲸从虚空中游出，一口吞下了魅影。",
        "「描述得越具体，」小 M 说，「它就越真实。」"
      ]
    },
    f_music: {
      type: "skill", chapter: "c2", next: "c2e2", xp: 110,
      skill: { name: "AI music generator", tag: "CREATE", desc: "用一句话生成完整的音乐。" },
      lines: [
        "「来一首能把沉默撕碎的歌！」",
        "鼓点炸响，弦乐升起，声波一圈圈扩散。",
        "魅影在音浪中碎成了五颜六色的音符。"
      ]
    },

    c2e2: {
      type: "encounter", chapter: "c2",
      enemy: { name: "失控放映机", hp: 3 },
      lines: [
        "幻象之境的中心，一台巨大的放映机失控了。",
        "它疯狂播放着破碎的画面，胶片像触手一样四处缠绕。",
        "一条胶片缠住了小 M！"
      ],
      choice: {
        prompt: "小 M 被胶片缠住了！怎么救它？",
        timeout: 9,
        options: [
          { label: "Video", sub: "把一个想法变成一部电影", next: "f_video" },
          { label: "Video Editor", sub: "掌控时间线，每一刀由你剪", next: "f_editor" },
          { label: "Alchemy mode", sub: "让 AI 成为你的创意总监", next: "f_alchemy" }
        ]
      }
    },
    f_video: {
      type: "skill", chapter: "c2", next: "c3e1", xp: 130,
      skill: { name: "Video", tag: "CREATE", desc: "把一个想法变成一部完整的影片。" },
      lines: [
        "「我要一部电影：小 M 挣脱束缚，放映机重获光明。」",
        "分镜、画面、配乐瞬间生成，投射在放映机自己的银幕上。",
        "放映机看着这部电影，停下了。它从没放过这么好的片子。"
      ]
    },
    f_editor: {
      type: "skill", chapter: "c2", next: "c3e1", xp: 130,
      skill: { name: "Video Editor", tag: "CREATE", desc: "专业时间线剪辑：片段、图片、字幕、音乐都能单独替换。" },
      lines: [
        "林夏抓住一条胶片，它在她手中展开成一条时间线。",
        "她剪掉缠住小 M 的那一段，换上自己的镜头，再换一首更燃的歌。",
        "导出。放映机的胶片全部松开了。"
      ]
    },
    f_alchemy: {
      type: "skill", chapter: "c2", next: "c3e1", xp: 140,
      skill: { name: "Alchemy mode", tag: "CREATE", desc: "Video Editor 的炼金模式：AI 担任创意总监，画面和节奏质量大幅提升。" },
      lines: [
        "「Alchemy mode——启动。」林夏的双眼泛起金光。",
        "视频生成与代码生成交织成金色的炼金阵，每一帧都被重新锻造。",
        "放映机化作一束纯粹的光，小 M 重获自由。第二章，通关。"
      ]
    },

    /* ================= 第三章 · 迷雾图书馆 RESEARCH ================= */
    c3e1: {
      type: "encounter", chapter: "c3",
      enemy: { name: "千首信息九头蛇", hp: 5 },
      lines: [
        "迷雾图书馆里，书架高得看不到顶，浓雾吞没了每一条通道。",
        "雾中，一条巨蛇抬起了一千个头。每个头都在尖叫一条假消息。",
        "砍掉一个头，就会长出两个——林夏被逼到了墙角！"
      ],
      choice: {
        prompt: "一千个头同时扑来！你要怎么应对？",
        timeout: 9,
        options: [
          { label: "Wide Research", sub: "派出上百个分身，同时调查每一个头", next: "f_wide" },
          { label: "Browser operator", sub: "借出一个浏览器标签页，让 Manus 替你冲进去", next: "f_browser" },
          { label: "Cloud Computer", sub: "唤醒一台永不关机的云端电脑", next: "f_cloud" }
        ]
      }
    },
    f_wide: {
      type: "skill", chapter: "c3", next: "c4e1", xp: 150,
      skill: { name: "Wide Research", tag: "RESEARCH", desc: "大规模并行研究：同时调查成百上千个对象。" },
      lines: [
        "林夏双手展开，身后分出上百个光之分身。",
        "每个分身锁定一个蛇头，同时查证、同时比对、同时反击。",
        "一千个谎言在同一秒被拆穿。九头蛇轰然倒下。"
      ]
    },
    f_browser: {
      type: "skill", chapter: "c3", next: "c4e1", xp: 140,
      skill: { name: "Browser operator", tag: "RESEARCH", desc: "把浏览器的一个标签页借给 Manus，让它直接在网页上操作。" },
      lines: [
        "林夏打开一个浏览器标签页，把它交给了小 M。",
        "小 M 化作光标，在迷雾中点击、滚动、登录、填表——快得只剩残影。",
        "它找到了九头蛇真正的心脏，点下了「删除」。"
      ]
    },
    f_cloud: {
      type: "skill", chapter: "c3", next: "c4e1", xp: 140,
      skill: { name: "Cloud Computer", tag: "RESEARCH", desc: "专属云端电脑：让智能体和机器人 24 小时不间断运行。" },
      lines: [
        "图书馆的穹顶裂开，一台巨大的云端电脑从天而降。",
        "它永不关机、永不疲倦，日夜不停地扫描每一本书、每一个头。",
        "迷雾散尽。九头蛇再也找不到藏身之处。第三章，通关。"
      ]
    },

    /* ================= 第四章 · 齿轮要塞 AUTOMATE ================= */
    c4e1: {
      type: "encounter", chapter: "c4",
      enemy: { name: "拖延时钟巨人", hp: 4 },
      lines: [
        "齿轮要塞里，所有的齿轮都停了。时间被一个巨人攥在手里。",
        "「明天再做吧……」它每说一次，就有一个人被冻在原地。",
        "天上，垃圾邮件蜂群嗡嗡压下来，遮住了所有的光！"
      ],
      choice: {
        prompt: "时钟巨人和蜂群两面夹击！先破哪一个？",
        timeout: 9,
        options: [
          { label: "Automations", sub: "设定触发器，让工作自己开始", next: "f_auto" },
          { label: "Mail Manus", sub: "把每一封邮件变成行动", next: "f_mail" },
          { label: "Meta Ads reporting", sub: "把投放数据变成下一步行动", next: "f_ads" }
        ]
      }
    },
    f_auto: {
      type: "skill", chapter: "c4", next: "c4e2", xp: 140,
      skill: { name: "Automations", tag: "AUTOMATE", desc: "定时任务与事件触发工作流：新邮件、日程、消息都能自动启动任务。" },
      lines: [
        "「不用等明天。」林夏在空中画下一个触发器：当巨人开口时——立刻执行。",
        "要塞里成千上万个齿轮同时转动，任务一个接一个自动启动。",
        "巨人的「明天」还没说完，今天的事已经全部做完了。"
      ]
    },
    f_mail: {
      type: "skill", chapter: "c4", next: "c4e2", xp: 130,
      skill: { name: "Mail Manus", tag: "AUTOMATE", desc: "把任何一封邮件转发给 Manus，它就会把邮件变成行动。" },
      lines: [
        "林夏张开一个光之信箱，把整个蜂群吸了进去。",
        "每一封垃圾邮件都被拆开、分类、回复、转成任务。",
        "蜂群消失了，信箱里只剩下一张整整齐齐的待办清单。"
      ]
    },
    f_ads: {
      type: "skill", chapter: "c4", next: "c4e2", xp: 130,
      skill: { name: "Meta Ads reporting", tag: "AUTOMATE", desc: "读取 Meta 广告投放表现，直接给出下一步建议。" },
      lines: [
        "林夏调出一面数据墙：点击率、转化率、花费，一目了然。",
        "「蜂群的 ROI 是负数，」小 M 说，「建议：立即停投。」",
        "她按下停止键，蜂群在半空中一只只熄灭。"
      ]
    },

    c4e2: {
      type: "encounter", chapter: "c4",
      enemy: { name: "遗忘之潮", hp: 3 },
      lines: [
        "要塞深处，黑色的潮水涌了上来。它叫「遗忘」。",
        "被它淹过的地方，所有的经验、文档、做法都会消失。",
        "潮水漫过了林夏的脚踝——她开始想不起自己是谁了！"
      ],
      choice: {
        prompt: "记忆正在被冲走！你要抓住什么？",
        timeout: 9,
        options: [
          { label: "Agent Skills", sub: "把你的专长封装成技能，永不遗忘", next: "f_skills" },
          { label: "Explore skills", sub: "召唤社区里现成的技能", next: "f_explore" },
          { label: "Projects", sub: "把项目知识收进同一个地方", next: "f_projects" }
        ]
      }
    },
    f_skills: {
      type: "skill", chapter: "c4", next: "c5e1", xp: 140,
      skill: { name: "Agent Skills", tag: "AUTOMATE", desc: "把你的专业流程封装成技能，让 Manus 每次都按你的方式做。" },
      lines: [
        "林夏把她最拿手的一套做法，刻进了一枚发光的技能水晶。",
        "水晶一旦成形，潮水就再也冲不走它。",
        "她把水晶举过头顶，遗忘之潮在光里退去。"
      ]
    },
    f_explore: {
      type: "skill", chapter: "c4", next: "c5e1", xp: 130,
      skill: { name: "Explore skills", tag: "AUTOMATE", desc: "使用 Manus 官方和社区提供的现成技能。" },
      lines: [
        "林夏推开一扇门，门后是一座巨大的技能市集。",
        "来自 Manus 和社区的技能卡像流星一样飞向她。",
        "成百上千张卡片排成堤坝，硬生生挡住了遗忘之潮。"
      ]
    },
    f_projects: {
      type: "skill", chapter: "c4", next: "c5e1", xp: 130,
      skill: { name: "Projects", tag: "AUTOMATE", desc: "把项目的知识、文件和指令放在一起，每个任务都能用上。" },
      lines: [
        "林夏打开一个「项目」，所有散落的文档、指令、记忆都飞了回来。",
        "它们整整齐齐地收进同一个空间，像一座方舟。",
        "潮水拍打着方舟，却一页纸也带不走。第四章，通关。"
      ]
    },

    /* ================= 第五章 · 星桥群岛 CONNECT ================= */
    c5e1: {
      type: "encounter", chapter: "c5",
      enemy: { name: "断桥深渊", hp: 4 },
      lines: [
        "星桥群岛本来由上千座桥连在一起：GitHub 岛、Notion 岛、Slack 岛……",
        "现在桥全断了。脚下是看不见底的深渊。",
        "林夏脚下的岩石开始崩裂——她要掉下去了！"
      ],
      choice: {
        prompt: "脚下在崩塌！搭哪座桥？",
        timeout: 8,
        options: [
          { label: "MCP connectors", sub: "接入任意应用和自定义 MCP 服务器", next: "f_mcp" },
          { label: "Zapier", sub: "一口气连通 8000 多个应用", next: "f_zapier" },
          { label: "GitHub", sub: "审查、修复、发布代码", next: "f_github" }
        ]
      }
    },
    f_mcp: {
      type: "skill", chapter: "c5", next: "c5e2", xp: 140,
      skill: { name: "MCP connectors", tag: "CONNECT", desc: "连接各类应用和自定义 MCP 服务器，让 Manus 直接使用你的工具。" },
      lines: [
        "林夏把手按在悬崖边，一个个 MCP 接口像星星一样亮起。",
        "光之锁链射向四面八方，扣住了每一座岛屿。",
        "她踩着刚刚连通的光桥，跃过了深渊。"
      ]
    },
    f_zapier: {
      type: "skill", chapter: "c5", next: "c5e2", xp: 140,
      skill: { name: "Zapier", tag: "CONNECT", desc: "通过 Zapier 在 8000 多个应用之间执行真实操作。" },
      lines: [
        "「Zapier，全部连上！」一道闪电劈开天空。",
        "八千多道橙色电弧同时射出，把所有岛屿焊在了一起。",
        "深渊被光网封住，林夏稳稳落在网上。"
      ]
    },
    f_github: {
      type: "skill", chapter: "c5", next: "c5e2", xp: 140,
      skill: { name: "GitHub", tag: "CONNECT", desc: "审查代码、修复问题并发布上线。" },
      lines: [
        "林夏打开 GitHub，断桥的源码浮现在眼前——满屏都是 bug。",
        "审查、修复、提交、合并，一气呵成。",
        "Push 的那一刻，石桥重新拼合，她在最后一秒跳了上去。"
      ]
    },

    c5e2: {
      type: "encounter", chapter: "c5",
      enemy: { name: "孤岛封锁者", hp: 3 },
      lines: [
        "最后三座岛被一层黑色屏障封锁：笔记、邮件、消息，全都与世隔绝。",
        "封锁者从屏障里伸出无数只手，要把小 M 拖进黑暗。",
        "小 M 的光在一点点变暗……"
      ],
      choice: {
        prompt: "小 M 快撑不住了！打开哪一座岛？",
        timeout: 8,
        options: [
          { label: "Notion", sub: "把笔记页面变成完成的工作", next: "f_notion" },
          { label: "Gmail", sub: "整理收件箱、起草回复、准备会议", next: "f_gmail" },
          { label: "Slack", sub: "在整个工作区里搜索、阅读、行动", next: "f_slack" }
        ]
      }
    },
    f_notion: {
      type: "skill", chapter: "c5", next: "c6boss", xp: 130,
      skill: { name: "Notion", tag: "CONNECT", desc: "读取 Notion 页面，把笔记变成完成的工作。" },
      lines: [
        "林夏翻开一本巨大的 Notion 笔记，页面一张张飞出去。",
        "每一页都化作一块砖，砌成一道冲破屏障的阶梯。",
        "笔记岛亮了。封锁者的手被一页页纸钉在了墙上。"
      ]
    },
    f_gmail: {
      type: "skill", chapter: "c5", next: "c6boss", xp: 130,
      skill: { name: "Gmail", tag: "CONNECT", desc: "连接 Gmail 与 Google Workspace：整理邮件、起草回复、安排日程。" },
      lines: [
        "林夏打开 Gmail。上千封邮件被自动分类、回复、归档。",
        "Google 日历、文档、表格也一起亮起，像一支整装待发的军队。",
        "屏障被一封封「已处理」轰出了缺口。"
      ]
    },
    f_slack: {
      type: "skill", chapter: "c5", next: "c6boss", xp: 130,
      skill: { name: "Slack", tag: "CONNECT", desc: "在 Slack 工作区中搜索、阅读并采取行动。" },
      lines: [
        "林夏在 Slack 里 @ 了所有人。",
        "无数条消息像萤火一样从各个频道飞来，汇成一道光柱。",
        "光柱击穿屏障，小 M 重新亮了起来。第五章，通关。"
      ]
    },

    /* ================= 终章 · 结构之王 ================= */
    c6boss: {
      type: "encounter", chapter: "c6",
      enemy: { name: "结构之王", hp: 6 },
      lines: [
        "天空被撕开。结构之王降临了。",
        "它由无数红色网格、表格和流程图组成，每一步都让世界变得更僵硬。",
        "「智能？」它低沉地说，「一切都必须按我的规则来。」",
        "红色激光网朝林夏劈头罩下！"
      ],
      choice: {
        prompt: "结构之王的网罩下来了！你召唤什么？",
        timeout: 8,
        options: [
          { label: "Manus Studio", sub: "人与 AI 共享的工作室，按需调用专业工具", next: "f_studio" },
          { label: "Computer Use", sub: "远程操控你的电脑，一句话完成", next: "f_computer" },
          { label: "Cue", sub: "召唤一支拥有自己身份的智能体军团", next: "f_cue" }
        ]
      }
    },
    f_studio: {
      type: "skill", chapter: "c6", next: "c6final", xp: 160,
      skill: { name: "Manus Studio", tag: "MANUS 2.0", desc: "人与 AI 共享的工作空间：文档、表格、幻灯片、网站、游戏、视频，按需调用专业工具。" },
      lines: [
        "林夏的四周展开一座巨大的工作室：文档、表格、网站、游戏、视频编辑器……",
        "需要什么工具，什么工具才出现——干净、专注，没有一件多余。",
        "红色激光网撞上工作室的穹顶，碎成了漫天红光。"
      ]
    },
    f_computer: {
      type: "skill", chapter: "c6", next: "c6final", xp: 160,
      skill: { name: "Computer Use", tag: "MANUS 2.0", desc: "在授权后操作你的电脑：文件、浏览器和应用都能用，还能用手机远程控制。" },
      lines: [
        "林夏掏出手机，对着它说：「打开我电脑上的反击方案。」",
        "远方的电脑屏幕亮起，光标自己移动、打开文件、运行程序。",
        "一道光束从现实世界射进来，正中结构之王的红眼。"
      ]
    },
    f_cue: {
      type: "skill", chapter: "c6", next: "c6final", xp: 160,
      skill: { name: "Cue", tag: "MANUS 2.0", desc: "Manus 推出的个人智能体应用：每个智能体都有自己的邮箱、电话、钱包和电脑，还能组队协作。" },
      lines: [
        "「给我一个 Cue。」林夏打了个响指。",
        "一支智能体军团从光中走出：每一个都有自己的邮箱、电话和电脑。",
        "它们在群聊里分工、交接、配合，从四面八方同时包围了结构之王。"
      ]
    },

    c6final: {
      type: "encounter", chapter: "c6",
      enemy: { name: "结构之王 · 终焉形态", hp: 8 },
      lines: [
        "结构之王没有倒下。它咆哮着吸收了整个世界的红色网格，膨胀到遮天蔽日。",
        "它伸出巨手，要把林夏收集的每一张技能卡都锁进格子里。",
        "小 M 飞到她面前：「最后一击了。你相信什么？」"
      ],
      choice: {
        prompt: "最后的选择——你要怎样结束这一切？",
        timeout: 12,
        final: true,
        options: [
          { label: "Cascade 精准一击", sub: "用 Manus 2.0 的新架构：更轻、更快、更省", next: "end_cascade" },
          { label: "召唤全部技能", sub: "把收集到的每一张技能卡同时打出", next: "end_all" },
          { label: "放下结构，信任智能", sub: "需要生命值 ≥ 60：不再对抗，而是交给智能体", next: "end_true", requireHp: 60 }
        ]
      }
    },

    /* ================= 结局 ================= */
    end_cascade: {
      type: "ending", chapter: "end",
      skill: { name: "Cascade", tag: "MANUS 2.0", desc: "Manus 2.0 的新一代智能体底座：按需引入能力，测试中 token 减少 23.2%，耗时减少 28.2%，成本降低 32%。" },
      lines: [
        "「Cascade。」林夏没有打出所有的牌，只取了此刻最需要的那一张。",
        "一道纤细却锋利的光，穿过所有红格之间的缝隙，正中核心。",
        "更少的消耗，更快的速度——结构之王从内部碎裂。"
      ],
      ending: { id: "cascade", name: "精准一击", text: "你没有用蛮力，而是只拿出了需要的那一份能力。轻装上阵，一击制胜。" }
    },
    end_all: {
      type: "ending", chapter: "end",
      lines: [
        "林夏举起双手，一路收集的技能卡全部飞向天空。",
        "网站要塞、光之巨鲸、云端电脑、智能体军团……所有的光汇成一颗太阳。",
        "太阳落下，结构之王在万丈光芒中灰飞烟灭。"
      ],
      ending: {
        id: "all", name: "群星齐鸣",
        text: (s) => "你打出了一路收集的 " + s.skills.length + " 张技能卡。那是一场盛大的胜利，也是一场漫长旅程的回声。"
      }
    },
    end_true: {
      type: "ending", chapter: "end",
      lines: [
        "林夏放下了手。她没有攻击，只是对小 M 说：「交给你了。」",
        "小 M 化作无数柔和的光线，钻进每一个红格。网格没有被摧毁，而是被松开、被重新编织。",
        "结构之王低下头，变回了一张白纸。天边浮现一行字：Less structure, more intelligence.",
        "林夏睁开眼——她回到了工作室。屏幕上，任务已完成。"
      ],
      ending: {
        id: "true", name: "更少结构，更多智能",
        text: "你明白了：真正的力量不是更多的规则，而是给智能留出空间。这是真结局。"
      }
    }
  },

  endings: [
    { id: "cascade", node: "end_cascade", name: "精准一击", hint: "在最后一战，只用最需要的那一份力量。" },
    { id: "all", node: "end_all", name: "群星齐鸣", hint: "在最后一战，把一切都打出去。" },
    { id: "true", node: "end_true", name: "更少结构，更多智能", hint: "别犹豫太久，保持生命值 ≥ 60，然后放下结构。" }
  ]
};
