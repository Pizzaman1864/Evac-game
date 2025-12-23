// ゲームシナリオデータ
// 史実に基づきつつ、防災知識を問うシナリオを大幅に追加
const courses = {
    okawa: {
        start: {
            id: 'start',
            situation: "【大川小コース：発災】\n激しい揺れが続いています。教室にいるあなたはどうしますか？",
            illustration: "🏫🏚️",
            choices: [
                { text: "机の下に入り、脚を持って頭を守る", correct: true, nextId: 's2' },
                { text: "慌てて廊下へ飛び出す", correct: false }
            ],
            correctMessage: "正解！落下物から身を守るのが最優先です。",
            wrongMessage: "危険！飛び出すと落下物や転倒の危険があります。",
            wrongReason: "揺れが収まるまでは、頭を守って動かないことが鉄則です。"
        },
        s2: {
            id: 's2',
            situation: "【大川小コース：避難開始】\n揺れが収まりました。校庭へ避難します。\n上履きのままですか？靴に履き替えますか？",
            illustration: "👟💨",
            choices: [
                { text: "上履きのまま急いで出る", correct: true, nextId: 's3' },
                { text: "下駄箱で靴に履き替える", correct: false }
            ],
            correctMessage: "正解！ガラス片などが散乱している可能性がありますが、スピード優先です。",
            wrongMessage: "タイムロスです。下駄箱が倒壊している恐れもあります。",
            wrongReason: "避難時は一刻を争います。上履きのままでも構いません。"
        },
        s3: {
            id: 's3',
            situation: "【大川小コース：校庭】\n校庭に集まりました。点呼が始まりましたが、余震が続いています。\n裏山はすぐそこです。",
            illustration: "⛰️👀",
            choices: [
                { text: "先生に「山へ逃げよう」と提案する", correct: true, nextId: 's4' },
                { text: "静かに座って待つ", correct: false }
            ],
            correctMessage: "正解！ここでの提案が生死を分ける可能性があります。",
            wrongMessage: "指示待ちが危険な状況です。",
            wrongReason: "大川小の悲劇は、校庭での待機時間が長かったことが一因と言われています。"
        },
        s4: {
            id: 's4',
            situation: "【大川小コース：情報】\n防災無線から「大津波警報」が聞こえます。\nしかし「ここは避難所だから安全だ」という大人もいます。",
            illustration: "📻🗣️",
            choices: [
                { text: "「警報が出ているから逃げよう」と叫ぶ", correct: true, nextId: 's5' },
                { text: "大人の言うことを信じる", correct: false }
            ],
            correctMessage: "正解！正常性バイアス（自分は大丈夫と思い込むこと）に抗う必要があります。",
            wrongMessage: "危険です。ハザードマップが絶対ではありません。",
            wrongReason: "想定外の災害では、過去の常識が通用しないことがあります。"
        },
        s5: {
            id: 's5',
            situation: "【大川小コース：寒さ】\n雪がちらついてきました。寒くて震えが止まりません。",
            illustration: "❄️🥶",
            choices: [
                { text: "お互いに体を寄せ合って温める", correct: true, nextId: 's6' },
                { text: "一人で我慢する", correct: false }
            ],
            correctMessage: "正解！低体温症を防ぐため、体温を維持することが重要です。",
            wrongMessage: "体力を消耗してしまいます。",
            wrongReason: "避難が長期化する場合、寒さ対策も命に関わります。"
        },
        s6: {
            id: 's6',
            situation: "【大川小コース：移動開始】\nようやく移動することになりました。\n向かう先は「橋のたもと（三角地帯）」か「裏山」か。",
            illustration: "🌉⛰️",
            choices: [
                { text: "「山へ行こう！」と叫んで山へ向かう", correct: true, nextId: 's7' },
                { text: "列について橋のたもとへ向かう", correct: false }
            ],
            correctMessage: "正解！とにかく高いところへ。",
            wrongMessage: "そこは津波が遡上してくる危険地帯でした...",
            wrongReason: "川沿いの低地は、津波のエネルギーが集中する最も危険な場所の一つです。"
        },
        s7: {
            id: 's7',
            situation: "【大川小コース：津波襲来】\n黒い水が迫ってきました！\n斜面は急で、雪で滑ります。",
            illustration: "🌊😱",
            choices: [
                { text: "木の根や草を掴んで、這ってでも登る", correct: true, nextId: 's8' },
                { text: "荷物を持って慎重に登る", correct: false }
            ],
            correctMessage: "正解！荷物は捨てて、身一つで登ってください。",
            wrongMessage: "荷物は捨ててください！命より重いものはありません。",
            wrongReason: "津波は時速数十キロで迫ります。一瞬の遅れが命取りです。"
        },
        s8: {
            id: 's8',
            situation: "【サバイバル：孤立】\nなんとか助かりましたが、周囲は水没し孤立しました。\n夜になります。",
            illustration: "🌑🆘",
            choices: [
                { text: "体力を温存し、高い場所で朝を待つ", correct: true, nextId: 'end' },
                { text: "暗い中、泳いで助けを呼びに行く", correct: false }
            ],
            correctMessage: "正解！夜間の移動、特に水の中は自殺行為です。",
            wrongMessage: "絶対にダメです。瓦礫や見えない穴があり危険です。",
            wrongReason: "救助が来るまで、まずは自分の命をつなぐことが最優先です。"
        }
    },
    omiya: {
        start: {
            id: 'start',
            situation: "【教室サバイバル：地震発生】\n突然、激しい揺れが襲ってきた！\n教室のあちこちから物が落ちてくる。どうする？",
            illustration: "🏫⚡",
            choices: [
                { text: "A1: 出口へダッシュ！", nextId: 'panic' },
                { text: "A2: 机の下に隠れる", nextId: 'wait' },
                { text: "A3: 低い姿勢で頭を守る", nextId: 'safe' }
            ]
        },
        panic: {
            id: 'panic',
            situation: "【パニックルート】\n慌てて走り出したあなた。\n揺れで足を取られ、落下物が...",
            illustration: "😱💥",
            choices: [
                { text: "このまま突き進む", nextId: 'end', endingType: 'gameover', 
                  endingMessage: "落下物に直撃してしまった...<br><br>地震の時は慌てず、まず身を守ることが大切です。" },
                { text: "とっさに身を屈める", nextId: 'wait', hpChange: -1,
                  message: "なんとか大きなケガは避けたが、擦り傷を負ってしまった..." }
            ]
        },
        wait: {
            id: 'wait',
            situation: "【机の下ルート】\n机の下で揺れが収まるのを待った。\n揺れが収まり、周りを見渡すと...\n隣の佐藤さんが棚の下敷きになっている！",
            illustration: "📚😰",
            choices: [
                { text: "佐藤さんを助ける", nextId: 'help_sato', scoreChange: 50 },
                { text: "自分の安全を優先して避難する", nextId: 'solo_escape', scoreChange: 10 }
            ]
        },
        safe: {
            id: 'safe',
            situation: "【冷静ルート】\n低い姿勢で頭を守り、揺れが収まるのを待った。\n周囲を見ると、床に懐中電灯が落ちている。",
            illustration: "🔦✨",
            choices: [
                { text: "懐中電灯を拾う", nextId: 'get_light', giveItem: 'flashlight', scoreChange: 30 },
                { text: "すぐに避難する", nextId: 'quick_escape' }
            ]
        },
        help_sato: {
            id: 'help_sato',
            situation: "【仲間ルート】\n佐藤さんを助け出した！\n「ありがとう！一緒に逃げよう！」\n二人で協力して避難することに。",
            illustration: "🤝😊",
            choices: [
                { text: "階段で避難", nextId: 'stairs_with_sato' },
                { text: "窓から外へ", nextId: 'window_escape' }
            ]
        },
        solo_escape: {
            id: 'solo_escape',
            situation: "【単独ルート】\nあなたは一人で避難を開始した。\n廊下は暗く、割れたガラスが散乱している。",
            illustration: "🚶💨",
            choices: [
                { text: "慎重に進む", nextId: 'careful_solo', hpChange: -1,
                  message: "ガラスで足に軽い傷を負ってしまった..." },
                { text: "急いで走る", nextId: 'end', endingType: 'injury',
                  endingMessage: "急いだせいで転倒し、大きなケガをしてしまった...<br><br>焦りは禁物。冷静に行動しましょう。" }
            ]
        },
        get_light: {
            id: 'get_light',
            situation: "【アイテム獲得】\n懐中電灯を手に入れた！\n暗い廊下も安全に進めそうだ。",
            illustration: "🔦👍",
            choices: [
                { text: "避難経路を探す", nextId: 'hero_path' }
            ]
        },
        quick_escape: {
            id: 'quick_escape',
            situation: "【スピード重視】\nすぐに避難を開始。\n廊下で他の生徒たちが立ち往生している。",
            illustration: "😰👥",
            choices: [
                { text: "助けを呼びかける", nextId: 'help_others', scoreChange: 30 },
                { text: "自分だけ先に進む", nextId: 'selfish_end', scoreChange: -20 }
            ]
        },
        stairs_with_sato: {
            id: 'stairs_with_sato',
            situation: "【協力避難】\n佐藤さんと一緒に階段を降りる。\n途中、小さな子供が泣いている。",
            illustration: "👶😢",
            choices: [
                { text: "子供も一緒に連れて行く", nextId: 'end', endingType: 'hero', scoreChange: 100,
                  endingMessage: "あなたは佐藤さんと子供を無事に避難させた！<br><br>思いやりと勇気のある行動でした。素晴らしい！" },
                { text: "佐藤さんと二人で避難", nextId: 'end', endingType: 'solo', scoreChange: 50,
                  endingMessage: "あなたと佐藤さんは無事避難できた。<br><br>仲間と協力できましたね。" }
            ]
        },
        window_escape: {
            id: 'window_escape',
            situation: "【窓ルート】\n窓から外に出ようとしたが、2階の高さがある...",
            illustration: "🪟😰",
            choices: [
                { text: "慎重に降りる", nextId: 'end', endingType: 'injury', hpChange: -1,
                  endingMessage: "なんとか降りたが、足を捻挫してしまった...<br><br>無理な避難は危険です。" },
                { text: "やめて階段に向かう", nextId: 'stairs_with_sato' }
            ]
        },
        careful_solo: {
            id: 'careful_solo',
            situation: "【慎重な単独避難】\n慎重に進み、なんとか階段まで到達。\n外の光が見えてきた。",
            illustration: "🚪✨",
            choices: [
                { text: "外へ出る", nextId: 'end', endingType: 'solo',
                  endingMessage: "あなたは一人で無事避難できた。<br><br>生き延びることができました。" }
            ]
        },
        hero_path: {
            id: 'hero_path',
            situation: "【ヒーロールート】\n懐中電灯で周囲を照らすと、閉じ込められた生徒たちを発見！\nあなたの明かりで皆を誘導できる。",
            illustration: "🔦👥✨",
            choices: [
                { text: "みんなを導く", nextId: 'end', endingType: 'hero', scoreChange: 150,
                  endingMessage: "あなたの冷静な判断と勇気で、多くの仲間を救うことができた！<br><br>真のヒーローです！素晴らしい！" }
            ]
        },
        help_others: {
            id: 'help_others',
            situation: "【協力者】\n声をかけると、みんなが落ち着きを取り戻した。\n一緒に避難しよう！",
            illustration: "🤝👥",
            choices: [
                { text: "みんなで避難する", nextId: 'end', endingType: 'hero', scoreChange: 80,
                  endingMessage: "協力して全員が無事避難できた！<br><br>チームワークが大切ですね！" }
            ]
        },
        selfish_end: {
            id: 'selfish_end',
            situation: "【自己中心的な行動】\n一人で先に進んだあなた。\n後ろから悲鳴が聞こえたが...",
            illustration: "😔💭",
            choices: [
                { text: "このまま避難する", nextId: 'end', endingType: 'solo',
                  endingMessage: "あなたは助かったが、後悔が残る避難だった...<br><br>災害時こそ、助け合いが大切です。" }
            ]
        }
    }
};

