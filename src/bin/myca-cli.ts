/**
 * myca-cli
 * command: init|initca|issue|initcenter  case insensitive
 */

import * as yargs from 'yargs'

import * as cli from '../index'
// console.log(yargs.argv)

let args!: cli.CliArgs

try {
  args = cli.parseCliArgs(yargs.argv)
}
catch (ex) {
  console.info(ex.message)
}

if (args && args.cmd) {
  cli.runCmd(args)
    .then(ret => {
      ret && console.info(ret)
    })
    .catch(err => {
      if (typeof err === 'string') {
        console.info(err)
      }
      else if (err) {
        if (err.message) {
          console.info(err.message)
        }
        else {
          console.info(err)
        }
      }
      else {
        console.info('unknown error')
      }
      process.exit(1)
    })

}
