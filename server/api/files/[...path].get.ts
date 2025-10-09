import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler((event) => {
    const params = getRouterParams(event)
    const baseDir = join(process.cwd(), 'data')
    const filePath = join(baseDir, params.path)

    if (!existsSync(filePath)) {
        throw createError({ statusCode: 404, statusMessage: 'File not found' })
    }

    const content = readFileSync(filePath, 'utf-8')
    return filePath.endsWith('.json') ? JSON.parse(content) : content
})
