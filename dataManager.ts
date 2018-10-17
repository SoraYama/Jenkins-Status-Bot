import fs from 'fs-extra'
import path from 'path'
import { DATA_ROOT } from './utils'
import _ from 'lodash'
import log4js from './logger';

const logger = log4js.getLogger('dataManager')

interface ISubscriber {
  chatId: number
  jobRegs: string[]
}

class DataManager {
  public get subscriberRoot() {
    return path.join(DATA_ROOT, 'subscribers.json')
  }

  public get subscriberList(): ISubscriber[] {
    try {
      if (!fs.existsSync(this.subscriberRoot)) {
        fs.outputJSONSync(this.subscriberRoot, [])
        return []
      }
      const list = fs.readJSONSync(this.subscriberRoot)
      return _.isArray(list) ? list : []
    } catch(e) {
      logger.error(e)
      return []
    }
  }

  public getSubscriberByChatId(chatId: number) {
    return _.find(this.subscriberList, {chatId})
  }

  public writeSubscribers(data: ISubscriber[]) {
    fs.outputJsonSync(this.subscriberRoot, data)
  }
}

export default new DataManager()