let scenarios = {}; // 現在選択されているコースのシナリオ (ID-based map)
let currentScenarioId = null; // 現在のシナリオID
let isGameActive = false;
let isCourseSelection = false;
let score = 0;
let hp = 3; // ライフ制導入
let gameState = {}; // ゲーム状態（アイテム、フラグなど）

// DOM要素
const progressEl = document.getElementById('progress');
const illustrationEl = document.getElementById('illustration');
const scenarioTextEl = document.getElementById('scenario-text');
const choicesEl = document.getElementById('choices');
const choice1El = document.getElementById('choice1');
const choice2El = document.getElementById('choice2');
const choice3El = document.getElementById('choice3');
const startScreenEl = document.getElementById('start-screen');
const resultScreenEl = document.getElementById('result-screen');
const resultIconEl = document.getElementById('result-icon');
const resultTitleEl = document.getElementById('result-title');
const resultMessageEl = document.getElementById('result-message');

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
        <span class="hp-bar">❤️❤️❤️</span>
        <span id="game-progress">STAGE 1</span>
        <span class="score-board">SCORE: 0</span>
    `;
    
    const container = document.querySelector('.game-container');
    const mainContent = document.querySelector('.game-main');
    
    if (container && mainContent) {
        container.insertBefore(hud, mainContent);
    }
    
    if (progressEl) {
        progressEl.classList.add('hidden'); // 元のプログレスは隠す
    }
}

// ゲーム開始
function startGame() {
    currentScenarioId = null;
    isGameActive = true;
    isCourseSelection = true;
    score = 0;
    hp = 3;
    gameState = {}; // ゲーム状態をリセット
    
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
            prog.textContent = `STAGE ${currentScenarioId || 'START'}`;
        } else {
            prog.textContent = `COURSE SELECT`;
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
    choice1El.style.display = 'block';
    choice2El.textContent = "大宮国際中等教育学校コース（教室サバイバル）";
    choice2El.dataset.course = "omiya";
    choice2El.style.display = 'block';
    choice3El.style.display = 'none'; // コース選択時は3つ目のボタンを非表示
    
    choicesEl.classList.remove('animate');
    choicesEl.getBoundingClientRect();
    choicesEl.classList.add('animate');
}

// シナリオ表示
function showScenario() {
    if (!currentScenarioId || !scenarios[currentScenarioId]) {
        console.error("Invalid scenario ID:", currentScenarioId);
        return;
    }
    
    const scenario = scenarios[currentScenarioId];
    
    // 進行状況更新
    if (progressEl) progressEl.textContent = `シナリオ: ${currentScenarioId}`;
    
    // イラスト更新
    illustrationEl.innerHTML = `<span style="font-size: 4rem;">${scenario.illustration}</span>`;
    
    // シナリオテキスト更新（改行対応）
    scenarioTextEl.innerHTML = scenario.situation.replace(/\n/g, '<br>');
    
    // 選択肢を表示（シャッフルなし - 分岐ロジックのため順序を保持）
    const choices = scenario.choices;
    
    if (choices.length >= 1) {
        choice1El.textContent = choices[0].text;
        choice1El.dataset.choiceIndex = 0;
        choice1El.style.display = 'block';
        delete choice1El.dataset.course;
        delete choice1El.dataset.correct;
    } else {
        choice1El.style.display = 'none';
    }

    if (choices.length >= 2) {
        choice2El.textContent = choices[1].text;
        choice2El.dataset.choiceIndex = 1;
        choice2El.style.display = 'block';
        delete choice2El.dataset.course;
        delete choice2El.dataset.correct;
    } else {
        choice2El.style.display = 'none';
    }
    
    if (choices.length >= 3) {
        choice3El.textContent = choices[2].text;
        choice3El.dataset.choiceIndex = 2;
        choice3El.style.display = 'block';
        delete choice3El.dataset.course;
        delete choice3El.dataset.correct;
    } else {
        choice3El.style.display = 'none';
    }
    
    updateHUD();
    
    // アニメーション
    choicesEl.classList.remove('animate');
    choicesEl.getBoundingClientRect(); // リフロー強制
    choicesEl.classList.add('animate');
}

// 選択処理
function makeChoice(choiceNum) {
    if (!isGameActive) return;
    
    const choiceEl = choiceNum === 1 ? choice1El : choiceNum === 2 ? choice2El : choice3El;

    // コース選択の処理
    if (isCourseSelection) {
        const selectedCourse = choiceEl.dataset.course;
        if (selectedCourse) {
            scenarios = courses[selectedCourse];
            isCourseSelection = false;
            currentScenarioId = 'start'; // 開始シナリオIDを設定
            showScenario();
        }
        return;
    }
    
    const choiceIndex = parseInt(choiceEl.dataset.choiceIndex, 10);
    const scenario = scenarios[currentScenarioId];
    
    if (!scenario || isNaN(choiceIndex) || choiceIndex === undefined) {
        console.error("Invalid choice or scenario");
        return;
    }
    
    const choice = scenario.choices[choiceIndex];
    
    // 選択肢に基づいた処理
    if (choice.nextId) {
        // 分岐処理
        
        // アイテムや状態の更新
        if (choice.giveItem) {
            gameState[choice.giveItem] = true;
        }
        
        // スコア更新
        if (choice.scoreChange) {
            score += choice.scoreChange;
        }
        
        // HP更新
        if (choice.hpChange) {
            hp = Math.max(0, Math.min(3, hp + choice.hpChange));
        }
        
        // メッセージ表示（あれば）
        if (choice.message) {
            alert(choice.message);
        }
        
        updateHUD();
        
        // 次のシナリオへ移動またはエンディング
        if (choice.nextId === 'end') {
            showResult(choice.endingType || 'success', choice.endingMessage);
        } else {
            currentScenarioId = choice.nextId;
            showScenario();
        }
    } else if (choice.correct !== undefined) {
        // 旧式の正解/不正解システム（Okawaコース用）
        const isCorrect = choice.correct;
        
        if (isCorrect) {
            score += 100;
            
            // 正解メッセージがあれば表示
            if (scenario.correctMessage) {
                alert(scenario.correctMessage);
            }
            
            // 次のシナリオへ
            const nextId = choice.nextId || getNextScenarioId();
            if (nextId) {
                currentScenarioId = nextId;
                showScenario();
            } else {
                // シナリオ終了
                showResult('success');
            }
        } else {
            // 不正解
            hp--;
            updateHUD();
            
            const wrongMsg = choice.message || scenario.wrongMessage || "不正解です";
            const wrongReason = scenario.wrongReason || "";
            
            if (hp <= 0) {
                // ゲームオーバー
                showResult('failure', `${wrongMsg}<br><br>${wrongReason}`);
            } else {
                // ダメージ演出とヒント表示
                alert(`不正解！HPが減りました。\n\n${wrongMsg}\n\n理由: ${wrongReason}`);
                
                // 次のシナリオへ（教育目的なので続行）
                const nextId = choice.nextId || getNextScenarioId();
                if (nextId) {
                    currentScenarioId = nextId;
                    showScenario();
                } else {
                    showResult('success');
                }
            }
        }
    }
}

// 次のシナリオIDを取得（連番の場合）
function getNextScenarioId() {
    // Okawaコースの場合は明示的なIDシーケンスを使用
    const okawaSequence = ['start', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];
    
    const currentIndex = okawaSequence.indexOf(currentScenarioId);
    if (currentIndex >= 0 && currentIndex < okawaSequence.length - 1) {
        return okawaSequence[currentIndex + 1];
    }
    
    // フォールバック: Object.keysを使用（順序に依存）
    const keys = Object.keys(scenarios);
    const keyIndex = keys.indexOf(currentScenarioId);
    if (keyIndex >= 0 && keyIndex < keys.length - 1) {
        return keys[keyIndex + 1];
    }
    return null;
}

// 結果表示
function showResult(resultType, customMessage = null) {
    isGameActive = false;
    choicesEl.classList.add('hidden');
    
    resultScreenEl.classList.remove('hidden', 'success', 'failure');
    
    // スコア表示を追加
    const scoreDisplay = `<br><br><strong>最終スコア: ${score} 点</strong>`;
    
    if (resultType === 'success' || resultType === 'hero' || resultType === 'solo') {
        resultScreenEl.classList.add('success');
        resultIconEl.textContent = '🎉';
        resultTitleEl.textContent = resultType === 'hero' ? 'ヒーローエンド！' : 
                                     resultType === 'solo' ? 'ソロ生還エンド' : '避難成功！';
        resultMessageEl.innerHTML = customMessage ? (customMessage + scoreDisplay) : `
            おめでとうございます！<br>
            全ての選択で正しい判断ができました。<br><br>
            実際の災害時も、冷静に正しい判断をして<br>
            自分と周りの人の命を守りましょう。${scoreDisplay}
        `;
    } else if (resultType === 'injury') {
        resultScreenEl.classList.add('success');
        resultIconEl.textContent = '😰';
        resultTitleEl.textContent = 'ケガエンド';
        resultMessageEl.innerHTML = (customMessage || '生き残りましたが、ケガをしてしまいました...') + scoreDisplay;
    } else {
        // failure, gameover
        resultScreenEl.classList.add('failure');
        resultIconEl.textContent = '😢';
        resultTitleEl.textContent = 'ゲームオーバー';
        resultMessageEl.innerHTML = (customMessage || `
            正しい判断ができませんでした。<br><br>
            もう一度チャレンジして、防災知識を身につけましょう。
        `) + scoreDisplay;
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    injectGameStyles(); // スタイル注入
    // 初期状態では選択肢を非表示
    choicesEl.classList.add('hidden');
});
