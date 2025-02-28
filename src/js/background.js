/*
Muss überarbeitet werden
*/
const body = document.body;

const backgrounds = [
  'url("/images/bg/1.jpg")',
  'url("/images/bg/2.jpg")',
  'url("/images/bg/3.jpg")',
  'url("/images/bg/4.jpg")'
];

let currentIndex = 0;

function changeBackground() {
  currentIndex = (currentIndex + 1) % backgrounds.length;
  const newBg = backgrounds[currentIndex];

  const bgDiv = document.createElement("div");
  bgDiv.classList.add("background-fade");
  bgDiv.style.backgroundImage = newBg;

  document.body.appendChild(bgDiv);

  setTimeout(() => {
    bgDiv.classList.add("show");
  }, 10);
  setTimeout(() => {
    const oldBg = document.querySelectorAll(".background-fade");
    if (oldBg.length > 1) {
      const oldImage = oldBg[0];
      oldImage.classList.remove("show");
      setTimeout(() => {
        oldImage.remove();
      }, 1000); 
    }
  }, 1000);
}

changeBackground();

setInterval(changeBackground, 10000);
