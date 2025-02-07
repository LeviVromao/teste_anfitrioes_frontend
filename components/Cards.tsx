import Image from "next/image"
import { useEffect, useState } from "react"
import { FaStar } from "react-icons/fa"

type Accommodation = {
  id: number
  nome: string
  preco_noite: number
  localizacao: string
  imagem: string
}

type Rating = {
  id: number | undefined
  like: number
}

type Props = {
  accommodation: Accommodation
  openDialog: (open: boolean) => void
  fetchCardData: (id: number) => void
  favoriteCard: Rating
  giveLike: (id: number | undefined) => void
}

export default function Cards({ accommodation, openDialog, fetchCardData }: Props) {
  const [favoriteCard, setFavoriteCard] = useState<Rating | undefined>(undefined)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const storedLikesString = localStorage.getItem("likes")
    let storedLikes: Rating[] = []

    if (storedLikesString) {
      try {
        storedLikes = JSON.parse(storedLikesString)
      } catch (error) {
        console.error("Failed to parse storedLikes:", error)
      }
    }

    const favorite = storedLikes.find(card => card.id === accommodation.id)
    setFavoriteCard(favorite)
  }, [isMounted, accommodation.id])

  return (
    <div className="w-72 h-fit group cursor-pointer rounded-lg">
      <div className="relative overflow-hidden h-72">
        <Image
          src={`/house_${accommodation.nome}.jpg`}
          alt="accommodation photo image"
          height={600}
          width={600}
          className="rounded-lg w-80 h-48"
        />
        <div
          className="absolute h-full 
          w-full bg-black/20 flex rounded-lg items-center 
          justify-center -bottom-10 group-hover:bottom-0
          opacity-0 group-hover:opacity-100 transition-all duration-100"
        >
          <button
            onClick={() => {
              openDialog(true)
              fetchCardData(accommodation.id)
            }}
            className="bg-black text-white py-2 px-5"
          >
            Ver detalhes
          </button>
        </div>
        <h2 className="mt-3 text-xl capitalize">{accommodation.localizacao}</h2>
        {favoriteCard?.like === 1 && (
          <div className="flex gap-2">
            <FaStar className="text-yellow-500" />
            <p className="text-sm">Favoritado</p>
          </div>
        )}
        <del className="text-red-700 text-xl">{accommodation.preco_noite * 1.34}</del>
        <p className="text-xl mt-2 ml-1 inline-block">{accommodation.preco_noite}</p>
      </div>
    </div>
  )
}
