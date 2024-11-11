import { useMutation } from "@tanstack/react-query";
import { PINATA_API_KEY } from "../../constants";

export function useUploadPinata() {
  return useMutation({
    mutationFn: async (file: File) => {
      const data = new FormData()
      data.append('file', file)

      const upload = await fetch(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${PINATA_API_KEY}`,
          },
          body: data,
        },
      )
      const res = (await upload.json()) as { IpfsHash: string }

      return `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`
    },
  })
}