// 修正済みゲームコード（置き換え用）
// - okawa を分岐ノードに変更
// - 残り時間 mechanic を追加（remainingTime）
// - 確率分岐は remainingTime に依存して確率が変動
// - timeCost を選択肢に持たせ、選択時に減る

const courses = {
    // --- 大川小コース（分岐型、Mermaid 図に沿った構成） ---
    okawa: {
        Start: {
            text: "地震発生",
            illustration: "🌎",
            choices: [
                { text: "机の下に入り、頭を守る", nextId: "A1", timeCost: 1 },
                { text: "出口や廊下の様子を見る", nextId: "A2", timeCost: 1 }
            ]
        },
        A1: {
            text: "揺れが収まる。ガラス片が散乱している様子。",
            illustration: "🪟🧯",
            choices: [
                { text: "先生の指示に従う", nextId: "B1", timeCost: 1 },
                { text: "先生の指示を待たずに校舎の外に出る", nextId: "B2", timeCost: 1 },
                { text: "ガラス破片に気を付けながら外を見渡す", nextId: "B3", timeCost: 1 }
            ]
        },
        A2: {
            text: "避難訓練通りにはいかなかった。混乱の中、周囲の状況を把握する。",
            illustration: "⚠️",
            choices: [
                { text: "先生の指示に従う", nextId: "B1", timeCost: 1 },
                { text: "校舎の外へ飛び出す", nextId: "B2", timeCost: 1 },
                { text: "周囲を注意深く見る", nextId: "B3", timeCost: 1 }
            ]
        },

        // 第2段階
        B1: {
            text: "グラウンドに集まる。背後に山が見える。",
            illustration: "🏟️⛰️",
            choices: [
                { text: "先生の指示を待つ", nextId: "Q3", timeCost: 1 },
                { text: "周囲を見渡す", nextId: "Q3", timeCost: 1 }
            ]
        },
        B2: {
            text: "校舎の裏には山、門側にはスクールバスがある。",
            illustration: "🚌⛰️",
            choices: [
                { text: "スクールバスを見る", nextId: "Q3", timeCost: 1 },
                { text: "山の方向を確認する", nextId: "Q3", timeCost: 1 }
            ]
        },
        B3: {
            text: "海岸側から津波が見える。危険が差し迫っている。",
            illustration: "🌊👀",
            choices: [
                { text: "先生の指示を待つ", nextId: "Q4", timeCost: 0 }, // 目撃直後は時間差が無い選択肢がある想定
                { text: "みんなを呼び掛けて避難する", nextId: "GroupSurvive", timeCost: 1 },
                { text: "1人で山に避難する", nextId: "SoloSurvive", timeCost: 1 }
            ]
        },

        // 第3段階（合流して Q3）
        Q3: {
            text: "ここで避難経路の選択が求められる。",
            illustration: "🔀",
            choices: [
                { text: "スクールバスに乗って川の上流側へ避難", nextId: "BusBad", timeCost: 1 },
                { text: "1人で山に登る", nextId: "SoloSurvive", timeCost: 1 },
                { text: "先生の指示を待つ", nextId: "WaitDanger", timeCost: 1 }
            ]
        },

        // B3 からの Q4
        Q4: {
            text: "津波を目視。どうする？",
            illustration: "🌊👀",
            choices: [
                { text: "先生の指示を待つ", nextId: "WaitDanger", timeCost: 1 },
                { text: "1人で山に避難する", nextId: "SoloSurvive", timeCost: 1 },
                { text: "みんなを呼び掛けて避難する", nextId: "GroupSurvive", timeCost: 1 }
            ]
        },

        // 各エンドノード
        BusBad: {
            text: "津波が川を遡上。バスごと飲み込まれる！",
            illustration: "🚌🌊",
            isEnding: true,
            endingType: "bad"
        },
        SoloSurvive: {
            text: "向こうから迫る津波が見えた。助かったのは自分だけ。",
            illustration: "🏃‍♂️🌄",
            isEnding: true,
            endingType: "bad"
        },
        WaitDanger: {
            text: "先生たちも意見が割れて戸惑う。待っているうちに津波が迫る。",
            illustration: "⏳⚠️",
            choices: [
                { text: "スクールバスに乗る（大混乱）", nextId: "BusPanic", timeCost: 1 },
                { text: "校舎裏の山に全力で逃げる", nextId: "RunRandom", timeCost: 1 }
            ]
        },

        GroupSurvive: {
            text: "何人かがついてきて助かったが、大半は指示を優先して巻き込まれてしまった。",
            illustration: "🧑‍🤝‍🧑🌄",
            isEnding: true,
            endingType: "good"
        },

        BusPanic: {
            text: "大人数がバスに駆け込み、運転手も対処できず全員飲み込まれる。",
            illustration: "🚌💥",
            isEnding: true,
            endingType: "bad"
        },

        // 確率分岐（RunRandom）
        RunRandom: {
            text: "運命の分岐（全力で山へ走る）",
            illustration: "🏃‍♀️🏃‍♂️",
            isEnding: true,
            probabilistic: true,
            // outcomes の重みは動的に調整するため、ここではデフォルト値を入れておく
            outcomes: [
                // weights は selectProbabilisticOutcome で remainingTime に応じて上書きされる
                { id: "RunGood", weight: 50, text: "【RUN GOOD】間一髪で間に合い助かる（指示待ちの子は犠牲）", illustration: "🏔️", endingType: "good" },
                { id: "RunBad", weight: 50, text: "【RUN BAD】全力で走ったが無念にも飲み込まれる", illustration: "🌊", endingType: "bad" }
            ]
        },
        RunGood: {
            text: "間に合い助かった。ほんの少しの差で救われた。",
            illustration: "🏔️🌅",
            isEnding: true,
            endingType: "good"
        },
        RunBad: {
            text: "全力で走ったが無念にも飲み込まれる。",
            illustration: "🌊💧",
            isEnding: true,
            endingType: "bad"
        }
    },

    // --- 大宮コース（元の分岐構造を保持。キーは start,node_a... のまま） ---
    omiya: {
        start: {
            text: "【大宮国際中等教育学校ルート】\n地震発生！激しい揺れが襲ってきました。",
            illustration: "🏫🌏",
            choices: [
                { text: "机の下に隠れる", nextId: 'node_a', timeCost: 1 },
                { text: "とりあえず固まる", nextId: 'node_b', timeCost: 1 },
                { text: "教室の外に飛び出す", nextId: 'node_c', timeCost: 1 }
            ]
        },
        node_a: {
            text: "机の下に隠れました。揺れが収まりましたが、まだ周囲は騒然としています。",
            illustration: "🪑🙏",
            choices: [
                { text: "机から出る", nextId: 'node_g', timeCost: 1 },
                { text: "先生の指示を待つ", nextId: 'node_g', timeCost: 1 },
                { text: "発狂する", nextId: 'ending_d', timeCost: 1 }
            ]
        },
        node_b: {
            text: "恐怖で動けず、その場で固まってしまいました。",
            illustration: "😨🧊",
            choices: [
                { text: "固まり続ける", nextId: 'node_g', timeCost: 1 },
                { text: "周囲を見る", nextId: 'node_e', timeCost: 1 },
                { text: "発狂する", nextId: 'ending_d', timeCost: 1 }
            ]
        },
        node_c: {
            text: "パニックになり、教室の外へ飛び出しました！",
            illustration: "🏃💨",
            choices: [
                { text: "校庭に動く", nextId: 'ending_j', timeCost: 1 },
                { text: "窓から飛び出る", nextId: 'ending_f', timeCost: 1 },
                { text: "教室に戻る", nextId: 'node_g', timeCost: 1 }
            ]
        },
        node_e: {
            text: "冷静に周囲を確認します。",
            illustration: "👁️🔍",
            choices: [
                { text: "安全な道を見つける", nextId: 'node_i', timeCost: 1 },
                { text: "懐中電灯を拾う", nextId: 'node_h', timeCost: 1 }
            ]
        },
        node_g: {
            text: "周囲はパニック状態です。どうしますか？",
            illustration: "😱🔥",
            choices: [
                { text: "周囲の人を落ち着かせる", nextId: 'node_l', timeCost: 1 },
                { text: "他の人をおいて逃げる", nextId: 'node_k_choice', timeCost: 1 }
            ]
        },
        node_k_choice: {
            text: "自分だけでも助かりたい！どこへ逃げますか？",
            illustration: "🏃‍♂️💨",
            choices: [
                { text: "古墳", nextId: 'ending_j', timeCost: 1 },
                { text: "校庭", nextId: 'ending_j', timeCost: 1 },
                { text: "屋上", nextId: 'ending_d', timeCost: 1 }
            ]
        },
        node_l: {
            text: "「落ち着いて！」と声をかけ、周囲を鎮めました。",
            illustration: "🗣️✋",
            choices: [
                { text: "先生の避難指示に従う", nextId: 'ending_k', timeCost: 1 },
                { text: "周りの人とだけ急いで逃げる", nextId: 'ending_m', timeCost: 1 }
            ]
        },
        node_i: {
            text: "崩れていない安全なルートを見つけました。",
            illustration: "🛤️✨",
            choices: [
                { text: "周りの人を助けて一緒に逃げる", nextId: 'ending_hero', timeCost: 1 },
                { text: "1人で逃げる", nextId: 'ending_j', timeCost: 1 }
            ]
        },
        node_h: {
            text: "懐中電灯を手に入れました。視界が確保できます。",
            illustration: "🔦💡",
            choices: [
                { text: "他の生徒を救う", nextId: 'ending_hero', timeCost: 1 }
            ]
        },
        ending_hero: {
            text: "【HERO END】\nあなたは勇気ある行動で多くの命を救いました。学校の英雄です。",
            illustration: "🏅",
            isEnding: true,
            endingType: 'good'
        },
        ending_k: {
            text: "【BEST END】\n冷静な判断と協力により、クラス全員が無事に避難できました。",
            illustration: "💮",
            isEnding: true,
            endingType: 'good'
        },
        ending_m: {
            text: "【SURVIVAL END】\nあなたたちは助かりましたが、残った生徒を探しに戻った先生が...",
            illustration: "😢",
            isEnding: true,
            endingType: 'neutral'
        },
        ending_j: {
            text: "【SURVIVAL END】\n助かったのは自分だけ...？他の人の安否がわかりません。",
            illustration: "😰",
            isEnding: true,
            endingType: 'neutral'
        },
        ending_f: {
            text: "", // probabilistic
            illustration: "",
            isEnding: true,
            probabilistic: true,
            outcomes: [
                { weight: 50, text: "【BAD END】\n窓から飛び降りて骨折しました。避難に遅れが生じます。", illustration: "🤕", endingType: 'bad' },
                { weight: 50, text: "【GAME OVER】\n打ち所が悪く、命を落としてしまいました...", illustration: "💀", endingType: 'bad' }
            ]
        },
        ending_d: {
            text: "",
            illustration: "",
            isEnding: true,
            probabilistic: true,
            outcomes: [
                { weight: 25, text: "【LUCKY END】\n奇跡的に無傷で助かりました。運が良かっただけです。", illustration: "🤞", endingType: 'neutral' },
                { weight: 25, text: "【GAME OVER】\nパニック行動が仇となり、命を落しました。", illustration: "💀", endingType: 'bad' },
                { weight: 50, text: "【BAD END】\n大怪我を負い、動けなくなってしまいました。", illustration: "🤕", endingType: 'bad' }
            ]
        }
    }
};

