import {Command, flags} from '@oclif/command'
//import * as core from '/home/willian/Projects/tcc/ui-core'
import {AstProcessor} from '/home/willian/Projects/tcc/ui-core'

/*
 * Run "npm run build" in the ui-core folder.
 * Then, set the right path to AstProcessor.
 * Run the command "cli hello --path /path/to/anyFile.json"
 */

export default class Hello extends Command {
  static description = 'describe the command here'

  static flags = {
    path: flags.string({char: 'p', description: 'ast file path'}),
  }

  //static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(Hello)
    const processor = new AstProcessor()
    if (flags.path) {
      const result = await processor.process(flags.path)
      this.log(JSON.stringify(result))
    }

    //const name = flags.name || 'world'
    //this.log(`hello ${name} from .\\src\\commands\\hello.ts`)
    //if (args.file && flags.force) {
      //this.log(`you input --force and --file: ${args.file}`)
    //}
  }
}
