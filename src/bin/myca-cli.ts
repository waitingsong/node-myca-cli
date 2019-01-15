/**
 * myca-cli
 * command: init|initca|issue|initcenter  case insensitive
 */

import { log } from '@waiting/log'
import * as yargs from 'yargs'

import { genCmdHelp, helpDefault } from '../lib/helper'
import { runCmd } from '../lib/index'
import { CliArgs } from '../lib/model'
import { parseCliArgs, parseOpts } from '../lib/parse-opts'
// log(yargs.argv)

let args!: CliArgs

try {
  args = parseCliArgs(yargs.argv)
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
    args.options = args.cmd === 'init' ? null : parseOpts(args.cmd , { ...yargs.argv, _: '' })
    args.debug && log(args)

    runCmd(args).subscribe(
      log,
      (err: Error) => {
        if (err.message) {
          log(err.message)
        }
        else {
          log(err)
        }

        return err.message.includes('-h')
          ? process.exit(0)
          : process.exit(1)
      },
    )

  }
}
else {
  const msg = helpDefault()
  log(msg)
  process.exit(0)
}
