'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import Image from "next/image";

export default function ViewImageModal({ img, open, setOpen }: { img: string, open: boolean, setOpen: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>View Document</DialogTitle>
                </DialogHeader>

                <Image
                    src={img}
                    alt="Uploaded Image"
                    width={500}
                    height={500}
                />

            </DialogContent>
        </Dialog>
    )
}