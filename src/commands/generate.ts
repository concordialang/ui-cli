import {Command, flags} from '@oclif/command'
import {AstProcessor, ProcessResult} from 'concordialang-ui-core'
const cosmiconfig = require('cosmiconfig')

/*
 * Run "npm run build" in the ui-core folder.
 * Then, set the right path to AstProcessor.
 * Run the command "cli hello --path /path/to/anyFile.json"
 */

export default class Generate extends Command {
  static description = 'describe the command here'

  static flags = {
    ast: flags.string({char: 'a', description: 'ast file path'}),
    plugin: flags.string({char: 'p', description: 'plugin which will generate the UI'}),
    outputDir: flags.string({char: 'o', description: 'location where output files will be saved'})
  }

  async run() {
    const {ast, pluginName, outputDir} = this.getCommandParams()

    if (!outputDir) this.error('You must provide an output directory')

    let result: ProcessResult

    if (ast) {
      const processor = new AstProcessor()
      result = await processor.processAstFile(ast)
    } else {
      this.error('You must provide a valid ast file path')
    }

    const plugin = this.config.plugins.find(p => p.name === pluginName)

    if (plugin) {
      const command = plugin.findCommand('generate')
      await command.run(['--features', JSON.stringify(result), '--outputDir', outputDir])
    } else {
      this.error(`Plugin ${pluginName} not found`)
    }
  }

  private getCommandParams(): any {
    const {flags} = this.parse(Generate)

    const ast: string = this.getParamFromConfigFile('ast') || flags.ast
    const pluginName: string = this.getParamFromConfigFile('plugin') || flags.plugin
    const outputDir: string = this.getParamFromConfigFile('outputDir') || flags.outputDir

    return {ast, pluginName, outputDir}
  }

  private getParamFromConfigFile(param: string): any {
    const explorer = cosmiconfig('ui-cli')
    const result = explorer.loadSync('.clirc')
    return result.config ? result.config[param] : null
  }
}
