// Pop up
const popUp = document.querySelector('.pop-up');
const modalDefault = document.querySelector('.modal-default');
const modalStep = document.querySelector('.modal-steps');

const overlay = document.querySelector('.overlay');

const btnStepGame = document.querySelector('.steps-game');
const btnCloseModal = document.querySelector('.close-modal');
const btnPlayGame = document.querySelector('.play-game');

// Permainan
const areaGame = document.querySelector('.container');
const foodPlace = document.querySelector('.food-place');
const snakeHead = document.querySelector('.snake-head');

// Analog hp
const base = document.getElementById('analog-base');
const stick = document.getElementById('analog-stick');

// Pop up
btnPlayGame.addEventListener('click', function () {
  overlay.classList.add('hidden');
  popUp.classList.add('hidden');
});

btnStepGame.addEventListener('click', function () {
  modalDefault.classList.add('hidden');
  modalStep.classList.remove('hidden');
});

btnCloseModal.addEventListener('click', function () {
  modalStep.classList.add('hidden');
  modalDefault.classList.remove('hidden');
});

// Game

//function muncul makanan
const foodAppears = function () {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const foodSizaW = Math.floor(screenWidth * 0.15);
  const foodSizaH = Math.floor(screenHeight * 0.15);

  const initialFoodAmount = Math.floor(Number(screenWidth * 0.01));

  for (let i = 0; i <= initialFoodAmount; i++) {
    const imageNumber = Math.floor(Math.random() * 6) + 1;

    const randomX = Math.floor(Math.random() * (screenWidth - foodSizaW));
    const randomY = Math.floor(Math.random() * (screenHeight - foodSizaH));

    foodPlace.insertAdjacentHTML(
      'beforeend',
      `<img class="style-food"
            src="img/makanan/${imageNumber}.png"
            style="left: ${randomX}px;
                   top: ${randomY}px;">`,
    );
  }
};
foodAppears();

// function analog
const analog = function () {
  // Cek apakah layar berada di rentang tablet (Max-width 1024px)
  const isTuchScreen = window.matchMedia(
    '(min-width: 0px) and (max-width: 1024px)',
  ).matches;

  if (isTuchScreen) {
  // --- 1. SETUP TITIK PUSAT ANALOG ---
const rect = base.getBoundingClientRect();
// Titik pusat ini harus TETAP (const), tidak boleh berubah saat ular jalan
const pusatAnalogX = rect.left + rect.width / 2;
const pusatAnalogY = rect.top + rect.height / 2;

// --- 2. SETUP DATA ULAR (Variabel Global) ---
let snakeX = window.innerWidth / 2; // Mulai di tengah layar
let snakeY = window.innerHeight / 2;
let sudutUlar = 0;
let sedangMenyentuh = false;

// --- 3. LOGIKA INPUT ANALOG ---
base.addEventListener('touchmove', e => {
    e.preventDefault(); // Mencegah layar scroll saat main
    const touch = e.touches[0];

    // Hitung jarak jari dari PUSAT ANALOG (Bukan dari ular)
    const deltaX = touch.clientX - pusatAnalogX;
    const deltaY = touch.clientY - pusatAnalogY;

    // Dapatkan sudut arah tarikan jempol
    const radian = Math.atan2(deltaY, deltaX);
    sudutUlar = radian; // Simpan sudut untuk digunakan mesin gerak
    sedangMenyentuh = true;

    // GERAKKAN VISUAL STICK (Hanya hiasan di dalam lingkaran analog)
    const jarakMax = 40; 
    const jarakAktual = Math.min(Math.hypot(deltaX, deltaY), jarakMax);
    const stickX = Math.cos(radian) * jarakAktual;
    const stickY = Math.sin(radian) * jarakAktual;

    stick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
});

base.addEventListener('touchend', () => {
    stick.style.transform = `translate(-50%, -50%)`;
    // sedangMenyentuh = false; // Buka ini jika ingin ular berhenti saat jari lepas
});

// --- 4. MESIN GERAK (GAME LOOP) ---
function update() {
    if (sedangMenyentuh) {
        const kecepatan = 5;

        // Ular bergerak berdasarkan SUDUT yang dihasilkan analog
        const vx = Math.cos(sudutUlar) * kecepatan;
        const vy = Math.sin(sudutUlar) * kecepatan;

        snakeX += vx;
        snakeY += vy;

        // Update Posisi Visual Kepala Ular
        snakeHead.style.left = `${snakeX}px`;
        snakeHead.style.top = `${snakeY}px`;

        // Putar kepala ular agar menghadap ke arah jalan
        const derajat = sudutUlar * (180 / Math.PI);
        snakeHead.style.transform = `rotate(${derajat}deg)`;
    }

    requestAnimationFrame(update);
}

// Jalankan mesin game
update();
  } else {
    const rect = snakeHead.getBoundingClientRect();
    let snakeX = rect.x;
    let snakeY = rect.y;

    document.addEventListener('mousemove', function (e) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Hitung selisih jarak
      const deltaX = mouseX - snakeX;
      const deltaY = mouseY - snakeY;

      // Dapatkan sudut dalam Radian
      const radian = Math.atan2(deltaY, deltaX);

      const derajat = radian * (180 / Math.PI);

      const kecepatan = 5; // Kecepatan lari ular

      // Ular akan bergerak ke arah sudut tersebut
      const velocityX = Math.cos(radian) * kecepatan;
      const velocityY = Math.sin(radian) * kecepatan;
      console.info(velocityX, velocityY);

      // Update posisi ular
      snakeX += velocityX;
      snakeY += velocityY;

      // Hubungkan koordinat logic dengan tampilan visual
      snakeHead.style.left = snakeX + 'px';
      snakeHead.style.top = snakeY + 'px';

      // Opsional: Putar kepala ular agar menghadap ke arah jalan
      snakeHead.style.transform = `rotate(${derajat + 90}deg)`;
    });
  }

  // Atau menggunakan getBoundingClientRect untuk posisi yang lebih presisi
};
analog();
