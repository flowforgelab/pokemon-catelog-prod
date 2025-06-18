import * as React from "react"

export function useToast() {
  return {
    toast: ({ title, description, variant }: any) => {
      console.log('Toast:', { title, description, variant })
    }
  }
}