// ゲームシナリオデータ
// 史実に基づきつつ、防災知識を問うシナリオを大幅に追加
const courses = {
    okawa: [
        // --- 発災直後 ---
        {
            id: 1,
            situation: "【大川小コース：発災】\n激しい揺れが続いています。教室にいるあなたはどうしますか？",
            illustration: "🏫🏚️",
            choices: [
                { text: "机の下に入り、脚を持って頭を守る", correct: true },
                { text: "慌てて廊下へ飛び出す", correct: false }
            ],
            correctMessage: "正解！落下物から身を守るのが最優先です。",
            wrongMessage: "危険！飛び出すと落下物や転倒の危険があります。",
            wrongReason: "揺れが収まるまでは、頭を守って動かないことが鉄則です。"
        },
        {
            id: 2,
            situation: "【大川小コース：避難開始】\n揺れが収まりました。校庭へ避難します。\n上履きのままですか？靴に履き替えますか？",
            illustration: "👟💨",
            choices: [
                { text: "上履きのまま急いで出る", correct: true },
                { text: "下駄箱で靴に履き替える", correct: false }
            ],
            correctMessage: "正解！ガラス片などが散乱している可能性がありますが、スピード優先です。",
            wrongMessage: "タイムロスです。下駄箱が倒壊している恐れもあります。",
            wrongReason: "避難時は一刻を争います。上履きのままでも構いません。"
        },
        {
            id: 3,
            situation: "【大川小コース：校庭】\n校庭に集まりました。点呼が始まりましたが、余震が続いています。\n裏山はすぐそこです。",
            illustration: "⛰️👀",
            choices: [
                { text: "先生に「山へ逃げよう」と提案する", correct: true },
                { text: "静かに座って待つ", correct: false }
            ],
            correctMessage: "正解！ここでの提案が生死を分ける可能性があります。",
            wrongMessage: "指示待ちが危険な状況です。",
            wrongReason: "大川小の悲劇は、校庭での待機時間が長かったことが一因と言われています。"
        },
        // --- 待機時間（葛藤） ---
        {
            id: 4,
            situation: "【大川小コース：情報】\n防災無線から「大津波警報」が聞こえます。\nしかし「ここは避難所だから安全だ」という大人もいます。",
            illustration: "📻🗣️",
            choices: [
                { text: "「警報が出ているから逃げよう」と叫ぶ", correct: true },
                { text: "大人の言うことを信じる", correct: false }
            ],
            correctMessage: "正解！正常性バイアス（自分は大丈夫と思い込むこと）に抗う必要があります。",
            wrongMessage: "危険です。ハザードマップが絶対ではありません。",
            wrongReason: "想定外の災害では、過去の常識が通用しないことがあります。"
        },
        {
            id: 5,
            situation: "【大川小コース：寒さ】\n雪がちらついてきました。寒くて震えが止まりません。",
            illustration: "❄️🥶",
            choices: [
                { text: "お互いに体を寄せ合って温める", correct: true },
                { text: "一人で我慢する", correct: false }
            ],
            correctMessage: "正解！低体温症を防ぐため、体温を維持することが重要です。",
            wrongMessage: "体力を消耗してしまいます。",
            wrongReason: "避難が長期化する場合、寒さ対策も命に関わります。"
        },
        // --- 運命の分岐点 ---
        {
            id: 6,
            situation: "【大川小コース：移動開始】\nようやく移動することになりました。\n向かう先は「橋のたもと（三角地帯）」か「裏山」か。",
            illustration: "🌉⛰️",
            choices: [
                { text: "「山へ行こう！」と叫んで山へ向かう", correct: true },
                { text: "列について橋のたもとへ向かう", correct: false }
            ],
            correctMessage: "正解！とにかく高いところへ。",
            wrongMessage: "そこは津波が遡上してくる危険地帯でした...",
            wrongReason: "川沿いの低地は、津波のエネルギーが集中する最も危険な場所の一つです。"
        },
        {
            id: 7,
            situation: "【大川小コース：津波襲来】\n黒い水が迫ってきました！\n斜面は急で、雪で滑ります。",
            illustration: "🌊😱",
            choices: [
                { text: "木の根や草を掴んで、這ってでも登る", correct: true },
                { text: "荷物を持って慎重に登る", correct: false }
            ],
            correctMessage: "正解！荷物は捨てて、身一つで登ってください。",
            wrongMessage: "荷物は捨ててください！命より重いものはありません。",
            wrongReason: "津波は時速数十キロで迫ります。一瞬の遅れが命取りです。"
        },
        // ... 他にも多数のシナリオを追加（ここでは代表例を置いています）
        {
            id: 8,
            situation: "【サバイバル：孤立】\nなんとか助かりましたが、周囲は水没し孤立しました。\n夜になります。",
            illustration: "🌑🆘",
            choices: [
                { text: "体力を温存し、高い場所で朝を待つ", correct: true },
                { text: "暗い中、泳いで助けを呼びに行く", correct: false }
            ],
            correctMessage: "正解！夜間の移動、特に水の中は自殺行為です。",
            wrongMessage: "絶対にダメです。瓦礫や見えない穴があり危険です。",
            wrongReason: "救助が来るまで、まずは自分の命をつなぐことが最優先です。"
        }
    ],
    ikeido: [
        {
            id: 1,
            situation: "【池井戸小コース】\n地震発生。学校は海岸からわずか300mです。\n大津波警報が出ました。どこへ逃げますか？",
            illustration: "🏫🌊",
            choices: [
                { text: "1.5km先の山（大平山）へ走る", correct: true },
                { text: "頑丈な校舎の屋上へ避難する", correct: false }
            ],
            correctMessage: "正解！海岸に近い場所では、建物ごと流される危険があります。遠くても確実な高台へ。",
            wrongMessage: "危険です。\n想定を超える津波では、校舎の屋上でも水没したり孤立したりする恐れがあります。",
            wrongReason: "史実（請戸小）では、全員で遠くの山へ走って避難し、奇跡的に助かりました。"
        },
        {
            id: 2,
            situation: "【池井戸小コース】\n山への道のりは遠く、低学年の子が遅れそうです。\nどうしますか？",
            illustration: "🤝🏃‍♀️",
            choices: [
                { text: "高学年が手を引いて一緒に走る", correct: true },
                { text: "自分のことだけ考えて走る", correct: false }
            ],
            correctMessage: "正解！「釜石の奇跡」などでも見られたように、上級生が下級生を助けることが全員の命を救います。",
            wrongMessage: "協力が必要です。\n災害時こそ、助け合いが全体の避難速度を上げ、生存率を高めます。",
            wrongReason: "日頃からの避難訓練と、助け合いの精神が奇跡を生みました。"
        },
        {
            id: 3,
            situation: "【池井戸小コース】\n山の麓まで来ましたが、津波の黒い水が見えました。\nどうしますか？",
            illustration: "⛰️👀",
            choices: [
                { text: "さらに上へ、頂上を目指して走る", correct: true },
                { text: "ここまで来れば安心だと一息つく", correct: false }
            ],
            correctMessage: "正解！「津波てんでんこ」。津波は予想を超えてきます。可能な限り高いところへ。",
            wrongMessage: "油断大敵です。\n津波は陸地を駆け上がる勢いがあります。ギリギリまで高い場所へ。",
            wrongReason: "史実でも、山へ逃げた後、さらにトラックに乗せてもらい遠くへ逃げ延びました。"
        }
    ]
};

