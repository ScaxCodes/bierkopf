import Image from "next/image";

function ButtonTischErstellen() {
  return (
    <button className="p-2 bg-lime-600 rounded-lg shadow-xl hover:bg-lime-500">
      Tisch erstellen
    </button>
  );
}

export default function Home() {
  return (
    <main className="m-6 p-6 max-w-sm mx-auto bg-lime-700 rounded-xl shadow-2xl flex flex-col items-center gap-12">
      <header className="text-2xl">Willkommen bei Bierkopf 🃏🍻</header>
      <div>
        <ButtonTischErstellen />
      </div>
      <div className="w-full flex justify-end">
        <div className="w-12 h-12 bg-lime-700 rounded-full shadow-xl flex justify-center items-center border-2 border-lime-600 hover:bg-lime-600">
          <img src="/save.svg" alt="Disk logo" />
        </div>
      </div>
    </main>
  );
}
