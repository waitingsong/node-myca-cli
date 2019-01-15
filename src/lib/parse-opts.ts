import * as myca from 'myca'
import * as yargs from 'yargs'

import { cmdSet, initialCliArgs } from './config'
import { helpDefault } from './helper'
import { CliArgs, CmdType, InitCenterArgs } from './model'


export function parseCliArgs(argv: typeof yargs.argv): CliArgs {
  const args: CliArgs = { ...initialCliArgs }
  const cmdArr: string[] = argv._

  args.cmd = parseCmd(cmdArr)
  args.options = null
  args.needHelp = argv.h ? true : false
  args.debug = argv.d ? true : false

  return args
}


function parseCmd(args: string[]): CmdType {
  let command = ''

  for (let cmd of args) {
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

  if (! command) {
    const help = helpDefault()
    throw new Error(help)
  }
  return <CmdType> command
}


export function parseOpts(cmd: string, options: {[prop: string]: string | number}): CliArgs['options'] {
  if (cmd === 'init') {
    throw new Error('cmd should not be "init"')
  }

  if (cmd === 'initcenter') {
    return parseInitCenter(options)
  }

  const caOpts: CliArgs['options'] = cmd === 'initca'
    ? { ...myca.initialCaOpts }
    : { ...myca.initialCertOpts }
  const propMap = <Map<string, string>> new Map() // <upperKey, oriKey>

  Object.keys(caOpts).forEach(key => {
    propMap.set(key.toUpperCase(), key)
  })

  Object.keys(options).forEach(key => {
    const upperKey = key.toUpperCase()

    if (propMap.has(upperKey)) {
      Object.defineProperty(caOpts, <string> propMap.get(upperKey), {
        configurable: true,
        enumerable: true,
        writable: true,
        value: options[key],
      })
    }
  })

  if (cmd === 'issue') {
    if (typeof caOpts.SAN !== 'undefined') {
      const arr = parseMultiValue(caOpts.SAN)

      if (arr && arr.length) {
        caOpts.SAN = arr
      }
      else {
        delete caOpts.SAN
      }
    }
    if (typeof caOpts.ips !== 'undefined') {
      const arr = parseMultiValue(caOpts.ips)

      if (arr && arr.length) {
        caOpts.ips = arr
      }
      else {
        delete caOpts.ips
      }
    }
  }

  return caOpts
}


function parseMultiValue(arg: any): string[] {
  const arr = arg ? String(arg).split(',') : []
  const ret: string[] = []

  if (arr.length) {
    for (let value of arr) {
      value = value.trim()
      if (value) {
        ret.push(value)
      }
    }
  }

  return ret
}


function parseInitCenter(args: any): InitCenterArgs {
  const { path } = args
  let { name } = args

  name = String(name)
  if (! name) {
    throw new Error('value of name empty')
  }
  if (! path) {
    throw new Error('value of path empty')
  }

  return { name, path }
}
