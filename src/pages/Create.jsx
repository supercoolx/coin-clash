const Create = () => {
  return (
    <div className="container mx-auto flex flex-col items-center pb-24 px-4">
      <form action="#" className="space-y-6 mt-10 w-full max-w-[400px]">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold">Token Name</label>
          <input type="text" name="name" id="name" className="rounded-lg border border-white outline-none bg-slate-800 px-2 py-2 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="ticker" className="font-bold">Ticker ($)</label>
          <input type="text" name="name" id="ticker" className="rounded-lg border border-white outline-none bg-slate-800 px-2 py-2 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="desc" className="font-bold">Description</label>
          <input type="text" name="name" id="desc" className="rounded-lg border border-white outline-none bg-slate-800 px-2 py-2 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="thumbnail" className="font-bold">Image or Video</label>
          <input type="text" name="name" id="thumbnail" className="rounded-lg border border-white outline-none bg-slate-800 px-2 py-2 w-full" />
        </div>
        <div className="bg-dark-gray p-4 pr-6 rounded-3xl">
          <div className="flex gap-4">
            <img src="/imgs/logo.webp" alt="" className="w-16 h-16 rounded-full" />
            <div className="">
              <div className="text-lg font-semibold">SuperDawhg</div>
              <div className="text-neutral-500 font-semibold">The best dog on CoinClash</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="rounded-full bg-primary flex items-center justify-center text-black text-sm h-8 transition-all duration-300 font-semibold hover:bg-secondary hover:text-white w-80">Create a new coin</button>
        </div>
      </form>
    </div>
  )
}

export default Create;