const ROOT_PATH = 'qv';
const LOG_PATH = 'log';
const STYLE_PATH = 'style';
const CONFIG_PATH = 'config';
const USER_HOME = process.env.HOME || process.env.USERPROFILE;

import fs from 'fs';
import { join } from 'path';

function createFolder(rp: string) {
  if (fs.existsSync(rp)) {
    console.log(`${rp}已存在`);
  } else {
    console.log(`创建文件,${rp}`);
    fs.mkdirSync(rp);
  }
}

export function GetLogPath() {
  // @ts-ignore
  return join(USER_HOME, ROOT_PATH, LOG_PATH);
}

export function GetStylePath() {
  // @ts-ignore
  return join(USER_HOME, ROOT_PATH, STYLE_PATH);
}
export function GetConfigPath() {
  // @ts-ignore
  return join(USER_HOME, ROOT_PATH, CONFIG_PATH);
}

export function CreateRootPath() {
  // @ts-ignore
  let rp = join(USER_HOME, ROOT_PATH);
  createFolder(rp);
  createFolder(GetLogPath());
  createFolder(GetStylePath());
  createFolder(GetConfigPath());
}

export function LogPath() {
  console.log('用户目录', USER_HOME);
}
