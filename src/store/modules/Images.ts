import { defineStore } from "pinia";
import { getFileContentAsBase64 } from "@/services";

const useImagesStore = defineStore('imagesStore', {
    state: () => {
        return {
            images: {} as Record<string, string>
        }
    },

    actions: {
        set_image(image_id: string, base64String: string) {
            this.images[image_id] = base64String
        },
        get_image(image_id: string) {
            return this.images[image_id]
        }
    }
})

export default useImagesStore