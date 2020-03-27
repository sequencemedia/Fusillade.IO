import nconf from 'nconf'

import mongoose from 'mongoose'

import {
  JsonModel
} from './json'
import {
  JsonListModel
} from './jsonList'
import {
  HtmlModel
} from './html'
import {
  HtmlListModel
} from './htmlList'
import {
  ExceptionModel
} from './exception'

export const initialise = () => {
  const uri = nconf.get('mongo:uri')
  const options = nconf.get('mongo:options')

  return new Promise((resolve, reject) => {
    mongoose.Promise = Promise
    mongoose.connect(uri, { promiseLibrary: Promise, ...options }, (e) => {
      if (!e) {
        return resolve({
          JsonModel: JsonModel(),
          JsonListModel: JsonListModel(),
          HtmlModel: HtmlModel(),
          HtmlListModel: HtmlListModel(),
          ExceptionModel: ExceptionModel()
        })
      }
      reject(e)
    })
  })
}
