// ゲームシナリオデータ（改変版：大宮国際コースに名称変更、
// 大川小ルートを指定の分岐ロジックに近づける。2択UIを維持しつつ分岐可能にするため
// 各選択肢に nextId / timeCost / hpChange / chanceModifier を持たせる実装に変更）
//
// 使い方（開発者向け注記）
// - 各シナリオは必ず `id` を持ち、choices 配列の各要素に `nextId` を指定し  ください。
//   nextId が null または "END" の場合は showResult が呼ばれエンドになります。
// - コースごとに initialTime (津波到達までの想定残り時間) を設定します。
// - choice の timeCost が選択時に時間を減らします。時間が <= 0 になると津波ヒットの特殊エンドに遷移します。
// - RunRandom のような確率分岐は choice に special: "random" を付け、chance を計算して分岐します。
// - エンドごとの開放率表示は courses 内の endDefinitions の weight を参照して割合を算出します。

const courses = {
    okawa: {
        name: "大川小コース（教訓）",
        initialTime: 40, // 津波到達までの想定残り時間（任意単位）
        endDefinitions: {
            hero: { title: "ヒーロールート", weight: 5, description: "協力して多くの人を救った。" },
            k_end: { title: "クラス全体が助かる", weight: 10, description: "冷静に避難し、クラス全体を導いた。" },
            m: { title: "先生が犠牲になるパターン", weight: 3, description: "周囲は助かるが、指揮系統に齟齬が生じた。" },
            j: { title: "自分は助かるが他が犠牲", weight: 4, description: "個人的には助かったが集団行動が失敗した。" },
            f: { title: "半数負傷／半数死亡", weight: 2, description: "避難途中で甚大な被害に遭った。" },
            d: { title: "避難失敗", weight: 1, description: "発狂や屋上の危険な選択により多数が被害を受けた。" },
            tsunami: { title: "津波直撃（即死パターン）", weight: 0.5, description: "時間切れで津波に飲まれた。" }
        },
        // シナリオ群（id 決め打ちで nextId を指定）
        scenarios: [
            // スタート
            {
                id: 1,
                situation: "地震発生！教室にいます。まずどうする？\n（2択）",
                illustration: "🏫⚠️",
                timeCost: 0,
                choices: [
                    { text: "机の下に入り、頭を守る", nextId: 2, correct: true, timeCost: 2 },
                    { text: "出口や廊下の様子を見る", nextId: 10, correct: false, timeCost: 3 }
                ]
            },

            // A1経路：机の下→次の分岐（先生の指示 or 自分で動く or 発狂）
            {
                id: 2,
                situation: "揺れが収まり、周囲にはガラス片。どうする？",
                illustration: "💥🪟",
                choices: [
                    { text: "先生の指示に従う（校庭へ向かう）", nextId: 3, correct: true, timeCost: 4 },
                    { text: "先生の指示を待たずに校舎の外に出る", nextId: 4, correct: false, timeCost: 6 }
                ]
            },

            // B1: 校庭へ集まる（背後に山あり） -> 次の選択（バス/一人で山/先生の指示待ち）
            {
                id: 3,
                situation: "グラウンドに集まった。背後に山が見える。\nどうする？",
                illustration: "⛰️👥",
                choices: [
                    { text: "スクールバスに乗って川の上流へ避難する", nextId: 20, correct: false, timeCost: 5 },
                    { text: "一人で山に登る", nextId: 21, correct: false, timeCost: 6 }
                ]
            },

            // B2: 校舎の外へ出た経路（校舎裏に山、門側にバス） -> 合流して選択
            {
                id: 4,
                situation: "校舎の外に出た。校舎裏に山、門側にはスクールバスが見える。\nどうする？",
                illustration: "🏃‍♂️🚍",
                choices: [
                    { text: "バスに向かう（多数で乗り込む）", nextId: 20, correct: false, timeCost: 4 },
                    { text: "山へ向かって走る（個人行動）", nextId: 21, correct: false, timeCost: 7 }
                ]
            },

            // B3: 周囲を見て津波を目撃した経路：ここは選択による救済チャンスあり
            {
                id: 10,
                situation: "外の様子を見渡すと、海岸側から黒い津波が見えた！どうする？",
                illustration: "🌊👀",
                choices: [
                    { text: "先生の指示を待つ", nextId: 30, correct: false, timeCost: 2 },
                    { text: "みんなを呼び掛けて避難する", nextId: 22, correct: true, timeCost: 3 }
                ]
            },

            // 先生指示待ちで混乱：遅れ -> 最終切迫分岐へ
            {
                id: 30,
                situation: "先生たちも意見が割れて戸惑っている。津波が迫っている！",
                illustration: "😰⏳",
                choices: [
                    { text: "先生の指示を待つ（そのまま待機）", nextId: 40, correct: false, timeCost: 3 },
                    { text: "とにかく山へ走る（全力）", nextId: 41, correct: false, timeCost: 6 }
                ]
            },

            // みんなで避難できたパターン（GroupSurvive -> good-ish）
            {
                id: 22,
                situation: "周りを呼び掛けて避難。何人かがついてきた。先導するか？",
                illustration: "👫🏃",
                choices: [
                    { text: "みんなでまとまって山へ向かう（先生と連携）", nextId: "END_K_END", correct: true, timeCost: 6 },
                    { text: "自分だけ先に登る", nextId: "END_J", correct: false, timeCost: 3 }
                ]
            },

            // 最終切迫：ここで「パニック→バス/全力で山へ（ランダム）」の分岐
            {
                id: 40,
                situation: "切迫した状況。多数がパニック状態。どうする？",
                illustration: "⚠️🏃‍♀️",
                choices: [
                    { text: "スクールバスに乗る（群衆パニック）", nextId: "END_BUS_BAD", correct: false, timeCost: 1 },
                    // special random choice: success or failure depends on残り時間
                    { text: "校舎裏の山に全力で逃げる", nextId: "SPECIAL_RUN_RANDOM", correct: true, timeCost: 2, special: "random" }
                ]
            },

            // SPECIAL: RunRandom の成功/失敗先（これら are ends）
            // (ここでは nextId を END トークンで示す。showResult で処理)
            // 逃げたが間に合えば END_K_END、間に合わなければ END_D/END_TSUNAMI など

            // バスに乗って避難 -> バスごと飲み込まれる（bad）
            { id: 20,
                situation: "バスに乗り込み避難を試みたが、津波が川を遡上してくる！",
                illustration: "🚍🌊",
                choices: [
                    { text: "---", nextId: "END_BUS_BAD", correct: false, timeCost: 0 },
                    { text: "---", nextId: "END_BUS_BAD", correct: false, timeCost: 0 }
                ]
            },

            // 一人で山へ向かい、結果的に自分だけ助かるパターン
            { id: 21,
                situation: "一人で山へ登った。向こうから迫る津波が見える。",
                illustration: "🏃‍♂️⛰️",
                choices: [
                    { text: "---", nextId: "END_J", correct: false, timeCost: 0 },
                    { text: "---", nextId: "END_J", correct: false, timeCost: 0 }
                ]
            },

            // 強引に山へ向かってギリギリ助かる成功エンド（good）
            { id: 41,
                situation: "全力で山へ走った！間一髪か...",
                illustration: "🏃‍♀️⛰️",
                choices: [
                    { text: "---", nextId: "SPECIAL_RUN_RANDOM", correct: true, timeCost: 0 },
                    { text: "---", nextId: "SPECIAL_RUN_RANDOM", correct: true, timeCost: 0 }
                ]
            }
        ]
    },

    oomiya: {
        // 池井戸小 -> 大宮国際に名称変更（テキスト・選択肢の語彙も更新）
        name: "大宮国際コース（避難の教訓／奇跡）",
        initialTime: 55,
        endDefinitions: {
            // 簡易定義（大川小と同種の一覧を持つ）
            hero: { title: "ヒーロールート", weight: 6, description: "みんなを導いて多数救助した。" },
            k_end: { title: "クラス全員助かる", weight: 12, description: "冷静な判断と連携で全員が無事に。" },
            j: { title: "個別生存だが犠牲者あり", weight: 5, description: "個人的には助かったが大多数が..." },
            d: { title: "避難失敗", weight: 2, description: "判断ミス・時間切れで大きな被害。" },
            tsunami: { title: "津波直撃", weight: 0.5, description: "時間切れで津波に呑まれた。" }
        },
        scenarios: [
            {
                id: 1,
                situation: "【大宮国際】地震発生。学校は海岸から近い。どこへ逃げますか？",
                illustration: "🏫🌊",
                choices: [
                    { text: "近くの高台（遠いが安全）へ走る", nextId: 2, correct: true, timeCost: 8 },
                    { text: "校舎の屋上へ避難する", nextId: 3, correct: false, timeCost: 2 }
                ]
            },
            {
                id: 2,
                situation: "道中で低学年が遅れる。どう対応する？",
                illustration: "🤝🏃‍♀️",
                choices: [
                    { text: "高学年が手を引いて一緒に走る", nextId: "END_K_END", correct: true, timeCost: 5 },
                    { text: "自分だけ先に行く", nextId: "END_J", correct: false, timeCost: 2 }
                ]
            },
            {
                id: 3,
                situation: "屋上に避難したが、水位上昇が早い。どうする？",
                illustration: "🏢🌊",
                choices: [
                    { text: "屋上で待つ（安全だと信じる）", nextId: "END_D", correct: false, timeCost: 3 },
                    { text: "やはり遠い高台へ向かう", nextId: 2, correct: true, timeCost: 10 }
                ]
            }
        ]
    }
};

