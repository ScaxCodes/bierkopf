"use client";
import React, { useState } from "react";

// Question:
// Was it good practice to nest the comps for a cleaner look?

function NewGamePopup({ setPlayers }) {
  const [popupIsVisible, setPopupIsVisible] = useState(true);
  const [errorIsVisible, setErrorIsVisible] = useState(false);

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
          <PlayerInput playerNumber={1} />
          <PlayerInput playerNumber={2} />
          <PlayerInput playerNumber={3} />
          <PlayerInput playerNumber={4} />
          <button
            className="w-full bg-green-600 rounded p-2 mt-2"
            onClick={startGameSession}
          >
            Spiel starten!
          </button>
          {errorIsVisible && <ErrorMessage />}
          <LoadGameButton />
        </main>
      </>
    );

    function PlayerInput({ playerNumber }) {
      return (
        <div className="flex gap-4">
          <label htmlFor="playername1">Spieler {playerNumber}:</label>
          <input
            type="text"
            id={`playername${playerNumber}`}
            name={`playername${playerNumber}`}
            className="w-20 px-1"
          />
        </div>
      );
    }

    function ErrorMessage() {
      return (
        <div className="text-red-800 font-medium">
          Gib allen 4 Spielern einen Namen!
        </div>
      );
    }

    function LoadGameButton() {
      // Load a saved game
      const loadGame = async () => {
        try {
          const response = await fetch("/load");
          if (!response.ok) {
            throw new Error("Failed to load the game");
          }
          const gameData = await response.json();

          // Update component state with the loaded game data
          setPlayers(gameData.players);
          // Assuming balance and other data are also updated similarly
          setErrorIsVisible(false);
          setPopupIsVisible(false);
        } catch (error) {
          console.error("Error loading the game:", error);
        }
      };

      return (
        <button
          className="w-full bg-green-600 rounded p-2 mt-2 text-sm"
          onClick={loadGame}
        >
          Spielstand laden 💾
        </button>
      );
    }

    function startGameSession() {
      const playerNameOne = document.getElementById("playername1").value;
      const playerNameTwo = document.getElementById("playername2").value;
      const playerNameThree = document.getElementById("playername3").value;
      const playerNameFour = document.getElementById("playername4").value;
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
  }
}

