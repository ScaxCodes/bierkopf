"use client";
import React, { useState } from "react";

// Question
// Was it good practice to nest the comps into GameControls() for a cleaner look?
// This let to some unexpected behavior/rerendering, see troubles in comment in line 70
// Without the nesting, the counter worked fine and i could set the condition to beerButtonCounter >= 6 as expected

function GameControls({
  popupAddGameIsVisible,
  setPopupAddGameIsVisible,
  amountBeersConsumed,
  setAmountBeersConsumed,
  betSize,
  setBetSize,
}) {
  const [beerButtonCounter, setBeerButtonCounter] = useState(0);
  const [buttonLabel, setButtonLabel] = useState("Neue Runde Bier! 🍻");

  return (
    <div className="p-1 bg-lime-400 w-full rounded">
      <BetPanel />
      <div className="flex justify-evenly gap-2">
        <AddGameButton />
        <NewRoundOfBeerButton />
      </div>
      <BeerCounter />
    </div>
  );

  function BetPanel() {
    function handleButton(event) {
      let value = parseFloat(event.target.value);
      setBetSize(value);
    }

    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="0.1"
          min="0.1"
          max="1"
          // Make sure that the value in the input field is always 2 digits after decimal
          defaultValue={betSize.toFixed(2)}
          onChange={handleButton}
          className="pl-1 text-center"
          name="beer-counter"
          id="beer-counter"
        />
        <span className="text-sm">Rufspiel: {(betSize * 1).toFixed(2)}</span>
        <span className="text-sm">Solo: {(betSize * 2).toFixed(2)}</span>
        <span className="text-sm">Hochzeit: {(betSize * 2).toFixed(2)}</span>
      </div>
    );
  }

  function AddGameButton() {
    function addGame() {
      if (!popupAddGameIsVisible) setPopupAddGameIsVisible(true);
    }

    return (
      <button className="bg-lime-500 rounded p-1 m-2" onClick={addGame}>
        Spiel hinzufügen
      </button>
    );
  }

  // Okay this comp gave me a lot of headache, so this is my final solution:
  // 1)
  // I had to put the states one level higher into the GameControl() comp
  // Else the state would have been set to 0 again with each render of this comp (thats what I experienced)
  // 2)
  // I want the button label to be changed after 6 clicks, but i had to set the condition to >= 5
  // Reason for that is that useState is asynchronous, and there is no way i can wait for setBeerButtonCounter to finish
  function NewRoundOfBeerButton() {
    function handleButton() {
      setBeerButtonCounter(beerButtonCounter + 1);
      console.log(beerButtonCounter);
      if (beerButtonCounter >= 5) setButtonLabel("🫵🏻🤡 1 Kasten reicht!");
      if (amountBeersConsumed == 20) return;
      setAmountBeersConsumed(amountBeersConsumed + 4);
    }

    return (
      <button
        className="bg-lime-500 rounded p-1 m-2"
        onClick={handleButton}
        id="add-beer-button"
      >
        {buttonLabel}
      </button>
    );
  }

  function BeerCounter() {
    let beerString = "";
    for (let i = 0; i < amountBeersConsumed; i += 4) {
      if (i == 0) beerString += "🍺🍺🍺🍺";
      else if (i + 4 == amountBeersConsumed) beerString += " | 🍺🍺🍺🍺";
      else beerString += " | 🍺🍺🍺🍺";
    }
    return <div className="text-xs">{beerString}</div>;
  }
}

function PlayerDisplay({ players, balance }) {
  return (
    <div className="flex justify-evenly p-1 bg-lime-400 w-full rounded">
      {players.map((player, index) => (
        <div key={index} className="flex flex-col items-center w-[80px]">
          <PlayerName name={player} />
          <PlayerBalance individualBalance={balance[index]} />
        </div>
      ))}
    </div>
  );

  function PlayerName({ name }) {
    return <div className="text-sm">{name}</div>;
  }

  function PlayerBalance({ individualBalance }) {
    return (
      <div className="text-sm">{parseFloat(individualBalance).toFixed(2)}€</div>
    );
  }
}

