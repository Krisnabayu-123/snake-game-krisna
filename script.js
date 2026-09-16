const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const gameOverScreen =
    document.getElementById("gameOver");

const restartButton =
    document.getElementById("restartButton");

const finalScore =
    document.getElementById("finalScore");

const joystickBase =
    document.getElementById("joystickBase");

const joystickKnob =
    document.getElementById("joystickKnob");


// ==========================================
// UKURAN
// ==========================================

const WIDTH = 800;

const HEIGHT = 600;

const GRID_SIZE = 20;


// ==========================================
// GAME
// ==========================================

let snakeBody = [];

let direction = "RIGHT";

let nextDirection = "RIGHT";

let score = 0;

let gameOver = false;

let moveDelay = 100;

let moveTimer = 0;

let lastTime = 0;


// ==========================================
// WARNA ULAR
// ==========================================

let warnaUlar = "#2ecc71";


// Warna yang berbeda-beda

const warnaUlarList = [

    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#1abc9c",
    "#ff69b4",
    "#00bcd4",
    "#8bc34a",
    "#00e676",
    "#ff5722",
    "#7e57c2",
    "#26a69a"

];


// ==========================================
// BUAH
// ==========================================

const jumlahMakanan = 20;

const waktuMakanan = 5000;

let makanan = [];


const jenisBuah = [

    "apel",
    "jeruk",
    "anggur",
    "blueberry",
    "kiwi",
    "stroberi"

];


// ==========================================
// WARNA ACAK
// ==========================================

function buatWarnaAcak() {

    let warnaBaru;

    do {

        warnaBaru =
            warnaUlarList[
                Math.floor(
                    Math.random() *
                    warnaUlarList.length
                )
            ];

    }

    while (
        warnaBaru === warnaUlar
    );


    return warnaBaru;
}


// ==========================================
// POSISI BUAH
// ==========================================

function buatPosisiAcakMakanan() {

    while (true) {

        const x =
            Math.floor(
                Math.random() *
                (WIDTH / GRID_SIZE)
            ) * GRID_SIZE;


        const y =
            Math.floor(
                Math.random() *
                (HEIGHT / GRID_SIZE)
            ) * GRID_SIZE;


        const adaDiUlar =
            snakeBody.some(
                segment =>
                    segment.x === x &&
                    segment.y === y
            );


        const adaBuah =
            makanan.some(
                food =>
                    food.posisi.x === x &&
                    food.posisi.y === y
            );


        if (
            !adaDiUlar &&
            !adaBuah
        ) {

            return {
                x: x,
                y: y
            };

        }
    }
}


// ==========================================
// BUAT BUAH
// ==========================================

function buatSatuBuah() {

    const nama =
        jenisBuah[
            Math.floor(
                Math.random() *
                jenisBuah.length
            )
        ];


    makanan.push({

        posisi:
            buatPosisiAcakMakanan(),

        nama: nama,

        waktu:
            performance.now()

    });
}


function buatMakanan() {

    makanan = [];


    for (
        let i = 0;
        i < jumlahMakanan;
        i++
    ) {

        buatSatuBuah();

    }
}


// ==========================================
// MULAI GAME
// ==========================================

function mulaiGame() {

    snakeBody = [

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


    warnaUlar =
        "#2ecc71";


    moveDelay = 100;

    moveTimer = 0;


    gameOver = false;


    gameOverScreen
        .classList
        .remove("show");


    buatMakanan();


    resetJoystick();
}


// ==========================================
// ARAH ULAR
// ==========================================

function ubahArah(arah) {

    if (gameOver) {

        return;
    }


    if (
        arah === "UP" &&
        direction !== "DOWN"
    ) {

        nextDirection = "UP";

    }


    else if (
        arah === "DOWN" &&
        direction !== "UP"
    ) {

        nextDirection = "DOWN";

    }


    else if (
        arah === "LEFT" &&
        direction !== "RIGHT"
    ) {

        nextDirection = "LEFT";

    }


    else if (
        arah === "RIGHT" &&
        direction !== "LEFT"
    ) {

        nextDirection = "RIGHT";

    }
}


// ==========================================
// KEYBOARD
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        if (
            event.key === "ArrowUp" ||
            key === "w"
        ) {

            ubahArah("UP");

        }


        else if (
            event.key === "ArrowDown" ||
            key === "s"
        ) {

            ubahArah("DOWN");

        }


        else if (
            event.key === "ArrowLeft" ||
            key === "a"
        ) {

            ubahArah("LEFT");

        }


        else if (
            event.key === "ArrowRight" ||
            key === "d"
        ) {

            ubahArah("RIGHT");

        }

    }
);


