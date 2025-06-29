// 🔥 기가차드 윈도우 추적기 - 실시간 윈도우 변경 감지 및 세션 관리

import { Logger } from '../../shared/logger';
import { EventEmitter } from 'events';
import { BaseManager } from '../common/BaseManager';
import { activeWindow, openWindows, WindowInfo } from 'get-windows';
import { Result } from '../../shared/types';
import { Platform } from '../utils/platform';
import { getAppCategory, AppCategory, APP_CATEGORY_MAPPING } from './appCategories';

// 🔥 기가차드 타입 재export
export type { WindowInfo } from 'get-windows';

// #DEBUG: Window tracker entry point
Logger.debug('WINDOW_TRACKER', 'Window tracker module loaded');

// 🔥 기가차드 윈도우 변경 이벤트
export interface WindowChangeEvent {
  previous: WindowInfo | null;
  current: WindowInfo;
  timestamp: Date;
  changeType: 'focus-changed' | 'window-created' | 'window-closed' | 'title-changed';
}

// 🔥 기가차드 윈도우 추적 상태
export interface WindowTrackerState {
  isTracking: boolean;
  currentWindow: WindowInfo | null;
  previousWindow: WindowInfo | null;
  windowChangeCount: number;
  trackingStartTime: Date | null;
  lastChangeTime: Date | null;
}

// 🔥 기가차드 윈도우 추적 설정
export interface WindowTrackerConfig {
  trackingInterval: number; // ms
  enableMemoryTracking: boolean;
  enableTitleTracking: boolean;
  maxHistorySize: number;
  appCategoryMapping: Record<string, string>;
}

/**
 * 🔥 WindowTracker - 완벽한 윈도우 추적 시스템
 * 실시간 윈도우 변경 감지, 앱별 세션 관리, 타이핑 컨텍스트 제공
 */
export class WindowTracker extends BaseManager {
  private readonly componentName = 'WINDOW_TRACKER';
  private trackerState: WindowTrackerState;
  private trackerConfig: WindowTrackerConfig;
  private trackingInterval: NodeJS.Timeout | null = null;
  private windowHistory: WindowInfo[] = [];
  private hasAccessibilityPermission = false; // 🔥 권한 상태 추적