function GameTable({ history, players }) {
  if (history.length == 0)
    return (
      <div className="p-1 bg-lime-400 w-full rounded">
        <div className="text-center">Viel Spaß beim Zocken 🙌</div>
      </div>
    );

  return (
    <div className="p-1 bg-lime-400 w-full rounded">
      {history.map((game, index) => {
        let p1Cashflow = game.winnerteam.includes(players[0])
          ? "+" + game.betSize.toFixed(2) + "€"
          : "-" + game.betSize.toFixed(2) + "€";
        let p2Cashflow = game.winnerteam.includes(players[1])
          ? "+" + game.betSize.toFixed(2) + "€"
          : "-" + game.betSize.toFixed(2) + "€";
        let p3Cashflow = game.winnerteam.includes(players[2])
          ? "+" + game.betSize.toFixed(2) + "€"
          : "-" + game.betSize.toFixed(2) + "€";
        let p4Cashflow = game.winnerteam.includes(players[3])
          ? "+" + game.betSize.toFixed(2) + "€"
          : "-" + game.betSize.toFixed(2) + "€";

        return (
          <div key={index} className="bg-lime-400 mb-2">
            <div className="flex items-center gap-1">
              {index + 1}. Spiel{" "}
              <span className="text-xs">(🍺 x{game.amountBeersConsumed})</span>
            </div>
            <div className="flex justify-evenly">
              <div className="w-[80px] text-center text-sm">{p1Cashflow}</div>
              <div className="w-[80px] text-center text-sm">{p2Cashflow}</div>
              <div className="w-[80px] text-center text-sm">{p3Cashflow}</div>
              <div className="w-[80px] text-center text-sm">{p4Cashflow}</div>
            </div>
            <hr className="border-gray-500" />
          </div>
        );
      })}
    </div>
  );
}

function NewGamePopup({ setPlayers }) {
  const [popupIsVisible, setPopupIsVisible] = useState(true);
  const [errorIsVisible, setErrorIsVisible] = useState(false);

  function startGameSession() {
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
      setErrorIsVisible(true);
    } else {
      setPlayers([
        playerNameOne,
        playerNameTwo,
        playerNameThree,
        playerNameFour,
      ]);
      setErrorIsVisible(false);
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
            <label htmlFor="playername-one">Spieler 1:</label>
            <input
              type="text"
              id="playername-one"
              name="playername-one"
              className="w-20 px-1"
            />
          </div>
          <div className="flex gap-4">
            <label htmlFor="playername-two">Spieler 2:</label>
            <input
              type="text"
              id="playername-two"
              name="playername-two"
              className="w-20 px-1"
            />
          </div>
          <div className="flex gap-4">
            <label htmlFor="playername-three">Spieler 3:</label>
            <input
              type="text"
              id="playername-three"
              name="playername-three"
              className="w-20 px-1"
            />
          </div>
          <div className="flex gap-4">
            <label htmlFor="playername-four">Spieler 4:</label>
            <input
              type="text"
              id="playername-four"
              name="playername-four"
              className="w-20 px-1"
            />
          </div>
          <button
            className="w-full bg-green-600 rounded p-2 mt-2"
            onClick={startGameSession}
          >
            Spiel starten!
          </button>
          {errorIsVisible && <ErrorMessage />}
        </main>
      </>
    );
  }

  function ErrorMessage() {
    return (
      <div className="text-red-800 font-medium">
        Gib allen 4 Spielern einen Namen!
      </div>
    );
  }
}

