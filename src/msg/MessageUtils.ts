import { ipcRenderer } from 'electron';

export function SendMapConfig(token: string) {
  ipcRenderer.send('map-config', token);
}