// 以下はゲーム実行ロジックの改修部分
let scenarios = []; // 現在のコースのシナリオ配列（参照）
let scenarioMap = {}; // id -> scenario object
let currentScenarioId = null;
let isGameActive = false;
let isCourseSelection = false;
let score = 0;
let hp = 3;
let timeLeft = 0;
let initialTimeForCourse = 0;
let currentCourseKey = null;

// DOM要素
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

// スタイル注入はそのまま使えるので省略（既存関数を流用）
function injectGameStyles() {
    const style = document.createElement('style');
    style.textContent = `
        body { background-color: #1a1a1a; color: #ecf0f1; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .game-container { max-width: 800px; margin: 0 auto; padding: 20px; background: #2c3e50; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.8); border: 2px solid #555;}
        h1 { text-align: center; color: #c0392b; text-shadow: 2px 2px 0 #000; font-size: 2.5rem; }
        .hud { display:flex; justify-content:space-between; background:#000; padding:12px; border-radius:8px; margin-bottom:12px; border:1px solid #c0392b; font-weight:bold; font-family: 'Courier New', monospace; }
        .hp-bar { color:#e74c3c; }
        .illustration { background:#34495e; border-radius:10px; padding:30px; text-align:center; margin-bottom:20px; border:4px solid #7f8c8d; min-height:120px; display:flex; align-items:center; justify-content:center; }
        .choice-btn { display:block; width:100%; padding:20px; margin:12px 0; background:#2980b9; color:white; border:none; border-radius:8px; font-size:1.1rem; cursor:pointer; text-align:left; box-shadow:0 6px 0 #1a5276; }
        .hidden { display:none !important; }
        #result-screen.success { background:#27ae60; padding:20px; border-radius:10px; border:2px solid #2ecc71; }
        #result-screen.failure { background:#641e16; padding:20px; border-radius:10px; border:2px solid #c0392b; }
    `;
    document.head.appendChild(style);

    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.innerHTML = `<span class="hp-bar">HP: ❤️❤️❤️</span><span id="game-progress">COURSE SELECT</span><span class="score-board">SCORE: 0</span>`;
    const container = document.querySelector('.game-container');
    const mainContent = document.querySelector('.game-main');
    if (container && mainContent) container.insertBefore(hud, mainContent);
    if (progressEl) progressEl.classList.add('hidden');
}