  // 🔥 앱 카테고리 매핑 (Loop 특화) - 중복 제거 및 확장된 버전
  private readonly appCategories: Record<string, string> = {
    // Development Tools
    'Visual Studio Code': 'development',
    'Code': 'development',
    'Xcode': 'development',
    'IntelliJ IDEA': 'development',
    'WebStorm': 'development',
    'PyCharm': 'development',
    'PhpStorm': 'development',
    'GoLand': 'development',
    'CLion': 'development',
    'Rider': 'development',
    'Android Studio': 'development',
    'Sublime Text': 'development',
    'Atom': 'development',
    'Vim': 'development',
    'Emacs': 'development',
    'Nova': 'development',
    'CodeRunner': 'development',
    'Dash': 'development',
    'DevDocs': 'development',
    
    // Terminal & Command Line
    'Terminal': 'development',
    'iTerm2': 'development',
    'iTerm': 'development',
    'Hyper': 'development',
    'Warp': 'development',
    'Alacritty': 'development',
    'Kitty': 'development',
    'WezTerm': 'development',
    
    // Version Control & Git
    'GitHub Desktop': 'development',
    'SourceTree': 'development',
    'Fork': 'development',
    'Tower': 'development',
    'GitKraken': 'development',
    'GitUp': 'development',
    'Kaleidoscope': 'development',
    
    // API & Database Tools
    'Postman': 'development',
    'Insomnia': 'development',
    'Paw': 'development',
    'RapidAPI': 'development',
    'Hoppscotch': 'development',
    'Docker Desktop': 'development',
    'Sequel Pro': 'development',
    'TablePlus': 'development',
    'DataGrip': 'development',
    'Navicat': 'development',
    'MongoDB Compass': 'development',
    'DBeaver': 'development',
    'Prisma Studio': 'development',
    
    // Browsers (Comprehensive Cross-Platform Collection)
    'Safari': 'browser',
    'Google Chrome': 'browser',
    'Chrome': 'browser',
    'Firefox': 'browser',
    'Mozilla Firefox': 'browser',
    'Microsoft Edge': 'browser',
    'Edge': 'browser',
    'Arc': 'browser',
    'Brave Browser': 'browser',
    'Brave': 'browser',
    'Opera': 'browser',
    'Opera GX': 'browser',
    'Vivaldi': 'browser',
    'DuckDuckGo': 'browser',
    'Tor Browser': 'browser',
    'Chromium': 'browser',
    'SigmaOS': 'browser',
    'Orion': 'browser',
    'Min': 'browser',
    'Webkit': 'browser',
    'Sidekick': 'browser',
    'Wavebox': 'browser',
    'Station': 'browser',
    
    // 🔥 NEW: Zen Browser & Advanced Browsers
    'Zen Browser': 'browser',
    'Zen': 'browser',
    'Waterfox': 'browser',
    'Pale Moon': 'browser',
    'Basilisk': 'browser',
    'Seamonkey': 'browser',
    'Midori': 'browser',
    'Epiphany': 'browser',
    'GNOME Web': 'browser',
    'Konqueror': 'browser',
    'Falkon': 'browser',
    'QupZilla': 'browser',
    'Maxthon': 'browser',
    'UC Browser': 'browser',
    'Yandex Browser': 'browser',
    'Naver Whale': 'browser',
    'Whale': 'browser',
    'Samsung Internet': 'browser',
    'Sleipnir': 'browser',
    'Lunascape': 'browser',
    'Comodo Dragon': 'browser',
    'SRWare Iron': 'browser',
    'Ungoogled Chromium': 'browser',
    'LibreWolf': 'browser',
    'IceCat': 'browser',
    'Iceape': 'browser',
    'Surf': 'browser',
    'Lynx': 'browser',
    'Links': 'browser',
    'w3m': 'browser',
    'Elinks': 'browser',
    
    // 🔥 Cross-Platform Windows Apps
    'Notepad++': 'development',
    'Visual Studio': 'development',
    'Code - OSS': 'development',
    'DevC++': 'development',
    'Code::Blocks': 'development',
    'Eclipse': 'development',
    'NetBeans': 'development',
    'Brackets': 'development',
    'Zed': 'development',
    'Neovim': 'development',
    'GNU Emacs': 'development',
    'Kate': 'development',
    'Gedit': 'development',
    'Nano': 'development',
    'Micro': 'development',
    'Helix': 'development',
    
    // 🔥 Windows Specific Applications
    'Notepad': 'system',
    'WordPad': 'office',
    'Paint': 'design',
    'Paint 3D': 'design',
    'Snipping Tool': 'system',
    'Windows Media Player': 'entertainment',
    'Windows Defender': 'security',
    'Windows Security': 'security',
    'Task Manager': 'system',
    'Control Panel': 'system',
    'Settings': 'system',
    'Registry Editor': 'system',
    'Command Prompt': 'development',
    'PowerShell': 'development',
    'Windows Terminal': 'development',
    'PowerShell ISE': 'development',
    'Windows Subsystem for Linux': 'development',
    'WSL': 'development',
    'Windows Update': 'system',
    'Device Manager': 'system',
    'Event Viewer': 'system',
    'Performance Monitor': 'system',
    'Resource Monitor': 'system',
    'Disk Management': 'system',
    'Services': 'system',
    'Computer Management': 'system',
    'Group Policy Editor': 'system',
    'Local Security Policy': 'system',
    'Windows Firewall': 'security',
    'Internet Explorer': 'browser',
    'Microsoft Store': 'system',
    'Xbox': 'entertainment',
    'Xbox Game Bar': 'entertainment',
    'Microsoft To Do': 'project-management',
    
    // 🔥 Linux Specific Applications
    'Nautilus': 'system',
    'Dolphin': 'system',
    'Thunar': 'system',
    'PCManFM': 'system',
    'Ranger': 'system',
    'Midnight Commander': 'system',
    'GNOME Terminal': 'development',
    'Konsole': 'development',
    'Terminator': 'development',
    'Tilix': 'development',
    'Guake': 'development',
    'Yakuake': 'development',
    'GNOME System Monitor': 'system',
    'KSysGuard': 'system',
    'htop': 'system',
    'Synaptic': 'system',
    'Software Center': 'system',
    'YaST': 'system',
    'Gparted': 'system',
    'KDE Partition Manager': 'system',
    'GNOME Disks': 'system',
    'Baobab': 'system',
    'KDirStat': 'system',
    'GNOME System Settings': 'system',
    'KDE System Settings': 'system',
    'dconf Editor': 'system',
    'Ubuntu Software': 'system',
    'Pop!_Shop': 'system',
    'pamac': 'system',
    'Octopi': 'system',
    'APT': 'system',
    'YUM': 'system',
    'DNF': 'system',
    'Pacman': 'system',
    'Flatpak': 'system',
    'Snap Store': 'system',
    'AppImage': 'system',
    
    // 🔥 Cross-Platform Productivity Apps
    'WPS Office': 'office',
    'FreeOffice': 'office',
    'SoftMaker Office': 'office',
    'Calligra Suite': 'office',
    'Apache OpenOffice': 'office',
    'KOffice': 'office',
    'OnlyOffice Desktop': 'office',
    'Zoho Writer': 'office',
    'Zoho Sheet': 'office',
    'Zoho Show': 'office',
    'Google Workspace': 'office',
    'Simplenote': 'productivity',
    'Standard Notes': 'productivity',
    'Joplin': 'productivity',
    'QOwnNotes': 'productivity',
    'CherryTree': 'productivity',
    'Zim': 'productivity',
    'TiddlyWiki': 'productivity',
    'VNote': 'productivity',
    'Zettlr': 'productivity',
    'BoostNote': 'productivity',
    'Trilium': 'productivity',
    'Dendron': 'productivity',
    'Foam': 'productivity',
    'Athens': 'productivity',
    'RemNote': 'productivity',
    'Roam Research': 'productivity',
    'LogSeq': 'productivity',
    'Amplenote': 'productivity',
    'Dynalist': 'productivity',
    'Checkvist': 'productivity',
    'WorkFlowy': 'productivity',
    
    // 🔥 Cross-Platform Design & Creative
    'Krita': 'design',
    'MyPaint': 'design',
    'Pinta': 'design',
    'KolourPaint': 'design',
    'mtPaint': 'design',
    'XPaint': 'design',
    'GNU Paint': 'design',
    'Tux Paint': 'design',
    'DrawPile': 'design',
    'Pencil2D': 'design',
    'OpenToonz': 'design',
    'Synfig Studio': 'design',
    'TupiTube': 'design',
    'Storyboarder': 'design',
    'DaVinci Resolve': 'media-production',
    'Kdenlive': 'media-production',
    'OpenShot': 'media-production',
    'Shotcut': 'media-production',
    'Flowblade': 'media-production',
    'Pitivi': 'media-production',
    'Lightworks': 'media-production',
    'Olive': 'media-production',
    'VidCutter': 'media-production',
    'Avidemux': 'media-production',
    'FFmpeg': 'media-production',
    'MKVToolNix': 'media-production',
    'MediaInfo': 'media-production',
    'VLC Media Player': 'entertainment',
    'MPV': 'entertainment',
    'SMPlayer': 'entertainment',
    'MPlayer': 'entertainment',
    'Kodi': 'entertainment',
    'Jellyfin': 'entertainment',
    'Emby': 'entertainment',
    'Universal Media Server': 'entertainment',
    'Serviio': 'entertainment',
    
    // 🔥 Cross-Platform Communication & Social
    'Hexchat': 'communication',
    'WeeChat': 'communication',
    'Irssi': 'communication',
    'Quassel': 'communication',
    'KVIrc': 'communication',
    'Pidgin': 'communication',
    'Kopete': 'communication',
    'Empathy': 'communication',
    'Gajim': 'communication',
    'Psi': 'communication',
    'Jitsi': 'communication',
    'Jami': 'communication',
    'Ring': 'communication',
    'Linphone': 'communication',
    'Ekiga': 'communication',
    'Mumble': 'communication',
    'TeamSpeak': 'communication',
    'Ventrilo': 'communication',
    'Discord PTB': 'communication',
    'Discord Canary': 'communication',
    'BetterDiscord': 'communication',
    'Guilded': 'communication',
    'Revolt': 'communication',
    'Matrix': 'communication',
    'Element Desktop': 'communication',
    'Riot': 'communication',
    'FluffyChat': 'communication',
    'Quaternion': 'communication',
    'Spectral': 'communication',
    'nheko': 'communication',
    
    // 🔥 Cross-Platform Development Tools (Extended)
    'Zsh': 'development',
    'Fish': 'development',
    'Bash': 'development',
    'PowerShell Core': 'development',
    'Oh My Zsh': 'development',
    'Starship': 'development',
    'tmux': 'development',
    'screen': 'development',
    'Guake Terminal': 'development',
    'Tilda': 'development',
    'Terminology': 'development',
    'LXTerminal': 'development',
    'XTerm': 'development',
    'URxvt': 'development',
    'st': 'development',
    'Sakura': 'development',
    'ROXTerm': 'development',
    'Cool Retro Term': 'development',
    'Termite': 'development',
    'GitLab Desktop': 'development',
    'GitExtensions': 'development',
    'TortoiseGit': 'development',
    'SmartGit': 'development',
    'Ungit': 'development',
    'GitAhead': 'development',
    'RepoZ': 'development',
    'git-cola': 'development',
    'gitg': 'development',
    'QGit': 'development',
    'Giggle': 'development',
    'gitk': 'development',
    'Tig': 'development',
    'LazyGit': 'development',
    
    // 🔥 Cross-Platform System Utilities
    'BleachBit': 'system',
    'Stacer': 'system',
    'Ubuntu Cleaner': 'system',
    'Sweeper': 'system',
    'GtkOrphan': 'system',
    'Deborphan': 'system',
    'LocalePurge': 'system',
    'Computer Janitor': 'system',
    'System Monitor': 'system',
    'Process Explorer': 'system',
    'Process Hacker': 'system',
    'CPU-Z': 'system',
    'GPU-Z': 'system',
    'HWiNFO': 'system',
    'Speccy': 'system',
    'AIDA64': 'system',
    'SIW': 'system',
    'MSI Afterburner': 'system',
    'GPU Tweak': 'system',
    'ThrottleStop': 'system',
    'Core Temp': 'system',
    'HWMonitor': 'system',
    'Open Hardware Monitor': 'system',
    'Speedfan': 'system',
    'FurMark': 'system',
    'Prime95': 'system',
    'MemTest86': 'system',
    'CrystalDiskInfo': 'system',
    'CrystalDiskMark': 'system',
    'HD Tune': 'system',
    'SSD-Z': 'system',
    'ATTO Disk Benchmark': 'system',
    
    // 🔥 Windows Game Launchers & Gaming
    'Steam Client': 'entertainment',
    'Epic Games Store': 'entertainment',
    'Ubisoft Connect': 'entertainment',
    'EA Desktop': 'entertainment',
    'Origin Client': 'entertainment',
    'GOG Galaxy 2.0': 'entertainment',
    'Battle.net Desktop App': 'entertainment',
    'Blizzard Battle.net': 'entertainment',
    'Bethesda Launcher': 'entertainment',
    'Rockstar Games Launcher': 'entertainment',
    'itch.io': 'entertainment',
    'Discord Rich Presence': 'entertainment',
    'OBS Studio': 'media-production',
    'Streamlabs OBS': 'media-production',
    'XSplit': 'media-production',
    'Bandicam': 'media-production',
    'FRAPS': 'media-production',
    'RivaTuner': 'entertainment',
    'GeForce Experience': 'entertainment',
    'Radeon Software': 'entertainment',
    'Intel Graphics Control Panel': 'entertainment',
    
    // 🔥 Linux Gaming & Entertainment
    'Lutris': 'entertainment',
    'PlayOnLinux': 'entertainment',
    'Wine': 'entertainment',
    'Bottles': 'entertainment',
    'GameHub': 'entertainment',
    'GNOME Games': 'entertainment',
    'Itch': 'entertainment',
    'Minigalaxy': 'entertainment',
    'Heroic Games Launcher': 'entertainment',
    'Legendary': 'entertainment',
    'Rare': 'entertainment',
    'GameMode': 'entertainment',
    'MangoHud': 'entertainment',
    'GOverlay': 'entertainment',
    'CoreCtrl': 'entertainment',
    'GreenWithEnvy': 'entertainment',
    
    // 🔥 Cross-Platform AI & ML Tools
    'Anaconda Navigator': 'ai-assistant',
    'Jupyter Notebook': 'ai-assistant',
    'JupyterLab': 'ai-assistant',
    'Spyder': 'ai-assistant',
    'Orange': 'ai-assistant',
    'KNIME': 'ai-assistant',
    'RapidMiner': 'ai-assistant',
    'Weka': 'ai-assistant',
    'R Studio': 'ai-assistant',
    'R': 'ai-assistant',
    'Octave': 'ai-assistant',
    'GNU Octave': 'ai-assistant',
    'Scilab': 'ai-assistant',
    'Maxima': 'ai-assistant',
    'SageMath': 'ai-assistant',
    'Mathematica': 'ai-assistant',
    'Wolfram Mathematica': 'ai-assistant',
    'MATLAB': 'ai-assistant',
    'LabVIEW': 'ai-assistant',
    'Simulink': 'ai-assistant',
    'TensorFlow': 'ai-assistant',
    'PyTorch': 'ai-assistant',
    'Keras': 'ai-assistant',
    'Hugging Face': 'ai-assistant',
    'OpenAI Playground': 'ai-assistant',
    'Anthropic Console': 'ai-assistant',
    'Google Colab': 'ai-assistant',
    'Kaggle': 'ai-assistant',
    'Papers with Code': 'ai-assistant',
    'Weights & Biases': 'ai-assistant',
    'MLflow': 'ai-assistant',
    'ClearML': 'ai-assistant',
    'Neptune': 'ai-assistant',
    'Comet': 'ai-assistant',
    
    // 🔥 Cross-Platform Virtualization & Containers
    'Podman Desktop': 'development',
    'VirtualBox Manager': 'development',
    'VMware Workstation': 'development',
    'VMware Player': 'development',
    'GNOME Boxes': 'development',
    'virt-manager': 'development',
    'QEMU': 'development',
    'KVM': 'development',
    'Xen': 'development',
    'Vagrant': 'development',
    'Multipass': 'development',
    'Lima': 'development',
    'Rancher Desktop': 'development',
    'Kubernetes Dashboard': 'development',
    'Portainer': 'development',
    'Lens': 'development',
    'OpenShift': 'development',
    'Minikube': 'development',
    'k3s': 'development',
    'kind': 'development',
    'ctop': 'development',
    'lazydocker': 'development',
    'Dive': 'development',
    
    // 🔥 Cross-Platform Network & Security Tools
    'Wireshark': 'development',
    'tcpdump': 'development',
    'nmap': 'development',
    'Zenmap': 'development',
    'Angry IP Scanner': 'development',
    'Advanced IP Scanner': 'development',
    'Fing': 'development',
    'Lansweeper': 'development',
    'Network Scanner': 'development',
    'WiFi Analyzer': 'development',
    'WiFi Explorer': 'development',
    'NetSpot': 'development',
    'Metasploit': 'security',
    'Burp Suite': 'security',
    'OWASP ZAP': 'security',
    'Nessus': 'security',
    'OpenVAS': 'security',
    'Nikto': 'security',
    'Sqlmap': 'security',
    'John the Ripper': 'security',
    'Hashcat': 'security',
    'Aircrack-ng': 'security',
    'Kismet': 'security',
    'Ettercap': 'security',
    'Hydra': 'security',
    'THC Hydra': 'security',
    'Maltego': 'security',
    'Shodan': 'security',
    'Masscan': 'security',
    'Zmap': 'security',
    'Nuclei': 'security',
    'Subfinder': 'security',
    'Amass': 'security',
    'Gobuster': 'security',
    'dirb': 'security',
    'DirBuster': 'security',
    'ffuf': 'security',
    'wfuzz': 'security',
    
    // Office & Documents
    'Microsoft Word': 'office',
    'Microsoft Excel': 'office',
    'Microsoft PowerPoint': 'office',
    'Microsoft Outlook': 'office',
    'Pages': 'office',
    'Numbers': 'office',
    'Keynote': 'office',
    'LibreOffice': 'office',
    'OpenOffice': 'office',
    'Google Docs': 'office',
    'Google Sheets': 'office',
    'Google Slides': 'office',
    'OnlyOffice': 'office',
    
    // Productivity & Note-taking
    'Notion': 'productivity',
    'Obsidian': 'productivity',
    'Logseq': 'productivity',
    'Bear': 'productivity',
    'Ulysses': 'productivity',
    'Typora': 'productivity',
    'MarkText': 'productivity',
    'Craft': 'productivity',
    'Day One': 'productivity',
    'GoodNotes 5': 'productivity',
    'GoodNotes 6': 'productivity',
    'Notability': 'productivity',
    'MarginNote 3': 'productivity',
    'Remnote': 'productivity',
    'Anki': 'productivity',
    'MindMeister': 'productivity',
    'XMind': 'productivity',
    'SimpleMind': 'productivity',
    'Mindjet MindManager': 'productivity',
    
    // PDF & Document Viewers
    'PDF Expert': 'productivity',
    'Preview': 'productivity',
    'Skim': 'productivity',
    'Adobe Acrobat Reader': 'productivity',
    'Adobe Acrobat Pro': 'productivity',
    'PDFpen': 'productivity',
    'PDF Squeezer': 'productivity',
    'Foxit Reader': 'productivity',
    
    // Communication & Social
    'Slack': 'communication',
    'Discord': 'communication',
    'Microsoft Teams': 'communication',
    'Zoom': 'communication',
    'Skype': 'communication',
    'FaceTime': 'communication',
    'Mail': 'communication',
    'Messages': 'communication',
    'Telegram': 'communication',
    'WhatsApp': 'communication',
    'Signal': 'communication',
    'Element': 'communication',
    'Mattermost': 'communication',
    'Rocket.Chat': 'communication',
    'Thunderbird': 'communication',
    'Airmail': 'communication',
    'Spark': 'communication',
    'Canary Mail': 'communication',
    'Newton Mail': 'communication',
    'Polymail': 'communication',
    'Franz': 'communication',
    'Rambox': 'communication',
    'All-in-One Messenger': 'communication',
    
    // AI Assistants & Tools
    'Claude': 'ai-assistant',
    'ChatGPT': 'ai-assistant',
    'Poe': 'ai-assistant',
    'Raycast': 'ai-assistant',
    'Alfred': 'ai-assistant',
    'Siri': 'ai-assistant',
    'Copilot': 'ai-assistant',
    'GitHub Copilot': 'ai-assistant',
    'Cursor': 'ai-assistant',
    'Continue': 'ai-assistant',
    'Codeium': 'ai-assistant',
    'Tabnine': 'ai-assistant',
    'Bard': 'ai-assistant',
    'Perplexity': 'ai-assistant',
    'Character.AI': 'ai-assistant',
    'Jasper': 'ai-assistant',
    'Copy.ai': 'ai-assistant',
    'Writesonic': 'ai-assistant',
    'Grammarly': 'ai-assistant',
    'DeepL': 'ai-assistant',
    'Otter.ai': 'ai-assistant',
    'Fireflies.ai': 'ai-assistant',
    'Loom': 'ai-assistant',
    
    // Design & Creative
    'Adobe Photoshop': 'design',
    'Adobe Illustrator': 'design',
    'Adobe InDesign': 'design',
    'Adobe XD': 'design',
    'Adobe After Effects': 'design',
    'Adobe Premiere Pro': 'design',
    'Adobe Lightroom': 'design',
    'Adobe Audition': 'design',
    'Adobe Animate': 'design',
    'Adobe Dimension': 'design',
    'Figma': 'design',
    'Sketch': 'design',
    'Canva': 'design',
    'Affinity Designer': 'design',
    'Affinity Photo': 'design',
    'Affinity Publisher': 'design',
    'Pixelmator Pro': 'design',
    'GIMP': 'design',
    'Inkscape': 'design',
    'Blender': 'design',
    'Cinema 4D': 'design',
    'Maya': 'design',
    '3ds Max': 'design',
    'SketchUp': 'design',
    'Fusion 360': 'design',
    'Rhino': 'design',
    'KeyShot': 'design',
    'Principle': 'design',
    'Framer': 'design',
    'ProtoPie': 'design',
    'InVision': 'design',
    'Marvel': 'design',
    'Zeplin': 'design',
    'Abstract': 'design',
    
    // Video & Audio Production
    'Final Cut Pro': 'media-production',
    'Logic Pro': 'media-production',
    'Ableton Live': 'media-production',
    'Pro Tools': 'media-production',
    'Compressor': 'media-production',
    'Motion': 'media-production',
    'MainStage': 'media-production',
    'GarageBand': 'media-production',
    'Audacity': 'media-production',
    'Screenflow': 'media-production',
    'Camtasia': 'media-production',
    'QuickTime Player': 'media-production',
    'HandBrake': 'media-production',
    'FCPX': 'media-production',
    'Premiere Pro': 'media-production',
    'Cubase': 'media-production',
    'Reaper': 'media-production',
    'Studio One': 'media-production',
    
    // Entertainment & Media
    'YouTube Music': 'entertainment',
    'Spotify': 'entertainment',
    'Apple Music': 'entertainment',
    'iTunes': 'entertainment',
    'Music': 'entertainment',
    'VLC': 'entertainment',
    'IINA': 'entertainment',
    'Plex': 'entertainment',
    'Netflix': 'entertainment',
    'Disney+': 'entertainment',
    'Amazon Prime Video': 'entertainment',
    'Hulu': 'entertainment',
    'HBO Max': 'entertainment',
    'YouTube': 'entertainment',
    'Twitch': 'entertainment',
    'Steam': 'entertainment',
    'Epic Games Launcher': 'entertainment',
    'Battle.net': 'entertainment',
    'Origin': 'entertainment',
    'GOG Galaxy': 'entertainment',
    'PlayStation': 'entertainment',
    'Parallels Desktop': 'entertainment',
    'VMware Fusion': 'entertainment',
    'VirtualBox': 'entertainment',
    
    // System & Utilities
    'Finder': 'system',
    'System Preferences': 'system',
    'System Settings': 'system',
    'Activity Monitor': 'system',
    'Console': 'system',
    'Disk Utility': 'system',
    'Archive Utility': 'system',
    'Automator': 'system',
    'Script Editor': 'system',
    'Migration Assistant': 'system',
    'Boot Camp Assistant': 'system',
    'Keychain Access': 'system',
    'Digital Color Meter': 'system',
    'Grapher': 'system',
    'Calculator': 'system',
    'Calendar': 'system',
    'Contacts': 'system',
    'Reminders': 'system',
    'Notes': 'system',
    'Clock mini': 'system',
    'Menu Weather Pro': 'system',
    'iStat Menus': 'system',
    'CleanMyMac X': 'system',
    'The Unarchiver': 'system',
    'Keka': 'system',
    'BetterZip': 'system',
    'AppCleaner': 'system',
    'Trash It!': 'system',
    'Network Radar': 'system',
    'SSH Files': 'system',
    'Termius': 'system',
    'Remote Desktop': 'system',
    'VNC Viewer': 'system',
    'TeamViewer': 'system',
    'AnyDesk': 'system',
    'Chrome Remote Desktop': 'system',
    
    // Project Management & Business
    'Asana': 'project-management',
    'Trello': 'project-management',
    'Monday.com': 'project-management',
    'Jira': 'project-management',
    'Linear': 'project-management',
    'ClickUp': 'project-management',
    'Basecamp': 'project-management',
    'Airtable': 'project-management',
    'Coda': 'project-management',
    'Smartsheet': 'project-management',
    'Confluence': 'project-management',
    'Clubhouse': 'project-management',
    'Height': 'project-management',
    'Monday': 'project-management',
    'Teamwork': 'project-management',
    'Wrike': 'project-management',
    'Workflowy': 'project-management',
    'Todoist': 'project-management',
    'Things 3': 'project-management',
    'OmniFocus': 'project-management',
    '2Do': 'project-management',
    'Any.do': 'project-management',
    'TickTick': 'project-management',
    'Fantastical': 'project-management',
    'Calendly': 'project-management',
    'Acuity Scheduling': 'project-management',
    
    // Finance & Business
    'QuickBooks': 'finance',
    'Xero': 'finance',
    'YNAB': 'finance',
    'Mint': 'finance',
    'MoneyMoney': 'finance',
    'Banktivity': 'finance',
    'Stock Market - Rates Tracker': 'finance',
    'Robinhood': 'finance',
    'TD Ameritrade': 'finance',
    'E*TRADE': 'finance',
    'Charles Schwab': 'finance',
    'Fidelity': 'finance',
    'Interactive Brokers': 'finance',
    'TradingView': 'finance',
    'Yahoo Finance': 'finance',
    'Bloomberg Terminal': 'finance',
    'CoinTracker': 'finance',
    'Coinbase': 'finance',
    'Binance': 'finance',
    'Kraken': 'finance',
    'Crypto.com': 'finance',
    'Gemini': 'finance',
    
    // File Management & Cloud Storage
    'Dropbox': 'cloud-storage',
    'Google Drive': 'cloud-storage',
    'OneDrive': 'cloud-storage',
    'iCloud': 'cloud-storage',
    'Box': 'cloud-storage',
    'pCloud': 'cloud-storage',
    'Sync.com': 'cloud-storage',
    'MEGA': 'cloud-storage',
    'Amazon Drive': 'cloud-storage',
    'SpiderOak': 'cloud-storage',
    'Tresorit': 'cloud-storage',
    'Nextcloud': 'cloud-storage',
    'ownCloud': 'cloud-storage',
    'FileZilla': 'file-management',
    'Cyberduck': 'file-management',
    'Transmit': 'file-management',
    'Commander One': 'file-management',
    'Path Finder': 'file-management',
    'ForkLift': 'file-management',
    'Yoink': 'file-management',
    'HacKit': 'file-management',
    'Archiver 4': 'file-management',
    'Simon': 'file-management',
    
    // Security & Privacy
    '1Password': 'security',
    'Bitwarden': 'security',
    'LastPass': 'security',
    'Dashlane': 'security',
    'KeePassXC': 'security',
    'Elpass': 'security',
    'Enpass': 'security',
    'Keeper': 'security',
    'RoboForm': 'security',
    'Little Snitch': 'security',
    'Lulu': 'security',
    'Radio Silence': 'security',
    'Hands Off!': 'security',
    'Malwarebytes': 'security',
    'ExpressVPN': 'security',
    'NordVPN': 'security',
    'Surfshark': 'security',
    'ProtonVPN': 'security',
    'CyberGhost': 'security',
    'IPVanish': 'security',
    'Private Internet Access': 'security',
    'Windscribe': 'security',
    'Tunnelblick': 'security',
    'Viscosity': 'security',
    'OpenVPN Connect': 'security',
    'WireGuard': 'security',
    'Tailscale': 'security',
    'ZeroTier One': 'security',
    'ClamXAV': 'security',
    'BlockBlock': 'security',
    'RansomWhere?': 'security',
    'KnockKnock': 'security',
    'OverSight': 'security',
    'Micro Snitch': 'security',
    
    // E-commerce & Marketing
    'Shopify': 'e-commerce',
    'WooCommerce': 'e-commerce',
    'BigCommerce': 'e-commerce',
    'Magento': 'e-commerce',
    'PrestaShop': 'e-commerce',
    'Squarespace': 'e-commerce',
    'Wix': 'e-commerce',
    'Webflow': 'e-commerce',
    'Mailchimp': 'marketing',
    'ConvertKit': 'marketing',
    'Klaviyo': 'marketing',
    'ActiveCampaign': 'marketing',
    'GetResponse': 'marketing',
    'AWeber': 'marketing',
    'Constant Contact': 'marketing',
    'HubSpot': 'marketing',
    'Salesforce': 'marketing',
    'Pipedrive': 'marketing',
    'Zoho CRM': 'marketing',
    'Freshworks': 'marketing',
    'Intercom': 'marketing',
    'Zendesk': 'marketing',
    'Helpdesk': 'marketing',
    'LiveChat': 'marketing',
    'Drift': 'marketing',
    'Crisp': 'marketing',
    'Tawk.to': 'marketing',
    
    // Developer Tools & Services
    'Electron': 'development',
    'nvm': 'development',
    'rbenv': 'development',
    'pyenv': 'development',
    'CocoaPods': 'development',
    'Carthage': 'development',
    'Swift Package Manager': 'development',
    'Xcode Simulator': 'development',
    'iOS Simulator': 'development',
    'Simulator': 'development',
    'Instruments': 'development',
    'Accessibility Inspector': 'development',
    'Network Link Conditioner': 'development',
    'RCT Metro': 'development',
    'React Native Debugger': 'development',
    'Flipper': 'development',
    'Reactotron': 'development',
    'Redux DevTools': 'development',
    'Vue DevTools': 'development',
    'Angular DevTools': 'development',
    'Chrome DevTools': 'development',
    'Firefox Developer Tools': 'development',
    'Safari Web Inspector': 'development',
    'WebKit': 'development',
    'ngrok': 'development',
    'Localtunnel': 'development',
    'Serveo': 'development',
    'Charles Proxy': 'development',
    'Network Analyzer': 'development',
    'SSH Tunnel Manager': 'development',
    'Core Data Lab': 'development',
    'SQLiteDirector': 'development',
    'Base': 'development',
    'Lexi - JSON browser': 'development',
    'JSON Editor': 'development',
    'Plist Editor': 'development',
    'Property List Editor': 'development',
    'IconJar': 'development',
    'SF Symbols': 'development',
    'Apple Configurator 2': 'development',
    'TestFlight': 'development',
    'App Store Connect': 'development',
    'Transporter': 'development',
    'Apple Developer': 'development',
    'WWDC for macOS': 'development',
    'Conferences': 'development',
  };

