"use client";
import React, { useState } from "react";

function GameControls() {
  return (
    <div className="p-1 bg-lime-400 w-full rounded">
      <BetPanel />
      <div className="flex justify-evenly gap-2">
        <AddGameButton />
        <NewBeerRoundButton />
      </div>
    </div>
  );
}

function BetPanel() {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        step="0.01"
        min="0.10"
        max="1.00"
        value="0.50"
        className="pl-1"
      />
      <span className="text-sm">Rufspiel: 0,50</span>
      <span className="text-sm">Solo: 1,00</span>
      <span className="text-sm">Hochzeit: 1,00</span>
    </div>
  );
}

function AddGameButton() {
  return <button className="bg-lime-500 rounded p-1 m-2">Add Game</button>;
}

function NewBeerRoundButton() {
  return (
    <button className="bg-lime-500 rounded p-1 m-2">New Beer Round! 🍻</button>
  );
}

function PlayerDisplay({ players, balance }) {
  return (
    <div className="flex justify-evenly p-1 bg-lime-400 w-full rounded">
      <div className="flex flex-col items-center w-[80px]">
        <PlayerName name={players[0]} />
        <PlayerBalance balance={balance[0].toFixed(2)} />
      </div>
      <div className="flex flex-col items-center w-[80px]">
        <PlayerName name={players[1]} />
        <PlayerBalance balance={balance[1].toFixed(2)} />
      </div>
      <div className="flex flex-col items-center w-[80px]">
        <PlayerName name={players[2]} />
        <PlayerBalance balance={balance[2].toFixed(2)} />
      </div>
      <div className="flex flex-col items-center w-[80px]">
        <PlayerName name={players[3]} />
        <PlayerBalance balance={balance[3].toFixed(2)} />
      </div>
    </div>
  );
}

function PlayerName({ name }) {
  return <div className="text-sm">{name}</div>;
}

function PlayerBalance({ balance }) {
  return <div className="text-sm">{balance}€</div>;
}

function GameTable() {
  return (
    <div className="p-1 bg-lime-400 w-full rounded">
      <GameRow />
    </div>
  );
}

function GameRow() {
  return (
    <div className="bg-lime-400 mb-2">
      <div>1. Spiel</div>
      <div className="flex justify-evenly">
        <div className="w-[80px] text-center text-sm">0,50€</div>
        <div className="w-[80px] text-center text-sm">0,50€</div>
        <div className="w-[80px] text-center text-sm">0,50€</div>
        <div className="w-[80px] text-center text-sm">0,50€</div>
      </div>
      <hr className="border-gray-500" />
    </div>
  );
}

function NewGamePopup({ setPlayers }) {
  const [popupIsVisible, setPopupIsVisible] = useState(true);
  let errorIsVisible = false;

  function startGame() {
    const playerNameOne = document.getElementById("playername-one").value;
    const playerNameTwo = document.getElementById("playername-two").value;
    const playerNameThree = document.getElementById("playername-three").value;
    const playerNameFour = document.getElementById("playername-four").value;
    if (
      playerNameOne == "" ||
      playerNameTwo == "" ||
      playerNameThree == "" ||
      playerNameFour == ""
    ) {
      if (errorIsVisible) return;
      const errorMessage = document.createElement("div");
      const main = document.getElementById("newgamepopup");
      main.appendChild(errorMessage);
      errorMessage.textContent = "Gib allen 4 Spielern einen Namen!";
      errorMessage.style.color = "darkred";
      errorIsVisible = true;
    } else {
      setPlayers([
        playerNameOne,
        playerNameTwo,
        playerNameThree,
        playerNameFour,
      ]);
      setPopupIsVisible(false);
    }
  }
  if (popupIsVisible) {
    return (
      <>
        <main
          id="newgamepopup"
          className="fixed top-4 opacity-95 left-0 right-0 m-2 p-4 w-[360px] mx-auto bg-green-500 rounded shadow-2xl flex flex-col items-center gap-2"
        >
          <div className="mb-4">
            <strong>Willkommen bei Bierkopf 🃏🍻</strong>
          </div>
          <div className="flex gap-4">
            <label for="playerName">Spieler 1:</label>
            <input
              type="text"
              id="playername-one"
              name="playername-one"
              className="w-20 px-1"
            />
          </div>
          <div className="flex gap-4">
            <label for="playerName">Spieler 2:</label>
            <input
              type="text"
              id="playername-two"
              name="playername-two"
              className="w-20 px-1"
            />
          </div>
          <div className="flex gap-4">
            <label for="playerName">Spieler 3:</label>
            <input
              type="text"
              id="playername-three"
              name="playername-three"
              className="w-20 px-1"
            />
          </div>
          <div className="flex gap-4">
            <label for="playerName">Spieler 4:</label>
            <input
              type="text"
              id="playername-four"
              name="playername-four"
              className="w-20 px-1"
            />
          </div>
          <button
            className="w-full bg-green-600 rounded p-2 mt-2"
            onClick={startGame}
          >
            Spiel starten!
          </button>
        </main>
      </>
    );
  } else return null;
}

export default function Game() {
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState([0.0, 0.0, 0.0, 0.0]);

  return (
    <>
      <main className="m-2 p-4 w-[390px] h-[844px] mx-auto bg-lime-700 rounded-xl shadow-2xl flex flex-col items-center gap-2">
        <GameControls />
        <PlayerDisplay players={players} balance={balance} />
        <GameTable />
      </main>
      <NewGamePopup setPlayers={setPlayers} />
    </>
  );
}
