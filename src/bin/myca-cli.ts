/**
 * myca-cli
 * command: init|initca|issue|initcenter  case insensitive
 */

import { log } from '@waiting/log'
import * as yargs from 'yargs'

import * as cli from '../index'
import { genCmdHelp, helpDefault } from '../lib/helper'
// log(yargs.argv)

let args!: cli.CliArgs

try {
  args = cli.parseCliArgs(yargs.argv)
}
catch (ex) {
  log(ex.message)
  process.exit(1)
}


if (args && args.cmd) {
  if (args.needHelp) {
    const msg = genCmdHelp(args.cmd)
    log(msg)
    process.exit(0)
  }
  else {
    args.options = args.cmd === 'init' ? null : cli.parseOpts(args.cmd , { ...yargs.argv, _: '' })
    args.debug && log(args)

    cli.runCmd(args)
      .then(ret => {
        ret && log(ret)
      })
      .catch((err: Error) => {
        if (err.message) {
          log(err.message)
        }
        else {
          log(err)
        }

        return err.message.includes('-h')
          ? process.exit(0)
          : process.exit(1)
      })
  }
}
else {
  const msg = helpDefault()
  log(msg)
  process.exit(0)
}
