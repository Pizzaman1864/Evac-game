// ゲームシナリオデータ
const scenarios = [
    {
        id: 1,
        situation: "突然、大きな揺れが！地震です！\n家の中にいるあなた。まず何をしますか？",
        illustration: "🏠💥",
        choices: [
            { text: "机やテーブルの下に隠れて、頭を守る", correct: true },
            { text: "すぐに外へ飛び出す", correct: false }
        ],
        correctMessage: "正解！揺れている間は、落下物から頭を守ることが最優先です。",
        wrongMessage: "外に飛び出すのは危険です。落下物や割れたガラスでケガをする恐れがあります。",
        wrongReason: "揺れている最中に外に出ると、屋根瓦やガラス、看板などの落下物に当たる危険があります。"
    },
    {
        id: 2,
        situation: "揺れが収まりました。\n次に何をしますか？",
        illustration: "🚪🏃",
        choices: [
            { text: "すぐに避難を開始する", correct: true },
            { text: "非常用持ち出し袋を取りに家の奥へ戻る", correct: false }
        ],
        correctMessage: "正解！津波の危険がある地域では、すぐに避難を開始することが大切です。",
        wrongMessage: "余震や津波の危険があります。持ち出し袋より命を優先しましょう。",
        wrongReason: "余震で建物が崩壊する危険や、津波到達までの時間が限られています。"
    },
    {
        id: 3,
        situation: "「津波警報」が発令されました！\nどこへ避難しますか？",
        illustration: "🌊⚠️",
        choices: [
            { text: "高台や津波避難ビルへ向かう", correct: true },
            { text: "海岸沿いの道を通って避難所へ向かう", correct: false }
        ],
        correctMessage: "正解！津波から逃れるには、とにかく高い場所へ避難することが重要です。",
        wrongMessage: "海岸沿いは津波の直撃を受けます。絶対に近づいてはいけません。",
        wrongReason: "津波は海岸線に沿って襲ってきます。海岸沿いの道は最も危険な場所です。"
    },
    {
        id: 4,
        situation: "避難途中、車で逃げようとしている人を見かけました。\nあなたはどうしますか？",
        illustration: "🚗🚶",
        choices: [
            { text: "徒歩で高台を目指す", correct: true },
            { text: "車に乗せてもらう", correct: false }
        ],
        correctMessage: "正解！避難時は渋滞の恐れがある車より、徒歩の方が確実です。",
        wrongMessage: "車での避難は渋滞に巻き込まれる危険があります。",
        wrongReason: "大規模災害時は道路が渋滞し、車が動けなくなることが多いです。徒歩の方が確実に避難できます。"
    },
    {
        id: 5,
        situation: "高台への道の途中で、足を怪我した人がいます。\nどうしますか？",
        illustration: "🤕🆘",
        choices: [
            { text: "声をかけて、一緒に避難を手伝う", correct: true },
            { text: "自分だけ先に逃げる", correct: false }
        ],
        correctMessage: "正解！助け合いの精神が大切です。ただし、自分の安全も確保しながら行動しましょう。",
        wrongMessage: "助け合いは大切ですが、まずは一声かけて状況を確認することが重要です。",
        wrongReason: "災害時こそ助け合いが大切です。可能な範囲で声をかけ、協力して避難しましょう。"
    },
    {
        id: 6,
        situation: "高台に到着！でも津波警報はまだ解除されていません。\nどうしますか？",
        illustration: "⛰️📻",
        choices: [
            { text: "警報が解除されるまで、高台で待機する", correct: true },
            { text: "津波が来ないようなので、家の様子を見に戻る", correct: false }
        ],
        correctMessage: "正解！警報が解除されるまで、安全な場所で待機することが重要です。",
        wrongMessage: "第2波、第3波の津波が来る可能性があります。警報解除まで戻ってはいけません。",
        wrongReason: "津波は複数回押し寄せることがあり、後から来る波の方が大きいこともあります。"
    }
];

// ゲーム状態
let currentScenario = 0;
let isGameActive = false;

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

// ゲーム開始
function startGame() {
    currentScenario = 0;
    isGameActive = true;
    
    // 画面切り替え
    startScreenEl.classList.add('hidden');
    resultScreenEl.classList.add('hidden');
    choicesEl.classList.remove('hidden');
    
    // 最初のシナリオを表示
    showScenario();
}

// シナリオ表示
function showScenario() {
    const scenario = scenarios[currentScenario];
    
    // 進行状況更新
    progressEl.textContent = `選択 ${currentScenario + 1}/6`;
    
    // イラスト更新
    illustrationEl.innerHTML = `<span style="font-size: 3rem;">${scenario.illustration}</span>`;
    
    // シナリオテキスト更新（改行対応）
    scenarioTextEl.innerHTML = scenario.situation.replace(/\n/g, '<br>');
    
    // 選択肢をランダムに配置
    const shuffledChoices = shuffleChoices(scenario.choices);
    choice1El.textContent = shuffledChoices[0].text;
    choice1El.dataset.correct = shuffledChoices[0].correct;
    choice2El.textContent = shuffledChoices[1].text;
    choice2El.dataset.correct = shuffledChoices[1].correct;
    
    // アニメーション
    choicesEl.classList.remove('animate');
    choicesEl.getBoundingClientRect(); // リフロー強制
    choicesEl.classList.add('animate');
}

// 選択肢をシャッフル
function shuffleChoices(choices) {
    const shuffled = [...choices];
    if (Math.random() > 0.5) {
        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    return shuffled;
}

// 選択処理
function makeChoice(choiceNum) {
    if (!isGameActive) return;
    
    const choiceEl = choiceNum === 1 ? choice1El : choice2El;
    const isCorrect = choiceEl.dataset.correct === 'true';
    const scenario = scenarios[currentScenario];
    
    if (isCorrect) {
        // 正解
        currentScenario++;
        
        if (currentScenario >= scenarios.length) {
            // ゲームクリア
            showResult(true);
        } else {
            // 次のシナリオへ
            showScenario();
        }
    } else {
        // 不正解 - ゲームオーバー
        showResult(false, scenario);
    }
}

// 結果表示
function showResult(isSuccess, scenario = null) {
    isGameActive = false;
    choicesEl.classList.add('hidden');
    
    resultScreenEl.classList.remove('hidden', 'success', 'failure');
    resultScreenEl.classList.add(isSuccess ? 'success' : 'failure');
    
    if (isSuccess) {
        resultIconEl.textContent = '🎉';
        resultTitleEl.textContent = '避難成功！';
        resultMessageEl.innerHTML = `
            おめでとうございます！<br>
            全ての選択で正しい判断ができました。<br><br>
            実際の災害時も、冷静に正しい判断をして<br>
            自分と周りの人の命を守りましょう。
        `;
    } else {
        resultIconEl.textContent = '😢';
        resultTitleEl.textContent = 'ゲームオーバー';
        resultMessageEl.innerHTML = `
            ${scenario.wrongMessage}<br><br>
            <strong>覚えておこう：</strong><br>
            ${scenario.wrongReason}
        `;
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // 初期状態では選択肢を非表示
    choicesEl.classList.add('hidden');
});
