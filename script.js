const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 800;
const HEIGHT = 600;
const GRID_SIZE = 20;

// Warna
const BACKGROUND = "rgb(30, 30, 30)";
const GRID_COLOR = "rgb(50, 50, 50)";
const HAIR_COLOR = "rgb(255, 105, 180)";

// Tubuh ular
let snakeBody = [
    { x: 400, y: 300 },
    { x: 380, y: 300 },
    { x: 360, y: 300 }
];

let direction = "RIGHT";
let snakeColor = "rgb(46, 204, 113)";

// Makanan
const jumlahMakanan = 20;
const waktuMakanan = 5000;

let makanan = [];

const warnaMakanan = [
    "rgb(255, 80, 80)",
    "rgb(255, 200, 50)",
    "rgb(80, 180, 255)",
    "rgb(180, 80, 255)",
    "rgb(80, 220, 120)"
];

// Game
let score = 0;
let moveDelay = 100;
let gameOver = false;
let lastMove = 0;


// Membuat posisi makanan acak
function buatPosisiAcakMakanan() {

    while (true) {

        const x = Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE;
        const y = Math.floor(Math.random() * (HEIGHT / GRID_SIZE)) * GRID_SIZE;

        const adaDiUlar = snakeBody.some(
            segment => segment.x === x && segment.y === y
        );

        if (!adaDiUlar) {
            return { x: x, y: y };
        }
    }
}


// Membuat warna ular acak
function buatWarnaAcak() {

    const r = Math.floor(Math.random() * 206) + 50;
    const g = Math.floor(Math.random() * 206) + 50;
    const b = Math.floor(Math.random() * 206) + 50;

    return `rgb(${r}, ${g}, ${b})`;
}


// Membuat makanan
function buatMakanan() {

    makanan = [];

    for (let i = 0; i < jumlahMakanan; i++) {

        makanan.push({
            posisi: buatPosisiAcakMakanan(),
            warna: warnaMakanan[
                Math.floor(Math.random() * warnaMakanan.length)
            ],
            waktu: Date.now()
        });
    }
}


// Menggambar background
function gambarBackground() {

    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}


// Menggambar grid
function gambarGrid() {

    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;

    for (let x = 0; x < WIDTH; x += GRID_SIZE) {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }

    for (let y = 0; y < HEIGHT; y += GRID_SIZE) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }
}


