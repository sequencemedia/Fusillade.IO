/*
 *  TODO
 *  Remove dependency from nconf after initialisation
 */
import nconf from 'nconf'

import path from 'path'

import moment from 'moment'
import mailer from 'nodemailer'

import {
  generateJsonPathList,
  generateHtmlPathList,
  getJsonFilePathList,
  getHtmlFilePathList,
  mapHtmlFilePathList,
  logJsonFilePathList,
  logHtmlFilePathList,
  logException
} from '../common'

/**
 * Stage Two
 * @description Read the report files
 *
 * @param {Array} them - an array of Promises
 * @return {Promise}
 */
const read = (them) => Promise.all(them)

/**
 * Stage Two
 * @description Mail the report files
 *
 * @param {Array} them - an array of objects containing the file content
 * @return {Promise}
 */
function mail (them) {
  const transport = mailer.createTransport(nconf.get('mailer:transport'))
  const message = nconf.get('mailer:message') || {}
  const subject = (
      nconf.get('mailer:message:subject') || '{startDate} - {startTime}')
        .replace(/{startDate}/g, moment().format('Do MMMM YYYY'))
        .replace(/{startTime}/g, moment().format('HH:mm:ss'))
  const attachments = them.map((file) => ({ filename: path.basename(file.filePath), content: file.htmlFile }))
  return new Promise((success, failure) => { // return success(them)
    transport.sendMail({ ...message, subject, attachments }, (e) => (!e) ? success(them) : failure(e))
  })
}

/**
 * Stage Two
 * @description Generate JSON
 *
 * @param {Object} parameters
 * @return {Promise}
 */
const generateJson = ({ log, models, key, ...parameters }) => (
  Promise.resolve({
    log,
    key
  })
    .then(generateJsonPathList)
    .then(getJsonFilePathList)
    .then((v) => ({
      log,
      models,
      key,
      filePathList: v.filePathList
    }))
    .then(logJsonFilePathList)
    .then(() => ({ log, models, key, ...parameters }))
)

/**
 * Stage Two
 * @description Generate HTML
 *
 * @param {Object} parameters
 * @return {Promise}
 */
const generateHtml = ({ log, models, key, ...parameters }) => (
  Promise.resolve({
    log,
    key
  })
    .then(generateHtmlPathList)
    .then(getHtmlFilePathList)
    .then((v) => ({
      log,
      models,
      key,
      filePathList: v.filePathList
    }))
    .then(logHtmlFilePathList)
    .then(() => ({ log, models, key, ...parameters }))
)

/**
 * Stage Two
 * @description Generate Mail
 *
 * @param {Object} parameters
 * @return {Promise}
 */
const generateMail = ({ log, key, ...parameters }) => (
  Promise.resolve({
    log,
    key
  })
    .then(generateHtmlPathList)
    .then(getHtmlFilePathList)
    .then(mapHtmlFilePathList)
    .then(read)
    .then(mail)
    .then(() => ({ log, key, ...parameters }))
)

/**
 * Stage Two
 *
 * @param {Object} parameters
 * @return {Promise}
 */
export const stageTwo = ({ log, models, key, ...parameters }) => (
  Promise.resolve({
    log,
    key,
    models
  })
    .then(generateJson)
    .then(generateHtml)
    .then(generateMail)
    .then(() => ({ log, models, key, ...parameters }))
    .catch((e) => (
      logException({
        e,
        models
      })
      .then(() => {
        process.exit(1)
      })
    ))
)
