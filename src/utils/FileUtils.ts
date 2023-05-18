const ROOT_PATH = 'qv';
const LOG_PATH = 'log';
const STYLE_PATH = 'style';
const CONFIG_PATH = 'config';
const DITU_CONFIG_FILE = 'dt.json';
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
export function GetDiTuConfigFile() {
  // @ts-ignore
  return join(USER_HOME, ROOT_PATH, CONFIG_PATH, DITU_CONFIG_FILE);
}

export function GetStylePath() {
  // @ts-ignore
  return join(USER_HOME, ROOT_PATH, STYLE_PATH);
}
export function GetConfigPath() {
  // @ts-ignore
  return join(USER_HOME, ROOT_PATH, CONFIG_PATH);
}

function createFile(file: string, data: string ) {
  if (fs.existsSync(file)) {
    console.log(`${file}已存在`);
    if (data!="{}") {
      fs.writeFileSync(file, data);
    }
  } else {
    console.log(`创建文件,${file}`);
    // @ts-ignore
    fs.writeFileSync(file, data);
  }
}

export function SaveDiTuConfig(data: string) {
  createFile(GetDiTuConfigFile(), data);
}

export function ReadDiTuConfig() {
  return fs.readFileSync(GetDiTuConfigFile(), 'utf8');
}

export function CreateRootPath() {
  console.log("开始初始化文件夹")

  // @ts-ignore
  let rp = join(USER_HOME, ROOT_PATH);
  createFolder(rp);
  createFolder(GetLogPath());
  createFolder(GetStylePath());
  createFolder(GetConfigPath());
  createFile(GetDiTuConfigFile(), JSON.stringify("{}"));
}

export function LogPath() {
  console.log('用户目录', USER_HOME);
}
