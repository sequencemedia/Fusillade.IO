import mongoose from 'mongoose'

let Html
const schema = {
  fileName: String,
  htmlFile: String,
  key: String,
  now: Date
}
const config = {
  collection: 'HTML',
  versionKey: false
}

export function HtmlModel () {
  if (Html) return Html
  const htmlSchema = new mongoose.Schema(schema, config)
  return (
    Html = mongoose.model('Html', htmlSchema)
  )
}
