import { z } from 'zod'

export const ApiResponseSuccess = z.object({
    tag: z.literal('success'),
    latex: z.string(),
    english: z.string(),
    // base64 representation of the mp3 file
    mp3: z.string()
})


export const ApiResponseError = z.object({
    tag: z.literal('error'),
    error: z.string()
})

export const APIResponse = z.union([ApiResponseSuccess, ApiResponseError])

export type APIResponse = z.infer<typeof APIResponse>
