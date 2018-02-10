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
  args.options = args.cmd === 'init' ? null : parseOpts(args.cmd , { ...argv, _: '' })

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


function parseOpts(cmd: string, options: {[prop: string]: string | number}): CliArgs['options'] {
  if (cmd === 'init') {
    throw new Error('cmd should not be "init"')
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
      caOpts[<string> propMap.get(upperKey)] = options[key]
    }
  })

  return caOpts
}

export function runCmd(args: CliArgs): Promise<string | void> {
  const { cmd, options } = args

  switch (cmd) {
    case 'init':
      return init()

    case 'initca':
      return initCa(<myca.CaOpts> options)

    default:
      return Promise.reject(`invalid cmd: "${cmd}"`)
  }
}


function init(): Promise<string> {
  return myca.initDefaultCenter().then((centerPath) => {
    return `Default center created at path: "${centerPath}"`
  })
}


function initCa(options: myca.CaOpts): Promise<string> {
  return myca.initCaCert(options).then((certRet) => {
    return `CA certificate created with:
  crtFile: "${certRet.crtFile}"
  privateKeyFile: "${certRet.privateKeyFile}"
    `
  })
}
