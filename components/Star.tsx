import { FaStar } from "react-icons/fa"
import { useEffect, useState } from "react"

type Rating = {
  id: number | undefined
  like: number
}

type Props = {
  myRating: number
  giveLike: (id: number | undefined) => boolean
  cardID: number | undefined
}

export default function Star({ giveLike, cardID }: Props) {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isFavorited, setIsFavorited] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !cardID) return

    const storedLikesString = localStorage.getItem("likes")
    let storedLikes: Rating[] = []

    if (storedLikesString) {
      try {
        storedLikes = JSON.parse(storedLikesString)
      } catch (error) {
        console.error("Failed to parse storedLikes:", error)
      }
    }

    const isFavorite = storedLikes.some(card => card.id === cardID)
    setIsFavorited(isFavorite)
  }, [isMounted, cardID])

  const handleClick = () => {
    const newState = giveLike(cardID)
    setIsFavorited(newState)
  }

  return (
    <FaStar
      className={`text-xl cursor-pointer ${isFavorited ? "text-yellow-500" : "text-teal-500"}`}
      onClick={handleClick}
    />
  )
}