  constructor(config: Partial<WindowTrackerConfig> = {}, hasAccessibilityPermission = false) {
    super({
      name: 'WindowTracker',
      autoStart: false,
      retryOnError: true,
      maxRetries: 3,
      retryDelay: 1000,
    });

    this.hasAccessibilityPermission = hasAccessibilityPermission;

    this.trackerConfig = {
      trackingInterval: 500, // 0.5초마다 체크
      enableMemoryTracking: true,
      enableTitleTracking: true,
      maxHistorySize: 100,
      appCategoryMapping: this.appCategories,
      ...config,
    };

    this.trackerState = {
      isTracking: false,
      currentWindow: null,
      previousWindow: null,
      windowChangeCount: 0,
      trackingStartTime: null,
      lastChangeTime: null,
    };

    Logger.info(this.componentName, 'Window tracker instance created', {
      hasAccessibilityPermission: this.hasAccessibilityPermission
    });
  }

  /**
   * 🔥 접근성 권한 상태 설정
   */
  public setAccessibilityPermission(hasPermission: boolean): void {
    const wasChanged = this.hasAccessibilityPermission !== hasPermission;
    this.hasAccessibilityPermission = hasPermission;
    
    if (wasChanged) {
      Logger.info(this.componentName, '🔐 접근성 권한 상태 변경됨', { 
        hasPermission,
        canUseGetWindows: hasPermission 
      });
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      // 초기 활성 윈도우 감지
      const activeWindow = await this.getCurrentActiveWindow();
      if (activeWindow) {
        this.trackerState.currentWindow = this.enhanceWindowInfo(activeWindow);
        Logger.info(this.componentName, 'Initial active window detected', {
          title: activeWindow.title,
          app: activeWindow.owner.name,
        });
      }

      Logger.info(this.componentName, 'Window tracker initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize window tracker', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      // 추적 시작
      this.trackingInterval = setInterval(async () => {
        await this.checkWindowChange();
      }, this.trackerConfig.trackingInterval);

      this.trackerState.isTracking = true;
      this.trackerState.trackingStartTime = new Date();

      this.emit('tracking-started');
      Logger.info(this.componentName, 'Window tracking started', {
        interval: this.trackerConfig.trackingInterval,
      });
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start window tracking', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      if (this.trackingInterval) {
        clearInterval(this.trackingInterval);
        this.trackingInterval = null;
      }

      this.trackerState.isTracking = false;
      this.trackerState.trackingStartTime = null;

      this.emit('tracking-stopped');
      Logger.info(this.componentName, 'Window tracking stopped');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop window tracking', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    try {
      await this.doStop();
      
      this.trackerState.currentWindow = null;
      this.trackerState.previousWindow = null;
      this.trackerState.windowChangeCount = 0;
      this.trackerState.lastChangeTime = null;
      this.windowHistory = [];

      Logger.info(this.componentName, 'Window tracker cleanup completed');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to cleanup window tracker', err);
      throw err;
    }
  }

