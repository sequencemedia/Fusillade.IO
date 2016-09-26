import path from 'path'

import moment from 'moment'

import {
  watch
} from 'sacred-fs'

import {
  ensure,
  readJsonFile,
  readHtmlFile,
  logException
} from '../common'

/**
 * Watch
 * @description Watch JSON
 *        - Watches the file system for JSON files and stores them in MongoDB
 *
 * @param {Object} parameters
 * @return {Object}
 */
function watchJson ({ log, models, key }) {
  const jsonPath = path.resolve(log, 'json')
  const now = moment().format()
  return ensure(jsonPath)
    .then(() => (
      watch(jsonPath, { encoding: 'utf8' }, (event, fileName) => {
        if (event && fileName) {
          readJsonFile(path.resolve(jsonPath, fileName))
            .then((file) => {
              const json = new models.JsonModel({ ...file, fileName, jsonFile: JSON.parse(file.jsonFile), key, now })
              json.save((e) => {
                if (e) throw e
              })
            })
        }
      })
    ))
}

/**
 * Watch
 * @description Watch HTML
 *        - Watches the file system for HTML files and stores them in MongoDB
 *
 * @param {Object} parameters
 * @return {Object}
 */
function watchHtml ({ log, models, key }) {
  const htmlPath = path.resolve(log, 'html')
  const now = moment().format()
  return ensure(htmlPath)
    .then(() => (
      watch(htmlPath, { encoding: 'utf8' }, (event, fileName) => {
        if (event && fileName) {
          readHtmlFile(path.resolve(htmlPath, fileName))
            .then((file) => {
              const html = new models.HtmlModel({ ...file, fileName, key, now })
              html.save((e) => {
                if (e) throw e
              })
            })
        }
      })
    ))
}

/**
 * Watch
 * @description Create Watch - JSON
 *
 * @param {Object} parameters
 * @return {Object}
 */
const createWatchJson = (parameters) => (
  watchJson(parameters)
    .then((w) => ({
      watchJson: w,
      ...parameters
    }))
)

/**
 * Watch
 * @description Create Watch - HTML
 *
 * @param {Object} parameters
 * @return {Object}
 */
const createWatchHtml = (parameters) => (
  watchHtml(parameters)
    .then((w) => ({
      watchHtml: w,
      ...parameters
    }))
)

/**
 * Watch
 * @description Create Watch
 *
 * @param {Object} parameters
 * @return {Promise}
 */
export const createWatch = ({ log, models, key, ...parameters }) => (
  Promise.resolve({
    log,
    models,
    key
  })
    .then(createWatchJson)
    .then(createWatchHtml)
    .then((v) => ({
      log,
      models,
      key,
      watchJson: v.watchJson,
      watchHtml: v.watchHtml,
      ...parameters
    }))
    .catch((e) => (
      logException({
        e,
        models
      })
    ))
)

/**
 * Watch
 * @description Remove Watch - JSON
 *
 * @param {Object} parameters
 * @return {Object}
 */
function removeWatchJson ({ watchJson, ...parameters }) {
  if (watchJson) watchJson.close()
  return { ...parameters }
}

/**
 * Watch
 * @description Remove Watch - HTML
 *
 * @param {Object} parameters
 * @return {Object}
 */
function removeWatchHtml ({ watchHtml, ...parameters }) {
  if (watchHtml) watchHtml.close()
  return { ...parameters }
}

/**
 * Watch
 * @description Remove Watch
 *
 * @param {Object} parameters
 * @return {Promise}
 */
export const removeWatch = ({ watchJson, watchHtml, ...parameters }) => (
  Promise.resolve({
    watchHtml,
    watchJson
  })
    .then(removeWatchJson)
    .then(removeWatchHtml)
    .then(() => ({ ...parameters }))
    .catch((e) => {
      const {
        models
      } = parameters
      return logException({
        e,
        models
      })
    })
)
