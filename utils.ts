import _ from 'lodash'
import qs from 'querystring'
import path from 'path'
import log4js from './logger'

const logger = log4js.getLogger('utils')

export const validate = (queryString: string, neededStrings: string[]) => {
  const parsed = qs.parse(queryString)
  const lackedParams = _.filter(neededStrings, s => !_.has(parsed, s))
  const ok = _.every(neededStrings, s => _.has(parsed, s))
  return {
    ok,
    lackedParams,
  }
}

export const DATA_ROOT = path.join(__dirname, 'data')
