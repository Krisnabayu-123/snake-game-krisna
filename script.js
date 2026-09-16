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


// ==========================================
// UKURAN GAME
// ==========================================

const WIDTH = 800;

const HEIGHT = 600;

const GRID_SIZE = 20;


// ==========================================
// WARNA
// ==========================================

const BACKGROUND =
    "rgb(30, 30, 30)";

const GRID_COLOR =
    "rgb(48, 48, 48)";


// ==========================================
// ULAR
// ==========================================

let snakeBody = [];

let direction = "RIGHT";

let warnaUlar =
    "rgb(46, 204, 113)";


// ==========================================
// BUAH
// ==========================================

const jumlahMakanan = 20;

const waktuMakanan = 5000;

let makanan = [];


const buah = [

    {
        nama: "apel",
        warna: "#e53935"
    },

    {
        nama: "jeruk",
        warna: "#ff9800"
    },

    {
        nama: "anggur",
        warna: "#8e44ad"
    },

    {
        nama: "blueberry",
        warna: "#2962ff"
    },

    {
        nama: "kiwi",
        warna: "#8bc34a"
    },

    {
        nama: "stroberi",
        warna: "#f44336"
    }

];


// ==========================================
// STATUS GAME
// ==========================================

let score = 0;

let moveDelay = 100;

let moveTimer = 0;

let gameOver = false;

let lastTime = 0;


// ==========================================
// MEMBUAT POSISI BUAH
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
// MEMBUAT SATU BUAH
// ==========================================

function buatSatuBuah() {

    const jenis =
        buah[
            Math.floor(
                Math.random() *
                buah.length
            )
        ];


    makanan.push({

        posisi:
            buatPosisiAcakMakanan(),

        nama:
            jenis.nama,

        warna:
            jenis.warna,

        waktu:
            performance.now()

    });
}


// ==========================================
// MEMBUAT 20 BUAH
// ==========================================

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
// WARNA ULAR
// ==========================================

function buatWarnaAcak() {

    const r =
        Math.floor(
            Math.random() * 206
        ) + 50;


    const g =
        Math.floor(
            Math.random() * 206
        ) + 50;


    const b =
        Math.floor(
            Math.random() * 206
        ) + 50;


    return `rgb(${r}, ${g}, ${b})`;
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


    warnaUlar =
        "rgb(46, 204, 113)";


    score = 0;


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
// GANTI ARAH
// ==========================================

function ubahArah(newDirection) {

    if (gameOver) {

        return;
    }


    if (
        newDirection === "UP" &&
        direction !== "DOWN"
    ) {

        direction = "UP";

    }


    else if (
        newDirection === "DOWN" &&
        direction !== "UP"
    ) {

        direction = "DOWN";

    }


    else if (
        newDirection === "LEFT" &&
        direction !== "RIGHT"
    ) {

        direction = "LEFT";

    }


    else if (
        newDirection === "RIGHT" &&
        direction !== "LEFT"
    ) {

        direction = "RIGHT";

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

const joystickBase =
    document.getElementById(
        "joystickBase"
    );


const joystickKnob =
    document.getElementById(
        "joystickKnob"
    );


let joystickActive = false;

let joystickPointerId = null;


// ==========================================
// RESET JOYSTICK
// ==========================================

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


// ==========================================
// ARAH JOYSTICK
// ==========================================

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


    if (jarak < 18) {

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


// ==========================================
// JOYSTICK - TEKAN
// ==========================================

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


// ==========================================
// JOYSTICK - GERAK
// ==========================================

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


// ==========================================
// JOYSTICK - LEPAS
// ==========================================

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

    let headX =
        snakeBody[0].x;


    let headY =
        snakeBody[0].y;


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


    // ======================================
    // TABRAKAN TUBUH SENDIRI
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


    snakeBody.unshift(newHead);


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


            // Semakin tinggi skor,
            // semakin cepat ular

            moveDelay =
                Math.max(
                    40,
                    100 -
                    Math.floor(score / 3) * 10
                );


            makanan.splice(i, 1);


            buatSatuBuah();


            break;
        }
    }


    // ======================================
    // ULAR TIDAK MAKAN
    // ======================================

    if (!makanBuah) {

        snakeBody.pop();

    }


    // ======================================
    // GANTI WARNA SESUAI SKOR
    // ======================================

    if (
        score > 0 &&
        score % 5 === 0
    ) {

        warnaUlar =
            buatWarnaAcak();

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
// CEK BUAH KADALUARSA
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

            makanan.splice(i, 1);

            buatSatuBuah();

        }
    }
}


