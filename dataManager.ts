import fs from 'fs-extra'
import path from 'path'
import { DATA_ROOT } from './utils'
import _ from 'lodash'

interface ISubscriber {
  chatId: number
  jobRegs: string[]
}

class DataManager {
  public get subscriberRoot() {
    return path.join(DATA_ROOT, 'subscribers')
  }

  public get subscriberList(): ISubscriber[] {
    const list = fs.readJSONSync(this.subscriberRoot)
    return _.isArray(list) ? list : []
  }

  public getSubscriberByChatId(chatId: number) {
    return _.find(this.subscriberList, {chatId})
  }

  public writeSubscribers(data: ISubscriber[]) {
    fs.outputJsonSync(this.subscriberRoot, data)
  }
}

export default new DataManager()
