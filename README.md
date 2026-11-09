# ExquisiteHacker

> 让你做一个精致的黑客 —— 一款运行在浏览器扩展弹窗里的红队 / 渗透测试一体化工具箱。

ExquisiteHacker 是一个基于 Chrome / Edge **Manifest V3** 的浏览器扩展。点击工具栏图标即可在一个 `800 × 600` 的弹窗中打开集成的渗透测试工具箱，涵盖信息收集、解码加密、Web 渗透、反弹 Shell、文件下载、C2、K8s、内网信息收集、内网横向移动、痕迹清理、应急响应等功能模块。

所有页面均为本地纯静态资源，**无需后端、无需联网、无构建步骤**，拷到任意机器加载即用。

---

## 功能模块

| 模块 | 说明 |
| --- | --- |
| 信息收集 | **随机信息生成**：姓名、手机号、身份证号、银行卡号、家庭住址、收货地址、公司名称、统一社会信用代码、文化程度、随机密码；**解码加密工具**：见下 |
| 解码加密 | 编解码：Plain / URL / HTML / Base64 / ASCII Hex / Hex / Octal / Binary / Gzip；加解密：AES / DES / SM2 / SM3 / SM4 / RC4 / RSA（支持 CBC / ECB / GCM / OAEP 模式与自定义 Key、IV） |
| Web 渗透 | **XSS Payload**：基础 / 高级 / 编码 / Unicode / 组合 / 绕 WAF；**SQL 注入 Payload**：基础判断 / 联合 / 报错（updatexml、BigInt 溢出、floor）/ 堆叠 / 盲注 / 布尔盲注 / 时间盲注；**文件读取**：Windows / Linux |
| 反弹 Shell | 一键生成反弹 Shell 命令：bash / nc / ncat / socat / perl / python / python3 / php / golang / vlang / awk / PowerShell，附图 OpenSSL 证书生成 |
| 文件下载 | HTTP / FTP / SMB 服务启动方式，以及 Windows（PowerShell IWR / IEX、Certutil、Bitsadmin、MSIExec、Odbcconf、CertReq、SMB、IPC$）与 Linux（wget、curl、python、whois）下载命令生成 |
| K8s | kubeconfig 配置应用，以及服务账户、Secrets、权限检查、Pod / 节点管理、资源查看、容器终端、命名空间与日志等常用命令 |
| C2 | **Silver**：服务端 / 客户端 / 监听器 / 木马生成 / 会话 / Beacon 操作；**MSFVenom**：多平台载荷生成 |
| 内网信息收集 | Linux / Windows 系统信息、用户与组、权限、环境变量、服务、网络、软件、文件查找、数据库等（覆盖工作组与域环境） |
| 内网横向移动 | **Impacket**（wmiexec / psexec / smbexec / atexec / dcomexec / secretsdump 等）、**CME**、**NXC** |
| 痕迹清理 | Linux：history、系统 / Web 日志清理、隐身登录、安全删除等；Windows：MSF 一键清理、事件日志 / IIS 日志 / RDP 记录清理、安全删除、日志伪造等 |
| 应急响应 | Linux / Windows 应急排查清单：分析原则、基础信息与时间基准、进程 / 端口 / 服务、用户 / 权限 / 登录、持久化、文件痕迹、日志分析、网络与 Rootkit 初筛、证据留存、常见场景 |

---

## 目录结构

```
ExquisiteHacker/
├── manifest.json      # 扩展清单（Manifest V3）
├── popup.html         # 弹窗主界面（各功能模块的页面结构）
├── styles.css         # 样式（含明 / 暗主题变量）
├── scripts.js         # 交互逻辑（命令生成、复制、主题切换等）
├── icon-16.png        # 扩展图标
├── icon-48.png
└── icon-128.png
```

---

## 安装与使用

1. 下载或克隆本仓库到本地。
2. 打开浏览器扩展管理页：Chrome 访问 `chrome://extensions`，Edge 访问 `edge://extensions`。
3. 打开右上角 **开发者模式**。
4. 点击 **加载已解压的扩展程序**，选择本项目根目录。
5. 点击工具栏中的扩展图标即可打开工具箱，点击界面右上角的 **🌙 切换主题** 可切换明 / 暗配色。

---

## 环境要求与技术栈

- 浏览器：Chrome / Edge 88+（支持 Manifest V3）
- 技术栈：原生 HTML + CSS + JavaScript，无任何第三方依赖、无构建流程
- 权限：仅声明 `activeTab`，不请求任何网络与主机权限

---

## 更新日志

- **v1.97**：新增「应急响应」模块（Linux / Windows 全套排查清单），修复若干 bug。
- **v1.96**：稳定版本基线。

> 注：`manifest.json` 中的 `version` 字段为 `1.96`。

---

## 免责声明

本项目仅供**授权的安全测试、网络安全教学与研究**使用。请勿将本工具用于任何未经授权的攻击、入侵或违法行为。使用者应遵守当地法律法规，并对自己的行为承担全部责任。作者不对任何滥用行为负责。

---

## 作者

by 24
