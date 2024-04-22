import { useEffect, useState } from "react"

export enum PictureType {
  Cat = 'cat',
  Dog = 'dog'
}

const CAT_API_URL = 'https://api.thecatapi.com'
const DOG_API_URL = 'https://api.thedogapi.com'
const API_KEY = 'live_YEOFy0zbys1JaHbualCeV7owwjcupkzXdQNm7vke9kCDJGKgMWLP3Qg1xNs20b8F'

export const usePicturesApi = (type: PictureType = PictureType.Cat, limit: number = 7) => {

  const [pictures, setPictures] = useState([])

  const fetchPictures = async () => {

    const apiUrl = type === PictureType.Dog ? DOG_API_URL : CAT_API_URL

    try {
      const response = await fetch(`${apiUrl}/v1/images/search?limit=${limit}`, {
        headers: {
          'x-api-key': API_KEY
        }
      })
      // Simulate slow network for testing
      // await new Promise(r => setTimeout(r, 2000))

      const json = await response.json()
      setPictures(json.map((p: { url: string }) => p.url))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchPictures()
  }, [])

  return { pictures, fetchPictures }
}