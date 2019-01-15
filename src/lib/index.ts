import { log } from '@waiting/log'
import * as myca from 'myca'
import { Observable } from 'rxjs'
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

export function runCmd(args: CliArgs): Promise<string | void> {
  const { cmd, options, debug } = args

  debug && options && log(options)
  switch (cmd) {
    case 'init':
      return init()

    case 'initca':
      return initCa(<myca.CaOpts> options)

    case 'issue':
      return issue(<myca.CertOpts> options)

    case 'initcenter':
      return initCenter(<InitCenterArgs> options)

    default:
      return Promise.reject(`invalid cmd: "${cmd}"`)
  }
}


function init(): Observable<string> {
  return myca.initDefaultCenter().then(centerPath => {
    return `Default center created at path: "${centerPath}"`
  })
}


function initCa(options: myca.CaOpts): Observable<string> {
  return myca.initCaCert(options).then(certRet => {
    return `CA certificate created with:
  centerName: "${certRet.centerName}"
  crtFile: "${certRet.crtFile}"
  privateKeyFile: "${certRet.privateKeyFile}"
    `
  })
}


function issue(options: myca.CertOpts): Observable<string> {
  // tslint:disable:max-line-length
  return myca.genCert(options).then(ret => {
    return `Issue a Certificate with:
  pubKey: \n${ret.pubKey}\n
  pass: "${ret.pass}" ${ options.kind === 'server' ? `\n  privateKeyFile: "${ret.privateKeyFile}"` : ''}
  privateKeyFile: "${ret.privateKeyFile}" ${ options.kind === 'server' ? `\n  privateUnsecureKeyFile: "${ret.privateUnsecureKeyFile}"` : ''}
  centerName: "${ret.centerName}"
  caKeyFile: "${ret.caKeyFile}"
  caCrtFile: "${ret.caCrtFile}"
  csrFile: "${ret.csrFile}"
  crtFile: "${ret.crtFile}"
  ${ options.kind === 'client' ? `pfxFile: "${ret.pfxFile}"` : ''}
    `
  })
}

function initCenter(options: InitCenterArgs): Observable<string> {
  const { name, path } = options

  return myca.initCenter(name, path).then(() => {
    return `center created with:
  centerName: "${name}"
  path: "${path}"
    `
  })
}