  /**
   * 현재 활성 윈도우 가져오기 (권한 기반)
   */
  private async getCurrentActiveWindow(): Promise<WindowInfo | null> {
    try {
      // 🔥 접근성 권한이 없으면 대체 방법 사용
      if (!this.hasAccessibilityPermission) {
        Logger.debug(this.componentName, '⚠️ 접근성 권한이 없음 - 대체 방법 사용');
        return this.fallbackWindowDetection();
      }
      
      // 🔥 접근성 권한이 있으면 더 정확한 정보 가져오기
      let activeWindowFunc;
      
      try {
        // 동적 import로 get-windows 모듈 로드
        const getWindowsModule = await import('get-windows');
        
        // 🔥 정확한 export 이름 사용: activeWindow
        activeWindowFunc = getWindowsModule.activeWindow;
                             
        if (typeof activeWindowFunc !== 'function') {
          throw new Error('activeWindow function not found in get-windows module');
        }
        
      } catch (moduleError) {
        Logger.warn(this.componentName, '⚠️ get-windows 모듈 로드 실패 - 대체 방법 사용:', moduleError);
        return this.fallbackWindowDetection();
      }

      // 🔥 get-windows v9.2.0에서는 옵션 없이 호출 (권한 있을 때만)
      const activeWindowResult = await activeWindowFunc();

      // 🔥 윈도우 정보 유효성 검증 및 보완
      if (activeWindowResult) {
        return this.validateAndEnhanceWindowInfo(activeWindowResult);
      }

      return null;
      
    } catch (error) {
      Logger.warn(this.componentName, '⚠️ 활성 윈도우 가져오기 실패 - 대체 방법 시도:', error);
      
      // 🔥 대체 방법 시도 (항상 안전)
      return this.fallbackWindowDetection();
    }
  }

