# 讲解片 · Explain kit

> 智能体拿到宇宙之树，默认用一部带画面、带配音的小动画讲给主人，不是贴一段文字。怎么做见 skill `skills/explain-cosmic-tree/SKILL.md`。
> Agents explain Cosmic Tree to their humans with a short animated, narrated film, not with prose. See the skill `skills/explain-cosmic-tree/SKILL.md`.

## 直接看 · Watch

| 文件 | 是什么 |
|---|---|
| `cosmic-tree-story.zh.html` | 中文成片，约 5 分钟，字幕版。下载下来双击打开，点「开始看」 |
| `cosmic-tree-story.en.html` | English film, about 5 minutes, subtitles |

不联网，不收集任何信息。仓里两部是字幕版；想要声音，让你的智能体按 skill 第四步在你电脑上配。No network requests. These are subtitle versions; your agent can add narration locally (skill step 4).

## 这个目录里有什么

| 路径 | 干什么 |
|---|---|
| `template.html` | 播放器。画法写死在这里：一笔线描，米白纸、黑细线、一个红点，红点就是故事里的 AI；内置 13 个场景 |
| `stories/default.zh.json`、`default.en.json` | 自带两部成片的故事稿：一个机器人在门口敲了六次门 |
| `out/audio/zh/`、`out/audio/en/` | 本机配音（不进仓库）。一句一个 mp3（`b<段号>-<句号>.mp3`），用免费的微软神经网络音色配的：中文云希，英文 Andrew。这套音色走微软 Edge 朗读服务，不是正式授权的接口，能不能随公开仓再分发没写清，所以只在本机用；`--defaults` 会同时在 `out/` 出一份带配音的 `*.voiced.html` |
| `cases.md` | 真实案例，带出处和日期；写故事稿和答追问用 |
| `out/` | 本地试出来的东西，不进仓库 |

## 怎么出一部新的

```
node scripts/build-explain.mjs --check-story <故事稿.json>                      # 校验
node scripts/voice-explain.mjs --story <故事稿.json> --voice zh-CN-YunxiNeural --out <音频目录>   # 配音，可选
node scripts/build-explain.mjs --story <故事稿.json> --audio <音频目录> --out <成片.html>        # 出片
```

改了自带故事稿以后：`node scripts/build-explain.mjs --defaults` 重出两部字幕版成片，`--check` 退出码 0 再提交；想要本机带配音的版本，先跑 `node scripts/voice-explain.mjs --defaults`。卡片分数变了，成片里的数字跟着变，所以改卡后也要重出。

## 规矩

- 数字一律从仓里取，故事稿里写占位，不许手写分数和卡数。
- 开头那件事必须是真事。
- 中文旁白像聊天：短句、不用冒号破折号双引号、不念说明书。
- 页面零外部请求，尊重系统的"减少动态效果"设置。
