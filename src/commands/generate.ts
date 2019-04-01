import {Command, flags} from '@oclif/command'
import {AstProcessor, ProcessResult} from '/home/willian/Projects/tcc/ui-core'

/*
 * Run "npm run build" in the ui-core folder.
 * Then, set the right path to AstProcessor.
 * Run the command "cli hello --path /path/to/anyFile.json"
 */

export default class Generate extends Command {
  static description = 'describe the command here'

  static flags = {
    ast: flags.string({char: 'a', description: 'ast file path'}),
    plugin: flags.string({char: 'p', description: 'plugin which will generate the UI'})
  }

  //static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(Generate)

    let result: ProcessResult
    const processor = new AstProcessor()
    if (flags.ast) {
      result = await processor.processAstFile(flags.ast)
    }

    for (let plugin of this.config.plugins) {
      if (plugin.name === flags.plugin) {
        const command = plugin.findCommand('generate')
        await command.run(['--features', JSON.stringify(result)])
      }
    }
  }
}
