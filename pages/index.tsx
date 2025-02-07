import SearchBar from "@/components/searchBar"
import Image from "next/image"
import { GetServerSideProps } from "next"
import Cards from "@/components/Cards"
import {  useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { IoMdCloseCircle } from "react-icons/io"
import { Skeleton } from "@/components/ui/skeleton"
import Star from "@/components/Star"

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
  accommodations: Accommodation[]
}

export default function Home({ accommodations }: Props) {
  const [searching, setSearching] = useState<boolean>(false)
  const [filteredData, setFilteredData] = useState<Array<Accommodation>>([])
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [getCardData, setGetCardData] = useState<Accommodation | null>(null)
  const [myRating, setMyRating] = useState<Rating>({ id: undefined, like: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(0)

  const fetchAccommodations = async (city: string) => {
    try {
      setSearching(true)
      const res = await fetch(`http://localhost:5000/acomodacoes?cidade=${city}`)
      const data: Accommodation[] = await res.json()

      if (res.ok) {
        setFilteredData(data)
      } else {
        setFilteredData([])
      }
    } catch (error) {
      setFilteredData([])
      console.log(error)
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const storedLikesString = localStorage.getItem('likes')
    let likes: Rating[] = []

    if (storedLikesString) {
      try {
        likes = JSON.parse(storedLikesString)
      } catch (error) {
        console.error('Failed to parse storedLikes:', error)
      }
    }

    if (getCardData) {
      const card = likes.find(card => card.id === getCardData.id)
      setCurrentLikes(card ? card.like : 0)
    }
  }, [isMounted, getCardData])

  const fetchAccommodationByID = async (id: number) => {
    try {
      setIsLoading(true)
      const res = await fetch(`http://localhost:5000/acomodacoes/${id}`)
      const data: Accommodation = await res.json()
      if (res.ok) {
        setIsLoading(false)
        setGetCardData(data)
      } else {
        setIsLoading(false)
        setGetCardData(null)
      }
    } catch (error) {
      setGetCardData(null)
      console.log(error)
    }
  }
  const giveLike = (id: number | undefined): boolean => {
    const newRating = myRating.like === 0
      ? { id, like: 1 }
      : { id, like: 0 }
  
    const storedLikesString = localStorage.getItem("likes")
    let storedLikes: Rating[] = storedLikesString ? JSON.parse(storedLikesString) : []
  
    storedLikes = storedLikes.filter(card => card.id !== id)
  
    if (newRating.like === 1) {
      storedLikes.push(newRating)
    }
  
    setMyRating(newRating)
    localStorage.setItem("likes", JSON.stringify(storedLikes))
  
    if (getCardData?.id === id) {
      setCurrentLikes(newRating.like)
    }
  
    return newRating.like === 1
  }
  

  return (
    <div className="relative min-h-screen flex flex-col items-center gap-y-40 bg-white dark:bg-black text-gray-900 dark:text-white">
      <SearchBar onSearch={fetchAccommodations} />
      {!searching ? (
        <div className="flex gap-9">
          {accommodations.map(item => (
            <Cards key={item.id} giveLike={giveLike} favoriteCard={myRating} fetchCardData={fetchAccommodationByID} openDialog={setOpen} accommodation={item} />
          ))}
        </div>
      ) : (
        <div className="flex gap-9">
          {filteredData.length > 0 ? (
            filteredData.map(item => (
              <Cards key={item.id} giveLike={giveLike} favoriteCard={myRating} fetchCardData={fetchAccommodationByID} openDialog={setOpen} accommodation={item} />
            ))
          ) : (
            <p>Nenhum resultado encontrado.</p>
          )}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="bg-gray-900 gap-2 text-white absolute top-40 
            flex flex-col w-96 h-96 rounded-2xl p-3"
        >
          {!isLoading ? (
            <>
            <DialogHeader>
              <DialogTitle className="flex justify-between">
                <div>
                  <p>{getCardData?.nome}</p>
                  <p className="pl-2 text-sm">{getCardData?.localizacao}</p>
                </div>
                <button onClick={() => setOpen(false)} className="hover:bg-gray-500 rounded-2xl text-2xl h-fit">
                  <IoMdCloseCircle />
                </button>
              </DialogTitle>
            </DialogHeader>
            <Image
                src={`/house_${getCardData?.nome}.jpg`}
                alt={`Acomodacao em ${getCardData?.nome}`}
                width={300}
                height={300}
                className="rounded-xl self-center" />
                <div>
                <p className="pl-2 text-sm">Avaliações positivas :</p>
                <div className="flex gap-2 pl-4 mt-0 items-center">
                {getCardData ?
                    <p className="text-sm">
                      {(6 * getCardData?.preco_noite) + currentLikes}
                    </p>
                    : ""
                  }
                <Star giveLike={giveLike} cardID={getCardData?.id} myRating={myRating.like}/>
              </div>
                </div>
              <div>
                <p className="text-sm pl-2">Preço por noite</p>
                {getCardData ? 
                  <div className="text-sm pl-4">
                    <p>De <del className="text-red-700">{getCardData.preco_noite * 1.34}</del> para {getCardData.preco_noite}</p>
                  </div>
                : 
                ""
                }
              </div>
              </>
          ) : (
            <div>
              <div className="flex justify-between">
                <Skeleton className="rounded-xl bg-gray-600 w-40"/>
                <Skeleton className="w-6 h-6 rounded-full"/>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch("http://localhost:5000/acomodacoes")
    if (!res.ok) {
      throw new Error("Erro ao buscar as acomodações")
    }
    const data: Accommodation = await res.json()

    return {
      props: {
        accommodations: data
      }
    }

  } catch (error) {
    console.error("Erro no fetch:", error)
    return {
      props: { accommodations: [] }
    }
  }
}