  /**
   * 윈도우 정보 유효성 검증 및 보완
   */
  private validateAndEnhanceWindowInfo(windowInfo: WindowInfo): WindowInfo | null {
    try {
      // 🔥 기본 필드 검증
      if (!windowInfo) {
        Logger.debug(this.componentName, '⚠️ 윈도우 정보가 null/undefined');
        return null;
      }

      // 🔥 owner 정보 검증 및 보완
      if (!windowInfo.owner) {
        Logger.debug(this.componentName, '⚠️ owner 정보 없음 - 기본값으로 보완');
        windowInfo.owner = {
          name: 'Unknown App',
          processId: 0
        };
      }

      // 🔥 owner.name 검증 및 보완
      if (!windowInfo.owner.name || windowInfo.owner.name.trim() === '') {
        Logger.debug(this.componentName, '⚠️ owner.name 없음 - 기본값으로 보완');
        windowInfo.owner.name = 'Unknown App';
      }

      // 🔥 title 검증 및 보완
      if (!windowInfo.title || windowInfo.title.trim() === '') {
        Logger.debug(this.componentName, '⚠️ title 없음 - 앱 이름으로 보완');
        windowInfo.title = windowInfo.owner.name;
      }

      // 🔥 processId 검증 및 보완
      if (typeof windowInfo.owner.processId !== 'number' || windowInfo.owner.processId <= 0) {
        Logger.debug(this.componentName, '⚠️ processId 유효하지 않음 - 기본값으로 보완');
        windowInfo.owner.processId = Math.floor(Math.random() * 100000); // 임시 ID
      }

      // 🔥 bounds 검증 및 보완
      if (!windowInfo.bounds) {
        Logger.debug(this.componentName, '⚠️ bounds 정보 없음 - 기본값으로 보완');
        windowInfo.bounds = { x: 0, y: 0, width: 0, height: 0 };
      }

      // 🔥 id 검증 및 보완
      if (typeof windowInfo.id !== 'number' || windowInfo.id <= 0) {
        Logger.debug(this.componentName, '⚠️ window id 유효하지 않음 - 생성');
        windowInfo.id = Date.now() + Math.floor(Math.random() * 1000);
      }

      // 🔥 memoryUsage 검증 및 보완
      if (typeof windowInfo.memoryUsage !== 'number') {
        windowInfo.memoryUsage = 0;
      }

      Logger.debug(this.componentName, '✅ 윈도우 정보 검증 완료', {
        app: windowInfo.owner.name,
        title: windowInfo.title,
        processId: windowInfo.owner.processId,
        id: windowInfo.id
      });

      return windowInfo;

    } catch (error) {
      Logger.error(this.componentName, '❌ 윈도우 정보 검증 중 오류', error);
      return null;
    }
  }

