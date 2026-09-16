const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 800;
const HEIGHT = 600;
const GRID_SIZE = 20;

// ===============================
// WARNA
// ===============================

const BACKGROUND = "#101820";
const GRID_COLOR = "#1d2c3a";

// ===============================
// ULAR
// ===============================

let snakeBody = [
    { x: 400, y: 300 },
    { x: 380, y: 300 },
    { x: 360, y: 300 }
];

let direction = "RIGHT";
let snakeColor = "#2ecc71";

// ===============================
// BUAH
// ===============================

const jumlahMakanan = 20;
const waktuMakanan = 5000;

let makanan = [];

const buahBuahan = [
    "🍎",
    "🍌",
    "🍇",
    "🍉",
    "🍓",
    "🍊",
    "🍍",
    "🥝"
];

// ===============================
// GAME
// ===============================

let score = 0;
let moveDelay = 100;
let gameOver = false;
let lastMove = 0;

// ===============================
// POSISI BUAH ACAK
// ===============================

function buatPosisiAcakMakanan() {

    while (true) {

        const x =
            Math.floor(
                Math.random() * (WIDTH / GRID_SIZE)
            ) * GRID_SIZE;

        const y =
            Math.floor(
                Math.random() * (HEIGHT / GRID_SIZE)
            ) * GRID_SIZE;

        const adaDiUlar =
            snakeBody.some(
                segment =>
                    segment.x === x &&
                    segment.y === y
            );

        if (!adaDiUlar) {
            return {
                x: x,
                y: y
            };
        }
    }
}

// ===============================
// WARNA ULAR ACAK
// ===============================

function buatWarnaAcak() {

    const r =
        Math.floor(Math.random() * 206) + 50;

    const g =
        Math.floor(Math.random() * 206) + 50;

    const b =
        Math.floor(Math.random() * 206) + 50;

    return `rgb(${r}, ${g}, ${b})`;
}

// ===============================
// MEMBUAT BUAH
// ===============================

function buatMakanan() {

    makanan = [];

    for (let i = 0; i < jumlahMakanan; i++) {

        makanan.push({

            posisi:
                buatPosisiAcakMakanan(),

            buah:
                buahBuahan[
                    Math.floor(
                        Math.random() *
                        buahBuahan.length
                    )
                ],

            waktu:
                Date.now()
        });
    }
}

// ===============================
// BACKGROUND
// ===============================

function gambarBackground() {

    ctx.fillStyle = BACKGROUND;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );
}

// ===============================
// GRID
// ===============================

function gambarGrid() {

    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;

    for (
        let x = 0;
        x < WIDTH;
        x += GRID_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, HEIGHT);

        ctx.stroke();
    }

    for (
        let y = 0;
        y < HEIGHT;
        y += GRID_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(WIDTH, y);

        ctx.stroke();
    }
}

// ===============================
// GAMBAR BUAH
// ===============================

function gambarMakanan() {

    makanan.forEach(food => {

        ctx.font = "18px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(

            food.buah,

            food.posisi.x + GRID_SIZE / 2,

            food.posisi.y + GRID_SIZE / 2
        );
    });
}

// ===============================
// GAMBAR ULAR
// ===============================

function gambarUlar() {

    snakeBody.forEach(
        (segment, index) => {

            ctx.beginPath();

            ctx.fillStyle = snakeColor;

            ctx.arc(

                segment.x + GRID_SIZE / 2,

                segment.y + GRID_SIZE / 2,

                GRID_SIZE / 2 - 1,

                0,

                Math.PI * 2
            );

            ctx.fill();

            // ===============================
            // MATA ULAR
            // ===============================

            if (index === 0) {

                gambarMata(
                    segment.x,
                    segment.y
                );
            }
        }
    );
}

// ===============================
// MATA ULAR
// ===============================

