/// <reference types="mocha" />

import {
  basename,
} from '@waiting/shared-core'
import * as assert from 'power-assert'
import { from as ofrom } from 'rxjs'
import { finalize, tap } from 'rxjs/operators'

import { cmdSet } from '../src/lib/config'
import { genCmdHelp } from '../src/lib/helper'


const filename = basename(__filename)

describe(filename, () => {
  describe('Should myca help works', () => {
    it('without args', done => {
      const help = genCmdHelp('')
      assert(help.includes('Standard commands'), help)

      return ofrom(cmdSet).pipe(
        tap(cmd => {
          assert(help.includes(cmd), help)
        }),
        finalize(() => done()),
      ).subscribe()
    })

    it('with initca -h', () => {
      const help = genCmdHelp('initca')
      assert(help.includes('--centerName'), help)
    })

    it('with issue -h', () => {
      const help = genCmdHelp('issue')
      assert(help.includes('--kind'), help)
    })

    it('with initcenter -h', () => {
      const help = genCmdHelp('initcenter')
      assert(help.includes('--path'), help)
    })

  })
})
