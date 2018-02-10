#!/usr/bin/env node

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
  console.log(ex.message)
}

cli.runCmd(args)
  .then(ret => {
    ret && console.log(ret)
  })
  .catch((err) => {
    if (typeof err === 'string') {
      console.log(err)
    }
    else if (err) {
      if (err.message) {
        console.log(err.message)
      }
      else {
        console.log(err)
      }
    }
    else {
      console.log('unknown error')
    }
  })
