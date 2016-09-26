import fs from 'fs-extra'

import {
  logException
} from '../common'

/**
 * Clean Up -
 * @description Deletes the file from the file system
 *
 * @param {String} filePath - the path to the file
 * @return {Promise}
 */
const purgeFilePath = (filePath) => (
  new Promise((success, failure) => {
    fs.stat(filePath, (e) => { //, stat) {
      if (e) return success(filePath)
      fs.unlink(filePath, (e) => (!e) ? success(filePath) : failure(e))
    })
  })
)

/**
 * Clean up - Clean JSON
 * @description Removes the JSON List Models from MongoDB
 *        - Anything which does not match this unique identifier key (in case last session was interrupted)
 *        - Everything which matches this unique identifier key
 *
 * @param {String} key - unique identifier
 * @return {Promise}
 */
function cleanJson ({ key, models, ...parameters }) {
  /**
   * Clean JSON
   * @description Retrieves the JSON List Models which do not match this unique identifier key
   *
   * @param {String} key - unique identifier
   * @return {Promise}
   */
  const fetchJsonListModelsNeKey = (key) => (
    new Promise((success, failure) => {
      models.JsonListModel.find({ key: { $ne: key } })
        .exec((e, array) => (!e) ? success(array) : failure(e))
    })
  )
  /**
   * Clean JSON
   * @description Retrieves the JSON List Models which match this unique identifier key
   *
   * @param {String} key - unique identifier
   * @return {Promise}
   */
  const fetchJsonListModelsEqKey = (key) => (
    new Promise((success, failure) => {
      models.JsonListModel.find({ key })
        .exec((e, array) => (!e) ? success(array) : failure(e))
    })
  )

  /**
   * Clean JSON
   * @description Create the JSON List Model
   *
   * @param {Object} model - JSON List Model
   * @return {Object}
   */
  const mapJsonListModel = (model) => new models.JsonListModel(model)

  /**
   * Clean JSON
   * @description Map all objects in the array to the JSON List Model
   *
   * @param {Array} array - all JSON List Models
   * @return {Array}
   */
  const mapJsonListModels = (array) => array.map(mapJsonListModel)

  /**
   * Clean JSON
   * @description Map each file path to a Promise which resolves when the file is deleted from the file system
   *
   * @param {Object} model - JSON List Model
   * @return {Promise}
   */
  const mapJsonListModelsFilePathList = (model) => Promise.all(model.filePathList.map(purgeFilePath))

  /**
   * Clean JSON
   * @description Map all JSON List Model file path lists to a Promise which resolves when the files are deleted from the file system
   *
   * @param {Array} array - all JSON List Models
   * @return {Promise}
   */
  const purgeJsonListModelsFilePathList = (array) => (
    Promise.all(array.map(mapJsonListModelsFilePathList))
      .then(() => array)
  )

  /**
   * Clean JSON
   * @description Map the JSON List Model to a Promise which deletes it from MongoDB
   *
   * @param {String} model - JSON List Model
   * @return {Promise}
   */
  const purgeJsonListModel = (model) => (
    new Promise((success, failure) => {
      models.JsonListModel.remove({ _id: model.id }, (e) => (!e) ? success() : failure(e))
    })
  )

  /**
   * Clean JSON
   * @description Map all JSON List Models to a Promise which deletes them from MongoDB
   *
   * @param {String} array - all JSON List Models
   * @return {Promise}
   */
  const purgeJsonListModels = (array) => (
    Promise.all(array.map(purgeJsonListModel))
      .then(() => array)
  )

  /**
   * Clean JSON
   * @description Removes the JSON List Models which do not match this unique identifier key
   *
   * @param @param {Object} parameters
   * @return {Promise}
   */
  const cleanJsonListModelsNeKey = ({ key, ...parameters }) => (
    fetchJsonListModelsNeKey(key)
      .then(mapJsonListModels)
      .then(purgeJsonListModelsFilePathList)
      .then(purgeJsonListModels)
      .then(() => ({ key, ...parameters }))
  )

  /**
   * Clean JSON
   * @description Removes the JSON List Models which match this unique identifier key
   *
   * @param @param {Object} parameters
   * @return {Promise}
   */
  const cleanJsonListModelsEqKey = ({ key, ...parameters }) => (
    fetchJsonListModelsEqKey(key)
      .then(mapJsonListModels)
      .then(purgeJsonListModelsFilePathList)
      .then(purgeJsonListModels)
      .then(() => ({ key, ...parameters }))
  )

  return Promise.resolve({
    key
  })
    .then(cleanJsonListModelsNeKey)
    .then(cleanJsonListModelsEqKey)
    .then(() => ({ key, models, ...parameters }))
    .catch((e) => (
      logException({
        e,
        models
      })
    ))
}