let scenarios = []; // 現在選択されているコースのシナリオ
let currentScenario = 0;
let isGameActive = false;
let isCourseSelection = false;
let score = 0;
let hp = 3; // ライフ制導入
let survivalRate = 100; // 生存確率
let gameTimer = null;

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

// === GameTimer Class ===
class GameTimer {
    constructor(duration, onTick, onEnd) {
        this.duration = duration;
        this.remaining = duration;
        this.onTick = onTick;
        this.onEnd = onEnd;
        this.intervalId = null;
        this.isRunning = false;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.remaining -= 0.1;
            if (this.remaining <= 0) {
                this.remaining = 0;
                this.stop();
                if (this.onEnd) this.onEnd();
            }
            if (this.onTick) this.onTick(this.remaining, this.duration);
        }, 100);
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }
    
    reset(newDuration) {
        this.stop();
        this.duration = newDuration || this.duration;
        this.remaining = this.duration;
    }
    
    getProgress() {
        return (this.remaining / this.duration) * 100;
    }
}

// === AudioFX Class ===
class AudioFX {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }
    
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.value = volume;
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playRumble() {
        // 低音の地鳴り
        this.playTone(60, 0.5, 'sawtooth', 0.2);
        setTimeout(() => this.playTone(55, 0.5, 'sawtooth', 0.15), 100);
    }
    
    playAlert() {
        // 高音の警告音
        this.playTone(800, 0.2, 'square', 0.3);
        setTimeout(() => this.playTone(1000, 0.2, 'square', 0.3), 250);
    }
    
    playSuccess() {
        // 成功音（上昇音階）
        this.playTone(523, 0.15, 'sine', 0.2); // C
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.2), 150); // E
        setTimeout(() => this.playTone(784, 0.2, 'sine', 0.2), 300); // G
    }
    
    playDamage() {
        // ダメージ音（下降音）
        this.playTone(400, 0.3, 'sawtooth', 0.3);
    }
    
    playGameOver() {
        // ゲームオーバー音
        this.playTone(200, 0.8, 'triangle', 0.3);
    }
}

