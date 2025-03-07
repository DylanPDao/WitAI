"use client"

import * as z from "zod"
import { Heading } from "@/components/heading"
import { Empty } from "@/components/empty"
import { Loader } from "@/components/loader"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


import axios from "axios"
import { Download, ImageIcon, MessageSquare } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { amountOptions, formSchema, resolutionOptions } from "./constants"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SelectContent } from "@radix-ui/react-select"
import { Card, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { useProModal } from "@/hooks/use-pro-hooks"
import toast from "react-hot-toast"


const ImagePage = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([])
  const proModal = useProModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512"
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([])

      const response = await axios.post("/api/image", values)

      const urls = response.data.map(( image: {url:string }) => image.url)

      setImages(urls)
      console.log(images)
      form.reset();
    } catch (error: any) {
      if (error.response.status = 403) {
        proModal.onOpen()
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      router.refresh()
    }
  }

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn your prompt into an image"
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
        />
        <div className="px-4 lg:px-8">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-6">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="a picture of ...?"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-2">
                          <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue defaultValue={field.value}/>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {amountOptions.map((option)=> (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                      </FormItem>
                    )
                  }
                />
                <FormField
                  control={form.control}
                  name="resolution"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {resolutionOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )
                  }
                />
                <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                  Generate
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-20">
                <Loader />
              </div>
            )}
            {images.length === 0 && !isLoading && (
              <Empty label={"no images generated"} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl: grid-cols-4 gap4 mt-8">
               { images.map((src) => (
                  <Card
                    key={src}
                    className="rounded-lg overflow-hidden"
                  >
                    <div className="relative aspect-square">
                      <Image
                        alt="image"
                        fill
                        src={src}
                      />
                    </div>
                    <CardFooter className="p-2">
                      <Button
                        variant="secondary"
                        className="=w-full"
                        onClick={() => window.open(src)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default ImagePage