// ==========================================
// TOMBOL COBA LAGI
// ==========================================

restartButton.addEventListener(
    "click",
    function() {

        mulaiGame();

    }
);


// ==========================================
// JOYSTICK
// ==========================================

let joystickActive = false;

let joystickPointerId = null;


function resetJoystick() {

    joystickKnob.style.left =
        "50%";

    joystickKnob.style.top =
        "50%";


    joystickBase
        .classList
        .remove("active");


    joystickActive = false;

    joystickPointerId = null;
}


function arahDariJoystick(
    clientX,
    clientY
) {

    const rect =
        joystickBase
            .getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;


    const centerY =
        rect.top +
        rect.height / 2;


    const dx =
        clientX - centerX;


    const dy =
        clientY - centerY;


    const jarak =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const batas =
        rect.width / 2 - 34;


    let knobX = dx;

    let knobY = dy;


    if (
        jarak > batas
    ) {

        knobX =
            (dx / jarak) *
            batas;


        knobY =
            (dy / jarak) *
            batas;

    }


    joystickKnob.style.left =
        `calc(50% + ${knobX}px)`;


    joystickKnob.style.top =
        `calc(50% + ${knobY}px)`;


    if (jarak < 15) {

        return;
    }


    if (
        Math.abs(dx) >
        Math.abs(dy)
    ) {

        if (dx > 0) {

            ubahArah("RIGHT");

        }

        else {

            ubahArah("LEFT");

        }

    }

    else {

        if (dy > 0) {

            ubahArah("DOWN");

        }

        else {

            ubahArah("UP");

        }

    }
}


joystickBase.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();


        joystickActive = true;

        joystickPointerId =
            event.pointerId;


        joystickBase
            .classList
            .add("active");


        joystickBase.setPointerCapture(
            event.pointerId
        );


        arahDariJoystick(
            event.clientX,
            event.clientY
        );

    }
);


joystickBase.addEventListener(
    "pointermove",
    function(event) {

        if (
            !joystickActive ||
            event.pointerId !==
            joystickPointerId
        ) {

            return;
        }


        event.preventDefault();


        arahDariJoystick(
            event.clientX,
            event.clientY
        );

    }
);


function joystickSelesai(event) {

    if (
        event.pointerId !==
        joystickPointerId
    ) {

        return;
    }


    resetJoystick();
}


joystickBase.addEventListener(
    "pointerup",
    joystickSelesai
);


joystickBase.addEventListener(
    "pointercancel",
    joystickSelesai
);


// ==========================================
// GERAK ULAR
// ==========================================

function gerakkanUlar() {

    direction =
        nextDirection;


    let headX =
        snakeBody[0].x;


    let headY =
        snakeBody[0].y;


    if (
        direction === "RIGHT"
    ) {

        headX += GRID_SIZE;

    }


    else if (
        direction === "LEFT"
    ) {

        headX -= GRID_SIZE;

    }


    else if (
        direction === "UP"
    ) {

        headY -= GRID_SIZE;

    }


    else if (
        direction === "DOWN"
    ) {

        headY += GRID_SIZE;

    }


    // ======================================
    // TABRAKAN DINDING
    // ======================================

    if (
        headX < 0 ||
        headX >= WIDTH ||
        headY < 0 ||
        headY >= HEIGHT
    ) {

        selesaiGame();

        return;
    }


    const newHead = {

        x: headX,

        y: headY

    };


    // ======================================
    // TABRAKAN TUBUH
    // ======================================

    const tabrakDiri =
        snakeBody.some(
            segment =>
                segment.x === headX &&
                segment.y === headY
        );


    if (tabrakDiri) {

        selesaiGame();

        return;
    }


    snakeBody.unshift(
        newHead
    );


    // ======================================
    // CEK BUAH
    // ======================================

    let makanBuah = false;


    for (
        let i = makanan.length - 1;
        i >= 0;
        i--
    ) {

        const food =
            makanan[i];


        if (
            newHead.x ===
                food.posisi.x &&

            newHead.y ===
                food.posisi.y
        ) {

            makanBuah = true;


            score++;


            // =================================
            // LANGSUNG GANTI WARNA
            // =================================

            warnaUlar =
                buatWarnaAcak();


            // =================================
            // ULAR MAKIN CEPAT
            // =================================

            moveDelay =
                Math.max(
                    40,
                    100 -
                    Math.floor(
                        score / 3
                    ) * 10
                );


            makanan.splice(
                i,
                1
            );


            buatSatuBuah();


            break;
        }
    }


    if (!makanBuah) {

        snakeBody.pop();

    }
}