/**
 * Clean Up - Clean HTML
 * @description Removes the HTML List Models from MongoDB
 *        - Anything which does not match this unique identifier key (in case last session was interrupted)
 *        - Everything which matches this unique identifier key
 *
 * @param @param {Object} parameters
 * @return {Promise}
 */
function cleanHtml ({ key, models, ...parameters }) {
  /**
   * Clean HTML
   * @description Retrieves the HTML List Models which do not match this unique identifier key
   *
   * @param {String} key - unique identifier
   * @return {Promise}
   */
  const fetchHtmlListModelsNeKey = (key) => (
    new Promise((success, failure) => {
      models.HtmlListModel.find({ key: { $ne: key } })
        .exec((e, array) => (!e) ? success(array) : failure(e))
    })
  )

  /**
   * Clean HTML
   * @description Retrieves the HTML List Models which match this unique identifier key
   *
   * @param {String} key - unique identifier
   * @return {Promise}
   */
  const fetchHtmlListModelsEqKey = (key) => (
    new Promise((success, failure) => {
      models.HtmlListModel.find({ key })
        .exec((e, array) => (!e) ? success(array) : failure(e))
    })
  )

  /**
   * Clean HTML
   * @description Create the HTML List Model
   *
   * @param {Object} model - HTML List Model
   * @return {Object}
   */
  const mapHtmlListModel = (model) => new models.HtmlListModel(model)

  /**
   * Clean HTML
   * @description Map all objects in the array to the HTML List Model
   *
   * @param {Array} array - all HTML List Models
   * @return {Array}
   */
  const mapHtmlListModels = (array) => array.map(mapHtmlListModel)

  /**
   * Clean HTML
   * @description Map each file path to a Promise which resolves when the file is deleted from the file system
   *
   * @param {Object} model - HTML List Model
   * @return {Promise}
   */
  const mapHtmlListModelsFilePathList = (model) => Promise.all(model.filePathList.map(purgeFilePath))

  /**
   * Clean HTML
   * @description Map all HTML List Model file path lists to a Promise which resolves when the files are deleted from the file system
   *
   * @param {Array} array - all HTML List Models
   * @return {Promise}
   */
  const purgeHtmlListModelsFilePathList = (array) => (
    Promise.all(array.map(mapHtmlListModelsFilePathList))
      .then(() => array)
  )

  /**
   * Clean HTML
   * @description Map the HTML List Model to a Promise which deletes it from MongoDB
   *
   * @param {Object} model - HTML List Model
   * @return {Promise}
   */
  const purgeHtmlListModel = (model) => (
    new Promise((success, failure) => {
      models.HtmlListModel.remove({ _id: model.id }, (e) => (!e) ? success() : failure(e))
    })
  )

  /**
   * Clean HTML
   * @description Map all HTML List Models to a Promise which deletes them from MongoDB
   *
   * @param {Array} array - all HTML List Models
   * @return {Promise}
   */
  const purgeHtmlListModels = (array) => (
    Promise.all(array.map(purgeHtmlListModel))
      .then(() => array)
  )

  /**
   * Clean HTML
   * @description Removes the HTML List Models which do not match this unique identifier key
   *
   * @param @param {Object} parameters
   * @return {Promise}
   */
  const cleanHtmlListModelsNeKey = ({ key, ...parameters }) => (
    fetchHtmlListModelsNeKey(key)
      .then(mapHtmlListModels)
      .then(purgeHtmlListModelsFilePathList)
      .then(purgeHtmlListModels)
      .then(() => ({ key, ...parameters }))
  )

  /**
   * Clean HTML
   * @description Removes the HTML List Models which match this unique identifier key
   *
   * @param @param {Object} parameters
   * @return {Promise}
   */
  const cleanHtmlListModelsEqKey = ({ key, ...parameters }) => (
    fetchHtmlListModelsEqKey(key)
      .then(mapHtmlListModels)
      .then(purgeHtmlListModelsFilePathList)
      .then(purgeHtmlListModels)
      .then(() => ({ key, ...parameters }))
  )

  return Promise.resolve({
    key
  })
    .then(cleanHtmlListModelsNeKey)
    .then(cleanHtmlListModelsEqKey)
    .then(() => ({ key, models, ...parameters }))
    .catch((e) => (
      logException({
        e,
        models
      })
    ))
}

/**
 * Clean Up
 *
 * @param {Object} parameters
 * @return {Promise}
 */
export const cleanUp = ({ key, models, ...parameters }) => (
  Promise.resolve({
    key,
    models
  })
    .then(cleanJson)
    .then(cleanHtml)
    .then(() => ({ key, models, ...parameters }))
    .catch((e) => (
      logException({
        e,
        models
      })
    ))
)