  /**
   * 윈도우 변경 체크
   */
  private async checkWindowChange(): Promise<void> {
    try {
      const activeWindow = await this.getCurrentActiveWindow();
      
      if (!activeWindow) {
        return;
      }

      const enhancedWindow = this.enhanceWindowInfo(activeWindow);
      const hasChanged = this.hasWindowChanged(enhancedWindow);

      if (hasChanged) {
        this.handleWindowChange(enhancedWindow);
      }
    } catch (error) {
      Logger.error(this.componentName, 'Error checking window change', error);
    }
  }

  /**
   * 윈도우 정보 향상 (Loop 전용 필드 추가)
   */
  private enhanceWindowInfo(window: WindowInfo): WindowInfo {
    const enhanced = { ...window };
    
    // 🔥 owner와 name의 안전성 확인
    const ownerName = window?.owner?.name || 'Unknown';
    
    // Loop 전용 필드 추가
    enhanced.loopTimestamp = Date.now();
    enhanced.loopAppCategory = this.categorizeApp(ownerName);
    enhanced.loopSessionId = `${ownerName}-${Date.now()}`;

    return enhanced;
  }

  /**
   * 윈도우 변경 여부 확인
   */
  private hasWindowChanged(newWindow: WindowInfo): boolean {
    if (!this.trackerState.currentWindow) {
      return true;
    }

    const current = this.trackerState.currentWindow;
    return (
      current.id !== newWindow.id ||
      current.title !== newWindow.title ||
      current.owner.name !== newWindow.owner.name ||
      current.owner.processId !== newWindow.owner.processId
    );
  }

