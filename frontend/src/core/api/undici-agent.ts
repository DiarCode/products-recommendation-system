import { Agent, setGlobalDispatcher } from 'undici'

export const undiciAgent = new Agent({
	autoSelectFamily: true,
	keepAliveTimeout: 10,
	keepAliveMaxTimeout: 10
})

setGlobalDispatcher(undiciAgent)
