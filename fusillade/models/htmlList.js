import mongoose from 'mongoose'

let HtmlList
const schema = {
  filePathList: Array,
  key: String,
  now: Date
}
const config = {
  collection: 'HTMLList',
  versionKey: false
}

export function HtmlListModel () {
  if (HtmlList) return HtmlList
  const htmlListSchema = new mongoose.Schema(schema, config)
  return (
    HtmlList = mongoose.model('HtmlList', htmlListSchema)
  )
}
