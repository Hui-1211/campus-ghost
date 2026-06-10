// =========================
// 玩家資料
// =========================

let player = {
    hp: 100,
    maxHp: 100,

    san: 100,
    maxSan: 100,

    atk: 15,

    level: 1,
    exp: 0
};

let inventory = [];

let flags = {
    key: false,
    truth: false
};

// =========================
// DOM
// =========================

const story =
document.getElementById("story");

const buttons =
document.getElementById("buttons");

const img =
document.getElementById("sceneImage");

const hpBar =
document.getElementById("hpBar");

const sanBar =
document.getElementById("sanBar");

const status =
document.getElementById("status");

// =========================
// UI
// =========================

function updateUI(){

    if(player.hp < 0) player.hp = 0;
    if(player.san < 0) player.san = 0;

    let hpPercent =
    (player.hp/player.maxHp)*100;

    let sanPercent =
    (player.san/player.maxSan)*100;

    hpBar.style.width =
    hpPercent + "%";

    sanBar.style.width =
    sanPercent + "%";

    hpBar.innerText =
    `❤️ HP ${player.hp}/${player.maxHp}`;

    sanBar.innerText =
    `🧠 SAN ${player.san}/${player.maxSan}`;

    status.innerHTML =
    `
    ⭐ 等級：${player.level}
    <br>
    📖 EXP：${player.exp}
    <br>
    ⚔️ 攻擊力：${player.atk}
    <br>
    🎒 背包：
    ${
        inventory.length > 0
        ? inventory.join("、")
        : "空"
    }
    `;
}

function clearButtons(){

    buttons.innerHTML = "";

}

function addButton(text, func){

    const btn =
    document.createElement("button");

    btn.innerText = text;

    btn.onclick = func;

    buttons.appendChild(btn);

}

// =========================
// 升級
// =========================

function gainExp(amount){

    player.exp += amount;

    let need =
    player.level * 50;

    if(player.exp >= need){

        player.exp -= need;

        player.level++;

        player.maxHp += 20;

        player.hp =
        player.maxHp;

        player.atk += 5;

        alert(
            `🎉 升級！ Lv.${player.level}`
        );
    }
}

// =========================
// 存檔
// =========================

function saveGame(){

    const saveData = {

        player,
        inventory,
        flags

    };

    localStorage.setItem(
        "campusGhostSave",
        JSON.stringify(saveData)
    );

    alert("💾 存檔成功");
}

// =========================
// 讀檔
// =========================

function loadGame(){

    const save =
    localStorage.getItem(
        "campusGhostSave"
    );

    if(!save){

        alert("⚠️ 找不到存檔");

        return;
    }

    const data =
    JSON.parse(save);

    player =
    data.player;

    inventory =
    data.inventory;

    flags =
    data.flags;

    updateUI();

    alert("📂 讀檔成功");
}

// =========================
// 遊戲結束
// =========================

function checkGameOver(){

    if(player.hp <= 0){

        story.innerHTML =
        `
        <h2>💀 死亡結局</h2>

        你被校園中的怨靈吞噬了...
        `;

        clearButtons();

        addButton(
            "重新開始",
            ()=>location.reload()
        );

        return true;
    }

    if(player.san <= 0){

        story.innerHTML =
        `
        <h2>😵 瘋狂結局</h2>

        你的理智徹底崩潰。
        `;

        clearButtons();

        addButton(
            "重新開始",
            ()=>location.reload()
        );

        return true;
    }

    return false;
}

// =========================
// 探索
// =========================

function explore(place){

    let r =
    Math.floor(
        Math.random()*10
    );

    if(r===0){

        inventory.push(
            "醫療包"
        );

        story.innerHTML =
        "❤️ 找到醫療包";

    }

    else if(r===1){

        player.hp -= 15;

        story.innerHTML =
        "👻 鬼影襲擊";

    }

    else if(r===2){

        player.san -= 15;

        story.innerHTML =
        "😱 看見恐怖幻象";

    }

    else if(r===3){

        player.atk += 3;

        story.innerHTML =
        "⚔️ 找到驅魔符";

    }

    else if(r===4){

        gainExp(20);

        story.innerHTML =
        "⭐ 獲得20 EXP";

    }

    else if(r===5){

        flags.truth = true;

        story.innerHTML =
        "📜 發現校園真相";

    }

    else{

        story.innerHTML =
        "沒有發現異常";
    }

    if(
        place==="實驗室" &&
        !flags.key
    ){

        if(Math.random()<0.3){

            flags.key = true;

            story.innerHTML +=
            `
            <br><br>
            🔑 找到神秘鑰匙！
            `;
        }
    }

    updateUI();

    checkGameOver();
}