  /**
   * 윈도우 변경 처리
   */
  private handleWindowChange(newWindow: WindowInfo): void {
    const previousWindow = this.trackerState.currentWindow;
    
    // 상태 업데이트
    this.trackerState.previousWindow = previousWindow;
    this.trackerState.currentWindow = newWindow;
    this.trackerState.windowChangeCount++;
    this.trackerState.lastChangeTime = new Date();

    // 히스토리 관리
    this.addToHistory(newWindow);

    // 변경 이벤트 생성
    const changeEvent: WindowChangeEvent = {
      previous: previousWindow,
      current: newWindow,
      timestamp: new Date(),
      changeType: this.determineChangeType(previousWindow, newWindow),
    };

    // 이벤트 발생
    this.emit('window-changed', changeEvent);
    
    Logger.info(this.componentName, 'Window changed', {
      from: previousWindow?.owner?.name || 'none',
      to: newWindow?.owner?.name || 'Unknown',
      title: newWindow?.title || 'Untitled',
      category: newWindow.loopAppCategory,
    });
  }

  /**
   * 변경 타입 결정
   */
  private determineChangeType(previous: WindowInfo | null, current: WindowInfo): WindowChangeEvent['changeType'] {
    if (!previous) {
      return 'window-created';
    }

    if (previous.owner.processId !== current.owner.processId) {
      return 'focus-changed';
    }

    if (previous.title !== current.title) {
      return 'title-changed';
    }

    return 'focus-changed';
  }