function startGame() {
    currentScenarioId = null;
    isGameActive = true;
    isCourseSelection = true;
    score = 0;
    hp = 3;
    timeLeft = 0;
    initialTimeForCourse = 0;
    currentCourseKey = null;

    // 画面切り替え
    startScreenEl.classList.add('hidden');
    resultScreenEl.classList.add('hidden');
    choicesEl.classList.remove('hidden');

    updateHUD();
    showCourseSelection();
}

function updateHUD() {
    const hpStr = '❤️'.repeat(Math.max(0, hp));
    const hpEl = document.querySelector('.hp-bar');
    const scoreEl = document.querySelector('.score-board');
    if (hpEl) hpEl.textContent = `HP: ${hpStr}`;
    if (scoreEl) scoreEl.textContent = `SCORE: ${score}`;
    const prog = document.getElementById('game-progress');
    if (prog) {
        if (!isCourseSelection) {
            prog.textContent = `STAGE ${currentScenarioId}`;
        } else {
            prog.textContent = `COURSE SELECT`;
        }
    }
}

// コース選択表示（名称変更：池井戸小->大宮国際）
function showCourseSelection() {
    progressEl.textContent = "コース選択";
    illustrationEl.innerHTML = `<span style="font-size: 3rem;">🏫⚖️</span>`;
    scenarioTextEl.innerHTML = "避難シミュレーションを開始します。体験するコースを選んでください。";

    choice1El.textContent = courses.okawa.name;
    choice1El.dataset.course = "okawa";
    choice2El.textContent = courses.oomiya.name;
    choice2El.dataset.course = "oomiya";

    choicesEl.classList.remove('animate');
    choicesEl.getBoundingClientRect();
    choicesEl.classList.add('animate');
}

