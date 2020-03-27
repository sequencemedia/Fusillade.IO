import fs from 'fs-extra'
import path from 'path'
import glob from 'glob-all'
import {
  readFile
} from 'sacred-fs'

import moment from 'moment'

/**
 * Watch
 * @description Ensure paths exist for i/o
 *
 * @param {String} path - the path
 * @return {Promise}
 */
export const ensure = (path) => (
  new Promise((resolve, reject) => {
    fs.ensureDir(path, (e) => (!e) ? resolve() : reject(e))
  })
)

/**
 * Stage One
 * @description Creates a unique identifier (shared by the JSON and HTML output file names)
 *
 * @param {String} filePath - Artillery script file path
 * @param {String} key - unique identifier
 * @return {String}
 */
export const generateKeyName = (filePath, key) => `${path.basename(filePath, '.json')}-${key}`

/**
 * Stage One
 * @description Creates the JSON output file name
 *
 * @param {String} key - unique identifier
 * @return {String}
 */
const jsonFileName = (key) => `${key}.json`

/**
 * Stage One
 * @description Creates the JSON output file path
 *
 * @see jsonFileName
 * @param {String} log - log file path
 * @param {String} key - unique identifier
 * @return {String}
 */
export const jsonFilePath = (log, key) => path.resolve(log, 'json', jsonFileName(key))

/**
 * Stage One
 * @description Creates the HTML output file name
 *
 * @param {String} key - unique identifier
 * @return {String}
 */
const htmlFileName = (key) => `${key}.html`

/**
 * Stage One
 * @description Creates the HTML output file path
 *
 * @see htmlFileName
 * @param {String} log - log file path
 * @param {String} key - unique identifier
 * @return {String}
 */
export const htmlFilePath = (log, key) => path.resolve(log, 'html', htmlFileName(key))

/**
 * Watch + Stage Two
 * @description Reads the JSON file
 *
 * @param {String} filePath - the path to the JSON file
 * @return {Promise}
 */
export const readJsonFile = (filePath) => (
  readFile(filePath, 'utf8')
    .then((jsonFile) => ({ filePath, jsonFile }))
)

/**
 * Watch + Stage Two
 * @description Reads the HTML file
 *
 * @param {String} filePath - the path to the HTML file
 * @return {Promise}
 */
export const readHtmlFile = (filePath) => (
  readFile(filePath, 'utf8')
    .then((htmlFile) => ({ filePath, htmlFile }))
)

/**
 * Stage Two
 * @description Generates the file path of JSON files (product of Stage One)
 *
 * @param {Object} parameters
 * @return {Promise}
 */
export const generateJsonPathList = ({ log }) => (
  Promise.resolve({
    filePathList: [
      path.resolve(log, 'json', '*.json')
    ]
  })
)

/**
 * Stage Two
 * @description Generates the file path of HTML files (product of Stage Two)
 *
 * @param {Object} parameters
 * @return {Promise}
 */
export const generateHtmlPathList = ({ log }) => (
  Promise.resolve({
    filePathList: [
      path.resolve(log, 'html', '*.html')
    ]
  })
)

/**
 * Stage Two
 * @description Gets a list of files on the file path for JSON files (product of Stage One)
 *
 * @param {Object} parameters
 * @return {Promise}
 */
export const getJsonFilePathList = ({ filePathList }) => (
  new Promise((resolve, reject) => {
    glob(filePathList, (e, filePathList) => (!e) ? resolve({ filePathList }) : reject(e))
  })
)

/**
 * Stage Two
 * @description Gets a list of files on the file path for HTML files (product of Stage One)
 *
 * @param {Object} parameters
 * @return {Promise}
 */
export const getHtmlFilePathList = ({ filePathList }) => (
  new Promise((resolve, reject) => {
    glob(filePathList, (e, filePathList) => (!e) ? resolve({ filePathList }) : reject(e))
  })
)

/**
 * Watch + Stage Two
 * @description Maps each file in the list JSON files to an object containing the file content
 *
 * @param {String} filePathList - a list of the JSON file paths
 * @return {Array}
 */
export const mapJsonFilePathList = ({ filePathList }) => filePathList.map(readJsonFile)

/**
 * Watch + Stage Two
 * @description Maps each file in the list HTML files to an object containing the file content
 *
 * @param {Object} parameters
 * @return {Array}
 */
export const mapHtmlFilePathList = ({ filePathList }) => filePathList.map(readHtmlFile)

/**
 * Stage Two
 * @description Stores the JSON List Model (JSON file path list) in MongoDB
 *
 * @param @param {Object} parameters
 * @return {Promise}
 */
export const logJsonFilePathList = ({ models, filePathList, key }) => (
  new Promise((resolve, reject) => {
    const jsonList = new models.JsonListModel({
      filePathList,
      key,
      now: moment().format()
    })
    jsonList.save((e) => (!e) ? resolve({ filePathList }) : reject(e))
  })
)

/**
 * Stage Two
 * @description Stores the HTML List Model (HTML file path list) in MongoDB
 *
 * @param {Object} parameters
 * @return {Promise}
 */
export const logHtmlFilePathList = ({ models, filePathList, key }) => (
  new Promise((resolve, reject) => {
    const htmlList = new models.HtmlListModel({
      filePathList,
      key,
      now: moment().format()
    })
    htmlList.save((e) => (!e) ? resolve({ filePathList }) : reject(e))
  })
)

/**
 * Watch + Stage One + Stage Two + Clean Up
 * @description Stores the Exception Model (exception objects) in MongoDB
 *
 * @param {Error} e - the exception
 * @return {Promise}
 */
export const logException = ({ e, models }) => (
  new Promise((resolve, reject) => {
    const {
      message,
      name,
      code,
      stack
    } = e
    const exception = new models.ExceptionModel({
      exception: {
        message,
        name,
        code,
        stack
      },
      now: moment().format()
    })
    exception.save((e) => (!e) ? resolve() : reject(e))
  })
)
