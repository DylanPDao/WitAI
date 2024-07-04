"use client"

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("a61326d4-6af0-4303-b53e-60b9eeb73168")
  })

  return null;
}