// === VisualFX Functions ===
const VisualFX = {
    shakeScreen() {
        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 500);
    },
    
    flashRed() {
        const flash = document.createElement('div');
        flash.className = 'red-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
    },
    
    async typewriterText(element, text, speed = 30) {
        element.innerHTML = '';
        const lines = text.split('<br>');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            for (let j = 0; j < line.length; j++) {
                element.innerHTML += line[j];
                await new Promise(resolve => setTimeout(resolve, speed));
            }
            if (i < lines.length - 1) {
                element.innerHTML += '<br>';
            }
        }
    }
};

// Initialize audio
const audioFX = new AudioFX();

// ゲーム風スタイルを注入
function injectGameStyles() {
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-color: #1a1a1a;
            color: #ecf0f1;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .game-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #2c3e50;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.8);
            border: 2px solid #555;
        }
        h1 { text-align: center; color: #c0392b; text-shadow: 2px 2px 0 #000; font-size: 2.5rem; }
        .hud {
            display: flex;
            justify-content: space-between;
            background: #000;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            border: 1px solid #c0392b;
            font-weight: bold;
            font-family: 'Courier New', monospace;
        }
        .hp-bar { color: #e74c3c; text-shadow: 0 0 5px #e74c3c; }
        .score-board { color: #f1c40f; }
        .illustration {
            background: #34495e;
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            margin-bottom: 20px;
            border: 4px solid #7f8c8d;
            min-height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .choice-btn {
            display: block;
            width: 100%;
            padding: 20px;
            margin: 15px 0;
            background: #2980b9;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: transform 0.1s, background 0.2s;
            box-shadow: 0 6px 0 #1a5276;
            text-align: left;
        }
        .choice-btn:active {
            transform: translateY(6px);
            box-shadow: none;
        }
        .choice-btn:hover { background: #3498db; }
        .hidden { display: none !important; }
        #result-screen.success { background: #27ae60; padding: 20px; border-radius: 10px; border: 2px solid #2ecc71; }
        #result-screen.failure { background: #641e16; padding: 20px; border-radius: 10px; border: 2px solid #c0392b; }
    `;
    document.head.appendChild(style);
    
    // HUDの追加
    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.innerHTML = `
        <span class="survival-rate">生存率: 100%</span>
        <span id="game-progress">STAGE 1</span>
        <span class="score-board">SCORE: 0</span>
    `;
    
    // Timer bar
    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';
    timerContainer.innerHTML = `
        <div class="timer-text">津波まであと 30秒</div>
        <div class="timer-bar">
            <div class="timer-fill"></div>
        </div>
    `;
    
    const container = document.querySelector('.game-container');
    const mainContent = document.querySelector('.game-main');
    
    if (container && mainContent) {
        container.insertBefore(hud, mainContent);
        container.insertBefore(timerContainer, mainContent);
    }
    
    if (progressEl) {
        progressEl.classList.add('hidden'); // 元のプログレスは隠す
    }
}

// ゲーム開始
function startGame() {
    currentScenario = 0;
    isGameActive = true;
    isCourseSelection = true;
    score = 0;
    hp = 3;
    survivalRate = 100;
    
    // Stop any existing timer
    if (gameTimer) {
        gameTimer.stop();
    }
    
    // 画面切り替え
    startScreenEl.classList.add('hidden');
    resultScreenEl.classList.add('hidden');
    choicesEl.classList.remove('hidden');
    
    updateHUD();
    showCourseSelection();
}

function updateHUD() {
    const survivalEl = document.querySelector('.survival-rate');
    const scoreEl = document.querySelector('.score-board');
    if (survivalEl) survivalEl.textContent = `生存率: ${survivalRate}%`;
    if (scoreEl) scoreEl.textContent = `SCORE: ${score}`;
    
    const prog = document.getElementById('game-progress');
    if (prog) {
        if (!isCourseSelection) {
            prog.textContent = `STAGE ${currentScenario + 1}/${scenarios.length}`;
        } else {
            prog.textContent = `COURSE SELECT`;
        }
    }
    
    // Update timer bar
    if (gameTimer) {
        const timerBar = document.querySelector('.timer-fill');
        const timerText = document.querySelector('.timer-text');
        if (timerBar) {
            const progress = gameTimer.getProgress();
            timerBar.style.width = progress + '%';
            // Change color based on urgency
            if (progress < 20) {
                timerBar.style.background = '#e74c3c';
            } else if (progress < 50) {
                timerBar.style.background = '#f39c12';
            } else {
                timerBar.style.background = '#27ae60';
            }
        }
        if (timerText) {
            timerText.textContent = `津波まであと ${Math.ceil(gameTimer.remaining)}秒`;
        }
    }
}

// コース選択画面表示
function showCourseSelection() {
    progressEl.textContent = "コース選択";
    illustrationEl.innerHTML = `<span style="font-size: 4rem;">🏫⚖️</span>`;
    scenarioTextEl.innerHTML = "避難シミュレーションを開始します。<br>体験したいコースを選択してください。";
    
    choice1El.textContent = "大川小学校コース（教訓）";
    choice1El.dataset.course = "okawa";
    choice2El.textContent = "池井戸小学校コース（奇跡）";
    choice2El.dataset.course = "ikeido";
    
    choicesEl.classList.remove('animate');
    choicesEl.getBoundingClientRect();
    choicesEl.classList.add('animate');
}

// シナリオ表示
async function showScenario() {
    const scenario = scenarios[currentScenario];
    
    // 進行状況更新
    if (progressEl) progressEl.textContent = `選択 ${currentScenario + 1}/${scenarios.length}`;
    
    // イラスト更新
    illustrationEl.innerHTML = `<span style="font-size: 4rem;">${scenario.illustration}</span>`;
    
    // シナリオテキスト更新（タイプライター効果）
    const formattedText = scenario.situation.replace(/\n/g, '<br>');
    await VisualFX.typewriterText(scenarioTextEl, formattedText, 20);
    
    // 選択肢をランダムに配置
    const shuffledChoices = shuffleChoices(scenario.choices);
    choice1El.textContent = shuffledChoices[0].text;
    choice1El.dataset.correct = shuffledChoices[0].correct;
    delete choice1El.dataset.course;

    choice2El.textContent = shuffledChoices[1].text;
    choice2El.dataset.correct = shuffledChoices[1].correct;
    delete choice2El.dataset.course;
    
    // アニメーション
    choicesEl.classList.remove('animate');
    choicesEl.getBoundingClientRect(); // リフロー強制
    choicesEl.classList.add('animate');
    
    // Start/Reset timer for each scenario
    if (gameTimer) {
        gameTimer.stop();
    }
    gameTimer = new GameTimer(30, updateHUD, () => {
        // Timer expired - tsunami hits
        audioFX.playGameOver();
        VisualFX.shakeScreen();
        survivalRate = 0;
        showResult(false, { wrongMessage: '時間切れ！津波が到達しました。', wrongReason: '災害時は迅速な判断が命を守ります。' });
    });
    gameTimer.start();
    updateHUD();
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

    // コース選択の処理
    if (isCourseSelection) {
        const selectedCourse = choiceEl.dataset.course;
        if (selectedCourse) {
            scenarios = courses[selectedCourse];
            isCourseSelection = false;
            audioFX.playSuccess();
            showScenario();
        }
        return;
    }
    
    const isCorrect = choiceEl.dataset.correct === 'true';
    const scenario = scenarios[currentScenario];
    
    if (isCorrect) {
        // 正解
        audioFX.playSuccess();
        score += 100;
        currentScenario++;
        
        if (currentScenario >= scenarios.length) {
            // ゲームクリア
            if (gameTimer) gameTimer.stop();
            showResult(true);
        } else {
            // 次のシナリオへ
            showScenario();
        }
    } else {
        // 不正解 - 生存率減少
        audioFX.playDamage();
        VisualFX.flashRed();
        VisualFX.shakeScreen();
        
        hp--;
        survivalRate = Math.max(0, survivalRate - 25);
        updateHUD();
        
        if (hp <= 0 || survivalRate <= 0) {
            // ゲームオーバー
            if (gameTimer) gameTimer.stop();
            audioFX.playGameOver();
            showResult(false, scenario);
        } else {
            // ダメージ演出とヒント表示（簡易的）
            alert(`不正解！生存率が減少しました。\n\n${scenario.wrongMessage}\n\n理由: ${scenario.wrongReason}`);
            currentScenario++;
            if (currentScenario >= scenarios.length) {
                if (gameTimer) gameTimer.stop();
                showResult(true);
            } else {
                showScenario();
            }
        }
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
    injectGameStyles(); // スタイル注入
    // 初期状態では選択肢を非表示
    choicesEl.classList.add('hidden');
});
