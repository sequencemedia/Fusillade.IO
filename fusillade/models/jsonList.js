import mongoose from 'mongoose'

let JsonList
const schema = {
  filePathList: Array,
  key: String,
  now: Date
}
const config = {
  collection: 'JSONList',
  versionKey: false
}

export function JsonListModel () {
  if (JsonList) return JsonList
  const jsonListSchema = new mongoose.Schema(schema, config)
  return (
    JsonList = mongoose.model('JsonList', jsonListSchema)
  )
}
