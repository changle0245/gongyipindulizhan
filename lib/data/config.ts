import fs from 'fs';
import path from 'path';
import { SystemConfig, EmailConfig } from '../types';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

/**
 * 获取系统配置
 */
export function getSystemConfig(): SystemConfig {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(CONFIG_FILE)) {
      // 返回默认配置
      const defaultConfig: SystemConfig = {
        emails: [
          {
            department: 'Sales Department',
            email: process.env.ADMIN_EMAIL || '',
            enabled: true
          }
        ]
      };
      saveSystemConfig(defaultConfig);
      return defaultConfig;
    }

    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading system config:', error);
    return {
      emails: []
    };
  }
}

/**
 * 保存系统配置
 */
export function saveSystemConfig(config: SystemConfig): void {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * 获取所有启用的邮箱地址
 */
export function getEnabledEmails(): string[] {
  const config = getSystemConfig();
  return config.emails
    .filter(e => e.enabled)
    .map(e => e.email);
}

/**
 * 添加邮箱配置
 */
export function addEmailConfig(emailConfig: EmailConfig): void {
  const config = getSystemConfig();
  config.emails.push(emailConfig);
  saveSystemConfig(config);
}

/**
 * 更新邮箱配置
 */
export function updateEmailConfig(index: number, emailConfig: EmailConfig): void {
  const config = getSystemConfig();
  if (index >= 0 && index < config.emails.length) {
    config.emails[index] = emailConfig;
    saveSystemConfig(config);
  }
}

/**
 * 删除邮箱配置
 */
export function deleteEmailConfig(index: number): void {
  const config = getSystemConfig();
  if (index >= 0 && index < config.emails.length) {
    config.emails.splice(index, 1);
    saveSystemConfig(config);
  }
}
