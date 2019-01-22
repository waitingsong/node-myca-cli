import { cmdSet, tw1, tw2, tw3 } from './config'
import { CmdType } from './model'


export function genCmdHelp(command: CmdType): string {
  switch (command) {
    case 'init':
      return helpInit()

    case 'initca':
      return helpInitca()

    case 'initcenter':
      return helpInitcenter()

    case 'issue':
      return helpIssue()

    default:
      return helpDefault()
  }
}


export function helpDefault(): string {
  const head = 'Standard commands\n'
  const arr = Array.from(cmdSet)
  const more = 'More help: myca <command> -h'

  return `${head}${ arr.join('\t')}\n\n${more}`
}


export function helpInit(): string {
  const head = 'Usage: init [options]'
  const body = 'Valid options are:'
  const opts = [
    ` -h${tw2}Display this summary`,
    ` -d${tw2}Display debug info`,
  ]

  return `${head}\n${body}\n${ opts.join('\n') }`
}


export function helpInitca(): string {
  const head = 'Usage: initca [options]'
  const body = 'Valid options are:'
  const opts = [
    ` -h${tw3}Display this summary`,
    ` -d${tw3}Display debug info`,
    ` --centerName${tw2}Optinal. Contains no space. Default value default`,
    ` --alg${tw3}Optinal values: rsa | ec. Default value rsa`,
    ` --days${tw3}Default value 10950 (30years)`,
    ` --pass${tw3}Phrase greater then 4 chars`,
    ` --keyBits${tw2}Optional. Default value 4096 for alg rsa`,
    ` --ecParamgenCurve${tw1}Optional values: P-256 | P-384. Default value P-256 for alg ec`,
    ` --hash${tw3}Optional values: sha256 | sha384. Default value sha384\n`,

    ` --CN${tw3}Common Name. eg: --CN "Foo Bar"`,
    ` --OU${tw3}Optional. Organizational Unit Name (eg, section)`,
    ` --O${tw3}Optional. Organization Name (eg, company)`,
    ` --C${tw3}Optional. Country Name (2 letter code)`,
    ` --ST${tw3}Optional. State or Province Name (full name)`,
    ` --L${tw3}Optional. Locality Name (eg, city)`,
    ` --emailAddress${tw2}Optional`,
  ]

  return `${head}\n${body}\n${ opts.join('\n') }`
}


export function helpInitcenter(): string {
  const head = 'Usage: initcenter [options]'
  const body = 'Valid options are:'
  const opts = [
    ` -h${tw2}Display this summary`,
    ` -d${tw2}Display debug info`,
    ` --name${tw2}Center Name`,
    ` --path${tw2}Optional. Full path of the Center`,
  ]

  return `${head}\n${body}\n${ opts.join('\n') }`
}


export function helpIssue(): string {
  const head = 'Usage: issue [options]'
  const body = 'Valid options are:'
  const opts = [
    ` -h${tw3}Display this summary`,
    ` -d${tw3}Display debug info`,
    ` --kind${tw3}Values: 'ca' | 'server' | 'client'. Default value server`,
    ` --centerName${tw2}Optinal. Contains no space. Default value default`,
    ` --caKeyPass${tw2}Phrase for reading CA private key`,
    ` --alg${tw3}Optinal values: rsa | ec. Default value rsa`,
    ` --days${tw3}Default value 720 (2years)`,
    ` --pass${tw3}Phrase greater then 4 chars`,
    ` --keyBits${tw2}Default value 2048 for alg rsa`,
    ` --ecParamgenCurve${tw1}Optional values: P-256 | P-384. Default value P-256 for alg ec`,
    ` --hash${tw3}Optional values: sha256 | sha384. Default value sha256\n`,

    ` --CN${tw3}Common Name. eg: --CN "Foo Bar"`,
    ` --OU${tw3}Optional. Organizational Unit Name (eg, section)`,
    ` --O${tw3}Optional. Organization Name (eg, company)`,
    ` --C${tw3}Country Name (2 letter code)`,
    ` --ST${tw3}Optional. State or Province Name (full name)`,
    ` --L${tw3}Optional. Locality Name (eg, city)`,
    ` --emailAddress${tw2}Optional`,
    ` --SAN${tw3}Optional. Multiple values split by comma without space.\n` +
      `${tw3} eg: --SAN waitingsong.com,www.waitingsong.com\n` +
      `${tw3} or --SAN=waitingsong.com,www.waitingsong.com`,
    ` --ips${tw3}Optional.Multiple values split by comma without space.\n` +
      `${tw3} eg: --ips 127.0.0.1,192.168.0.1\n` +
      `${tw3} or: --ips=127.0.0.1,192.168.0.1`,
  ]

  return `${head}\n${body}\n${ opts.join('\n') }`
}
