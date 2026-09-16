const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement =
    document.getElementById("score");

const sideScoreElement =
    document.getElementById("sideScore");

const gameOverElement =
    document.getElementById("gameOver");

const finalScoreElement =
    document.getElementById("finalScore");

const restartButton =
    document.getElementById("restartButton");


/* =========================
   PENGATURAN
========================= */

const WIDTH = 800;
const HEIGHT = 600;
const GRID_SIZE = 20;


let snake;

let direction;

let nextDirection;

let score = 0;

let snakeColor = "#2ecc71";

let makanan = [];

let gameOver = false;

let speed = 100;

let waktuMakananTerakhir =
    Date.now();


/* =========================
   BUAH
========================= */

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


/* =========================
   POSISI MAKANAN
========================= */

function buatPosisiAcakMakanan() {

    return {

        x:
            Math.floor(
                Math.random() *
                (WIDTH / GRID_SIZE)
            ) * GRID_SIZE,

        y:
            Math.floor(
                Math.random() *
                (HEIGHT / GRID_SIZE)
            ) * GRID_SIZE

    };
}


/* =========================
   WARNA MAKANAN
========================= */

function buatWarnaAcak() {

    const warna = [

        "#e74c3c",
        "#3498db",
        "#f1c40f",
        "#9b59b6",
        "#1abc9c",
        "#e67e22",
        "#ff69b4"

    ];


    return warna[
        Math.floor(
            Math.random() *
            warna.length
        )
    ];
}


/* =========================
   BUAT MAKANAN
========================= */

function buatMakanan() {

    makanan = [];


    for (let i = 0; i < 20; i++) {

        const posisi =
            buatPosisiAcakMakanan();


        makanan.push({

            x: posisi.x,

            y: posisi.y,

            buah:
                buahBuahan[
                    Math.floor(
                        Math.random() *
                        buahBuahan.length
                    )
                ],

            warna:
                buatWarnaAcak()

        });
    }


    waktuMakananTerakhir =
        Date.now();
}


/* =========================
   BACKGROUND
========================= */

function gambarBackground() {

    ctx.fillStyle = "#1e1e1e";


    ctx.fillRect(

        0,
        0,
        WIDTH,
        HEIGHT

    );
}


/* =========================
   GRID
========================= */

function gambarGrid() {

    ctx.strokeStyle = "#292929";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x <= WIDTH;
        x += GRID_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, HEIGHT);

        ctx.stroke();
    }


    for (
        let y = 0;
        y <= HEIGHT;
        y += GRID_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(WIDTH, y);

        ctx.stroke();
    }
}


/* =========================
   MAKANAN
========================= */

function gambarMakanan() {

    makanan.forEach(item => {

        ctx.font = "22px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";


        ctx.fillText(

            item.buah,

            item.x +
            GRID_SIZE / 2,

            item.y +
            GRID_SIZE / 2

        );

    });
}


/* =========================
   ULAR
========================= */

function gambarUlar() {

    snake.forEach(
        (segment, index) => {

            ctx.fillStyle =
                snakeColor;


            ctx.beginPath();


            ctx.arc(

                segment.x +
                GRID_SIZE / 2,

                segment.y +
                GRID_SIZE / 2,

                GRID_SIZE / 2 - 2,

                0,

                Math.PI * 2

            );


            ctx.fill();


            if (index === 0) {

                gambarMata(

                    segment.x,
                    segment.y

                );
            }

        }
    );
}


/* =========================
   MATA ULAR
========================= */

