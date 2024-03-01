"use client";

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

function PlayerDisplay() {
  return (
    <div className="flex justify-evenly p-1 bg-lime-400 w-full rounded">
      <div className="flex flex-col items-center w-[80px]">
        <PlayerName />
        <PlayerBalance />
      </div>
      <div className="flex flex-col items-center w-[80px]">
        <PlayerName />
        <PlayerBalance />
      </div>
      <div className="flex flex-col items-center w-[80px]">
        <PlayerName />
        <PlayerBalance />
      </div>
      <div className="flex flex-col items-center w-[80px]">
        <PlayerName />
        <PlayerBalance />
      </div>
    </div>
  );
}

function PlayerName() {
  return <div className="text-sm">Name</div>;
}

function PlayerBalance() {
  return <div className="text-sm">1€</div>;
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

function NewGamePopup() {
  return (
    <main className="fixed top-4 opacity-95 left-0 right-0 m-2 p-4 w-[360px] mx-auto bg-green-500 rounded shadow-2xl flex flex-col items-center gap-2">
      <div className="mb-4">
        <strong>Willkommen bei Bierkopf 🃏🍻</strong>
      </div>
      <div className="flex gap-4">
        <label for="playerName">Spieler 1:</label>
        <input
          type="text"
          id="playerName"
          name="playerName"
          className="w-20 px-1"
        />
      </div>
      <div className="flex gap-4">
        <label for="playerName">Spieler 2:</label>
        <input
          type="text"
          id="playerName"
          name="playerName"
          className="w-20 px-1"
        />
      </div>
      <div className="flex gap-4">
        <label for="playerName">Spieler 3:</label>
        <input
          type="text"
          id="playerName"
          name="playerName"
          className="w-20 px-1"
        />
      </div>
      <div className="flex gap-4">
        <label for="playerName">Spieler 4:</label>
        <input
          type="text"
          id="playerName"
          name="playerName"
          className="w-20 px-1"
        />
      </div>
      <button className="w-full bg-green-600 rounded p-2 mt-2">
        Spiel starten!
      </button>
    </main>
  );
}

export default function Game() {
  return (
    <>
      <main className="m-2 p-4 w-[390px] h-[844px] mx-auto bg-lime-700 rounded-xl shadow-2xl flex flex-col items-center gap-2">
        <GameControls />
        <PlayerDisplay />
        <GameTable />
      </main>
      <NewGamePopup />
    </>
  );
}

// function ButtonCreateTable() {
//   function popupCreateTable() {
//     // Render popup
//     alert("gude");
//   }

//   return (
//     <button
//       onClick={popupCreateTable}
//       className="p-2 bg-lime-600 rounded-lg shadow-xl hover:bg-lime-500"
//     >
//       Tisch erstellen
//     </button>
//   );
// }

// // Called main component
// export default function Game() {
//   return (
//     <main className="m-6 p-6 max-w-sm mx-auto bg-lime-700 rounded-xl shadow-2xl flex flex-col items-center gap-12">
//       <header className="text-2xl">Willkommen bei Bierkopf 🃏🍻</header>
//       <div>
//         <ButtonCreateTable />
//       </div>
//       <div className="w-full flex justify-end">
//         <div className="w-12 h-12 bg-lime-700 rounded-full shadow-xl flex justify-center items-center border-2 border-lime-600 hover:bg-lime-600">
//           <img src="/save.svg" alt="Disk logo" />
//         </div>
//       </div>
//     </main>
//   );
// }
