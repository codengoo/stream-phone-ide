import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ServerSource = 'local' | 'remote' | 'lan'

export interface ServerSettingState {
  serverHost: string
  serverPort: string
  serverPass: string
  serverSource: ServerSource
}

const initialState: ServerSettingState = {
  serverHost: localStorage.getItem('server-host') || 'localhost',
  serverPort: localStorage.getItem('server-port') || '9373',
  serverPass: localStorage.getItem('server-pass') || '',
  serverSource: (localStorage.getItem('server-source') as ServerSource) || 'local'
}

const slice = createSlice({
  name: 'serverSetting',
  initialState,
  reducers: {
    setServerConfig(state, action: PayloadAction<{ host: string; port: string }>) {
      state.serverHost = action.payload.host
      state.serverPort = action.payload.port
      localStorage.setItem('server-host', action.payload.host)
      localStorage.setItem('server-port', action.payload.port)
      try { window.streamAPI.setServerConfig(action.payload.host, action.payload.port) } catch {}
    },
    setServerPass(state, action: PayloadAction<string>) {
      state.serverPass = action.payload
      if (action.payload) localStorage.setItem('server-pass', action.payload)
      else localStorage.removeItem('server-pass')
    },
    setServerSource(state, action: PayloadAction<ServerSource>) {
      state.serverSource = action.payload
      localStorage.setItem('server-source', action.payload)
    }
  }
})

export const { setServerConfig, setServerPass, setServerSource } = slice.actions
export default slice.reducer
