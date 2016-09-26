import mongoose from 'mongoose'

let Json
const schema = {
  fileName: String,
  jsonFile: Object,
  key: String,
  now: Date
}
const config = {
  collection: 'JSON',
  versionKey: false
}

export function JsonModel () {
  if (Json) return Json
  const jsonSchema = new mongoose.Schema(schema, config)
  return (
    Json = mongoose.model('Json', jsonSchema)
  )
}
