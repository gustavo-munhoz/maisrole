import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

dotenv.config()
const result = dotenvExpand.expand(
    { ignoreProcessEnv: false, parsed:process.env }
)

export default result.parsed