function AddGamePopup({
  players,
  popupAddGameIsVisible,
  setPopupAddGameIsVisible,
  history,
  setHistory,
  amountBeersConsumed,
  balance,
  setBalance,
  betSize,
}) {
  const [pickWinnerDisplayVisible, setPickWinnerDisplayVisible] =
    useState(false);
  const [firstErrorMessageVisible, setFirstErrorMessageVisible] =
    useState(false);
  const [secondErrorMessageVisible, setSecondErrorMessageVisible] =
    useState(false);
  const [playerButtonsClicked, setPlayerButtonsClicked] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [teamsButtonClicked, setTeamsButtonClicked] = useState([false, false]);

  function saveTeam() {
    if (playerButtonsClicked.filter((bool) => bool === true).length === 2) {
      setFirstErrorMessageVisible(false);
      setPickWinnerDisplayVisible(true);
    } else {
      setFirstErrorMessageVisible(true);
    }
  }

  function saveWinner(a, b, c, d) {
    if (teamsButtonClicked.filter((bool) => bool === true).length === 1) {
      saveGame(a, b, c, d);
      resetAddGameStates();
    } else {
      setSecondErrorMessageVisible(true);
    }
  }

  function resetAddGameStates() {
    setPickWinnerDisplayVisible(false);
    setPopupAddGameIsVisible(false);
    setFirstErrorMessageVisible(false);
    setSecondErrorMessageVisible(false);
    setPlayerButtonsClicked([false, false, false, false]);
    setTeamsButtonClicked([false, false]);
  }

  function saveGame(a, b, c, d) {
    const winnerteam = [];
    if (teamsButtonClicked[0]) winnerteam.push(a, b);
    else winnerteam.push(c, d);
    const arr = [...history];
    const game = {
      callerteam: pickCallingTeam(),
      winnerteam: winnerteam,
      betSize: betSize,
      amountBeersConsumed: amountBeersConsumed,
    };
    arr.push(game);
    setHistory(arr);
    const newBalance = balance;
    game.winnerteam.includes(players[0])
      ? (newBalance[0] += betSize)
      : (newBalance[0] -= betSize);
    game.winnerteam.includes(players[1])
      ? (newBalance[1] += betSize)
      : (newBalance[1] -= betSize);
    game.winnerteam.includes(players[2])
      ? (newBalance[2] += betSize)
      : (newBalance[2] -= betSize);
    game.winnerteam.includes(players[3])
      ? (newBalance[3] += betSize)
      : (newBalance[3] -= betSize);
    setBalance(newBalance);
  }

  function handlePlayerButtonClick(i) {
    const arr = [...playerButtonsClicked];
    arr[i] = !playerButtonsClicked[i];
    setPlayerButtonsClicked(arr);
    setPickWinnerDisplayVisible(false);
  }

  if (popupAddGameIsVisible) {
    return (
      <div className="fixed top-4 opacity-95 left-0 right-0 m-2 p-4 w-[360px] mx-auto bg-green-400 rounded shadow-2xl flex flex-col items-center gap-4">
        <div>Spiel hinzufügen</div>
        <div className="flex gap-2 items-center">
          <div className="w-[60px] text-center mr-8">Rufteam wählen</div>
          <button
            className={`px-2 rounded shadow-2xl ${
              playerButtonsClicked[0] ? "bg-green-500" : "bg-green-300"
            } h-fit`}
            onClick={() => handlePlayerButtonClick(0)}
          >
            {players[0]}
          </button>
          <button
            className={`px-2 rounded shadow-2xl ${
              playerButtonsClicked[1] ? "bg-green-500" : "bg-green-300"
            } h-fit`}
            onClick={() => handlePlayerButtonClick(1)}
          >
            {players[1]}
          </button>
          <button
            className={`px-2 rounded shadow-2xl ${
              playerButtonsClicked[2] ? "bg-green-500" : "bg-green-300"
            } h-fit`}
            onClick={() => handlePlayerButtonClick(2)}
          >
            {players[2]}
          </button>
          <button
            className={`px-2 rounded shadow-2xl ${
              playerButtonsClicked[3] ? "bg-green-500" : "bg-green-300"
            } h-fit`}
            onClick={() => handlePlayerButtonClick(3)}
          >
            {players[3]}
          </button>
        </div>
        <div>
          <button
            className="px-2 rounded shadow-2xl bg-green-300"
            onClick={saveTeam}
          >
            Rufteam speichern
          </button>
        </div>
        {/* React syntax for conditional rendering */}
        {firstErrorMessageVisible && <FirstErrorMessage />}
        {pickWinnerDisplayVisible && <PickWinnerDisplay />}
        {secondErrorMessageVisible && <SecondErrorMessage />}
      </div>
    );
  } else return false;

  function PickWinnerDisplay() {
    const [a, b] = pickCallingTeam();
    const [c, d] = pickOtherTeam();

    return (
      <>
        <div className="flex gap-2 items-center">
          <div className="w-[60px] text-center mr-8">Siegerteam wählen</div>
          <button
            className={`px-2 rounded shadow-2xl ${
              teamsButtonClicked[0] ? "bg-green-500" : "bg-green-300"
            } h-fit`}
            onClick={() => handleTeamsButtonClick(0)}
          >
            {a} & {b}
          </button>
          <button
            className={`px-2 rounded shadow-2xl ${
              teamsButtonClicked[1] ? "bg-green-500" : "bg-green-300"
            } h-fit`}
            onClick={() => handleTeamsButtonClick(1)}
          >
            {c} & {d}
          </button>
        </div>
        <div>
          <button
            className="px-2 rounded shadow-2xl bg-green-300"
            onClick={() => saveWinner(a, b, c, d)}
          >
            Siegerteam speichern
          </button>
        </div>
      </>
    );
  }

  function handleTeamsButtonClick(i) {
    const arr = [...teamsButtonClicked];
    arr[i] = !teamsButtonClicked[i];
    setTeamsButtonClicked(arr);
  }

  function pickCallingTeam() {
    const team = [];
    playerButtonsClicked.forEach((value, index) => {
      if (value) team.push(players[index]);
    });
    return team;
  }

  function pickOtherTeam() {
    const team = [];
    playerButtonsClicked.forEach((value, index) => {
      if (!value) team.push(players[index]);
    });
    return team;
  }

  function FirstErrorMessage() {
    return (
      <div className="text-red-800 font-medium">
        Bitte maximal 2 Spieler wählen!
      </div>
    );
  }

  function SecondErrorMessage() {
    return (
      <div className="text-red-800 font-medium">
        Bitte maximal 1 Siegerteam wählen!
      </div>
    );
  }
}

