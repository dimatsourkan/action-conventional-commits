import {expect, test} from '@jest/globals'

import * as cc from '../src/conventionalcommit'

const types_default = 'fix|feat|revert'
const scopes_default = '.*'

test('commit - default - positive', async () => {
  let msg: string = `feat: test commit`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default, scopes_default)

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('feat')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('')
  expect(commit.breaking_change).toBe('')
})

test('commit - default - negative', async () => {
  let msg: string = `test commit`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default, scopes_default)

  expect(commit.invalid).toBe(true)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('')
  expect(commit.message).toBe('')
  expect(commit.body).toBe('')
  expect(commit.breaking_change).toBe('')
})

test('commit - scope - positive', async () => {
  let msg: string = `feat(cicd): test commit`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default, scopes_default)

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('feat')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('cicd')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('')
  expect(commit.breaking_change).toBe('')
})

test('commit - custom scope - positive', async () => {
  let msg: string = `feat(ui): test commit`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default, 'ui')

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('feat')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('ui')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('')
  expect(commit.breaking_change).toBe('')
})

test('commit - custom scope - negative', async () => {
  let msg: string = `feat(ui): test commit`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default, 'utils')

  expect(commit.invalid).toBe(true)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('')
  expect(commit.message).toBe('')
  expect(commit.body).toBe('')
  expect(commit.breaking_change).toBe('')
})

test('commit - scope required - positive', async () => {
  let msg: string = `feat(ui): test commit`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default, 'ui', true)

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('feat')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('ui')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('')
  expect(commit.breaking_change).toBe('')
})

test('commit - scope required - negative', async () => {
  let msg: string = `feat: test commit`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default, 'ui', true)

  expect(commit.invalid).toBe(true)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('')
  expect(commit.message).toBe('')
  expect(commit.body).toBe('')
  expect(commit.breaking_change).toBe('')
})

test('commit - with body', async () => {
  let msg: string = `fix(cicd): test commit

some more text`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default, scopes_default)

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('fix')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('cicd')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('some more text')
  expect(commit.breaking_change).toBe('')
})

test('commit - breaking', async () => {
  let msg: string = `fix(cicd)!: test commit

some more text

BREAKING CHANGE: API changed`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default, scopes_default)

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('fix')
  expect(commit.breaking).toBe(true)
  expect(commit.scope).toBe('cicd')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('some more text')
  expect(commit.breaking_change).toBe('API changed')
})
