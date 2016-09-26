import nconf from 'nconf'

export const initialise = () => nconf.get('fusillade:src')
