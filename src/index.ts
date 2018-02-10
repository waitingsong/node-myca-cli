/**
 * node-myca
 *
 * @author waiting
 * @license MIT
 * @link https://github.com/waitingsong/node-myca-cli
 */

import * as myca from 'myca'

const cmdSet = new Set(['init', 'initca', 'issue', 'initcenter'])

export interface CliArgs {
  cmd: string
  options: myca.CaOpts | myca.CertOpts | null // null for cmd:init
}

export function parseCliArgs(argv: {[prop: string]: string | number}): CliArgs {
  const args = <CliArgs> {}
  const cmdArr = <string | number[]> argv._

  args.cmd = parseCmd(cmdArr)

  return args
}


function parseCmd(args: string | number[]): string {
  let command = ''

  for (let cmd of args) {
    if (typeof cmd === 'string' ) {
      cmd = cmd.toLowerCase()
      if (cmdSet.has(cmd)) {
        if (command) {
          throw new Error(`Duplicate command: "${cmd}" and "${command}"`)
        }
        else {
          command = cmd
        }
      }
    }
  }

  if ( ! command) {
    throw new Error('command empty. should be ' + [...cmdSet].join('|'))
  }
  return command
}