// ==========================================
// BACKGROUND
// ==========================================

function gambarBackground() {

    ctx.fillStyle =
        BACKGROUND;


    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );
}


// ==========================================
// GRID
// ==========================================

function gambarGrid() {

    ctx.strokeStyle =
        GRID_COLOR;


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

        if (food.nama === "apel") {

            // Bayangan

            ctx.fillStyle =
                "rgba(0,0,0,0.25)";

            ctx.beginPath();

            ctx.ellipse(
                x,
                y + 8,
                8,
                3,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Badan apel

            ctx.fillStyle =
                "#e53935";

            ctx.beginPath();

            ctx.arc(
                x - 4,
                y + 1,
                7,
                0,
                Math.PI * 2
            );

            ctx.arc(
                x + 4,
                y + 1,
                7,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Bagian atas

            ctx.fillStyle =
                "#c62828";

            ctx.beginPath();

            ctx.arc(
                x,
                y - 1,
                4,
                Math.PI,
                Math.PI * 2
            );

            ctx.fill();


            // Batang

            ctx.strokeStyle =
                "#6d4c41";

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y - 6
            );

            ctx.lineTo(
                x + 2,
                y - 11
            );

            ctx.stroke();


            // Daun

            ctx.fillStyle =
                "#43a047";

            ctx.beginPath();

            ctx.ellipse(
                x + 5,
                y - 9,
                5,
                2.5,
                -0.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Kilau

            ctx.fillStyle =
                "rgba(255,255,255,0.5)";

            ctx.beginPath();

            ctx.arc(
                x - 5,
                y - 1,
                2,
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
                8,
                3,
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
                8,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Tekstur kulit

            ctx.fillStyle =
                "rgba(255,190,60,0.7)";


            const titik =
                [
                    [-4, -2],
                    [0, -4],
                    [4, -2],
                    [-5, 2],
                    [0, 1],
                    [5, 3],
                    [-2, 5],
                    [3, 5]
                ];


            titik.forEach(
                p => {

                    ctx.beginPath();

                    ctx.arc(
                        x + p[0],
                        y + p[1],
                        0.8,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                }
            );


            // Daun

            ctx.fillStyle =
                "#43a047";

            ctx.beginPath();

            ctx.ellipse(
                x + 5,
                y - 7,
                5,
                2.5,
                -0.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Batang

            ctx.strokeStyle =
                "#795548";

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y - 6
            );

            ctx.lineTo(
                x + 1,
                y - 10
            );

            ctx.stroke();


            // Kilau

            ctx.fillStyle =
                "rgba(255,255,255,0.45)";

            ctx.beginPath();

            ctx.arc(
                x - 3,
                y - 2,
                2,
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

            // Batang

            ctx.strokeStyle =
                "#6d4c41";

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y - 5
            );

            ctx.lineTo(
                x + 2,
                y - 11
            );

            ctx.stroke();


            // Daun

            ctx.fillStyle =
                "#43a047";

            ctx.beginPath();

            ctx.ellipse(
                x + 5,
                y - 8,
                5,
                3,
                -0.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            const grapes = [

                [-4, -2],
                [4, -2],

                [-6, 4],
                [0, 4],
                [6, 4],

                [-3, 10],
                [3, 10]

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
                        4,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();


                    // Kilau kecil

                    ctx.fillStyle =
                        "rgba(255,255,255,0.35)";

                    ctx.beginPath();

                    ctx.arc(
                        x + pos[0] - 1.5,
                        y + pos[1] - 1.5,
                        1,
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
                8,
                3,
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
                8,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Bagian atas

            ctx.fillStyle =
                "#1a237e";

            ctx.beginPath();

            ctx.arc(
                x,
                y - 4,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Daun

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


            // Kilau

            ctx.fillStyle =
                "rgba(255,255,255,0.5)";

            ctx.beginPath();

            ctx.arc(
                x - 3,
                y - 2,
                2,
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

            // Kulit

            ctx.fillStyle =
                "#795548";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                9,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Daging kiwi

            ctx.fillStyle =
                "#8bc34a";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                7,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Tengah

            ctx.fillStyle =
                "#fff9c4";

            ctx.beginPath();

            ctx.ellipse(
                x,
                y,
                2.5,
                3,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Biji

            ctx.fillStyle =
                "#222";

            const seeds = [

                [-3, -3],
                [0, -4],
                [3, -3],

                [-4, 0],
                [4, 0],

                [-3, 3],
                [0, 4],
                [3, 3]

            ];


            seeds.forEach(
                seed => {

                    ctx.beginPath();

                    ctx.ellipse(
                        x + seed[0],
                        y + seed[1],
                        1,
                        1.6,
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

            // Bayangan

            ctx.fillStyle =
                "rgba(0,0,0,0.25)";

            ctx.beginPath();

            ctx.ellipse(
                x,
                y + 8,
                8,
                3,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Buah

            ctx.fillStyle =
                "#f44336";

            ctx.beginPath();

            ctx.moveTo(
                x,
                y + 9
            );

            ctx.bezierCurveTo(
                x - 10,
                y + 3,
                x - 9,
                y - 7,
                x,
                y - 4
            );

            ctx.bezierCurveTo(
                x + 9,
                y - 7,
                x + 10,
                y + 3,
                x,
                y + 9
            );

            ctx.fill();


            // Daun atas

            ctx.fillStyle =
                "#43a047";

            ctx.beginPath();

            ctx.moveTo(
                x,
                y - 4
            );

            ctx.lineTo(
                x - 8,
                y - 9
            );

            ctx.lineTo(
                x - 4,
                y - 3
            );

            ctx.lineTo(
                x,
                y - 8
            );

            ctx.lineTo(
                x + 4,
                y - 3
            );

            ctx.lineTo(
                x + 8,
                y - 9
            );

            ctx.lineTo(
                x + 4,
                y - 1
            );

            ctx.closePath();

            ctx.fill();


            // Biji

            ctx.fillStyle =
                "#ffeb3b";

            const seeds = [

                [-4, -1],
                [0, 0],
                [4, -1],

                [-5, 4],
                [0, 5],
                [5, 4]

            ];


            seeds.forEach(
                seed => {

                    ctx.save();

                    ctx.translate(
                        x + seed[0],
                        y + seed[1]
                    );

                    ctx.rotate(-0.4);

                    ctx.fillRect(
                        -1,
                        -2,
                        2,
                        4
                    );

                    ctx.restore();

                }
            );
        }


        ctx.restore();

    });
}


// ==========================================
// GAMBAR ULAR
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


            // Badan ular

            ctx.fillStyle =
                index === 0
                    ? warnaUlar
                    : warnaUlar;


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
                "rgba(255,255,255,0.15)";


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
// MATA ULAR
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


    let pupilOffsetX = 0;

    let pupilOffsetY = 0;


    if (
        direction === "RIGHT"
    ) {

        pupilOffsetX = 1;

    }


    else if (
        direction === "LEFT"
    ) {

        pupilOffsetX = -1;

    }


    else if (
        direction === "UP"
    ) {

        pupilOffsetY = -1;

    }


    else {

        pupilOffsetY = 1;

    }


    ctx.beginPath();

    ctx.arc(
        eye1X + pupilOffsetX,
        eye1Y + pupilOffsetY,
        1.5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        eye2X + pupilOffsetX,
        eye2Y + pupilOffsetY,
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

    gambarBackground();

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

        lastTime = timestamp;
    }


    const delta =
        timestamp - lastTime;


    lastTime = timestamp;


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