// ==========================================
// GAME OVER
// ==========================================

function selesaiGame() {

    if (gameOver) {

        return;
    }


    gameOver = true;


    finalScore.textContent =
        score;


    gameOverScreen
        .classList
        .add("show");


    resetJoystick();
}


// ==========================================
// BUAH KADALUARSA
// ==========================================

function perbaruiMakanan() {

    const sekarang =
        performance.now();


    for (
        let i = makanan.length - 1;
        i >= 0;
        i--
    ) {

        if (
            sekarang -
            makanan[i].waktu >=
            waktuMakanan
        ) {

            makanan.splice(
                i,
                1
            );


            buatSatuBuah();

        }
    }
}


// ==========================================
// BACKGROUND
// ==========================================

function gambarBackground() {

    ctx.fillStyle =
        BACKGROUND_COLOR;

}


// ==========================================
// GRID
// ==========================================

function gambarGrid() {

    ctx.strokeStyle =
        "rgb(48, 48, 48)";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x <= WIDTH;
        x += GRID_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            HEIGHT
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y <= HEIGHT;
        y += GRID_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            WIDTH,
            y
        );

        ctx.stroke();

    }
}


// ==========================================
// BUAH
// ==========================================

function gambarMakanan() {

    makanan.forEach(food => {

        const x =
            food.posisi.x +
            GRID_SIZE / 2;


        const y =
            food.posisi.y +
            GRID_SIZE / 2;


        ctx.save();


        // ==================================
        // APEL
        // ==================================

        if (
            food.nama === "apel"
        ) {

            ctx.fillStyle =
                "rgba(0,0,0,0.25)";

            ctx.beginPath();

            ctx.ellipse(
                x,
                y + 8,
                7,
                2.5,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#e53935";

            ctx.beginPath();

            ctx.arc(
                x - 3.5,
                y + 1,
                6.5,
                0,
                Math.PI * 2
            );

            ctx.arc(
                x + 3.5,
                y + 1,
                6.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.strokeStyle =
                "#5d4037";

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y - 5
            );

            ctx.lineTo(
                x + 1,
                y - 9
            );

            ctx.stroke();


            ctx.fillStyle =
                "#43a047";

            ctx.beginPath();

            ctx.ellipse(
                x + 4,
                y - 8,
                4,
                2,
                -0.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "rgba(255,255,255,0.55)";

            ctx.beginPath();

            ctx.arc(
                x - 4,
                y - 1,
                1.5,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        // ==================================
        // JERUK
        // ==================================

        else if (
            food.nama === "jeruk"
        ) {

            ctx.fillStyle =
                "rgba(0,0,0,0.25)";

            ctx.beginPath();

            ctx.ellipse(
                x,
                y + 8,
                7,
                2.5,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#ff9800";

            ctx.beginPath();

            ctx.arc(
                x,
                y + 1,
                7.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "rgba(255,210,100,0.7)";


            const titikJeruk = [

                [-4, -1],
                [0, -4],
                [4, -1],
                [-5, 3],
                [0, 1],
                [4, 3],
                [-2, 5],
                [2, 5]

            ];


            titikJeruk.forEach(
                p => {

                    ctx.beginPath();

                    ctx.arc(
                        x + p[0],
                        y + p[1],
                        0.7,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                }
            );


            ctx.strokeStyle =
                "#795548";

            ctx.lineWidth = 1.5;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y - 6
            );

            ctx.lineTo(
                x + 1,
                y - 9
            );

            ctx.stroke();


            ctx.fillStyle =
                "#43a047";

            ctx.beginPath();

            ctx.ellipse(
                x + 4,
                y - 7,
                4,
                2,
                -0.5,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        // ==================================
        // ANGGUR
        // ==================================

        else if (
            food.nama === "anggur"
        ) {

            ctx.strokeStyle =
                "#6d4c41";

            ctx.lineWidth = 1.5;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y - 5
            );

            ctx.lineTo(
                x + 2,
                y - 9
            );

            ctx.stroke();


            ctx.fillStyle =
                "#43a047";

            ctx.beginPath();

            ctx.ellipse(
                x + 4,
                y - 7,
                4,
                2,
                -0.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            const grapes = [

                [-3, -1],
                [3, -1],

                [-5, 4],
                [0, 4],
                [5, 4],

                [-2.5, 9],
                [2.5, 9]

            ];


            grapes.forEach(
                (pos, index) => {

                    ctx.fillStyle =
                        index % 2 === 0
                            ? "#8e44ad"
                            : "#9b59b6";


                    ctx.beginPath();

                    ctx.arc(
                        x + pos[0],
                        y + pos[1],
                        3.5,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();


                    ctx.fillStyle =
                        "rgba(255,255,255,0.4)";

                    ctx.beginPath();

                    ctx.arc(
                        x + pos[0] - 1,
                        y + pos[1] - 1,
                        0.8,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                }
            );

        }


        // ==================================
        // BLUEBERRY
        // ==================================

        else if (
            food.nama === "blueberry"
        ) {

            ctx.fillStyle =
                "rgba(0,0,0,0.25)";

            ctx.beginPath();

            ctx.ellipse(
                x,
                y + 8,
                7,
                2.5,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#2962ff";

            ctx.beginPath();

            ctx.arc(
                x,
                y + 1,
                7.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#1a237e";

            ctx.beginPath();

            ctx.arc(
                x,
                y - 4,
                2.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#43a047";

            ctx.beginPath();

            ctx.ellipse(
                x + 3,
                y - 7,
                4,
                2,
                -0.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "rgba(255,255,255,0.55)";

            ctx.beginPath();

            ctx.arc(
                x - 3,
                y - 2,
                1.5,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        // ==================================
        // KIWI
        // ==================================

        else if (
            food.nama === "kiwi"
        ) {

            ctx.fillStyle =
                "#795548";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                8,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#8bc34a";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                6.2,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#fff9c4";

            ctx.beginPath();

            ctx.ellipse(
                x,
                y,
                2,
                2.5,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#222";


            const seedsKiwi = [

                [-3, -3],
                [0, -4],
                [3, -3],

                [-4, 0],
                [4, 0],

                [-3, 3],
                [0, 4],
                [3, 3]

            ];


            seedsKiwi.forEach(
                seed => {

                    ctx.beginPath();

                    ctx.ellipse(
                        x + seed[0],
                        y + seed[1],
                        0.8,
                        1.3,
                        0,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                }
            );

        }


        // ==================================
        // STROBERI
        // ==================================

        else if (
            food.nama === "stroberi"
        ) {

            ctx.fillStyle =
                "rgba(0,0,0,0.25)";

            ctx.beginPath();

            ctx.ellipse(
                x,
                y + 8,
                7,
                2.5,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#f44336";

            ctx.beginPath();

            ctx.moveTo(
                x,
                y + 9
            );

            ctx.bezierCurveTo(
                x - 9,
                y + 3,
                x - 8,
                y - 6,
                x,
                y - 4
            );

            ctx.bezierCurveTo(
                x + 8,
                y - 6,
                x + 9,
                y + 3,
                x,
                y + 9
            );

            ctx.fill();


            ctx.fillStyle =
                "#43a047";

            ctx.beginPath();

            ctx.moveTo(
                x,
                y - 4
            );

            ctx.lineTo(
                x - 7,
                y - 9
            );

            ctx.lineTo(
                x - 3,
                y - 3
            );

            ctx.lineTo(
                x,
                y - 8
            );

            ctx.lineTo(
                x + 3,
                y - 3
            );

            ctx.lineTo(
                x + 7,
                y - 9
            );

            ctx.lineTo(
                x + 4,
                y - 1
            );

            ctx.closePath();

            ctx.fill();


            ctx.fillStyle =
                "#ffeb3b";


            const seedsStrawberry = [

                [-3, 0],
                [0, 0],
                [3, 0],

                [-4, 4],
                [0, 5],
                [4, 4]

            ];


            seedsStrawberry.forEach(
                seed => {

                    ctx.save();

                    ctx.translate(
                        x + seed[0],
                        y + seed[1]
                    );

                    ctx.rotate(-0.4);

                    ctx.fillRect(
                        -0.7,
                        -1.5,
                        1.4,
                        3
                    );

                    ctx.restore();

                }
            );

        }


        ctx.restore();

    });
}


// ==========================================
// ULAR
// ==========================================

function gambarUlar() {

    snakeBody.forEach(
        (segment, index) => {

            const x =
                segment.x +
                GRID_SIZE / 2;


            const y =
                segment.y +
                GRID_SIZE / 2;


            const radius =
                index === 0
                    ? 9
                    : 8;


            // Bayangan

            ctx.fillStyle =
                "rgba(0,0,0,0.25)";

            ctx.beginPath();

            ctx.arc(
                x + 1,
                y + 2,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Badan

            ctx.fillStyle =
                warnaUlar;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Highlight

            ctx.fillStyle =
                "rgba(255,255,255,0.18)";

            ctx.beginPath();

            ctx.arc(
                x - 3,
                y - 3,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );
}


// ==========================================
// MATA
// ==========================================

function gambarMata() {

    if (
        snakeBody.length === 0
    ) {

        return;
    }


    const head =
        snakeBody[0];


    const centerX =
        head.x +
        GRID_SIZE / 2;


    const centerY =
        head.y +
        GRID_SIZE / 2;


    let eye1X;

    let eye1Y;

    let eye2X;

    let eye2Y;


    if (
        direction === "RIGHT"
    ) {

        eye1X =
            centerX + 5;

        eye1Y =
            centerY - 4;


        eye2X =
            centerX + 5;

        eye2Y =
            centerY + 4;

    }


    else if (
        direction === "LEFT"
    ) {

        eye1X =
            centerX - 5;

        eye1Y =
            centerY - 4;


        eye2X =
            centerX - 5;

        eye2Y =
            centerY + 4;

    }


    else if (
        direction === "UP"
    ) {

        eye1X =
            centerX - 4;

        eye1Y =
            centerY - 5;


        eye2X =
            centerX + 4;

        eye2Y =
            centerY - 5;

    }


    else {

        eye1X =
            centerX - 4;

        eye1Y =
            centerY + 5;


        eye2X =
            centerX + 4;

        eye2Y =
            centerY + 5;

    }


    // Putih mata

    ctx.fillStyle =
        "white";


    ctx.beginPath();

    ctx.arc(
        eye1X,
        eye1Y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        eye2X,
        eye2Y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Pupil

    ctx.fillStyle =
        "#111";


    let pupilX = 0;

    let pupilY = 0;


    if (
        direction === "RIGHT"
    ) {

        pupilX = 1;

    }

    else if (
        direction === "LEFT"
    ) {

        pupilX = -1;

    }

    else if (
        direction === "UP"
    ) {

        pupilY = -1;

    }

    else {

        pupilY = 1;

    }


    ctx.beginPath();

    ctx.arc(
        eye1X + pupilX,
        eye1Y + pupilY,
        1.5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        eye2X + pupilX,
        eye2Y + pupilY,
        1.5,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ==========================================
// SKOR
// ==========================================

function gambarScore() {

    ctx.fillStyle =
        "white";

    ctx.font =
        "bold 22px Arial";

    ctx.textAlign =
        "left";

    ctx.fillText(
        `SKOR: ${score}`,
        20,
        35
    );
}


// ==========================================
// GAMBAR SEMUA
// ==========================================

function gambar() {

    ctx.fillStyle =
        "#1e1e1e";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    gambarGrid();

    gambarMakanan();

    gambarUlar();

    gambarMata();

    gambarScore();
}


// ==========================================
// GAME LOOP
// ==========================================

function gameLoop(timestamp) {

    if (!lastTime) {

        lastTime =
            timestamp;
    }


    const delta =
        timestamp - lastTime;


    lastTime =
        timestamp;


    if (!gameOver) {

        moveTimer += delta;


        if (
            moveTimer >= moveDelay
        ) {

            moveTimer = 0;

            gerakkanUlar();

        }


        perbaruiMakanan();

    }


    gambar();


    requestAnimationFrame(
        gameLoop
    );
}


// ==========================================
// MULAI
// ==========================================

mulaiGame();


requestAnimationFrame(
    gameLoop
);