// シナリオ準備（選択したコースの scenarios 配列を map に変換）
function prepareScenariosForCourse(courseKey) {
    const course = courses[courseKey];
    scenarios = course.scenarios;
    scenarioMap = {};
    scenarios.forEach(s => { scenarioMap[String(s.id)] = s; });
    initialTimeForCourse = course.initialTime || 40;
    timeLeft = initialTimeForCourse;
    currentCourseKey = courseKey;
}

// シナリオ表示（現在の id を参照）
function showScenario() {
    const scenario = scenarioMap[String(currentScenarioId)];
    if (!scenario) {
        showResult(false, { wrongMessage: "不明なシナリオです。", wrongReason: "" });
        return;
    }

    if (progressEl) progressEl.textContent = `残り時間: ${timeLeft}  STAGE:${scenario.id}`;

    illustrationEl.innerHTML = `<span style="font-size: 3.5rem;">${scenario.illustration}</span>`;
    scenarioTextEl.innerHTML = scenario.situation.replace(/\n/g, '<br>');

    // 2択UIにマッピング（存在しない場合は dummy を表示）
    const c1 = scenario.choices[0] || { text: "---", nextId: null, timeCost: 0 };
    const c2 = scenario.choices[1] || { text: "---", nextId: null, timeCost: 0 };

    choice1El.textContent = c1.text;
    choice1El.dataset.next = String(c1.nextId);
    choice1El.dataset.timecost = String(c1.timeCost || 0);
    choice1El.dataset.special = c1.special || "";
    choice1El.dataset.correct = String(!!c1.correct);

    choice2El.textContent = c2.text;
    choice2El.dataset.next = String(c2.nextId);
    choice2El.dataset.timecost = String(c2.timeCost || 0);
    choice2El.dataset.special = c2.special || "";
    choice2El.dataset.correct = String(!!c2.correct);

    choicesEl.classList.remove('animate');
    choicesEl.getBoundingClientRect();
    choicesEl.classList.add('animate');
}

// 選択処理（2択ボタンからの呼び出し）
function makeChoice(choiceNum) {
    if (!isGameActive) return;
    const choiceEl = choiceNum === 1 ? choice1El : choice2El;

    // コース選択時
    if (isCourseSelection) {
        const selectedCourse = choiceEl.dataset.course;
        if (selectedCourse) {
            isCourseSelection = false;
            prepareScenariosForCourse(selectedCourse);
            // start at id 1 (assumption)
            currentScenarioId = 1;
            showScenario();
            updateHUD();
        }
        return;
    }

    // 通常選択時
    const nextIdRaw = choiceEl.dataset.next;
    const timeCost = parseFloat(choiceEl.dataset.timecost || "0");
    const special = choiceEl.dataset.special || "";

    // 時間消費
    timeLeft -= timeCost;
    if (timeLeft <= 0) {
        // 津波到達：即時エンド
        showResult(false, { endKey: "tsunami", reason: "時間切れ（津波到達）" });
        return;
    }

    // special handling (random escape)
    if (special === "random") {
        // 生存確率は残り時間 / initialTime（最大1）をベースに補正
        const baseProb = Math.max(0, Math.min(1, timeLeft / initialTimeForCourse));
        // 少し運要素を加味
        const successChance = 0.3 + 0.7 * baseProb; // minimum 0.3, maximum 1.0
        const roll = Math.random();
        if (roll < successChance) {
            // 成功（間一髪で助かる）
            showResult(true, { endKey: "k_end", reason: `全力で山へ逃げ、残り時間 ${Math.round(timeLeft)} により成功（確率 ${Math.round(successChance*100)}%）` });
            return;
        } else {
            // 失敗（飲み込まれる）
            showResult(false, { endKey: "d", reason: `全力で走ったが間に合わなかった（成功確率 ${Math.round(successChance*100)}%）` });
            return;
        }
    }

    // nextId が END トークンならエンド処理
    if (!nextIdRaw || nextIdRaw === "null" || nextIdRaw === "undefined") {
        showResult(false, { wrongMessage: "行き先がありません。", wrongReason: "" });
        return;
    }

    // handle direct END tokens beginning with "END_"
    if (String(nextIdRaw).startsWith("END_")) {
        const endKey = String(nextIdRaw).replace(/^END_/, '').toLowerCase();
        // 成功/失敗の判定はエンドキーに応じて
        const successEnds = ["k_end", "hero"];
        const isSuccess = successEnds.includes(endKey);
        // find end description from course definitions
        const course = courses[currentCourseKey];
        const endDef = (course && course.endDefinitions && course.endDefinitions[endKey]) || null;
        const reasonText = endDef ? endDef.description : "選択によりエンド到達";
        showResult(isSuccess, { endKey: endKey, reason: reasonText });
        return;
    }

    // 通常の次シナリオ遷移
    const nextId = Number(nextIdRaw);
    if (isFinite(nextId) && scenarioMap[String(nextId)]) {
        currentScenarioId = nextId;
        // スコア加算（正しい選択などに応じて増やす）
        if (choiceEl.dataset.correct === 'true') score += 100;
        updateHUD();
        showScenario();
    } else {
        showResult(false, { wrongMessage: "遷移先のシナリオが見つかりません。", wrongReason: "" });
    }
}

