const Create = () => {
  return (
    <div className="container flex flex-col items-center px-4 pb-24 mx-auto">
      <form action="#" className="space-y-6 mt-10 w-full max-w-[400px]">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold">Token Name</label>
          <input type="text" name="name" id="name" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="ticker" className="font-bold">Ticker ($)</label>
          <input type="text" name="name" id="ticker" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="desc" className="font-bold">Description</label>
          <input type="text" name="name" id="desc" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="thumbnail" className="font-bold">Image or Video</label>
          <input type="text" name="name" id="thumbnail" className="w-full px-2 py-2 border border-white rounded-lg outline-none bg-slate-800" />
        </div>
        <div className="p-4 pr-6 bg-dark-gray rounded-3xl">
          <div className="flex gap-4">
            <img src="/imgs/logo.webp" alt="" className="w-16 h-16 rounded-full" />
            <div className="">
              <div className="text-lg font-semibold">SuperDawhg</div>
              <div className="font-semibold text-neutral-500">The best dog on CoinClash</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button type="button" className="flex items-center justify-center h-8 text-sm font-semibold text-black transition-all duration-300 rounded-full bg-primary hover:bg-secondary hover:text-white w-80">Create a new coin</button>
        </div>
      </form>
    </div>
  )
}

export default Create;