function gambarMata(x, y) {

    let mata1;

    let mata2;


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


    /* PUTIH */

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


    /* PUPIL */

    ctx.fillStyle = "black";


    let offsetX = 0;

    let offsetY = 0;


    if (direction === "RIGHT") {

        offsetX = 2;
    }


    if (direction === "LEFT") {

        offsetX = -2;
    }


    if (direction === "UP") {

        offsetY = -2;
    }


    if (direction === "DOWN") {

        offsetY = 2;
    }


    ctx.beginPath();

    ctx.arc(

        mata1.x + offsetX,

        mata1.y + offsetY,

        2,

        0,

        Math.PI * 2

    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(

        mata2.x + offsetX,

        mata2.y + offsetY,

        2,

        0,

        Math.PI * 2

    );

    ctx.fill();
}


/* =========================
   UBAH ARAH
========================= */

function ubahArah(arahBaru) {

    if (

        arahBaru === "UP" &&

        direction !== "DOWN"

    ) {

        nextDirection = "UP";
    }


    else if (

        arahBaru === "DOWN" &&

        direction !== "UP"

    ) {

        nextDirection = "DOWN";
    }


    else if (

        arahBaru === "LEFT" &&

        direction !== "RIGHT"

    ) {

        nextDirection = "LEFT";
    }


    else if (

        arahBaru === "RIGHT" &&

        direction !== "LEFT"

    ) {

        nextDirection = "RIGHT";
    }
}


/* =========================
   GERAK ULAR
========================= */

function gerakUlar() {

    direction = nextDirection;


    const kepala = {

        x: snake[0].x,

        y: snake[0].y

    };


    if (direction === "UP") {

        kepala.y -= GRID_SIZE;
    }


    else if (direction === "DOWN") {

        kepala.y += GRID_SIZE;
    }


    else if (direction === "LEFT") {

        kepala.x -= GRID_SIZE;
    }


    else if (direction === "RIGHT") {

        kepala.x += GRID_SIZE;
    }


    snake.unshift(kepala);


    /* CEK MAKAN */

    let makan = false;


    for (
        let i = 0;
        i < makanan.length;
        i++
    ) {

        if (

            kepala.x === makanan[i].x &&

            kepala.y === makanan[i].y

        ) {

            makan = true;


            score++;


            snakeColor =
                makanan[i].warna;


            makanan.splice(i, 1);


            break;
        }
    }


    if (!makan) {

        snake.pop();

    }

    else {

        updateScore();


        /* TAMBAH BUAH */

        const posisi =
            buatPosisiAcakMakanan();


        makanan.push({

            x: posisi.x,

            y: posisi.y,

            buah:
                buahBuahan[
                    Math.floor(
                        Math.random() *
                        buahBuahan.length
                    )
                ],

            warna:
                buatWarnaAcak()

        });


        /* TAMBAH KECEPATAN */

        if (score % 3 === 0) {

            speed =
                Math.max(
                    40,
                    speed - 10
                );
        }
    }
}


/* =========================
   TABRAKAN
========================= */

function cekTabrakan() {

    const kepala = snake[0];


    /* DINDING */

    if (

        kepala.x < 0 ||

        kepala.x >= WIDTH ||

        kepala.y < 0 ||

        kepala.y >= HEIGHT

    ) {

        return true;
    }


    /* BADAN */

    for (
        let i = 1;
        i < snake.length;
        i++
    ) {

        if (

            kepala.x === snake[i].x &&

            kepala.y === snake[i].y

        ) {

            return true;
        }
    }


    return false;
}


/* =========================
   UPDATE SKOR
========================= */

function updateScore() {

    scoreElement.textContent =
        score;

    sideScoreElement.textContent =
        score;
}


/* =========================
   GAME OVER
========================= */

function tampilkanGameOver() {

    gameOver = true;


    finalScoreElement.textContent =
        score;


    gameOverElement.classList.remove(
        "hidden"
    );
}


/* =========================
   RESTART
========================= */

function restartGame() {

    snake = [

        {
            x: 400,
            y: 300
        },

        {
            x: 380,
            y: 300
        },

        {
            x: 360,
            y: 300
        }

    ];


    direction = "RIGHT";

    nextDirection = "RIGHT";


    score = 0;

    speed = 100;

    snakeColor = "#2ecc71";

    gameOver = false;


    updateScore();

    buatMakanan();


    gameOverElement.classList.add(
        "hidden"
    );
}


/* =========================
   REFRESH MAKANAN
========================= */

function cekWaktuMakanan() {

    const sekarang =
        Date.now();


    if (

        sekarang -
        waktuMakananTerakhir >=
        5000

    ) {

        buatMakanan();
    }
}


/* =========================
   KONTROL PC
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        if (

            key === "arrowup" ||

            key === "w"

        ) {

            ubahArah("UP");
        }


        else if (

            key === "arrowdown" ||

            key === "s"

        ) {

            ubahArah("DOWN");
        }


        else if (

            key === "arrowleft" ||

            key === "a"

        ) {

            ubahArah("LEFT");
        }


        else if (

            key === "arrowright" ||

            key === "d"

        ) {

            ubahArah("RIGHT");
        }

    }
);


/* =========================
   KONTROL HP
========================= */

const tombolKontrol =
    document.querySelectorAll(
        ".control-button"
    );


tombolKontrol.forEach(
    function(button) {

        button.addEventListener(
            "pointerdown",
            function(event) {

                event.preventDefault();


                const arah =
                    button.dataset.direction;


                ubahArah(arah);

            }
        );

    }
);


/* =========================
   TOMBOL MAIN LAGI
========================= */

restartButton.addEventListener(
    "click",
    function() {

        restartGame();

    }
);


/* =========================
   KELUAR
========================= */

function keluarGame() {

    const yakin =
        confirm(
            "Yakin ingin keluar dari game?"
        );


    if (!yakin) {

        return;
    }


    document.body.innerHTML = `

        <div class="exit-screen">

            <div class="exit-box">

                <h1>🐍 GAME SELESAI</h1>

                <p>
                    Terima kasih sudah bermain!
                </p>

                <p>
                    Skor terakhir:
                    <b>${score}</b>
                </p>

                <p>
                    Silakan tutup halaman ini.
                </p>

            </div>

        </div>

    `;
}


/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    if (!gameOver) {

        gerakUlar();


        if (cekTabrakan()) {

            tampilkanGameOver();
        }


        cekWaktuMakanan();
    }


    gambarBackground();

    gambarGrid();

    gambarMakanan();

    gambarUlar();


    setTimeout(
        gameLoop,
        speed
    );
}


/* =========================
   MULAI
========================= */

restartGame();

gameLoop();