function GameControls({
  popupAddGameIsVisible,
  setPopupAddGameIsVisible,
  amountBeersConsumed,
  setAmountBeersConsumed,
  betSize,
  setBetSize,
}) {
  const [beerButtonCounter, setBeerButtonCounter] = useState(0);

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

    function handleButton(event) {
      let value = parseFloat(event.target.value);
      setBetSize(value);
    }
  }

  function AddGameButton() {
    return (
      <button className="bg-lime-500 rounded p-1 m-2" onClick={addGame}>
        Spiel hinzufügen
      </button>
    );

    function addGame() {
      if (!popupAddGameIsVisible) setPopupAddGameIsVisible(true);
    }
  }

  // Having trouble grasping this:
  // I had to put the beerButtonCounter state one level higher into the GameControl() comp
  // Else the button did not behave like it should after the 6th click, i'm not sure why
  function NewRoundOfBeerButton() {
    // const [beerButtonCounter, setBeerButtonCounter] = useState(0);

    if (beerButtonCounter <= 5) {
      return (
        <button
          className="bg-lime-500 rounded p-1 m-2"
          onClick={handleButton}
          id="add-beer-button"
        >
          Neue Runde Bier! 🍻
        </button>
      );
    } else {
      return (
        <button
          className="bg-lime-500 rounded p-1 m-2 font-medium text-clown"
          onClick={handleButton}
          id="add-beer-button"
        >
          🫵🏻🤡 1 Kasten reicht!
        </button>
      );
    }

    function handleButton() {
      setBeerButtonCounter(beerButtonCounter + 1);
      if (amountBeersConsumed == 20) return;
      setAmountBeersConsumed(amountBeersConsumed + 4);
    }
  }

  function BeerCounter() {
    return <div className="text-xs">{getBeerString()}</div>;

    function getBeerString() {
      let beerString = "";
      for (let i = 0; i < amountBeersConsumed; i += 4) {
        if (i == 0) beerString += "🍺🍺🍺🍺";
        else if (i + 4 == amountBeersConsumed) beerString += " | 🍺🍺🍺🍺";
        else beerString += " | 🍺🍺🍺🍺";
      }
      return beerString;
    }
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

function SaveGameButton({
  players,
  balance,
  history,
  amountBeersConsumed,
  betSize,
}) {
  // Function to save the game data to the server
  const saveGame = async () => {
    try {
      const response = await fetch("/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          players: Object.values(players),
          balance: balance,
          history: history,
          amountBeersConsumed: amountBeersConsumed,
          betSize: betSize,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save the game");
      }
      const responseData = await response.text();
      console.log(responseData); // Success message from the server
    } catch (error) {
      console.error("Error saving the game:", error);
    }
  };

  return (
    <button
      className="w-full bg-green-400 rounded p-2 mt-2 text-sm"
      onClick={saveGame}
    >
      Spielstand speichern 💾
    </button>
  );
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

  if (popupAddGameIsVisible) {
    return (
      <div className="fixed top-4 opacity-95 left-0 right-0 m-2 p-4 w-[360px] mx-auto bg-green-400 rounded shadow-2xl flex flex-col items-center gap-4">
        <div>Spiel hinzufügen</div>
        <div className="flex gap-2 items-center">
          <div className="w-[60px] text-center mr-8">Rufteam wählen</div>
          <PlayerButton i={0} />
          <PlayerButton i={1} />
          <PlayerButton i={2} />
          <PlayerButton i={3} />
        </div>
        <div>
          <button
            className="px-2 rounded shadow-2xl bg-green-300"
            onClick={lockTeams}
          >
            Rufteam speichern
          </button>
        </div>
        {firstErrorMessageVisible && <FirstErrorMessage />}
        {pickWinnerDisplayVisible && <PickWinnerDisplay />}
        {secondErrorMessageVisible && <SecondErrorMessage />}
      </div>
    );
  }

  function PlayerButton({ i }) {
    return (
      <button
        className={`px-2 rounded shadow-2xl ${
          playerButtonsClicked[i] ? "bg-green-500" : "bg-green-300"
        }`}
        onClick={() => togglePlayerButton(i)}
      >
        {players[i]}
      </button>
    );

    function togglePlayerButton(i) {
      const newPlayerButtonsClicked = [...playerButtonsClicked];
      newPlayerButtonsClicked[i] = !playerButtonsClicked[i];
      setPlayerButtonsClicked(newPlayerButtonsClicked);
      setPickWinnerDisplayVisible(false);
    }
  }

  function FirstErrorMessage() {
    return (
      <div className="text-red-800 font-medium">
        Bitte maximal 2 Spieler wählen!
      </div>
    );
  }

  function PickWinnerDisplay() {
    const [p1team1, p2team1] = getCallingTeam();
    const [p1team2, p2team2] = getOtherTeam();

    return (
      <>
        <div className="flex gap-2 items-center">
          <div className="w-[60px] text-center mr-8">Siegerteam wählen</div>
          <TeamButton i={0} teamMember1={p1team1} teamMember2={p2team1} />
          <TeamButton i={1} teamMember1={p1team2} teamMember2={p2team2} />
        </div>
        <div>
          <button
            className="px-2 rounded shadow-2xl bg-green-300"
            onClick={() => pickWinner(p1team1, p2team1, p1team2, p2team2)}
          >
            Siegerteam speichern
          </button>
        </div>
      </>
    );

    function TeamButton({ i, teamMember1, teamMember2 }) {
      return (
        <button
          className={`px-2 rounded shadow-2xl ${
            teamsButtonClicked[i] ? "bg-green-500" : "bg-green-300"
          } h-fit`}
          onClick={() => toggleTeamButton(i)}
        >
          {teamMember1} & {teamMember2}
        </button>
      );
    }

    function toggleTeamButton(i) {
      const newTeamsButtonClicked = [...teamsButtonClicked];
      newTeamsButtonClicked[i] = !teamsButtonClicked[i];
      setTeamsButtonClicked(newTeamsButtonClicked);
    }

    function pickWinner(p1team1, p2team1, p1team2, p2team2) {
      if (teamsButtonClicked.filter((bool) => bool === true).length === 1) {
        saveGame(p1team1, p2team1, p1team2, p2team2);
        resetAddGameStates();
      } else {
        setSecondErrorMessageVisible(true);
      }

      function saveGame(p1team1, p2team1, p1team2, p2team2) {
        const game = {
          callerteam: getCallingTeam(),
          winnerteam: getWinnerTeam(),
          betSize: betSize,
          amountBeersConsumed: amountBeersConsumed,
        };

        const newHistory = [...history, game];
        setHistory(newHistory);

        const newBalance = balance.map((individualBalance, i) => {
          return game.winnerteam.includes(players[i])
            ? (individualBalance += betSize)
            : (individualBalance -= betSize);
        });
        setBalance(newBalance);

        function getWinnerTeam() {
          const winnerteam = [];
          if (teamsButtonClicked[0]) winnerteam.push(p1team1, p2team1);
          else winnerteam.push(p1team2, p2team2);
          return winnerteam;
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
    }
  }

  function SecondErrorMessage() {
    return (
      <div className="text-red-800 font-medium">
        Bitte maximal 1 Siegerteam wählen!
      </div>
    );
  }

  function lockTeams() {
    if (playerButtonsClicked.filter((bool) => bool === true).length === 2) {
      setFirstErrorMessageVisible(false);
      setPickWinnerDisplayVisible(true);
    } else {
      setFirstErrorMessageVisible(true);
    }
  }

  function getCallingTeam() {
    const team = [];
    playerButtonsClicked.forEach((value, index) => {
      if (value) team.push(players[index]);
    });
    return team;
  }

  function getOtherTeam() {
    const team = [];
    playerButtonsClicked.forEach((value, index) => {
      if (!value) team.push(players[index]);
    });
    return team;
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
        <SaveGameButton
          players={players}
          balance={balance}
          history={history}
          amountBeersConsumed={amountBeersConsumed}
          betSize={betSize}
        />
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
