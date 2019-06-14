import {test} from '@oclif/test'

describe('generate', () => {
  describe('with an invalid plugin', () => {
    test
      .stdout()
      .command(['generate', '--plugin', 'test-plugin'])
      .exit(2)
      .it('exits')
  })
})