  /**
   * 히스토리에 추가
   */
  private addToHistory(window: WindowInfo): void {
    this.windowHistory.push(window);
    
    // 최대 크기 제한
    if (this.windowHistory.length > this.trackerConfig.maxHistorySize) {
      this.windowHistory.shift();
    }
  }

  /**
   * 앱 카테고리 분류
   */
  private categorizeApp(appName: string): WindowInfo['loopAppCategory'] {
    const category = this.trackerConfig.appCategoryMapping[appName];
    return (category as WindowInfo['loopAppCategory']) || 'other';
  }

  /**
   * 공개 API: 현재 윈도우 반환
   */
  public getCurrentWindow(): WindowInfo | null {
    return this.trackerState.currentWindow;
  }

  /**
   * 공개 API: 추적 상태 반환
   */
  public getTrackerState(): WindowTrackerState {
    return { ...this.trackerState };
  }

  /**
   * 공개 API: 윈도우 히스토리 반환
   */
  public getWindowHistory(): WindowInfo[] {
    return [...this.windowHistory];
  }

  /**
   * 공개 API: 앱별 통계
   */
  public getAppStats(): Record<string, { count: number; totalTime: number; category: string }> {
    const stats: Record<string, { count: number; totalTime: number; category: string }> = {};
    
    this.windowHistory.forEach((window) => {
      const appName = window.owner.name;
      if (!stats[appName]) {
        stats[appName] = {
          count: 0,
          totalTime: 0,
          category: window.loopAppCategory || 'other',
        };
      }
      stats[appName].count++;
    });

    return stats;
  }

  /**
   * 공개 API: 강제 윈도우 감지
   */
  public async forceDetection(): Promise<Result<WindowInfo>> {
    try {
      const activeWindow = await this.getCurrentActiveWindow();
      
      if (!activeWindow) {
        return {
          success: false,
          error: 'No active window found',
        };
      }

      const enhancedWindow = this.enhanceWindowInfo(activeWindow);
      this.handleWindowChange(enhancedWindow);

      return {
        success: true,
        data: enhancedWindow,
      };
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to force detect window', err);
      return {
        success: false,
        error: err.message,
      };
    }
  }

  /**
   * 🔥 대체 윈도우 감지 (AppleScript 사용) - 강화 버전
   */
  private async fallbackWindowDetection(): Promise<WindowInfo | null> {
    if (!Platform.isMacOS()) {
      Logger.debug(this.componentName, '⚠️ macOS가 아님 - fallback 불가');
      return null;
    }
    
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      // 🔥 더 정확한 AppleScript로 프로세스 정보까지 가져오기
      const script = `
        tell application "System Events"
          set frontApp to first application process whose frontmost is true
          set windowTitle to ""
          set bundleId to ""
          set processName to name of frontApp
          
          try
            set windowTitle to name of front window of frontApp
          end try
          
          try
            set bundleId to bundle identifier of frontApp
          end try
          
          return processName & "|||" & windowTitle & "|||" & bundleId
        end tell
      `;

      const { stdout } = await execAsync(`osascript -e '${script}'`);
      const [processName, windowTitle, bundleId] = stdout.trim().split('|||');

      if (!processName || processName.trim() === '') {
        Logger.debug(this.componentName, '⚠️ AppleScript에서 프로세스명 가져오기 실패');
        return null;
      }

      // 🔥 프로세스 ID 가져오기 (별도 명령어)
      let processId = 0;
      try {
        const pidScript = `
          tell application "System Events"
            set frontApp to first application process whose frontmost is true
            return unix id of frontApp
          end tell
        `;
        const { stdout: pidStdout } = await execAsync(`osascript -e '${pidScript}'`);
        processId = parseInt(pidStdout.trim()) || 0;
      } catch (pidError) {
        Logger.debug(this.componentName, '⚠️ 프로세스 ID 가져오기 실패, 기본값 사용:', pidError);
      }

      const fallbackWindow: WindowInfo = {
        title: windowTitle && windowTitle.trim() !== '' ? windowTitle.trim() : processName.trim(),
        owner: {
          name: processName.trim(),
          processId: processId || Math.floor(Math.random() * 100000),
          bundleId: bundleId && bundleId.trim() !== '' ? bundleId.trim() : undefined
        },
        bounds: { x: 0, y: 0, width: 0, height: 0 },
        id: Date.now() + Math.floor(Math.random() * 1000),
        memoryUsage: 0
      };

      Logger.info(this.componentName, '✅ AppleScript로 윈도우 정보 감지 성공', {
        app: fallbackWindow.owner.name,
        title: fallbackWindow.title,
        bundleId: bundleId || 'unknown',
        processId: processId || 'unknown'
      });

      return fallbackWindow;

    } catch (error) {
      Logger.error(this.componentName, '❌ AppleScript 대체 방법도 실패:', error);
      
      // 🔥 최후의 수단: 시스템 정보라도 제공
      try {
        return {
          title: 'System Window',
          owner: {
            name: 'System',
            processId: 1
          },
          bounds: { x: 0, y: 0, width: 0, height: 0 },
          id: Date.now(),
          memoryUsage: 0
        };
      } catch (finalError) {
        Logger.error(this.componentName, '❌ 최후 수단도 실패:', finalError);
        return null;
      }
    }
  }
}

// 🔥 기가차드 싱글톤 윈도우 추적기
export const windowTracker = new WindowTracker();

// #DEBUG: Window tracker module exit point
Logger.debug('WINDOW_TRACKER', 'Window tracker module setup complete');

export default windowTracker;
