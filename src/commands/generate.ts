import {Command, flags} from '@oclif/command'
import {IPlugin} from '@oclif/config'
import {AstProcessor, ProcessResult} from 'concordialang-ui-core'
const cosmiconfig = require('cosmiconfig')

export default class Generate extends Command {
  static description = 'describe the command here'

  static flags = {
    ast: flags.string({char: 'a', description: 'ast file path'}),
    plugin: flags.string({char: 'p', description: 'plugin which will generate the UI'}),
    outputDir: flags.string({char: 'o', description: 'location where output files will be saved'})
  }

  async run() {
    try {
      const {ast, pluginName, outputDir} = this.getCommandParams()

      if (!ast) throw new Error('You must provide a valid ast file path')
      if (!pluginName) throw new Error('You must provide a plugin')

      const plugin: IPlugin | undefined = this.config.plugins.find(p => p.name === pluginName)
      if (!plugin) throw new Error(`Plugin ${pluginName} not found`)

      const processor = new AstProcessor()
      const result: ProcessResult = await processor.processAstFile(ast)
      const command = plugin.findCommand('generate', {must: true})
      await command.run(['--features', JSON.stringify(result), '--outputDir', outputDir])
    } catch (e) {
      this.error(e.message)
    }
  }

  private getCommandParams(): any {
    const {flags} = this.parse(Generate)
    const DEFAULT_OUTPUT_DIR = '.'

    const ast: string = flags.ast || this.getParamFromConfigFile('ast')
    const pluginName: string = flags.plugin || this.getParamFromConfigFile('plugin')
    const outputDir: string = flags.outputDir || this.getParamFromConfigFile('outputDir') || DEFAULT_OUTPUT_DIR

    return {ast, pluginName, outputDir}
  }

  private getParamFromConfigFile(param: string): any {
    // TODO: Because moduleName is "cli", the expected config file is ".clirc.json". Replace it with the final CLI name.
    const moduleName = 'cli'
    const explorer = cosmiconfig(moduleName)
    const result = explorer.searchSync()
    return result ? result.config[param] : null
  }
}
