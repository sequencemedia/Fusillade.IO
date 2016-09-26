import path from 'path'
import glob from 'glob-all'
import {
  exec
} from 'child_process'

import {
  generateKeyName,
  jsonFilePath,
  htmlFilePath,
  logException
} from '../common'

const PROCESS_CWD = process.cwd()

/**
 * Stage One
 * @description Generates the file path of Artillery scripts
 *
 * @param {Object} parameters
 * @return {Promise}
 */
const generateFilePathList = ({ log, src, key }) => (
  Promise.resolve({
    log,
    src,
    key,
    filePathList: [
      path.resolve(src, '*.json')
    ]
  })
)

/**
 * Stage One
 * @description Gets a list of files on the file path for Artillery scripts
 *
 * @param {Object} parameters
 * @return {Promise}
 */
const getFilePathList = ({ log, src, key, filePathList }) => (
  new Promise((success, failure) => {
    glob(filePathList, (e, filePathList) => {
      if (!e) {
        return success({
          key,
          src,
          log,
          filePathList
        })
      }
      failure(e)
    })
  })
)

/**
 * Stage One
 * @description Maps each file in the list of Artillery scripts to a Promise resolving when both Stage One and Stage Two are complete
 *
 * @param {String} filePath - the path to the HTML file
 * @return {Promise}
 */
const mapFilePathList = ({ log, key, filePathList }) => (
  filePathList.map((filePath) => load({
    key: generateKeyName(filePath, key),
    log,
    filePath
  }))
)

/**
 * Stage One
 * @description Creates the command line instruction for Stage One (RUN) of Artillery (load and performance scripts)
 *
 * @param {Object} parameters
 * @return {String}
 */
function generateRunCmd ({ log, key, filePath }) {
  const file = path.relative(PROCESS_CWD, filePath)
  const json = path.relative(PROCESS_CWD, jsonFilePath(log, key))
  return `artillery run ${file} -o ${json}`
}

/**
 * Stage One
 * @description Executes the command line instruction for Stage One (RUN) of Artillery (load and performance scripts)
 *
 * @param {Object} parameters
 * @return {Promise}
 */
const executeRunCmd = ({ run, ...parameters }) => (
  new Promise((success, failure) => exec(run, (e) => (!e) ? success({ run, ...parameters }) : failure(e)))
)

/**
 * Stage One
 * @description Creates the command line instruction for Stage One (REP) of Artillery (load and performance reports)
 *
 * @param {Object} parameters
 * @return {String}
 */
function generateRepCmd ({ log, key }) {
  const json = path.relative(PROCESS_CWD, jsonFilePath(log, key))
  const html = path.relative(PROCESS_CWD, htmlFilePath(log, key))
  return `artillery report ${json} -o ${html}`
}

/**
 * Stage One
 * @description Executes the command line instruction for Stage One (REP) of Artillery (load and performance reports)
 *
 * @param {Object} parameters
 * @return {Promise}
 */
const executeRepCmd = ({ rep, ...parameters }) => (
  new Promise((success, failure) => exec(rep, (e) => (!e) ? success({ rep, ...parameters }) : failure(e)))
)

/**
 * Stage One
 * @description Load the guns. Generate each command line instruction and execute it
 *
 * @param {Object} parameters
 * @return {Promise}
 */
const load = ({ log, key, filePath }) => (
  Promise.resolve({
    log,
    key,
    filePath
  })
    .then(generateRunCmd)
    .then((run) => ({
      log,
      key,
      run
    }))
    .then(executeRunCmd)
    .then(generateRepCmd)
    .then((rep) => ({
      log,
      key,
      rep
    }))
    .then(executeRepCmd)
)

/**
 * Stage One
 * @description Fire the guns. Resolves when all command line instructions have been generated then executed
 *
 * @param {Array} guns - an array of Promises
 * @return {Promise}
 */
const fire = (guns) => Promise.all(guns)

/**
 * Stage One
 *
 * @param {Object} parameters
 * @return {Promise}
 */
export const stageOne = ({ log, src, key, ...parameters }) => (
  generateFilePathList({
    log,
    src,
    key
  })
    .then(getFilePathList)
    .then(mapFilePathList)
    .then(fire)
    .then(() => ({ log, src, key, ...parameters }))
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
