import { useEffect, useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

interface Props {
  src: string | null
  alt?: string
  onClose: () => void
}

export function ImageLightbox({ src, alt, onClose }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => { setShow(!!src) }, [src])

  const close = useCallback(() => {
    setShow(false)
    setTimeout(onClose, 250)
  }, [onClose])

  useEffect(() => {
    if (!src) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [src, close])

  if (!src) return null

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={close} />
          <motion.img
            src={src}
            alt={alt || ""}
            className="relative max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          />
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