export default function Game() {
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState([0, 0, 0, 0]);
  const [popupAddGameIsVisible, setPopupAddGameIsVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [amountBeersConsumed, setAmountBeersConsumed] = useState(0);
  const [betSize, setBetSize] = useState(0.5);

  let customHeightClass = players.length === 4 ? "h-min" : "h-[288px]";

  return (
    <>
      <main
        className={`m-2 p-4 w-[390px] mx-auto bg-lime-700 rounded-xl shadow-2xl flex flex-col items-center gap-2 ${customHeightClass}`}
      >
        <GameControls
          popupAddGameIsVisible={popupAddGameIsVisible}
          setPopupAddGameIsVisible={setPopupAddGameIsVisible}
          amountBeersConsumed={amountBeersConsumed}
          setAmountBeersConsumed={setAmountBeersConsumed}
          betSize={betSize}
          setBetSize={setBetSize}
        />
        <PlayerDisplay players={players} balance={balance} />
        <GameTable history={history} players={players} />
      </main>
      <NewGamePopup setPlayers={setPlayers} />
      <AddGamePopup
        players={players}
        popupAddGameIsVisible={popupAddGameIsVisible}
        setPopupAddGameIsVisible={setPopupAddGameIsVisible}
        history={history}
        setHistory={setHistory}
        amountBeersConsumed={amountBeersConsumed}
        balance={balance}
        setBalance={setBalance}
        betSize={betSize}
      />
    </>
  );
}