// 結果表示（はじめに簡易な成功/失敗フラグ表示、その後エンド別開放率と理由を表示）
function showResult(isSuccess, info = {}) {
    isGameActive = false;
    choicesEl.classList.add('hidden');

    resultScreenEl.classList.remove('hidden', 'success', 'failure');
    resultScreenEl.classList.add(isSuccess ? 'success' : 'failure');

    const course = courses[currentCourseKey] || null;
    const endKey = info.endKey || null;
    const reason = info.reason || info.wrongReason || info.wrongMessage || "";

    // メインメッセージ
    if (isSuccess) {
        resultIconEl.textContent = '🎉';
        resultTitleEl.textContent = '避難成功！';
        resultMessageEl.innerHTML = `
            おめでとうございます！<br>
            成功エンド: ${endKey || '成功'}<br>
            理由: ${reason}<br><br>
            スコア: ${score}
        `;
    } else {
        resultIconEl.textContent = '😢';
        resultTitleEl.textContent = 'ゲームオーバー';
        resultMessageEl.innerHTML = `
            エンド: ${endKey || '失敗'}<br>
            理由: ${reason}<br><br>
            残り時間: ${timeLeft <= 0 ? 0 : Math.round(timeLeft)}<br>
            HP: ${hp}
        `;
    }

    // エンド開放率（簡易的な重み付けに基づく算出）と各エンドの解説を付与
    if (course && course.endDefinitions) {
        const defs = course.endDefinitions;
        let totalWeight = 0;
        Object.values(defs).forEach(d => { totalWeight += (d.weight || 0); });
        // safety
        if (totalWeight <= 0) totalWeight = 1;
        let rateHtml = "<hr><strong>エンド開放率（参考値）</strong><br><ul>";
        for (const [k, v] of Object.entries(defs)) {
            const pct = ((v.weight || 0) / totalWeight * 100);
            rateHtml += `<li>${v.title}: ${pct.toFixed(1)}% — ${v.description}</li>`;
        }
        rateHtml += "</ul>";
        resultMessageEl.innerHTML += rateHtml;
    }

    // 最終的な該当エンドの理由説明（より詳細に）
    if (endKey) {
        resultMessageEl.innerHTML += `<hr><strong>このエンドになった典型的な理由</strong><br>`;
        const courseDef = course && course.endDefinitions && course.endDefinitions[endKey];
        if (courseDef) {
            resultMessageEl.innerHTML += `${courseDef.description}<br>`;
        } else {
            resultMessageEl.innerHTML += `${reason}<br>`;
        }
    }

    // 画面に「もう一度」や「最初へ戻る」ボタンを設置しても良い（実装は省く）
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    injectGameStyles();
    // 初期状態では選択肢を非表示
    choicesEl.classList.add('hidden');

    // ボタンイベントバインド（想定：HTML に onclick で makeChoice(1/2) を呼ぶ実装でもOK）
    if (choice1El) choice1El.addEventListener('click', () => makeChoice(1));
    if (choice2El) choice2El.addEventListener('click', () => makeChoice(2));
});
