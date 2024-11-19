import { useState } from 'react'
const Search = () => {
  const [searchStr, setSearchStr] = useState('')
  const [tokens, setTokens] = useState([])

  useEffect(()=>{
    const fetchTokens =  async () => {
      if (!searchStr || !searchStr.trim()) {
        setTokens([])
        return
      }
      try {
        const apiURL = `${BACKEND_URI}/tokens/search/${searchStr}`;
        const res = await axios.get(apiURL);
        setTokens(res.data);
      } catch (e) {
        console.error(e)
      }
    }
    fetchTokens()
  },[searchStr])

  return (
    <div className="container mx-auto flex flex-col gap-4 pb-[24px] px-4 max-w-[500px] mt-5">
      <input
        type="text"
        placeholder={"address or symbol"}
        className="w-full bg-transparent outline-none border border-white rounded-xl bg-slate-800 p-2"
        value={searchStr}
        onChange={(e) => setSearchStr(e.target.value)}
      />
      {
        tokens.map((token, index) => <Link to={`/trade/${token.mint}/${index + 1}`} key={index} className="p-3 pr-6 transition-all duration-200 cursor-pointer bg-dark-gray rounded-3xl hover:bg-slate-700">
          <div className="flex gap-4">
            <img src={token?.imageUri} alt="" className="w-16 h-16 rounded-full" />
            <div className="">
              <div className="text-lg font-semibold">{token.name}</div>
              <div className="font-semibold text-neutral-500">{token.desc}</div>
            </div>
          </div>
        </Link>)
      }
    </div>
  )
}

export default Search