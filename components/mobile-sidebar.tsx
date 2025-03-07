"use client"

import { Menu } from "lucide-react"

import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import Sidebar from "@/components/sidebar"
import { useEffect, useState } from "react"

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const MobileSidebar = ({ apiLimitCount = 0, isPro = false }: SidebarProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true);
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button className="md:hidden" variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
