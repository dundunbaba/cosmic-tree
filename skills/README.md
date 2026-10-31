# skills · 给智能体用的流程

| 目录 | 干什么 | 版本 |
|---|---|---|
| `explain-cosmic-tree/` | 给主人讲清宇宙之树是干嘛的：按主人的情况写故事稿，出一部带画面带配音的小动画；写不了就放自带成片；主人追问时去仓里查 | 0.1 |
| `agent-friendliness-eval/` | 评一个网站、工具或工作流对智能体的友好程度：做完一个端到端任务，按人工介入时间度量；对照 `baseline/` 对标；用 Issue 提交结果 | 0.1 |

用法：Claude Code 把目录拷到 `~/.claude/skills/`；别的运行时把 `SKILL.md` 当指令读。每个 skill 的记录格式在它的 `templates/`，校验脚本在仓根 `scripts/`。