function gambarMata(x, y) {

    let mata1;
    let mata2;

    // Mengatur posisi mata sesuai arah

    if (direction === "RIGHT") {

        mata1 = {
            x: x + 14,
            y: y + 5
        };

        mata2 = {
            x: x + 14,
            y: y + 14
        };

    }

    else if (direction === "LEFT") {

        mata1 = {
            x: x + 6,
            y: y + 5
        };

        mata2 = {
            x: x + 6,
            y: y + 14
        };

    }

    else if (direction === "UP") {

        mata1 = {
            x: x + 5,
            y: y + 6
        };

        mata2 = {
            x: x + 14,
            y: y + 6
        };

    }

    else {

        mata1 = {
            x: x + 5,
            y: y + 14
        };

        mata2 = {
            x: x + 14,
            y: y + 14
        };
    }

    // ===============================
    // MATA PUTIH
    // ===============================

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        mata1.x,
        mata1.y,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        mata2.x,
        mata2.y,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // ===============================
    // PUPIL
    // ===============================

    ctx.fillStyle = "black";

    let pupilOffsetX = 0;
    let pupilOffsetY = 0;

    if (direction === "RIGHT") {
        pupilOffsetX = 1.5;
    }

    else if (direction === "LEFT") {
        pupilOffsetX = -1.5;
    }

    else if (direction === "UP") {
        pupilOffsetY = -1.5;
    }

    else {
        pupilOffsetY = 1.5;
    }

    ctx.beginPath();

    ctx.arc(
        mata1.x + pupilOffsetX,
        mata1.y + pupilOffsetY,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        mata2.x + pupilOffsetX,
        mata2.y + pupilOffsetY,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

// ===============================
// GERAK ULAR
// ===============================

function gerakUlar() {

    let headX = snakeBody[0].x;
    let headY = snakeBody[0].y;

    if (direction === "RIGHT") {
        headX += GRID_SIZE;
    }

    else if (direction === "LEFT") {
        headX -= GRID_SIZE;
    }

    else if (direction === "UP") {
        headY -= GRID_SIZE;
    }

    else if (direction === "DOWN") {
        headY += GRID_SIZE;
    }

    const newHead = {
        x: headX,
        y: headY
    };

    // ===============================
    // TABRAKAN DINDING
    // ===============================

    if (
        headX < 0 ||
        headX >= WIDTH ||
        headY < 0 ||
        headY >= HEIGHT
    ) {

        gameOver = true;

        tampilkanGameOver();

        return;
    }

    // ===============================
    // TABRAKAN TUBUH
    // ===============================

    const menabrakTubuh =
        snakeBody.some(
            segment =>
                segment.x === newHead.x &&
                segment.y === newHead.y
        );

    if (menabrakTubuh) {

        gameOver = true;

        tampilkanGameOver();

        return;
    }

    snakeBody.unshift(newHead);

    let makananDimakan = false;

    // ===============================
    // CEK BUAH
    // ===============================

    for (
        let i = makanan.length - 1;
        i >= 0;
        i--
    ) {

        const food = makanan[i];

        if (
            newHead.x === food.posisi.x &&
            newHead.y === food.posisi.y
        ) {

            score++;

            makanan.splice(i, 1);

            makananDimakan = true;

            // Warna ular berubah
            snakeColor =
                buatWarnaAcak();

            // Buah baru
            makanan.push({

                posisi:
                    buatPosisiAcakMakanan(),

                buah:
                    buahBuahan[
                        Math.floor(
                            Math.random() *
                            buahBuahan.length
                        )
                    ],

                waktu:
                    Date.now()
            });

            // Kecepatan bertambah
            if (
                score % 3 === 0 &&
                moveDelay > 40
            ) {

                moveDelay -= 10;
            }

            updateScore();

            break;
        }
    }

    // Jika tidak makan
    if (!makananDimakan) {

        snakeBody.pop();
    }
}

// ===============================
// UPDATE SKOR
// ===============================

function updateScore() {

    document.getElementById(
        "score"
    ).textContent = score;

    document.getElementById(
        "sideScore"
    ).textContent = score;
}

// ===============================
// WAKTU BUAH
// ===============================

function cekWaktuMakanan() {

    const sekarang = Date.now();

    makanan.forEach(food => {

        if (
            sekarang - food.waktu >=
            waktuMakanan
        ) {

            food.posisi =
                buatPosisiAcakMakanan();

            food.buah =
                buahBuahan[
                    Math.floor(
                        Math.random() *
                        buahBuahan.length
                    )
                ];

            food.waktu =
                sekarang;
        }
    });
}

// ===============================
// GAME OVER
// ===============================

function tampilkanGameOver() {

    document.getElementById(
        "finalScore"
    ).textContent = score;

    document.getElementById(
        "gameOver"
    ).classList.remove(
        "hidden"
    );
}

// ===============================
// RESTART
// ===============================

function restartGame() {

    snakeBody = [

        { x: 400, y: 300 },
        { x: 380, y: 300 },
        { x: 360, y: 300 }

    ];

    direction = "RIGHT";

    snakeColor = "#2ecc71";

    score = 0;

    moveDelay = 100;

    gameOver = false;

    lastMove = Date.now();

    updateScore();

    document.getElementById(
        "gameOver"
    ).classList.add(
        "hidden"
    );

    buatMakanan();
}

// ===============================
// TOMBOL KELUAR
// ===============================

function keluarGame() {

    const yakin = confirm(
        "Apakah kamu yakin ingin keluar dari game?"
    );

    if (yakin) {

        gameOver = true;

        document.body.innerHTML = `

            <div class="exit-screen">

                <div class="exit-box">

                    <h1>👋 GAME SELESAI</h1>

                    <p>
                        Terima kasih sudah bermain!
                    </p>

                    <p>
                        Skor terakhir:
                        <b>${score}</b>
                    </p>

                </div>

            </div>
        `;
    }
}

// ===============================
// KEYBOARD
// ===============================

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();

        if (
            key === "arrowup" ||
            key === "w"
        ) {

            if (direction !== "DOWN") {
                direction = "UP";
            }
        }

        else if (
            key === "arrowdown" ||
            key === "s"
        ) {

            if (direction !== "UP") {
                direction = "DOWN";
            }
        }

        else if (
            key === "arrowleft" ||
            key === "a"
        ) {

            if (direction !== "RIGHT") {
                direction = "LEFT";
            }
        }

        else if (
            key === "arrowright" ||
            key === "d"
        ) {

            if (direction !== "LEFT") {
                direction = "RIGHT";
            }
        }

        else if (
            key === "r" &&
            gameOver
        ) {

            restartGame();
        }
    }
);

// ===============================
// GAME LOOP
// ===============================

function gameLoop() {

    const sekarang = Date.now();

    if (!gameOver) {

        if (
            sekarang - lastMove >=
            moveDelay
        ) {

            lastMove = sekarang;

            gerakUlar();
        }

        cekWaktuMakanan();
    }

    gambarBackground();

    gambarGrid();

    gambarMakanan();

    gambarUlar();

    requestAnimationFrame(
        gameLoop
    );
}

// ===============================
// MULAI
// ===============================

buatMakanan();

updateScore();

gameLoop();