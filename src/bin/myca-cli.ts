/**
 * myca-cli
 * command: init|initca|issue|initcenter  case insensitive
 */

import * as yargs from 'yargs'

import * as cli from '../index'
import { genCmdHelp, helpDefault } from '../lib/helper'
// console.info(yargs.argv)

let args!: cli.CliArgs

try {
  args = cli.parseCliArgs(yargs.argv)
}
catch (ex) {
  console.info(ex.message)
  process.exit(1)
}

// console.info('-args)

if (args && args.cmd) {
  if (args.needHelp) {
    const msg = genCmdHelp(args.cmd)
    console.info(msg)
    process.exit(0)
  }
  else {
    args.options = args.cmd === 'init' ? null : cli.parseOpts(args.cmd , { ...yargs.argv, _: '' })

    cli.runCmd(args)
      .then(ret => {
        ret && console.info(ret)
      })
      .catch((err: Error) => {
        if (err.message) {
          console.info(err.message)
        }
        else {
          console.info(err)
        }

        return err.message.includes('-h')
          ? process.exit(0)
          : process.exit(1)
      })
  }
}
else {
  const msg = helpDefault()
  console.info(msg)
  process.exit(0)
}
