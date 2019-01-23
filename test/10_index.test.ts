/// <reference types="mocha" />

import {
  basename,
  isPathAccessible,
  join,
  normalize,
  promisify,
  userHome,
} from '@waiting/shared-core'
import { renameSync } from 'fs'
import * as assert from 'power-assert'
import * as rmdir from 'rimraf'
import { finalize, tap } from 'rxjs/operators'

import { runCmd, RunCmdArgs } from '../src/index'


const rmdirAsync = promisify(rmdir)

const filename = basename(__filename)
const defaultCenterPath = normalize(join(userHome, '.myca'))
let defaultCenterPathBak = normalize(join(userHome, '.myca' + Math.random()))


const initArgs: RunCmdArgs = {
  cmd: 'init',
  options: null,
  debug: true,
}
const init$ = runCmd(initArgs)

describe(filename, () => {
  before(async () => {
    if (await isPathAccessible(defaultCenterPath)) {
      renameSync(defaultCenterPath, defaultCenterPathBak)
      console.info(
        '\n-----------\n',
        `Backup existing myca deafaultCenter ori path: "${defaultCenterPath}"\n`,
        `to back path: "${defaultCenterPathBak}"`,
        '\n-----------\n',
      )
    }
    else {
      defaultCenterPathBak = ''
    }
    // await createDirAsync(tmpDir)
  })
  after(async () => {
    try {
      await rmdirAsync(defaultCenterPath)
    }
    catch (ex) {
      console.error(ex)
      if (defaultCenterPathBak) {
        console.info(
          '\n----------\n',
          'Caution:\n',
          `Testing path can NOT be removed, path: "${defaultCenterPath}"\n`,
          `Default centerPat can NOT be resotre to original name, path: "${defaultCenterPathBak}"`,
          '\n----------\n',
        )
      }

    }
    if (defaultCenterPathBak && await isPathAccessible(defaultCenterPathBak)) {
      renameSync(defaultCenterPathBak, defaultCenterPath)
      console.info(
        '\n-----------\n',
        `Restore myca deafaultCenter from back path: "${defaultCenterPathBak}"\n`,
        `to ori path: "${defaultCenterPath}"`,
        '\n-----------\n',
      )
    }
  })


  describe('Should myca init works', () => {
    it('normal', done => {
      init$.pipe(
        tap((ret: string) => {
          assert(ret.includes('Default center created at path'), ret)
          assert(ret.includes(defaultCenterPath), ret)
        }),
        finalize(() => done()),
      ).subscribe()
    })
  })

  describe('Should myca initca works', () => {
    it('normal', done => {
      const args: RunCmdArgs = {
        cmd: 'initca',
        options: {
          days: 10950,
          pass: 'mycapass',
          CN: 'my root ca',
          O: 'my company',
          C: 'CN',

        },
        debug: false,
      }

      runCmd(args).pipe(
        tap((ret: string) => {
          assert(ret.includes('CA certificate created with:'), ret)
          assert(ret.includes('centerName: "default"'), ret)
          assert(ret.includes('crtFile'), ret)
          assert(ret.includes('privateKeyFile'), ret)
          assert(ret.includes(defaultCenterPath), ret)
        }),
        finalize(() => done()),
      ).subscribe()
    })
  })

})
