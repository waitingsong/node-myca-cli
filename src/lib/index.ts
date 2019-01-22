import { log } from '@waiting/log'
import * as myca from 'myca'
import { Observable } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'

import { InitCenterArgs, RunCmdArgs } from './model'


export function runCmd(args: RunCmdArgs): Observable<string> {
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
      throw new Error(`invalid cmd: "${cmd}"`)
  }
}


function init(): Observable<string> {
  return myca.initDefaultCenter().pipe(
    map(centerPath => `Default center created at path: "${centerPath}"`),
  )
}


function initCa(options: myca.CaOpts): Observable<string> {
  return myca.initCaCert(options).pipe(
    map(certRet => {
      return `CA certificate created with:
  centerName: "${certRet.centerName}"
  crtFile: "${certRet.crtFile}"
  privateKeyFile: "${certRet.privateKeyFile}"
    `
    }),
  )
}


function issue(options: myca.CertOpts): Observable<string> {
  // tslint:disable:max-line-length
  return myca.genCert(options).pipe(
    map(ret => {
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
    }),
  )
}


function initCenter(options: InitCenterArgs): Observable<string> {
  const { name, path } = options

  return myca.initCenter(name, path).pipe(
    mergeMap(() => myca.getCenterPath(name)),
    map(centerPath => {
      return `center created with:
  centerName: "${name}"
  path: "${centerPath}"
    `
    }),
  )
}
