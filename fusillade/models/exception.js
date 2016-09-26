import mongoose from 'mongoose'

let Exception
const schema = {
  exception: Object,
  now: Date
}
const config = {
  collection: 'Exception',
  versionKey: false
}

export function ExceptionModel () {
  if (Exception) return Exception
  const exceptionSchema = new mongoose.Schema(schema, config)
  return (
    Exception = mongoose.model('Exception', exceptionSchema)
  )
}
