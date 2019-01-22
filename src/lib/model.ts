import * as myca from 'myca'


export type CmdType = 'init' | 'initca' | 'issue' | 'initcenter'

export interface InitCenterArgs {
  name: string
  path?: string
}

export interface RunCmdArgs {
  cmd: CmdType | void
  options: myca.CaOpts | myca.CertOpts | InitCenterArgs | null // null for cmd:init
  debug: boolean
}

export interface CliArgs extends RunCmdArgs {
  needHelp: boolean
}
