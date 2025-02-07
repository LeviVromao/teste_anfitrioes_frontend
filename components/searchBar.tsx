import { FormEvent, useState } from "react";
import { useTheme } from "./useTheme";
import { AiOutlineSearch } from "react-icons/ai";

type Props = {
  onSearch: (value: string) => void
}

export default function SearchBar({onSearch}: Props){
    const {theme, toggleTheme} = useTheme()
    const [inputValue, setInputValue] = useState("")

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onSearch(inputValue)
    }

    return (
        <div className="pt-4 flex gap-5 justify-center">
          <form className="relative flex flex-col gap-4" onSubmit={handleSearch}>
            <input 
              type="search" 
              className="bg-gray-900 rounded-lg pl-2 text-sm text-white w-96 h-12"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className="absolute translate-y-1 right-2 top-1 p-2 bg-slate-700 text-white rounded-full"
              >
                <AiOutlineSearch />
            </button>
          </form>
          <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-black dark:bg-yellow-500 text-sm text-white dark:text-black rounded-lg"
          >
            {theme === "dark" ? "Modo Claro ☀️" : "Modo Escuro 🌙"}
          </button>
        </div>
    )
}