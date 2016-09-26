
import nconf from 'nconf'

import moment from 'moment'

import {
  defaults,
  required
} from './config'

import { initialise as INITIALISELOG } from './log'
import { initialise as INITIALISEMODELS } from './models'
import { initialise as INITIALISESRC } from './src'

import {
  createWatch,
  removeWatch
} from './src/watch'
import {
  stageOne
} from './src/stage-one'
import {
  stageTwo
} from './src/stage-two'
import {
  cleanUp
} from './src/clean-up'

nconf
  .argv().env()
  .file({ file: nconf.get('file') || 'config.json' })
  .defaults(defaults)
  .required(required)

/**
 * Initialise LOG
 *
 * @param {Object} parameters
 * @return {String}
 */
const initialiseLog = ({ log, ...parameters }) => ({ log: log || INITIALISELOG(), ...parameters })
/**
 * Initialise Models
 *
 * @param {Object} parameters
 * @return {Object}
 */
const initialiseModels = ({ models, ...parameters }) => (
  (models)
    ? ({ models, ...parameters })
    : INITIALISEMODELS().then((models) => ({ models, ...parameters }))
)
/**
 * Initialise SRC
 *
 * @param {Object} parameters
 * @return {String}
 */
const initialiseSrc = ({ src, ...parameters }) => ({ src: src || INITIALISESRC(), ...parameters })

/**
 * Initialise
 *
 * @param {Object} parameters
 * @return {Promise}
 */
const initialise = (parameters) => (
  Promise.resolve({
    key: moment().format('YYYYMMDD-HHmmss'),
    ...parameters
  })
    .then(initialiseLog)
    .then(initialiseModels)
    .then(initialiseSrc)
)

export const fusillade = (parameters = {}) => (
  initialise(parameters)
    /**
     * Create Watch
     */
    .then(createWatch)
    /**
     * Stage One
     */
    .then(stageOne)
    /**
     * Stage Two
     */
    .then(stageTwo)
    /**
     * Clean Up
     */
    .then(cleanUp)
    /**
     * Remove Watch
     */
    .then(removeWatch)
    /**
     * Exit (0)
     */
    .then(() => {
      process.exit()
    })
    /**
     * Exit (1)
     */
    .catch((e) => {
      process.exit(1)
    })
)