// =========================
// 房間
// =========================

function room(place){

    if(place==="地下室")
        img.src="images/basement.jpg";

    if(place==="圖書館")
        img.src="images/library.jpg";

    if(place==="實驗室")
        img.src="images/lab.jpg";

    if(place==="禮堂")
        img.src="images/auditorium.jpg";

    story.innerHTML =
    `
    📍 ${place}

    <br><br>

    要做什麼？
    `;

    clearButtons();

    addButton(
        "🔍 探索",
        ()=>explore(place)
    );

    addButton(
        "💊 使用醫療包",
        ()=>{

            let index =
            inventory.indexOf(
                "醫療包"
            );

            if(index !== -1){

                inventory.splice(
                    index,
                    1
                );

                player.hp += 30;

                if(
                    player.hp >
                    player.maxHp
                ){
                    player.hp =
                    player.maxHp;
                }

                story.innerHTML =
                "❤️ 恢復30 HP";

                updateUI();
            }
            else{

                alert(
                    "沒有醫療包"
                );
            }

        }
    );

    addButton(
        "🏠 返回主畫面",
        main
    );
}

// =========================
// Boss
// =========================

function bossRoom(){

    if(!flags.key){

        story.innerHTML =
        `
        🚪 校長室被封印

        <br><br>

        需要神秘鑰匙
        `;

        return;
    }

    img.src =
    "images/boss.jpg";

    let bossHP = 200;

    function draw(){

        story.innerHTML =
        `
        👻 紅衣女鬼

        <br><br>

        Boss HP：
        ${bossHP}
        `;

        clearButtons();

        addButton(
            "⚔️ 攻擊",
            attack
        );

        addButton(
            "💬 超渡",
            purify
        );

        addButton(
            "🏃逃跑",
            main
        );
    }

    function attack(){

        let damage =
        player.atk +
        Math.floor(
            Math.random()*10
        );

        bossHP -= damage;

        player.hp -= 10;

        updateUI();

        if(checkGameOver())
            return;

        if(bossHP <= 0){

            if(flags.truth){

                story.innerHTML =
                `
                <h2>🌟 真結局</h2>

                你揭開了校園真相

                並成功超渡女鬼
                `;
            }
            else{

                story.innerHTML =
                `
                <h2>🙂 普通結局</h2>

                你打倒了女鬼

                但真相仍被埋藏
                `;
            }

            clearButtons();

            addButton(
                "重新開始",
                ()=>location.reload()
            );

            return;
        }

        draw();
    }

    function purify(){

        if(flags.truth){

            story.innerHTML =
            `
            <h2>🌟 真結局</h2>

            你以真相化解怨念

            校園恢復和平
            `;

            clearButtons();

            addButton(
                "重新開始",
                ()=>location.reload()
            );
        }
        else{

            player.hp -= 20;

            updateUI();

            story.innerHTML =
            `
            ❌ 超渡失敗

            你不知道真相
            `;

            checkGameOver();
        }
    }

    draw();
}

// =========================
// 主畫面
// =========================

function main(){

    img.src =
    "images/basement.jpg";

    story.innerHTML =
    `
    <h2>🏫 校園鬼屋探險</h2>

    深夜的校園傳出詭異哭聲...

    <br><br>

    你決定展開調查。
    `;

    clearButtons();

    addButton(
        "地下室",
        ()=>room("地下室")
    );

    addButton(
        "圖書館",
        ()=>room("圖書館")
    );

    addButton(
        "實驗室",
        ()=>room("實驗室")
    );

    addButton(
        "禮堂",
        ()=>room("禮堂")
    );

    addButton(
        "👻 校長室",
        bossRoom
    );

    addButton(
        "💾 存檔",
        saveGame
    );

    addButton(
        "📂 讀檔",
        loadGame
    );

    updateUI();
}

// =========================
// 啟動
// =========================

updateUI();
main();