import Searchbar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-4 sm:gap-6 items-center sm:items-start">
          <h1 className="text-4xl sm:text-5xl font-['BBH_Sans_Hegarty',sans-serif] font-normal text-center sm:text-left">
            Findthatmovie.com
          </h1>
          <p className="text-lg sm:text-xl text-center sm:text-left max-w-xl font-[Inter,sans-serif] leading-relaxed m-[5px_0]">
            Lost a movie in your memory? <br />
            Just type what you remember- <br />
            <span className="font-['BBH_Sans_Hegarty',sans-serif]">Findthatmovie</span> will match your description to the right film, fast and easy.
          </p>
          <Searchbar />
        </div>
      </main>
    </div>
  );
}
