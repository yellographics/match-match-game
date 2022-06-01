"use strict";

const cards = document.querySelectorAll(".flip-card");
const endGameModal = document.querySelector(".end-game");
const restartBtn = document.querySelector(".restart");
let stepCounter = 0;

let hasFlippedCard = false;
let firstFlippedCard;
let secondFlippedCard;
let isGameEnd = false;

let lastResults = [];
const resultsTable = document.querySelector(".results-table");

function flip() {
  this.querySelector(".flip-card-inner").classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstFlippedCard = this;
    return;
  } else  {
    secondFlippedCard = this;
    hasFlippedCard = false;
  }

  setTimeout(check, 1000);
  setTimeout(checkEnd, 1000);
}

function check() {
  if (firstFlippedCard.dataset.hero !== secondFlippedCard.dataset.hero || secondFlippedCard === firstFlippedCard ) {
    firstFlippedCard.querySelector(".flip-card-inner").classList.remove("flip");
    secondFlippedCard
      .querySelector(".flip-card-inner")
      .classList.remove("flip");
    stepCounter++;
    return;
  } else {
    firstFlippedCard.removeEventListener("click", flip);
    secondFlippedCard.removeEventListener("click", flip);
    stepCounter++;
  }
}

cards.forEach((card) => {
  card.style.order = Math.floor(Math.random() * 12);
  card.addEventListener("click", flip);
});

function checkEnd() {
  isGameEnd = Array.from(cards).every((card) =>
    card.querySelector(".flip-card-inner").classList.contains("flip")
  );
  if (isGameEnd) {
    endGameModal.style.visibility = "visible";
    endGameModal.querySelector("p").innerText = `Steps to win: ${stepCounter}`;
    if (lastResults.length >= 10) {
      lastResults.shift();
    }
    lastResults.push(stepCounter);
    render();
    stepCounter = 0;
  }
}

restartBtn.addEventListener("click", () => {
  endGameModal.style.visibility = "hidden";
  hasFlippedCard = false;
  isGameEnd = false;
  firstFlippedCard = null;
  secondFlippedCard = null;
  cards.forEach((card) =>
    card.querySelector(".flip-card-inner").classList.remove("flip")
  );
  document.location.reload();
});

function render() {
  resultsTable.innerHTML = "";
  lastResults.forEach((result, index) => {
    resultsTable.innerHTML += `<tr><td>${
      index + 1
    }</td><td>Score: ${result}</td></tr>`;
  });
}

function setLocalStorage() {
  localStorage.setItem("results", JSON.stringify(lastResults));
}
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem("results")) {
    lastResults = JSON.parse(localStorage.getItem("results"));
    render();
  }
}
window.addEventListener("load", getLocalStorage);
