#!/usr/bin/env node
// 讲解片配音：故事稿逐句配成 mp3（b<段号>-<句号>.mp3，从 1 数），再用 build-explain.mjs --audio <目录> 嵌进成片。
// 用免费的微软神经网络音色（edge-tts，Python 小工具，不要钱不要 key）；本脚本只负责逐句调用和命名，零 npm 依赖。
//
// 先装一次 edge-tts（装在仓里被 git 忽略的 .tools/ 下，不进 C 盘）：
//   py -3 -m pip install --target .tools/pylib edge-tts
// 用法：
//   node scripts/voice-explain.mjs --story <故事稿.json> --voice zh-CN-YunxiNeural --out <目录> [--rate +5%] [--name 主人称呼] [--force]
//   node scripts/voice-explain.mjs --defaults --voice-zh zh-CN-YunxiNeural --voice-en en-US-AndrewNeural   给两部自带成片配音（存到 docs/explain/out/audio，不进仓库）
// 免费音色走微软 Edge 朗读服务，不是正式授权的接口：配出来的声音只给主人自己看，不公开发布，不交回仓库。
// 常用音色：中文 zh-CN-YunxiNeural（男，轻快）、zh-CN-XiaoxiaoNeural（女，温暖）、zh-CN-YunyangNeural（男，播音）；
//           英文 en-US-AndrewNeural、en-US-AvaNeural。全部列表：py -3 -m edge_tts --list-voices
// 退出码：0 成功；1 有句子没配成；2 用法或环境问题。
import { readFileSync, existsSync, mkdirSync, statSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { REPO_ROOT } from './build-readme.mjs';
import { buildData, validateStory, resolveStory, DEFAULTS } from './build-explain.mjs';

const PYLIB = join(REPO_ROOT, '.tools', 'pylib');

function parseArgs(argv) {
  const o = { story: '', voice: '', out: '', rate: '+5%', name: undefined, force: false, defaults: false, voiceZh: 'zh-CN-YunxiNeural', voiceEn: 'en-US-AndrewNeural', python: process.platform === 'win32' ? 'py' : 'python3' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i] ?? '';
    if (a === '--story') o.story = v();
    else if (a === '--voice') o.voice = v();
    else if (a === '--out') o.out = v();
    else if (a === '--rate') o.rate = v();
    else if (a === '--name') o.name = v();
    else if (a === '--force') o.force = true;
    else if (a === '--defaults') o.defaults = true;
    else if (a === '--voice-zh') o.voiceZh = v();
    else if (a === '--voice-en') o.voiceEn = v();
    else if (a === '--python') o.python = v();
    else throw new Error(`不认识的参数：${a}（用法见脚本开头）`);
  }
  return o;
}

// 念给人听的文字：去掉「」这类只给眼睛看的符号
const speakable = (s) => String(s).replace(/[「」『』]/g, '').replace(/\s+/g, ' ').trim();

function pyArgs(o) { return o.python === 'py' ? ['-3', '-m', 'edge_tts'] : ['-m', 'edge_tts']; }

export function voiceStory(storyPath, voice, outDir, o, data) {
  const story = JSON.parse(readFileSync(storyPath, 'utf8').replace(/^﻿/, ''));
  const { errors } = validateStory(story, data);
  if (errors.length) { errors.forEach((e) => console.error(`不合格 ${storyPath}: ${e}`)); return { ok: 0, bad: 1 }; }
  const r = resolveStory(story, data, o.name);
  mkdirSync(outDir, { recursive: true });
  const env = { ...process.env, PYTHONPATH: [PYLIB, process.env.PYTHONPATH].filter(Boolean).join(process.platform === 'win32' ? ';' : ':'), PYTHONIOENCODING: 'utf-8' };
  let ok = 0, bad = 0, skipped = 0;
  r.beats.forEach((b, i) => b.lines.forEach((line, k) => {
    const f = join(outDir, `b${i + 1}-${k + 1}.mp3`);
    if (!o.force && existsSync(f) && statSync(f).size > 0) { skipped++; return; }
    try {
      execFileSync(o.python, [...pyArgs(o), '--voice', voice, `--rate=${o.rate}`, '--text', speakable(line), '--write-media', f], { env, stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true, timeout: 60000 });
      if (!existsSync(f) || statSync(f).size === 0) throw new Error('没有生成文件');
      ok++;
    } catch (e) {
      bad++; try { rmSync(f, { force: true }); } catch {}  // 网络断了会留下半截文件，删掉，下次重配
      console.error(`没配成 b${i + 1}-${k + 1}：${String(e.stderr || e.message).split('\n').filter(Boolean).pop()}（再跑一次会补上）`);
    }
  }));
  console.log(`${storyPath} → ${outDir}：新配 ${ok} 句，已有跳过 ${skipped} 句，失败 ${bad} 句（音色 ${voice}）`);
  return { ok, bad };
}

function main() {
  let o;
  try { o = parseArgs(process.argv.slice(2)); } catch (e) { console.error(e.message); return 2; }
  try { execFileSync(o.python, [...pyArgs(o), '--help'], { env: { ...process.env, PYTHONPATH: PYLIB }, stdio: 'ignore', windowsHide: true }); }
  catch { console.error('找不到 edge-tts。先跑：py -3 -m pip install --target .tools/pylib edge-tts'); return 2; }
  const data = buildData();
  if (o.defaults) {
    let bad = 0;
    for (const d of DEFAULTS) {
      const voice = /default\.en\.json$/.test(d.story) ? o.voiceEn : o.voiceZh;
      bad += voiceStory(d.story, voice, d.audio, o, data).bad;
    }
    if (!bad) console.log('配好了。接着跑 node scripts/build-explain.mjs --defaults 把音频嵌进成片。');
    return bad ? 1 : 0;
  }
  if (!o.story || !o.voice || !o.out) { console.error('要 --story、--voice、--out，或 --defaults'); return 2; }
  if (!existsSync(o.story)) { console.error(`找不到 ${o.story}`); return 2; }
  const { bad } = voiceStory(o.story, o.voice, resolve(o.out), o, data);
  if (!bad) console.log(`配好了。接着跑 node scripts/build-explain.mjs --story ${o.story} --audio ${o.out} --out <成片.html>`);
  return bad ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
