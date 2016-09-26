const defaults = {
  fusillade: {
    log: './fusillade/log',
    models: './fusillade/models',
    src: './fusillade/src'
  }
}

const required = [
  'fusillade:src',
  'fusillade:models',
  'fusillade:log',
  'mongo:uri',
  'mongo:options:host',
  'mongo:options:port',
  'mongo:options:database',
  'mailer:transport:auth:user',
  'mailer:transport:auth:pass'
]

export {
  defaults,
  required
}