let scenarios = []; // 線形モードがあれば使うが、今回ほぼ分岐モード
let currentScenario = 0;
let isGameActive = false;
let isCourseSelection = false;
let score = 0;
let hp = 3;

// 分岐モード用
let branchingScenarios = null;
let currentNodeId = null;
let isBranchingMode = false;

// 残り時間メカニクス（選択に応じて減る）
let remainingTime = 5; // デフォルト。コース選択時にコースごとに設定することも可能

// DOM要素（既存の id に合わせている想定）
const progressEl = document.getElementById('progress');
const illustrationEl = document.getElementById('illustration');
const scenarioTextEl = document.getElementById('scenario-text');
const choicesEl = document.getElementById('choices');
const choice1El = document.getElementById('choice1');
const choice2El = document.getElementById('choice2');
const startScreenEl = document.getElementById('start-screen');
const resultScreenEl = document.getElementById('result-screen');
const resultIconEl = document.getElementById('result-icon');
const resultTitleEl = document.getElementById('result-title');
const resultMessageEl = document.getElementById('result-message');

// スタイル注入（元コードをベースに少し修正）
function injectGameStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* (省略しません：既存スタイルをそのまま使用) */
        body {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%);
            color: #ecf0f1;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .game-container { max-width: 800px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a1a 0%, #2d0a0a 100%); border-radius: 15px; box-shadow: 0 10px 50px rgba(255, 0, 0, 0.5), 0 0 100px rgba(255, 200, 0, 0.2); border: 3px solid #c0392b; animation: containerPulse 3s ease-in-out infinite; }
        h1 { text-align: center; color: #ff3333; text-shadow: 0 0 10px #ff0000, 2px 2px 4px #000; font-size: 2.5rem; animation: titleFlicker 2s ease-in-out infinite; }
        .hud { display: flex; justify-content: space-between; background: linear-gradient(135deg, #000000 0%, #1a0000 100%); padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 2px solid #c0392b; font-weight: bold; font-family: 'Courier New', monospace; box-shadow: inset 0 0 20px rgba(255, 0, 0, 0.3); }
        .hp-bar { color: #e74c3c; text-shadow: 0 0 8px #e74c3c, 0 0 15px #ff0000; }
        .score-board { color: #f1c40f; text-shadow: 0 0 8px #f39c12; }
        .time-board { color: #87CEEB; text-shadow: 0 0 8px #87CEEB; }
        .illustration { background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border-radius: 10px; padding: 30px; text-align: center; margin-bottom: 20px; border: 4px solid #c0392b; min-height: 180px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(255, 0, 0, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.5); }
        .choice-btn { display: block; width: 100%; padding: 16px; margin: 12px 0; background: linear-gradient(135deg, #c0392b 0%, #8b0000 100%); color: #ffffff; border: 2px solid #ff4444; border-radius: 8px; font-size: 1.05rem; font-weight: bold; cursor: pointer; transition: all 0.2s ease; text-align: left; position: relative; overflow: hidden; }
        .hidden { display: none !important; }
        .scenario-box { background: linear-gradient(135deg, #2d1a0a 0%, #1a0a00 100%); border-left: 5px solid #f39c12; border-radius: 8px; padding: 20px; margin-bottom: 24px; box-shadow: 0 0 20px rgba(243, 156, 18, 0.3); border: 2px solid #f39c12; }
    `;
    document.head.appendChild(style);

    // HUD 追加
    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.innerHTML = `
        <span class="hp-bar">HP: ❤️❤️❤️</span>
        <span id="game-progress">STAGE</span>
        <span class="time-board">TIME: ${remainingTime}</span>
        <span class="score-board">SCORE: ${score}</span>
    `;
    const container = document.querySelector('.game-container');
    const mainContent = document.querySelector('.game-main');
    if (container && mainContent) {
        container.insertBefore(hud, mainContent);
    }
    if (progressEl) {
        progressEl.classList.add('hidden');
    }
}

// ゲーム開始
function startGame() {
    currentScenario = 0;
    isGameActive = true;
    isCourseSelection = true;
    score = 0;
    hp = 3;
    isBranchingMode = false;
    branchingScenarios = null;
    currentNodeId = null;
    remainingTime = 5; // デフォルト初期時間（コースによって上書き可能）

    // 画面切り替え
    if (startScreenEl) startScreenEl.classList.add('hidden');
    if (resultScreenEl) resultScreenEl.classList.add('hidden');
    if (choicesEl) choicesEl.classList.remove('hidden');

    updateHUD();
    showCourseSelection();
}

function updateHUD() {
    const hpStr = '❤️'.repeat(Math.max(0, hp));
    const hpEl = document.querySelector('.hp-bar');
    const scoreEl = document.querySelector('.score-board');
    const timeEl = document.querySelector('.time-board');
    if (hpEl) hpEl.textContent = `HP: ${hpStr}`;
    if (scoreEl) scoreEl.textContent = `SCORE: ${score}`;
    if (timeEl) timeEl.textContent = `TIME: ${remainingTime}`;

    const prog = document.getElementById('game-progress');
    if (prog) {
        if (!isCourseSelection) {
            if (isBranchingMode) {
                prog.textContent = `STORY MODE`;
            } else {
                prog.textContent = `STAGE ${currentScenario + 1}/${scenarios.length}`;
            }
        } else {
            prog.textContent = `COURSE SELECT`;
        }
    }
}

// コース選択表示
function showCourseSelection() {
    if (progressEl) progressEl.textContent = "コース選択";
    if (illustrationEl) illustrationEl.innerHTML = `<span style="font-size: 4rem;">🏫⚖️</span>`;
    if (scenarioTextEl) scenarioTextEl.innerHTML = "避難シミュレーションを開始します。<br>体験したいコースを選択してください。";

    // 既存のボタンをクリア
    choicesEl.innerHTML = '';

    // 大川小学校コースボタン
    const okawaBtn = document.createElement('button');
    okawaBtn.className = 'choice-btn';
    okawaBtn.textContent = '大川小学校コース（教訓・フローチャートモード）';
    okawaBtn.onclick = () => selectCourse('okawa');
    choicesEl.appendChild(okawaBtn);

    // 大宮国際中等教育学校コースボタン
    const omiyaBtn = document.createElement('button');
    omiyaBtn.className = 'choice-btn';
    omiyaBtn.textContent = '大宮国際中等教育学校コース（サバイバル・ストーリーモード）';
    omiyaBtn.onclick = () => selectCourse('omiya');
    choicesEl.appendChild(omiyaBtn);

    choicesEl.classList.remove('animate');
    choicesEl.getBoundingClientRect();
    choicesEl.classList.add('animate');
}

// コース選択処理
function selectCourse(courseName) {
    if (courseName === 'okawa') {
        branchingScenarios = courses.okawa;
        isBranchingMode = true;
        isCourseSelection = false;
        currentNodeId = 'Start';
        // 大川小は津波想定なので残り時間は短めに（調整可）
        remainingTime = 4;
        showBranchingNode();
    } else if (courseName === 'omiya') {
        branchingScenarios = courses.omiya;
        isBranchingMode = true;
        isCourseSelection = false;
        currentNodeId = 'start';
        // 大宮はやや余裕がある想定
        remainingTime = 5;
        showBranchingNode();
    }
    updateHUD();
}

// 分岐ノード表示
function showBranchingNode() {
    if (!branchingScenarios || !currentNodeId) return;

    const node = branchingScenarios[currentNodeId];
    if (!node) {
        console.error("Node not found:", currentNodeId);
        return;
    }

    // エンディングの場合
    if (node.isEnding) {
        if (node.probabilistic) {
            const outcome = selectProbabilisticOutcome(node.outcomes, currentNodeId);
            showBranchingResult(outcome.text, outcome.illustration, outcome.endingType);
        } else {
            showBranchingResult(node.text, node.illustration, node.endingType);
        }
        return;
    }

    // イラスト・テキスト更新
    if (illustrationEl) illustrationEl.innerHTML = `<span style="font-size: 4rem;">${node.illustration || ''}</span>`;
    if (scenarioTextEl) scenarioTextEl.innerHTML = (node.text || '').replace(/\n/g, '<br>');

    // 選択肢を動的生成（timeCost をデータとして用いる）
    choicesEl.innerHTML = '';
    node.choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = `${choice.text}  ${choice.timeCost ? `(時間-${choice.timeCost})` : ''}`;
        btn.dataset.nextId = choice.nextId;
        btn.dataset.timeCost = choice.timeCost || 1;
        btn.onclick = () => makeBranchingChoice(choice.nextId, Number(btn.dataset.timeCost));
        choicesEl.appendChild(btn);
    });

    // アニメーション
    choicesEl.classList.remove('animate');
    choicesEl.getBoundingClientRect();
    choicesEl.classList.add('animate');
}

// 残り時間に基づく確率分岐の選択
function selectProbabilisticOutcome(outcomes, nodeId = null) {
    // バリデーション
    if (!outcomes || !Array.isArray(outcomes) || outcomes.length === 0) {
        return { text: "【ERROR】エラーが発生しました。", illustration: "❌", endingType: "bad" };
    }

    // deep copy
    const outs = outcomes.map(o => Object.assign({}, o));

    // 動的な重み調整:
    // - remainingTime が大きければ成功系（good）の重みを増やす
    // - remainingTime が小さいと bad 側の重みを増やす
    // ここでは simple なルールを採用：
    // baseWeight = outcome.weight (もし未指定なら均等)
    // multiplier = 1 + (remainingTime - 3) * 0.25  (remainingTime の基準を 3 に設定)
    // ただし nodeId による特殊ルールも入れられる
    let multiplier = 1 + (remainingTime - 3) * 0.3;
    // clamp multiplier within [0.2, 2.5]
    multiplier = Math.max(0.2, Math.min(2.5, multiplier));

    // 例: RunRandom では成功(outcomes[0]) を remainingTime によって有利にする
    if (nodeId === 'RunRandom') {
        // outcomes[0] is RunGood, outcomes[1] is RunBad by construction
        outs.forEach((o, idx) => {
            const base = (typeof o.weight === 'number') ? o.weight : 50;
            if (idx === 0) {
                // good
                o._adjWeight = Math.round(base * multiplier);
            } else {
                // bad
                o._adjWeight = Math.round(base * (2.5 - multiplier)); // inverse relation
            }
        });
    } else {
        // デフォルト：time による小幅調整（good と明示されているものを有利に）
        outs.forEach(o => {
            const base = (typeof o.weight === 'number') ? o.weight : 50;
            if (o.endingType === 'good') {
                o._adjWeight = Math.round(base * multiplier);
            } else if (o.endingType === 'bad') {
                o._adjWeight = Math.round(base * (2.5 - multiplier));
            } else {
                o._adjWeight = base;
            }
        });
    }

    // 重み合計を計算してランダム選択
    const total = outs.reduce((s, o) => s + (o._adjWeight || 0), 0);
    let r = Math.random() * total;
    let cum = 0;
    for (const o of outs) {
        cum += o._adjWeight;
        if (r < cum) return o;
    }
    return outs[outs.length - 1];
}

// 分岐選択処理（時間を消費）
function makeBranchingChoice(nextId, timeCost = 1) {
    if (!isGameActive) return;

    // 時間消費
    remainingTime -= timeCost;
    if (remainingTime < 0) remainingTime = 0;
    updateHUD();

    // 残り時間が 0 ならタイムアウトで死亡（即エンディング）
    if (remainingTime <= 0) {
        showBranchingResult("【TIME UP】\n残り時間が尽きました。避難に失敗して命を落としました。", "💀", "bad");
        return;
    }

    currentNodeId = nextId;
    showBranchingNode();
}

// 結果表示（分岐モード）
function showBranchingResult(text, illustration, endingType = null) {
    isGameActive = false;
    if (choicesEl) choicesEl.classList.add('hidden');

    if (resultScreenEl) {
        resultScreenEl.classList.remove('hidden', 'success', 'failure');
        // endingType 判定
        let isGoodEnding = false, isBadEnding = false;
        if (endingType) {
            isGoodEnding = endingType === 'good';
            isBadEnding = endingType === 'bad';
        } else {
            isGoodEnding = text.includes('HERO') || text.includes('BEST') || text.includes('助かった');
            isBadEnding = text.includes('GAME OVER') || text.includes('命を落');
        }
        if (isGoodEnding) resultScreenEl.classList.add('success');
        else if (isBadEnding) resultScreenEl.classList.add('failure');
        else resultScreenEl.classList.add('success');

        if (resultIconEl) resultIconEl.textContent = illustration || '';
        if (resultTitleEl) resultTitleEl.textContent = (text.split('\n')[0] || '').replace(/【|】/g, '');
        if (resultMessageEl) resultMessageEl.innerHTML = text.split('\n').slice(1).join('<br>');
    }
}

// （既存の線形モードの関数は残しておくが、今回は分岐モードを主に使う）
// ... ここでは既存の線形用 showScenario / makeLinearChoice 等は省略（必要なら戻せます） ...

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    injectGameStyles(); // スタイル注入
    // 初期状態では選択肢を非表示（コース選択画面で生成）
    if (choicesEl) choicesEl.classList.add('hidden');

    // ゲーム開始ボタンがある場合、自動で startGame を呼ぶかボタンに紐付ける
    // ここでは自動的に start 画面を表示するのみ
    // (もしページに「START」ボタンがあれば、そのクリックで startGame を呼ぶ)
});
