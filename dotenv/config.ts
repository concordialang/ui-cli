// This file is provided in the '--setupFiles' option for the 'jest' command.
// See package.json.

import { resolve } from "path"
import { config } from "dotenv"

config({ path: resolve(__dirname, "../.env") })