// Menggambar makanan
function gambarMakanan() {

    makanan.forEach(food => {

        ctx.beginPath();

        ctx.fillStyle = food.warna;

        ctx.arc(
            food.posisi.x + GRID_SIZE / 2,
            food.posisi.y + GRID_SIZE / 2,
            GRID_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}


// Menggambar ular
function gambarUlar() {

    snakeBody.forEach(segment => {

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
    });
}


// Menggambar rambut kepala
function gambarRambut() {

    const headX = snakeBody[0].x;
    const headY = snakeBody[0].y;

    let rambut = [];

    if (direction === "RIGHT") {

        rambut = [
            [headX + 3, headY + 5],
            [headX + 8, headY - 3],
            [headX + 12, headY + 5],
            [headX + 16, headY - 3],
            [headX + 19, headY + 7]
        ];

    } else if (direction === "LEFT") {

        rambut = [
            [headX + 1, headY + 7],
            [headX + 4, headY - 3],
            [headX + 9, headY + 5],
            [headX + 14, headY - 3],
            [headX + 18, headY + 7]
        ];

    } else if (direction === "UP") {

        rambut = [
            [headX + 5, headY + 2],
            [headX - 3, headY + 7],
            [headX + 5, headY + 11],
            [headX - 3, headY + 16],
            [headX + 7, headY + 19]
        ];

    } else {

        rambut = [
            [headX + 5, headY + 18],
            [headX - 3, headY + 13],
            [headX + 5, headY + 9],
            [headX - 3, headY + 4],
            [headX + 7, headY + 1]
        ];
    }

    ctx.beginPath();

    ctx.fillStyle = HAIR_COLOR;

    ctx.moveTo(rambut[0][0], rambut[0][1]);

    for (let i = 1; i < rambut.length; i++) {
        ctx.lineTo(rambut[i][0], rambut[i][1]);
    }

    ctx.closePath();
    ctx.fill();
}


// Pergerakan ular
function gerakUlar() {

    let headX = snakeBody[0].x;
    let headY = snakeBody[0].y;

    if (direction === "RIGHT") {
        headX += GRID_SIZE;
    }

    if (direction === "LEFT") {
        headX -= GRID_SIZE;
    }

    if (direction === "UP") {
        headY -= GRID_SIZE;
    }

    if (direction === "DOWN") {
        headY += GRID_SIZE;
    }

    const newHead = {
        x: headX,
        y: headY
    };

    // Cek tabrakan dengan dinding
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

    // Cek tabrakan dengan tubuh
    const menabrakTubuh = snakeBody.some(
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

    // Cek makanan
    for (let i = makanan.length - 1; i >= 0; i--) {

        const food = makanan[i];

        if (
            newHead.x === food.posisi.x &&
            newHead.y === food.posisi.y
        ) {

            score++;

            makanan.splice(i, 1);

            makananDimakan = true;

            // Warna ular berubah
            snakeColor = buatWarnaAcak();

            // Membuat makanan baru
            makanan.push({
                posisi: buatPosisiAcakMakanan(),
                warna: warnaMakanan[
                    Math.floor(Math.random() * warnaMakanan.length)
                ],
                waktu: Date.now()
            });

            // Kecepatan bertambah setiap 3 skor
            if (score % 3 === 0 && moveDelay > 40) {
                moveDelay -= 10;
            }

            break;
        }
    }

    // Jika tidak makan, ekor dihapus
    if (!makananDimakan) {
        snakeBody.pop();
    }

    document.getElementById("score").textContent =
        "Score: " + score;
}


// Mengecek waktu makanan
function cekWaktuMakanan() {

    const sekarang = Date.now();

    makanan.forEach(food => {

        if (sekarang - food.waktu >= waktuMakanan) {

            food.posisi = buatPosisiAcakMakanan();

            food.warna =
                warnaMakanan[
                    Math.floor(Math.random() * warnaMakanan.length)
                ];

            food.waktu = sekarang;
        }
    });
}


// Menampilkan Game Over
function tampilkanGameOver() {

    document
        .getElementById("gameOver")
        .classList.remove("hidden");
}


// Restart game
function restartGame() {

    snakeBody = [
        { x: 400, y: 300 },
        { x: 380, y: 300 },
        { x: 360, y: 300 }
    ];

    direction = "RIGHT";
    snakeColor = "rgb(46, 204, 113)";

    score = 0;
    moveDelay = 100;
    gameOver = false;
    lastMove = Date.now();

    document.getElementById("score").textContent =
        "Score: 0";

    document
        .getElementById("gameOver")
        .classList.add("hidden");

    buatMakanan();
}


// Kontrol keyboard
document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {

        if (direction !== "DOWN") {
            direction = "UP";
        }
    }

    else if (
        event.key === "ArrowDown" ||
        event.key.toLowerCase() === "s"
    ) {

        if (direction !== "UP") {
            direction = "DOWN";
        }
    }

    else if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        if (direction !== "RIGHT") {
            direction = "LEFT";
        }
    }

    else if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        if (direction !== "LEFT") {
            direction = "RIGHT";
        }
    }

    else if (
        event.key.toLowerCase() === "r" &&
        gameOver
    ) {

        restartGame();
    }
});


// Game loop
function gameLoop() {

    const sekarang = Date.now();

    if (!gameOver) {

        if (sekarang - lastMove >= moveDelay) {

            lastMove = sekarang;
            gerakUlar();
        }

        cekWaktuMakanan();
    }

    gambarBackground();
    gambarGrid();
    gambarMakanan();
    gambarUlar();
    gambarRambut();

    requestAnimationFrame(gameLoop);
}


// Mulai game
buatMakanan();
gameLoop();