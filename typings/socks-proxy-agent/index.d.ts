declare module 'socks-proxy-agent' {
  import { Agent, AgentOptions } from 'http'

  class SocksProxyAgent extends Agent {
    constructor(url: string)
    options: AgentOptions;
  }
  export default SocksProxyAgent
}
