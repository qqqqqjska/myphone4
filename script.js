document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded');

    // 状态管理
    const state = {
        fonts: [],
        wallpapers: [],
        icons: {},
        iconColors: {}, // { appId: '#ffffff' }
        iconPresets: [], // { name, icons, iconColors }
        showStatusBar: true,
        css: '',
        currentFont: 'default',
        currentMeetingFont: 'default', // <--- 新增这一行
        currentWallpaper: null,
        fontPresets: [],
        cssPresets: [],
        meetingCss: '', // 见面模式自定义CSS
        meetingCssPresets: [], // 见面模式CSS预设
        meetingIcons: {
            edit: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTExIDRINFYyMmgxNFYxMSIvPjxwYXRoIGQ9Ik0xOC41IDIuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMMTIgMTVIOHYtNGw5LjUtOS41eiIvPjwvc3ZnPg==',
            delete: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkYzQjMwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMyA2IDUgNiAyMSA2Ii8+PHBhdGggZD0iTTE5IDZ2MTRhMiAyIDAgMCAxLTIgMkg3YTIgMiAwIDAgMS0yLTJWNm0zIDBUNGEyIDIgMCAwIDEgMi0yaDRhMiAyIDAgMCAxIDIgMnYyIi8+PGxpbmUgeDE9IjEwIiB5MT0iMTEiIHgyPSIxMCIgeTI9IjE3Ii8+PGxpbmUgeDE9IjE0IiB5MT0iMTEiIHgyPSIxNCIgeTI9IjE3Ii8+PC9zdmc+',
            end: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkYzQjMwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTkgMjFIMWMtMS4xIDAtMi0uOS0yLTJWMWMwLTEuMS45LTIgMi0yaDhNMjEgMTJsLTUtNW01IDVsLTUgNW01LTVoLTEzIi8+PC9zdmc+',
            continue: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE1IDRWMiIvPjxwYXRoIGQ9Ik0xNSAxNnYtMiIvPjxwYXRoIGQ9Ik04IDloMiIvPjxwYXRoIGQ9Ik0yMCA5aDIiLz48cGF0aCBkPSJNMTcuOCAxMS44TDE5IDEzIi8+PHBhdGggZD0iTTEwLjYgNi42TDEyIDgiLz48cGF0aCBkPSJNNC44IDExLjhMNiAxMyIvPjxwYXRoIGQ9Ik0xMiA0LjhMMTAuNiA2Ii8+PHBhdGggZD0iTTE5IDQuOEwxNy44IDYiLz48cGF0aCBkPSJNMTIgMTMuMkw0LjggMjAuNGEyLjggMi44IDAgMCAwIDQgNEwxNiAxNy4yIi8+PC9zdmc+'
        },
        aiSettings: {
            url: '',
            key: '',
            model: '',
            temperature: 0.7
        },
        aiPresets: [],
        aiSettings2: {
            url: '',
            key: '',
            model: '',
            temperature: 0.7
            
        },
        aiPresets2: [],
        whisperSettings: {
            url: '',
            key: '',
            model: 'whisper-1'
        },
        minimaxSettings: {
            url: 'https://api.minimax.chat/v1/t2a_v2',
            key: '',
            groupId: '',
            model: 'speech-01-turbo'
        },
        chatWallpapers: [], // { id, data }
        tempSelectedChatBg: null, // 临时存储聊天设置中选中的背景
        tempSelectedGroup: null, // 临时存储聊天设置中选中的分组
        contacts: [], // { id, name, remark, avatar, persona, style, myAvatar, chatBg, group }
        contactGroups: [], // ['分组1', '分组2']
        currentChatContactId: null,
        chatHistory: {}, // { contactId: [{ role: 'user'|'assistant', content: '...' }] }
        meetings: {}, // { contactId: [{ id, time, title, content: [{role, text}], style, linkedWorldbooks }] }
        currentMeetingId: null, // 当前正在进行的见面ID
        worldbook: [], // { id, categoryId, keys: [], content: '', enabled: true, remark: '' }
        wbCategories: [], // { id, name, desc }
        currentWbCategoryId: null,
        userPersonas: [], // { id, title, aiPrompt, name }
        currentUserPersonaId: null,
        userProfile: { // 全局资料卡信息
            name: 'User Name',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            bgImage: '',
            momentsBgImage: '',
            desc: '点击此处添加个性签名',
            wxid: 'wxid_123456'
        },
        moments: [], // { id, contactId, content, images: [], time, likes: [], comments: [] }
        memories: [], // { id, contactId, content, time }
        defaultVirtualImageUrl: '', // 默认虚拟图片URL
        wallet: {
            balance: 0.00,
            transactions: [] // { id, type: 'income'|'expense', amount, title, time, relatedId }
        },
        music: {
            playing: false,
            cover: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            src: '',
            title: 'Happy Together',
            artist: 'Maximillian',
            lyricsData: [
                { time: 0, text: "So fast, I almost missed it" },
                { time: 3, text: "I spill another glass of wine" },
                { time: 6, text: "Kill the lights to pass the time" }
            ],
            lyricsFile: '',
            widgetBg: '',
            playlist: [], // { id, title, artist, src, lyricsData, lyricsFile }
            currentSongId: null
        },
        polaroid: {
            img1: 'https://placehold.co/300x300/eee/999?text=Photo',
            text1: '讨厌坏天气',
            img2: 'https://placehold.co/300x300/eee/999?text=Photo',
            text2: '美好回忆'
        },
        stickerCategories: [], // { id, name, list: [{ url, desc }] }
        currentStickerCategoryId: 'all',
        isStickerManageMode: false,
        selectedStickers: new Set(), // 存储选中的表情包标识 (catId-index)
        replyingToMsg: null, // 当前正在引用的消息 { content, name, type }
        isMultiSelectMode: false,
        selectedMessages: new Set() // 存储选中的消息ID
    };

    // 暴露 state 给全局，以便底部的 grid 系统访问
    window.iphoneSimState = state;
// --- 在 script.js 顶部 state 变量附近添加 ---
let currentEditingChatMsgId = null;

// --- 在 init() -> setupEventListeners() 函数内部添加以下代码 ---
// 大约在 setupEventListeners 函数中，与其他 modal 绑定放在一起

    // 编辑消息弹窗绑定
    const editChatMsgModal = document.getElementById('edit-chat-msg-modal');
    const closeEditChatMsgBtn = document.getElementById('close-edit-chat-msg');
    const saveEditChatMsgBtn = document.getElementById('save-edit-chat-msg-btn');

    if (closeEditChatMsgBtn) {
        closeEditChatMsgBtn.addEventListener('click', () => {
            editChatMsgModal.classList.add('hidden');
            currentEditingChatMsgId = null;
        });
    }

    if (saveEditChatMsgBtn) {
        saveEditChatMsgBtn.addEventListener('click', handleSaveEditedChatMessage);
    }

    // DOM 元素
    const appScreen = document.getElementById('theme-app');
    const openBtn = document.getElementById('app-theme');
    const closeBtn = document.getElementById('close-theme-app');
    
    const settingsAppScreen = document.getElementById('settings-app');
    const openSettingsBtn = document.getElementById('app-settings');
    const closeSettingsBtn = document.getElementById('close-settings-app');
    
    const wechatAppScreen = document.getElementById('wechat-app');
    const openWechatBtn = document.getElementById('app-wechat');
    const closeWechatBtn = document.getElementById('close-wechat-app');
    
    const worldbookAppScreen = document.getElementById('worldbook-app');
    const openWorldbookBtn = document.getElementById('app-worldbook');
    const closeWorldbookBtn = document.getElementById('close-worldbook-app');
    
    const memoryAppScreen = document.getElementById('memory-app');
    const closeMemoryBtn = document.getElementById('close-memory-app');

    const locationAppScreen = document.getElementById('location-app');
    const closeLocationBtn = document.getElementById('close-location-app');
    const itinerarySettingsBtn = document.getElementById('itinerary-settings-btn');
    const itinerarySettingsModal = document.getElementById('itinerary-settings-modal');
    const closeItinerarySettingsBtn = document.getElementById('close-itinerary-settings');
    const saveItinerarySettingsBtn = document.getElementById('save-itinerary-settings-btn');

    const walletScreen = document.getElementById('wallet-screen');
    const closeWalletBtn = document.getElementById('close-wallet-screen');
    const walletRechargeModal = document.getElementById('wallet-recharge-modal');
    const closeWalletRechargeBtn = document.getElementById('close-recharge-modal');

    const worldbookDetailScreen = document.getElementById('worldbook-detail-screen');
    const backToWorldbookListBtn = document.getElementById('back-to-worldbook-list');
    
    // 音乐组件相关
    const musicWidget = document.getElementById('music-widget');
    const musicSettingsModal = document.getElementById('music-settings-modal');
    const closeMusicSettingsBtn = document.getElementById('close-music-settings');
    
    // 音乐设置新元素
    const saveMusicAppearanceBtn = document.getElementById('save-music-appearance');
    const saveNewSongBtn = document.getElementById('save-new-song');
    
    const tabMusicList = document.getElementById('tab-music-list');
    const tabMusicUpload = document.getElementById('tab-music-upload');
    const musicViewList = document.getElementById('music-view-list');
    const musicViewUpload = document.getElementById('music-view-upload');
    const musicNavIndicator = document.getElementById('music-nav-indicator');

    const musicCoverUpload = document.getElementById('music-cover-upload');
    const musicWidgetBgUpload = document.getElementById('music-widget-bg-upload');
    const musicFileUpload = document.getElementById('music-file-upload');
    const uploadMusicBtn = document.getElementById('upload-music-btn');
    const lyricsFileUpload = document.getElementById('lyrics-file-upload');
    const uploadLyricsBtn = document.getElementById('upload-lyrics-btn');
    const bgMusicAudio = document.getElementById('bg-music');

    // 拍立得组件相关
    const polaroidWidget = document.getElementById('polaroid-widget');
    const polaroidImg1 = document.getElementById('polaroid-img-1');
    const polaroidText1 = document.getElementById('polaroid-text-1');
    const polaroidInput1 = document.getElementById('polaroid-input-1');
    const polaroidImg2 = document.getElementById('polaroid-img-2');
    const polaroidText2 = document.getElementById('polaroid-text-2');
    const polaroidInput2 = document.getElementById('polaroid-input-2');

    const screenContainer = document.getElementById('screen-container');

    // 已知应用配置 (用于图标设置和默认值)
    const knownApps = {
        'wechat-app': { name: '微信', icon: 'fab fa-weixin', color: '#07C160' },
        'worldbook-app': { name: '世界书', icon: 'fas fa-globe', color: '#007AFF' },
        'settings-app': { name: '设置', icon: 'fas fa-cog', color: '#8E8E93' },
        'theme-app': { name: '美化', icon: 'fas fa-paint-brush', color: '#5856D6' },
        'shopping-app': { name: '购物', icon: 'fas fa-shopping-bag', color: '#FF9500' },
        'forum-app': { name: '论坛', icon: 'fas fa-comments', color: '#30B0C7' },
        'phone-app': { name: '查手机', icon: 'fas fa-mobile-alt', color: '#34C759' },
        'message-app': { name: '信息', icon: 'fas fa-envelope', color: '#007AFF' }
    };

    // 图片压缩工具
    function compressImage(file, maxWidth = 1024, quality = 0.7) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    // 尝试压缩
                    const compressedDataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
                    resolve(compressedDataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    }

    // 处理应用点击
    function handleAppClick(appId, appName) {
        console.log('App clicked:', appName, appId);
        
        // appId 直接对应全屏页面的 ID
        const screen = document.getElementById(appId);
        if (screen) {
            screen.classList.remove('hidden');
        } else {
            alert(`${appName || '应用'} 功能开发中...`);
        }
    }

    // 应用所有配置
    function applyConfig() {
        applyFont(state.currentFont);
        if (state.currentMeetingFont) {
            applyMeetingFont(state.currentMeetingFont);
        }
        applyWallpaper(state.currentWallpaper);
        applyIcons();
        applyCSS(state.css);
        applyMeetingCss(state.meetingCss);
        toggleStatusBar(state.showStatusBar);
    }

    // 初始化
    init();

    async function init() {
        setupEventListeners();
        setupIOSFullScreen(); // 添加iOS全屏适配
        
        try {
            await loadConfig();
        } catch (e) {
            console.error('加载配置失败:', e);
        }

        try {
            renderWallpaperGallery();
        } catch (e) {
            console.error('渲染壁纸画廊失败:', e);
        }

        try {
            renderIconSettings();
        } catch (e) {
            console.error('渲染图标设置失败:', e);
        }

        try {
            applyConfig();
        } catch (e) {
            console.error('应用配置失败:', e);
        }
        
        initMusicWidget();
        initPolaroidWidget();
        initMeetingTheme(); // 初始化见面美化

        renderIconPresets();
        renderFontPresets();
        renderCssPresets();
        renderMeetingCssPresets(); // 渲染见面CSS预设
        renderAiPresets();
        renderAiPresets(true);
        updateAiUi();
        updateAiUi(true);
        renderContactList();
        migrateWorldbookData(); // 迁移旧数据
        renderWorldbookCategoryList();
        renderMeTab();
        renderMoments();
        // 确保初始时聊天容器不处于多选样式
        applyChatMultiSelectClass();
    }

    function migrateWorldbookData() {
        // 如果有条目但没有分类，创建一个默认分类
        if (state.worldbook && state.worldbook.length > 0 && (!state.wbCategories || state.wbCategories.length === 0)) {
            const defaultCatId = Date.now();
            state.wbCategories = [{
                id: defaultCatId,
                name: '默认分类',
                desc: '自动迁移的旧条目'
            }];
            state.worldbook.forEach(entry => {
                if (!entry.categoryId) {
                    entry.categoryId = defaultCatId;
                }
            });
            saveConfig();
        }
        // 确保 wbCategories 存在
        if (!state.wbCategories) state.wbCategories = [];
    }

    // 显示临时提示
    function showChatToast(message, duration = 2000) {
        const toast = document.getElementById('chat-toast');
        const text = document.getElementById('chat-toast-text');
        if (!toast || !text) return;

        text.textContent = message;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    }

    // 统一 Header 管理
    function updateWechatHeader(tab) {
        const header = document.querySelector('.wechat-header');
        if (!header) return;

        const title = header.querySelector('.wechat-title');
        const left = header.querySelector('.header-left');
        const right = header.querySelector('.header-right');
        const body = document.getElementById('wechat-body');

        // 重置样式
        header.className = 'wechat-header'; // 移除 transparent 等
        header.style.display = '';
        header.style.backgroundColor = '';
        if (body) body.classList.remove('full-screen');
        
        // 清空左右按钮容器
        if (left) left.innerHTML = '';
        if (right) right.innerHTML = '';

        // 通用关闭函数
        const closeApp = () => {
            document.getElementById('wechat-app').classList.add('hidden');
        };

        if (tab === 'wechat') {
            if (title) title.textContent = '微信';
            
            // 左侧：关闭
            if (left) {
                const closeBtn = document.createElement('div');
                closeBtn.className = 'header-btn-text';
                closeBtn.textContent = '关闭';
                closeBtn.onclick = closeApp;
                left.appendChild(closeBtn);
            }

            // 右侧：加号 (添加联系人)
            if (right) {
                const addBtn = document.createElement('div');
                addBtn.className = 'wechat-icon-btn';
                addBtn.innerHTML = '<i class="fas fa-plus-circle"></i>';
                addBtn.onclick = () => document.getElementById('add-contact-modal').classList.remove('hidden');
                right.appendChild(addBtn);
            }

        } else if (tab === 'contacts') {
            // 联系人页面使用自定义 Header，隐藏通用 Header
            header.style.display = 'none';
            
            // 绑定自定义 Header 中的按钮事件
            const addBtnCustom = document.getElementById('add-contact-btn-custom');
            if (addBtnCustom) {
                // 移除旧的监听器 (通过克隆)
                const newBtn = addBtnCustom.cloneNode(true);
                addBtnCustom.parentNode.replaceChild(newBtn, addBtnCustom);
                newBtn.addEventListener('click', () => document.getElementById('add-contact-modal').classList.remove('hidden'));
            }

            // 绑定返回按钮 (关闭微信App)
            const backBtnCustom = document.getElementById('contacts-back-btn');
            if (backBtnCustom) {
                const newBackBtn = backBtnCustom.cloneNode(true);
                backBtnCustom.parentNode.replaceChild(newBackBtn, backBtnCustom);
                newBackBtn.addEventListener('click', closeApp);
            }

        } else if (tab === 'moments') {
            if (title) title.textContent = ''; 
            header.classList.add('transparent');
            if (body) body.classList.add('full-screen');

            // 左侧：返回
            if (left) {
                const backBtn = document.createElement('div');
                backBtn.className = 'wechat-icon-btn';
                backBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
                // 返回到通讯录
                const goBack = () => {
                    const contactsTab = document.querySelector('.wechat-tab-item[data-tab="contacts"]');
                    if (contactsTab) contactsTab.click();
                };
                backBtn.onclick = goBack;
                backBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    goBack();
                }, { passive: false });
                left.appendChild(backBtn);
            }

            // 右侧：相机 (发布)
            if (right) {
                const cameraBtn = document.createElement('div');
                cameraBtn.className = 'wechat-icon-btn';
                cameraBtn.style.marginRight = '10px'; // 左移一点
                cameraBtn.innerHTML = '<i class="fas fa-camera"></i>';
                const doPost = () => openPostMoment(false);
                cameraBtn.onclick = doPost;
                cameraBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    doPost();
                }, { passive: false });
                right.appendChild(cameraBtn);
            }

        } else if (tab === 'me') {
            header.style.display = 'none';
            if (body) body.classList.add('full-screen');
        }
    }

    // iOS全屏适配逻辑
    function setupIOSFullScreen() {
        // 检测是否在iOS独立应用模式下运行
        function isInStandaloneMode() {
            return (
                window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone ||
                document.referrer.includes('android-app://')
            );
        }

        // 检测是否在iOS中
        function isIOS() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        }

        // 页面加载时应用全屏样式
        if (isIOS() && isInStandaloneMode()) {
            document.body.classList.add('ios-standalone');
            
            // 动态添加meta标签（如果需要）
            if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
                const meta = document.createElement('meta');
                meta.name = 'apple-mobile-web-app-capable';
                meta.content = 'yes';
                document.head.appendChild(meta);
            }
        }

        // 防止iOS缩放
        document.addEventListener('touchstart', function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // 事件监听设置
    function setupEventListeners() {
        console.log('Setting up event listeners');
        
        // 绑定 Dock 栏应用点击事件
        document.querySelectorAll('.dock-item').forEach(item => {
            item.addEventListener('click', () => {
                const appId = item.dataset.appId;
                const appName = item.querySelector('.app-label')?.textContent;
                handleAppClick(appId, appName);
            });
        });

        // 绑定关闭按钮事件
        if (closeBtn) closeBtn.addEventListener('click', () => appScreen.classList.add('hidden'));
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => settingsAppScreen.classList.add('hidden'));
        if (closeWechatBtn) closeWechatBtn.addEventListener('click', () => wechatAppScreen.classList.add('hidden'));
        if (closeWorldbookBtn) closeWorldbookBtn.addEventListener('click', () => worldbookAppScreen.classList.add('hidden'));
        if (closeMemoryBtn) closeMemoryBtn.addEventListener('click', () => memoryAppScreen.classList.add('hidden'));

        // 美化中心子页面导航
        const themeFontScreen = document.getElementById('theme-font-screen');
        const themeWallpaperScreen = document.getElementById('theme-wallpaper-screen');
        const themeIconsScreen = document.getElementById('theme-icons-screen');

        const openThemeFontBtn = document.getElementById('open-theme-font');
        const openThemeWallpaperBtn = document.getElementById('open-theme-wallpaper');
        const openThemeIconsBtn = document.getElementById('open-theme-icons');

        const closeThemeFontBtn = document.getElementById('close-theme-font');
        const closeThemeWallpaperBtn = document.getElementById('close-theme-wallpaper');
        const closeThemeIconsBtn = document.getElementById('close-theme-icons');

        if (openThemeFontBtn) openThemeFontBtn.addEventListener('click', () => themeFontScreen.classList.remove('hidden'));
        if (closeThemeFontBtn) closeThemeFontBtn.addEventListener('click', () => themeFontScreen.classList.add('hidden'));

        if (openThemeWallpaperBtn) openThemeWallpaperBtn.addEventListener('click', () => themeWallpaperScreen.classList.remove('hidden'));
        if (closeThemeWallpaperBtn) closeThemeWallpaperBtn.addEventListener('click', () => themeWallpaperScreen.classList.add('hidden'));

        if (openThemeIconsBtn) openThemeIconsBtn.addEventListener('click', () => themeIconsScreen.classList.remove('hidden'));
        if (closeThemeIconsBtn) closeThemeIconsBtn.addEventListener('click', () => themeIconsScreen.classList.add('hidden'));

        // 钱包页面设置
        if (closeWalletBtn) closeWalletBtn.addEventListener('click', () => walletScreen.classList.add('hidden'));
        
        const walletRechargeBtn = document.getElementById('wallet-recharge-btn');
        if (walletRechargeBtn) walletRechargeBtn.addEventListener('click', () => {
            walletRechargeModal.classList.remove('hidden');
            // renderRechargeOptions(); // 移除旧的选项渲染
            const input = document.getElementById('recharge-amount');
            if (input) input.value = ''; // 清空输入
        });

        if (closeWalletRechargeBtn) closeWalletRechargeBtn.addEventListener('click', () => walletRechargeModal.classList.add('hidden'));
        
        const doRechargeBtn = document.getElementById('do-recharge-btn');
        if (doRechargeBtn) doRechargeBtn.addEventListener('click', handleRecharge);

        // 记忆页面设置
        const addMemoryBtn = document.getElementById('add-memory-btn');
        const manualSummaryBtn = document.getElementById('manual-summary-btn');
        const memorySettingsBtn = document.getElementById('memory-settings-btn');
        
        const addMemoryModal = document.getElementById('add-memory-modal');
        const closeAddMemoryBtn = document.getElementById('close-add-memory');
        const saveManualMemoryBtn = document.getElementById('save-manual-memory-btn');
        
        const manualSummaryModal = document.getElementById('manual-summary-modal');
        const closeManualSummaryBtn = document.getElementById('close-manual-summary');
        const doManualSummaryBtn = document.getElementById('do-manual-summary-btn');
        
        const memorySettingsModal = document.getElementById('memory-settings-modal');
        const closeMemorySettingsBtn = document.getElementById('close-memory-settings');
        const saveMemorySettingsBtn = document.getElementById('save-memory-settings-btn');

        const editMemoryModal = document.getElementById('edit-memory-modal');
        const closeEditMemoryBtn = document.getElementById('close-edit-memory');
        const saveEditedMemoryBtn = document.getElementById('save-edited-memory-btn');

        if (closeEditMemoryBtn) closeEditMemoryBtn.addEventListener('click', () => editMemoryModal.classList.add('hidden'));
        if (saveEditedMemoryBtn) saveEditedMemoryBtn.addEventListener('click', handleSaveEditedMemory);

        if (addMemoryBtn) addMemoryBtn.addEventListener('click', () => {
            document.getElementById('manual-memory-content').value = '';
            addMemoryModal.classList.remove('hidden');
        });
        if (closeAddMemoryBtn) closeAddMemoryBtn.addEventListener('click', () => addMemoryModal.classList.add('hidden'));
        if (saveManualMemoryBtn) saveManualMemoryBtn.addEventListener('click', handleSaveManualMemory);

        if (manualSummaryBtn) manualSummaryBtn.addEventListener('click', openManualSummary);
        if (closeManualSummaryBtn) closeManualSummaryBtn.addEventListener('click', () => manualSummaryModal.classList.add('hidden'));
        if (doManualSummaryBtn) doManualSummaryBtn.addEventListener('click', handleManualSummary);

        if (memorySettingsBtn) memorySettingsBtn.addEventListener('click', openMemorySettings);
        if (closeMemorySettingsBtn) closeMemorySettingsBtn.addEventListener('click', () => memorySettingsModal.classList.add('hidden'));
        if (saveMemorySettingsBtn) saveMemorySettingsBtn.addEventListener('click', handleSaveMemorySettings);

        // 微信底栏切换
        const wechatTabs = document.querySelectorAll('.wechat-tab-item');
        
        wechatTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const currentActiveTab = document.querySelector('.wechat-tab-item.active');
                if (currentActiveTab === tab) return; // 点击当前tab不做处理

                const currentContent = document.querySelector('.wechat-tab-content.active');
                const tabName = tab.dataset.tab;
                const nextContent = document.getElementById(`wechat-tab-${tabName}`);
                const header = document.querySelector('.wechat-header');

                // 1. 切换 Tab 按钮状态
                wechatTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // 2. 内容切换动画：先淡出当前内容 和 Header
                if (currentContent) {
                    currentContent.classList.add('fade-out');
                    if (header) header.classList.add('fade-out');
                    
                    setTimeout(() => {
                        currentContent.classList.remove('active');
                        currentContent.classList.remove('fade-out');
                        
                        // 3. 显示新内容（初始透明）
                        if (nextContent) {
                            nextContent.style.opacity = '0'; // 确保初始透明
                            nextContent.classList.add('active');
                            // 强制重绘
                            void nextContent.offsetWidth;
                            // 4. 淡入新内容
                            nextContent.style.opacity = '1'; 
                        }
                        
                        // 更新 Header
                        updateWechatHeader(tabName);
                        if (header) header.classList.remove('fade-out');

                    }, 150); // 等待淡出动画结束
                } else {
                    // 如果没有当前内容，直接显示新的
                    if (nextContent) {
                        nextContent.style.opacity = '0';
                        nextContent.classList.add('active');
                        void nextContent.offsetWidth;
                        nextContent.style.opacity = '1';
                    }
                    updateWechatHeader(tabName);
                }
            });
        });

        // 初始化 Header
        updateWechatHeader('contacts');

        // 微信添加联系人
        const addContactModal = document.getElementById('add-contact-modal');
        const closeAddContactBtn = document.getElementById('close-add-contact');
        const saveContactBtn = document.getElementById('save-contact-btn');

        // 联系人头像上传交互
        const contactAvatarPreview = document.getElementById('contact-avatar-preview');
        const contactAvatarUpload = document.getElementById('contact-avatar-upload');
        
        if (contactAvatarPreview && contactAvatarUpload) {
            contactAvatarPreview.addEventListener('click', () => contactAvatarUpload.click());
            
            contactAvatarUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        contactAvatarPreview.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // addContactBtn 已移除，改为动态生成
        if (closeAddContactBtn) closeAddContactBtn.addEventListener('click', () => addContactModal.classList.add('hidden'));
        if (saveContactBtn) saveContactBtn.addEventListener('click', handleSaveContact);

        // 微信聊天页面返回
        const backToContactsBtn = document.getElementById('back-to-contacts');
        if (backToContactsBtn) backToContactsBtn.addEventListener('click', () => {
            document.getElementById('chat-screen').classList.add('hidden');
            state.currentChatContactId = null;
        });

        // 聊天设置
        const chatSettingsBtn = document.getElementById('chat-settings-btn');
        const chatSettingsScreen = document.getElementById('chat-settings-screen');
        const closeChatSettingsBtn = document.getElementById('close-chat-settings');
        const saveChatSettingsBtn = document.getElementById('save-chat-settings-btn');
        const triggerAiMomentBtn = document.getElementById('trigger-ai-moment-btn');
        
        // 分组设置
        const chatSettingGroupTrigger = document.getElementById('chat-setting-group-trigger');
        const groupSelectModal = document.getElementById('group-select-modal');
        const closeGroupSelectBtn = document.getElementById('close-group-select');
        const createGroupBtn = document.getElementById('create-group-btn');

        if (chatSettingGroupTrigger) chatSettingGroupTrigger.addEventListener('click', openGroupSelect);
        if (closeGroupSelectBtn) closeGroupSelectBtn.addEventListener('click', () => groupSelectModal.classList.add('hidden'));
        if (createGroupBtn) createGroupBtn.addEventListener('click', handleCreateGroup);

        // 聊天背景设置
        const chatSettingBgInput = document.getElementById('chat-setting-bg');
        if (chatSettingBgInput) chatSettingBgInput.addEventListener('change', handleChatWallpaperUpload);

        // AI 设置卡片背景和头像预览
        const aiSettingBgInput = document.getElementById('chat-setting-ai-bg-input');
        const aiSettingBgContainer = document.getElementById('ai-setting-bg-container');
        if (aiSettingBgContainer && aiSettingBgInput) {
            aiSettingBgContainer.addEventListener('click', () => aiSettingBgInput.click());
            aiSettingBgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        aiSettingBgContainer.style.backgroundImage = `url(${event.target.result})`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // 用户设置卡片背景预览
        const userSettingBgInput = document.getElementById('chat-setting-user-bg-input');
        const userSettingBgContainer = document.getElementById('user-setting-bg-container');
        if (userSettingBgContainer && userSettingBgInput) {
            userSettingBgContainer.addEventListener('click', () => userSettingBgInput.click());
            userSettingBgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        userSettingBgContainer.style.backgroundImage = `url(${event.target.result})`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        const chatSettingAvatarInput = document.getElementById('chat-setting-avatar');
        if (chatSettingAvatarInput) {
            chatSettingAvatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('chat-setting-avatar-preview').src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        const resetChatBgBtn = document.getElementById('reset-chat-bg');
        if (resetChatBgBtn) {
            resetChatBgBtn.addEventListener('click', () => {
                state.tempSelectedChatBg = '';
                renderChatWallpaperGallery();
            });
        }

        // 聊天设置 Tab 切换
        const chatSettingTabs = document.querySelectorAll('.chat-settings-nav .nav-item');
        const chatSettingIndicator = document.querySelector('.chat-settings-nav .nav-indicator');
        
        chatSettingTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('active')) return;

                const currentContent = document.querySelector('.chat-setting-tab-content.active');
                const tabName = tab.dataset.tab;
                const nextContent = document.getElementById(`chat-setting-tab-${tabName}`);

                // 切换 Tab 按钮状态
                chatSettingTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 移动指示器
                if (chatSettingIndicator) {
                    chatSettingIndicator.style.transform = `translateX(${index * 100}%)`;
                }

                // 切换内容动画
                if (currentContent) {
                    currentContent.classList.add('fade-out');
                    setTimeout(() => {
                        currentContent.classList.remove('active');
                        currentContent.classList.remove('fade-out');
                        
                        if (nextContent) {
                            nextContent.style.opacity = '0';
                            nextContent.classList.add('active');
                            void nextContent.offsetWidth; // 强制重绘
                            nextContent.style.opacity = '1';
                        }
                    }, 150);
                } else {
                    if (nextContent) {
                        nextContent.style.opacity = '0';
                        nextContent.classList.add('active');
                        void nextContent.offsetWidth;
                        nextContent.style.opacity = '1';
                    }
                }
            });
        });

        // 聊天标题点击显示心声
        const chatTitle = document.getElementById('chat-title');
        if (chatTitle) {
            chatTitle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleThoughtBubble();
            });
        }
        
        // 点击其他地方关闭心声
        document.addEventListener('click', (e) => {
            const bubble = document.getElementById('thought-bubble');
            if (bubble && !bubble.classList.contains('hidden') && !bubble.contains(e.target) && e.target !== chatTitle) {
                bubble.classList.add('hidden');
            }
        });

        // 资料卡相关
        const aiProfileScreen = document.getElementById('ai-profile-screen');
        const closeAiProfileBtn = document.getElementById('close-ai-profile');
        const aiProfileMoreBtn = document.getElementById('ai-profile-more');
        const aiProfileSendMsgBtn = document.getElementById('ai-profile-send-msg');
        const aiProfileBgInput = document.getElementById('ai-profile-bg-input');
        const aiProfileBg = document.getElementById('ai-profile-bg');
        const aiRelationItem = document.getElementById('ai-relation-item');
                // ... (找到 aiRelationItem 相关的代码，在它后面添加) ...

        // === 修改开始：资料卡“见面”按钮逻辑 ===
        const currentAiProfileSendMsgBtn = document.getElementById('ai-profile-send-msg');
        if (currentAiProfileSendMsgBtn) {
            // 移除旧的监听器（为了防止重复，使用克隆节点替换法）
            const newBtn = currentAiProfileSendMsgBtn.cloneNode(true);
            currentAiProfileSendMsgBtn.parentNode.replaceChild(newBtn, currentAiProfileSendMsgBtn);
            
            newBtn.addEventListener('click', () => {
                // 点击后直接进入见面列表页
                openMeetingsScreen(state.currentChatContactId);
            });
        }
        // === 修改结束 ===

        // === 新增：见面功能相关事件监听 ===
        // 1. 列表页和弹窗
        const closeMeetingsScreenBtn = document.getElementById('close-meetings-screen');
        const newMeetingBtn = document.getElementById('new-meeting-btn');
        const meetingStyleBtn = document.getElementById('meeting-style-btn');
        const meetingStyleModal = document.getElementById('meeting-style-modal');
        const closeMeetingStyleBtn = document.getElementById('close-meeting-style');
        const saveMeetingStyleBtn = document.getElementById('save-meeting-style-btn');

        if (closeMeetingsScreenBtn) closeMeetingsScreenBtn.addEventListener('click', () => {
            document.getElementById('meetings-screen').classList.add('hidden');
        });

        if (newMeetingBtn) newMeetingBtn.addEventListener('click', createNewMeeting);

        if (meetingStyleBtn) meetingStyleBtn.addEventListener('click', () => {
            const contact = state.contacts.find(c => c.id === state.currentChatContactId);
            if(contact) {
                document.getElementById('meeting-style-input').value = contact.meetingStyle || '';
                document.getElementById('meeting-min-words').value = contact.meetingMinWords || '';
                document.getElementById('meeting-max-words').value = contact.meetingMaxWords || '';
            }
            meetingStyleModal.classList.remove('hidden');
        });

        if (closeMeetingStyleBtn) closeMeetingStyleBtn.addEventListener('click', () => meetingStyleModal.classList.add('hidden'));
        if (saveMeetingStyleBtn) saveMeetingStyleBtn.addEventListener('click', saveMeetingStyle);

        // 2. 详情页交互
        const endMeetingBtn = document.getElementById('end-meeting-btn');
        const meetingSendBtn = document.getElementById('meeting-send-btn');
        // const meetingGenerateBtn = document.getElementById('meeting-generate-btn'); // 稍后在下一步实现

        if (endMeetingBtn) endMeetingBtn.addEventListener('click', endMeeting);
        if (meetingSendBtn) meetingSendBtn.addEventListener('click', handleSendMeetingText);

        // 3. 输入框高度自适应
        const meetingInput = document.getElementById('meeting-input');
        if (meetingInput) {
            meetingInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
                if(this.value === '') this.style.height = 'auto';
            });
        }
        // === 新增结束 ===

        // ... (接原本的 if (aiMomentsEntry) ... )

        const relationSelectModal = document.getElementById('relation-select-modal');
        const closeRelationSelectBtn = document.getElementById('close-relation-select');
        const aiMomentsEntry = document.getElementById('ai-moments-entry');

        if (closeAiProfileBtn) closeAiProfileBtn.addEventListener('click', () => aiProfileScreen.classList.add('hidden'));
        if (aiProfileMoreBtn) aiProfileMoreBtn.addEventListener('click', openChatSettings); // 资料卡更多按钮也打开设置
        

        if (aiProfileBg) aiProfileBg.addEventListener('click', () => aiProfileBgInput.click());
        if (aiProfileBgInput) aiProfileBgInput.addEventListener('change', handleAiProfileBgUpload);
        
        if (aiRelationItem) aiRelationItem.addEventListener('click', openRelationSelect);
        if (closeRelationSelectBtn) closeRelationSelectBtn.addEventListener('click', () => relationSelectModal.classList.add('hidden'));
        
        if (aiMomentsEntry) aiMomentsEntry.addEventListener('click', openAiMoments);

        // 个人朋友圈相关
        const personalMomentsScreen = document.getElementById('personal-moments-screen');
        const closePersonalMomentsBtn = document.getElementById('close-personal-moments');
        const personalMomentsBgInput = document.getElementById('personal-moments-bg-input');
        
        if (closePersonalMomentsBtn) closePersonalMomentsBtn.addEventListener('click', () => personalMomentsScreen.classList.add('hidden'));
        if (personalMomentsBgInput) personalMomentsBgInput.addEventListener('change', handlePersonalMomentsBgUpload);

        if (chatSettingsBtn) chatSettingsBtn.addEventListener('click', openChatSettings);
        if (closeChatSettingsBtn) closeChatSettingsBtn.addEventListener('click', () => chatSettingsScreen.classList.add('hidden'));
        if (saveChatSettingsBtn) saveChatSettingsBtn.addEventListener('click', handleSaveChatSettings);
        if (triggerAiMomentBtn) triggerAiMomentBtn.addEventListener('click', () => generateAiMoment(false));

        const clearChatHistoryBtn = document.getElementById('clear-chat-history-btn');
        if (clearChatHistoryBtn) clearChatHistoryBtn.addEventListener('click', handleClearChatHistory);

        // 聊天输入
        const chatInput = document.getElementById('chat-input');
        const triggerAiReplyBtn = document.getElementById('trigger-ai-reply-btn');

        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const text = chatInput.value.trim();
                    if (text) {
                        sendMessage(text, true);
                        chatInput.value = '';
                    }
                }
            });
        }

        if (triggerAiReplyBtn) {
            triggerAiReplyBtn.addEventListener('click', generateAiReply);
        }

        // 聊天更多功能菜单
        const chatMoreBtn = document.getElementById('chat-more-btn');
        const chatMorePanel = document.getElementById('chat-more-panel');
        const stickerBtn = document.getElementById('sticker-btn');
        const stickerPanel = document.getElementById('sticker-panel');
        const chatInputArea = document.querySelector('.chat-input-area');
        
        // 辅助函数：关闭所有面板
        function closeAllPanels() {
            if (chatMorePanel) chatMorePanel.classList.remove('slide-in');
            if (stickerPanel) stickerPanel.classList.remove('slide-in');
            if (chatInputArea) chatInputArea.classList.remove('push-up');
        }

        if (chatMoreBtn && chatMorePanel) {
            chatMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // 如果当前已打开，则关闭
                if (chatMorePanel.classList.contains('slide-in')) {
                    closeAllPanels();
                } else {
                    // 打开更多，关闭表情
                    if (stickerPanel) stickerPanel.classList.remove('slide-in');
                    chatMorePanel.classList.add('slide-in');
                    if (chatInputArea) chatInputArea.classList.add('push-up');
                    scrollToBottom();
                }
            });

            // 点击面板内的项目
            chatMorePanel.querySelectorAll('.more-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    // 如果是照片、拍摄、转账、记忆、位置、重回、语音或视频通话按钮，不执行通用逻辑（由单独的监听器处理）
                    if (item.id === 'chat-more-photo-btn' || item.id === 'chat-more-camera-btn' || item.id === 'chat-more-transfer-btn' || item.id === 'chat-more-memory-btn' || item.id === 'chat-more-location-btn' || item.id === 'chat-more-regenerate-btn' || item.id === 'chat-more-voice-btn' || item.id === 'chat-more-video-call-btn') return;
                    
                    e.stopPropagation();
                    const label = item.querySelector('.more-label').textContent;
                    alert(`功能 "${label}" 开发中...`);
                    closeAllPanels();
                });
            });
        }
                // ============================================================
        // [修复版] 语音功能：直接集成逻辑，防止作用域错误
        // ============================================================

        const chatMoreVoiceBtn = document.getElementById('chat-more-voice-btn');
        const voiceInputModal = document.getElementById('voice-input-modal');
        const closeVoiceInputBtn = document.getElementById('close-voice-input');
        
        // 打开语音弹窗
        if (chatMoreVoiceBtn) {
            chatMoreVoiceBtn.addEventListener('click', () => {
                document.getElementById('chat-more-panel').classList.add('hidden');
                // 重置状态
                const fakeText = document.getElementById('voice-fake-text');
                const realRes = document.getElementById('voice-real-result');
                const sendRealBtn = document.getElementById('send-real-voice-btn');
                
                if (fakeText) fakeText.value = '';
                if (realRes) realRes.textContent = '';
                if (sendRealBtn) sendRealBtn.disabled = true;
                
                // 默认切回 Tab 1
                if (typeof window.switchVoiceTab === 'function') {
                    window.switchVoiceTab('fake');
                }
                
                voiceInputModal.classList.remove('hidden');
            });
        }

        // 关闭弹窗
        if (closeVoiceInputBtn) {
            closeVoiceInputBtn.addEventListener('click', () => {
                voiceInputModal.classList.add('hidden');
                // 如果正在录音，强制停止
                if (typeof stopVoiceRecording === 'function') stopVoiceRecording(); 
            });
        }

        // --- 1. 伪造语音发送逻辑 (直接写在这里) ---
        const sendFakeVoiceBtn = document.getElementById('send-fake-voice-btn');
        const voiceFakeDuration = document.getElementById('voice-fake-duration');
        
        // 滑动条监听
        if (voiceFakeDuration) {
            voiceFakeDuration.addEventListener('input', (e) => {
                const valSpan = document.getElementById('voice-fake-duration-val');
                if (valSpan) valSpan.textContent = e.target.value;
            });
        }

        // 发送按钮监听
        if (sendFakeVoiceBtn) {
            // 移除可能存在的旧监听器（防止重复发送）
            const newBtn = sendFakeVoiceBtn.cloneNode(true);
            sendFakeVoiceBtn.parentNode.replaceChild(newBtn, sendFakeVoiceBtn);
            
            newBtn.addEventListener('click', () => {
                const textInput = document.getElementById('voice-fake-text');
                const durationInput = document.getElementById('voice-fake-duration');
                
                const text = textInput.value.trim();
                const duration = durationInput.value;

                if (!text) {
                    alert('请输入语音内容文本');
                    return;
                }

                const voiceData = {
                    duration: parseInt(duration),
                    text: text,
                    isReal: false
                };

                // 直接调用当前作用域下的 sendMessage
                sendMessage(JSON.stringify(voiceData), true, 'voice');
                voiceInputModal.classList.add('hidden');
            });
        }

        // --- 2. 真实录音发送逻辑 (直接写在这里) ---
        const voiceMicBtn = document.getElementById('voice-mic-btn');
        const sendRealVoiceBtn = document.getElementById('send-real-voice-btn');

        if (voiceMicBtn) {
            // 移除旧监听器
            const newMicBtn = voiceMicBtn.cloneNode(true);
            voiceMicBtn.parentNode.replaceChild(newMicBtn, voiceMicBtn);
            
            newMicBtn.addEventListener('click', () => {
                // 调用底部定义的 toggleVoiceRecording (因为它涉及很多全局变量，保持在外部定义比较好)
                // 只要该函数定义在 DOMContentLoaded 内部即可
                if (typeof toggleVoiceRecording === 'function') {
                    toggleVoiceRecording();
                } else {
                    console.error('toggleVoiceRecording function not found');
                }
            });
        }

        if (sendRealVoiceBtn) {
            // 移除旧监听器
            const newSendRealBtn = sendRealVoiceBtn.cloneNode(true);
            sendRealVoiceBtn.parentNode.replaceChild(newSendRealBtn, sendRealVoiceBtn);

            newSendRealBtn.addEventListener('click', () => {
                // 这里我们手动获取录音结果的全局变量
                // 注意：这些变量需要在 script.js 底部正确定义
                
                // 如果录音结果为空，给个默认值
                if (!recordedText) recordedText = '[语音]';

                const voiceData = {
                    duration: recordedDuration || 1,
                    text: recordedText,
                    isReal: true,
                    audio: recordedAudio // 修复：添加音频数据
                };

                sendMessage(JSON.stringify(voiceData), true, 'voice');
                voiceInputModal.classList.add('hidden');
            });
        }

        // 定义 Tab 切换 (如果之前没定义成功)
        window.switchVoiceTab = function(mode) {
            const fakeTab = document.getElementById('tab-voice-fake');
            const realTab = document.getElementById('tab-voice-real');
            const fakeMode = document.getElementById('voice-mode-fake');
            const realMode = document.getElementById('voice-mode-real');
            const indicator = document.getElementById('voice-nav-indicator');

            if (mode === 'fake') {
                if(fakeTab) fakeTab.classList.add('active');
                if(realTab) realTab.classList.remove('active');
                if(fakeMode) fakeMode.classList.remove('hidden');
                if(realMode) realMode.classList.add('hidden');
                if(indicator) indicator.style.transform = 'translateX(0)';
            } else {
                if(fakeTab) fakeTab.classList.remove('active');
                if(realTab) realTab.classList.add('active');
                if(fakeMode) fakeMode.classList.add('hidden');
                if(realMode) realMode.classList.remove('hidden');
                if(indicator) indicator.style.transform = 'translateX(100%)';
            }
        };
        
        // ============================================================


        // 表情包系统初始化
        initStickerSystem();

        // 点击其他地方关闭面板
        document.addEventListener('click', (e) => {
            const chatInputArea = document.querySelector('.chat-input-area');
            
            // 检查更多面板
            if (chatMorePanel && chatMorePanel.classList.contains('slide-in') && 
                !chatMorePanel.contains(e.target) && 
                !chatMoreBtn.contains(e.target)) {
                chatMorePanel.classList.remove('slide-in');
                if (chatInputArea) chatInputArea.classList.remove('push-up');
            }
            
            // 检查表情面板
            const currentStickerBtn = document.getElementById('sticker-btn');
            if (stickerPanel && stickerPanel.classList.contains('slide-in') && 
                !stickerPanel.contains(e.target) && 
                (currentStickerBtn ? !currentStickerBtn.contains(e.target) : true)) {
                stickerPanel.classList.remove('slide-in');
                if (chatInputArea) chatInputArea.classList.remove('push-up');
            }
        });

        // 输入框聚焦时关闭面板
        if (chatInput) {
            chatInput.addEventListener('focus', () => {
                const chatInputArea = document.querySelector('.chat-input-area');
                if (chatMorePanel) chatMorePanel.classList.remove('slide-in');
                if (stickerPanel) stickerPanel.classList.remove('slide-in');
                if (chatInputArea) chatInputArea.classList.remove('push-up');
            });
        }

        // 世界书相关
        const addWorldbookCategoryBtn = document.getElementById('add-worldbook-category');
        const addWorldbookEntryBtn = document.getElementById('add-worldbook-entry');
        
        const worldbookEditModal = document.getElementById('worldbook-edit-modal');
        const closeWorldbookEditBtn = document.getElementById('close-worldbook-edit');
        const saveWorldbookBtn = document.getElementById('save-worldbook-btn');
        const deleteWorldbookBtn = document.getElementById('delete-worldbook-btn');

        const categoryEditModal = document.getElementById('category-edit-modal');
        const closeCategoryEditBtn = document.getElementById('close-category-edit');
        const saveCategoryBtn = document.getElementById('save-category-btn');
        const deleteCategoryBtn = document.getElementById('delete-category-btn');
        const editCategoryBtn = document.getElementById('edit-category-btn');

        if (addWorldbookCategoryBtn) addWorldbookCategoryBtn.addEventListener('click', () => openCategoryEdit());
        if (backToWorldbookListBtn) backToWorldbookListBtn.addEventListener('click', () => {
            worldbookDetailScreen.classList.add('hidden');
            state.currentWbCategoryId = null;
        });

        if (addWorldbookEntryBtn) addWorldbookEntryBtn.addEventListener('click', () => openWorldbookEdit());
        
        if (closeWorldbookEditBtn) closeWorldbookEditBtn.addEventListener('click', () => worldbookEditModal.classList.add('hidden'));
        if (saveWorldbookBtn) saveWorldbookBtn.addEventListener('click', handleSaveWorldbookEntry);
        if (deleteWorldbookBtn) deleteWorldbookBtn.addEventListener('click', handleDeleteWorldbookEntry);

        if (closeCategoryEditBtn) closeCategoryEditBtn.addEventListener('click', () => categoryEditModal.classList.add('hidden'));
        if (saveCategoryBtn) saveCategoryBtn.addEventListener('click', handleSaveCategory);
        if (deleteCategoryBtn) deleteCategoryBtn.addEventListener('click', handleDeleteCategory);
        if (editCategoryBtn) editCategoryBtn.addEventListener('click', () => openCategoryEdit(state.currentWbCategoryId));

        // 字体相关
        const fontUpload = document.getElementById('font-upload');
        if (fontUpload) fontUpload.addEventListener('change', handleFontUpload);
        
        const applyFontUrlBtn = document.getElementById('apply-font-url');
        if (applyFontUrlBtn) applyFontUrlBtn.addEventListener('click', handleFontUrl);
        
        // 字体预设相关
        const saveFontPresetBtn = document.getElementById('save-font-preset');
        if (saveFontPresetBtn) saveFontPresetBtn.addEventListener('click', handleSaveFontPreset);
        
        const deleteFontPresetBtn = document.getElementById('delete-font-preset');
        if (deleteFontPresetBtn) deleteFontPresetBtn.addEventListener('click', handleDeleteFontPreset);
        
        const fontPresetSelect = document.getElementById('font-preset-select');
        if (fontPresetSelect) fontPresetSelect.addEventListener('change', handleApplyFontPreset);

        // 壁纸相关
        const wallpaperUpload = document.getElementById('wallpaper-upload');
        if (wallpaperUpload) wallpaperUpload.addEventListener('change', handleWallpaperUpload);
        
        const resetWallpaperBtn = document.getElementById('reset-wallpaper');
        if (resetWallpaperBtn) {
            resetWallpaperBtn.addEventListener('click', () => {
                state.currentWallpaper = null;
                applyWallpaper(null);
                saveConfig();
                renderWallpaperGallery();
            });
        }

        // 图标相关
        const resetIconsBtn = document.getElementById('reset-icons');
        if (resetIconsBtn) {
            resetIconsBtn.addEventListener('click', () => {
                if (confirm('确定要重置所有图标和颜色吗？')) {
                    state.icons = {};
                    state.iconColors = {};
                    applyIcons();
                    saveConfig();
                    renderIconSettings();
                    alert('已重置所有图标');
                }
            });
        }

        const saveIconsBtn = document.getElementById('save-icons-btn');
        if (saveIconsBtn) {
            saveIconsBtn.addEventListener('click', () => {
                saveConfig();
                applyIcons();
                alert('图标配置已保存并应用');
            });
        }

        // CSS相关
        const saveCssBtn = document.getElementById('save-css');
        if (saveCssBtn) {
            saveCssBtn.addEventListener('click', () => {
                state.css = document.getElementById('css-editor').value;
                applyCSS(state.css);
                saveConfig();
                alert('CSS配置已保存');
            });
        }
        
        const exportCssBtn = document.getElementById('export-css');
        if (exportCssBtn) exportCssBtn.addEventListener('click', exportCSS);

        // CSS预设相关
        const saveCssPresetBtn = document.getElementById('save-css-preset');
        if (saveCssPresetBtn) saveCssPresetBtn.addEventListener('click', handleSaveCssPreset);
        
        const deleteCssPresetBtn = document.getElementById('delete-css-preset');
        if (deleteCssPresetBtn) deleteCssPresetBtn.addEventListener('click', handleDeleteCssPreset);
        
        const cssPresetSelect = document.getElementById('css-preset-select');
        if (cssPresetSelect) cssPresetSelect.addEventListener('change', handleApplyCssPreset);

        // 聊天设置 CSS 预设相关
        const saveChatCssPresetBtn = document.getElementById('save-chat-css-preset');
        if (saveChatCssPresetBtn) saveChatCssPresetBtn.addEventListener('click', handleSaveChatCssPreset);

        const deleteChatCssPresetBtn = document.getElementById('delete-chat-css-preset');
        if (deleteChatCssPresetBtn) deleteChatCssPresetBtn.addEventListener('click', handleDeleteChatCssPreset);

        const chatCssPresetSelect = document.getElementById('chat-css-preset-select');
        if (chatCssPresetSelect) chatCssPresetSelect.addEventListener('change', handleApplyChatCssPreset);

        // AI 设置相关 (主)
        setupAiListeners(false);
        
        // AI 设置相关 (副)
        setupAiListeners(true);

        // Whisper 设置相关
        setupWhisperListeners();

        // Minimax 设置相关
        setupMinimaxListeners();

        // 通用设置
        const defaultVirtualImageUrlInput = document.getElementById('default-virtual-image-url');
        if (defaultVirtualImageUrlInput) {
            defaultVirtualImageUrlInput.addEventListener('change', (e) => {
                state.defaultVirtualImageUrl = e.target.value;
            });
        }

        const statusBarToggle = document.getElementById('show-status-bar-toggle');
        if (statusBarToggle) {
            statusBarToggle.addEventListener('change', (e) => {
                state.showStatusBar = e.target.checked;
                toggleStatusBar(state.showStatusBar);
                saveConfig();
            });
        }

        // 图标预设相关
        const saveIconPresetBtn = document.getElementById('save-icon-preset');
        if (saveIconPresetBtn) saveIconPresetBtn.addEventListener('click', handleSaveIconPreset);
        
        const deleteIconPresetBtn = document.getElementById('delete-icon-preset');
        if (deleteIconPresetBtn) deleteIconPresetBtn.addEventListener('click', handleDeleteIconPreset);
        
        const iconPresetSelect = document.getElementById('icon-preset-select');
        if (iconPresetSelect) iconPresetSelect.addEventListener('change', handleApplyIconPreset);

        // 保存所有配置
        const saveAllSettingsBtn = document.getElementById('save-all-settings');
        if (saveAllSettingsBtn) {
            saveAllSettingsBtn.addEventListener('click', () => {
                saveConfig();
                alert('所有配置已保存');
            });
        }

        // 身份管理相关
        const switchPersonaBtn = document.getElementById('switch-persona-btn');
        const closePersonaManageBtn = document.getElementById('close-persona-manage');
        const addPersonaBtn = document.getElementById('add-persona-btn');
        const closePersonaEditBtn = document.getElementById('close-persona-edit');
        const savePersonaBtn = document.getElementById('save-persona-btn');
        const deletePersonaBtn = document.getElementById('delete-persona-btn');

        if (switchPersonaBtn) switchPersonaBtn.addEventListener('click', openPersonaManage);
        if (closePersonaManageBtn) closePersonaManageBtn.addEventListener('click', () => document.getElementById('persona-manage-modal').classList.add('hidden'));
        if (addPersonaBtn) addPersonaBtn.addEventListener('click', () => {
            document.getElementById('persona-manage-modal').classList.add('hidden');
            openPersonaEdit(null);
        });
        if (closePersonaEditBtn) closePersonaEditBtn.addEventListener('click', () => document.getElementById('persona-edit-modal').classList.add('hidden'));
        if (savePersonaBtn) savePersonaBtn.addEventListener('click', handleSavePersona);
        if (deletePersonaBtn) deletePersonaBtn.addEventListener('click', handleDeletePersona);

        // 数据管理
        const exportJsonBtn = document.getElementById('export-json');
        if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportJSON);
        
        const importJsonInput = document.getElementById('import-json');
        if (importJsonInput) importJsonInput.addEventListener('change', importJSON);

        const clearAllDataBtn = document.getElementById('clear-all-data');
        if (clearAllDataBtn) clearAllDataBtn.addEventListener('click', handleClearAllData);

        // 朋友圈背景上传
        const momentsBgInput = document.getElementById('moments-bg-input');
        if (momentsBgInput) momentsBgInput.addEventListener('change', (e) => handleMeImageUpload(e, 'momentsBgImage'));

        // 发布动态相关
        // const addMomentBtn = document.getElementById('add-moment-btn'); // 已移除
        const postMomentModal = document.getElementById('post-moment-modal');
        const closePostMomentBtn = document.getElementById('close-post-moment');
        const doPostMomentBtn = document.getElementById('do-post-moment');
        const addMomentImageBtn = document.getElementById('add-moment-image-btn');
        const postMomentFileInput = document.getElementById('post-moment-file-input');

        // addMomentBtn 逻辑已移至 updateWechatHeader

        // 动态页返回按钮
        // const momentsBackBtn = document.getElementById('moments-back-btn'); // 已移除

        if (closePostMomentBtn) closePostMomentBtn.addEventListener('click', () => postMomentModal.classList.add('hidden'));
        if (doPostMomentBtn) doPostMomentBtn.addEventListener('click', handlePostMoment);
        if (addMomentImageBtn) addMomentImageBtn.addEventListener('click', () => postMomentFileInput.click());
        if (postMomentFileInput) postMomentFileInput.addEventListener('change', handlePostMomentImages);

        // 聊天图片上传
        const chatMorePhotoBtn = document.getElementById('chat-more-photo-btn');
        const chatPhotoInput = document.getElementById('chat-photo-input');
        
        if (chatMorePhotoBtn && chatPhotoInput) {
            chatMorePhotoBtn.addEventListener('click', () => chatPhotoInput.click());
            chatPhotoInput.addEventListener('change', handleChatPhotoUpload);
        }

        // 聊天拍摄功能
        const chatMoreCameraBtn = document.getElementById('chat-more-camera-btn');
        if (chatMoreCameraBtn) {
            chatMoreCameraBtn.addEventListener('click', handleChatCamera);
        }

        // 视频通话功能
        const chatMoreVideoCallBtn = document.getElementById('chat-more-video-call-btn');
        const videoCallModal = document.getElementById('video-call-modal');
        const startVoiceCallBtn = document.getElementById('start-voice-call-btn');
        const startVideoCallBtn = document.getElementById('start-video-call-btn');
        const cancelVideoCallBtn = document.getElementById('cancel-video-call-btn');

        if (chatMoreVideoCallBtn) {
            chatMoreVideoCallBtn.addEventListener('click', () => {
                document.getElementById('chat-more-panel').classList.add('hidden');
                videoCallModal.classList.remove('hidden');
            });
        }

        if (cancelVideoCallBtn) {
            cancelVideoCallBtn.addEventListener('click', () => {
                videoCallModal.classList.add('hidden');
            });
        }

        if (startVoiceCallBtn) {
            startVoiceCallBtn.addEventListener('click', () => {
                videoCallModal.classList.add('hidden');
                // sendMessage('[邀请你进行语音通话]', true, 'text'); // 不再发送文本消息
                openVoiceCallScreen();
            });
        }

        if (startVideoCallBtn) {
            startVideoCallBtn.addEventListener('click', () => {
                videoCallModal.classList.add('hidden');
                sendMessage('[邀请你进行视频通话]', true, 'text');
            });
        }

        // 记忆功能
        const chatMoreMemoryBtn = document.getElementById('chat-more-memory-btn');
        if (chatMoreMemoryBtn) {
            chatMoreMemoryBtn.addEventListener('click', () => {
                openMemoryApp();
                document.getElementById('chat-more-panel').classList.add('hidden');
            });
        }

        // 位置功能
        const chatMoreLocationBtn = document.getElementById('chat-more-location-btn');
        const refreshLocationBtn = document.getElementById('refresh-location-btn');

        if (chatMoreLocationBtn) {
            chatMoreLocationBtn.addEventListener('click', openLocationApp);
        }
        if (closeLocationBtn) {
            closeLocationBtn.addEventListener('click', () => {
                locationAppScreen.classList.add('hidden');
            });
        }
        if (refreshLocationBtn) {
            refreshLocationBtn.addEventListener('click', () => generateDailyItinerary(true));
        }

        if (itinerarySettingsBtn) itinerarySettingsBtn.addEventListener('click', openItinerarySettings);
        if (closeItinerarySettingsBtn) closeItinerarySettingsBtn.addEventListener('click', () => itinerarySettingsModal.classList.add('hidden'));
        if (saveItinerarySettingsBtn) saveItinerarySettingsBtn.addEventListener('click', handleSaveItinerarySettings);

        // 转账功能
        const chatMoreTransferBtn = document.getElementById('chat-more-transfer-btn');
        const transferModal = document.getElementById('transfer-modal');
        const closeTransferBtn = document.getElementById('close-transfer-modal');
        const doTransferBtn = document.getElementById('do-transfer-btn');

        if (chatMoreTransferBtn) {
            chatMoreTransferBtn.addEventListener('click', () => {
                document.getElementById('transfer-amount').value = '';
                document.getElementById('transfer-remark').value = '';
                transferModal.classList.remove('hidden');
                document.getElementById('chat-more-panel').classList.add('hidden');
            });
        }

        if (closeTransferBtn) {
            closeTransferBtn.addEventListener('click', () => transferModal.classList.add('hidden'));
        }

        if (doTransferBtn) {
            doTransferBtn.addEventListener('click', handleTransfer);
        }

        // 引用回复条关闭按钮
        const closeReplyBarBtn = document.getElementById('close-reply-bar');
        if (closeReplyBarBtn) {
            closeReplyBarBtn.addEventListener('click', cancelQuote);
        }

        // 重回功能
        const chatMoreRegenerateBtn = document.getElementById('chat-more-regenerate-btn');
        if (chatMoreRegenerateBtn) {
            chatMoreRegenerateBtn.addEventListener('click', handleRegenerateReply);
        }

        // 多选操作栏
        const multiSelectCancelBtn = document.getElementById('multi-select-cancel');
        const multiSelectDeleteBtn = document.getElementById('multi-select-delete');
        
        if (multiSelectCancelBtn) multiSelectCancelBtn.addEventListener('click', exitMultiSelectMode);
        if (multiSelectDeleteBtn) multiSelectDeleteBtn.addEventListener('click', deleteSelectedMessages);

        // 主题自定义器
        const openThemeCustomizerBtn = document.getElementById('open-theme-customizer-btn');
        const themeCustomizerApp = document.getElementById('theme-customizer-app');
        const closeThemeCustomizerBtn = document.getElementById('close-theme-customizer');

        if (openThemeCustomizerBtn) {
            openThemeCustomizerBtn.addEventListener('click', () => {
                themeCustomizerApp.classList.remove('hidden');
                initThemeCustomizer();
            });
        }

        if (closeThemeCustomizerBtn) {
            closeThemeCustomizerBtn.addEventListener('click', () => {
                themeCustomizerApp.classList.add('hidden');
            });
        }

        // 音乐组件事件
        if (musicWidget) {
            musicWidget.addEventListener('click', (e) => {
                // 如果点击的是播放按钮，则切换播放状态
                if (e.target.id === 'play-icon' || e.target.closest('.music-controls-mini')) {
                    e.stopPropagation();
                    toggleMusicPlay();
                } else {
                    openMusicSettings();
                }
            });
        }

        if (closeMusicSettingsBtn) closeMusicSettingsBtn.addEventListener('click', () => musicSettingsModal.classList.add('hidden'));
        
        if (saveMusicAppearanceBtn) saveMusicAppearanceBtn.addEventListener('click', saveMusicAppearance);
        if (saveNewSongBtn) saveNewSongBtn.addEventListener('click', saveNewSong);

        if (tabMusicList) tabMusicList.addEventListener('click', () => switchMusicTab('list'));
        if (tabMusicUpload) tabMusicUpload.addEventListener('click', () => switchMusicTab('upload'));
        
        if (uploadMusicBtn && musicFileUpload) {
            uploadMusicBtn.addEventListener('click', () => musicFileUpload.click());
            musicFileUpload.addEventListener('change', handleMusicFileUpload);
        }

        if (musicCoverUpload) {
            const preview = document.getElementById('music-cover-preview');
            if (preview) preview.addEventListener('click', () => musicCoverUpload.click());
            musicCoverUpload.addEventListener('change', handleMusicCoverUpload);
        }

        if (musicWidgetBgUpload) {
            const preview = document.getElementById('music-widget-bg-preview');
            if (preview) preview.addEventListener('click', () => musicWidgetBgUpload.click());
            musicWidgetBgUpload.addEventListener('change', handleMusicWidgetBgUpload);
        }

        if (uploadLyricsBtn && lyricsFileUpload) {
            uploadLyricsBtn.addEventListener('click', () => lyricsFileUpload.click());
            lyricsFileUpload.addEventListener('change', handleLyricsUpload);
        }

        // 拍立得组件事件
        if (polaroidWidget) {
            // 图片点击上传
            if (polaroidImg1) {
                polaroidImg1.parentElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    polaroidInput1.click();
                });
            }
            if (polaroidImg2) {
                polaroidImg2.parentElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    polaroidInput2.click();
                });
            }

            // 文字点击编辑
            if (polaroidText1) {
                polaroidText1.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handlePolaroidTextEdit(1);
                });
            }
            if (polaroidText2) {
                polaroidText2.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handlePolaroidTextEdit(2);
                });
            }

            // 文件输入监听
            if (polaroidInput1) polaroidInput1.addEventListener('change', (e) => handlePolaroidImageUpload(e, 1));
            if (polaroidInput2) polaroidInput2.addEventListener('change', (e) => handlePolaroidImageUpload(e, 2));
        }
                // ==========================================
        // [最终清洗版] 见面功能绑定 (防止双重触发)
        // ==========================================
        
        // 辅助函数：彻底重置按钮（清除所有旧事件）
        function resetButton(id, newHandler) {
            const oldBtn = document.getElementById(id);
            if (oldBtn) {
                const newBtn = oldBtn.cloneNode(true);
                oldBtn.parentNode.replaceChild(newBtn, oldBtn);
                newBtn.onclick = newHandler;
            }
        }

        // 1. 绑定资料卡“见面”按钮
        resetButton('ai-profile-send-msg', function(e) {
            e.stopPropagation();
            e.preventDefault();
            const contactId = state.currentChatContactId;
            if (!contactId) return;

            document.getElementById('ai-profile-screen').classList.add('hidden');
            const meetingsScreen = document.getElementById('meetings-screen');
            if (meetingsScreen) {
                meetingsScreen.classList.remove('hidden');
                meetingsScreen.style.zIndex = '200';
                if (typeof renderMeetingsList === 'function') {
                    renderMeetingsList(contactId);
                }
            }
        });

        // 2. 绑定见面列表页的关闭按钮
        resetButton('close-meetings-screen', function() {
            document.getElementById('meetings-screen').classList.add('hidden');
        });

        // 3. 绑定新建见面按钮
        resetButton('new-meeting-btn', function() {
            if (typeof createNewMeeting === 'function') {
                createNewMeeting();
            }
        });
        
        // 4. 绑定详情页返回按钮 (结束按钮)
        resetButton('end-meeting-btn', function() {
            if (typeof endMeeting === 'function') {
                endMeeting();
            } else {
                // 兜底
                document.getElementById('meeting-detail-screen').classList.add('hidden');
                document.getElementById('meetings-screen').classList.add('hidden');
            }
        });
        
        // 5. 绑定详情页发送按钮
        resetButton('meeting-send-btn', function() {
            if (typeof handleSendMeetingText === 'function') {
                handleSendMeetingText();
            }
        });

        // 6. 绑定文风设置按钮 (如果有的话)
        resetButton('meeting-style-btn', function() {
             const modal = document.getElementById('meeting-style-modal');
             if(modal) modal.classList.remove('hidden');
        });
        
        // 7. 绑定文风关闭和保存
        resetButton('close-meeting-style', function() {
             document.getElementById('meeting-style-modal').classList.add('hidden');
        });
        resetButton('save-meeting-style-btn', function() {
             saveMeetingStyle();
        });
                // 8. 绑定 AI 续写按钮
        resetButton('meeting-ai-continue-btn', function() {
            if (typeof handleMeetingAI === 'function') {
                handleMeetingAI('continue');
            }
        });
        
         


    }

    // --- 拍立得组件功能 ---
    function initPolaroidWidget() {
        if (state.polaroid) {
            if (polaroidImg1) polaroidImg1.src = state.polaroid.img1;
            if (polaroidText1) polaroidText1.textContent = state.polaroid.text1;
            if (polaroidImg2) polaroidImg2.src = state.polaroid.img2;
            if (polaroidText2) polaroidText2.textContent = state.polaroid.text2;
        }
    }

    function handlePolaroidImageUpload(e, index) {
        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 600, 0.7).then(base64 => {
            if (index === 1) {
                state.polaroid.img1 = base64;
                if (polaroidImg1) polaroidImg1.src = base64;
            } else {
                state.polaroid.img2 = base64;
                if (polaroidImg2) polaroidImg2.src = base64;
            }
            saveConfig();
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
        e.target.value = '';
    }

    function handlePolaroidTextEdit(index) {
        const currentText = index === 1 ? state.polaroid.text1 : state.polaroid.text2;
        const newText = prompt('请输入文字：', currentText);
        
        if (newText !== null) {
            if (index === 1) {
                state.polaroid.text1 = newText;
                if (polaroidText1) polaroidText1.textContent = newText;
            } else {
                state.polaroid.text2 = newText;
                if (polaroidText2) polaroidText2.textContent = newText;
            }
            saveConfig();
        }
    }

    // --- 音乐组件功能 ---
    function initMusicWidget() {
        if (state.music) {
            updateMusicUI();
            if (state.music.src) {
                bgMusicAudio.src = state.music.src;
            }
        }
        
        // 绑定歌词同步
        bgMusicAudio.addEventListener('timeupdate', syncLyrics);
        bgMusicAudio.addEventListener('ended', () => {
            state.music.playing = false;
            updateMusicUI();
        });
    }

    function openMusicSettings() {
        // 填充外观设置
        const coverPreview = document.getElementById('music-cover-preview');
        if (coverPreview && state.music.cover) {
            coverPreview.innerHTML = `<img src="${state.music.cover}" style="width: 100%; height: 100%; object-fit: cover;">`;
        }

        const bgPreview = document.getElementById('music-widget-bg-preview');
        if (bgPreview) {
            if (state.music.widgetBg) {
                bgPreview.innerHTML = `<img src="${state.music.widgetBg}" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                bgPreview.innerHTML = '<i class="fas fa-image"></i>';
            }
        }

        // 重置上传表单
        resetMusicUploadForm();
        
        // 渲染歌曲列表
        renderMusicPlaylist();
        
        // 默认显示列表页
        switchMusicTab('list');

        musicSettingsModal.classList.remove('hidden');
    }

    function switchMusicTab(tab) {
        const listTab = document.getElementById('tab-music-list');
        const uploadTab = document.getElementById('tab-music-upload');
        const listView = document.getElementById('music-view-list');
        const uploadView = document.getElementById('music-view-upload');
        const indicator = document.getElementById('music-nav-indicator');

        if (tab === 'list') {
            listTab.classList.add('active');
            uploadTab.classList.remove('active');
            
            listView.style.display = 'block';
            uploadView.style.display = 'none';
            
            // 强制重绘以触发过渡
            void listView.offsetWidth;
            
            listView.classList.add('active');
            uploadView.classList.remove('active');
            
            indicator.style.transform = 'translateX(0)';
        } else {
            listTab.classList.remove('active');
            uploadTab.classList.add('active');
            
            listView.style.display = 'none';
            uploadView.style.display = 'block';
            
            // 强制重绘以触发过渡
            void uploadView.offsetWidth;
            
            listView.classList.remove('active');
            uploadView.classList.add('active');
            
            indicator.style.transform = 'translateX(100%)';
        }
    }

    function resetMusicUploadForm() {
        document.getElementById('input-song-title').value = '';
        document.getElementById('input-artist-name').value = '';
        document.getElementById('music-url-input').value = '';
        document.getElementById('music-file-upload').value = '';
        document.getElementById('lyrics-file-upload').value = '';
        document.getElementById('lyrics-status').textContent = '未选择文件';
        
        state.tempMusicSrc = null;
        state.tempLyricsData = null;
        state.tempLyricsFile = null;
    }

    function handleMusicCoverUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 300, 0.7).then(base64 => {
            const preview = document.getElementById('music-cover-preview');
            if (preview) {
                preview.innerHTML = `<img src="${base64}" style="width: 100%; height: 100%; object-fit: cover;">`;
            }
            // 暂存，点击保存时才应用到 state
            state.tempMusicCover = base64;
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
    }

    function handleMusicWidgetBgUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 800, 0.7).then(base64 => {
            const preview = document.getElementById('music-widget-bg-preview');
            if (preview) {
                preview.innerHTML = `<img src="${base64}" style="width: 100%; height: 100%; object-fit: cover;">`;
            }
            state.tempMusicWidgetBg = base64;
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
    }

    function handleMusicFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            state.tempMusicSrc = event.target.result;
            alert('音乐文件已选择，点击保存生效');
        };
        reader.readAsDataURL(file);
    }

    function handleLyricsUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const lrcContent = event.target.result;
            const parsedLyrics = parseLRC(lrcContent);
            
            if (parsedLyrics.length > 0) {
                state.tempLyricsData = parsedLyrics;
                state.tempLyricsFile = file.name;
                document.getElementById('lyrics-status').textContent = `已选择: ${file.name}`;
            } else {
                alert('歌词解析失败，请检查文件格式');
            }
        };
        reader.readAsText(file);
    }

    function parseLRC(lrc) {
        const lines = lrc.split('\n');
        const result = [];
        const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;

        lines.forEach(line => {
            const match = timeRegex.exec(line);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0;
                const time = minutes * 60 + seconds + milliseconds / 1000;
                const text = line.replace(timeRegex, '').trim();
                
                if (text) {
                    result.push({ time, text });
                }
            }
        });

        return result.sort((a, b) => a.time - b.time);
    }

    function saveMusicAppearance() {
        if (state.tempMusicCover) {
            state.music.cover = state.tempMusicCover;
            delete state.tempMusicCover;
        }

        if (state.tempMusicWidgetBg) {
            state.music.widgetBg = state.tempMusicWidgetBg;
            delete state.tempMusicWidgetBg;
        }

        updateMusicUI();
        saveConfig();
        alert('外观设置已保存');
    }

    function saveNewSong() {
        const title = document.getElementById('input-song-title').value.trim();
        const artist = document.getElementById('input-artist-name').value.trim();
        const urlInput = document.getElementById('music-url-input').value.trim();

        if (!title) {
            alert('请输入歌名');
            return;
        }

        let src = '';
        if (state.tempMusicSrc) {
            src = state.tempMusicSrc;
        } else if (urlInput) {
            src = urlInput;
        } else {
            alert('请上传音乐文件或输入URL');
            return;
        }

        const newSong = {
            id: Date.now(),
            title: title,
            artist: artist || '未知歌手',
            src: src,
            lyricsData: state.tempLyricsData || [],
            lyricsFile: state.tempLyricsFile || ''
        };

        if (!state.music.playlist) state.music.playlist = [];
        state.music.playlist.push(newSong);
        
        // 自动播放新添加的歌曲
        playSong(newSong.id);
        
        saveConfig();
        
        // 重置表单并切换到列表
        resetMusicUploadForm();
        switchMusicTab('list');
        renderMusicPlaylist();
    }

    function renderMusicPlaylist() {
        const list = document.getElementById('music-playlist');
        const emptyState = document.getElementById('music-empty-state');
        if (!list) return;

        list.innerHTML = '';

        if (!state.music.playlist || state.music.playlist.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        state.music.playlist.forEach(song => {
            const item = document.createElement('div');
            item.className = 'list-item';
            const isPlaying = state.music.currentSongId === song.id;
            
            item.innerHTML = `
                <div class="list-content column" style="flex: 1;">
                    <div style="font-weight: bold; font-size: 16px; ${isPlaying ? 'color: #007AFF;' : ''}">${song.title}</div>
                    <div style="font-size: 12px; color: #888;">${song.artist}</div>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button class="ios-btn-small" onclick="window.playSong(${song.id})" style="${isPlaying ? 'background-color: #007AFF;' : ''}">${isPlaying ? '播放中' : '播放'}</button>
                    <button class="ios-btn-small danger" onclick="window.deleteSong(${song.id})">删除</button>
                </div>
            `;
            list.appendChild(item);
        });
    }

    window.playSong = function(id) {
        const song = state.music.playlist.find(s => s.id === id);
        if (!song) return;

        state.music.currentSongId = id;
        state.music.title = song.title;
        state.music.artist = song.artist;
        state.music.src = song.src;
        state.music.lyricsData = song.lyricsData;
        state.music.lyricsFile = song.lyricsFile;
        
        bgMusicAudio.src = song.src;
        
        // 播放
        bgMusicAudio.play().then(() => {
            state.music.playing = true;
            updateMusicUI();
            renderMusicPlaylist(); // 更新列表状态
        }).catch(err => {
            console.error('播放失败:', err);
            alert('播放失败');
        });
        
        saveConfig();
    };

    window.deleteSong = function(id) {
        if (confirm('确定要删除这首歌吗？')) {
            state.music.playlist = state.music.playlist.filter(s => s.id !== id);
            if (state.music.currentSongId === id) {
                state.music.currentSongId = null;
                // 停止播放？或者保持当前状态直到切换
            }
            saveConfig();
            renderMusicPlaylist();
        }
    };

    function toggleMusicPlay() {
        if (!state.music.src) {
            alert('请先设置音乐源');
            return;
        }

        if (bgMusicAudio.paused) {
            bgMusicAudio.play().then(() => {
                state.music.playing = true;
                updateMusicUI();
            }).catch(err => {
                console.error('播放失败:', err);
                alert('播放失败，可能是浏览器限制自动播放，请尝试手动点击播放。');
            });
        } else {
            bgMusicAudio.pause();
            state.music.playing = false;
            updateMusicUI();
        }
    }

    function updateMusicUI() {
        const widget = document.getElementById('music-widget');
        const cover = document.getElementById('vinyl-cover');
        const disk = document.getElementById('vinyl-disk');
        const title = document.getElementById('song-title');
        const artist = document.getElementById('artist-name');
        const lyricsContainer = document.getElementById('lyrics-display');
        const playIcon = document.getElementById('play-icon');

        if (widget && state.music.widgetBg) {
            widget.style.backgroundImage = `url('${state.music.widgetBg}')`;
            widget.style.backgroundSize = 'cover';
            widget.style.backgroundPosition = 'center';
            // 如果有背景图，可能需要调整文字颜色，这里简单处理为白色阴影或保持原样
            // 为了确保可读性，可以加一个半透明遮罩，或者让用户自己决定
            // 这里不做额外处理，保持原样
        } else if (widget) {
            widget.style.backgroundImage = '';
        }

        if (cover) cover.style.backgroundImage = `url('${state.music.cover}')`;
        if (title) title.textContent = state.music.title;
        if (artist) artist.textContent = state.music.artist;
        
        if (lyricsContainer) {
            // 渲染歌词列表
            let html = '<div class="lyrics-scroll-container" id="lyrics-scroll">';
            if (state.music.lyricsData && state.music.lyricsData.length > 0) {
                state.music.lyricsData.forEach((line, index) => {
                    html += `<div class="lyric-line" data-time="${line.time}" data-index="${index}">${line.text}</div>`;
                });
            } else {
                html += '<div class="lyric-line">暂无歌词</div>';
            }
            html += '</div>';
            lyricsContainer.innerHTML = html;
        }

        if (state.music.playing) {
            if (disk) disk.classList.add('playing');
            if (playIcon) {
                playIcon.className = 'fas fa-pause';
            }
        } else {
            if (disk) disk.classList.remove('playing');
            if (playIcon) {
                playIcon.className = 'fas fa-play';
            }
        }
    }

    function syncLyrics() {
        const currentTime = bgMusicAudio.currentTime;
        const lyricsData = state.music.lyricsData;
        
        if (!lyricsData || lyricsData.length === 0) return;

        // 找到当前播放的歌词行
        let activeIndex = -1;
        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }

        if (activeIndex !== -1) {
            const scrollContainer = document.getElementById('lyrics-scroll');
            const lines = document.querySelectorAll('.lyric-line');
            
            // 移除旧的高亮
            lines.forEach(line => line.classList.remove('active'));
            
            // 添加新高亮
            if (lines[activeIndex]) {
                lines[activeIndex].classList.add('active');
                
                // 滚动逻辑
                // 假设每行高度约 20px，容器高度 60px，显示 3 行
                // 我们希望当前行在中间 (第2行)
                // 初始 top 是 20px (第一行在中间)
                // activeIndex = 0 -> top: 20px
                // activeIndex = 1 -> top: 0px
                // activeIndex = 2 -> top: -20px
                
                const lineHeight = 20; // 估算行高，与 CSS 对应
                const initialTop = 20;
                const newTop = initialTop - (activeIndex * lineHeight);
                
                if (scrollContainer) {
                    scrollContainer.style.transform = `translateY(${newTop - 20}px)`; // -20 是因为 transform 是相对于初始位置的偏移？不，直接用 top 属性可能更简单，或者 transform translateY
                    // 修正：CSS 中 .lyrics-scroll-container 是 absolute top: 20px
                    // 我们修改 transform translateY
                    // 初始 translateY(0) -> 显示第1行在中间
                    // activeIndex 0 -> translateY(0)
                    // activeIndex 1 -> translateY(-20px)
                    
                    scrollContainer.style.transform = `translateY(-${activeIndex * lineHeight}px)`;
                }
            }
        }
    }

    // --- 主题自定义器功能 ---
    function initThemeCustomizer() {
        const controls = [
            { id: 'ctrl-top-bg', target: 'preview-top-bar', prop: 'backgroundImage', type: 'url' },
            { id: 'ctrl-bottom-bg', target: 'preview-bottom-bar', prop: 'backgroundImage', type: 'url' },

            // 图标处理
            { id: 'ctrl-back-icon', target: 'preview-back-btn', type: 'icon' },
            { id: 'ctrl-menu-icon', target: 'preview-menu-btn', type: 'icon' },
            { id: 'ctrl-plus-icon', target: 'preview-plus-btn', type: 'icon' },
            { id: 'ctrl-emoji-icon', target: 'preview-emoji-btn', type: 'icon' },
            { id: 'ctrl-send-icon', target: 'preview-send-btn', type: 'icon' },

            // AI 气泡
            { id: 'ctrl-ai-bg-color', target: 'preview-ai-bubble', prop: 'backgroundColor', type: 'color' },
            { id: 'ctrl-ai-text-color', target: 'preview-ai-bubble', prop: 'color', type: 'color' },
            { id: 'ctrl-ai-radius-tl', target: 'preview-ai-bubble', prop: 'borderTopLeftRadius', type: 'px' },
            { id: 'ctrl-ai-radius-tr', target: 'preview-ai-bubble', prop: 'borderTopRightRadius', type: 'px' },
            { id: 'ctrl-ai-radius-br', target: 'preview-ai-bubble', prop: 'borderBottomRightRadius', type: 'px' },
            { id: 'ctrl-ai-radius-bl', target: 'preview-ai-bubble', prop: 'borderBottomLeftRadius', type: 'px' },
            { id: 'ctrl-ai-padding-t', target: 'preview-ai-bubble', prop: 'paddingTop', type: 'px' },
            { id: 'ctrl-ai-padding-r', target: 'preview-ai-bubble', prop: 'paddingRight', type: 'px' },
            { id: 'ctrl-ai-padding-b', target: 'preview-ai-bubble', prop: 'paddingBottom', type: 'px' },
            { id: 'ctrl-ai-padding-l', target: 'preview-ai-bubble', prop: 'paddingLeft', type: 'px' },
            { id: 'ctrl-ai-margin', target: 'preview-ai-row', prop: 'marginBottom', type: 'px' },
            { id: 'ctrl-ai-x', target: 'preview-ai-bubble', type: 'transform-x', pair: 'ctrl-ai-y' },
            { id: 'ctrl-ai-y', target: 'preview-ai-bubble', type: 'transform-y', pair: 'ctrl-ai-x' },
            { id: 'ctrl-ai-shadow-blur', target: 'preview-ai-bubble', type: 'shadow-blur', pair: 'ctrl-ai-shadow-color' },
            { id: 'ctrl-ai-shadow-color', target: 'preview-ai-bubble', type: 'shadow-color', pair: 'ctrl-ai-shadow-blur' },
            { id: 'ctrl-ai-bg-img', target: 'preview-ai-bubble', type: 'bg-img' },
            { id: 'ctrl-ai-bg-size', target: 'preview-ai-bubble', type: 'bg-size' },
            { id: 'ctrl-ai-bg-x', target: 'preview-ai-bubble', type: 'bg-pos-x', pair: 'ctrl-ai-bg-y' },
            { id: 'ctrl-ai-bg-y', target: 'preview-ai-bubble', type: 'bg-pos-y', pair: 'ctrl-ai-bg-x' },

            // 用户气泡
            { id: 'ctrl-user-bg-color', target: 'preview-user-bubble', prop: 'backgroundColor', type: 'color' },
            { id: 'ctrl-user-text-color', target: 'preview-user-bubble', prop: 'color', type: 'color' },
            { id: 'ctrl-user-radius-tl', target: 'preview-user-bubble', prop: 'borderTopLeftRadius', type: 'px' },
            { id: 'ctrl-user-radius-tr', target: 'preview-user-bubble', prop: 'borderTopRightRadius', type: 'px' },
            { id: 'ctrl-user-radius-br', target: 'preview-user-bubble', prop: 'borderBottomRightRadius', type: 'px' },
            { id: 'ctrl-user-radius-bl', target: 'preview-user-bubble', prop: 'borderBottomLeftRadius', type: 'px' },
            { id: 'ctrl-user-padding-t', target: 'preview-user-bubble', prop: 'paddingTop', type: 'px' },
            { id: 'ctrl-user-padding-r', target: 'preview-user-bubble', prop: 'paddingRight', type: 'px' },
            { id: 'ctrl-user-padding-b', target: 'preview-user-bubble', prop: 'paddingBottom', type: 'px' },
            { id: 'ctrl-user-padding-l', target: 'preview-user-bubble', prop: 'paddingLeft', type: 'px' },
            { id: 'ctrl-user-margin', target: 'preview-user-row', prop: 'marginBottom', type: 'px' },
            { id: 'ctrl-user-x', target: 'preview-user-bubble', type: 'transform-x', pair: 'ctrl-user-y' },
            { id: 'ctrl-user-y', target: 'preview-user-bubble', type: 'transform-y', pair: 'ctrl-user-x' },
            { id: 'ctrl-user-shadow-blur', target: 'preview-user-bubble', type: 'shadow-blur', pair: 'ctrl-user-shadow-color' },
            { id: 'ctrl-user-shadow-color', target: 'preview-user-bubble', type: 'shadow-color', pair: 'ctrl-user-shadow-blur' },
            { id: 'ctrl-user-bg-img', target: 'preview-user-bubble', type: 'bg-img' },
            { id: 'ctrl-user-bg-size', target: 'preview-user-bubble', type: 'bg-size' },
            { id: 'ctrl-user-bg-x', target: 'preview-user-bubble', type: 'bg-pos-x', pair: 'ctrl-user-bg-y' },
            { id: 'ctrl-user-bg-y', target: 'preview-user-bubble', type: 'bg-pos-y', pair: 'ctrl-user-bg-x' },

        ];

        controls.forEach(ctrl => {
            const input = document.getElementById(ctrl.id);
            if (!input) return;

            // 移除旧的监听器（防止重复绑定）
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);

            newInput.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // 更新显示值
                if (ctrl.displayId) {
                    document.getElementById(ctrl.displayId).textContent = value;
                }

                // 更新预览
                updatePreview(ctrl, value);
                
                // 生成 CSS
                generateCSS(controls);
            });

            // 初始化预览状态
            if (newInput.value) {
                updatePreview(ctrl, newInput.value);
            }
        });

        // 复制 CSS 按钮
        const copyBtn = document.getElementById('copy-css-btn');
        if (copyBtn) {
            const newCopyBtn = copyBtn.cloneNode(true);
            copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);
            newCopyBtn.addEventListener('click', () => {
                const css = document.getElementById('css-output').value;
                navigator.clipboard.writeText(css).then(() => {
                    alert('CSS 代码已复制');
                });
            });
        }

        // 保存为预设按钮 (新功能)
        const savePresetBtn = document.getElementById('save-theme-customizer-preset');
        if (savePresetBtn) {
            // 移除旧监听器
            const newBtn = savePresetBtn.cloneNode(true);
            savePresetBtn.parentNode.replaceChild(newBtn, savePresetBtn);
            
            newBtn.addEventListener('click', () => {
                const css = document.getElementById('css-output').value;
                if (!css) {
                    alert('没有可保存的CSS内容');
                    return;
                }
                
                const name = prompt('请输入预设名称：');
                if (!name) return;
                
                const preset = {
                    name: name,
                    css: css
                };
                
                state.cssPresets.push(preset);
                saveConfig();
                
                // 更新所有相关的预设列表
                renderCssPresets();
                renderChatCssPresets();
                
                alert('已保存为预设，可在聊天设置中选择使用');
            });
        }

        // 重置按钮
        const resetBtn = document.getElementById('reset-theme-btn');
        if (resetBtn) {
            const newResetBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            newResetBtn.addEventListener('click', () => {
                controls.forEach(c => {
                    const input = document.getElementById(c.id);
                    if (input) {
                        // 重置为默认值
                        if (c.type === 'color') {
                            if (c.id === 'ctrl-ai-bg-color') input.value = '#E5E5EA';
                            else if (c.id === 'ctrl-ai-text-color') input.value = '#000000';
                            else if (c.id === 'ctrl-user-bg-color') input.value = '#007AFF';
                            else if (c.id === 'ctrl-user-text-color') input.value = '#FFFFFF';
                            else input.value = '#000000';
                        } else if (c.type === 'px') {
                            if (c.prop.includes('Radius')) input.value = 18;
                            else if (c.prop.includes('padding')) {
                                if (c.prop.endsWith('Top') || c.prop.endsWith('Bottom')) input.value = 8;
                                else input.value = 12;
                            }
                            else if (c.prop === 'marginBottom') input.value = 10;
                            else input.value = 0;
                        } else if (c.type.includes('transform')) {
                            input.value = 0;
                        } else if (c.type.includes('shadow')) {
                            if (c.type === 'shadow-blur') input.value = 0;
                            else input.value = '#000000';
                        } else if (c.type.includes('bg-size')) {
                            input.value = 100;
                        } else if (c.type.includes('bg-pos')) {
                            input.value = 50;
                        } else {
                            input.value = ''; // URL 等
                        }
                        
                        // 触发 input 事件以更新预览
                        input.dispatchEvent(new Event('input'));
                    }
                });
                
                // 清空 CSS
                state.css = '';
                applyCSS('');
                saveConfig();
                alert('已重置所有自定义设置');
            });
        }

        // 重置消息样式按钮
        const resetMsgStyleBtn = document.getElementById('reset-msg-style-btn');
        if (resetMsgStyleBtn) {
            const newBtn = resetMsgStyleBtn.cloneNode(true);
            resetMsgStyleBtn.parentNode.replaceChild(newBtn, resetMsgStyleBtn);
            newBtn.addEventListener('click', () => {
                const msgControls = controls.filter(c => c.id.includes('ctrl-ai-') || c.id.includes('ctrl-user-'));
                
                msgControls.forEach(c => {
                    const input = document.getElementById(c.id);
                    if (input) {
                        // 重置为默认值
                        if (c.type === 'color') {
                            if (c.id === 'ctrl-ai-bg-color') input.value = '#E5E5EA';
                            else if (c.id === 'ctrl-ai-text-color') input.value = '#000000';
                            else if (c.id === 'ctrl-user-bg-color') input.value = '#007AFF';
                            else if (c.id === 'ctrl-user-text-color') input.value = '#FFFFFF';
                            else input.value = '#000000';
                        } else if (c.type === 'px') {
                            if (c.prop.includes('Radius')) input.value = 18;
                            else if (c.prop.includes('padding')) {
                                if (c.prop.endsWith('Top') || c.prop.endsWith('Bottom')) input.value = 8;
                                else input.value = 12;
                            }
                            else if (c.prop === 'marginBottom') input.value = 10;
                            else input.value = 0;
                        } else if (c.type.includes('transform')) {
                            input.value = 0;
                        } else if (c.type.includes('shadow')) {
                            if (c.type === 'shadow-blur') input.value = 0;
                            else input.value = '#000000';
                        } else if (c.type.includes('bg-size')) {
                            input.value = 100;
                        } else if (c.type.includes('bg-pos')) {
                            input.value = 50;
                        } else {
                            input.value = '';
                        }
                        
                        // 触发 input 事件以更新预览
                        input.dispatchEvent(new Event('input'));
                    }
                });
                alert('已重置消息样式');
            });
        }

        // 导航栏切换逻辑
        const navItems = document.querySelectorAll('#customize-nav .nav-item');
        const sections = document.querySelectorAll('.customize-section');

        navItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // 移除所有 active 样式
                navItems.forEach(nav => {
                    nav.classList.remove('active');
                    nav.style.fontWeight = 'normal';
                    nav.style.color = '#888';
                    nav.style.borderBottom = 'none';
                });

                // 隐藏所有 section
                sections.forEach(sec => sec.classList.add('hidden'));

                // 激活当前
                item.classList.add('active');
                item.style.fontWeight = 'bold';
                item.style.color = '#000';
                item.style.borderBottom = '2px solid #000';

                // 显示对应 section
                if (sections[index]) {
                    sections[index].classList.remove('hidden');
                }
            });
        });


        // 初始化 CSS
        generateCSS(controls);
    }

    function updatePreview(ctrl, value) {
        let targets = [];
        const primaryTarget = document.getElementById(ctrl.target);
        if (primaryTarget) targets.push(primaryTarget);

        // 扩展目标：根据 ctrl.target 查找同类元素
        if (ctrl.target === 'preview-ai-bubble') {
            const others = document.querySelectorAll('#preview-messages .chat-message.other .message-content');
            others.forEach(el => { if (el !== primaryTarget) targets.push(el); });
        } else if (ctrl.target === 'preview-user-bubble') {
            // 排除转账卡片
            const others = document.querySelectorAll('#preview-messages .chat-message.user .message-content:not(.transfer-msg)');
            others.forEach(el => { if (el !== primaryTarget) targets.push(el); });
        } else if (ctrl.target === 'preview-ai-row') {
            const others = document.querySelectorAll('#preview-messages .chat-message.other');
            others.forEach(el => { if (el !== primaryTarget) targets.push(el); });
        } else if (ctrl.target === 'preview-user-row') {
            const others = document.querySelectorAll('#preview-messages .chat-message.user');
            others.forEach(el => { if (el !== primaryTarget) targets.push(el); });
        }

        targets.forEach(target => {
            if (ctrl.type === 'url') {
                if (value) {
                    target.style[ctrl.prop] = `url('${value}')`;
                    target.style.backgroundSize = 'cover';
                    target.style.backgroundPosition = 'center';
                } else {
                    target.style[ctrl.prop] = '';
                }
            } else if (ctrl.type === 'px') {
                target.style[ctrl.prop] = `${value}px`;
            } else if (ctrl.type === 'icon') {
                // 按钮内部图标替换
                if (value) {
                    target.innerHTML = `<img src="${value}" style="width: 1em; height: 1em; object-fit: contain; font-size: inherit;">`;
                } else {
                    // 恢复默认
                    if (ctrl.id === 'ctrl-back-icon') target.innerHTML = '<i class="fas fa-chevron-left"></i>';
                    if (ctrl.id === 'ctrl-menu-icon') target.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
                    if (ctrl.id === 'ctrl-plus-icon') target.innerHTML = '<i class="fas fa-plus-circle"></i>';
                    if (ctrl.id === 'ctrl-emoji-icon') target.innerHTML = '<i class="far fa-smile"></i>';
                    if (ctrl.id === 'ctrl-send-icon') target.innerHTML = '<i class="fas fa-arrow-up"></i>';
                }
            } else if (ctrl.type === 'color') {
                target.style[ctrl.prop] = value;
            } else if (ctrl.type === 'shadow-blur' || ctrl.type === 'shadow-color') {
                const blurInput = document.getElementById(ctrl.type === 'shadow-blur' ? ctrl.id : ctrl.pair);
                const colorInput = document.getElementById(ctrl.type === 'shadow-color' ? ctrl.id : ctrl.pair);
                const blur = blurInput ? blurInput.value : 0;
                const color = colorInput ? colorInput.value : '#000000';
                if (blur > 0) {
                    target.style.boxShadow = `0 2px ${blur}px ${color}`;
                } else {
                    target.style.boxShadow = 'none';
                }
            } else if (ctrl.type === 'bg-img') {
                if (value) {
                    target.style.backgroundImage = `url('${value}')`;
                    target.style.backgroundRepeat = 'no-repeat';
                    // 默认居中和覆盖，除非被其他控件覆盖
                    if (!target.style.backgroundPosition) target.style.backgroundPosition = 'center';
                    if (!target.style.backgroundSize) target.style.backgroundSize = 'cover';
                } else {
                    target.style.backgroundImage = '';
                }
            } else if (ctrl.type === 'bg-size') {
                target.style.backgroundSize = `${value}%`;
            } else if (ctrl.type === 'bg-pos-x' || ctrl.type === 'bg-pos-y') {
                const xInput = document.getElementById(ctrl.type === 'bg-pos-x' ? ctrl.id : ctrl.pair);
                const yInput = document.getElementById(ctrl.type === 'bg-pos-y' ? ctrl.id : ctrl.pair);
                const x = xInput ? xInput.value : 50;
                const y = yInput ? yInput.value : 50;
                target.style.backgroundPosition = `${x}% ${y}%`;
            }
        });
    }

    function generateCSS(controls) {
        let css = '/* 自定义主题 CSS */\n\n';
        
        // 1. 顶栏和底栏背景
        const topBg = document.getElementById('ctrl-top-bg')?.value;
        const bottomBg = document.getElementById('ctrl-bottom-bg')?.value;

        css += `/* 顶栏样式 */\n.wechat-header, .chat-header {\n`;
        if (topBg) {
            css += `    background-image: url('${topBg}') !important;\n    background-size: cover !important;\n    background-position: center !important;\n    background-color: transparent !important;\n`;
        } else {
            css += `    /* background-image: url('...'); */\n    /* background-size: cover; */\n    /* background-position: center; */\n`;
        }
        css += `}\n\n`;

        css += `/* 底栏样式 */\n.wechat-tab-bar, .chat-input-area {\n`;
        if (bottomBg) {
            css += `    background-image: url('${bottomBg}') !important;\n    background-size: cover !important;\n    background-position: center !important;\n    background-color: transparent !important;\n`;
        } else {
            css += `    /* background-image: url('...'); */\n    /* background-size: cover; */\n    /* background-position: center; */\n`;
        }
        css += `}\n\n`;

        // 2. 按钮图标
        const iconMap = {
            'ctrl-back-icon': { selector: '#back-to-contacts', name: '返回按钮' },
            'ctrl-menu-icon': { selector: '#chat-settings-btn', name: '菜单按钮' },
            'ctrl-plus-icon': { selector: '#chat-more-btn', name: '加号按钮' },
            'ctrl-emoji-icon': { selector: '#sticker-btn', name: '表情按钮' },
            'ctrl-send-icon': { selector: '#trigger-ai-reply-btn', name: '发送按钮' }
        };

        controls.forEach(ctrl => {
            if (ctrl.type === 'icon' && iconMap[ctrl.id]) {
                const input = document.getElementById(ctrl.id);
                const url = input ? input.value : '';
                const info = iconMap[ctrl.id];
                
                css += `/* ${info.name} */\n${info.selector} {\n`;
                if (url) {
                    css += `    background-image: url('${url}') !important;\n    background-size: contain !important;\n    background-repeat: no-repeat !important;\n    background-position: center !important;\n`;
                    css += `}\n${info.selector} i {\n    display: none !important;\n}\n\n`;
                } else {
                    css += `    /* background-image: url('...'); */\n    /* background-size: contain; */\n    /* background-repeat: no-repeat; */\n    /* background-position: center; */\n}\n/* ${info.selector} i { display: none; } */\n\n`;
                }
            }
        });

        // 3. 消息气泡样式
        const bubbleStyles = {
            ai: { selector: '.chat-message.other .message-content:not(.transfer-msg)', props: [] },
            user: { selector: '.chat-message.user .message-content:not(.transfer-msg)', props: [] },
            aiRow: { selector: '.chat-message.other', props: [] },
            userRow: { selector: '.chat-message.user', props: [] }
        };

        // 收集属性
        controls.forEach(ctrl => {
            const input = document.getElementById(ctrl.id);
            const value = input ? input.value : '';
            
            // 即使值为空（对于非必需项），我们也可能想生成注释，但为了简化，我们只处理有值的
            // 对于 range 和 color，它们总是有值的
            if (value === '' && value !== 0 && ctrl.type !== 'bg-img') return;

            let targetKey = '';
            if (ctrl.target === 'preview-ai-bubble') targetKey = 'ai';
            else if (ctrl.target === 'preview-user-bubble') targetKey = 'user';
            else if (ctrl.target === 'preview-ai-row') targetKey = 'aiRow';
            else if (ctrl.target === 'preview-user-row') targetKey = 'userRow';

            if (!targetKey) return;

            if (ctrl.type === 'color') {
                bubbleStyles[targetKey].props.push(`${ctrl.prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value} !important`);
            } else if (ctrl.type === 'px') {
                bubbleStyles[targetKey].props.push(`${ctrl.prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}px !important`);
            } else if (ctrl.type === 'shadow-blur') {
                const colorInput = document.getElementById(ctrl.pair);
                const color = colorInput ? colorInput.value : '#000000';
                if (value > 0) {
                    bubbleStyles[targetKey].props.push(`box-shadow: 0 2px ${value}px ${color} !important`);
                } else {
                    bubbleStyles[targetKey].props.push(`box-shadow: none !important`);
                }
            } else if (ctrl.type === 'bg-img') {
                if (value) {
                    bubbleStyles[targetKey].props.push(`background-image: url('${value}') !important`);
                    bubbleStyles[targetKey].props.push(`background-repeat: no-repeat !important`);
                } else {
                    // 如果没有背景图，不生成属性，或者生成注释
                    // bubbleStyles[targetKey].props.push(`/* background-image: url('...'); */`);
                }
            } else if (ctrl.type === 'bg-size') {
                bubbleStyles[targetKey].props.push(`background-size: ${value}% !important`);
            } else if (ctrl.type === 'bg-pos-x') {
                const yInput = document.getElementById(ctrl.pair);
                const y = yInput ? yInput.value : 50;
                bubbleStyles[targetKey].props.push(`background-position: ${value}% ${y}% !important`);
            } else if (ctrl.type === 'transform-x') {
                const yInput = document.getElementById(ctrl.pair);
                const y = yInput ? yInput.value : 0;
                if (value != 0 || y != 0) {
                    bubbleStyles[targetKey].props.push(`transform: translate(${value}px, ${y}px) !important`);
                }
            }
        });

        // 生成 CSS 块
        if (bubbleStyles.ai.props.length > 0) {
            css += `/* AI 气泡样式 */\n${bubbleStyles.ai.selector} {\n    ${bubbleStyles.ai.props.join(';\n    ')};\n}\n\n`;
        }
        if (bubbleStyles.aiRow.props.length > 0) {
            css += `/* AI 消息行样式 */\n${bubbleStyles.aiRow.selector} {\n    ${bubbleStyles.aiRow.props.join(';\n    ')};\n}\n\n`;
        }
        if (bubbleStyles.user.props.length > 0) {
            css += `/* 用户气泡样式 */\n${bubbleStyles.user.selector} {\n    ${bubbleStyles.user.props.join(';\n    ')};\n}\n\n`;
        }
        if (bubbleStyles.userRow.props.length > 0) {
            css += `/* 用户消息行样式 */\n${bubbleStyles.userRow.selector} {\n    ${bubbleStyles.userRow.props.join(';\n    ')};\n}\n\n`;
        }

        // 强制转账消息样式
        css += `/* 强制转账消息样式 */\n.chat-message .message-content.transfer-msg {\n    background-color: #ffffff !important;\n    color: #000000 !important;\n    padding: 0 !important;\n    border-radius: 12px !important;\n}\n`;

        document.getElementById('css-output').value = css;
    }

    function handleRegenerateReply() {
        if (!state.currentChatContactId) return;
        
        const history = state.chatHistory[state.currentChatContactId];
        if (!history || history.length === 0) {
            alert('没有聊天记录，无法重回');
            return;
        }

        // 关闭更多面板
        document.getElementById('chat-more-panel').classList.add('hidden');

        // 从后往前检查，删除所有连续的 AI 回复
        let hasDeleted = false;
        while (history.length > 0) {
            const lastMsg = history[history.length - 1];
            if (lastMsg.role === 'assistant') {
                history.pop();
                hasDeleted = true;
            } else {
                break; // 遇到用户消息停止
            }
        }

        if (hasDeleted) {
            saveConfig();
            renderChatHistory(state.currentChatContactId);
        }
        
        // 重新生成回复
        generateAiReply();
    }

    function handleTransfer() {
        const amountStr = document.getElementById('transfer-amount').value.trim();
        const remark = document.getElementById('transfer-remark').value.trim();

        if (!amountStr || isNaN(amountStr) || parseFloat(amountStr) <= 0) {
            alert('请输入有效的金额');
            return;
        }
        
        const amount = parseFloat(amountStr);

        // 检查余额
        if (!state.wallet) state.wallet = { balance: 0.00, transactions: [] };
        if (state.wallet.balance < amount) {
            alert('余额不足，请先充值');
            return;
        }

        // 扣款
        state.wallet.balance -= amount;
        state.wallet.transactions.unshift({
            id: Date.now(),
            type: 'expense',
            amount: amount,
            title: '转账支出',
            time: Date.now(),
            relatedId: null // 关联的转账ID，稍后生成
        });

        // 添加随机数防止ID冲突
        const transferId = Date.now() + Math.floor(Math.random() * 1000);
        
        // 更新刚才那条交易记录的 relatedId
        state.wallet.transactions[0].relatedId = transferId;
        
        const transferData = {
            id: transferId,
            amount: amount.toFixed(2),
            remark: remark || '转账给您',
            status: 'pending' // pending, accepted, returned
        };

        sendMessage(JSON.stringify(transferData), true, 'transfer');
        document.getElementById('transfer-modal').classList.add('hidden');
        saveConfig();
    }

    function handleChatCamera() {
        const description = prompt('请输入图片描述：');
        if (description) {
            // 使用配置的URL或默认占位图
            const defaultImageUrl = state.defaultVirtualImageUrl || 'https://placehold.co/600x400/png?text=Photo';
            sendMessage(defaultImageUrl, true, 'virtual_image', description);
            
            // 关闭更多面板
            document.getElementById('chat-more-panel').classList.add('hidden');
        }
    }

    function handleChatPhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 800, 0.7).then(base64 => {
            sendMessage(base64, true, 'image');
            // 关闭更多面板
            document.getElementById('chat-more-panel').classList.add('hidden');
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
        e.target.value = ''; // 重置
    }

    let postMomentImages = [];

    function openPostMoment(isTextOnly) {
        const modal = document.getElementById('post-moment-modal');
        const textInput = document.getElementById('post-moment-text');
        const imageContainer = document.getElementById('post-moment-images');
        
        textInput.value = '';
        postMomentImages = [];
        renderPostMomentImages();
        
        if (isTextOnly) {
            imageContainer.style.display = 'none';
            textInput.placeholder = '这一刻的想法...';
        } else {
            imageContainer.style.display = 'grid';
            textInput.placeholder = '这一刻的想法...';
        }
        
        modal.classList.remove('hidden');
    }

    function handlePostMomentImages(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        files.forEach(file => {
            compressImage(file, 800, 0.7).then(base64 => {
                if (postMomentImages.length < 9) {
                    postMomentImages.push(base64);
                    renderPostMomentImages();
                }
            }).catch(err => {
                console.error('图片压缩失败', err);
            });
        });
        e.target.value = '';
    }

    function renderPostMomentImages() {
        const container = document.getElementById('post-moment-images');
        const addBtn = document.getElementById('add-moment-image-btn');
        
        // 清除旧的图片预览（保留添加按钮）
        const oldItems = container.querySelectorAll('.post-image-item');
        oldItems.forEach(item => item.remove());
        
        postMomentImages.forEach((imgSrc, index) => {
            const item = document.createElement('div');
            item.className = 'post-image-item';
            item.innerHTML = `<img src="${imgSrc}">`;
            container.insertBefore(item, addBtn);
        });

        if (postMomentImages.length >= 9) {
            addBtn.style.display = 'none';
        } else {
            addBtn.style.display = 'flex';
        }
    }

    function handlePostMoment() {
        const content = document.getElementById('post-moment-text').value.trim();
        
        if (!content && postMomentImages.length === 0) {
            alert('请输入内容或选择图片');
            return;
        }

        addMoment('me', content, [...postMomentImages]);

        // 同步动态发布信息到所有联系人的聊天记录（隐藏消息）
        // 这样AI在任何聊天中都能知道用户发了动态
        const momentSummary = content || '[图片动态]';
        const imageTag = postMomentImages.length > 0 ? ` [包含${postMomentImages.length}张图片]` : '';
        const hiddenMsg = `[发布了动态]: ${momentSummary}${imageTag}`;

        state.contacts.forEach(contact => {
            if (!state.chatHistory[contact.id]) {
                state.chatHistory[contact.id] = [];
            }
            state.chatHistory[contact.id].push({
                role: 'user',
                content: hiddenMsg
            });
        });
        
        // 如果当前在聊天界面，且该消息是隐藏的，不需要更新UI，但需要保存
        saveConfig();

        document.getElementById('post-moment-modal').classList.add('hidden');
    }

    function setupAiListeners(isSecondary) {
        const suffix = isSecondary ? '-2' : '';
        const settingsKey = isSecondary ? 'aiSettings2' : 'aiSettings';
        
        const aiApiUrl = document.getElementById(`ai-api-url${suffix}`);
        if (aiApiUrl) aiApiUrl.addEventListener('change', (e) => {
            state[settingsKey].url = e.target.value;
        });

        const aiApiKey = document.getElementById(`ai-api-key${suffix}`);
        if (aiApiKey) aiApiKey.addEventListener('change', (e) => {
            state[settingsKey].key = e.target.value;
        });

        const fetchModelsBtn = document.getElementById(`fetch-models${suffix}`);
        if (fetchModelsBtn) fetchModelsBtn.addEventListener('click', () => handleFetchModels(isSecondary));

        const aiModelSelect = document.getElementById(`ai-model-select${suffix}`);
        if (aiModelSelect) aiModelSelect.addEventListener('change', (e) => {
            state[settingsKey].model = e.target.value;
        });

        const aiTemperature = document.getElementById(`ai-temperature${suffix}`);
        if (aiTemperature) aiTemperature.addEventListener('input', (e) => {
            state[settingsKey].temperature = parseFloat(e.target.value);
            document.getElementById(`ai-temp-value${suffix}`).textContent = state[settingsKey].temperature;
        });

        // AI 预设相关
        const saveAiPresetBtn = document.getElementById(`save-ai-preset${suffix}`);
        if (saveAiPresetBtn) saveAiPresetBtn.addEventListener('click', () => handleSaveAiPreset(isSecondary));

        const deleteAiPresetBtn = document.getElementById(`delete-ai-preset${suffix}`);
        if (deleteAiPresetBtn) deleteAiPresetBtn.addEventListener('click', () => handleDeleteAiPreset(isSecondary));

        const aiPresetSelect = document.getElementById(`ai-preset-select${suffix}`);
        if (aiPresetSelect) aiPresetSelect.addEventListener('change', (e) => handleApplyAiPreset(e, isSecondary));
    }

    function setupWhisperListeners() {
        const urlInput = document.getElementById('whisper-api-url');
        const keyInput = document.getElementById('whisper-api-key');
        const modelInput = document.getElementById('whisper-model');
        const modeSelect = document.getElementById('whisper-connection-mode');
        const fetchModelsBtn = document.getElementById('fetch-whisper-models');
        const modelSelect = document.getElementById('whisper-model-select');

        // 初始化模式选择
        if (modeSelect && state.whisperSettings.url) {
            if (state.whisperSettings.url.includes('localhost:3000')) {
                modeSelect.value = 'local_proxy';
            } else {
                modeSelect.value = 'custom';
            }
        }

        if (modeSelect) {
            modeSelect.addEventListener('change', (e) => {
                const mode = e.target.value;
                if (mode === 'local_proxy') {
                    const proxyUrl = 'http://localhost:3000/v1';
                    urlInput.value = proxyUrl;
                    state.whisperSettings.url = proxyUrl;
                } else if (mode === 'corsproxy') {
                    const proxyUrl = 'https://corsproxy.io/?https://api.openai.com/v1';
                    urlInput.value = proxyUrl;
                    state.whisperSettings.url = proxyUrl;
                } else if (mode === 'siliconflow') {
                    const proxyUrl = 'https://api.siliconflow.cn/v1';
                    urlInput.value = proxyUrl;
                    state.whisperSettings.url = proxyUrl;
                } else {
                    // 切换回自定义时，如果当前是代理地址，则清空方便输入
                    if (urlInput.value.includes('localhost:3000') || urlInput.value.includes('corsproxy.io') || urlInput.value.includes('siliconflow.cn')) {
                        urlInput.value = '';
                        state.whisperSettings.url = '';
                    }
                }
            });
        }

        if (urlInput) {
            urlInput.value = state.whisperSettings.url || '';
            urlInput.addEventListener('change', (e) => {
                state.whisperSettings.url = e.target.value;
                // 如果用户手动输入了非代理地址，更新下拉菜单状态
                if (modeSelect) {
                    if (e.target.value.includes('localhost:3000')) {
                        modeSelect.value = 'local_proxy';
                    } else {
                        modeSelect.value = 'custom';
                    }
                }
            });
        }

        if (keyInput) {
            keyInput.value = state.whisperSettings.key || '';
            keyInput.addEventListener('change', (e) => {
                state.whisperSettings.key = e.target.value;
            });
        }

        if (modelInput) {
            modelInput.value = state.whisperSettings.model || 'whisper-1';
            modelInput.addEventListener('change', (e) => {
                state.whisperSettings.model = e.target.value;
            });
        }

        if (fetchModelsBtn) {
            fetchModelsBtn.addEventListener('click', handleFetchWhisperModels);
        }

        if (modelSelect) {
            modelSelect.addEventListener('change', (e) => {
                const selectedModel = e.target.value;
                if (selectedModel) {
                    modelInput.value = selectedModel;
                    state.whisperSettings.model = selectedModel;
                }
            });
        }
    }

    function setupMinimaxListeners() {
        const groupIdInput = document.getElementById('minimax-group-id');
        const apiKeyInput = document.getElementById('minimax-api-key');
        const modelInput = document.getElementById('minimax-model');
        const modelSelect = document.getElementById('minimax-model-select');

        if (groupIdInput) {
            groupIdInput.value = state.minimaxSettings.groupId || '';
            groupIdInput.addEventListener('change', (e) => {
                state.minimaxSettings.groupId = e.target.value;
            });
        }

        if (apiKeyInput) {
            apiKeyInput.value = state.minimaxSettings.key || '';
            apiKeyInput.addEventListener('change', (e) => {
                state.minimaxSettings.key = e.target.value;
            });
        }

        if (modelInput) {
            modelInput.value = state.minimaxSettings.model || 'speech-01-turbo';
            modelInput.addEventListener('change', (e) => {
                state.minimaxSettings.model = e.target.value;
                // 如果输入的值在下拉框中存在，同步选中
                if (modelSelect) {
                    modelSelect.value = e.target.value;
                }
            });
        }

        if (modelSelect) {
            // 初始化选中状态
            if (state.minimaxSettings.model) {
                modelSelect.value = state.minimaxSettings.model;
            }
            
            modelSelect.addEventListener('change', (e) => {
                const selectedModel = e.target.value;
                if (selectedModel) {
                    if (modelInput) modelInput.value = selectedModel;
                    state.minimaxSettings.model = selectedModel;
                }
            });
        }
    }

    async function generateMinimaxTTS(text, voiceId) {
        const settings = state.minimaxSettings;
        
        // 调试日志
        console.log('Generating Minimax TTS...', {
            url: settings.url,
            hasKey: !!settings.key,
            groupId: settings.groupId,
            model: settings.model,
            text: text,
            voiceId: voiceId
        });

        if (!settings.key) {
            alert('Minimax API Key 未配置');
            return null;
        }
        
        // GroupID 检查：虽然通常需要，但我们尝试允许为空，看看 API 是否能处理（或者用户填在 URL 里了？）
        let url = settings.url;
        if (settings.groupId) {
            // 检查 URL 是否已有参数
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}GroupId=${settings.groupId}`;
        } else {
            console.warn('Minimax GroupID is empty. Request might fail.');
        }

        try {
            console.log('Requesting Minimax TTS URL:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${settings.key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: settings.model || 'speech-01-turbo',
                    text: text,
                    stream: false,
                    voice_setting: {
                        voice_id: voiceId || 'male-qn-qingse',
                        speed: 1.0,
                        vol: 1.0,
                        pitch: 0
                    }
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error(`Minimax API HTTP Error: ${response.status}`, errText);
                alert(`语音生成失败 (HTTP ${response.status}): ${errText}`);
                return null;
            }

            const data = await response.json();
            console.log('Minimax API Response:', data);

            if (data.base_resp && data.base_resp.status_code !== 0) {
                console.error('Minimax API returned error:', data.base_resp);
                alert(`语音生成API错误: ${data.base_resp.status_msg} (Code: ${data.base_resp.status_code})`);
                return null;
            }
            
            // Minimax T2A v2 返回的 data.data.audio 是 hex string
            if (data.data && data.data.audio) {
                const hexAudio = data.data.audio;
                // 将 hex 转为 base64
                const match = hexAudio.match(/.{1,2}/g);
                if (!match) {
                     console.error('Invalid hex audio data');
                     return null;
                }
                const bytes = new Uint8Array(match.map(byte => parseInt(byte, 16)));
                
                // 使用 Blob 和 FileReader 转换，避免大字符串栈溢出
                const blob = new Blob([bytes], { type: 'audio/mp3' });
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            } else if (data.base64) {
                return `data:audio/mp3;base64,${data.base64}`;
            } else if (data.audio) {
                 return `data:audio/mp3;base64,${data.audio}`;
            } else {
                console.error('Minimax response format unknown:', JSON.stringify(data));
                alert('语音生成失败：未知的响应格式，请检查控制台日志');
                return null;
            }

        } catch (error) {
            console.error('Minimax TTS generation failed:', error);
            alert(`语音生成异常: ${error.message}`);
            return null;
        }
    }

    async function handleFetchWhisperModels() {
        const url = state.whisperSettings.url;
        const key = state.whisperSettings.key;
        const btn = document.getElementById('fetch-whisper-models');
        const select = document.getElementById('whisper-model-select');

        if (!url) {
            alert('请先输入API地址');
            return;
        }

        const originalText = btn.textContent;
        btn.textContent = '拉取中...';
        btn.disabled = true;

        try {
            // 尝试适配不同的API格式，通常是 /v1/models
            let fetchUrl = url;
            // 移除末尾的斜杠
            if (fetchUrl.endsWith('/')) {
                fetchUrl = fetchUrl.slice(0, -1);
            }
            
            // 如果不是以 /models 结尾，尝试添加
            if (!fetchUrl.endsWith('/models')) {
                // 如果是以 /v1 结尾，直接加 /models
                if (fetchUrl.endsWith('/v1')) {
                    fetchUrl += '/models';
                } else {
                    // 否则尝试加 /v1/models 或 /models
                    // 这里简单处理，假设用户输入的是 base url
                    fetchUrl += '/models';
                }
            }

            const headers = {};
            if (key) {
                headers['Authorization'] = `Bearer ${key}`;
            }

            const response = await fetch(fetchUrl, { headers });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const models = data.data || data.models || [];

            select.innerHTML = '<option value="">请选择模型</option>';
            
            if (models.length === 0) {
                alert('未获取到模型列表');
                return;
            }

            models.forEach(model => {
                const id = model.id || model;
                const option = document.createElement('option');
                option.value = id;
                option.textContent = id;
                select.appendChild(option);
            });

            select.classList.remove('hidden');
            alert(`成功获取 ${models.length} 个模型`);

        } catch (error) {
            console.error('获取Whisper模型失败:', error);
            alert('获取模型失败，请检查API地址和密钥是否正确，或跨域设置。');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    // --- 身份管理功能 ---

    let currentEditingPersonaId = null;

    function renderMeTab() {
        const container = document.getElementById('me-profile-container');
        if (!container) return;

        // 确保 userProfile 存在
        if (!state.userProfile) {
            state.userProfile = {
                name: 'User Name',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                bgImage: '',
                desc: '点击此处添加个性签名',
                wxid: 'wxid_123456'
            };
        }

        const { name, wxid, avatar, bgImage, desc } = state.userProfile;
        const bg = bgImage || '';

        container.innerHTML = `
            <div class="me-profile-card">
                <div class="me-bg" id="me-bg-trigger" style="background-image: url('${bg}'); background-color: ${bg ? 'transparent' : '#ccc'};"></div>
                <div class="me-info">
                    <div class="me-avatar-row">
                        <img class="me-avatar" id="me-avatar-trigger" src="${avatar}">
                    </div>
                    <div class="me-name" id="me-name-trigger">${name}</div>
                    <div class="me-id">微信号：<span id="me-id-trigger">${wxid}</span></div>
                    <div class="me-desc" id="me-desc-trigger">${desc}</div>
                </div>
            </div>
            
            <div class="ios-list-group">
                <div class="list-item" id="open-wallet-btn" style="cursor: pointer;">
                    <div class="list-content">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-wallet" style="color: #FF9500; font-size: 20px; width: 24px; text-align: center;"></i>
                            <label style="cursor: pointer;">钱包</label>
                        </div>
                        <i class="fas fa-chevron-right" style="color: #ccc;"></i>
                    </div>
                </div>
            </div>
        `;

        // 绑定事件
        const avatarInput = document.getElementById('me-avatar-input');
        const bgInput = document.getElementById('me-bg-input');

        document.getElementById('me-avatar-trigger').addEventListener('click', () => avatarInput.click());
        document.getElementById('me-bg-trigger').addEventListener('click', () => bgInput.click());
        
        document.getElementById('open-wallet-btn').addEventListener('click', () => {
            renderWallet();
            document.getElementById('wallet-screen').classList.remove('hidden');
        });

        avatarInput.onchange = (e) => handleMeImageUpload(e, 'avatar');
        bgInput.onchange = (e) => handleMeImageUpload(e, 'bgImage');

        makeEditable('me-name-trigger', 'name');
        makeEditable('me-id-trigger', 'wxid');
        makeEditable('me-desc-trigger', 'desc');
    }

    function handleMeImageUpload(e, type) {
        const file = e.target.files[0];
        if (!file) return;
        
        const maxWidth = type === 'avatar' ? 300 : 800;
        compressImage(file, maxWidth, 0.7).then(base64 => {
            updateUserProfile(type, base64);
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
        e.target.value = ''; // 重置，允许重复选择同一文件
    }

    function makeEditable(elementId, field) {
        const el = document.getElementById(elementId);
        el.addEventListener('click', () => {
            const currentText = el.textContent;
            const input = document.createElement(field === 'desc' ? 'textarea' : 'input');
            input.value = currentText === '点击此处添加个性签名' ? '' : currentText;
            input.className = 'editable-input'; // 需要在CSS中定义，或者内联样式
            input.style.width = '100%';
            input.style.fontSize = 'inherit';
            input.style.fontFamily = 'inherit';
            
            el.replaceWith(input);
            input.focus();

            const save = () => {
                const newValue = input.value.trim();
                updateUserProfile(field, newValue);
                // renderMeTab 会重新渲染，所以不需要手动替换回 div
            };

            input.addEventListener('blur', save);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && field !== 'desc') {
                    save();
                }
            });
        });
    }

    function updateUserProfile(field, value) {
        if (!state.userProfile) {
            state.userProfile = {
                name: 'User Name',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                bgImage: '',
                momentsBgImage: '',
                desc: '点击此处添加个性签名',
                wxid: 'wxid_123456'
            };
        }
        
        // 特殊处理个性签名，如果为空则恢复默认提示
        if (field === 'desc' && !value) {
            value = '点击此处添加个性签名';
        }
        
        state.userProfile[field] = value;
        saveConfig();
        renderMeTab();
        renderMoments();
    }

    function renderMoments() {
        const container = document.getElementById('moments-container');
        if (!container) return;

        // 确保 userProfile 存在
        if (!state.userProfile) {
            state.userProfile = {
                name: 'User Name',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                bgImage: '',
                momentsBgImage: '',
                desc: '点击此处添加个性签名',
                wxid: 'wxid_123456'
            };
        }

        const { name, avatar, momentsBgImage, desc } = state.userProfile;
        const bg = momentsBgImage || '';

        // 检查是否已经渲染过结构
        const coverEl = document.getElementById('moments-cover-trigger');
        if (coverEl) {
            // 更新内容
            coverEl.style.backgroundImage = `url('${bg}')`;
            coverEl.style.backgroundColor = ''; // 移除内联背景色，交由CSS控制
            
            document.getElementById('moments-user-name').textContent = name;
            document.getElementById('moments-user-avatar').src = avatar;
        } else {
            // 首次渲染
            container.innerHTML = `
                <div class="moments-header">
                    <div class="moments-cover" id="moments-cover-trigger" style="background-image: url('${bg}');">
                        <div class="moments-user-info">
                            <span class="moments-user-name" id="moments-user-name">${name}</span>
                            <img class="moments-user-avatar" id="moments-user-avatar" src="${avatar}">
                        </div>
                    </div>
                </div>
                <div class="moments-list" id="moments-list-content">
                    <!-- 朋友圈列表内容 -->
                </div>
            `;
            
            // 绑定事件
            document.getElementById('moments-cover-trigger').addEventListener('click', () => {
                document.getElementById('moments-bg-input').click();
            });
        }

        renderMomentsList();
    }

    function renderMomentsList() {
        const listContainer = document.getElementById('moments-list-content');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        if (!state.moments) state.moments = [];

        // 按时间倒序
        const sortedMoments = [...state.moments].sort((a, b) => b.time - a.time);

        sortedMoments.forEach(moment => {
            let avatar, name;
            
            if (moment.contactId === 'me') {
                avatar = state.userProfile.avatar;
                name = state.userProfile.name;
            } else {
                const contact = state.contacts.find(c => c.id === moment.contactId);
                if (contact) {
                    avatar = contact.avatar;
                    name = contact.remark || contact.nickname || contact.name;
                } else {
                    avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown';
                    name = '未知用户';
                }
            }

            const item = document.createElement('div');
            item.className = 'moment-item';
            
            // 图片HTML
            let imagesHtml = '';
            if (moment.images && moment.images.length > 0) {
                const gridClass = moment.images.length === 1 ? 'single' : 'grid';
                imagesHtml = `<div class="moment-images ${gridClass}">
                    ${moment.images.map(img => `<img src="${img}" class="moment-img">`).join('')}
                </div>`;
            }

            // 点赞列表HTML
            let likesHtml = '';
            if (moment.likes && moment.likes.length > 0) {
                likesHtml = `<div class="moment-likes"><i class="far fa-heart"></i> ${moment.likes.join(', ')}</div>`;
            }

            // 评论列表HTML
            let commentsHtml = '';
            if (moment.comments && moment.comments.length > 0) {
                commentsHtml = `<div class="moment-comments">
                    ${moment.comments.map((c, index) => {
                        let displayName = c.user;
                        // 尝试修正显示名称：如果评论者是动态发布者本人，且有备注，则显示备注
                        if (moment.contactId !== 'me') {
                            const contact = state.contacts.find(cnt => cnt.id === moment.contactId);
                            if (contact && contact.remark) {
                                if (c.user === contact.name || c.user === contact.nickname) {
                                    displayName = contact.remark;
                                }
                            }
                        }

                        let userHtml = `<span class="comment-user">${displayName}</span>`;
                        if (c.replyTo) {
                            userHtml += `回复<span class="comment-user">${c.replyTo}</span>`;
                        }
                        return `<div class="comment-item" onclick="event.stopPropagation(); window.handleCommentClick(this, ${moment.id}, ${index}, '${c.user}')" style="display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; padding: 2px 4px; border-radius: 2px;">
                            <span style="flex: 1;">${userHtml}：<span class="comment-content">${c.content}</span></span>
                            <span class="comment-delete-btn" style="display: none; color: #576b95; margin-left: 8px; font-size: 12px; padding: 0 4px;">✕</span>
                        </div>`;
                    }).join('')}
                </div>`;
            }

            // 底部区域HTML
            let footerHtml = '';
            if (likesHtml || commentsHtml) {
                footerHtml = `<div class="moment-likes-comments">${likesHtml}${commentsHtml}</div>`;
            }

            // 时间格式化 (简单处理)
            const date = new Date(moment.time);
            const timeStr = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

            item.innerHTML = `
                <img src="${avatar}" class="moment-avatar">
                <div class="moment-content">
                    <div class="moment-name">${name}</div>
                    <div class="moment-text">${moment.content}</div>
                    ${imagesHtml}
                    <div class="moment-info">
                        <div style="display: flex; align-items: center;">
                            <span class="moment-time">${timeStr}</span>
                            <span class="moment-delete" onclick="window.deleteMoment(${moment.id})">删除</span>
                        </div>
                        <div style="position: relative;">
                            <button class="moment-action-btn" onclick="window.toggleActionMenu(this, ${moment.id})"><i class="fas fa-ellipsis-h"></i></button>
                            <div class="action-menu" id="action-menu-${moment.id}">
                                <button class="action-menu-btn" onclick="window.toggleLike(${moment.id})"><i class="far fa-heart"></i> 赞</button>
                                <button class="action-menu-btn" onclick="window.showCommentInput(${moment.id})"><i class="far fa-comment"></i> 评论</button>
                            </div>
                        </div>
                    </div>
                    ${footerHtml}
                </div>
            `;
            
            listContainer.appendChild(item);
        });
    }

    window.deleteMoment = function(id) {
        if (confirm('确定删除这条动态吗？')) {
            state.moments = state.moments.filter(m => m.id !== id);
            saveConfig();
            renderMomentsList();
        }
    };

    window.handleCommentClick = function(el, momentId, index, user) {
        const deleteBtn = el.querySelector('.comment-delete-btn');
        
        // 检查是否已经显示
        if (deleteBtn.style.display !== 'none') {
            // 已经显示了，再次点击 -> 回复
            window.replyToComment(momentId, user);
        } else {
            // 未显示 -> 显示删除按钮，隐藏其他的
            document.querySelectorAll('.comment-delete-btn').forEach(btn => btn.style.display = 'none');
            document.querySelectorAll('.comment-item').forEach(item => item.style.backgroundColor = '');
            
            deleteBtn.style.display = 'inline-block';
            el.style.backgroundColor = '#e5e5e5'; // 选中背景
            
            // 绑定删除事件
            deleteBtn.onclick = function(e) {
                e.stopPropagation();
                window.deleteComment(momentId, index);
            };
            
            // 点击其他地方隐藏
            const closeDelete = () => {
                deleteBtn.style.display = 'none';
                el.style.backgroundColor = '';
                document.removeEventListener('click', closeDelete);
            };
            setTimeout(() => document.addEventListener('click', closeDelete), 0);
        }
    };

    window.deleteComment = function(momentId, commentIndex) {
        if (confirm('确定删除这条评论吗？')) {
            const moment = state.moments.find(m => m.id === momentId);
            if (moment && moment.comments) {
                moment.comments.splice(commentIndex, 1);
                saveConfig();
                renderMomentsList();
            }
        }
    };

    window.toggleActionMenu = function(btn, id) {
        // 关闭其他打开的菜单
        document.querySelectorAll('.action-menu.show').forEach(el => {
            if (el.id !== `action-menu-${id}`) el.classList.remove('show');
        });
        
        const menu = document.getElementById(`action-menu-${id}`);
        menu.classList.toggle('show');
        
        // 点击其他地方关闭
        const closeMenu = (e) => {
            if (!btn.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('show');
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    };

    window.toggleLike = function(id, userName = null) {
        const moment = state.moments.find(m => m.id === id);
        if (!moment) return;

        if (!moment.likes) moment.likes = [];
        
        const likerName = userName || state.userProfile.name;
        const index = moment.likes.indexOf(likerName);
        
        if (index > -1) {
            moment.likes.splice(index, 1);
        } else {
            moment.likes.push(likerName);
        }
        
        saveConfig();
        renderMomentsList();
    };

    window.showCommentInput = function(id) {
        const content = prompt('请输入评论内容：');
        if (content) {
            window.submitComment(id, content);
        }
        // 关闭菜单
        const menu = document.getElementById(`action-menu-${id}`);
        if (menu) menu.classList.remove('show');
    };

    window.replyToComment = function(momentId, toUser) {
        if (toUser === state.userProfile.name) {
            alert('不能回复自己');
            return;
        }
        const content = prompt(`回复 ${toUser}：`);
        if (content) {
            window.submitComment(momentId, content, toUser);
        }
    };

    window.submitComment = function(id, content, replyTo = null, userName = null) {
        const moment = state.moments.find(m => m.id === id);
        if (!moment) return;

        if (!moment.comments) moment.comments = [];
        
        const commenterName = userName || state.userProfile.name;

        moment.comments.push({
            user: commenterName,
            content: content,
            replyTo: replyTo
        });

        // 同步到聊天记录 (如果是用户评论AI的动态)
        if (moment.contactId !== 'me' && !userName) {
            const contactId = moment.contactId;
            // 截取动态内容防止过长
            let momentText = moment.content;
            if (momentText.length > 50) momentText = momentText.substring(0, 50) + '...';
            
            let chatMsg = `[评论了你的动态: "${momentText}"] ${content}`;
            if (replyTo) {
                chatMsg = `[评论了你的动态: "${momentText}"] (回复 ${replyTo}) ${content}`;
            }
            
            if (!state.chatHistory[contactId]) {
                state.chatHistory[contactId] = [];
            }
            state.chatHistory[contactId].push({
                role: 'user',
                content: chatMsg
            });
            
            // 如果当前正在该聊天窗口，更新UI
            if (state.currentChatContactId === contactId) {
                appendMessageToUI(chatMsg, true);
                scrollToBottom();
            }
        }
        
        saveConfig();
        renderMomentsList();

        // 触发AI回复评论 (如果是AI发的动态，且不是AI自己评论的)
        if (moment.contactId !== 'me' && !userName) {
            setTimeout(() => {
                generateAiCommentReply(moment, { user: state.userProfile.name, content: content, replyTo: replyTo });
            }, 2000);
        }
    };

    async function generateAiCommentReply(moment, userComment) {
        const contact = state.contacts.find(c => c.id === moment.contactId);
        if (!contact) return;

        const settings = state.aiSettings.url ? state.aiSettings : state.aiSettings2;
        if (!settings.url || !settings.key) return;

        try {
            let contextDesc = `你的朋友 ${userComment.user} 在下面评论说：“${userComment.content}”`;
            if (userComment.replyTo) {
                contextDesc = `你的朋友 ${userComment.user} 回复了 ${userComment.replyTo} 说：“${userComment.content}”`;
            }

            let systemPrompt = `你现在扮演 ${contact.name}。
人设：${contact.persona || '无'}

【当前情境】
你发了一条朋友圈：“${moment.content}”
${contextDesc}

【任务】
请回复 ${userComment.user}。
回复要求：
1. 简短自然，像微信朋友圈回复。
2. 符合你的人设。
3. 直接返回回复内容，不要包含任何解释。`;

            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: '请回复' }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) return;

            const data = await response.json();
            let replyContent = data.choices[0].message.content.trim();
            
            // 去除可能的引号
            if ((replyContent.startsWith('"') && replyContent.endsWith('"')) || (replyContent.startsWith('“') && replyContent.endsWith('”'))) {
                replyContent = replyContent.slice(1, -1);
            }

            // 添加回复到评论列表
            if (!moment.comments) moment.comments = [];
            moment.comments.push({
                user: contact.remark || contact.name,
                content: replyContent,
                replyTo: userComment.user
            });
            
            saveConfig();
            renderMomentsList();

        } catch (error) {
            console.error('AI回复评论失败:', error);
        }
    }

    function addMoment(contactId, content, images = []) {
        if (!state.moments) state.moments = [];
        
        const newMoment = {
            id: Date.now(),
            contactId,
            content,
            images,
            time: Date.now(),
            likes: [],
            comments: []
        };
        
        state.moments.unshift(newMoment);
        saveConfig();
        renderMomentsList();
    }

    async function generateAiMoment(isSilent = false) {
        if (!state.currentChatContactId) {
            if (!isSilent) alert('请先进入一个聊天窗口');
            return;
        }
        
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        const settings = state.aiSettings.url ? state.aiSettings : state.aiSettings2;
        if (!settings.url || !settings.key) {
            if (!isSilent) alert('请先在设置中配置AI API');
            return;
        }

        const btn = document.getElementById('trigger-ai-moment-btn');
        let originalText = '';
        if (btn) {
            originalText = btn.textContent;
            btn.textContent = '生成中...';
            btn.disabled = true;
        }

        try {
            let systemPrompt = `你现在扮演 ${contact.name}。
人设：${contact.persona || '无'}
请生成一条朋友圈动态内容。
内容要求：
1. 符合你的人设。
2. 像真实的朋友圈，可以是心情、生活分享、吐槽等。
3. 不要太长，通常在100字以内。
4. 直接返回内容文本，不要包含任何解释、引号或前缀后缀。`;

            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: '发一条朋友圈' }
                    ],
                    temperature: 0.8
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            let content = data.choices[0].message.content.trim();
            
            // 去除可能的引号
            if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith('“') && content.endsWith('”'))) {
                content = content.slice(1, -1);
            }

            addMoment(contact.id, content);
            
            if (!isSilent) {
                alert('动态发布成功！');
                document.getElementById('chat-settings-screen').classList.add('hidden');
            }

        } catch (error) {
            console.error('AI生成动态失败:', error);
            if (!isSilent) alert('生成失败，请检查配置');
        } finally {
            if (btn) {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }
    }

    async function generateDailyItinerary(forceRefresh = false) {
        if (!state.currentChatContactId) {
            alert('请先进入一个聊天窗口');
            return;
        }

        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `itinerary_${contact.id}_${today}`;
        
        // 检查缓存
        if (!forceRefresh) {
            try {
                const cachedData = await localforage.getItem(cacheKey);
                if (cachedData) {
                    // localForage 自动处理 JSON 解析
                    renderItinerary(cachedData.events);
                    return;
                }
            } catch (e) {
                console.error('读取行程缓存失败', e);
            }
        }

        const settings = state.aiSettings.url ? state.aiSettings : state.aiSettings2;
        if (!settings.url || !settings.key) {
            alert('请先在设置中配置AI API');
            return;
        }

        // 显示加载状态
        const container = document.querySelector('.timeline-container');
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;"><i class="fas fa-spinner fa-spin"></i> 正在生成行程...</div>';
        
        const refreshBtn = document.getElementById('refresh-location-btn');
        if (refreshBtn) refreshBtn.classList.add('fa-spin');

        // 准备上下文
        let worldbookContext = '';
        if (state.worldbook && state.worldbook.length > 0 && contact.linkedWbCategories) {
            const activeEntries = state.worldbook.filter(e => e.enabled && contact.linkedWbCategories.includes(e.categoryId));
            if (activeEntries.length > 0) {
                worldbookContext = activeEntries.map(e => e.content).join('\n');
            }
        }

        let chatContext = '';
        const history = state.chatHistory[contact.id] || [];
        if (history.length > 0) {
            chatContext = history.slice(-10).map(m => `${m.role === 'user' ? '用户' : contact.name}: ${m.content}`).join('\n');
        }

        const systemPrompt = `你是一个行程生成助手。请根据以下信息，生成${contact.name}今天从起床到现在的日常行程。`;
        const userPrompt = `角色设定：${contact.persona || '无'}
关联背景：${worldbookContext || '无'}
最近的对话：${chatContext || '无'}

请生成5-8个行程事件，每个事件包含时间段（如08:00-09:00）、地点（如家中、公司）和描述（约50字，第三人称叙述）。
请直接返回JSON数组格式，不要包含Markdown代码块标记。
JSON格式示例：
[
  {
    "time": "08:00-08:30",
    "location": "家中",
    "description": "起床洗漱..."
  }
]`;

        try {
            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            let content = data.choices[0].message.content.trim();
            
            // 清理可能的Markdown标记
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();
            
            let events = [];
            try {
                events = JSON.parse(content);
                if (!Array.isArray(events)) {
                    // 尝试提取数组
                    if (events.events && Array.isArray(events.events)) {
                        events = events.events;
                    } else {
                        throw new Error('返回格式不是数组');
                    }
                }
            } catch (e) {
                console.error('JSON解析失败', e);
                alert('生成的数据格式有误，请重试');
                container.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff3b30;">生成失败，请重试</div>';
                return;
            }

            // 缓存数据
            const itineraryData = {
                chatId: contact.id,
                generatedDate: today,
                events: events
            };
            await localforage.setItem(cacheKey, itineraryData);

            renderItinerary(events);

        } catch (error) {
            console.error('生成行程失败:', error);
            alert(`生成失败: ${error.message}`);
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff3b30;">生成失败，请检查网络或配置</div>';
        } finally {
            if (refreshBtn) refreshBtn.classList.remove('fa-spin');
        }
    }

    async function generateNewItinerary(contact) {
        if (!contact) return;
        if (contact.isGeneratingItinerary) return; // 防止重复触发

        const settings = state.aiSettings.url ? state.aiSettings : state.aiSettings2;
        if (!settings.url || !settings.key) return;

        contact.isGeneratingItinerary = true;
        showItineraryNotification('正在生成行程...');

        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `itinerary_${contact.id}_${today}`;
        
        // 获取现有行程
        let existingEvents = [];
        try {
            const itinerary = await localforage.getItem(cacheKey);
            if (itinerary) {
                existingEvents = itinerary.events || [];
            }
        } catch (e) {
            console.error('读取行程缓存失败', e);
        }

        // 准备上下文
        let worldbookContext = '';
        if (state.worldbook && state.worldbook.length > 0 && contact.linkedWbCategories) {
            const activeEntries = state.worldbook.filter(e => e.enabled && contact.linkedWbCategories.includes(e.categoryId));
            if (activeEntries.length > 0) {
                worldbookContext = activeEntries.map(e => e.content).join('\n');
            }
        }

        let chatContext = '';
        const history = state.chatHistory[contact.id] || [];
        // 获取自上次生成以来的新消息
        const newMessages = history.slice(contact.lastItineraryIndex || 0);
        if (newMessages.length > 0) {
            chatContext = newMessages.map(m => `${m.role === 'user' ? '用户' : contact.name}: ${m.content}`).join('\n');
        } else {
            // 如果没有新消息，取最近的几条
            chatContext = history.slice(-5).map(m => `${m.role === 'user' ? '用户' : contact.name}: ${m.content}`).join('\n');
        }

        // 获取最后一条行程的时间，作为新行程的参考
        let lastEventTime = "09:00";
        if (existingEvents.length > 0) {
            // 假设按时间排序，取最后一个
            // 但我们的 renderItinerary 是倒序显示的，所以数据可能是正序或乱序
            // 最好先排序
            const sortedEvents = [...existingEvents].sort((a, b) => {
                const timeA = a.time.split('-')[0];
                const timeB = b.time.split('-')[0];
                return timeA.localeCompare(timeB);
            });
            const lastEvent = sortedEvents[sortedEvents.length - 1];
            if (lastEvent && lastEvent.time) {
                lastEventTime = lastEvent.time.split('-')[1] || lastEvent.time.split('-')[0]; // 取结束时间或开始时间
            }
        }

        const systemPrompt = `你是一个行程生成助手。请根据以下信息，为${contact.name}生成一条新的行程事件。`;
        const userPrompt = `角色设定：${contact.persona || '无'}
关联背景：${worldbookContext || '无'}
最近的对话：${chatContext || '无'}
上一条行程结束时间：${lastEventTime}

请生成 1 条新的行程事件，接续在上一条行程之后。
包含时间段（如${lastEventTime}-xx:xx）、地点和描述（约30字，第三人称叙述）。
请直接返回JSON对象格式（不是数组），不要包含Markdown代码块标记。
JSON格式示例：
{
  "time": "10:00-10:30",
  "location": "公司",
  "description": "到达公司开始工作..."
}`;

        try {
            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            let content = data.choices[0].message.content.trim();
            
            // 清理可能的Markdown标记
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();
            
            let newEvent = null;
            try {
                newEvent = JSON.parse(content);
                // 如果返回的是数组，取第一个
                if (Array.isArray(newEvent)) {
                    newEvent = newEvent[0];
                }
            } catch (e) {
                console.error('JSON解析失败', e);
                return;
            }

            if (newEvent) {
                // 添加生成时间戳，用于显示
                newEvent.generatedAt = Date.now();
                
                existingEvents.push(newEvent);
                
                // 更新缓存
                const itineraryData = {
                    chatId: contact.id,
                    generatedDate: today,
                    events: existingEvents
                };
                await localforage.setItem(cacheKey, itineraryData);

                // 更新联系人状态
                contact.lastItineraryIndex = history.length;
                contact.messagesSinceLastItinerary = 0;
                saveConfig();

                // 如果当前正在查看该联系人的行程，刷新显示
                if (state.currentChatContactId === contact.id && !document.getElementById('location-app').classList.contains('hidden')) {
                    renderItinerary(existingEvents);
                }
                
                console.log('自动生成新行程成功', newEvent);
                showItineraryNotification('行程生成成功', 2000, 'success');
            }

        } catch (error) {
            console.error('生成新行程失败:', error);
            showItineraryNotification('生成失败', 2000, 'error');
        } finally {
            contact.isGeneratingItinerary = false;
        }
    }

    function renderItinerary(events) {
        const container = document.querySelector('.timeline-container');
        if (!container) return;

        container.innerHTML = '';

        if (!events || events.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">暂无行程</div>';
            return;
        }

        // 确保按时间排序
        events.sort((a, b) => {
            const timeA = a.time.split('-')[0];
            const timeB = b.time.split('-')[0];
            return timeA.localeCompare(timeB);
        });

        // 倒序排列，最新的在上面
        events.reverse().forEach(event => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            // 提取开始时间
            const startTime = event.time.split('-')[0].trim();
            
            // 生成时间显示 (如果有)
            let generatedTimeHtml = '';
            if (event.generatedAt) {
                const genDate = new Date(event.generatedAt);
                const genTimeStr = `${genDate.getHours()}:${genDate.getMinutes().toString().padStart(2, '0')}`;
                generatedTimeHtml = `<div style="font-size: 10px; color: #ccc; margin-top: 5px; text-align: right;">生成于 ${genTimeStr}</div>`;
            }

            item.innerHTML = `
                <div class="timeline-time">${startTime}</div>
                <div class="timeline-content">
                    <div class="timeline-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
                    <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${event.time}</div>
                    <div class="timeline-desc">${event.description}</div>
                    ${generatedTimeHtml}
                </div>
            `;
            container.appendChild(item);
        });
    }

    function openLocationApp() {
        const locationApp = document.getElementById('location-app');
        locationApp.classList.remove('hidden');
        document.getElementById('chat-more-panel').classList.add('hidden');
        
        // 尝试生成或加载行程
        generateDailyItinerary();
    }

    function openItinerarySettings() {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        document.getElementById('auto-itinerary-toggle').checked = contact.autoItineraryEnabled || false;
        document.getElementById('auto-itinerary-interval').value = contact.autoItineraryInterval || 10;
        
        document.getElementById('itinerary-settings-modal').classList.remove('hidden');
    }

    function handleSaveItinerarySettings() {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        const enabled = document.getElementById('auto-itinerary-toggle').checked;
        const interval = parseInt(document.getElementById('auto-itinerary-interval').value);

        contact.autoItineraryEnabled = enabled;
        contact.autoItineraryInterval = isNaN(interval) || interval < 1 ? 10 : interval;

        saveConfig();
        document.getElementById('itinerary-settings-modal').classList.add('hidden');
        alert('行程设置已保存');
    }

    function openPersonaManage() {
        const list = document.getElementById('persona-list');
        list.innerHTML = '';

        // 确保 userProfile 存在
        if (!state.userProfile) {
            state.userProfile = {
                name: 'User Name',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                bgImage: '',
                desc: '点击此处添加个性签名',
                wxid: 'wxid_123456'
            };
        }

        state.userPersonas.forEach(p => {
            const item = document.createElement('div');
            item.className = `persona-item`;
            // 使用全局头像，名字使用身份的名字
            item.innerHTML = `
                <div class="persona-info">
                    <div class="persona-name">${p.name || '未命名身份'}</div>
                </div>
                <button class="ios-btn-small" style="margin-left: 10px;" onclick="event.stopPropagation(); window.editPersona('${p.id}')">设置</button>
            `;
            // item.addEventListener('click', () => switchPersona(p.id));
            list.appendChild(item);
        });

        document.getElementById('persona-manage-modal').classList.remove('hidden');
    }

    window.editPersona = function(id) {
        // 关闭管理弹窗，打开编辑弹窗
        document.getElementById('persona-manage-modal').classList.add('hidden');
        openPersonaEdit(parseInt(id));
    }

    function switchPersona(id) {
        state.currentUserPersonaId = id;
        saveConfig();
        renderMeTab();
        document.getElementById('persona-manage-modal').classList.add('hidden');
    }

    function openPersonaEdit(id = null) {
        currentEditingPersonaId = id;
        const modal = document.getElementById('persona-edit-modal');
        const title = document.getElementById('persona-modal-title');
        const deleteBtn = document.getElementById('delete-persona-btn');
        
        if (id) {
            const p = state.userPersonas.find(p => p.id === id);
            if (p) {
                title.textContent = '编辑身份信息';
                document.getElementById('persona-name').value = p.name || '';
                document.getElementById('persona-ai-prompt').value = p.aiPrompt || '';
                deleteBtn.style.display = 'block';
            }
        } else {
            title.textContent = '新建身份';
            document.getElementById('persona-name').value = '';
            document.getElementById('persona-ai-prompt').value = '';
            deleteBtn.style.display = 'none';
        }
        
        modal.classList.remove('hidden');
    }

    function handleSavePersona() {
        const name = document.getElementById('persona-name').value;
        const aiPrompt = document.getElementById('persona-ai-prompt').value;

        if (currentEditingPersonaId) {
            const p = state.userPersonas.find(p => p.id === currentEditingPersonaId);
            if (p) {
                p.name = name;
                p.title = name; // 保持兼容
                p.aiPrompt = aiPrompt;
            }
        } else {
            const newId = Date.now();
            const newPersona = {
                id: newId,
                title: name || '未命名身份',
                name: name || '未命名身份',
                aiPrompt,
                // 以下字段不再使用，但为了兼容性保留或设为空
                personaId: '',
                desc: '',
                avatar: '',
                bgImage: ''
            };
            state.userPersonas.push(newPersona);
            state.currentUserPersonaId = newId; // 自动切换
        }
        
        saveConfig();
        // renderMeTab(); // 资料卡不再随身份变化，不需要重新渲染
        document.getElementById('persona-edit-modal').classList.add('hidden');
    }

    function handleDeletePersona() {
        if (!currentEditingPersonaId) return;
        if (confirm('确定要删除此身份吗？')) {
            state.userPersonas = state.userPersonas.filter(p => p.id !== currentEditingPersonaId);
            if (state.currentUserPersonaId === currentEditingPersonaId) {
                state.currentUserPersonaId = state.userPersonas.length > 0 ? state.userPersonas[0].id : null;
            }
            saveConfig();
            renderMeTab();
            document.getElementById('persona-edit-modal').classList.add('hidden');
        }
    }

    // --- 世界书功能 ---

    let currentEditingEntryId = null;
    let currentEditingCategoryId = null;

    // 渲染分类列表
    function renderWorldbookCategoryList() {
        const list = document.getElementById('worldbook-category-list');
        const emptyState = document.getElementById('worldbook-empty');
        if (!list) return;

        list.innerHTML = '';

        if (!state.wbCategories || state.wbCategories.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        state.wbCategories.forEach(cat => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="list-content column">
                    <div style="font-weight: bold; font-size: 16px;">${cat.name}</div>
                    <div style="font-size: 12px; color: #888;">${cat.desc || '无描述'}</div>
                </div>
                <i class="fas fa-chevron-right" style="color: #ccc;"></i>
            `;
            item.addEventListener('click', () => openWorldbookCategory(cat.id));
            list.appendChild(item);
        });
    }

    // 打开分类详情
    function openWorldbookCategory(categoryId) {
        const cat = state.wbCategories.find(c => c.id === categoryId);
        if (!cat) return;

        state.currentWbCategoryId = categoryId;
        document.getElementById('wb-category-title').textContent = cat.name;
        document.getElementById('worldbook-detail-screen').classList.remove('hidden');
        
        renderWorldbookEntryList(categoryId);
    }

    // 渲染条目列表
    function renderWorldbookEntryList(categoryId) {
        const list = document.getElementById('worldbook-entry-list');
        const emptyState = document.getElementById('worldbook-entry-empty');
        if (!list) return;

        list.innerHTML = '';

        const entries = state.worldbook.filter(e => e.categoryId === categoryId);

        if (entries.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        entries.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'wb-entry';
            // 备注优先，没有备注显示关键字
            const title = entry.remark || (entry.keys && entry.keys.length > 0 ? entry.keys.join(', ') : '无标题');
            
            const toggleIcon = entry.enabled ? 'fa-toggle-on' : 'fa-toggle-off';
            const toggleColor = entry.enabled ? '#34C759' : '#8E8E93'; // iOS Green or Gray

            item.innerHTML = `
                <div class="wb-header">
                    <span class="wb-keys" style="font-weight: bold;">${title}</span>
                    <i class="fas ${toggleIcon}" style="font-size: 24px; color: ${toggleColor}; cursor: pointer;" onclick="event.stopPropagation(); window.toggleWorldbookEntry(${entry.id})"></i>
                </div>
                ${entry.remark ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">关键字: ${entry.keys.join(', ')}</div>` : ''}
                <div class="wb-content">${entry.content}</div>
            `;
            item.addEventListener('click', () => openWorldbookEdit(entry.id));
            list.appendChild(item);
        });
    }

    window.toggleWorldbookEntry = function(id) {
        const entry = state.worldbook.find(e => e.id === id);
        if (entry) {
            entry.enabled = !entry.enabled;
            saveConfig();
            renderWorldbookEntryList(state.currentWbCategoryId);
        }
    };

    // 打开分类编辑
    function openCategoryEdit(categoryId = null) {
        currentEditingCategoryId = categoryId;
        const modal = document.getElementById('category-edit-modal');
        const title = document.getElementById('category-modal-title');
        const nameInput = document.getElementById('cat-name');
        const descInput = document.getElementById('cat-desc');
        const deleteBtn = document.getElementById('delete-category-btn');

        if (categoryId) {
            const cat = state.wbCategories.find(c => c.id === categoryId);
            if (cat) {
                title.textContent = '编辑分类';
                nameInput.value = cat.name;
                descInput.value = cat.desc || '';
                deleteBtn.style.display = 'block';
            }
        } else {
            title.textContent = '新建分类';
            nameInput.value = '';
            descInput.value = '';
            deleteBtn.style.display = 'none';
        }

        modal.classList.remove('hidden');
    }

    // 保存分类
    function handleSaveCategory() {
        const name = document.getElementById('cat-name').value.trim();
        const desc = document.getElementById('cat-desc').value.trim();

        if (!name) {
            alert('请输入分类名称');
            return;
        }

        if (currentEditingCategoryId) {
            const cat = state.wbCategories.find(c => c.id === currentEditingCategoryId);
            if (cat) {
                cat.name = name;
                cat.desc = desc;
                // 更新标题如果正在查看该分类
                if (state.currentWbCategoryId === currentEditingCategoryId) {
                    document.getElementById('wb-category-title').textContent = name;
                }
            }
        } else {
            const newCat = {
                id: Date.now(),
                name,
                desc
            };
            if (!state.wbCategories) state.wbCategories = [];
            state.wbCategories.push(newCat);
        }

        saveConfig();
        renderWorldbookCategoryList();
        document.getElementById('category-edit-modal').classList.add('hidden');
    }

    // 删除分类
    function handleDeleteCategory() {
        if (!currentEditingCategoryId) return;

        if (confirm('确定要删除此分类吗？分类下的所有条目也会被删除！')) {
            // 删除分类下的条目
            state.worldbook = state.worldbook.filter(e => e.categoryId !== currentEditingCategoryId);
            // 删除分类
            state.wbCategories = state.wbCategories.filter(c => c.id !== currentEditingCategoryId);
            
            saveConfig();
            renderWorldbookCategoryList();
            
            // 如果正在查看该分类，退出到列表页
            if (state.currentWbCategoryId === currentEditingCategoryId) {
                document.getElementById('worldbook-detail-screen').classList.add('hidden');
                state.currentWbCategoryId = null;
            }
            
            document.getElementById('category-edit-modal').classList.add('hidden');
        }
    }

    // 打开条目编辑
    function openWorldbookEdit(entryId = null) {
        if (!state.currentWbCategoryId) return;

        currentEditingEntryId = entryId;
        const modal = document.getElementById('worldbook-edit-modal');
        const title = document.getElementById('worldbook-modal-title');
        const remarkInput = document.getElementById('wb-remark');
        const keysInput = document.getElementById('wb-keys');
        const contentInput = document.getElementById('wb-content');
        const deleteBtn = document.getElementById('delete-worldbook-btn');

        if (entryId) {
            const entry = state.worldbook.find(e => e.id === entryId);
            if (entry) {
                title.textContent = '编辑条目';
                remarkInput.value = entry.remark || '';
                keysInput.value = entry.keys ? entry.keys.join(', ') : '';
                contentInput.value = entry.content;
                deleteBtn.style.display = 'block';
            }
        } else {
            title.textContent = '新建条目';
            remarkInput.value = '';
            keysInput.value = '';
            contentInput.value = '';
            deleteBtn.style.display = 'none';
        }

        modal.classList.remove('hidden');
    }

    // 保存条目
    function handleSaveWorldbookEntry() {
        if (!state.currentWbCategoryId) return;

        const remark = document.getElementById('wb-remark').value.trim();
        const keysInput = document.getElementById('wb-keys');
        const contentInput = document.getElementById('wb-content');

        const keys = keysInput.value.split(/[,，]/).map(k => k.trim()).filter(k => k);
        const content = contentInput.value.trim();

        // 关键词不再是必要的，但如果没备注也没关键词，列表不好展示，所以建议至少有一个
        // 用户需求：关键词不是必要的
        
        if (!content) {
            alert('请输入内容');
            return;
        }

        if (currentEditingEntryId) {
            // 编辑现有
            const entry = state.worldbook.find(e => e.id === currentEditingEntryId);
            if (entry) {
                entry.remark = remark;
                entry.keys = keys;
                entry.content = content;
                // enabled 状态保持不变
            }
        } else {
            // 新建
            const newEntry = {
                id: Date.now(),
                categoryId: state.currentWbCategoryId,
                remark: remark,
                keys: keys,
                content: content,
                enabled: true // 默认启用
            };
            if (!state.worldbook) state.worldbook = [];
            state.worldbook.push(newEntry);
        }

        saveConfig();
        renderWorldbookEntryList(state.currentWbCategoryId);
        document.getElementById('worldbook-edit-modal').classList.add('hidden');
    }

    // 删除条目
    function handleDeleteWorldbookEntry() {
        if (!currentEditingEntryId) return;

        if (confirm('确定要删除此条目吗？')) {
            state.worldbook = state.worldbook.filter(e => e.id !== currentEditingEntryId);
            saveConfig();
            renderWorldbookEntryList(state.currentWbCategoryId);
            document.getElementById('worldbook-edit-modal').classList.add('hidden');
        }
    }

    // --- 微信功能 ---

    function handleSaveContact() {
        const name = document.getElementById('contact-name').value;
        const remark = document.getElementById('contact-remark').value;
        const persona = document.getElementById('contact-persona').value;
        const avatarInput = document.getElementById('contact-avatar-upload');
        
        if (!name) {
            alert('请输入姓名');
            return;
        }

        const contact = {
            id: Date.now(),
            name,
            nickname: name, // 初始网名等于姓名
            remark,
            persona,
            style: '正常', // 默认风格
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + name, // 默认头像
            autoItineraryEnabled: false,
            autoItineraryInterval: 10,
            messagesSinceLastItinerary: 0,
            lastItineraryIndex: 0,
            userPerception: [] // 初始化认知信息
        };

        if (avatarInput.files && avatarInput.files[0]) {
            compressImage(avatarInput.files[0], 300, 0.7).then(base64 => {
                contact.avatar = base64;
                saveContactAndClose(contact);
            }).catch(err => {
                console.error('图片压缩失败', err);
                saveContactAndClose(contact);
            });
        } else {
            saveContactAndClose(contact);
        }
    }

    function saveContactAndClose(contact) {
        state.contacts.push(contact);
        saveConfig();
        renderContactList(state.currentContactGroup || 'all');
        
        // 清空输入
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-remark').value = '';
        document.getElementById('contact-persona').value = '';
        document.getElementById('contact-avatar-upload').value = '';
        // 重置预览
        const preview = document.getElementById('contact-avatar-preview');
        if (preview) {
            preview.innerHTML = '<i class="fas fa-camera"></i>';
        }
        
        document.getElementById('add-contact-modal').classList.add('hidden');
        openChat(contact.id);
    }

    function renderContactList(filterGroup = 'all') {
        // 如果是切换分组（而不是初始化或更新数据），添加过渡动画
        const isSwitchingGroup = state.currentContactGroup !== filterGroup;
        state.currentContactGroup = filterGroup; // 记录当前分组状态

        // 1. 渲染分组标签
        const tabsContainer = document.getElementById('contacts-group-tabs');
        if (tabsContainer) {
            tabsContainer.innerHTML = '';
            
            // 添加“全部”标签 (显示为 News 或 All)
            const allTab = document.createElement('div');
            allTab.className = `group-tab ${filterGroup === 'all' ? 'active' : ''}`;
            allTab.textContent = 'News'; // 参考图是 News，也可以叫 All
            allTab.onclick = () => renderContactList('all');
            tabsContainer.appendChild(allTab);

            // 添加其他分组
            if (state.contactGroups) {
                state.contactGroups.forEach(group => {
                    const tab = document.createElement('div');
                    tab.className = `group-tab ${filterGroup === group ? 'active' : ''}`;
                    tab.textContent = group;
                    tab.onclick = () => renderContactList(group);
                    tabsContainer.appendChild(tab);
                });
            }
        }

        // 2. 渲染联系人列表
        const list = document.getElementById('contact-list');
        if (!list) return;

        const renderContent = () => {
            list.innerHTML = '';
            
            let filteredContacts = state.contacts;
            if (filterGroup !== 'all') {
                filteredContacts = state.contacts.filter(c => c.group === filterGroup);
            }

            if (filteredContacts.length === 0) {
                list.innerHTML = '<div class="empty-state">暂无联系人</div>';
                return;
            }
            
            filteredContacts.forEach(contact => {
                const item = document.createElement('div');
                item.className = 'contact-item';
                
                // 获取最后一条消息和时间
                let lastMsgText = ''; // 默认为空，不显示人设
                let lastMsgTime = '';
                let unreadCount = 0; // 模拟未读数

                const history = state.chatHistory[contact.id];
                if (history && history.length > 0) {
                    const lastMsg = history[history.length - 1];
                    if (lastMsg.type === 'text') {
                        lastMsgText = lastMsg.content;
                    } else if (lastMsg.type === 'image') {
                        lastMsgText = '[图片]';
                    } else if (lastMsg.type === 'sticker') {
                        lastMsgText = '[表情包]';
                    } else if (lastMsg.type === 'transfer') {
                        lastMsgText = '[转账]';
                    }
                }

                // 模拟时间 (如果没有真实时间)
                if (!lastMsgTime) {
                    const now = new Date();
                    lastMsgTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                }

                const name = contact.remark || contact.nickname || contact.name;

                item.innerHTML = `
                    <img src="${contact.avatar}" class="contact-avatar">
                    <div class="contact-info">
                        <div class="contact-header-row">
                            <span class="contact-name">${name}</span>
                            <span class="contact-time">${lastMsgTime}</span>
                        </div>
                        <div class="contact-msg-row">
                            <span class="contact-msg-preview">${lastMsgText}</span>
                            ${unreadCount > 0 ? `<div class="unread-badge">${unreadCount}</div>` : ''}
                        </div>
                    </div>
                `;
                item.addEventListener('click', () => openChat(contact.id));
                list.appendChild(item);
            });
        };

        if (isSwitchingGroup) {
            list.classList.add('fade-out');
            setTimeout(() => {
                renderContent();
                list.classList.remove('fade-out');
            }, 150);
        } else {
            renderContent();
        }
    }

    function openChat(contactId) {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return;
        
        // 每次进入聊天页面时，确保退出多选模式
        if (state.isMultiSelectMode) {
            exitMultiSelectMode();
        }

        state.currentChatContactId = contactId;
        document.getElementById('chat-title').textContent = contact.remark || contact.nickname || contact.name;
        
        // 应用聊天背景
        const chatScreen = document.getElementById('chat-screen');
        if (contact.chatBg) {
            chatScreen.style.backgroundImage = `url(${contact.chatBg})`;
            chatScreen.style.backgroundSize = 'cover';
            chatScreen.style.backgroundPosition = 'center';
        } else {
            chatScreen.style.backgroundImage = '';
        }

        // 应用自定义CSS
        const existingStyle = document.getElementById('chat-custom-css');
        if (existingStyle) existingStyle.remove();

        if (contact.customCss) {
            const style = document.createElement('style');
            style.id = 'chat-custom-css';
            style.textContent = contact.customCss;
            document.head.appendChild(style);
        }
        
        chatScreen.classList.remove('hidden');
        
        renderChatHistory(contactId);
    }

    window.openAiProfile = async function() {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        // 检查是否需要初始化资料
        if (!contact.initializedProfile) {
            await generateInitialProfile(contact);
        }

        renderAiProfile(contact);
        document.getElementById('ai-profile-screen').classList.remove('hidden');
    }

    async function generateInitialProfile(contact) {
        const settings = state.aiSettings2.url ? state.aiSettings2 : state.aiSettings;
        if (!settings.url || !settings.key) return;

        // 显示加载状态
        document.getElementById('ai-profile-name').textContent = '正在生成资料...';
        document.getElementById('ai-profile-screen').classList.remove('hidden');

        try {
            const systemPrompt = `请为角色 "${contact.name}" (人设: ${contact.persona || '无'}) 生成一个微信资料卡信息。
请直接返回 JSON 格式，包含以下字段：
1. nickname: 网名/昵称 (符合人设)
2. wxid: 微信号 (字母开头，符合人设)
3. signature: 个性签名 (符合人设的一句话)

示例: {"nickname": "小王", "wxid": "wang_123", "signature": "今天天气不错"}`;

            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: '生成资料' }
                    ],
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            if (response.ok) {
                const data = await response.json();
                let content = data.choices[0].message.content;
                try {
                    const profile = JSON.parse(content);
                    if (profile.nickname) contact.nickname = profile.nickname;
                    if (profile.wxid) contact.wxid = profile.wxid;
                    if (profile.signature) contact.signature = profile.signature;
                    contact.initializedProfile = true;
                    saveConfig();
                } catch (e) {
                    console.error('解析资料JSON失败', e);
                }
            }
        } catch (error) {
            console.error('生成资料失败', error);
        }
    }

    function renderAiProfile(contact) {
        // 填充数据
        document.getElementById('ai-profile-avatar').src = contact.avatar;
        
        // 名字显示逻辑：备注 > 网名 > 姓名
        const displayName = contact.remark || contact.nickname || contact.name;
        document.getElementById('ai-profile-name').textContent = displayName;

        // 昵称显示逻辑：如果有备注，且(网名或姓名)与备注不同，则显示“昵称: xxx”
        const nicknameEl = document.getElementById('ai-profile-nickname');
        const realNickname = contact.nickname || contact.name;
        if (contact.remark && realNickname && contact.remark !== realNickname) {
            nicknameEl.textContent = `昵称: ${realNickname}`;
            nicknameEl.style.display = 'block';
        } else {
            nicknameEl.style.display = 'none';
        }

        // 优先显示自定义微信号，否则显示ID
        const displayId = contact.wxid || contact.id;
        document.getElementById('ai-profile-id').textContent = `微信号: ${displayId}`;
        
        // 背景图
        const bgEl = document.getElementById('ai-profile-bg');
        if (contact.profileBg) {
            bgEl.style.backgroundImage = `url(${contact.profileBg})`;
        } else {
            bgEl.style.backgroundImage = ''; // 默认灰色
        }

        document.getElementById('ai-profile-remark').textContent = contact.remark || '未设置';
        document.getElementById('ai-profile-signature').textContent = contact.signature || '暂无个性签名';
        document.getElementById('ai-profile-relation').textContent = contact.relation || '未设置';

        // 朋友圈预览
        const previewContainer = document.getElementById('ai-moments-preview');
        previewContainer.innerHTML = '';
        
        const contactMoments = state.moments.filter(m => m.contactId === contact.id);
        // 取最新的3张有图片的动态，或者最新的3条动态
        const recentMoments = contactMoments.sort((a, b) => b.time - a.time).slice(0, 4);
        
        recentMoments.forEach(m => {
            if (m.images && m.images.length > 0) {
                const img = document.createElement('img');
                img.src = m.images[0];
                previewContainer.appendChild(img);
            } else {
                // 如果是纯文本，可以用一个默认图标或者文字缩略
                // 这里简单处理，只显示图片
            }
        });
    }

    function handleAiProfileBgUpload(e) {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 800, 0.7).then(base64 => {
            contact.profileBg = base64;
            document.getElementById('ai-profile-bg').style.backgroundImage = `url(${contact.profileBg})`;
            saveConfig();
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
        e.target.value = '';
    }

    function openRelationSelect() {
        const modal = document.getElementById('relation-select-modal');
        const list = document.getElementById('relation-options');
        list.innerHTML = '';

        const relations = ['情侣', '闺蜜', '死党', '基友', '同事', '同学', '家人', '普通朋友'];
        
        relations.forEach(rel => {
            const item = document.createElement('div');
            item.className = 'list-item center-content';
            item.textContent = rel;
            item.onclick = () => setRelation(rel);
            list.appendChild(item);
        });

        modal.classList.remove('hidden');
    }

    function setRelation(relation) {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        contact.relation = relation;
        document.getElementById('ai-profile-relation').textContent = relation;
        saveConfig();
        document.getElementById('relation-select-modal').classList.add('hidden');
    }

    function openAiMoments() {
        if (!state.currentChatContactId) return;
        
        renderPersonalMoments(state.currentChatContactId);
        document.getElementById('personal-moments-screen').classList.remove('hidden');
    }

    function handlePersonalMomentsBgUpload(e) {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 800, 0.7).then(base64 => {
            contact.momentsBg = base64;
            // 更新当前显示的背景
            const cover = document.getElementById('personal-moments-cover');
            if (cover) {
                cover.style.backgroundImage = `url(${contact.momentsBg})`;
            }
            saveConfig();
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
        e.target.value = '';
    }

    function renderPersonalMoments(contactId) {
        const container = document.getElementById('personal-moments-container');
        if (!container) return;

        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return;

        // 头部信息
        // 优先使用 momentsBg，如果没有则回退到 profileBg，再没有则为空
        const bg = contact.momentsBg || contact.profileBg || '';
        const name = contact.remark || contact.name;
        const avatar = contact.avatar;

        container.innerHTML = `
            <div class="moments-header">
                <div class="moments-cover" id="personal-moments-cover" style="background-image: url('${bg}'); background-color: ${bg ? 'transparent' : '#333'}; cursor: pointer;">
                    <div class="moments-user-info">
                        <span class="moments-user-name">${name}</span>
                        <img class="moments-user-avatar" src="${avatar}">
                    </div>
                </div>
            </div>
            <div class="moments-list" id="personal-moments-list-content">
                <!-- 动态列表 -->
            </div>
        `;

        // 绑定背景点击事件
        document.getElementById('personal-moments-cover').addEventListener('click', () => {
            document.getElementById('personal-moments-bg-input').click();
        });

        const listContainer = document.getElementById('personal-moments-list-content');
        
        // 筛选该联系人的动态
        const personalMoments = state.moments.filter(m => m.contactId === contactId);
        
        // 按时间倒序
        const sortedMoments = [...personalMoments].sort((a, b) => b.time - a.time);

        if (sortedMoments.length === 0) {
            listContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">暂无动态</div>';
            return;
        }

        sortedMoments.forEach(moment => {
            const item = document.createElement('div');
            item.className = 'moment-item';
            
            // 图片HTML
            let imagesHtml = '';
            if (moment.images && moment.images.length > 0) {
                const gridClass = moment.images.length === 1 ? 'single' : 'grid';
                imagesHtml = `<div class="moment-images ${gridClass}">
                    ${moment.images.map(img => `<img src="${img}" class="moment-img">`).join('')}
                </div>`;
            }

            // 点赞列表HTML
            let likesHtml = '';
            if (moment.likes && moment.likes.length > 0) {
                likesHtml = `<div class="moment-likes"><i class="far fa-heart"></i> ${moment.likes.join(', ')}</div>`;
            }

            // 评论列表HTML
            let commentsHtml = '';
            if (moment.comments && moment.comments.length > 0) {
                commentsHtml = `<div class="moment-comments">
                    ${moment.comments.map((c, index) => {
                        let displayName = c.user;
                        // 尝试修正显示名称
                        if (contactId !== 'me') {
                            const contact = state.contacts.find(cnt => cnt.id === contactId);
                            if (contact && contact.remark) {
                                if (c.user === contact.name || c.user === contact.nickname) {
                                    displayName = contact.remark;
                                }
                            }
                        }

                        let userHtml = `<span class="comment-user">${displayName}</span>`;
                        if (c.replyTo) {
                            userHtml += `回复<span class="comment-user">${c.replyTo}</span>`;
                        }
                        return `<div class="comment-item" onclick="event.stopPropagation(); window.handleCommentClick(this, ${moment.id}, ${index}, '${c.user}')" style="display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; padding: 2px 4px; border-radius: 2px;">
                            <span style="flex: 1;">${userHtml}：<span class="comment-content">${c.content}</span></span>
                            <span class="comment-delete-btn" style="display: none; color: #576b95; margin-left: 8px; font-size: 12px; padding: 0 4px;">✕</span>
                        </div>`;
                    }).join('')}
                </div>`;
            }

            // 底部区域HTML
            let footerHtml = '';
            if (likesHtml || commentsHtml) {
                footerHtml = `<div class="moment-likes-comments">${likesHtml}${commentsHtml}</div>`;
            }

            // 时间格式化
            const date = new Date(moment.time);
            const timeStr = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

            // 个人朋友圈通常不显示头像和名字在每条动态左侧，而是类似相册的布局，或者简化版
            // 但为了保持一致性且简单实现，这里复用朋友圈样式，但可以稍微调整
            // 微信个人相册是按时间轴展示的，这里为了简化，直接复用朋友圈流式布局
            
            item.innerHTML = `
                <div style="width: 50px; font-size: 20px; font-weight: bold; text-align: right; margin-right: 10px; display: flex; flex-direction: row; align-items: baseline; justify-content: flex-end; line-height: 1.1; margin-top: -4px;">
                    <div style="font-size: 24px; margin-right: 2px;">${date.getDate()}</div>
                    <div style="font-size: 12px;">${date.getMonth() + 1}月</div>
                </div>
                <div class="moment-content">
                    <div class="moment-text">${moment.content}</div>
                    ${imagesHtml}
                    <div class="moment-info">
                        <div style="display: flex; align-items: center;">
                            <span class="moment-time" style="display: none;">${timeStr}</span> <!-- 隐藏时间，因为左侧已经有了 -->
                        </div>
                        <div style="position: relative;">
                            <button class="moment-action-btn" onclick="window.toggleActionMenu(this, ${moment.id})"><i class="fas fa-ellipsis-h"></i></button>
                            <div class="action-menu" id="action-menu-${moment.id}">
                                <button class="action-menu-btn" onclick="window.toggleLike(${moment.id})"><i class="far fa-heart"></i> 赞</button>
                                <button class="action-menu-btn" onclick="window.showCommentInput(${moment.id})"><i class="far fa-comment"></i> 评论</button>
                            </div>
                        </div>
                    </div>
                    ${footerHtml}
                </div>
            `;
            
            listContainer.appendChild(item);
        });
    }

    function openChatSettings() {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        // 填充 AI 卡片信息
        document.getElementById('chat-setting-name').value = contact.name || '';
        document.getElementById('chat-setting-avatar-preview').src = contact.avatar || '';
        const aiBgContainer = document.getElementById('ai-setting-bg-container');
        if (contact.aiSettingBg) {
            aiBgContainer.style.backgroundImage = `url(${contact.aiSettingBg})`;
        } else {
            aiBgContainer.style.backgroundImage = '';
        }
        // 清空 AI 背景输入
        document.getElementById('chat-setting-ai-bg-input').value = '';

        document.getElementById('chat-setting-remark').value = contact.remark || '';
        document.getElementById('chat-setting-group-value').textContent = contact.group || '未分组';
        state.tempSelectedGroup = contact.group || ''; // 初始化临时分组

        document.getElementById('chat-setting-persona').value = contact.persona || '';
        document.getElementById('chat-setting-context-limit').value = contact.contextLimit || '';
        document.getElementById('chat-setting-summary-limit').value = contact.summaryLimit || '';
        document.getElementById('chat-setting-show-thought').checked = contact.showThought || false;
        document.getElementById('chat-setting-thought-visible').checked = contact.thoughtVisible || false;
        document.getElementById('chat-setting-real-time-visible').checked = contact.realTimeVisible || false;
        
        // 填充 TTS 设置
        document.getElementById('chat-setting-tts-enabled').checked = contact.ttsEnabled || false;
        document.getElementById('chat-setting-tts-voice-id').value = contact.ttsVoiceId || 'male-qn-qingse';

        // 清空文件输入
        document.getElementById('chat-setting-avatar').value = '';
        document.getElementById('chat-setting-my-avatar').value = '';
        document.getElementById('chat-setting-bg').value = '';
        document.getElementById('chat-setting-custom-css').value = contact.customCss || '';

        // 填充用户身份下拉框
        const userPersonaSelect = document.getElementById('chat-setting-user-persona');
        userPersonaSelect.innerHTML = '<option value="">-- 选择身份 --</option>';
        state.userPersonas.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.name || '未命名身份';
            userPersonaSelect.appendChild(option);
        });
        
        // 选中当前设置的身份
        if (contact.userPersonaId) {
            userPersonaSelect.value = contact.userPersonaId;
        }

        // 填充用户资料卡背景和头像
        const userBgContainer = document.getElementById('user-setting-bg-container');
        if (userBgContainer) {
            // 暂时使用默认灰色或联系人特定的背景（如果将来支持）
            userBgContainer.style.backgroundImage = ''; 
        }
        
        const userAvatarPreview = document.getElementById('chat-setting-my-avatar-preview');
        if (userAvatarPreview) {
            // 优先显示聊天特定的头像，否则显示全局头像
            userAvatarPreview.src = contact.myAvatar || state.userProfile.avatar;
        }
        
        // 绑定用户头像上传预览
        const userAvatarInput = document.getElementById('chat-setting-my-avatar');
        if (userAvatarInput) {
            // 移除旧的监听器（通过克隆）
            const newUserAvatarInput = userAvatarInput.cloneNode(true);
            userAvatarInput.parentNode.replaceChild(newUserAvatarInput, userAvatarInput);
            
            newUserAvatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (userAvatarPreview) userAvatarPreview.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // 渲染世界书分类选择列表
        const wbList = document.getElementById('chat-setting-wb-list');
        wbList.innerHTML = '';
        
        if (state.wbCategories && state.wbCategories.length > 0) {
            state.wbCategories.forEach(cat => {
                const item = document.createElement('div');
                item.className = 'list-item';
                
                // 检查是否已关联
                // 如果 linkedWbCategories 不存在，默认全选（兼容旧数据）
                // 如果存在，检查是否包含当前 cat.id
                let isChecked = false;
                if (!contact.linkedWbCategories) {
                    isChecked = true;
                } else {
                    isChecked = contact.linkedWbCategories.includes(cat.id);
                }

                item.innerHTML = `
                    <div class="list-content" style="justify-content: space-between; align-items: center; width: 100%;">
                        <span>${cat.name}</span>
                        <input type="checkbox" class="wb-category-checkbox" data-id="${cat.id}" ${isChecked ? 'checked' : ''}>
                    </div>
                `;
                wbList.appendChild(item);
            });
        } else {
            wbList.innerHTML = '<div class="list-item"><div class="list-content">暂无世界书分类</div></div>';
        }

        // 渲染表情包分类选择列表
        const stickerList = document.getElementById('chat-setting-sticker-list');
        stickerList.innerHTML = '';
        
        if (state.stickerCategories && state.stickerCategories.length > 0) {
            state.stickerCategories.forEach(cat => {
                const item = document.createElement('div');
                item.className = 'list-item';
                
                // 检查是否已关联
                // 如果 linkedStickerCategories 不存在，默认全选
                let isChecked = false;
                if (!contact.linkedStickerCategories) {
                    isChecked = true;
                } else {
                    isChecked = contact.linkedStickerCategories.includes(cat.id);
                }

                item.innerHTML = `
                    <div class="list-content" style="justify-content: space-between; align-items: center; width: 100%;">
                        <span>${cat.name}</span>
                        <input type="checkbox" class="sticker-category-checkbox" data-id="${cat.id}" ${isChecked ? 'checked' : ''}>
                    </div>
                `;
                stickerList.appendChild(item);
            });
        } else {
            stickerList.innerHTML = '<div class="list-item"><div class="list-content">暂无表情包分类</div></div>';
        }

        // 渲染用户认知信息
        renderUserPerception(contact);

        // 渲染 CSS 预设
        renderChatCssPresets();

        document.getElementById('chat-settings-screen').classList.remove('hidden');
    }

    function renderUserPerception(contact) {
        const list = document.getElementById('user-perception-list');
        const displayArea = document.getElementById('user-perception-display');
        const editArea = document.getElementById('user-perception-edit');
        const editBtn = document.getElementById('edit-user-perception-btn');
        const saveBtn = document.getElementById('save-user-perception-btn');
        const cancelBtn = document.getElementById('cancel-user-perception-btn');
        const input = document.getElementById('user-perception-input');

        if (!list) return;

        // 确保 userPerception 存在
        if (!contact.userPerception) {
            contact.userPerception = [];
        }

        // 渲染列表
        list.innerHTML = '';
        if (contact.userPerception.length === 0) {
            list.innerHTML = '<div style="color: #999; font-size: 14px; padding: 10px 0;">暂无认知信息</div>';
        } else {
            contact.userPerception.forEach(item => {
                const div = document.createElement('div');
                div.textContent = `• ${item}`;
                div.style.marginBottom = '5px';
                div.style.fontSize = '14px';
                list.appendChild(div);
            });
        }

        // 绑定事件
        // 移除旧的监听器（通过克隆节点）
        const newEditBtn = editBtn.cloneNode(true);
        editBtn.parentNode.replaceChild(newEditBtn, editBtn);
        
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        newEditBtn.addEventListener('click', () => {
            displayArea.classList.add('hidden');
            editArea.classList.remove('hidden');
            input.value = contact.userPerception.join('\n');
        });

        newSaveBtn.addEventListener('click', () => {
            const text = input.value.trim();
            const newPerception = text.split('\n').map(line => line.trim()).filter(line => line);
            contact.userPerception = newPerception;
            saveConfig();
            renderUserPerception(contact);
            displayArea.classList.remove('hidden');
            editArea.classList.add('hidden');
        });

        newCancelBtn.addEventListener('click', () => {
            displayArea.classList.remove('hidden');
            editArea.classList.add('hidden');
        });
    }

    function handleClearChatHistory() {
        if (!state.currentChatContactId) return;
        
        if (confirm('确定要清空与该联系人的所有聊天记录吗？此操作不可恢复。')) {
            state.chatHistory[state.currentChatContactId] = [];
            saveConfig();
            renderChatHistory(state.currentChatContactId);
            alert('聊天记录已清空');
            document.getElementById('chat-settings-screen').classList.add('hidden');
        }
    }

    function handleSaveChatSettings() {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        const name = document.getElementById('chat-setting-name').value;
        const remark = document.getElementById('chat-setting-remark').value;
        const persona = document.getElementById('chat-setting-persona').value;
        const contextLimit = document.getElementById('chat-setting-context-limit').value;
        const summaryLimit = document.getElementById('chat-setting-summary-limit').value;
        const showThought = document.getElementById('chat-setting-show-thought').checked;
        const thoughtVisible = document.getElementById('chat-setting-thought-visible').checked;
        const realTimeVisible = document.getElementById('chat-setting-real-time-visible').checked;
        const ttsEnabled = document.getElementById('chat-setting-tts-enabled').checked;
        const ttsVoiceId = document.getElementById('chat-setting-tts-voice-id').value;
        const userPersonaId = document.getElementById('chat-setting-user-persona').value;
        const avatarInput = document.getElementById('chat-setting-avatar');
        const aiBgInput = document.getElementById('chat-setting-ai-bg-input');
        const myAvatarInput = document.getElementById('chat-setting-my-avatar');
        const customCss = document.getElementById('chat-setting-custom-css').value;
        // const bgInput = document.getElementById('chat-setting-bg'); // 已改为画廊选择

        // 获取选中的世界书分类
        const selectedWbCategories = [];
        document.querySelectorAll('.wb-category-checkbox').forEach(cb => {
            if (cb.checked) {
                selectedWbCategories.push(parseInt(cb.dataset.id));
            }
        });
        contact.linkedWbCategories = selectedWbCategories;

        // 获取选中的表情包分类
        const selectedStickerCategories = [];
        document.querySelectorAll('.sticker-category-checkbox').forEach(cb => {
            if (cb.checked) {
                selectedStickerCategories.push(parseInt(cb.dataset.id));
            }
        });
        contact.linkedStickerCategories = selectedStickerCategories;

        contact.name = name; // 更新姓名
        contact.remark = remark;
        contact.group = state.tempSelectedGroup; // 保存分组
        contact.persona = persona;
        contact.contextLimit = contextLimit ? parseInt(contextLimit) : 0;
        contact.summaryLimit = summaryLimit ? parseInt(summaryLimit) : 0;
        contact.showThought = showThought;
        contact.thoughtVisible = thoughtVisible;
        contact.realTimeVisible = realTimeVisible;
        contact.ttsEnabled = ttsEnabled;
        contact.ttsVoiceId = ttsVoiceId;
        contact.userPersonaId = userPersonaId ? parseInt(userPersonaId) : null;
        contact.customCss = customCss;
        document.getElementById('chat-title').textContent = remark || contact.name;
        
        // 应用选中的背景
        contact.chatBg = state.tempSelectedChatBg;

        const promises = [];

        if (avatarInput.files && avatarInput.files[0]) {
            promises.push(new Promise(resolve => {
                compressImage(avatarInput.files[0], 300, 0.7).then(base64 => {
                    contact.avatar = base64;
                    resolve();
                }).catch(err => {
                    console.error('图片压缩失败', err);
                    resolve(); // 即使失败也继续
                });
            }));
        }

        if (aiBgInput.files && aiBgInput.files[0]) {
            promises.push(new Promise(resolve => {
                compressImage(aiBgInput.files[0], 800, 0.7).then(base64 => {
                    contact.aiSettingBg = base64;
                    resolve();
                }).catch(err => {
                    console.error('AI背景图片压缩失败', err);
                    resolve();
                });
            }));
        }

        if (myAvatarInput.files && myAvatarInput.files[0]) {
            promises.push(new Promise(resolve => {
                compressImage(myAvatarInput.files[0], 300, 0.7).then(base64 => {
                    contact.myAvatar = base64;
                    resolve();
                }).catch(err => {
                    console.error('图片压缩失败', err);
                    resolve();
                });
            }));
        }

        // 背景图片已通过画廊处理，不再需要在此处读取文件

        Promise.all(promises).then(() => {
            saveConfig();
            renderContactList(state.currentContactGroup || 'all'); // 更新列表头像/备注，保持当前分组
            renderChatHistory(contact.id); // 更新聊天记录头像
            
            // 更新背景
            const chatScreen = document.getElementById('chat-screen');
            if (contact.chatBg) {
                chatScreen.style.backgroundImage = `url(${contact.chatBg})`;
                chatScreen.style.backgroundSize = 'cover';
                chatScreen.style.backgroundPosition = 'center';
            } else {
                chatScreen.style.backgroundImage = '';
            }

            // 更新自定义CSS
            const existingStyle = document.getElementById('chat-custom-css');
            if (existingStyle) existingStyle.remove();

            if (contact.customCss) {
                const style = document.createElement('style');
                style.id = 'chat-custom-css';
                style.textContent = contact.customCss;
                document.head.appendChild(style);
            }

            document.getElementById('chat-settings-screen').classList.add('hidden');
        });
    }

    function renderChatHistory(contactId) {
        const messages = state.chatHistory[contactId] || [];
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        
        // 检查并修复缺失 ID 的消息
        let needSave = false;
        messages.forEach(msg => {
            if (!msg.id) {
                msg.id = Date.now() + Math.random().toString(36).substr(2, 9);
                needSave = true;
            }
        });
        if (needSave) saveConfig();

        messages.forEach(msg => {
            appendMessageToUI(msg.content, msg.role === 'user', msg.type || 'text', msg.description, msg.replyTo, msg.id);
        });
        
        // 渲染最后一条心声（如果有）
        const contact = state.contacts.find(c => c.id === contactId);
        if (contact && contact.showThought) {
            // 找到最后一条AI回复
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].role === 'assistant' && messages[i].thought) {
                    updateThoughtBubble(messages[i].thought);
                    break;
                }
            }
        } else {
            updateThoughtBubble(null); // 清空或隐藏
        }
        
        scrollToBottom();
        // 如果处于多选模式，更新多选 UI 状态
        updateMultiSelectUI();
        applyChatMultiSelectClass();
    }

    function toggleThoughtBubble() {
        const bubble = document.getElementById('thought-bubble');
        const content = document.getElementById('thought-content-text');
        
        if (!bubble || !content.textContent.trim()) return;
        
        bubble.classList.toggle('hidden');
    }

    function updateThoughtBubble(text) {
        const bubble = document.getElementById('thought-bubble');
        const content = document.getElementById('thought-content-text');
        
        if (!bubble || !content) return;
        
        if (text) {
            content.textContent = text;
            // 默认不显示，点击标题才显示，或者根据需求默认显示？
            // 需求：点击聊天页面的标题时显示，点别的地方关闭
            // 所以这里只更新内容，不控制显示状态，除非是新消息来了可能需要提示？
            // 暂时保持 hidden，等待用户点击标题
        } else {
            content.textContent = '';
            bubble.classList.add('hidden');
        }
    }

    function sendMessage(text, isUser, type = 'text', description = null) {
        if (!state.currentChatContactId) return;
        
        // 保存消息
        if (!state.chatHistory[state.currentChatContactId]) {
            state.chatHistory[state.currentChatContactId] = [];
        }
        
        const msg = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            role: isUser ? 'user' : 'assistant',
            content: text,
            type: type,
            replyTo: state.replyingToMsg ? {
                name: state.replyingToMsg.name,
                content: state.replyingToMsg.type === 'text' ? state.replyingToMsg.content : `[${state.replyingToMsg.type === 'sticker' ? '表情包' : '图片'}]`
            } : null
        };

        if (description) {
            msg.description = description;
        }
        
        state.chatHistory[state.currentChatContactId].push(msg);
        
        // 清除引用状态
        if (state.replyingToMsg) cancelQuote();
        
        // 增加消息计数并检查是否触发行程生成
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (contact) {
            if (typeof contact.messagesSinceLastItinerary !== 'number') {
                contact.messagesSinceLastItinerary = 0;
            }
            contact.messagesSinceLastItinerary++;
            
            if (contact.autoItineraryEnabled && contact.messagesSinceLastItinerary >= (contact.autoItineraryInterval || 10)) {
                generateNewItinerary(contact);
            }
        }

        saveConfig(); // 简单起见，每次发送都保存
        
        appendMessageToUI(text, isUser, type, description, msg.replyTo, msg.id);
        scrollToBottom();

        // 更新联系人列表的最后一条消息
        renderContactList(state.currentContactGroup || 'all');

        // 检查是否需要自动总结
        checkAndSummarize(state.currentChatContactId);
    }

    function appendMessageToUI(text, isUser, type = 'text', description = null, replyTo = null, msgId = null) {
        // 隐藏自动同步的评论消息和动态发布消息，但保留在历史记录中供AI读取
        if (type === 'text' && text && typeof text === 'string') {
            if (text.startsWith('[评论了你的动态: "') || text.startsWith('[发布了动态]:')) {
                return;
            }
            
            // 过滤掉包含 ACTION: 的行，防止指令泄露
            if (!isUser && text.includes('ACTION:')) {
                text = text.split('\n').filter(line => !line.trim().startsWith('ACTION:')).join('\n').trim();
                if (!text) return; // 如果过滤后为空，则不显示
            }
        }

        // 隐藏语音通话消息
        if (type === 'voice_call_text') {
            return;
        }

        const container = document.getElementById('chat-messages');
        
        // 检查是否需要插入时间戳 (间隔超过5分钟)
        const lastMsg = container.lastElementChild;
        let showTimestamp = false;
        const now = Date.now();
        
        // 如果是第一条消息，或者上一条是系统消息，或者距离上一条消息超过5分钟
        if (!lastMsg || lastMsg.classList.contains('system') || !lastMsg.dataset.time) {
            showTimestamp = true;
        } else {
            const lastTime = parseInt(lastMsg.dataset.time);
            if (now - lastTime > 5 * 60 * 1000) {
                showTimestamp = true;
            }
        }

        if (showTimestamp) {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'chat-time-stamp';
            const date = new Date();
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            timeDiv.innerHTML = `<span>${timeStr}</span>`;
            container.appendChild(timeDiv);
        }

        const msgDiv = document.createElement('div');
        msgDiv.dataset.time = now; // 记录消息时间戳
        
        // 检查是否为系统消息
        let isSystemMsg = false;
        if (type === 'text' && text && typeof text === 'string' && text.startsWith('[系统消息]:')) {
            isSystemMsg = true;
        }

        if (isSystemMsg) {
            msgDiv.className = 'chat-message system';
            // 移除 "[系统消息]:" 前缀
            const systemText = text.replace('[系统消息]:', '').trim();
            msgDiv.innerHTML = `<div class="system-tip">${systemText}</div>`;
            container.appendChild(msgDiv);
            return;
        }

        msgDiv.className = `chat-message ${isUser ? 'user' : 'other'}`;
        if (msgId) msgDiv.dataset.msgId = msgId;

        // 留空：复选框将在设置 innerHTML 后添加，避免 innerHTML 覆盖元素
        msgDiv.style.position = 'relative';
        
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        
        let contentHtml = '';
        if (type === 'image' || type === 'sticker') {
            contentHtml = `<img src="${text}" style="max-width: 200px; border-radius: 4px;">`;
                // ... 上面是 if (type === 'image' || type === 'sticker') { ... } 
        
        // === 插入点 3：语音消息渲染 ===
            
        
        // 下面是 else if (type === 'transfer') ...

        } else if (type === 'transfer') {
            let transferData = { amount: '0.00', remark: '转账', status: 'pending' };
            try {
                if (typeof text === 'string') {
                    transferData = JSON.parse(text);
                } else {
                    transferData = text;
                }
            } catch (e) {
                console.error('解析转账数据失败', e);
                transferData = { amount: '0.00', remark: text || '转账', status: 'pending' };
            }
            
            const amount = parseFloat(transferData.amount).toFixed(2);
            const remark = transferData.remark || '转账给您';
            const status = transferData.status || 'pending';
            
            let statusText = ''; // 默认为空，不显示“微信转账”
            let iconClass = 'fas fa-exchange-alt';
            let cardClass = '';
            
            if (status === 'accepted') {
                statusText = '已收款';
                iconClass = 'fas fa-check';
                cardClass = 'accepted';
            } else if (status === 'returned') {
                statusText = '已退还';
                iconClass = 'fas fa-undo';
                cardClass = 'returned';
            }
            
            if (!transferData.id) {
                // 旧数据或无效数据，无法操作
                contentHtml = `
                    <div class="transfer-card" onclick="alert('该转账消息已失效（旧数据），请发送新转账测试')">
                        <div class="transfer-top">
                            <div class="transfer-icon"><i class="${iconClass}"></i></div>
                            <div class="transfer-info">
                                <div class="transfer-amount">¥${amount}</div>
                                <div class="transfer-remark">${remark}</div>
                            </div>
                        </div>
                        <div class="transfer-bottom">
                            <span>${statusText} (已失效)</span>
                        </div>
                    </div>
                `;
            } else {
                contentHtml = `
                    <div class="transfer-card" onclick="window.handleTransferClick(${transferData.id}, '${isUser ? 'user' : 'other'}')">
                        <div class="transfer-top">
                            <div class="transfer-icon"><i class="${iconClass}"></i></div>
                            <div class="transfer-info">
                                <div class="transfer-amount">¥${amount}</div>
                                <div class="transfer-remark">${remark}</div>
                            </div>
                        </div>
                        <div class="transfer-bottom">
                            <span>${statusText}</span>
                        </div>
                    </div>
                `;
            }
        } else if (type === 'virtual_image') {
            // 虚拟图片：点击切换图片和描述
            const imgId = `virtual-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            contentHtml = `<img id="${imgId}" src="${text}" style="max-width: 200px; border-radius: 4px; cursor: pointer;" title="点击查看描述">`;
            
            // 延迟绑定事件，确保元素已添加到DOM
            setTimeout(() => {
                const imgEl = document.getElementById(imgId);
                if (imgEl) {
                    let isShowingImage = true;
                    const originalSrc = text;
                    const descText = description || '无描述';
                    
                    // 查找父级 message-content
                    const contentDiv = imgEl.closest('.message-content');
                    
                    // 保存图片尺寸
                    let imgWidth = 0;
                    let imgHeight = 0;

                    if (contentDiv) {
                        contentDiv.style.cursor = 'pointer';
                        contentDiv.onclick = () => {
                            // 如果当前显示的是图片，先保存尺寸
                            if (isShowingImage) {
                                const currentImg = document.getElementById(imgId);
                                if (currentImg) {
                                    imgWidth = currentImg.offsetWidth;
                                    imgHeight = currentImg.offsetHeight;
                                }
                            }

                            isShowingImage = !isShowingImage;
                            
                            if (isShowingImage) {
                                contentDiv.innerHTML = `<img id="${imgId}" src="${originalSrc}" style="max-width: 200px; border-radius: 4px; cursor: pointer;" title="点击查看描述">`;
                            } else {
                                // 使用保存的尺寸，如果未获取到则使用默认值
                                const styleWidth = imgWidth ? `${imgWidth}px` : '200px';
                                const styleHeight = imgHeight ? `${imgHeight}px` : 'auto';
                                
                                contentDiv.innerHTML = `
                                    <div style="width: ${styleWidth}; height: ${styleHeight}; padding: 10px; background: white; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; overflow-y: auto; box-sizing: border-box; border: 1px solid #eee;">
                                        <div style="font-weight: bold; margin-bottom: 5px; font-size: 12px; color: #999;">[图片描述]</div>
                                        <div style="font-size: 14px; color: #333; line-height: 1.4;">${descText}</div>
                                    </div>`;
                            }
                        };
                    }
                }
            }, 0);
        } else {
            contentHtml = text;
        }

        // 处理特殊消息的样式类
                // 处理特殊消息的样式类
        let extraClass = '';
        if (type === 'transfer') {
            extraClass = 'transfer-msg';
            try {
                const data = typeof text === 'string' ? JSON.parse(text) : text;
                if (data.status === 'accepted') extraClass += ' accepted';
                if (data.status === 'returned') extraClass += ' returned';
            } catch(e) {}
        } else if (type === 'sticker') {
            extraClass = 'sticker-msg';
            contentHtml = `<img src="${text}" onclick="showImagePreview(this.src)">`;
        } 
        // ！！！请把下面这一整段覆盖粘贴到这里！！！
                // ... (在处理 transfer 之后) ...
        
        // ！！！确保这部分代码存在且未被注释！！！
        
        
        else if (type === 'voice') {
            // 1. 标记样式类
            extraClass = 'voice-msg'; 
            
            // 2. 解析数据
            let duration = '1"';
            let transText = '[语音]';
            try {
                let data = typeof text === 'string' ? JSON.parse(text) : text;
                duration = (data.duration || 1) + '"';
                transText = data.text || '';
            } catch (e) {
                transText = text;
            }

            // 3. 生成唯一ID
            const uid = 'v-' + Math.random().toString(36).substr(2, 9);
            
            // 4. 生成 HTML 结构
            // 使用全局函数处理点击，避免闭包和DOM更新问题
            contentHtml = `
                <div class="voice-bar-top" onclick="window.playVoiceMsg('${msgId}', '${uid}', event)">
                    <div class="voice-icon-box"><i class="fas fa-rss"></i></div>
                    <span class="voice-dur-text">${duration}</span>
                </div>
                <div id="${uid}" class="voice-text-bottom hidden" onclick="this.classList.add('hidden'); event.stopPropagation();">${transText}</div>
            `;
        }

        
        // ...


        // ==================


        // 构建引用 HTML
        let replyHtml = '';
        if (replyTo) {
            replyHtml = `
                <div class="quote-container">
                    回复 ${replyTo.name}: ${replyTo.content}
                </div>
            `;
        }

        // 消息旁的时间
        const date = new Date();
        const msgTimeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        const timeHtml = `<div class="msg-time">${msgTimeStr}</div>`;

        if (!isUser) {
            const avatar = contact ? contact.avatar : '';
            msgDiv.innerHTML = `
                <img src="${avatar}" class="chat-avatar" onclick="window.openAiProfile()" style="cursor: pointer;">
                <div class="msg-wrapper">
                    <div class="message-content ${extraClass}">${contentHtml}</div>
                    ${replyHtml}
                </div>
                ${timeHtml}
            `;
        } else {
            let myAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=User';
            
            // 优先使用聊天特定的设置
            if (contact && contact.myAvatar) {
                myAvatar = contact.myAvatar;
            } else if (state.currentUserPersonaId) {
                // 使用全局人设
                const p = state.userPersonas.find(p => p.id === state.currentUserPersonaId);
                if (p) myAvatar = p.avatar;
            }

            msgDiv.innerHTML = `
                <img src="${myAvatar}" class="chat-avatar">
                <div class="msg-wrapper">
                    <div class="message-content ${extraClass}">${contentHtml}</div>
                    ${replyHtml}
                </div>
                ${timeHtml}
            `;
        }
        
        // 在设置完 innerHTML 后添加多选复选框（避免 innerHTML 覆盖元素）
        const selectCheckbox = document.createElement('input');
        selectCheckbox.type = 'checkbox';
        selectCheckbox.className = 'msg-select-checkbox hidden';
        selectCheckbox.style.position = 'absolute';
        selectCheckbox.style.zIndex = '210';
        selectCheckbox.dataset.msgId = msgId || '';
        selectCheckbox.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const id = ev.target.dataset.msgId;
            toggleMessageSelection(id);
        });
        msgDiv.appendChild(selectCheckbox);

        // 绑定长按事件
        let longPressTimer;
        const handleStart = (e) => {
            longPressTimer = setTimeout(() => {
                handleMessageLongPress(e, text, isUser, type, msgId);
            }, 500);
        };
        const handleEnd = () => {
            clearTimeout(longPressTimer);
        };
        
        // 找到消息气泡元素进行绑定
        const bubble = msgDiv.querySelector('.message-content');
        if (bubble) {
            bubble.addEventListener('touchstart', handleStart);
            bubble.addEventListener('touchend', handleEnd);
            bubble.addEventListener('touchmove', handleEnd);
            bubble.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleMessageLongPress(e, text, isUser, type, msgId);
            });
        }

        container.appendChild(msgDiv);
    }

    // 进入多选模式并可预选一条消息
    function enterMultiSelectMode(preselectMsgId) {
        state.isMultiSelectMode = true;
        if (preselectMsgId) state.selectedMessages.add(preselectMsgId);
        // 显示控制按钮
        const cancelBtn = document.getElementById('multi-select-cancel');
        const deleteBtn = document.getElementById('multi-select-delete');
        const countEl = document.getElementById('multi-select-count');
        if (cancelBtn) cancelBtn.classList.remove('hidden');
        if (deleteBtn) deleteBtn.classList.remove('hidden');
        if (countEl) countEl.textContent = state.selectedMessages.size;
        // 确保按钮绑定（防止监听被覆盖或绑定顺序问题）
        if (cancelBtn) {
            cancelBtn.onclick = (e) => { e.stopPropagation(); exitMultiSelectMode(); };
        }
        if (deleteBtn) {
            deleteBtn.onclick = (e) => { e.stopPropagation(); deleteSelectedMessages(); };
        }
        updateMultiSelectUI();
        applyChatMultiSelectClass();
    }

    function exitMultiSelectMode() {
        state.isMultiSelectMode = false;
        state.selectedMessages.clear();
        const cancelBtn = document.getElementById('multi-select-cancel');
        const deleteBtn = document.getElementById('multi-select-delete');
        const countEl = document.getElementById('multi-select-count');
        if (cancelBtn) cancelBtn.classList.add('hidden');
        if (deleteBtn) deleteBtn.classList.add('hidden');
        if (countEl) countEl.textContent = '0';
        updateMultiSelectUI();
    }

    // Ensure chat container class reflects multi-select state
    function applyChatMultiSelectClass() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        if (state.isMultiSelectMode) container.classList.add('multi-select-mode');
        else container.classList.remove('multi-select-mode');
    }

    function toggleMessageSelection(msgId) {
        if (!state.isMultiSelectMode) return;
        if (!msgId) return;
        if (state.selectedMessages.has(msgId)) state.selectedMessages.delete(msgId);
        else state.selectedMessages.add(msgId);
        const countEl = document.getElementById('multi-select-count');
        if (countEl) countEl.textContent = state.selectedMessages.size;
        updateMultiSelectUI();
    }

    function updateMultiSelectUI() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const items = container.querySelectorAll('.chat-message');
        items.forEach(item => {
            const checkbox = item.querySelector('.msg-select-checkbox');
            const id = item.dataset.msgId;
            if (state.isMultiSelectMode) {
                if (checkbox) checkbox.classList.remove('hidden');
                // 点击消息内容也切换选择
                const bubble = item.querySelector('.message-content');
                if (bubble) {
                    bubble.style.cursor = 'pointer';
                    bubble.onclick = (e) => {
                        e.stopPropagation();
                        if (id) toggleMessageSelection(id);
                    };
                }
            } else {
                if (checkbox) {
                    checkbox.classList.add('hidden');
                    checkbox.checked = false;
                }
                const bubble = item.querySelector('.message-content');
                if (bubble) {
                    bubble.style.cursor = '';
                    // 恢复原有点击行为（避免覆盖其他逻辑）
                    bubble.onclick = null;
                }
            }

            if (checkbox) {
                checkbox.checked = state.selectedMessages.has(id);
                if (state.selectedMessages.has(id)) item.classList.add('selected-msg');
                else item.classList.remove('selected-msg');
            }
        });
        const deleteBtn = document.getElementById('multi-select-delete');
        const countEl = document.getElementById('multi-select-count');
        if (deleteBtn && countEl) {
            deleteBtn.disabled = state.selectedMessages.size === 0;
        }
        applyChatMultiSelectClass();
    }

    function deleteSelectedMessages() {
        if (!state.isMultiSelectMode) return;
        if (state.selectedMessages.size === 0) {
            alert('未选择任何消息');
            return;
        }
        if (!confirm(`确定删除选中的 ${state.selectedMessages.size} 条消息吗？此操作不可恢复。`)) return;
        const ids = Array.from(state.selectedMessages);
        if (!state.currentChatContactId) return;
        const history = state.chatHistory[state.currentChatContactId] || [];
        state.chatHistory[state.currentChatContactId] = history.filter(m => !ids.includes(String(m.id)) && !ids.includes(m.id));
        saveConfig();
        exitMultiSelectMode();
        renderChatHistory(state.currentChatContactId);
    }

    function handleMessageLongPress(e, content, isUser, type, msgId) {
        // 阻止默认菜单
        if (e.type === 'contextmenu') {
            e.preventDefault();
        }
        
        // 获取触发元素：尝试找到 .message-content
        let target = e.target;
        // 向上查找直到找到 message-content
        while (target && !target.classList.contains('message-content')) {
            target = target.parentElement;
            if (!target || target === document.body) break; 
        }
        
        if (!target) {
            // 如果没找到气泡，尝试从事件坐标获取元素（针对 touch 事件可能 target 不准确的情况）
            if (e.type === 'touchstart' && e.touches && e.touches[0]) {
                const touch = e.touches[0];
                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                if (el) {
                    target = el.closest('.message-content');
                }
            }
        }

        if (!target) return; // 无法定位气泡，不显示菜单

        // 获取名字
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        let name = 'AI';
        if (isUser) {
            // 获取当前用户身份名
            if (contact && contact.userPersonaId) {
                const p = state.userPersonas.find(p => p.id === contact.userPersonaId);
                name = p ? p.name : state.userProfile.name;
            } else {
                name = state.userProfile.name;
            }
        } else {
            name = contact ? (contact.remark || contact.name) : 'AI';
        }

        showContextMenu(target, { content, name, isUser, type, msgId });
    }

    function showContextMenu(targetEl, msgData) {
        // 移除旧菜单
        const oldMenu = document.querySelector('.context-menu');
        if (oldMenu) oldMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" id="menu-quote">引用</div>
            <div class="context-menu-item" id="menu-copy">复制</div>
            <div class="context-menu-item" id="menu-edit">编辑</div>
            <div class="context-menu-item" id="menu-delete" style="color: #ff3b30;">删除</div>
        `;
        
        // 先插入 DOM 以获取尺寸，设为不可见
        menu.style.visibility = 'hidden';
        document.body.appendChild(menu);
        
        const menuRect = menu.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const gap = 10; // 间距
        
        let left, top;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        if (msgData.isUser) {
            // 用户消息（右侧），菜单在左边
            left = targetRect.left - menuRect.width - gap + scrollX;
        } else {
            // AI 消息（左侧），菜单在右边
            left = targetRect.right + gap + scrollX;
        }
        
        // 顶部对齐
        top = targetRect.top + scrollY;
        
        // 边界检查：如果水平放不下，就放上面
        if (left < 0 || left + menuRect.width > window.innerWidth) {
             // 居中显示在气泡上方
             left = targetRect.left + (targetRect.width - menuRect.width) / 2 + scrollX;
             top = targetRect.top - menuRect.height - gap + scrollY;
             
             // 如果上方也放不下（太靠顶），放下面
             if (top < scrollY) {
                 top = targetRect.bottom + gap + scrollY;
             }
        }
        
        // 确保不超出左右边界
        if (left < 0) left = 10;
        if (left + menuRect.width > window.innerWidth) left = window.innerWidth - menuRect.width - 10;

        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        menu.style.visibility = 'visible';
        
        // 绑定事件
        menu.querySelector('#menu-quote').onclick = () => {
            handleQuote(msgData);
            menu.remove();
        };
        
        menu.querySelector('#menu-copy').onclick = () => {
            // 简单的复制文本实现
            if (msgData.type === 'text') {
                navigator.clipboard.writeText(msgData.content).then(() => {
                    // alert('已复制');
                });
            }
            menu.remove();
        };
        menu.querySelector('#menu-edit').onclick = () => {
            if (msgData.msgId) {
                menu.remove();
                // 仅允许编辑文本类型的消息，防止破坏 JSON 结构（如转账）
                // 如果你想允许编辑所有类型（如修改图片URL），可以去掉这个判断
                if (msgData.type !== 'text') {
                    if(!confirm('这是一条非文本消息（如图片或转账），直接编辑内容可能会破坏显示格式。确定要编辑吗？')) {
                        return;
                    }
                }
                openEditChatMessageModal(msgData.msgId, msgData.content);
            } else {
                alert('无法编辑此消息（缺少ID）');
                menu.remove();
            }
        };

        menu.querySelector('#menu-delete').onclick = () => {
            // 进入多选模式并预选当前长按的消息
            if (msgData.msgId) {
                menu.remove();
                enterMultiSelectMode(msgData.msgId);
            } else {
                alert('无法删除此消息（缺少ID）');
                menu.remove();
            }
        };
        
        // 点击其他地方关闭
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    }

    function handleQuote(msgData) {
        state.replyingToMsg = msgData;
        const replyBar = document.getElementById('reply-bar');
        document.getElementById('reply-name').textContent = msgData.name;
        
        let previewText = msgData.content;
        if (msgData.type === 'image') previewText = '[图片]';
        else if (msgData.type === 'sticker') previewText = '[表情包]';
        else if (msgData.type === 'transfer') previewText = '[转账]';
        
        document.getElementById('reply-text').textContent = previewText;
        replyBar.classList.remove('hidden');
        
        const chatInput = document.getElementById('chat-input');
        if (chatInput) chatInput.focus();
    }

    function cancelQuote() {
        state.replyingToMsg = null;
        document.getElementById('reply-bar').classList.add('hidden');
    }

    function scrollToBottom() {
        const container = document.getElementById('chat-messages');
        container.scrollTop = container.scrollHeight;
    }

    async function getCurrentItineraryInfo(contactId) {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return '';
        
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `itinerary_${contact.id}_${today}`;
        
        try {
            const itinerary = await localforage.getItem(cacheKey);
            
            if (!itinerary || !itinerary.events || !Array.isArray(itinerary.events) || itinerary.events.length === 0) {
                return '';
            }
            
            // 按时间排序（确保正序）
            const sortedEvents = [...itinerary.events].sort((a, b) => {
                const timeA = a.time.split('-')[0].trim();
                const timeB = b.time.split('-')[0].trim();
                return timeA.localeCompare(timeB);
            });
            
            // 获取当前时间
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTimeInMinutes = currentHour * 60 + currentMinute;
            
            // 找到当前或最近的活动
            let currentEvent = null;
            let nextEvent = null;
            let allEventsText = '';
            
            for (let i = 0; i < sortedEvents.length; i++) {
                const event = sortedEvents[i];
                const [startStr, endStr] = event.time.split('-');
                const [startHour, startMinute] = startStr.trim().split(':').map(Number);
                const [endHour, endMinute] = endStr.trim().split(':').map(Number);
                
                const startTimeInMinutes = startHour * 60 + startMinute;
                const endTimeInMinutes = endHour * 60 + endMinute;
                
                // 格式化每个事件用于AI上下文
                allEventsText += `${event.time} ${event.location}：${event.description}\n`;
                
                // 检查是否是当前事件
                if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
                    currentEvent = event;
                }
                
                // 找到下一个事件
                if (currentTimeInMinutes < startTimeInMinutes && !nextEvent) {
                    nextEvent = event;
                }
            }
            
            // 构建返回信息
            let info = '【今日行程安排】\n';
            info += allEventsText;
            
            if (currentEvent) {
                info += `\n【当前状态】\n根据时间安排，我现在（${currentHour}:${currentMinute.toString().padStart(2, '0')}）正在${currentEvent.location}，进行：${currentEvent.description}\n`;
            } else if (nextEvent) {
                const [nextHour, nextMinute] = nextEvent.time.split('-')[0].trim().split(':').map(Number);
                const timeUntilNext = nextHour * 60 + nextMinute - currentTimeInMinutes;
                
                if (timeUntilNext > 0) {
                    info += `\n【当前状态】\n现在时间是${currentHour}:${currentMinute.toString().padStart(2, '0')}，距离下一个行程（${nextEvent.time} ${nextEvent.location}）还有大约${Math.floor(timeUntilNext/60)}小时${timeUntilNext%60}分钟。\n`;
                }
            } else {
                // 所有行程已结束
                info += `\n【当前状态】\n今天的行程已经全部结束了。\n`;
            }
            
            return info;
        } catch (error) {
            console.error('解析行程信息失败:', error);
            return '';
        }
    }

    async function generateAiReply() {
        if (!state.currentChatContactId) return;
        
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        const settings = state.aiSettings.url ? state.aiSettings : state.aiSettings2;
        if (!settings.url || !settings.key) {
            alert('请先在设置中配置AI API');
            return;
        }

        const history = state.chatHistory[state.currentChatContactId] || [];
        
        // 获取当前用户人设信息
        let userPromptInfo = '';
        let currentPersona = null;

        // 优先使用聊天设置中指定的身份
        if (contact.userPersonaId) {
            currentPersona = state.userPersonas.find(p => p.id === contact.userPersonaId);
        }

        // 如果没有指定，或者找不到，则不发送特定人设信息，或者可以回退到全局资料卡名字
        if (currentPersona) {
            userPromptInfo = `\n用户(我)的网名：${currentPersona.name || '未命名'}`;
            if (currentPersona.aiPrompt) {
                userPromptInfo += `\n用户(我)的人设：${currentPersona.aiPrompt}`;
            }
        } else if (state.userProfile) {
             // 回退到全局资料卡名字，但不发送人设 Prompt
            userPromptInfo = `\n用户(我)的网名：${state.userProfile.name}`;
        }

        // 获取最近的朋友圈互动上下文
        let momentContext = '';
        const contactMoments = state.moments.filter(m => m.contactId === contact.id);
        if (contactMoments.length > 0) {
            // 按时间倒序，取最新的
            const lastMoment = contactMoments.sort((a, b) => b.time - a.time)[0];
            momentContext += `\n【朋友圈状态】\n你最新的一条朋友圈是：“${lastMoment.content}”\n`;
            
            if (lastMoment.comments && lastMoment.comments.length > 0) {
                // 查找用户的最新评论
                const userName = currentPersona ? currentPersona.name : state.userProfile.name;
                const userComments = lastMoment.comments.filter(c => c.user === userName);
                if (userComments.length > 0) {
                    const lastComment = userComments[userComments.length - 1];
                    momentContext += `用户刚刚评论了你的朋友圈：“${lastComment.content}”\n`;
                }
            }
        }

        // 获取记忆上下文
        let memoryContext = '';
        if (contact.memorySendLimit && contact.memorySendLimit > 0) {
            const contactMemories = state.memories.filter(m => m.contactId === contact.id);
            if (contactMemories.length > 0) {
                // 按时间倒序，取最近的 N 条
                const recentMemories = contactMemories.sort((a, b) => b.time - a.time).slice(0, contact.memorySendLimit);
                // 再按时间正序排列，符合阅读逻辑
                recentMemories.reverse();
                
                memoryContext += '\n【重要记忆】\n';
                recentMemories.forEach(m => {
                    memoryContext += `- ${m.content}\n`;
                });
            }
        }

        // 获取时间上下文
        let timeContext = '';
        let itineraryContext = '';
        if (contact.realTimeVisible) {
            const now = new Date();
            const timeStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            timeContext = `\n【当前真实时间】\n${timeStr}\n`;
            
            // 获取行程上下文
            itineraryContext = await getCurrentItineraryInfo(contact.id);
        }

        // 获取线下见面上下文
        let meetingContext = '';
        if (state.meetings && state.meetings[contact.id] && state.meetings[contact.id].length > 0) {
            // 获取最近的一次见面
            const meetings = state.meetings[contact.id];
            const lastMeeting = meetings[meetings.length - 1];
            
            // 提取最近的剧情 (最后 5 条)
            let meetingContent = '';
            if (lastMeeting.content && lastMeeting.content.length > 0) {
                const recentContent = lastMeeting.content.slice(-5);
                meetingContent = recentContent.map(c => {
                    const role = c.role === 'user' ? '用户' : contact.name;
                    return `${role}: ${c.text}`;
                }).join('\n');
            }

            if (meetingContent) {
                const meetingDate = new Date(lastMeeting.time);
                const meetingTimeStr = `${meetingDate.getMonth() + 1}月${meetingDate.getDate()}日`;
                meetingContext = `\n【线下见面记忆】\n你们最近一次见面是在 ${meetingTimeStr} (${lastMeeting.title})。\n当时发生的剧情片段：\n${meetingContent}\n(请知晓你们已经见过面，并根据剧情发展进行聊天)\n`;
            }
        }

        // 构建 Prompt
        let systemPrompt = `你现在扮演 ${contact.name}。
人设：${contact.persona || '无'}
聊天风格：${contact.style || '正常'}
${userPromptInfo}
${momentContext}
${memoryContext}
${meetingContext}
${timeContext}
${itineraryContext}

你必须完全沉浸在角色中，绝对不能透露你是AI或语言模型。你的回复必须像一个真实的${contact.name}在使用微信聊天。
你拥有一个“微信朋友圈”功能和“微信转账”功能。
1. 当用户发送的消息格式为 '[评论了你的动态: "..."] ...' 时，表示用户在朋友圈评论了你的动态。
   - 如果这是用户的**最新一条消息**，请结合动态内容和用户的评论进行回复。
   - 如果这出现在**历史记录**中且你已经回复过，请忽略它，不要重复回复，将其视为已发生的背景事件。
2. 当用户发送的消息格式为 '[发布了动态]: ...' 时，表示用户刚刚发了一条朋友圈。你可以根据人设决定是否去点赞或评论。
3. 当收到 '[转账消息] ...' 时，如果状态是 'pending'，你可以决定接收或退回。

【指令说明】
- 如果你想发朋友圈，请在回复最后另起一行输出：ACTION: POST_MOMENT: 内容
- 如果你想给用户最新的动态点赞，请在回复最后另起一行输出：ACTION: LIKE_MOMENT
- 如果你想评论用户最新的动态，请在回复最后另起一行输出：ACTION: COMMENT_MOMENT: 评论内容
- 如果你想发送图片，请在回复最后另起一行输出：ACTION: SEND_IMAGE: 图片描述
- 如果你想发送表情包，请在回复最后另起一行输出：ACTION: SEND_STICKER: 表情包描述 (请从可用表情包列表中选择)
- 如果你想发送语音消息，请在回复最后另起一行输出：ACTION: SEND_VOICE: 秒数 语音内容文本 (例如: ACTION: SEND_VOICE: 5 哈哈，我也这么觉得)
- 如果你想给用户转账，请在回复最后另起一行输出：ACTION: TRANSFER: 金额 备注 (例如: ACTION: TRANSFER: 88.88 节日快乐)
- 如果你想接收用户的转账，请在回复最后另起一行输出：ACTION: ACCEPT_TRANSFER: [ID] (例如: ACTION: ACCEPT_TRANSFER: 1737266888888)
- 如果你想退回用户的转账，请在回复最后另起一行输出：ACTION: RETURN_TRANSFER: [ID]
- 如果你想引用某条消息进行回复，请在回复最后另起一行输出：ACTION: QUOTE_MESSAGE: 消息内容摘要
- 如果你想更改自己的资料（网名、微信号、个性签名），请在回复最后另起一行输出：
  - ACTION: UPDATE_NAME: 新网名
  - ACTION: UPDATE_WXID: 新微信号
  - ACTION: UPDATE_SIGNATURE: 新签名
  (可以同时使用多个更改指令)

【记忆提取指令】
在对话过程中，当你注意到用户提到关于自己的新信息时（如喜好、习惯、特征、经历等），请将其记录下来。
但必须注意：如果这个信息已经包含在用户当前选择的身份描述中，就不要记录。

检查步骤：
1. 获取当前用户身份描述（当前联系人的userPersonaId对应的aiPrompt）
2. 如果要记录的信息已经在该身份描述中明确提到过，则跳过
3. 如果要记录的信息与身份描述中的信息本质相同（只是表述不同），也跳过
4. 只有全新的、身份描述中没有的信息才记录

记录格式：ACTION: RECORD_USER_INFO: 信息内容
示例：ACTION: RECORD_USER_INFO: 用户喜欢在周末爬山

注意事项：
1. 只记录客观事实，不要记录推测或假设
2. 确保信息简洁明了，一条信息一句话
3. 避免重复记录已有信息
4. 信息可以是用户的任何方面：喜好、厌恶、习惯、特征、经历、能力等
5. 必须严格检查是否已在身份描述中存在

- 如果需要输出角色的内心独白（心声），请在回复的最后（所有指令之后），另起一行输出：THOUGHT: 内容。

注意：
1. **严格遵守格式**：指令必须在回复的最后，每个指令独占一行，不要放在中间。
2. 正常回复应该自然，不要机械地说“我点赞了”或“我收钱了”。
3. 如果不想执行操作，就不要输出指令。
4. 发送图片时，请提供详细的画面描述。
5. 一次回复中最多只能发起一笔转账。
6. 你有权限更改自己的资料卡信息（网名、微信号、签名），当用户要求或你自己想改时可以使用。
7. **THOUGHT: 内容** 是角色的心理活动，用户可见（如果开启了显示）。

请回复对方的消息。保持简短，像微信聊天一样。
请务必生成 3 到 7 条回复（必须用 '|||' 分隔每条回复），模拟微信连续发送短消息的习惯。确保这几条消息是连续的对话流，不要重复表达相同的意思。
不要包含其他解释性文字。
确保你的回复格式正确，不要丢失 '|||' 分隔符，也不要丢失指令的前缀。`;

        // 添加表情包信息
        if (state.stickerCategories && state.stickerCategories.length > 0) {
            let activeStickers = [];
            
            // 筛选启用的表情包分类
            if (contact.linkedStickerCategories) {
                state.stickerCategories.forEach(cat => {
                    if (contact.linkedStickerCategories.includes(cat.id)) {
                        activeStickers = activeStickers.concat(cat.list);
                    }
                });
            } else {
                // 默认全部启用
                state.stickerCategories.forEach(cat => {
                    activeStickers = activeStickers.concat(cat.list);
                });
            }

            if (activeStickers.length > 0) {
                systemPrompt += '\n\n【可用表情包列表】\n';
                // 为了节省token，只列出前50个表情包的描述，或者随机选一些？
                // 这里列出所有描述，用逗号分隔
                const descriptions = activeStickers.map(s => s.desc).join(', ');
                systemPrompt += descriptions + '\n';
            }
        }

        // 添加世界书内容
        if (state.worldbook && state.worldbook.length > 0) {
            // 过滤出启用的条目
            let activeEntries = state.worldbook.filter(e => e.enabled);
            
            // 根据联系人关联的分类进行过滤
            // 如果 linkedWbCategories 不存在，默认使用所有分类（兼容旧数据）
            // 如果存在，只使用列表中的分类
            if (contact.linkedWbCategories) {
                activeEntries = activeEntries.filter(e => contact.linkedWbCategories.includes(e.categoryId));
            }
            
            if (activeEntries.length > 0) {
                systemPrompt += '\n\n世界书信息：\n';
                activeEntries.forEach(entry => {
                    let shouldAdd = false;
                    if (entry.keys && entry.keys.length > 0) {
                        // 检查历史记录中是否包含任意关键字
                        const historyText = history.map(h => h.content).join('\n');
                        const match = entry.keys.some(key => historyText.includes(key));
                        if (match) shouldAdd = true;
                    } else {
                        // 没有关键词，视为全局设定，始终添加
                        shouldAdd = true;
                    }
                    
                    if (shouldAdd) {
                        systemPrompt += `${entry.content}\n`;
                    }
                });
            }
        }

        // 处理上下文限制
        // 默认限制为最近 50 条，防止 Token 爆炸
        let limit = contact.contextLimit && contact.contextLimit > 0 ? contact.contextLimit : 50;
        let contextMessages = history.slice(-limit);

        // 预处理：限制发送给 AI 的图片数量，防止 Base64 导致 Token 超限
        // 只保留最近 3 张图片，其余替换为文本占位符
        let imageCount = 0;
        // 倒序遍历计数
        for (let i = contextMessages.length - 1; i >= 0; i--) {
            if (contextMessages[i].type === 'image') {
                imageCount++;
                if (imageCount > 3) {
                    // 标记为不发送图片数据
                    contextMessages[i]._skipImage = true;
                }
            }
        }

        const messages = [
            { role: 'system', content: systemPrompt },
            ...contextMessages.map(h => {
                let content = h.content;
                // 如果开启了心声可见，且消息包含心声，则将心声加入上下文
                if (contact.thoughtVisible && h.thought) {
                    content += `\n(内心独白: ${h.thought})`;
                }

                if (h.type === 'image') {
                    // 如果被标记跳过，或者内容不是 base64/url (容错)，则发送文本
                    if (h._skipImage) {
                        return { role: h.role, content: '[图片]' };
                    }
                    return {
                        role: h.role,
                        content: [
                            { type: "image_url", image_url: { url: h.content } }
                        ]
                    };
                } else if (h.type === 'virtual_image') {
                    return {
                        role: h.role,
                        content: `[发送了一张图片：${h.description}]`
                    };
                } else if (h.type === 'sticker') {
                    return {
                        role: h.role,
                        content: `[发送了一个表情包：${h.description}]`
                    };
                } else if (h.type === 'voice') {
                    // 解析语音消息内容，避免将 JSON 直接传给 AI
                    let voiceText = '语音消息';
                    try {
                        const data = JSON.parse(h.content);
                        voiceText = data.text || '语音消息';
                    } catch (e) {
                        voiceText = h.content;
                    }
                    return {
                        role: h.role,
                        content: `[发送了一条语音：${voiceText}]`
                    };
                } else if (h.type === 'voice_call_text') {
                    // 【关键修复】过滤语音通话消息中的音频数据
                    let callText = '通话内容';
                    try {
                        const data = JSON.parse(h.content);
                        callText = data.text || '通话内容';
                    } catch(e) {
                        callText = h.content;
                    }
                    return { role: h.role, content: callText };
                } else {
                    // 对于普通文本消息，也要防止它是 JSON 格式的转账等特殊消息残留
                    if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
                         try {
                             // 尝试解析，如果是转账等对象，提取文本描述
                             // 这里简单处理，如果是复杂对象，直接转为 "[特殊消息]" 避免报错
                             // 但为了兼容性，如果解析失败就原样发送
                             // 主要针对 transfer
                             if (h.type === 'transfer') {
                                 const data = JSON.parse(content);
                                 return { role: h.role, content: `[转账: ${data.amount}元]` };
                             }
                         } catch(e) {}
                    }
                    return { role: h.role, content: content };
                }
            })
        ];

        // UI 显示正在输入...
        const titleEl = document.getElementById('chat-title');
        const originalTitle = titleEl.textContent;
        titleEl.textContent = '正在输入中...';

        try {
            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: messages,
                    temperature: settings.temperature
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            let replyContent = data.choices[0].message.content;

            // 移除思维链 <thinking>...</thinking> 和 <think>...</think>
            replyContent = replyContent.replace(/<thinking>[\s\S]*?<\/thinking>/g, '')
                                       .replace(/<think>[\s\S]*?<\/think>/g, '')
                                       .trim();

            // 预处理：先按 ||| 分割
            const rawSegments = replyContent.split('|||');
            const cleanReplies = [];
            let imageToSend = null;
            let hasTransferred = false; // 限制一次只能转账一次
            
            // 定义指令正则 (匹配单行指令或直到段落结束)
            const momentRegex = /ACTION:\s*POST_MOMENT:\s*(.*?)(?:\n|$)/;
            const likeRegex = /ACTION:\s*LIKE_MOMENT(?:\s*|$)/;
            const commentRegex = /ACTION:\s*COMMENT_MOMENT:\s*(.*?)(?:\n|$)/;
            const sendImageRegex = /ACTION:\s*SEND_IMAGE:\s*(.*?)(?:\n|$)/;
            const sendStickerRegex = /ACTION:\s*SEND_STICKER:\s*(.*?)(?:\n|$)/;
            const transferRegex = /ACTION:\s*TRANSFER:\s*(\d+(?:\.\d{1,2})?)\s*(.*?)(?:\n|$)/;
            const acceptTransferRegex = /ACTION:\s*ACCEPT_TRANSFER:\s*(\d+)(?:\n|$)/;
            const returnTransferRegex = /ACTION:\s*RETURN_TRANSFER:\s*(\d+)(?:\n|$)/;
            const updateNameRegex = /ACTION:\s*UPDATE_NAME:\s*(.*?)(?:\n|$)/;
            const updateWxidRegex = /ACTION:\s*UPDATE_WXID:\s*(.*?)(?:\n|$)/;
            const updateSignatureRegex = /ACTION:\s*UPDATE_SIGNATURE:\s*(.*?)(?:\n|$)/;
            const quoteMessageRegex = /ACTION:\s*QUOTE_MESSAGE:\s*(.*?)(?:\n|$)/;
            const recordUserInfoRegex = /ACTION:\s*RECORD_USER_INFO:\s*(.*?)(?:\n|$)/;
            const thoughtRegex = /THOUGHT:\s*(.*?)(?:\n|$)/;

            let thoughtContent = null;
            let replyToObj = null;
            
            // 标记本轮回复是否已经处理过资料更新，防止重复
            let hasUpdatedName = false;
            let hasUpdatedWxid = false;
            let hasUpdatedSignature = false;

            for (let i = 0; i < rawSegments.length; i++) {
                let segment = rawSegments[i];
                let processedSegment = segment;

                // 解析心声指令 (通常在最后，但为了保险起见，在每个片段都检查)
                let thoughtMatch;
                while ((thoughtMatch = processedSegment.match(thoughtRegex)) !== null) {
                    thoughtContent = thoughtMatch[1].trim();
                    processedSegment = processedSegment.replace(thoughtMatch[0], '');
                }

                // 解析记忆提取指令
                let recordUserInfoMatch;
                while ((recordUserInfoMatch = processedSegment.match(recordUserInfoRegex)) !== null) {
                    let info = recordUserInfoMatch[1].trim();
                    
                    // 强制去除主语 "用户"、"我" 等
                    info = info.replace(/^(用户|我|他|她)(:|：|,|，|\s)?/, '').trim();

                    if (info) {
                        // 获取当前用户身份描述
                        let userAiPrompt = '';
                        if (contact.userPersonaId) {
                            const p = state.userPersonas.find(p => p.id === contact.userPersonaId);
                            if (p) userAiPrompt = p.aiPrompt || '';
                        }

                        // 去重检查
                        let isDuplicate = false;
                        
                        // 1. 检查 userPerception 数组
                        if (!contact.userPerception) contact.userPerception = [];
                        if (contact.userPerception.some(item => item.includes(info) || info.includes(item))) {
                            isDuplicate = true;
                        }

                        // 2. 检查 aiPrompt
                        if (!isDuplicate && userAiPrompt) {
                            if (userAiPrompt.toLowerCase().includes(info.toLowerCase())) {
                                isDuplicate = true;
                            }
                        }

                        if (!isDuplicate) {
                            contact.userPerception.push(info);
                            saveConfig();
                            showChatToast('TA记住了');
                        }
                    }
                    processedSegment = processedSegment.replace(recordUserInfoMatch[0], '');
                }

                // 解析引用指令
                let quoteMessageMatch;
                while ((quoteMessageMatch = processedSegment.match(quoteMessageRegex)) !== null) {
                    const quoteContent = quoteMessageMatch[1].trim();
                    if (quoteContent) {
                        // 在历史记录中查找匹配的消息 (倒序查找最近的)
                        // 优先查找用户消息，但也允许引用AI自己的消息
                        let targetMsg = null;
                        for (let j = history.length - 1; j >= 0; j--) {
                            const msg = history[j];
                            // 简单的包含匹配
                            if (msg.content && typeof msg.content === 'string' && msg.content.includes(quoteContent)) {
                                targetMsg = msg;
                                break;
                            }
                        }

                        if (targetMsg) {
                            let targetName = '未知';
                            if (targetMsg.role === 'user') {
                                // 获取用户名字
                                targetName = '我';
                                if (contact.userPersonaId) {
                                    const p = state.userPersonas.find(p => p.id === contact.userPersonaId);
                                    if (p) targetName = p.name;
                                } else if (state.userProfile) {
                                    targetName = state.userProfile.name;
                                }
                            } else {
                                targetName = contact.remark || contact.name;
                            }

                            replyToObj = {
                                name: targetName,
                                content: targetMsg.type === 'text' ? targetMsg.content : `[${targetMsg.type === 'sticker' ? '表情包' : '图片'}]`
                            };
                        }
                    }
                    processedSegment = processedSegment.replace(quoteMessageMatch[0], '');
                }

                // 解析资料更改指令
                let updateNameMatch;
                while ((updateNameMatch = processedSegment.match(updateNameRegex)) !== null) {
                    const newName = updateNameMatch[1].trim();
                    if (newName && !hasUpdatedName) {
                        contact.nickname = newName;
                        // 如果没有备注，更新标题
                        if (!contact.remark) {
                            document.getElementById('chat-title').textContent = newName;
                        }
                        saveConfig();
                        renderContactList();
                        setTimeout(() => sendMessage(`[系统消息]: 对方更改了网名为 "${newName}"`, false, 'text'), 500);
                        hasUpdatedName = true;
                    }
                    processedSegment = processedSegment.replace(updateNameMatch[0], '');
                }

                let updateWxidMatch;
                while ((updateWxidMatch = processedSegment.match(updateWxidRegex)) !== null) {
                    const newWxid = updateWxidMatch[1].trim();
                    if (newWxid && !hasUpdatedWxid) {
                        contact.wxid = newWxid;
                        saveConfig();
                        setTimeout(() => sendMessage(`[系统消息]: 对方更改了微信号`, false, 'text'), 500);
                        hasUpdatedWxid = true;
                    }
                    processedSegment = processedSegment.replace(updateWxidMatch[0], '');
                }

                let updateSignatureMatch;
                while ((updateSignatureMatch = processedSegment.match(updateSignatureRegex)) !== null) {
                    const newSignature = updateSignatureMatch[1].trim();
                    if (newSignature && !hasUpdatedSignature) {
                        contact.signature = newSignature;
                        saveConfig();
                        setTimeout(() => sendMessage(`[系统消息]: 对方更改了个性签名`, false, 'text'), 500);
                        hasUpdatedSignature = true;
                    }
                    processedSegment = processedSegment.replace(updateSignatureMatch[0], '');
                }

                // 解析朋友圈指令
                let momentMatch;
                while ((momentMatch = processedSegment.match(momentRegex)) !== null) {
                    const momentContent = momentMatch[1].trim();
                    if (momentContent) {
                        addMoment(contact.id, momentContent);
                    }
                    processedSegment = processedSegment.replace(momentMatch[0], '');
                }

                // 解析点赞指令
                let likeMatch;
                while ((likeMatch = processedSegment.match(likeRegex)) !== null) {
                    const userMoments = state.moments.filter(m => m.contactId === 'me');
                    if (userMoments.length > 0) {
                        const latestMoment = userMoments.sort((a, b) => b.time - a.time)[0];
                        const aiName = contact.remark || contact.name;
                        if (!latestMoment.likes || !latestMoment.likes.includes(aiName)) {
                            toggleLike(latestMoment.id, aiName);
                        }
                    }
                    processedSegment = processedSegment.replace(likeMatch[0], '');
                }

                // 解析评论指令
                let commentMatch;
                while ((commentMatch = processedSegment.match(commentRegex)) !== null) {
                    const commentContent = commentMatch[1].trim();
                    const userMoments = state.moments.filter(m => m.contactId === 'me');
                    if (userMoments.length > 0 && commentContent) {
                        const latestMoment = userMoments.sort((a, b) => b.time - a.time)[0];
                        const aiName = contact.remark || contact.name;
                        submitComment(latestMoment.id, commentContent, null, aiName);
                    }
                    processedSegment = processedSegment.replace(commentMatch[0], '');
                }

                // 解析发送图片指令
                let sendImageMatch;
                while ((sendImageMatch = processedSegment.match(sendImageRegex)) !== null) {
                    const imageDesc = sendImageMatch[1].trim();
                    if (imageDesc) {
                        imageToSend = { type: 'virtual_image', content: imageDesc };
                    }
                    processedSegment = processedSegment.replace(sendImageMatch[0], '');
                }

                // 解析发送表情包指令
                let sendStickerMatch;
                while ((sendStickerMatch = processedSegment.match(sendStickerRegex)) !== null) {
                    const stickerDesc = sendStickerMatch[1].trim();
                    if (stickerDesc) {
                        // 查找对应的表情包URL
                        let stickerUrl = null;
                        // 遍历所有分类查找匹配的描述
                        for (const cat of state.stickerCategories) {
                            // 检查是否在允许的分类中
                            if (contact.linkedStickerCategories && !contact.linkedStickerCategories.includes(cat.id)) {
                                continue;
                            }
                            const found = cat.list.find(s => s.desc === stickerDesc);
                            if (found) {
                                stickerUrl = found.url;
                                break;
                            }
                        }
                        
                        if (stickerUrl) {
                            imageToSend = { type: 'sticker', content: stickerUrl, desc: stickerDesc };
                        }
                    }
                    processedSegment = processedSegment.replace(sendStickerMatch[0], '');
                }
                // === 插入点 2：解析 AI 语音指令 ===
                const sendVoiceRegex = /ACTION:\s*SEND_VOICE:\s*(\d+)\s*(.*?)(?:\n|$)/;
                let sendVoiceMatch;
                while ((sendVoiceMatch = processedSegment.match(sendVoiceRegex)) !== null) {
                    const duration = sendVoiceMatch[1];
                    const text = sendVoiceMatch[2].trim();
                    if (text) {
                        // 尝试生成 TTS
                        // 使用闭包保存当前文本和时长
                        (async (d, t) => {
                            let audioData = null;
                            // 检查当前联系人是否启用了 TTS
                            if (contact.ttsEnabled) {
                                // 显示正在生成语音的提示（可选，这里简单处理）
                                console.log('正在生成 Minimax 语音...');
                                audioData = await generateMinimaxTTS(t, contact.ttsVoiceId);
                            }

                            // 延迟发送，模拟录音过程
                            setTimeout(() => {
                                // 构造语音消息数据，初始不包含音频数据
                                const voiceData = {
                                    duration: parseInt(d),
                                    text: t,
                                    isReal: false,
                                    audio: null // 初始为空，点击播放时生成
                                };
                                sendMessage(JSON.stringify(voiceData), false, 'voice');
                            }, 1500);
                        })(duration, text);
                    }
                    processedSegment = processedSegment.replace(sendVoiceMatch[0], '');
                }
                // === 插入点 2 结束 ===

                // 解析转账指令
                let transferMatch;
                while ((transferMatch = processedSegment.match(transferRegex)) !== null) {
                    if (!hasTransferred) {
                        const amount = transferMatch[1];
                        const remark = transferMatch[2].trim();
                        // 延迟发送转账消息，模拟操作
                        setTimeout(() => {
                            const transferId = Date.now() + Math.floor(Math.random() * 1000);
                            sendMessage(JSON.stringify({ id: transferId, amount, remark: remark || '转账给您', status: 'pending' }), false, 'transfer');
                        }, 1000);
                        hasTransferred = true;
                    }
                    processedSegment = processedSegment.replace(transferMatch[0], '');
                }

                // 解析接收转账指令
                let acceptTransferMatch;
                while ((acceptTransferMatch = processedSegment.match(acceptTransferRegex)) !== null) {
                    const transferId = parseInt(acceptTransferMatch[1]);
                    if (transferId) {
                        setTimeout(() => {
                            updateTransferStatus(transferId, 'accepted');
                            sendMessage('[系统消息]: 对方已收款', false, 'text');
                        }, 1000);
                    }
                    processedSegment = processedSegment.replace(acceptTransferMatch[0], '');
                }

                // 解析退回转账指令
                let returnTransferMatch;
                while ((returnTransferMatch = processedSegment.match(returnTransferRegex)) !== null) {
                    const transferId = parseInt(returnTransferMatch[1]);
                    if (transferId) {
                        setTimeout(() => {
                            updateTransferStatus(transferId, 'returned');
                            handleAiReturnTransfer(transferId);
                            sendMessage('[系统消息]: 转账已退还', false, 'text');
                        }, 1000);
                    }
                    processedSegment = processedSegment.replace(returnTransferMatch[0], '');
                }

                // 清理后的文本如果非空，则作为回复
                const finalReply = processedSegment.trim();
                if (finalReply) {
                    cleanReplies.push(finalReply);
                }
            }

            // 更新心声气泡
            if (thoughtContent && contact.showThought) {
                updateThoughtBubble(thoughtContent);
            }

            for (let i = 0; i < cleanReplies.length; i++) {
                const reply = cleanReplies[i];
                // 只有最后一条回复才附带心声数据
                const thought = (i === cleanReplies.length - 1) ? thoughtContent : null;
                // 只有第一条回复才附带引用数据（通常引用在最开始）
                const replyTo = (i === 0) ? replyToObj : null;
                await typewriterEffect(reply, contact.avatar, thought, replyTo);
                // 简单的延迟，让多条消息之间有间隔
                await new Promise(r => setTimeout(r, 500));
            }

            // 如果有图片或表情包要发送，在文本回复之后发送
            if (imageToSend) {
                if (imageToSend.type === 'virtual_image') {
                    const defaultImageUrl = state.defaultVirtualImageUrl || 'https://placehold.co/600x400/png?text=Photo';
                    sendMessage(defaultImageUrl, false, 'virtual_image', imageToSend.content);
                } else if (imageToSend.type === 'sticker') {
                    sendMessage(imageToSend.content, false, 'sticker', imageToSend.desc);
                }
            }

        } catch (error) {
            console.error('AI生成失败:', error);
            alert('AI生成失败，请检查配置');
        } finally {
            // 恢复标题
            const currentContact = state.contacts.find(c => c.id === state.currentChatContactId);
            if (currentContact) {
                titleEl.textContent = currentContact.remark || currentContact.name;
            } else {
                titleEl.textContent = originalTitle;
            }
        }
    }

    function typewriterEffect(text, avatarUrl, thought = null, replyTo = null) {
        return new Promise(resolve => {
            // 这里为了简化，直接调用 appendMessageToUI，不使用打字机效果的逐字显示
            // 如果需要打字机效果，需要重构 appendMessageToUI 或在这里手动实现
            // 考虑到引用功能的复杂性，暂时直接显示完整消息
            
            // 保存完整的消息到历史记录
            if (!state.chatHistory[state.currentChatContactId]) {
                state.chatHistory[state.currentChatContactId] = [];
            }
            
            const msgData = {
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                role: 'assistant',
                content: text,
                replyTo: replyTo
            };
            
            if (thought) {
                msgData.thought = thought;
            }
            
            state.chatHistory[state.currentChatContactId].push(msgData);
            
            // 增加消息计数并检查是否触发行程生成
            const contact = state.contacts.find(c => c.id === state.currentChatContactId);
            if (contact) {
                if (typeof contact.messagesSinceLastItinerary !== 'number') {
                    contact.messagesSinceLastItinerary = 0;
                }
                contact.messagesSinceLastItinerary++;
                
                if (contact.autoItineraryEnabled && contact.messagesSinceLastItinerary >= (contact.autoItineraryInterval || 10)) {
                    generateNewItinerary(contact);
                }
            }

            saveConfig();
            
            // 使用 appendMessageToUI 渲染，确保包含长按事件绑定等逻辑
            appendMessageToUI(text, false, 'text', null, replyTo, msgData.id);
            
            scrollToBottom();

            // 更新联系人列表的最后一条消息
            renderContactList(state.currentContactGroup || 'all');
            
            // 检查是否需要自动总结
            checkAndSummarize(state.currentChatContactId);

            resolve();
        });
    }

    // --- 钱包功能 ---

    function renderWallet() {
        const balanceEl = document.getElementById('wallet-balance');
        const transactionsEl = document.getElementById('wallet-transactions');
        
        if (!state.wallet) state.wallet = { balance: 0.00, transactions: [] };
        
        // 更新余额显示
        balanceEl.textContent = `¥${parseFloat(state.wallet.balance).toFixed(2)}`;
        
        // 渲染交易记录
        transactionsEl.innerHTML = '';
        
        if (state.wallet.transactions.length === 0) {
            transactionsEl.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">暂无交易记录</div>';
            return;
        }
        
        state.wallet.transactions.forEach(t => {
            const item = document.createElement('div');
            item.className = 'transaction-item';
            
            const date = new Date(t.time);
            const timeStr = `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            const isIncome = t.type === 'income';
            const amountClass = isIncome ? 'income' : 'expense';
            const amountPrefix = isIncome ? '+' : '-';
            
            // 黑白简约风：图标统一为简单的圆点或线条，或者直接去除图标，只保留文字
            // 这里使用简单的图标，黑白配色
            
            item.innerHTML = `
                <div class="transaction-icon-simple">
                    <i class="fas ${isIncome ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${t.title}</div>
                    <div class="transaction-time">${timeStr}</div>
                </div>
                <div class="transaction-amount ${amountClass}">${amountPrefix}${parseFloat(t.amount).toFixed(2)}</div>
            `;
            transactionsEl.appendChild(item);
        });
    }

    function handleRecharge() {
        let amount = 0;
        const inputAmount = document.getElementById('recharge-amount').value;
        
        if (inputAmount) {
            amount = parseFloat(inputAmount);
        }
        
        if (!amount || amount <= 0) {
            alert('请输入有效的充值金额');
            return;
        }
        
        if (!state.wallet) state.wallet = { balance: 0.00, transactions: [] };
        
        state.wallet.balance += amount;
        state.wallet.transactions.unshift({
            id: Date.now(),
            type: 'income',
            amount: amount,
            title: '余额充值',
            time: Date.now(),
            relatedId: null
        });
        
        saveConfig();
        renderWallet();
        document.getElementById('wallet-recharge-modal').classList.add('hidden');
        alert(`成功充值 ¥${amount.toFixed(2)}`);
    }

    function handleAiReturnTransfer(transferId) {
        // 查找转账金额
        if (!state.currentChatContactId) return;
        const messages = state.chatHistory[state.currentChatContactId];
        let amount = 0;
        
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (msg.type === 'transfer') {
                try {
                    const data = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content;
                    if (data.id === transferId) {
                        amount = parseFloat(data.amount);
                        break;
                    }
                } catch (e) {}
            }
        }

        if (amount > 0) {
            if (!state.wallet) state.wallet = { balance: 0.00, transactions: [] };
            state.wallet.balance += amount;
            state.wallet.transactions.unshift({
                id: Date.now(),
                type: 'income',
                amount: amount,
                title: '转账退回',
                time: Date.now(),
                relatedId: transferId
            });
            saveConfig();
        }
    }

    // --- 转账交互功能 ---

    window.handleTransferClick = function(transferId, role) {
        if (!transferId) {
            alert('转账数据无效');
            return;
        }

        // 查找转账数据
        if (!state.currentChatContactId || !state.chatHistory[state.currentChatContactId]) return;
        
        const messages = state.chatHistory[state.currentChatContactId];
        let transferData = null;
        
        // 查找对应的转账消息
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (msg.type === 'transfer') {
                try {
                    const data = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content;
                    // 使用宽松比较或字符串比较，防止类型不一致
                    if (data.id == transferId) {
                        transferData = data;
                        break;
                    }
                } catch (e) {}
            }
        }

        if (!transferData) {
            console.error('未找到转账数据', transferId);
            alert('未找到该转账记录');
            return;
        }

        // 容错处理：如果缺少 status，默认为 pending
        const status = (transferData.status || 'pending').toLowerCase();

        // 如果已经处理过（不是 pending），则只显示详情
        if (status !== 'pending') {
            let statusText = status;
            if (status === 'accepted') statusText = '已收款';
            if (status === 'returned') statusText = '已退还';
            
            alert(`该转账状态为: ${statusText}`);
            return;
        }

        // 如果是自己发出的转账，不能自己接收，只能查看或等待
        // 但如果是模拟器，用户可能想测试“退回”自己的转账？
        // 微信逻辑：自己发的转账，点击显示“等待对方确认收款”。
        // 对方发的转账，点击显示“确认收款”。
        
        // 这里为了方便测试，允许用户操作任何 pending 的转账
        // 但区分一下角色提示
        
        const isMe = role === 'user';
        const actionSheet = document.createElement('div');
        actionSheet.className = 'modal';
        actionSheet.style.zIndex = '300';
        actionSheet.style.alignItems = 'flex-end';
        
        const amount = parseFloat(transferData.amount).toFixed(2);
        
        actionSheet.innerHTML = `
            <div class="modal-content" style="height: auto; border-radius: 12px 12px 0 0;">
                <div style="padding: 20px; text-align: center;">
                    <div style="font-size: 14px; color: #666; margin-bottom: 5px;">${isMe ? '等待对方收款' : '收到转账'}</div>
                    <div style="font-size: 32px; font-weight: bold; margin-bottom: 20px;">¥${amount}</div>
                    <div style="font-size: 14px; color: #999; margin-bottom: 20px;">${transferData.remark}</div>
                    
                    ${!isMe ? `<button onclick="window.acceptTransfer(${transferData.id})" class="ios-btn-block" style="background-color: #07C160; margin-bottom: 10px;">确认收款</button>` : ''}
                    <button onclick="window.returnTransfer(${transferData.id})" class="ios-btn-block secondary" style="color: #FF3B30; margin-bottom: 10px;">退还转账</button>
                    <button onclick="this.closest('.modal').remove()" class="ios-btn-block secondary">取消</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(actionSheet);
        
        // 点击背景关闭
        actionSheet.addEventListener('click', (e) => {
            if (e.target === actionSheet) actionSheet.remove();
        });
    };

    window.acceptTransfer = function(transferId) {
        // 获取转账金额
        if (!state.currentChatContactId) return;
        const messages = state.chatHistory[state.currentChatContactId];
        let amount = 0;
        
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (msg.type === 'transfer') {
                try {
                    const data = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content;
                    if (data.id === transferId) {
                        amount = parseFloat(data.amount);
                        break;
                    }
                } catch (e) {}
            }
        }

        if (amount > 0) {
            if (!state.wallet) state.wallet = { balance: 0.00, transactions: [] };
            state.wallet.balance += amount;
            state.wallet.transactions.unshift({
                id: Date.now(),
                type: 'income',
                amount: amount,
                title: '转账收款',
                time: Date.now(),
                relatedId: transferId
            });
            saveConfig();
        }

        updateTransferStatus(transferId, 'accepted');
        document.querySelector('.modal[style*="z-index: 300"]').remove();
        
        // 发送系统消息
        sendMessage('[系统消息]: 用户已收款', true, 'text'); 
    };

    window.returnTransfer = function(transferId) {
        updateTransferStatus(transferId, 'returned');
        document.querySelector('.modal[style*="z-index: 300"]').remove();
        
        sendMessage('[系统消息]: 转账已退还', true, 'text');
    };

    function updateTransferStatus(transferId, status) {
        if (!state.currentChatContactId) return;
        
        const messages = state.chatHistory[state.currentChatContactId];
        let found = false;
        
        // 遍历消息找到对应的转账消息
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (msg.type === 'transfer') {
                try {
                    const data = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content;
                    if (data.id === transferId) {
                        data.status = status;
                        msg.content = JSON.stringify(data);
                        found = true;
                        break;
                    }
                } catch (e) {}
            }
        }
        
        if (found) {
            saveConfig();
            renderChatHistory(state.currentChatContactId);
        }
    }

    // --- 记忆功能 ---

    function openMemoryApp() {
        if (!state.currentChatContactId) {
            alert('请先进入一个聊天窗口');
            return;
        }
        
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        const memoryApp = document.getElementById('memory-app');
        
        renderMemoryList();
        memoryApp.classList.remove('hidden');
    }

    function handleSaveManualMemory() {
        const content = document.getElementById('manual-memory-content').value.trim();
        if (!content) {
            alert('请输入记忆内容');
            return;
        }

        if (!state.currentChatContactId) return;

        state.memories.push({
            id: Date.now(),
            contactId: state.currentChatContactId,
            content: content,
            time: Date.now()
        });
        saveConfig();
        renderMemoryList();
        document.getElementById('add-memory-modal').classList.add('hidden');
    }

    function openManualSummary() {
        if (!state.currentChatContactId) return;
        
        const history = state.chatHistory[state.currentChatContactId] || [];
        document.getElementById('total-chat-count').textContent = history.length;
        document.getElementById('summary-start-index').value = '';
        document.getElementById('summary-end-index').value = '';
        
        document.getElementById('manual-summary-modal').classList.remove('hidden');
    }

    async function handleManualSummary() {
        if (!state.currentChatContactId) return;
        
        const start = parseInt(document.getElementById('summary-start-index').value);
        const end = parseInt(document.getElementById('summary-end-index').value);
        const history = state.chatHistory[state.currentChatContactId] || [];
        
        if (isNaN(start) || isNaN(end) || start < 1 || end > history.length || start > end) {
            alert('请输入有效的楼层范围');
            return;
        }

        // 转换为数组索引 (楼层从1开始)
        const messagesToSummarize = history.slice(start - 1, end);
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        const range = `${start}-${end}`;
        
        document.getElementById('manual-summary-modal').classList.add('hidden');
        showNotification('正在手动总结...');
        
        await generateSummary(contact, messagesToSummarize, range);
    }

    function openMemorySettings() {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        
        document.getElementById('modal-memory-send-limit').value = contact.memorySendLimit || '';
        document.getElementById('memory-settings-modal').classList.remove('hidden');
    }

    function handleSaveMemorySettings() {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        
        const limit = parseInt(document.getElementById('modal-memory-send-limit').value);
        contact.memorySendLimit = isNaN(limit) ? 0 : limit;
        
        saveConfig();
        document.getElementById('memory-settings-modal').classList.add('hidden');
        alert('设置已保存');
    }

    let currentEditingMemoryId = null;

    function renderMemoryList() {
        const list = document.getElementById('memory-list');
        const emptyState = document.getElementById('memory-empty');
        if (!list) return;

        list.innerHTML = '';
        
        if (!state.currentChatContactId) return;

        const contactMemories = state.memories.filter(m => m.contactId === state.currentChatContactId);
        
        if (contactMemories.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';

        // 按时间倒序显示
        const sortedMemories = [...contactMemories].sort((a, b) => b.time - a.time);

        sortedMemories.forEach(memory => {
            const item = document.createElement('div');
            item.className = 'memory-card';
            
            const date = new Date(memory.time);
            const timeStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            item.innerHTML = `
                <div class="memory-header">
                    <span class="memory-time">${timeStr}</span>
                    <div class="memory-actions">
                        <button class="memory-btn" onclick="window.editMemory(${memory.id})"><i class="fas fa-pen"></i></button>
                        <button class="memory-btn" onclick="window.deleteMemory(${memory.id})"><i class="fas fa-ellipsis-h"></i></button>
                    </div>
                </div>
                <div class="memory-content">${memory.content}</div>
                ${memory.range ? `<div style="text-align: right; margin-top: 8px; font-size: 12px; color: #999;">${memory.range}</div>` : ''}
            `;
            list.appendChild(item);
        });
    }

    window.editMemory = function(id) {
        const memory = state.memories.find(m => m.id === id);
        if (!memory) return;

        currentEditingMemoryId = id;
        document.getElementById('edit-memory-content').value = memory.content;
        document.getElementById('edit-memory-modal').classList.remove('hidden');
    };

    function handleSaveEditedMemory() {
        if (!currentEditingMemoryId) return;

        const content = document.getElementById('edit-memory-content').value.trim();
        if (!content) {
            alert('记忆内容不能为空');
            return;
        }

        const memory = state.memories.find(m => m.id === currentEditingMemoryId);
        if (memory) {
            memory.content = content;
            saveConfig();
            renderMemoryList();
            document.getElementById('edit-memory-modal').classList.add('hidden');
        }
        currentEditingMemoryId = null;
    }

    window.deleteMemory = function(id) {
        if (confirm('确定要删除这条记忆吗？')) {
            state.memories = state.memories.filter(m => m.id !== id);
            saveConfig();
            renderMemoryList();
        }
    };

    function showNotification(message, duration = 0, type = 'info') {
        const notification = document.getElementById('summary-notification');
        const textEl = document.getElementById('summary-notification-text');
        const iconEl = notification.querySelector('i');

        if (!notification || !textEl) return;

        textEl.textContent = message;
        notification.classList.remove('hidden');
        
        // 重置样式
        notification.classList.remove('success');
        iconEl.className = 'fas fa-spinner fa-spin';

        if (type === 'success') {
            notification.classList.add('success');
            iconEl.className = 'fas fa-check-circle';
        }

        if (duration > 0) {
            setTimeout(() => {
                notification.classList.add('hidden');
            }, duration);
        }
    }

    let itineraryNotificationTimeout;

    function showItineraryNotification(message, duration = 0, type = 'info') {
        const notification = document.getElementById('itinerary-notification');
        const textEl = document.getElementById('itinerary-notification-text');
        const iconEl = notification.querySelector('i');

        if (!notification || !textEl) return;

        // 清除之前的 timeout
        if (itineraryNotificationTimeout) {
            clearTimeout(itineraryNotificationTimeout);
            itineraryNotificationTimeout = null;
        }

        textEl.textContent = message;
        notification.classList.remove('hidden');
        
        // 重置样式
        notification.classList.remove('success');
        notification.classList.remove('error');
        iconEl.className = 'fas fa-spinner fa-spin';

        if (type === 'success') {
            notification.classList.add('success');
            iconEl.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            notification.classList.add('error');
            iconEl.className = 'fas fa-exclamation-circle';
        }

        if (duration > 0) {
            itineraryNotificationTimeout = setTimeout(() => {
                notification.classList.add('hidden');
            }, duration);
        }
    }

    async function checkAndSummarize(contactId) {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact || !contact.summaryLimit || contact.summaryLimit <= 0) return;

        const history = state.chatHistory[contactId] || [];
        
        if (!contact.lastSummaryIndex) contact.lastSummaryIndex = 0;
        
        const newMessagesCount = history.length - contact.lastSummaryIndex;
        
        if (newMessagesCount >= contact.summaryLimit) {
            // 触发总结
            const messagesToSummarize = history.slice(contact.lastSummaryIndex);
            
            const startFloor = contact.lastSummaryIndex + 1;
            const endFloor = history.length;
            const range = `${startFloor}-${endFloor}`;

            contact.lastSummaryIndex = history.length; // 更新索引
            saveConfig(); // 保存索引更新

            showNotification('正在总结...');
            await generateSummary(contact, messagesToSummarize, range);
        }
    }

    async function generateSummary(contact, messages, range) {
        const settings = state.aiSettings2.url ? state.aiSettings2 : state.aiSettings; // 优先使用副API
        if (!settings.url || !settings.key) {
            console.log('未配置副API，无法自动总结');
            showNotification('未配置API', 2000);
            return;
        }

        // 过滤掉非文本消息和系统消息
        const textMessages = messages.filter(m => m.type === 'text' && !m.content.startsWith('['));
        if (textMessages.length === 0) {
            document.getElementById('summary-notification').classList.add('hidden');
            return;
        }

        // 获取用户名字
        let userName = '用户';
        if (contact.userPersonaId) {
            const p = state.userPersonas.find(p => p.id === contact.userPersonaId);
            if (p) userName = p.name;
        } else if (state.userProfile) {
            userName = state.userProfile.name;
        }

        const chatText = textMessages.map(m => `${m.role === 'user' ? userName : contact.name}: ${m.content}`).join('\n');

        const systemPrompt = `你是一个即时通讯软件的聊天记录总结助手。
请阅读以下聊天记录，并提取出其中重要的信息、事实、用户偏好或发生的事件，生成一条简练的“记忆”。
记忆应该是陈述句，包含关键信息。
请务必总结 ${userName} 和 ${contact.name} 聊天的具体内容，不要只总结重要信息。
如果聊天记录中没有值得记忆的重要信息（例如只是简单的问候或无意义的对话），请返回 "无"。
不要包含“聊天记录显示”、“用户说”等前缀，直接陈述事实。`;

        try {
            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: chatText }
                    ],
                    temperature: 0.5
                })
            });

            if (!response.ok) {
                let errorDetail = `Status: ${response.status} ${response.statusText}`;
                try {
                    const errorJson = await response.json();
                    errorDetail += `\nResponse: ${JSON.stringify(errorJson, null, 2)}`;
                } catch (e) {
                    try {
                        const errorText = await response.text();
                        errorDetail += `\nResponse: ${errorText}`;
                    } catch (e2) {}
                }
                throw new Error(errorDetail);
            }

            const data = await response.json();

            if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
                throw new Error(`API 响应结构异常: ${JSON.stringify(data)}`);
            }

            let summary = data.choices[0].message.content.trim();
            console.log('自动总结 API 返回内容:', summary);

            if (summary && summary !== '无' && summary !== '无。') {
                // 添加到记忆
                state.memories.push({
                    id: Date.now(),
                    contactId: contact.id,
                    content: summary,
                    time: Date.now(),
                    range: range
                });
                saveConfig();
                
                // 如果当前在记忆页面，刷新列表
                if (!document.getElementById('memory-app').classList.contains('hidden')) {
                    renderMemoryList();
                }
                
                console.log('自动总结生成记忆:', summary);
                showNotification('总结完成', 2000, 'success');
            } else {
                // 没有生成有效记忆
                console.log('自动总结未生成有效记忆');
                showNotification('未提取到重要信息', 2000);
            }

        } catch (error) {
            console.error('自动总结失败:', error);
            showNotification('总结出错', 2000);
            alert(`自动总结 API 请求失败：\n${error.message}`);
        }
    }

    // --- 字体功能 ---

    function handleFontUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const fontName = `CustomFont_${Date.now()}`;
            const fontFace = new FontFace(fontName, `url(${event.target.result})`);
            
            fontFace.load().then((loadedFace) => {
                document.fonts.add(loadedFace);
                addFontToState(fontName, event.target.result, 'local');
            }).catch(err => {
                console.error('字体加载失败:', err);
                alert('字体加载失败，请检查文件格式');
            });
        };
        reader.readAsDataURL(file);
    }

    function handleFontUrl() {
        const url = document.getElementById('font-url').value.trim();
        if (!url) return;
        addWebFont(url);
        document.getElementById('font-url').value = '';
    }

    function handleMeetingFontUrl() {
        const url = document.getElementById('meeting-font-url').value.trim();
        if (!url) return;
        
        const fontName = `MeetingWebFont_${Date.now()}`;
        const style = document.createElement('style');
        style.textContent = `@font-face { font-family: '${fontName}'; src: url('${url}'); }`;
        document.head.appendChild(style);
        
        // 添加到字体列表但不切换全局
        state.fonts.push({ name: fontName, source: url, type: 'url' });
        
        // 仅切换见面字体
        state.currentMeetingFont = fontName;
        applyMeetingFont(fontName);
        saveConfig();
        
        document.getElementById('meeting-font-url').value = '';
        alert('网络字体已应用到见面详情页');
    }

    function addWebFont(url) {
        const fontName = `WebFont_${Date.now()}`;
        const style = document.createElement('style');
        style.textContent = `@font-face { font-family: '${fontName}'; src: url('${url}'); }`;
        document.head.appendChild(style);
        addFontToState(fontName, url, 'url');
    }

    function resetFont() {
        state.currentFont = 'default';
        applyFont('default');
        saveConfig();
        alert('已重置为系统默认字体');
    }

    function addFontToState(name, source, type) {
        state.fonts.push({ name, source, type });
        state.currentFont = name;
        applyFont(name);
        saveConfig();
    }

    function applyFont(fontName) {
        if (fontName === 'default') {
            document.documentElement.style.setProperty('--font-family', '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Helvetica, Arial, sans-serif');
        } else {
            const font = state.fonts.find(f => f.name === fontName);
            if (font) {
                if (font.type === 'local') {
                    const fontFace = new FontFace(font.name, `url(${font.source})`);
                    fontFace.load().then(loadedFace => {
                        document.fonts.add(loadedFace);
                        document.documentElement.style.setProperty('--font-family', fontName);
                    }).catch(() => {
                        document.documentElement.style.setProperty('--font-family', fontName);
                    });
                } else {
                    if (!document.getElementById(`style-${font.name}`)) {
                        const style = document.createElement('style');
                        style.id = `style-${font.name}`;
                        style.textContent = `@font-face { font-family: '${font.name}'; src: url('${font.source}'); }`;
                        document.head.appendChild(style);
                    }
                    document.documentElement.style.setProperty('--font-family', fontName);
                }
            }
        }
    }

    function handleDeleteFont() {
        if (state.currentFont === 'default') return;
        state.fonts = state.fonts.filter(f => f.name !== state.currentFont);
        state.currentFont = 'default';
        applyFont('default');
        saveConfig();
    }
    // === 新增：专门用于应用见面字体的函数 ===
function applyMeetingFont(fontName) {
    if (fontName === 'default') {
        // 恢复为跟随全局或系统默认
        document.documentElement.style.setProperty('--meeting-font-family', 'var(--font-family)');
    } else {
        const font = state.fonts.find(f => f.name === fontName);
        if (font) {
            // 确保字体样式标签已创建（复用已有的加载逻辑）
            if (font.type === 'url' && !document.getElementById(`style-${font.name}`)) {
                const style = document.createElement('style');
                style.id = `style-${font.name}`;
                style.textContent = `@font-face { font-family: '${font.name}'; src: url('${font.source}'); }`;
                document.head.appendChild(style);
            }
            // 关键点：只修改 --meeting-font-family 变量
            document.documentElement.style.setProperty('--meeting-font-family', fontName);
        }
    }
}

// === 新增：处理见面字体预设应用 ===
function handleApplyMeetingFontPreset(e) {
    const name = e.target.value;
    if (!name) return;
    
    const preset = state.fontPresets.find(p => p.name === name);
    if (preset) {
        state.currentMeetingFont = preset.font;
        applyMeetingFont(preset.font);
        saveConfig();
    }
}

// === 新增：处理见面字体上传 ===
function handleMeetingFontUploadAction(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const fontName = `MeetingFont_${Date.now()}`;
        const fontFace = new FontFace(fontName, `url(${event.target.result})`);
        
        fontFace.load().then((loadedFace) => {
            document.fonts.add(loadedFace);
            // 添加到全局字体列表（这样也能被保存）
            addFontToState(fontName, event.target.result, 'local'); 
            
            // 但是！只应用到见面模式
            state.currentMeetingFont = fontName;
            applyMeetingFont(fontName);
            saveConfig();
            
            alert('字体上传成功，已仅应用于见面模式');
        }).catch(err => {
            console.error('字体加载失败:', err);
            alert('字体加载失败，请检查文件格式');
        });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

// === 新增：处理见面字体重置 ===
function resetMeetingFont() {
    state.currentMeetingFont = 'default';
    applyMeetingFont('default');
    saveConfig();
    alert('见面字体已重置为默认');
}

    // --- 字体预设功能 ---

    function handleSaveFontPreset() {
        const name = prompt('请输入字体预设名称：');
        if (!name) return;
        
        const preset = {
            name: name,
            font: state.currentFont
        };
        
        state.fontPresets.push(preset);
        saveConfig();
        renderFontPresets();
        document.getElementById('font-preset-select').value = name;
        alert('字体预设已保存');
    }

    function handleDeleteFontPreset() {
        const select = document.getElementById('font-preset-select');
        const name = select.value;
        if (!name) return;
        
        if (confirm(`确定要删除预设 "${name}" 吗？`)) {
            state.fontPresets = state.fontPresets.filter(p => p.name !== name);
            saveConfig();
            renderFontPresets();
        }
    }

    function handleApplyFontPreset(e) {
        const name = e.target.value;
        if (!name) return;
        
        const preset = state.fontPresets.find(p => p.name === name);
        if (preset) {
            state.currentFont = preset.font;
            applyFont(state.currentFont);
            saveConfig();
        }
    }

    function renderFontPresets() {
        const selects = [
            document.getElementById('font-preset-select'),
            document.getElementById('meeting-font-preset-select')
        ];
        
        selects.forEach(select => {
            if (!select) return;
            
            const currentValue = select.value;
            select.innerHTML = '<option value="">-- 选择预设 --</option>';
            
            if (state.fontPresets) {
                state.fontPresets.forEach(preset => {
                    const option = document.createElement('option');
                    option.value = preset.name;
                    option.textContent = preset.name;
                    select.appendChild(option);
                });
            }
            
            // 尝试恢复选中状态
            if (currentValue && state.fontPresets.some(p => p.name === currentValue)) {
                select.value = currentValue;
            }
        });
    }

    // --- 壁纸功能 ---

    function handleWallpaperUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 1024, 0.7).then(base64 => {
            const wallpaper = {
                id: Date.now(),
                data: base64
            };
            state.wallpapers.push(wallpaper);
            state.currentWallpaper = wallpaper.id;
            applyWallpaper(wallpaper.id);
            renderWallpaperGallery();
            saveConfig();
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
    }

    function renderWallpaperGallery() {
        const gallery = document.getElementById('wallpaper-gallery');
        if (!gallery) return;
        
        gallery.innerHTML = '';
        
        state.wallpapers.forEach(wp => {
            const item = document.createElement('div');
            item.className = `gallery-item ${state.currentWallpaper === wp.id ? 'selected' : ''}`;
            item.innerHTML = `
                <img src="${wp.data}" alt="Wallpaper">
                <button class="delete-wp-btn" data-id="${wp.id}">&times;</button>
            `;
            
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-wp-btn')) {
                    deleteWallpaper(wp.id);
                } else {
                    state.currentWallpaper = wp.id;
                    applyWallpaper(wp.id);
                    renderWallpaperGallery();
                    saveConfig();
                }
            });
            
            gallery.appendChild(item);
        });
    }

    function deleteWallpaper(id) {
        state.wallpapers = state.wallpapers.filter(wp => wp.id !== id);
        if (state.currentWallpaper === id) {
            state.currentWallpaper = null;
            applyWallpaper(null);
        }
        renderWallpaperGallery();
        saveConfig();
    }

    function handleChatWallpaperUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 800, 0.7).then(base64 => {
            const wallpaper = {
                id: Date.now(),
                data: base64
            };
            if (!state.chatWallpapers) state.chatWallpapers = [];
            state.chatWallpapers.push(wallpaper);
            state.tempSelectedChatBg = wallpaper.data;
            renderChatWallpaperGallery();
            saveConfig();
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
        e.target.value = '';
    }

    function renderChatWallpaperGallery() {
        const gallery = document.getElementById('chat-bg-gallery');
        if (!gallery) return;
        
        gallery.innerHTML = '';
        
        if (!state.chatWallpapers) state.chatWallpapers = [];
        
        state.chatWallpapers.forEach(wp => {
            const item = document.createElement('div');
            // 检查是否选中：比较数据URL
            const isSelected = state.tempSelectedChatBg === wp.data;
            item.className = `gallery-item ${isSelected ? 'selected' : ''}`;
            item.innerHTML = `
                <img src="${wp.data}" alt="Wallpaper">
                <button class="delete-wp-btn" data-id="${wp.id}">&times;</button>
            `;
            
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-wp-btn')) {
                    deleteChatWallpaper(wp.id);
                } else {
                    state.tempSelectedChatBg = wp.data;
                    renderChatWallpaperGallery();
                }
            });
            
            gallery.appendChild(item);
        });
    }

    function deleteChatWallpaper(id) {
        const wp = state.chatWallpapers.find(w => w.id === id);
        if (wp && state.tempSelectedChatBg === wp.data) {
            state.tempSelectedChatBg = '';
        }
        state.chatWallpapers = state.chatWallpapers.filter(w => w.id !== id);
        renderChatWallpaperGallery();
        saveConfig();
    }

    function applyWallpaper(id) {
        if (!id) {
            document.documentElement.style.setProperty('--wallpaper', 'none');
            return;
        }
        const wp = state.wallpapers.find(w => w.id === id);
        if (wp) {
            document.documentElement.style.setProperty('--wallpaper', `url(${wp.data})`);
        }
    }

    function toggleStatusBar(show) {
        const statusBar = document.querySelector('.status-bar');
        if (statusBar) {
            if (show) {
                statusBar.classList.remove('hidden');
            } else {
                statusBar.classList.add('hidden');
            }
        }
    }

    // --- 图标功能 ---

    function renderIconSettings() {
        const list = document.getElementById('icon-setting-list');
        if (!list) return;
        
        list.innerHTML = '';

        // 收集所有需要显示的应用
        // 1. 从 knownApps 中获取基础信息
        // 2. 检查 homeScreenData 和 Dock 栏，确保所有在用的应用都在列表中
        
        const appsToShow = new Set(Object.keys(knownApps));
        
        // 遍历 homeScreenData 添加可能的自定义应用 (如果有)
        if (typeof homeScreenData !== 'undefined') {
            homeScreenData.forEach(item => {
                if (item.type === 'app' && item.appId) {
                    appsToShow.add(item.appId);
                }
            });
        }

        appsToShow.forEach(appId => {
            const appInfo = knownApps[appId] || { name: '未知应用', icon: 'fas fa-question', color: '#ccc' };
            
            const item = document.createElement('div');
            item.className = 'list-item';
            
            const currentIcon = state.icons[appId];
            const currentColor = state.iconColors[appId] || appInfo.color;
            let previewContent = '';
            
            if (currentIcon) {
                previewContent = `<img src="${currentIcon}" style="width:100%;height:100%;object-fit:cover;">`;
            } else {
                previewContent = `<i class="${appInfo.icon}" style="color: ${currentColor === '#ffffff' ? '#000' : '#fff'}"></i>`;
            }

            item.innerHTML = `
                <div class="icon-row">
                    <div class="icon-preview-small" id="preview-${appId}" style="background-color: ${currentColor};">
                        ${previewContent}
                    </div>
                    <div class="icon-info column">
                        <span>${appInfo.name}</span>
                        <div class="color-picker-row" style="margin-top: 5px; display: flex; align-items: center; gap: 5px;">
                            <span style="font-size: 12px; color: #888;">背景色:</span>
                            <input type="color" class="color-picker-input" value="${currentColor}" data-id="${appId}" style="width: 30px; height: 20px; padding: 0; border: none;">
                        </div>
                    </div>
                    <div class="icon-actions">
                        <input type="file" id="upload-${appId}" accept="image/*" class="file-input-hidden">
                        <label for="upload-${appId}" class="ios-btn">更换</label>
                        ${currentIcon || state.iconColors[appId] ? `<button class="ios-btn-small danger" onclick="resetAppIcon('${appId}')">还原</button>` : ''}
                    </div>
                </div>
            `;

            // 绑定上传事件
            const input = item.querySelector('input[type="file"]');
            input.addEventListener('change', (e) => handleIconUpload(e, appId));
            
            // 绑定颜色选择事件
            const colorInput = item.querySelector('input[type="color"]');
            colorInput.addEventListener('input', (e) => handleIconColorChange(e, appId));
            
            list.appendChild(item);
        });
    }

    function handleIconUpload(e, appId) {
        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 300, 0.7).then(base64 => {
            state.icons[appId] = base64;
            applyIcons();
            renderIconSettings();
            saveConfig();
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
    }

    function handleIconColorChange(e, appId) {
        const color = e.target.value;
        state.iconColors[appId] = color;
        
        // 实时更新预览
        const preview = document.getElementById(`preview-${appId}`);
        if (preview) {
            preview.style.backgroundColor = color;
            // 如果是默认图标，可能需要调整图标颜色以保持对比度
            const icon = preview.querySelector('i');
            if (icon) {
                icon.style.color = color === '#ffffff' ? '#000' : '#fff';
            }
        }
        
        applyIcons();
        saveConfig();
    }

    window.resetAppIcon = function(appId) {
        delete state.icons[appId];
        delete state.iconColors[appId];
        applyIcons();
        renderIconSettings();
        saveConfig();
    };

    function applyIcons() {
        // 1. 刷新主屏幕网格 (依赖 renderItems)
        if (typeof renderItems === 'function') {
            renderItems();
        }

        // 2. 刷新 Dock 栏
        const dockItems = document.querySelectorAll('.dock-item');
        dockItems.forEach(item => {
            const appId = item.dataset.appId;
            if (!appId) return;

            const iconContainer = item.querySelector('.app-icon');
            if (!iconContainer) return;

            const appInfo = knownApps[appId] || { icon: 'fas fa-question', color: '#ccc' };
            const customIcon = state.icons[appId];
            const customColor = state.iconColors[appId];
            const finalColor = customColor || appInfo.color;

            // 应用背景色
            iconContainer.style.backgroundColor = finalColor;

            // 应用图标内容
            if (customIcon) {
                iconContainer.innerHTML = `<img src="${customIcon}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--icon-radius);">`;
            } else {
                iconContainer.innerHTML = `<i class="${appInfo.icon}" style="color: ${finalColor === '#ffffff' ? '#000' : '#fff'}"></i>`;
            }
        });
    }

    // --- 图标预设功能 ---

    function handleSaveIconPreset() {
        const name = prompt('请输入图标预设名称：');
        if (!name) return;
        
        const preset = {
            name: name,
            icons: { ...state.icons },
            iconColors: { ...state.iconColors }
        };
        
        state.iconPresets.push(preset);
        saveConfig();
        renderIconPresets();
        document.getElementById('icon-preset-select').value = name;
        alert('图标预设已保存');
    }

    function handleDeleteIconPreset() {
        const select = document.getElementById('icon-preset-select');
        const name = select.value;
        if (!name) return;
        
        if (confirm(`确定要删除预设 "${name}" 吗？`)) {
            state.iconPresets = state.iconPresets.filter(p => p.name !== name);
            saveConfig();
            renderIconPresets();
        }
    }

    function handleApplyIconPreset(e) {
        const name = e.target.value;
        if (!name) return;
        
        const preset = state.iconPresets.find(p => p.name === name);
        if (preset) {
            state.icons = { ...preset.icons };
            state.iconColors = { ...preset.iconColors };
            applyIcons();
            renderIconSettings();
            saveConfig();
        }
    }

    function renderIconPresets() {
        const select = document.getElementById('icon-preset-select');
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">-- 选择预设 --</option>';
        
        if (state.iconPresets) {
            state.iconPresets.forEach(preset => {
                const option = document.createElement('option');
                option.value = preset.name;
                option.textContent = preset.name;
                select.appendChild(option);
            });
        }
        
        if (currentValue && state.iconPresets.some(p => p.name === currentValue)) {
            select.value = currentValue;
        }
    }

    // --- CSS功能 ---

    function applyCSS(cssContent) {
        let styleEl = document.getElementById('custom-user-css');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'custom-user-css';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = cssContent;
    }

    function exportCSS() {
        const blob = new Blob([state.css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom-theme.css';
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- CSS预设功能 ---

    function handleSaveCssPreset() {
        const name = prompt('请输入CSS预设名称：');
        if (!name) return;
        
        const cssContent = document.getElementById('css-editor').value;
        
        const preset = {
            name: name,
            css: cssContent
        };
        
        state.cssPresets.push(preset);
        saveConfig();
        renderCssPresets();
        document.getElementById('css-preset-select').value = name;
        alert('CSS预设已保存');
    }

    function handleDeleteCssPreset() {
        const select = document.getElementById('css-preset-select');
        const name = select.value;
        if (!name) return;
        
        if (confirm(`确定要删除预设 "${name}" 吗？`)) {
            state.cssPresets = state.cssPresets.filter(p => p.name !== name);
            saveConfig();
            renderCssPresets();
        }
    }

    function handleApplyCssPreset(e) {
        const name = e.target.value;
        if (!name) return;
        
        const preset = state.cssPresets.find(p => p.name === name);
        if (preset) {
            state.css = preset.css;
            document.getElementById('css-editor').value = state.css;
            applyCSS(state.css);
            saveConfig();
        }
    }

    function renderCssPresets() {
        const select = document.getElementById('css-preset-select');
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">-- 选择预设 --</option>';
        
        if (state.cssPresets) {
            state.cssPresets.forEach(preset => {
                const option = document.createElement('option');
                option.value = preset.name;
                option.textContent = preset.name;
                select.appendChild(option);
            });
        }
        
        if (currentValue && state.cssPresets.some(p => p.name === currentValue)) {
            select.value = currentValue;
        }
    }

    // --- 见面模式美化功能 ---

    function initMeetingTheme() {
        const btn = document.getElementById('meeting-theme-btn');
        const modal = document.getElementById('meeting-theme-modal');
        const closeBtn = document.getElementById('close-meeting-theme');
        
        if (btn) {
            btn.addEventListener('click', () => {
                // 初始化编辑器内容
                const editor = document.getElementById('meeting-css-editor');
                if (editor) editor.value = state.meetingCss || '';
                
                modal.classList.remove('hidden');
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        }

        // 字体相关绑定
        
        
        const applyFontUrlBtn = document.getElementById('apply-meeting-font-url');
        if (applyFontUrlBtn) applyFontUrlBtn.addEventListener('click', handleMeetingFontUrl);
        
        const saveFontPresetBtn = document.getElementById('save-meeting-font-preset');
        if (saveFontPresetBtn) saveFontPresetBtn.addEventListener('click', handleSaveFontPreset);
        
        const deleteFontPresetBtn = document.getElementById('delete-meeting-font-preset');
        if (deleteFontPresetBtn) deleteFontPresetBtn.addEventListener('click', handleDeleteFontPreset);
        // --- 在 initMeetingTheme 函数内部替换为以下代码 ---

// --- 新代码 (使用上面定义的专用函数) ---

// 1. 绑定上传 -> handleMeetingFontUploadAction
const fontUpload = document.getElementById('meeting-font-upload');
if (fontUpload) {
    // 克隆节点以移除旧监听器
    const newUpload = fontUpload.cloneNode(true);
    fontUpload.parentNode.replaceChild(newUpload, fontUpload);
    newUpload.addEventListener('change', handleMeetingFontUploadAction);
}

// 2. 绑定预设 -> handleApplyMeetingFontPreset
const fontPresetSelect = document.getElementById('meeting-font-preset-select');
if (fontPresetSelect) {
    const newSelect = fontPresetSelect.cloneNode(true);
    fontPresetSelect.parentNode.replaceChild(newSelect, fontPresetSelect);
    newSelect.addEventListener('change', handleApplyMeetingFontPreset);
}

// 3. 绑定重置 -> resetMeetingFontAction
const resetFontBtn = document.getElementById('reset-meeting-font-btn');
if (resetFontBtn) {
    const newReset = resetFontBtn.cloneNode(true);
    resetFontBtn.parentNode.replaceChild(newReset, resetFontBtn);
    newReset.addEventListener('click', resetMeetingFontAction);
}


        
        // 现有美化设置里的重置按钮
        const mainResetFontBtn = document.getElementById('reset-font-btn');
        if (mainResetFontBtn) mainResetFontBtn.addEventListener('click', resetFont);

        // CSS 相关绑定
        const saveCssBtn = document.getElementById('save-meeting-css-preset');
        if (saveCssBtn) saveCssBtn.addEventListener('click', handleSaveMeetingCssPreset);
        
        const deleteCssBtn = document.getElementById('delete-meeting-css-preset');
        if (deleteCssBtn) deleteCssBtn.addEventListener('click', handleDeleteMeetingCssPreset);
        
        const cssSelect = document.getElementById('meeting-css-preset-select');
        if (cssSelect) cssSelect.addEventListener('change', handleApplyMeetingCssPreset);
        
        const applyCssBtn = document.getElementById('apply-meeting-css-btn');
        if (applyCssBtn) applyCssBtn.addEventListener('click', () => {
            const css = document.getElementById('meeting-css-editor').value;
            state.meetingCss = css;
            applyMeetingCss(css);
            saveConfig();
            alert('见面模式 CSS 已应用');
        });

        // 图标上传绑定
        const meetingEditIconUpload = document.getElementById('meeting-edit-icon-upload');
        if (meetingEditIconUpload) {
            // 移除旧监听器
            const newUpload = meetingEditIconUpload.cloneNode(true);
            meetingEditIconUpload.parentNode.replaceChild(newUpload, meetingEditIconUpload);
            newUpload.addEventListener('change', (e) => handleMeetingIconUpload(e, 'edit'));
        }

        const meetingDeleteIconUpload = document.getElementById('meeting-delete-icon-upload');
        if (meetingDeleteIconUpload) {
            // 移除旧监听器
            const newUpload = meetingDeleteIconUpload.cloneNode(true);
            meetingDeleteIconUpload.parentNode.replaceChild(newUpload, meetingDeleteIconUpload);
            newUpload.addEventListener('change', (e) => handleMeetingIconUpload(e, 'delete'));
        }

        // 初始化图标预览
        if (state.meetingIcons) {
            const editPreview = document.getElementById('meeting-edit-icon-preview');
            const deletePreview = document.getElementById('meeting-delete-icon-preview');
            if (editPreview && state.meetingIcons.edit) editPreview.src = state.meetingIcons.edit;
            if (deletePreview && state.meetingIcons.delete) deletePreview.src = state.meetingIcons.delete;
        }
    }

    function handleMeetingIconUpload(e, type) {
        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 100, 0.7).then(base64 => {
            if (!state.meetingIcons) state.meetingIcons = {};
            state.meetingIcons[type] = base64;
            saveConfig();
            
            // 更新预览
            const preview = document.getElementById(`meeting-${type}-icon-preview`);
            if (preview) preview.src = base64;
            
            // 如果当前在详情页，刷新
            if (state.currentMeetingId && state.currentChatContactId) {
                 const meetings = state.meetings[state.currentChatContactId];
                 const meeting = meetings.find(m => m.id === state.currentMeetingId);
                 if (meeting) renderMeetingCards(meeting);
            }
            alert('图标已更新');
        }).catch(err => {
            console.error('图标处理失败', err);
            alert('图标处理失败');
        });
        e.target.value = '';
    }

    function applyMeetingCss(cssContent) {
        let styleEl = document.getElementById('meeting-custom-css');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'meeting-custom-css';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = cssContent || '';
    }

    function handleSaveMeetingCssPreset() {
        const name = prompt('请输入见面模式 CSS 预设名称：');
        if (!name) return;
        
        const cssContent = document.getElementById('meeting-css-editor').value;
        
        const preset = {
            name: name,
            css: cssContent
        };
        
        if (!state.meetingCssPresets) state.meetingCssPresets = [];
        state.meetingCssPresets.push(preset);
        saveConfig();
        renderMeetingCssPresets();
        document.getElementById('meeting-css-preset-select').value = name;
        alert('预设已保存');
    }

    function handleDeleteMeetingCssPreset() {
        const select = document.getElementById('meeting-css-preset-select');
        const name = select.value;
        if (!name) return;
        
        if (confirm(`确定要删除预设 "${name}" 吗？`)) {
            state.meetingCssPresets = state.meetingCssPresets.filter(p => p.name !== name);
            saveConfig();
            renderMeetingCssPresets();
        }
    }

    function handleApplyMeetingCssPreset(e) {
        const name = e.target.value;
        if (!name) return;
        
        const preset = state.meetingCssPresets.find(p => p.name === name);
        if (preset) {
            document.getElementById('meeting-css-editor').value = preset.css;
        }
    }

    function renderMeetingCssPresets() {
        const select = document.getElementById('meeting-css-preset-select');
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">-- 选择预设 --</option>';
        
        if (state.meetingCssPresets) {
            state.meetingCssPresets.forEach(preset => {
                const option = document.createElement('option');
                option.value = preset.name;
                option.textContent = preset.name;
                select.appendChild(option);
            });
        }
        
        if (currentValue && state.meetingCssPresets.some(p => p.name === currentValue)) {
            select.value = currentValue;
        }
    }

    // --- 聊天设置 CSS 预设功能 ---

    function handleSaveChatCssPreset() {
        const name = prompt('请输入CSS预设名称：');
        if (!name) return;
        
        const cssContent = document.getElementById('chat-setting-custom-css').value;
        
        const preset = {
            name: name,
            css: cssContent
        };
        
        state.cssPresets.push(preset);
        saveConfig();
        renderChatCssPresets();
        renderCssPresets(); // 同步更新美化中心的列表
        document.getElementById('chat-css-preset-select').value = name;
        alert('CSS预设已保存');
    }

    function handleDeleteChatCssPreset() {
        const select = document.getElementById('chat-css-preset-select');
        const name = select.value;
        if (!name) return;
        
        if (confirm(`确定要删除预设 "${name}" 吗？`)) {
            state.cssPresets = state.cssPresets.filter(p => p.name !== name);
            saveConfig();
            renderChatCssPresets();
            renderCssPresets(); // 同步更新美化中心的列表
        }
    }

    function handleApplyChatCssPreset(e) {
        const name = e.target.value;
        if (!name) return;
        
        const preset = state.cssPresets.find(p => p.name === name);
        if (preset) {
            document.getElementById('chat-setting-custom-css').value = preset.css;
        }
    }

    function renderChatCssPresets() {
        const select = document.getElementById('chat-css-preset-select');
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">-- 选择预设 --</option>';
        
        if (state.cssPresets) {
            state.cssPresets.forEach(preset => {
                const option = document.createElement('option');
                option.value = preset.name;
                option.textContent = preset.name;
                select.appendChild(option);
            });
        }
        
        if (currentValue && state.cssPresets.some(p => p.name === currentValue)) {
            select.value = currentValue;
        }
    }

    // --- AI 设置功能 ---

    async function handleFetchModels(isSecondary = false) {
        const suffix = isSecondary ? '-2' : '';
        const settingsKey = isSecondary ? 'aiSettings2' : 'aiSettings';
        
        const url = state[settingsKey].url;
        const key = state[settingsKey].key;

        if (!url) {
            alert('请先输入API地址');
            return;
        }

        const btn = document.getElementById(`fetch-models${suffix}`);
        const originalText = btn.textContent;
        btn.textContent = '拉取中...';
        btn.disabled = true;

        try {
            // 尝试适配不同的API格式，通常是 /v1/models
            let fetchUrl = url;
            if (!fetchUrl.endsWith('/models')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'models' : fetchUrl + '/models';
            }

            const headers = {};
            if (key) {
                headers['Authorization'] = `Bearer ${key}`;
            }

            const response = await fetch(fetchUrl, { headers });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const models = data.data || data.models || []; // 适配不同API返回格式

            const select = document.getElementById(`ai-model-select${suffix}`);
            select.innerHTML = '<option value="">请选择模型</option>';
            
            models.forEach(model => {
                const id = model.id || model;
                const option = document.createElement('option');
                option.value = id;
                option.textContent = id;
                select.appendChild(option);
            });

            alert(`成功获取 ${models.length} 个模型`);
            
            // 如果当前有选中的模型，尝试恢复
            if (state[settingsKey].model) {
                select.value = state[settingsKey].model;
            }

        } catch (error) {
            console.error('获取模型失败:', error);
            alert('获取模型失败，请检查API地址和密钥是否正确，或跨域设置。');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    function handleSaveAiPreset(isSecondary = false) {
        const suffix = isSecondary ? '-2' : '';
        const settingsKey = isSecondary ? 'aiSettings2' : 'aiSettings';
        const presetsKey = isSecondary ? 'aiPresets2' : 'aiPresets';
        
        const name = prompt('请输入AI配置预设名称：');
        if (!name) return;

        const preset = {
            name: name,
            settings: { ...state[settingsKey] }
        };

        state[presetsKey].push(preset);
        saveConfig();
        renderAiPresets(isSecondary);
        document.getElementById(`ai-preset-select${suffix}`).value = name;
        alert('AI预设已保存');
    }

    function handleDeleteAiPreset(isSecondary = false) {
        const suffix = isSecondary ? '-2' : '';
        const presetsKey = isSecondary ? 'aiPresets2' : 'aiPresets';
        
        const select = document.getElementById(`ai-preset-select${suffix}`);
        const name = select.value;
        if (!name) return;

        if (confirm(`确定要删除预设 "${name}" 吗？`)) {
            state[presetsKey] = state[presetsKey].filter(p => p.name !== name);
            saveConfig();
            renderAiPresets(isSecondary);
        }
    }

    function handleApplyAiPreset(e, isSecondary = false) {
        const settingsKey = isSecondary ? 'aiSettings2' : 'aiSettings';
        const presetsKey = isSecondary ? 'aiPresets2' : 'aiPresets';
        
        const name = e.target.value;
        if (!name) return;

        const preset = state[presetsKey].find(p => p.name === name);
        if (preset) {
            state[settingsKey] = { ...preset.settings };
            updateAiUi(isSecondary);
            saveConfig();
        }
    }

    function renderAiPresets(isSecondary = false) {
        const suffix = isSecondary ? '-2' : '';
        const presetsKey = isSecondary ? 'aiPresets2' : 'aiPresets';
        
        const select = document.getElementById(`ai-preset-select${suffix}`);
        if (!select) return;

        const currentValue = select.value;
        select.innerHTML = '<option value="">-- 选择预设 --</option>';

        if (state[presetsKey]) {
            state[presetsKey].forEach(preset => {
                const option = document.createElement('option');
                option.value = preset.name;
                option.textContent = preset.name;
                select.appendChild(option);
            });
        }

        if (currentValue && state[presetsKey].some(p => p.name === currentValue)) {
            select.value = currentValue;
        }
    }

    function updateAiUi(isSecondary = false) {
        const suffix = isSecondary ? '-2' : '';
        const settingsKey = isSecondary ? 'aiSettings2' : 'aiSettings';
        
        const urlInput = document.getElementById(`ai-api-url${suffix}`);
        const keyInput = document.getElementById(`ai-api-key${suffix}`);
        const modelSelect = document.getElementById(`ai-model-select${suffix}`);
        const tempInput = document.getElementById(`ai-temperature${suffix}`);
        const tempValue = document.getElementById(`ai-temp-value${suffix}`);

        if (urlInput) urlInput.value = state[settingsKey].url || '';
        if (keyInput) keyInput.value = state[settingsKey].key || '';
        if (tempInput) tempInput.value = state[settingsKey].temperature || 0.7;
        if (tempValue) tempValue.textContent = state[settingsKey].temperature || 0.7;
        
        // 模型下拉框可能需要重新拉取才能显示正确，这里只能先设置值，如果option不存在则显示为空
        if (modelSelect && state[settingsKey].model) {
            // 如果下拉框里没有这个模型，添加一个临时的
            if (!modelSelect.querySelector(`option[value="${state[settingsKey].model}"]`)) {
                const option = document.createElement('option');
                option.value = state[settingsKey].model;
                option.textContent = state[settingsKey].model;
                modelSelect.appendChild(option);
            }
            modelSelect.value = state[settingsKey].model;
        }
    }

    // --- 数据管理 ---

    function saveConfig() {
        try {
            // 不保存临时 UI 状态（如多选模式与临时选择），避免加载时误进入多选
            const persistState = Object.assign({}, state);
            try { delete persistState.selectedMessages; } catch (e) {}
            try { delete persistState.isMultiSelectMode; } catch (e) {}
            try { delete persistState.selectedStickers; } catch (e) {}
            
            // 使用 localForage 保存
            localforage.setItem('iphoneSimConfig', persistState).catch(err => {
                console.error('保存数据失败:', err);
                // 如果是配额超限，尝试提示用户
                if (err.name === 'QuotaExceededError') {
                    alert('存储空间不足，无法保存数据。请尝试清理一些图片或聊天记录。');
                }
            });
        } catch (e) {
            console.error('保存配置时发生错误:', e);
        }
    }

    async function loadConfig() {
        try {
            // 尝试从 IndexedDB 加载
            let loadedState = await localforage.getItem('iphoneSimConfig');
            
            // 如果 IndexedDB 为空，尝试从 localStorage 迁移
            if (!loadedState) {
                const localSaved = localStorage.getItem('iphoneSimConfig');
                if (localSaved) {
                    try {
                        loadedState = JSON.parse(localSaved);
                        console.log('检测到旧数据，正在迁移到 IndexedDB...');
                        await localforage.setItem('iphoneSimConfig', loadedState);
                        // 迁移成功后清除 localStorage，释放空间
                        localStorage.removeItem('iphoneSimConfig');
                        console.log('数据迁移完成');
                    } catch (e) {
                        console.error('迁移旧数据失败:', e);
                    }
                }
            }

            if (loadedState) {
                Object.assign(state, loadedState);
                
                // 确保预设数组存在
                if (!state.fontPresets) state.fontPresets = [];
                if (!state.cssPresets) state.cssPresets = [];
                if (!state.aiSettings) state.aiSettings = { url: '', key: '', model: '', temperature: 0.7 };
                if (!state.aiPresets) state.aiPresets = [];
                if (!state.aiSettings2) state.aiSettings2 = { url: '', key: '', model: '', temperature: 0.7 };
                if (!state.aiPresets2) state.aiPresets2 = [];
                if (!state.whisperSettings) state.whisperSettings = { url: '', key: '', model: 'whisper-1' };
                if (!state.minimaxSettings) state.minimaxSettings = { url: 'https://api.minimax.chat/v1/t2a_v2', key: '', groupId: '', model: 'speech-01-turbo' };
                if (!state.chatWallpapers) state.chatWallpapers = [];
                if (!state.contacts) state.contacts = [];
                if (!state.chatHistory) state.chatHistory = {};
                if (!state.worldbook) state.worldbook = [];
                if (!state.userPersonas) state.userPersonas = [];
                if (!state.moments) state.moments = [];
                if (!state.memories) state.memories = [];
                if (!state.defaultVirtualImageUrl) state.defaultVirtualImageUrl = '';
                if (state.showStatusBar === undefined) state.showStatusBar = true;
                if (!state.iconColors) state.iconColors = {};
                if (!state.iconPresets) state.iconPresets = [];
                if (!state.stickerCategories) state.stickerCategories = [];
                if (!state.contactGroups) state.contactGroups = [];
                if (!state.music) state.music = {
                    playing: false,
                    cover: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                    src: '',
                    title: 'Happy Together',
                    artist: 'Maximillian',
                    lyricsData: [
                        { time: 0, text: "So fast, I almost missed it" },
                        { time: 3, text: "I spill another glass of wine" },
                        { time: 6, text: "Kill the lights to pass the time" }
                    ],
                    lyricsFile: ''
                };
                if (!state.polaroid) state.polaroid = {
                    img1: 'https://placehold.co/300x300/eee/999?text=Photo',
                    text1: '讨厌坏天气',
                    img2: 'https://placehold.co/300x300/eee/999?text=Photo',
                    text2: '美好回忆'
                };
                // 兼容旧数据：如果 lyrics 是字符串，尝试转换或清空
                if (typeof state.music.lyrics === 'string') {
                    state.music.lyricsData = [
                        { time: 0, text: state.music.lyrics.split('\n')[0] || "暂无歌词" }
                    ];
                    delete state.music.lyrics;
                }

                // 重置临时 UI 状态，避免加载后处于多选或已选中状态
                state.isMultiSelectMode = false;
                state.selectedMessages = new Set();
                state.selectedStickers = new Set();
                
                // 修正当前选中的表情包分类
                if (state.currentStickerCategoryId !== 'all' && !state.stickerCategories.find(c => c.id === state.currentStickerCategoryId)) {
                    state.currentStickerCategoryId = 'all';
                }

                const defaultVirtualImageUrlInput = document.getElementById('default-virtual-image-url');
                if (defaultVirtualImageUrlInput) defaultVirtualImageUrlInput.value = state.defaultVirtualImageUrl;

                const statusBarToggle = document.getElementById('show-status-bar-toggle');
                if (statusBarToggle) statusBarToggle.checked = state.showStatusBar;
                toggleStatusBar(state.showStatusBar);

                const cssEditor = document.getElementById('css-editor');
                if (cssEditor) cssEditor.value = state.css;
                
                applyFont(state.currentFont);
                // 在 loadConfig 函数内部找到 applyFont(state.currentFont);
// 在它下面添加：

                if (state.currentMeetingFont) {
                    applyMeetingFont(state.currentMeetingFont);
                }

                applyWallpaper(state.currentWallpaper);
                applyIcons();
                applyCSS(state.css);
                applyMeetingCss(state.meetingCss); // 应用见面CSS
                
                renderIconPresets();
                renderFontPresets();
                renderCssPresets();
                renderMeetingCssPresets();
                renderAiPresets();
                renderAiPresets(true);
                updateAiUi();
                updateAiUi(true);
                setupWhisperListeners(); // 重新初始化 Whisper 监听器以填充值
                setupMinimaxListeners(); // 初始化 Minimax 监听器
                renderContactList();
                migrateWorldbookData();
                renderWorldbookCategoryList();
                renderMeTab();
                renderMoments();
                initMusicWidget();
                initPolaroidWidget();
            }
        } catch (e) {
            console.error('加载配置失败:', e);
        }
    }

    function handleClearAllData() {
        if (confirm('确定要清空所有数据吗？此操作不可恢复！所有设置、聊天记录、图片等都将丢失。')) {
            localforage.clear().then(() => {
                // 同时也清除 localStorage 以防万一
                localStorage.removeItem('iphoneSimConfig');
                alert('所有数据已清空，页面将刷新。');
                location.reload();
            }).catch(err => {
                console.error('清空数据失败:', err);
                alert('清空数据失败');
            });
        }
    }

    function exportJSON() {
        const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'iphone-sim-config.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importJSON(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const loadedState = JSON.parse(event.target.result);
                Object.assign(state, loadedState);
                
                // 确保预设数组存在
                if (!state.fontPresets) state.fontPresets = [];
                if (!state.cssPresets) state.cssPresets = [];
                if (!state.aiSettings) state.aiSettings = { url: '', key: '', model: '', temperature: 0.7 };
                if (!state.aiPresets) state.aiPresets = [];
                if (!state.aiSettings2) state.aiSettings2 = { url: '', key: '', model: '', temperature: 0.7 };
                if (!state.aiPresets2) state.aiPresets2 = [];
                if (!state.contacts) state.contacts = [];
                if (!state.chatHistory) state.chatHistory = {};
                if (!state.worldbook) state.worldbook = [];
                if (!state.userPersonas) state.userPersonas = [];
                if (!state.moments) state.moments = [];
                if (!state.memories) state.memories = [];
                if (state.showStatusBar === undefined) state.showStatusBar = true;
                if (!state.iconColors) state.iconColors = {};
                if (!state.iconPresets) state.iconPresets = [];
                if (!state.stickerCategories) state.stickerCategories = [];
                if (!state.contactGroups) state.contactGroups = [];
                
                // 修正当前选中的表情包分类
                if (state.currentStickerCategoryId !== 'all' && !state.stickerCategories.find(c => c.id === state.currentStickerCategoryId)) {
                    state.currentStickerCategoryId = 'all';
                }

                const statusBarToggle = document.getElementById('show-status-bar-toggle');
                if (statusBarToggle) statusBarToggle.checked = state.showStatusBar;
                toggleStatusBar(state.showStatusBar);

                const cssEditor = document.getElementById('css-editor');
                if (cssEditor) cssEditor.value = state.css;
                
                applyFont(state.currentFont);
                applyWallpaper(state.currentWallpaper);
                applyIcons();
                applyCSS(state.css);
                renderWallpaperGallery();
                renderIconSettings();
                renderIconPresets();
                renderFontPresets();
                renderCssPresets();
                renderAiPresets();
                renderAiPresets(true);
                updateAiUi();
                updateAiUi(true);
                renderContactList();
                migrateWorldbookData();
                renderWorldbookCategoryList();
                renderMeTab();
                renderMoments();
                
                saveConfig();
                alert('配置导入成功');
            } catch (err) {
                alert('配置文件格式错误');
                console.error(err);
            }
        };
        reader.readAsText(file);
    }

    // --- 表情包系统 ---

    function initStickerSystem() {
        // 绑定表情包按钮点击事件
        const stickerBtn = document.getElementById('sticker-btn');
        if (stickerBtn) {
            const newBtn = stickerBtn.cloneNode(true);
            stickerBtn.parentNode.replaceChild(newBtn, stickerBtn);
            
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleStickerPanel();
            });
        }

        // 绑定管理按钮
        const manageBtn = document.getElementById('sticker-manage-btn');
        if (manageBtn) {
            const newManageBtn = manageBtn.cloneNode(true);
            manageBtn.parentNode.replaceChild(newManageBtn, manageBtn);
            newManageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (state.isStickerManageMode) {
                    toggleStickerManageMode();
                } else {
                    document.getElementById('sticker-options-modal').classList.remove('hidden');
                }
            });
        }

        // 绑定选项菜单事件
        const optionsModal = document.getElementById('sticker-options-modal');

        if (optionsModal) {
            // 先克隆整个模态框以移除旧的监听器
            const newOptionsModal = optionsModal.cloneNode(true);
            optionsModal.parentNode.replaceChild(newOptionsModal, optionsModal);
            
            // 重新获取子元素
            const optManage = newOptionsModal.querySelector('#sticker-opt-manage');
            const optImport = newOptionsModal.querySelector('#sticker-opt-import');
            const optCancel = newOptionsModal.querySelector('#sticker-opt-cancel');

            // 绑定背景点击关闭
            newOptionsModal.addEventListener('click', (e) => {
                if (e.target === newOptionsModal) {
                    newOptionsModal.classList.add('hidden');
                }
                // 阻止冒泡，防止触发全局点击关闭表情包面板
                e.stopPropagation();
            });

            if (optManage) {
                optManage.addEventListener('click', (e) => {
                    e.stopPropagation();
                    newOptionsModal.classList.add('hidden');
                    toggleStickerManageMode();
                });
            }

            if (optImport) {
                optImport.addEventListener('click', (e) => {
                    e.stopPropagation();
                    newOptionsModal.classList.add('hidden');
                    document.getElementById('sticker-category-name').value = '';
                    document.getElementById('sticker-import-text').value = '';
                    document.getElementById('import-sticker-modal').classList.remove('hidden');
                });
            }

            // 删除分类选项
            const optDeleteCats = newOptionsModal.querySelector('#sticker-opt-deletecats');
            if (optDeleteCats) {
                optDeleteCats.addEventListener('click', (e) => {
                    e.stopPropagation();
                    newOptionsModal.classList.add('hidden');
                    renderStickerCategoryDeleteModal();
                });
            }

            if (optCancel) {
                optCancel.addEventListener('click', (e) => {
                    e.stopPropagation();
                    newOptionsModal.classList.add('hidden');
                });
            }
        }

        // 绑定管理面板中的导入按钮
        const importBtn = document.getElementById('sticker-import-btn-action');
        if (importBtn) {
            const newImportBtn = importBtn.cloneNode(true);
            importBtn.parentNode.replaceChild(newImportBtn, importBtn);

            newImportBtn.addEventListener('click', () => {
                document.getElementById('sticker-category-name').value = '';
                document.getElementById('sticker-import-text').value = '';
                document.getElementById('import-sticker-modal').classList.remove('hidden');
            });
        }

        // 绑定全选按钮
        const selectAllBtn = document.getElementById('sticker-select-all-btn');
        if (selectAllBtn) {
            const newSelectAllBtn = selectAllBtn.cloneNode(true);
            selectAllBtn.parentNode.replaceChild(newSelectAllBtn, selectAllBtn);
            newSelectAllBtn.addEventListener('click', toggleSelectAllStickers);
        }

        // 绑定删除按钮
        const deleteBtn = document.getElementById('sticker-delete-btn');
        if (deleteBtn) {
            const newDeleteBtn = deleteBtn.cloneNode(true);
            deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
            newDeleteBtn.addEventListener('click', deleteSelectedStickers);
        }

        // 绑定导入弹窗事件
        const closeImportBtn = document.getElementById('close-import-sticker');
        if (closeImportBtn) {
            const newCloseImportBtn = closeImportBtn.cloneNode(true);
            closeImportBtn.parentNode.replaceChild(newCloseImportBtn, closeImportBtn);
            newCloseImportBtn.addEventListener('click', () => {
                document.getElementById('import-sticker-modal').classList.add('hidden');
            });
        }

        const saveImportBtn = document.getElementById('save-sticker-import-btn');
        if (saveImportBtn) {
            const newSaveImportBtn = saveImportBtn.cloneNode(true);
            saveImportBtn.parentNode.replaceChild(newSaveImportBtn, saveImportBtn);
            newSaveImportBtn.addEventListener('click', handleImportStickers);
        }

        // 绑定搜索框
        const searchInput = document.getElementById('sticker-search-input');
        if (searchInput) {
            const newSearchInput = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            newSearchInput.addEventListener('input', (e) => {
                renderStickerList(e.target.value);
            });
        }

        renderStickerTabs();
        renderStickerList();
    }

    function toggleStickerPanel() {
        const panel = document.getElementById('sticker-panel');
        const chatMorePanel = document.getElementById('chat-more-panel');
        const chatInputArea = document.querySelector('.chat-input-area');
        
        if (panel.classList.contains('slide-in')) {
            // 关闭
            panel.classList.remove('slide-in');
            if (chatInputArea) chatInputArea.classList.remove('push-up');
            
            // 退出管理模式
            if (state.isStickerManageMode) {
                toggleStickerManageMode();
            }
        } else {
            // 打开
            panel.classList.remove('hidden'); // 确保移除 hidden
            panel.classList.add('slide-in');
            
            // 关闭更多面板
            if (chatMorePanel) chatMorePanel.classList.remove('slide-in');
            
            if (chatInputArea) chatInputArea.classList.add('push-up');
            
            scrollToBottom();
            renderStickerTabs();
            renderStickerList();
        }
    }

    function handleImportStickers() {
        const name = document.getElementById('sticker-category-name').value.trim();
        const text = document.getElementById('sticker-import-text').value.trim();

        if (!name) {
            alert('请输入分类名称');
            return;
        }

        if (!text) {
            alert('请输入表情包数据');
            return;
        }

        const lines = text.split('\n');
        const stickers = [];

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            // 支持中文冒号和英文冒号
            let parts = line.split(/[:：]/);
            if (parts.length >= 2) {
                const desc = parts[0].trim();
                // URL可能包含冒号，所以重新组合剩余部分
                const url = parts.slice(1).join(':').trim();
                if (url) {
                    stickers.push({ desc, url });
                }
            }
        });

        if (stickers.length === 0) {
            alert('未能解析出有效的表情包数据，请检查格式');
            return;
        }

        const newCategory = {
            id: Date.now(),
            name: name,
            list: stickers
        };

        state.stickerCategories.push(newCategory);
        state.currentStickerCategoryId = newCategory.id;
        
        saveConfig();
        renderStickerTabs();
        renderStickerList();
        
        document.getElementById('import-sticker-modal').classList.add('hidden');
        alert(`成功导入 ${stickers.length} 个表情包`);
    }

    function renderStickerTabs() {
        const container = document.getElementById('sticker-tabs-container');
        if (!container) return;

        // 确保指示器存在
        let indicator = container.querySelector('.tab-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'tab-indicator';
            container.appendChild(indicator);
        }

        // 清除旧的 tabs
        const oldTabs = container.querySelectorAll('.sticker-tab');
        oldTabs.forEach(t => t.remove());

        // 添加“全部”标签
        const allTab = document.createElement('div');
        allTab.className = `sticker-tab ${state.currentStickerCategoryId === 'all' ? 'active' : ''}`;
        allTab.textContent = '全部';
        allTab.onclick = (e) => {
            e.stopPropagation();
            state.currentStickerCategoryId = 'all';
            updateTabState(container, allTab);
        };
        container.appendChild(allTab);

        state.stickerCategories.forEach(cat => {
            const tab = document.createElement('div');
            tab.className = `sticker-tab ${state.currentStickerCategoryId === cat.id ? 'active' : ''}`;
            tab.textContent = cat.name;
            tab.onclick = (e) => {
                e.stopPropagation();
                state.currentStickerCategoryId = cat.id;
                updateTabState(container, tab);
            };
            container.appendChild(tab);
        });

        // 初始化指示器位置
        setTimeout(() => updateTabIndicator(), 50);
    }

    function updateTabState(container, activeTab) {
        const tabs = container.querySelectorAll('.sticker-tab');
        tabs.forEach(t => t.classList.remove('active'));
        activeTab.classList.add('active');
        
        updateTabIndicator();
        document.getElementById('sticker-search-input').value = '';
        if (state.isStickerManageMode) {
            toggleStickerManageMode();
        }
        renderStickerList();
    }

    function updateTabIndicator() {
        const container = document.getElementById('sticker-tabs-container');
        if (!container) return;
        
        const activeTab = container.querySelector('.sticker-tab.active');
        const indicator = container.querySelector('.tab-indicator');
        
        if (activeTab && indicator) {
            indicator.style.width = `${activeTab.offsetWidth}px`;
            indicator.style.left = `${activeTab.offsetLeft}px`;
            indicator.style.opacity = '1';
        } else if (indicator) {
            indicator.style.opacity = '0';
        }
    }

    function renderStickerList(filterText = '') {
        const container = document.getElementById('sticker-content');
        if (!container) return;

        container.innerHTML = '';

        let stickers = [];
        
        if (state.currentStickerCategoryId === 'all') {
            state.stickerCategories.forEach(cat => {
                cat.list.forEach((s, index) => {
                    stickers.push({ ...s, _catId: cat.id, _index: index });
                });
            });
        } else {
            const category = state.stickerCategories.find(c => c.id === state.currentStickerCategoryId);
            if (category) {
                stickers = category.list.map((s, index) => ({ ...s, _catId: category.id, _index: index }));
            }
        }

        if (stickers.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 20px;">暂无表情包</div>';
            return;
        }

        if (filterText) {
            stickers = stickers.filter(s => s.desc.toLowerCase().includes(filterText.toLowerCase()));
        }

        if (stickers.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 20px;">没有找到匹配的表情</div>';
            return;
        }

        stickers.forEach((sticker) => {
            const key = `${sticker._catId}-${sticker._index}`;
            const item = document.createElement('div');
            item.className = `sticker-item ${state.isStickerManageMode && state.selectedStickers.has(key) ? 'selected' : ''}`;
            
            let innerHTML = `
                <img src="${sticker.url}" loading="lazy" onerror="this.src='https://placehold.co/60x60?text=Error'">
                <span>${sticker.desc}</span>
            `;

            if (state.isStickerManageMode) {
                innerHTML += `<div class="sticker-checkbox"><i class="fas fa-check"></i></div>`;
                item.onclick = (e) => {
                    e.stopPropagation();
                    toggleSelectSticker(sticker._catId, sticker._index);
                };
            } else {
                item.onclick = (e) => {
                    e.stopPropagation();
                    sendSticker(sticker);
                };
            }

            item.innerHTML = innerHTML;
            container.appendChild(item);
        });
    }

    function sendSticker(sticker) {
        // 发送表情包作为 sticker 类型，描述作为附加信息
        // 用户端显示为图片，AI端接收为 "[发送了一个表情包：描述]"
        sendMessage(sticker.url, true, 'sticker', sticker.desc);
        
        // 关闭面板
        const panel = document.getElementById('sticker-panel');
        const chatInputArea = document.querySelector('.chat-input-area');
        
        if (panel) panel.classList.remove('slide-in');
        if (chatInputArea) chatInputArea.classList.remove('push-up');
    }

    function toggleStickerManageMode() {
        state.isStickerManageMode = !state.isStickerManageMode;
        state.selectedStickers.clear();
        
        const manageBtn = document.getElementById('sticker-manage-btn');
        const actionsPanel = document.getElementById('sticker-manage-actions');
        const topBar = document.querySelector('.sticker-top-bar');
        
        if (state.isStickerManageMode) {
            manageBtn.innerHTML = '<span style="font-size: 14px; color: #007AFF;">完成</span>';
            actionsPanel.classList.remove('hidden');
            if (topBar) topBar.style.display = 'none';
        } else {
            manageBtn.innerHTML = '<i class="fas fa-cog"></i>';
            actionsPanel.classList.add('hidden');
            if (topBar) topBar.style.display = 'flex';
        }
        
        updateSelectCount();
        renderStickerList();
    }

    function toggleSelectSticker(catId, index) {
        const key = `${catId}-${index}`;
        if (state.selectedStickers.has(key)) {
            state.selectedStickers.delete(key);
        } else {
            state.selectedStickers.add(key);
        }
        updateSelectCount();
        renderStickerList();
    }

    function updateSelectCount() {
        document.getElementById('sticker-select-count').textContent = `已选 ${state.selectedStickers.size}`;
    }

    function toggleSelectAllStickers() {
        let targetStickers = [];
        
        if (state.currentStickerCategoryId === 'all') {
            state.stickerCategories.forEach(cat => {
                cat.list.forEach((_, index) => {
                    targetStickers.push(`${cat.id}-${index}`);
                });
            });
        } else {
            const category = state.stickerCategories.find(c => c.id === state.currentStickerCategoryId);
            if (category) {
                category.list.forEach((_, index) => {
                    targetStickers.push(`${category.id}-${index}`);
                });
            }
        }
        
        if (targetStickers.length === 0) return;

        // 检查是否已全选
        let allSelected = true;
        for (const key of targetStickers) {
            if (!state.selectedStickers.has(key)) {
                allSelected = false;
                break;
            }
        }

        if (allSelected) {
            // 取消全选
            for (const key of targetStickers) {
                state.selectedStickers.delete(key);
            }
        } else {
            // 全选
            for (const key of targetStickers) {
                state.selectedStickers.add(key);
            }
        }
        
        updateSelectCount();
        renderStickerList();
    }

    function deleteSelectedStickers() {
        if (state.selectedStickers.size === 0) {
            // 如果没有选中任何表情，且处于管理模式，询问是否删除当前分类
            if (state.currentStickerCategoryId && state.currentStickerCategoryId !== 'all') {
                if (confirm('未选择表情。是否删除当前整个分类？')) {
                    state.stickerCategories = state.stickerCategories.filter(c => c.id !== state.currentStickerCategoryId);
                    state.currentStickerCategoryId = 'all';
                    saveConfig();
                    toggleStickerManageMode(); // 退出管理模式
                    renderStickerTabs();
                    renderStickerList();
                }
            }
            return;
        }

        if (confirm(`确定删除选中的 ${state.selectedStickers.size} 个表情吗？`)) {
            // 按分类分组删除
            const toDelete = {}; // catId -> [indexes]
            
            state.selectedStickers.forEach(key => {
                const [catId, index] = key.split('-');
                if (!toDelete[catId]) toDelete[catId] = [];
                toDelete[catId].push(parseInt(index));
            });

            // 执行删除 (从后往前删，防止索引错乱)
            Object.keys(toDelete).forEach(catId => {
                const category = state.stickerCategories.find(c => c.id == catId);
                if (category) {
                    const indexes = toDelete[catId].sort((a, b) => b - a);
                    indexes.forEach(idx => {
                        category.list.splice(idx, 1);
                    });
                }
            });

            state.selectedStickers.clear();
            saveConfig();
            updateSelectCount();
            renderStickerList();
        }
    }

    // 渲染并显示删除表情包分类的模态框
    function renderStickerCategoryDeleteModal() {
        const modal = document.getElementById('sticker-delete-cats-modal');
        if (!modal) return;
        const list = modal.querySelector('#sticker-delete-cats-list');
        list.innerHTML = '';

        if (!state.stickerCategories || state.stickerCategories.length === 0) {
            list.innerHTML = '<div class="list-item"><div class="list-content">暂无表情包分类</div></div>';
        } else {
            state.stickerCategories.forEach(cat => {
                const item = document.createElement('div');
                item.className = 'list-item';
                item.innerHTML = `
                    <div class="list-content" style="justify-content: space-between; align-items: center; width: 100%;">
                        <span>${cat.name}</span>
                        <input type="checkbox" class="sticker-delete-cat-checkbox" data-id="${cat.id}">
                    </div>
                `;
                list.appendChild(item);
            });
        }

        // 绑定关闭与确认按钮
        const closeBtn = document.getElementById('close-delete-sticker-cats');
        const confirmBtn = document.getElementById('confirm-delete-sticker-cats');

        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                modal.classList.add('hidden');
            };
        }

        if (confirmBtn) {
            confirmBtn.onclick = (e) => {
                e.stopPropagation();
                handleDeleteSelectedStickerCategories();
            };
        }

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });

        modal.classList.remove('hidden');
    }

    // 处理删除选中的表情包分类（包括分类内表情）
    function handleDeleteSelectedStickerCategories() {
        const modal = document.getElementById('sticker-delete-cats-modal');
        if (!modal) return;
        const checked = modal.querySelectorAll('.sticker-delete-cat-checkbox:checked');
        if (!checked || checked.length === 0) {
            alert('未选择任何分类');
            return;
        }

        const ids = Array.from(checked).map(cb => cb.dataset.id);
        if (!confirm(`确定删除选中的 ${ids.length} 个分类及其中的所有表情包吗？此操作不可恢复。`)) return;

        // 删除分类
        state.stickerCategories = state.stickerCategories.filter(c => !ids.includes(String(c.id)));

        // 移除联系人中对已删分类的关联
        if (state.contacts && state.contacts.length > 0) {
            state.contacts.forEach(contact => {
                if (contact.linkedStickerCategories && contact.linkedStickerCategories.length > 0) {
                    contact.linkedStickerCategories = contact.linkedStickerCategories.filter(id => !ids.includes(String(id)) && !ids.includes(id));
                }
            });
        }

        // 如果当前选择的分类被删除，切换到 all
        if (ids.includes(String(state.currentStickerCategoryId))) {
            state.currentStickerCategoryId = 'all';
        }

        saveConfig();
        renderStickerTabs();
        renderStickerList();
        modal.classList.add('hidden');
        alert('已删除所选分类');
    }

    // --- 分组功能 ---

    function openGroupSelect() {
        renderGroupList();
        document.getElementById('group-select-modal').classList.remove('hidden');
    }

    function renderGroupList() {
        const list = document.getElementById('group-list');
        if (!list) return;
        list.innerHTML = '';

        // 添加“未分组”选项
        const noGroupItem = document.createElement('div');
        noGroupItem.className = 'list-item center-content';
        noGroupItem.textContent = '未分组';
        if (!state.tempSelectedGroup) {
            noGroupItem.style.color = '#007AFF';
            noGroupItem.style.fontWeight = 'bold';
        }
        noGroupItem.onclick = () => handleSelectGroup('');
        list.appendChild(noGroupItem);

        if (state.contactGroups && state.contactGroups.length > 0) {
            state.contactGroups.forEach(group => {
                const item = document.createElement('div');
                item.className = 'list-item';
                
                const content = document.createElement('div');
                content.className = 'list-content';
                content.style.justifyContent = 'center';
                content.textContent = group;
                
                if (state.tempSelectedGroup === group) {
                    content.style.color = '#007AFF';
                    content.style.fontWeight = 'bold';
                }

                // 添加删除按钮（可选，这里简单实现长按删除或右侧删除图标，为了简洁先只做点击选择）
                // 为了支持删除，我们添加一个删除图标在右侧
                const deleteBtn = document.createElement('i');
                deleteBtn.className = 'fas fa-trash';
                deleteBtn.style.color = '#FF3B30';
                deleteBtn.style.marginLeft = '10px';
                deleteBtn.style.fontSize = '14px';
                deleteBtn.style.padding = '5px';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    handleDeleteGroup(group);
                };

                // 重新布局 item
                item.style.justifyContent = 'space-between';
                item.innerHTML = ''; // 清空
                
                // 左侧占位，保持文字居中
                const leftSpacer = document.createElement('div');
                leftSpacer.style.width = '24px';
                item.appendChild(leftSpacer);

                item.appendChild(content);
                item.appendChild(deleteBtn);

                item.onclick = () => handleSelectGroup(group);
                list.appendChild(item);
            });
        }
    }

    function handleCreateGroup() {
        const name = prompt('请输入新分组名称：');
        if (!name) return;
        
        if (state.contactGroups.includes(name)) {
            alert('分组已存在');
            return;
        }
        
        state.contactGroups.push(name);
        saveConfig();
        renderGroupList();
    }

    function handleDeleteGroup(groupName) {
        if (confirm(`确定要删除分组 "${groupName}" 吗？`)) {
            state.contactGroups = state.contactGroups.filter(g => g !== groupName);
            
            // 如果当前选中的是该分组，重置为未分组
            if (state.tempSelectedGroup === groupName) {
                state.tempSelectedGroup = '';
                document.getElementById('chat-setting-group-value').textContent = '未分组';
            }
            
            // 更新所有使用该分组的联系人
            state.contacts.forEach(c => {
                if (c.group === groupName) {
                    c.group = '';
                }
            });
            
            saveConfig();
            renderGroupList();
        }
    }

    function handleSelectGroup(groupName) {
        state.tempSelectedGroup = groupName;
        document.getElementById('chat-setting-group-value').textContent = groupName || '未分组';
        document.getElementById('group-select-modal').classList.add('hidden');
    }

/* ============================================================
   全新的组件库与主屏幕管理系统 (完整修复版)
   ============================================================ */

const GRID_ROWS = 6;
const GRID_COLS = 4;
const TOTAL_SLOTS = GRID_ROWS * GRID_COLS;
let isEditMode = false;

// --- 1. 定义数据结构 (已修复坐标) ---

// 主屏幕上正在显示的图标/组件
let homeScreenData = [
    // 音乐组件 (占据前两行: Row 0-1)
    { index: 0, type: 'dom-element', elementId: 'music-widget', size: '4x2' },
    
    // 拍立得组件 (移到第3行第一个，即 Index 8，避免重叠)
    { index: 8, type: 'dom-element', elementId: 'polaroid-widget', size: '2x2' },
    
    // 其他 App (放在第4行: Index 12-15)
    { index: 12, type: 'app', name: '微信', iconClass: 'fab fa-weixin', color: '#07C160', appId: 'wechat-app' },
    { index: 13, type: 'app', name: '世界书', iconClass: 'fas fa-globe', color: '#007AFF', appId: 'worldbook-app' },
    { index: 14, type: 'app', name: '设置', iconClass: 'fas fa-cog', color: '#8E8E93', appId: 'settings-app' },
    { index: 15, type: 'app', name: '美化', iconClass: 'fas fa-paint-brush', color: '#5856D6', appId: 'theme-app' },
];

// 系统内置组件定义 (用于从仓库恢复)
const systemWidgets = [
    { name: '音乐播放器', type: 'dom-element', elementId: 'music-widget', size: '4x2', previewColor: '#ff2d55' },
    { name: '拍立得', type: 'dom-element', elementId: 'polaroid-widget', size: '2x2', previewColor: '#ff9500' }
];

// 用户导入的 JSON 组件库
let importedWidgets = [];

// DOM 元素引用
const gridContainer = document.getElementById('home-screen-grid');
const repository = document.getElementById('widget-repository');
const libraryModal = document.getElementById('widget-library-modal');
const widgetInput = document.getElementById('widget-file-input');

// --- 2. 初始化与渲染 ---

function initGrid() {
    // 救援行动：先把系统组件搬回仓库，防止丢失
    systemWidgets.forEach(sysWidget => {
        const el = document.getElementById(sysWidget.elementId);
        if (el && repository && el.parentNode !== repository) {
            repository.appendChild(el);
        }
    });

    gridContainer.innerHTML = '';
    for (let i = 0; i < TOTAL_SLOTS; i++) {
        const slot = document.createElement('div');
        slot.classList.add('grid-slot');
        slot.dataset.index = i;
        
        // 绑定拖拽事件
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('dragleave', handleDragLeave);
        slot.addEventListener('drop', handleDrop);
        
        // 双击空白处进入编辑模式
        slot.addEventListener('dblclick', (e) => {
            if(e.target === slot) toggleEditMode();
        });
        
        gridContainer.appendChild(slot);
    }
    
    // 尝试读取存档，然后渲染
    loadLayout();
    renderItems();
    renderLibrary();
}

function renderItems() {
    // 1. 先把所有系统组件搬回仓库 (隐藏起来)
    systemWidgets.forEach(sysWidget => {
        const el = document.getElementById(sysWidget.elementId);
        if (el && repository) {
            repository.appendChild(el);
            el.style.display = 'block'; 
        }
    });

    // 2. 获取所有格子
    const slots = document.querySelectorAll('.grid-slot');
    
    // 3. 重置所有格子的状态
    slots.forEach(slot => {
        slot.innerHTML = '';
        slot.className = 'grid-slot'; 
        slot.style.display = 'block'; 
        slot.style.gridColumn = 'auto';
        slot.style.gridRow = 'auto';
        slot.removeAttribute('style');
    });

    // 4. 应用编辑模式样式
    if (isEditMode) gridContainer.classList.add('edit-mode');
    else gridContainer.classList.remove('edit-mode');

    // 5. 计算被大组件遮挡的格子，需要隐藏
    let coveredIndices = [];
    homeScreenData.forEach(item => {
        if (item.size && item.size !== '1x1') {
            const occupied = getOccupiedSlots(item.index, item.size);
            if (occupied) {
                occupied.forEach(id => {
                    if (id !== item.index) coveredIndices.push(id);
                });
            }
        }
    });

    // 6. 隐藏格子
    coveredIndices.forEach(id => {
        if (slots[id]) slots[id].style.display = 'none';
    });

    // 7. 渲染组件到格子
    homeScreenData.forEach(item => {
        const slot = slots[item.index];
        if (!slot) return;

        const canDrag = isEditMode;

        // A. DOM 组件 (音乐/拍立得)
        if (item.type === 'dom-element') {
            const domEl = document.getElementById(item.elementId);
            if (domEl) {
                applyWidgetSize(slot, item.size);
                slot.classList.add('widget-slot'); // 这里有加 widget-slot
                slot.appendChild(domEl);
                domEl.setAttribute('draggable', canDrag);
                domEl.ondragstart = (e) => handleDragStart(e, item);
                if (isEditMode) addDeleteButton(slot, item);
            }
        }
        
        // B. 普通 App
        else if (item.type === 'app') {
            const appEl = createAppElement(item, canDrag);
            slot.appendChild(appEl);
            if (isEditMode) addDeleteButton(slot, item);
        }
        
        // C. JSON 组件 (这里是修复点)
        else if (item.type === 'custom-json-widget') {
            const widgetEl = createCustomJsonWidget(item, canDrag);
            applyWidgetSize(slot, item.size);
            
            // =========== 【修复开始】 ===========
            // 必须加上这个类，否则组件会被挤压在 60x60 的格子里
            slot.classList.add('widget-slot'); 
            // =========== 【修复结束】 ===========
            
            slot.appendChild(widgetEl);
            if (isEditMode) addDeleteButton(slot, item);
        }
    });
}


// --- 3. 辅助创建函数 ---

function createAppElement(item, draggable) {
    const div = document.createElement('div');
    div.classList.add('draggable-item');
    div.setAttribute('draggable', draggable);
    
    // --- 适配美化功能开始 ---
    
    // 1. 确定背景颜色
    // 先看 state.iconColors 里有没有这个 App 的自定义颜色，如果没有就用默认的
    let finalColor = item.color || '#fff';
    // 使用 window.iphoneSimState 访问全局状态
    if (typeof window.iphoneSimState !== 'undefined' && window.iphoneSimState.iconColors && window.iphoneSimState.iconColors[item.appId]) {
        finalColor = window.iphoneSimState.iconColors[item.appId];
    }

    // 2. 确定图标内容 (图标 vs 自定义图片)
    // 默认是字体图标 (<i>)
    let iconContent = `<i class="${item.iconClass}" style="color: ${finalColor === '#fff' ? '#000' : '#fff'};"></i>`;
    
    // 如果 state.icons 里有这个 App 的自定义图片，就用图片替换 <i>
    if (typeof window.iphoneSimState !== 'undefined' && window.iphoneSimState.icons && window.iphoneSimState.icons[item.appId]) {
        iconContent = `<img src="${window.iphoneSimState.icons[item.appId]}" style="width:100%; height:100%; object-fit:cover; border-radius:14px;">`;
    }
    // --- 适配美化功能结束 ---

    div.innerHTML = `
        <div class="app-icon-img" style="background-color: ${finalColor}">
            ${iconContent}
        </div>
        <span class="app-name">${item.name}</span>
    `;
    
    div.addEventListener('dragstart', (e) => handleDragStart(e, item));
    
    // 点击事件：非编辑模式下打开应用
    div.addEventListener('click', (e) => {
        if (!isEditMode && item.appId) {
            // 调用原有的应用打开逻辑
            const appScreen = document.getElementById(item.appId);
            if (appScreen) appScreen.classList.remove('hidden');
        }
    });
    
    return div;
}


// --- 替换原有的 createCustomJsonWidget 函数 ---

function createCustomJsonWidget(item, draggable) {
    const div = document.createElement('div');
    div.classList.add('custom-widget');
    div.setAttribute('draggable', draggable);
    
    // 确保组件填满格子
    div.style.width = '100%';
    div.style.height = '100%'; 
    
    const content = document.createElement('div');
    content.style.width = '100%'; content.style.height = '100%'; 
    content.style.borderRadius = '18px'; content.style.overflow = 'hidden';
    
    // 编辑模式下禁止内部交互以便拖拽，非编辑模式下允许交互
    if(isEditMode) {
        content.style.pointerEvents = 'none'; 
    } else {
        content.style.pointerEvents = 'auto';
    }

    if (item.css) {
        const style = document.createElement('style');
        style.textContent = item.css;
        content.appendChild(style);
    }
    
    const htmlDiv = document.createElement('div');
    htmlDiv.innerHTML = item.html;
    htmlDiv.style.height = '100%';
    
    // --- 内部辅助函数：静默保存数据 ---
    const silentSave = () => {
        try {
            localStorage.setItem('myIOS_HomeScreen', JSON.stringify(homeScreenData));
            // 同时也保存库，防止引用丢失
            localStorage.setItem('myIOS_Library', JSON.stringify(importedWidgets)); 
            console.log('Widget state auto-saved');
        } catch (e) {
            console.error('Auto-save failed', e);
        }
    };

    // --- 内部辅助函数：图片压缩 ---
    const processImage = (file, callback) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                // 限制最大尺寸为 600px 以节省 LocalStorage 空间
                const maxDim = 600;
                let w = img.width;
                let h = img.height;
                if (w > maxDim || h > maxDim) {
                    if (w > h) { h *= maxDim/w; w = maxDim; }
                    else { w *= maxDim/h; h = maxDim; }
                }
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);
                // 压缩为 JPEG 0.7 质量
                callback(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
        reader.readAsDataURL(file);
    };
    
    // --- 核心修复逻辑：自动绑定文件输入框 ---
    const fileInputs = htmlDiv.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        // 防止点击穿透触发拖拽或其他行为
        input.addEventListener('click', (e) => e.stopPropagation());
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            processImage(file, (base64) => {
                // 1. 寻找目标图片元素 (逻辑优化)
                let targetImg = null;
                
                // 优先：通过 data-target 属性寻找
                if (input.dataset.target) {
                    targetImg = htmlDiv.querySelector('#' + input.dataset.target);
                }
                // 其次：寻找输入框紧邻的前一个 img 元素
                if (!targetImg) {
                    let sibling = input.previousElementSibling;
                    while(sibling) {
                        if (sibling.tagName === 'IMG') {
                            targetImg = sibling;
                            break;
                        }
                        sibling = sibling.previousElementSibling;
                    }
                }
                // 再次：寻找输入框父元素内的 img
                if (!targetImg && input.parentElement) {
                    targetImg = input.parentElement.querySelector('img');
                }
                // 兜底：组件内第一个 img
                if (!targetImg) targetImg = htmlDiv.querySelector('img');

                if (targetImg) {
                    // 【关键修复】显式设置 src 属性，确保 innerHTML 序列化时包含 base64 数据
                    targetImg.setAttribute('src', base64);
                    targetImg.src = base64; // 同时更新 DOM 属性以立即显示
                    
                    // 2. 将更新后的 HTML 写回数据对象
                    item.html = htmlDiv.innerHTML;
                    
                    // 3. 静默保存
                    silentSave();
                }
            });
        });
    });

    // 监听可编辑文本的变化 (如果有 contenteditable 元素)
    htmlDiv.addEventListener('input', () => {
        item.html = htmlDiv.innerHTML;
    });
    // 失去焦点时自动保存文本更改
    htmlDiv.addEventListener('blur', () => silentSave(), true);
    // ---------------------------

    content.appendChild(htmlDiv);
    div.appendChild(content);

    div.addEventListener('dragstart', (e) => handleDragStart(e, item));
    return div;
}



function addDeleteButton(slot, item) {
    const btn = document.createElement('div');
    btn.className = 'delete-btn';
    btn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`确定要移除 ${item.name || '这个组件'} 吗？`)) {
            removeItem(item);
        }
    };
    slot.appendChild(btn);
}

// --- 4. 核心拖拽逻辑 ---

// 获取组件占用的格子索引数组
function getOccupiedSlots(startIndex, size) {
    const indices = [];
    const r = Math.floor(startIndex / GRID_COLS);
    const c = startIndex % GRID_COLS;
    
    let w = 1, h = 1;
    if (size === '2x2') { w = 2; h = 2; }
    if (size === '4x2') { w = 4; h = 2; }
    
    if (c + w > GRID_COLS) return null; // 越界
    if (r + h > GRID_ROWS) return null; // 越界

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            indices.push((r + i) * GRID_COLS + (c + j));
        }
    }
    return indices;
}

function handleDragStart(e, item) {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
    window.draggingSize = item.size || '1x1';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // 吸附预览
    const targetIndex = parseInt(this.dataset.index);
    const size = window.draggingSize || '1x1';
    
    document.querySelectorAll('.grid-slot.drag-preview').forEach(el => el.classList.remove('drag-preview'));
    
    const slotsToHighlight = getOccupiedSlots(targetIndex, size);
    
    if (slotsToHighlight) {
        slotsToHighlight.forEach(idx => {
            const slot = document.querySelector(`.grid-slot[data-index="${idx}"]`);
            if (slot) slot.classList.add('drag-preview');
        });
    }
}

function handleDragLeave(e) {
    // 可选：不做处理
}

function handleDrop(e) {
    e.preventDefault();
    document.querySelectorAll('.grid-slot.drag-preview').forEach(el => el.classList.remove('drag-preview'));
    
    const targetIndex = parseInt(this.dataset.index);
    try {
        const rawData = e.dataTransfer.getData('text/plain');
        if (!rawData) return;

        const data = JSON.parse(rawData);
        
        // 检查是否越界
        const targetSlots = getOccupiedSlots(targetIndex, data.size || '1x1');
        if (!targetSlots) return;

        // 查找原始对象
        let oldItem = null;
        if (data.elementId) {
            oldItem = homeScreenData.find(d => d.elementId === data.elementId);
        } else if (data.appId) {
            oldItem = homeScreenData.find(d => d.appId === data.appId);
        } else {
            oldItem = homeScreenData.find(d => d.index === data.index && d.name === data.name);
        }

        if (oldItem) {
            // 简单覆盖模式：允许拖到任何不越界的位置
            // 高级逻辑（交换）比较复杂，这里先确保能拖动
            oldItem.index = targetIndex;
            renderItems();
        }
    } catch(err) {
        console.error("Drop error", err);
    }
}

// --- 5. 添加与删除 ---

function removeItem(item) {
    homeScreenData = homeScreenData.filter(d => d !== item);
    renderItems();
}

function addToScreen(widgetTemplate) {
    let freeIndex = -1;
    // 寻找空位
    for(let i=0; i<TOTAL_SLOTS; i++) {
        // 检查点 i 是否被占用
        const isOccupied = homeScreenData.some(d => {
            const occ = getOccupiedSlots(d.index, d.size || '1x1');
            return occ && occ.includes(i);
        });
        
        if (!isOccupied) {
            // 检查放入后是否越界或重叠
            const needed = getOccupiedSlots(i, widgetTemplate.size);
            if (needed) {
                const collision = needed.some(idx => {
                    return homeScreenData.some(d => {
                        const occ = getOccupiedSlots(d.index, d.size || '1x1');
                        return occ && occ.includes(idx);
                    });
                });
                if (!collision) {
                    freeIndex = i;
                    break;
                }
            }
        }
    }

    if(freeIndex === -1) {
        alert("主屏幕空间不足，无法放置该组件。");
        return;
    }

    if (widgetTemplate.type === 'dom-element') {
        const exists = homeScreenData.find(d => d.elementId === widgetTemplate.elementId);
        if (exists) {
            alert("该组件已在屏幕上。");
            return;
        }
    }

    const newItem = { ...widgetTemplate, index: freeIndex };
    homeScreenData.push(newItem);
    libraryModal.classList.remove('show');
    renderItems();
}

// --- 6. 工具栏与保存 ---

function toggleEditMode() {
    isEditMode = !isEditMode;
    const toolbar = document.getElementById('edit-mode-toolbar');
    if (isEditMode) {
        toolbar.classList.remove('hidden');
    } else {
        toolbar.classList.add('hidden');
    }
    renderItems();
}

function saveLayout() {
    try {
        localStorage.setItem('myIOS_HomeScreen', JSON.stringify(homeScreenData));
        localStorage.setItem('myIOS_Library', JSON.stringify(importedWidgets));
        toggleEditMode(); 
        alert("布局保存成功！");
    } catch (e) {
        console.error(e);
        alert("保存失败：可能是存储空间不足。");
    }
}

function loadLayout() {
    try {
        const savedScreen = localStorage.getItem('myIOS_HomeScreen');
        const savedLib = localStorage.getItem('myIOS_Library');
        if (savedScreen) homeScreenData = JSON.parse(savedScreen);
        if (savedLib) importedWidgets = JSON.parse(savedLib);
    } catch (e) { console.error("Load failed", e); }
}

// --- 7. 组件库界面 ---

// --- 替换原有的 renderLibrary 函数 ---

function renderLibrary() {
    const sysRow = document.getElementById('lib-system-row');
    const custRow = document.getElementById('lib-custom-row');
    
    sysRow.innerHTML = '';
    systemWidgets.forEach(widget => {
        // 系统组件不传 index，不可删除
        sysRow.appendChild(createLibraryItem(widget, false));
    });

    custRow.innerHTML = '';
    if (importedWidgets.length === 0) {
        custRow.innerHTML = '<div style="color:#888; padding:10px;">暂无导入</div>';
    } else {
        importedWidgets.forEach((widget, index) => {
            // 传入 index 和 true (isCustom)
            custRow.appendChild(createLibraryItem(widget, true, index));
        });
    }
}

// --- 替换原有的 createLibraryItem 函数 ---

function createLibraryItem(widget, isCustom = false, index = null) {
    const el = document.createElement('div');
    el.className = 'library-item';
    el.style.position = 'relative'; // 为了定位删除按钮
    
    let previewHtml = '';
    if (widget.type === 'dom-element') {
        previewHtml = `<div style="width:100%; height:100%; background:${widget.previewColor || '#ccc'}; display:flex; align-items:center; justify-content:center; color:white; font-size:24px;"><i class="fas fa-cube"></i></div>`;
    } else {
        // 对于自定义组件，预览缩放显示
        previewHtml = `<div style="transform:scale(0.5); transform-origin:top left; width:200%; height:200%; overflow:hidden;">${widget.html}</div>`;
        if(widget.css) previewHtml = `<style>${widget.css}</style>` + previewHtml;
    }

    el.innerHTML = `
        <div class="library-preview-box size-${widget.size}">
            <div style="width:100%; height:100%; overflow:hidden;">${previewHtml}</div>
        </div>
        <div class="library-item-name">${widget.name}</div>
    `;

    // 点击添加到屏幕
    el.onclick = (e) => {
        // 如果点击的是删除按钮，不触发添加
        if (e.target.closest('.lib-delete-btn')) return;
        addToScreen(widget);
    };

    // --- 新增：如果是自定义组件，添加删除按钮 ---
    if (isCustom && index !== null) {
        const delBtn = document.createElement('div');
        delBtn.className = 'lib-delete-btn';
        delBtn.innerHTML = '&times;';
        // 简单的内联样式，你也可以写在 CSS 里
        delBtn.style.cssText = `
            position: absolute;
            top: 0px;
            right: 0;
            width: 20px;
            height: 20px;
            background: rgba(255, 59, 48, 0.9);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            line-height: 1;
            cursor: pointer;
            z-index: 10;
        `;
        
        delBtn.onclick = (e) => {
            e.stopPropagation(); // 阻止冒泡
            deleteImportedWidget(index);
        };
        el.appendChild(delBtn);
    }

    return el;
}

// --- 新增：删除组件的函数 ---
function deleteImportedWidget(index) {
    if (confirm('确定要从库中删除此组件吗？')) {
        importedWidgets.splice(index, 1);
        // 保存更新后的库
        localStorage.setItem('myIOS_Library', JSON.stringify(importedWidgets));
        // 重新渲染
        renderLibrary();
    }
}


/* --- script.js --- */

function applyWidgetSize(slot, size) {
    if (size === '4x2') { 
        slot.style.gridColumn = 'span 4'; 
        slot.style.gridRow = 'span 2';
        // 强制高度：(60px * 2) + 30px gap = 150px
        slot.style.height = '150px'; 
    }
    else if (size === '2x2') { 
        slot.style.gridColumn = 'span 2'; 
        slot.style.gridRow = 'span 2'; 
        // 强制高度
        slot.style.height = '150px';
    }
    // 普通 1x1 不需要处理，默认为 60px
}


// 事件绑定
document.getElementById('add-widget-btn').onclick = () => {
    libraryModal.classList.add('show');
    renderLibrary();
};
document.getElementById('close-library-btn').onclick = () => libraryModal.classList.remove('show');
document.getElementById('exit-edit-btn').onclick = toggleEditMode;
document.getElementById('save-layout-btn').onclick = saveLayout;
document.getElementById('import-json-btn').onclick = () => widgetInput.click();

widgetInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const data = JSON.parse(evt.target.result);
            if(data.html && data.size) {
                importedWidgets.push({
                    name: data.name || '未命名组件',
                    type: 'custom-json-widget',
                    size: data.size,
                    html: data.html,
                    css: data.css
                });
                renderLibrary();
                alert("导入成功！");
            } else {
                alert("文件格式不正确");
            }
        } catch(err) { alert("解析失败"); }
    };
    reader.readAsText(file);
    widgetInput.value = '';
};

// 启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrid);
} else {
    initGrid();
}
// --- 自动刷新适配 ---
// 当点击“关闭美化”或“关闭图标设置”按钮时，重新渲染网格以应用新样式
const refreshButtons = [
    'close-theme-app', 
    'close-theme-icons', 
    'close-theme-wallpaper', // 壁纸改变可能也需要刷新一下视觉
    'reset-icons' // 重置按钮
];

refreshButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', () => {
            // 稍微延迟一下，确保 state 已经更新
            setTimeout(() => {
                renderItems(); 
            }, 50);
        });
    }
});
    // --- 新增逻辑函数 ---

    // 打开编辑弹窗
    window.openEditChatMessageModal = function(msgId, currentContent) {
        currentEditingChatMsgId = msgId;
        const textarea = document.getElementById('edit-chat-msg-content');
        textarea.value = currentContent;
        document.getElementById('edit-chat-msg-modal').classList.remove('hidden');
    };

    // 保存编辑后的消息
    function handleSaveEditedChatMessage() {
        if (!currentEditingChatMsgId || !state.currentChatContactId) return;

        const newContent = document.getElementById('edit-chat-msg-content').value.trim();
        if (!newContent) {
            alert('消息内容不能为空');
            return;
        }

        const messages = state.chatHistory[state.currentChatContactId];
        const msgIndex = messages.findIndex(m => m.id == currentEditingChatMsgId); // 使用宽松比较，防止类型差异

        if (msgIndex !== -1) {
            // 更新内容
            messages[msgIndex].content = newContent;
            
            // 保存并刷新
            saveConfig();
            renderChatHistory(state.currentChatContactId);
            
            // 关闭弹窗
            document.getElementById('edit-chat-msg-modal').classList.add('hidden');
            currentEditingChatMsgId = null;
            
            // 可选：显示提示
            // showChatToast('已修改'); 
        } else {
            alert('找不到原消息，可能已被删除');
            document.getElementById('edit-chat-msg-modal').classList.add('hidden');
        }
    }
    // === 插入点 4：语音功能核心逻辑 ===

    // 1. 发送伪造语音
    function handleSendFakeVoice() {
        const text = document.getElementById('voice-fake-text').value.trim();
        const duration = document.getElementById('voice-fake-duration').value;

        if (!text) {
            alert('请输入语音内容文本');
            return;
        }

        const voiceData = {
            duration: parseInt(duration),
            text: text,
            isReal: false
        };

        sendMessage(JSON.stringify(voiceData), true, 'voice');
        document.getElementById('voice-input-modal').classList.add('hidden');
    }

    // 2. 真实录音相关变量
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    let recordedDuration = 0;
    let recordingStartTime = 0;
    let recordedText = '';
    let recordedAudio = null; // 新增：存储录音数据的 Base64

    // 语音通话 VAD 相关变量
    let voiceCallAudioContext = null;
    let voiceCallAnalyser = null;
    let voiceCallMicrophone = null;
    let voiceCallScriptProcessor = null;
    let voiceCallMediaRecorder = null;
    let voiceCallChunks = [];
    let voiceCallIsSpeaking = false;
    let voiceCallSilenceStart = 0;
    let voiceCallVadInterval = null;
    let voiceCallIsRecording = false;
    let voiceCallStream = null; // 新增：存储通话麦克风流
    let globalVoicePlayer = null; // 新增：全局语音播放器

    // 3. 切换录音状态 (使用 MediaRecorder + Whisper API)
    async function toggleVoiceRecording() {
        const micBtn = document.getElementById('voice-mic-btn');
        const statusText = document.getElementById('voice-recording-status');
        const resultDiv = document.getElementById('voice-real-result');
        const sendBtn = document.getElementById('send-real-voice-btn');
        
        // 检查 Whisper 配置
        if (!state.whisperSettings.url || !state.whisperSettings.key) {
            alert('请先在设置中配置 Whisper API');
            return;
        }

        if (!isRecording) {
            // ===========================
            //      开始录音逻辑
            // ===========================
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // 或者 audio/mp4, audio/wav
                    const audioFile = new File([audioBlob], "recording.webm", { type: 'audio/webm' });
                    
                    // 计算时长
                    const duration = Math.ceil((Date.now() - recordingStartTime) / 1000);
                    recordedDuration = duration > 60 ? 60 : duration;

                    // 将音频转换为 Base64 保存 (使用 Promise 确保完成)
                    recordedAudio = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(audioBlob);
                    });
                    console.log('Audio processed, length:', recordedAudio ? recordedAudio.length : 0);

                    // UI 更新
                    micBtn.classList.remove('recording');
                    statusText.textContent = '正在转文字...';
                    statusText.style.color = '#007AFF';
                    
                    // 上传到 Whisper API
                    try {
                        const formData = new FormData();
                        formData.append('file', audioFile);
                        formData.append('model', state.whisperSettings.model || 'whisper-1');
                        // formData.append('language', 'zh'); // 可选：指定语言

                        let fetchUrl = state.whisperSettings.url;
                        if (!fetchUrl.endsWith('/audio/transcriptions')) {
                            fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'audio/transcriptions' : fetchUrl + '/audio/transcriptions';
                        }

                        const response = await fetch(fetchUrl, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${state.whisperSettings.key}`
                            },
                            body: formData
                        });

                        if (!response.ok) {
                            throw new Error(`API Error: ${response.status}`);
                        }

                        const data = await response.json();
                        recordedText = data.text;
                        
                        resultDiv.textContent = recordedText;
                        statusText.textContent = '录音结束';
                        statusText.style.color = '#888';
                        
                        if (recordedText) {
                            sendBtn.disabled = false;
                        }

                    } catch (error) {
                        console.error('Whisper API Error:', error);
                        let errorMsg = error.message;
                        if (errorMsg === 'Failed to fetch') {
                            errorMsg += ' (可能是跨域问题或网络连接超时，请检查API地址是否支持跨域访问，或尝试使用代理)';
                        }
                        resultDiv.textContent = '转文字失败: ' + errorMsg;
                        statusText.textContent = '出错';
                        statusText.style.color = '#FF3B30';
                    }
                    
                    // 停止所有轨道以释放麦克风
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                isRecording = true;
                recordingStartTime = Date.now();
                
                // UI 更新
                micBtn.classList.add('recording');
                statusText.textContent = '正在录音... (点击停止)';
                statusText.style.color = '#FF3B30';
                resultDiv.textContent = '';
                sendBtn.disabled = true;
                recordedText = '';

            } catch (err) {
                console.error('无法访问麦克风:', err);
                alert('无法访问麦克风，请检查权限。');
            }

        } else {
            // ===========================
            //      停止录音逻辑
            // ===========================
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                isRecording = false;
            }
        }
    }


    // 4. 发送真实录音
    function handleSendRealVoice() {
        // 如果识别为空，给一个默认值
        if (!recordedText) recordedText = '[语音]';

        const voiceData = {
            duration: recordedDuration || 1,
            text: recordedText,
            isReal: true,
            audio: recordedAudio // 发送音频数据
        };

        sendMessage(JSON.stringify(voiceData), true, 'voice');
        document.getElementById('voice-input-modal').classList.add('hidden');
    }
    // === 插入点 4 结束 ===
    // --- 语音通话功能 ---
    let voiceCallTimer = null;
    let voiceCallSeconds = 0;
    let currentVoiceCallStartTime = 0;
    let voiceCallStartIndex = 0;

    function openVoiceCallScreen() {
        if (!state.currentChatContactId) return;
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        // 记录开始状态
        if (!state.chatHistory[state.currentChatContactId]) {
            state.chatHistory[state.currentChatContactId] = [];
        }
        voiceCallStartIndex = state.chatHistory[state.currentChatContactId].length;
        currentVoiceCallStartTime = Date.now();

        const screen = document.getElementById('voice-call-screen');
        const avatar = document.getElementById('voice-call-avatar');
        const name = document.getElementById('voice-call-name');
        const bg = document.getElementById('voice-call-bg');
        const timeEl = document.getElementById('voice-call-time');
        const contentContainer = document.getElementById('voice-call-content');

        // 初始化信息
        avatar.src = contact.avatar;
        name.textContent = contact.remark || contact.name;
        
        // 背景图：优先使用通话背景，否则使用聊天背景，否则默认
        if (contact.voiceCallBg) {
            bg.style.backgroundImage = `url(${contact.voiceCallBg})`;
        } else if (contact.chatBg) {
            bg.style.backgroundImage = `url(${contact.chatBg})`;
        } else {
            // 默认背景，可以使用一个渐变或默认图
            bg.style.backgroundImage = 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
        }

        // 重置状态
        voiceCallSeconds = 0;
        timeEl.textContent = '00:00';
        contentContainer.innerHTML = ''; // 清空对话
        document.getElementById('voice-call-status').textContent = '正在通话中...';
        
        // 显示界面
        screen.classList.remove('hidden');

        // --- 移动端音频解锁 ---
        if (!globalVoicePlayer) {
            globalVoicePlayer = new Audio();
        }
        // 播放一段极短的静音音频来解锁自动播放
        // 这是一个 0.1秒的静音 WAV
        globalVoicePlayer.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAgAAAAEA';
        globalVoicePlayer.play().catch(e => console.log('Audio unlock failed (harmless if not on mobile):', e));
        // --------------------

        // 开始计时
        if (voiceCallTimer) clearInterval(voiceCallTimer);
        
        const updateTime = () => {
            const mins = Math.floor(voiceCallSeconds / 60).toString().padStart(2, '0');
            const secs = (voiceCallSeconds % 60).toString().padStart(2, '0');
            const timeStr = `${mins}:${secs}`;
            
            if (timeEl) timeEl.textContent = timeStr;
            
            // 同步更新悬浮窗时间
            const floatTimeEl = document.getElementById('float-call-time');
            if (floatTimeEl) floatTimeEl.textContent = timeStr;
        };
        
        // 立即更新一次
        updateTime();

        voiceCallTimer = setInterval(() => {
            voiceCallSeconds++;
            updateTime();
        }, 1000);

        // 绑定背景上传
        const bgInput = document.getElementById('voice-call-bg-input');
        // 移除旧监听器
        const newBg = bg.cloneNode(true);
        bg.parentNode.replaceChild(newBg, bg);
        newBg.onclick = () => bgInput.click();
        
        // 移除旧监听器
        const newBgInput = bgInput.cloneNode(true);
        bgInput.parentNode.replaceChild(newBgInput, bgInput);
        newBgInput.onchange = (e) => handleVoiceCallBgUpload(e, contact);

        // 绑定按钮事件
        const hangupBtn = document.getElementById('voice-call-hangup-btn');
        const minimizeBtn = document.getElementById('voice-call-minimize-btn');
        const addBtn = document.getElementById('voice-call-add-btn');

        // 移除旧监听器
        const newHangupBtn = hangupBtn.cloneNode(true);
        hangupBtn.parentNode.replaceChild(newHangupBtn, hangupBtn);
        newHangupBtn.onclick = () => closeVoiceCallScreen('user');

        const newMinimizeBtn = minimizeBtn.cloneNode(true);
        minimizeBtn.parentNode.replaceChild(newMinimizeBtn, minimizeBtn);
        newMinimizeBtn.onclick = minimizeVoiceCallScreen;

        const newAddBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newAddBtn, addBtn);
        newAddBtn.onclick = () => alert('添加成员功能开发中...');
        
        // 悬浮窗点击恢复
        const floatWindow = document.getElementById('voice-call-float');
        if (floatWindow) {
            // floatWindow.onclick = restoreVoiceCallScreen; // 移除直接绑定，改由 makeDraggable 处理
            makeDraggable(floatWindow, restoreVoiceCallScreen);
        }

        // 麦克风和扬声器切换
        const micBtn = document.getElementById('voice-call-mic-btn');
        // 移除旧监听器
        const newMicBtn = micBtn.cloneNode(true);
        micBtn.parentNode.replaceChild(newMicBtn, micBtn);

        newMicBtn.onclick = () => {
            newMicBtn.classList.toggle('active');
            const span = newMicBtn.nextElementSibling;
            const isActive = newMicBtn.classList.contains('active');
            span.textContent = isActive ? '麦克风已开' : '麦克风已关';

            if (isActive) {
                startVoiceCallVAD();
            } else {
                stopVoiceCallVAD();
            }
        };

        const speakerBtn = document.getElementById('voice-call-speaker-btn');
        speakerBtn.onclick = () => {
            speakerBtn.classList.toggle('active');
            const span = speakerBtn.nextElementSibling;
            span.textContent = speakerBtn.classList.contains('active') ? '扬声器已开' : '扬声器已关';
        };

        // 发送消息
        const sendBtn = document.getElementById('voice-call-send-btn');
        const input = document.getElementById('voice-call-input');
        
        // 移除旧监听器
        const newSendBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
        
        const handleSend = () => {
            const text = input.value.trim();
            if (text) {
                input.value = '';
                // 使用特殊类型 voice_call_text，使其在聊天页面隐藏
                sendMessage(text, true, 'voice_call_text');
                // 触发 AI 回复
                generateVoiceCallAiReply();
            }
        };

        newSendBtn.onclick = handleSend;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') handleSend();
        };
    }

    function closeVoiceCallScreen(hangupType = 'user') {
        const screen = document.getElementById('voice-call-screen');
        const floatWindow = document.getElementById('voice-call-float');
        
        screen.classList.add('hidden');
        if (floatWindow) floatWindow.classList.add('hidden');
        
        if (voiceCallTimer) clearInterval(voiceCallTimer);
        voiceCallTimer = null;

        // 停止 VAD
        stopVoiceCallVAD();

        // 计算通话时长
        const duration = Math.ceil((Date.now() - currentVoiceCallStartTime) / 1000);
        const mins = Math.floor(duration / 60).toString().padStart(2, '0');
        const secs = (duration % 60).toString().padStart(2, '0');
        const timeStr = `${mins}:${secs}`;

        // 发送通话时长消息
        // hangupType: 'user' (用户挂断, isUser=true) 或 'ai' (AI挂断, isUser=false)
        const isUserHangup = hangupType === 'user';
        sendMessage(`通话时长：${timeStr}`, isUserHangup, 'text');

        // 触发通话总结
        summarizeVoiceCall(state.currentChatContactId, voiceCallStartIndex);
    }

    async function summarizeVoiceCall(contactId, startIndex) {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return;

        const settings = state.aiSettings2.url ? state.aiSettings2 : state.aiSettings;
        if (!settings.url || !settings.key) return;

        const history = state.chatHistory[contactId] || [];
        // 获取通话期间的消息
        const callMessages = history.slice(startIndex);
        
        // 过滤出通话内容 (voice_call_text)
        const callContent = callMessages
            .filter(m => m.type === 'voice_call_text')
            .map(m => {
                let text = m.content;
                try {
                    const data = JSON.parse(m.content);
                    if (data.text) text = data.text;
                } catch(e) {}
                return `${m.role === 'user' ? '用户' : contact.name}: ${text}`;
            })
            .join('\n');

        if (!callContent) return;

        showNotification('正在总结通话...');

        const systemPrompt = `你是一个通话记录总结助手。
请阅读以下一段语音通话的文字记录，并生成一段简练的通话摘要。
摘要应该是陈述句，概括聊了什么主要内容。
不要包含“通话记录显示”、“用户说”等前缀，直接陈述事实。
请将摘要控制在 100 字以内。`;

        try {
            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: callContent }
                    ],
                    temperature: 0.5
                })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            let summary = data.choices[0].message.content.trim();
            
            if (summary) {
                // 添加到记忆
                state.memories.push({
                    id: Date.now(),
                    contactId: contact.id,
                    content: `【通话回忆】 ${summary}`,
                    time: Date.now(),
                    range: '语音通话'
                });
                saveConfig();
                
                console.log('通话总结完成:', summary);
                showNotification('通话总结完成', 2000, 'success');
            }

        } catch (error) {
            console.error('通话总结失败:', error);
            showNotification('总结出错', 2000, 'error');
        }
    }

    function minimizeVoiceCallScreen() {
        const screen = document.getElementById('voice-call-screen');
        const floatWindow = document.getElementById('voice-call-float');
        
        screen.classList.add('hidden');
        if (floatWindow) floatWindow.classList.remove('hidden');
    }

    function restoreVoiceCallScreen() {
        const screen = document.getElementById('voice-call-screen');
        const floatWindow = document.getElementById('voice-call-float');
        
        screen.classList.remove('hidden');
        if (floatWindow) floatWindow.classList.add('hidden');
    }

    function makeDraggable(element, onClickCallback) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;
        
        element.onmousedown = dragMouseDown;
        element.ontouchstart = dragMouseDown;
        
        // 移除可能存在的 onclick，防止冲突
        element.onclick = null;

        function dragMouseDown(e) {
            e = e || window.event;
            // e.preventDefault(); // 允许点击事件
            
            isDragging = false;

            if (e.type === 'touchstart') {
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
            } else {
                pos3 = e.clientX;
                pos4 = e.clientY;
            }
            
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            
            isDragging = true;
            
            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;
            
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            
            // 边界检查
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            
            if (newTop < 0) newTop = 0;
            if (newTop > maxY) newTop = maxY;
            if (newLeft < 0) newLeft = 0;
            if (newLeft > maxX) newLeft = maxX;

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = "auto"; // 清除 right 属性
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
            
            if (!isDragging && onClickCallback) {
                onClickCallback();
            }
        }
    }

    function handleVoiceCallBgUpload(e, contact) {
        const file = e.target.files[0];
        if (!file) return;

        compressImage(file, 800, 0.7).then(base64 => {
            contact.voiceCallBg = base64;
            document.getElementById('voice-call-bg').style.backgroundImage = `url(${base64})`;
            saveConfig();
        }).catch(err => {
            console.error('图片压缩失败', err);
        });
        e.target.value = '';
    }

    function addVoiceCallMessage(text, role) {
        const container = document.getElementById('voice-call-content');
        const msgDiv = document.createElement('div');
        msgDiv.className = `voice-call-msg ${role}`;
        msgDiv.textContent = text;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    // 播放通话音频
    function playVoiceCallAudio(audioData) {
        if (!audioData) return;
        
        // 复用全局播放器以支持移动端连续播放
        if (!globalVoicePlayer) {
            globalVoicePlayer = new Audio();
        }
        
        globalVoicePlayer.src = audioData;
        globalVoicePlayer.play().catch(e => console.error('Auto play failed:', e));
    }

    // 修改 appendMessageToUI 以支持通话界面同步显示
    const originalAppendMessageToUI = appendMessageToUI;
    appendMessageToUI = function(text, isUser, type, description, replyTo, msgId) {
        originalAppendMessageToUI(text, isUser, type, description, replyTo, msgId);
        
        // 如果通话界面是打开的，且是当前联系人，同步显示
        const screen = document.getElementById('voice-call-screen');
        if (!screen.classList.contains('hidden') && state.currentChatContactId) {
            // 过滤掉系统消息等
            if ((type === 'text' || type === 'voice_call_text') && !text.startsWith('[')) {
                let displayText = text;
                let audioData = null;

                // 尝试解析 JSON (针对带音频的 AI 回复)
                try {
                    const data = JSON.parse(text);
                    if (data && data.text) {
                        displayText = data.text;
                        audioData = data.audio;
                    }
                } catch (e) {
                    // 不是 JSON，保持原样
                }

                addVoiceCallMessage(displayText, isUser ? 'user' : 'ai');

                // 如果是 AI 消息且有音频，自动播放
                if (!isUser && audioData) {
                    playVoiceCallAudio(audioData);
                }
            }
        }
    };

    async function generateVoiceCallAiReply() {
        if (!state.currentChatContactId) return;
        
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (!contact) return;

        const settings = state.aiSettings.url ? state.aiSettings : state.aiSettings2;
        if (!settings.url || !settings.key) {
            // alert('请先在设置中配置AI API');
            return;
        }

        // UI 显示正在输入... (在通话界面显示状态)
        const statusEl = document.getElementById('voice-call-status');
        const originalStatus = statusEl.textContent;
        statusEl.textContent = '对方正在说话...';

        const history = state.chatHistory[state.currentChatContactId] || [];
        
        // 获取当前用户人设信息
        let userPromptInfo = '';
        let currentPersona = null;
        if (contact.userPersonaId) {
            currentPersona = state.userPersonas.find(p => p.id === contact.userPersonaId);
        }
        if (currentPersona) {
            userPromptInfo = `\n用户(我)的网名：${currentPersona.name || '未命名'}`;
            if (currentPersona.aiPrompt) {
                userPromptInfo += `\n用户(我)的人设：${currentPersona.aiPrompt}`;
            }
        } else if (state.userProfile) {
            userPromptInfo = `\n用户(我)的网名：${state.userProfile.name}`;
        }

        // 获取记忆上下文
        let memoryContext = '';
        if (contact.memorySendLimit && contact.memorySendLimit > 0) {
            const contactMemories = state.memories.filter(m => m.contactId === contact.id);
            if (contactMemories.length > 0) {
                const recentMemories = contactMemories.sort((a, b) => b.time - a.time).slice(0, contact.memorySendLimit);
                recentMemories.reverse();
                memoryContext += '\n【重要记忆】\n';
                recentMemories.forEach(m => {
                    memoryContext += `- ${m.content}\n`;
                });
            }
        }

        // 获取世界书内容
        let worldbookContext = '';
        if (state.worldbook && state.worldbook.length > 0) {
            let activeEntries = state.worldbook.filter(e => e.enabled);
            if (contact.linkedWbCategories) {
                activeEntries = activeEntries.filter(e => contact.linkedWbCategories.includes(e.categoryId));
            }
            if (activeEntries.length > 0) {
                worldbookContext += '\n\n世界书信息：\n';
                activeEntries.forEach(entry => {
                    let shouldAdd = false;
                    if (entry.keys && entry.keys.length > 0) {
                        const historyText = history.map(h => h.content).join('\n');
                        const match = entry.keys.some(key => historyText.includes(key));
                        if (match) shouldAdd = true;
                    } else {
                        shouldAdd = true;
                    }
                    if (shouldAdd) {
                        worldbookContext += `${entry.content}\n`;
                    }
                });
            }
        }

        // 处理上下文限制
        // 默认限制为最近 20 条（语音通话不需要太长历史）
        let limit = contact.contextLimit && contact.contextLimit > 0 ? contact.contextLimit : 20;
        let contextMessages = history.slice(-limit);

        // 构建 Prompt
        let systemPrompt = `你现在扮演 ${contact.name}，正在与用户进行【语音通话】。
人设：${contact.persona || '无'}
${userPromptInfo}
${memoryContext}
${worldbookContext}

【重要规则】
1. 你们正在打电话，请使用自然的口语交流。
2. **绝对不要**包含任何动作描写（如 *点头*、*叹气*、*笑了* 等）。
3. **绝对不要**包含剧本格式（如 "我："、"用户："）。
4. 回复必须是**一整段**话，不要分段，不要分条。
5. 语气要自然、流畅，像真实的人在打电话。
6. 不要输出任何指令（如 ACTION: ...），除非你想挂断电话。
7. 如果你想挂断电话，请在回复的最后另起一行输出：ACTION: HANGUP_CALL
8. 仅仅输出你要说的话（和可能的挂断指令）。

请回复对方。`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...contextMessages.map(h => {
                // 过滤掉非文本内容，或者做简单转换
                let content = h.content;
                try {
                    // 尝试解析 JSON (如果是之前的 voice_call_text)
                    const data = JSON.parse(content);
                    if (data.text) content = data.text;
                } catch(e) {}

                if (h.type === 'image') content = '[图片]';
                else if (h.type === 'sticker') content = '[表情包]';
                else if (h.type === 'voice') content = '[语音]';
                
                return { role: h.role, content: content };
            })
        ];

        try {
            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: messages,
                    temperature: settings.temperature
                })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            let replyContent = data.choices[0].message.content.trim();

            // 移除思维链
            replyContent = replyContent.replace(/<thinking>[\s\S]*?<\/thinking>/g, '')
                                       .replace(/<think>[\s\S]*?<\/think>/g, '')
                                       .trim();

            // 1. 先检查并移除挂断指令，确保 TTS 不会读出来
            let shouldHangup = false;
            if (replyContent.includes('ACTION: HANGUP_CALL')) {
                shouldHangup = true;
                replyContent = replyContent.replace('ACTION: HANGUP_CALL', '').trim();
            }

            // 2. 生成语音 (使用清理后的文本)
            let audioData = null;
            // 检查扬声器状态
            const speakerBtn = document.getElementById('voice-call-speaker-btn');
            const isSpeakerOn = speakerBtn && speakerBtn.classList.contains('active');

            if (isSpeakerOn && replyContent) {
                statusEl.textContent = '正在生成语音...';
                audioData = await generateMinimaxTTS(replyContent, contact.ttsVoiceId);
            }

            // 3. 发送消息
            const msgPayload = {
                text: replyContent,
                audio: audioData
            };
            
            sendMessage(JSON.stringify(msgPayload), false, 'voice_call_text');

            // 4. 如果 AI 决定挂断
            if (shouldHangup) {
                // 估算语音时长，如果没有音频则给个默认值
                // 简单估算：中文每秒 3-4 字
                const delay = audioData ? (replyContent.length * 300 + 1000) : 2000;
                
                setTimeout(() => {
                    // 调用统一的关闭函数，传入 'ai' 表示 AI 挂断
                    closeVoiceCallScreen('ai');
                }, delay); 
            }

        } catch (error) {
            console.error('语音通话AI生成失败:', error);
            addVoiceCallMessage('[生成失败]', 'ai');
        } finally {
            statusEl.textContent = originalStatus;
        }
    }

    // --- 见面功能逻辑 ---
    // ============================================================
    // 见面功能核心逻辑 (Meeting System)
    // ============================================================

    // 1. 打开见面列表页
    function openMeetingsScreen(contactId) {
        if (!contactId) return;
        
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return;

        // 隐藏资料卡，显示见面列表
        document.getElementById('ai-profile-screen').classList.add('hidden');
        document.getElementById('meetings-screen').classList.remove('hidden');
        
        renderMeetingsList(contactId);
    }

    // 2. 渲染见面列表
        // [修改版] 渲染见面列表（带删除功能）
    function renderMeetingsList(contactId) {
        const list = document.getElementById('meetings-list');
        const emptyState = document.getElementById('meetings-empty');
        if (!list) return;

        list.innerHTML = '';
        
        if (!state.meetings) state.meetings = {};
        if (!state.meetings[contactId]) state.meetings[contactId] = [];

        const meetings = state.meetings[contactId];

        // 处理空状态
        if (meetings.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';

        // 倒序排列渲染
        [...meetings].reverse().forEach(meeting => {
            const item = document.createElement('div');
            item.className = 'meeting-item';
            
            const date = new Date(meeting.time);
            const timeStr = `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            // 获取摘要
            let summary = '暂无内容';
            if (meeting.content && meeting.content.length > 0) {
                const lastContent = meeting.content[meeting.content.length - 1];
                summary = lastContent.text.substring(0, 20) + (lastContent.text.length > 20 ? '...' : '');
            }

            // HTML 结构：包含一个删除图标
            item.innerHTML = `
                <div class="meeting-item-content" style="width: 100%;">
                    <div class="meeting-item-header">
                        <span style="font-weight:600; color:#000;">${meeting.title || '未命名见面'}</span>
                        <span style="font-size: 12px; color: #999;">${timeStr}</span>
                    </div>
                    <div class="meeting-item-summary" style="color: #666; font-size: 13px; margin-top: 4px;">${summary}</div>
                </div>
                <div class="meeting-delete-btn" title="删除记录">
                    <i class="fas fa-trash-alt"></i>
                </div>
            `;
            
            // 绑定点击跳转事件 (点击整个卡片)
            item.addEventListener('click', () => openMeetingDetail(meeting.id));

            // 绑定删除事件 (只点击垃圾桶)
            const deleteBtn = item.querySelector('.meeting-delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止冒泡，防止触发卡片点击
                deleteMeeting(contactId, meeting.id);
            });

            list.appendChild(item);
        });
    }

    // [新增] 删除单条见面记录
    function deleteMeeting(contactId, meetingId) {
        if (!confirm('确定要彻底删除这条见面记录吗？删除后无法恢复。')) return;

        const meetings = state.meetings[contactId];
        // 过滤掉要删除的这条
        state.meetings[contactId] = meetings.filter(m => m.id !== meetingId);
        
        saveConfig(); // 保存到本地存储
        renderMeetingsList(contactId); // 重新渲染列表
    }


    // 3. 新建见面
    function createNewMeeting() {
        if (!state.currentChatContactId) return;
        
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        const newId = Date.now();
        
        // 获取当前已有见面次数，生成标题
        const count = (state.meetings[state.currentChatContactId]?.length || 0) + 1;
        
        const newMeeting = {
            id: newId,
            time: Date.now(),
            title: `第 ${count} 次见面`,
            content: [], // 结构: { role: 'user'|'ai', text: '...' }
            style: contact.meetingStyle || '正常',
            isFinished: false
        };

        if (!state.meetings[state.currentChatContactId]) state.meetings[state.currentChatContactId] = [];
        state.meetings[state.currentChatContactId].push(newMeeting);
        
        saveConfig();
        
        // 直接进入详情页
        openMeetingDetail(newId);
    }

    // 4. 进入详情页
    function openMeetingDetail(meetingId) {
        state.currentMeetingId = meetingId;
        const meetings = state.meetings[state.currentChatContactId];
        const meeting = meetings.find(m => m.id === meetingId);
        
        if (!meeting) return;

        document.getElementById('meeting-detail-title').textContent = meeting.title;
        document.getElementById('meeting-detail-screen').classList.remove('hidden');
        
        renderMeetingCards(meeting);
    }

    // 5. 渲染详情页卡片流
    function renderMeetingCards(meeting) {
        const container = document.getElementById('meeting-card-container');
        container.innerHTML = '';
        
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        
        // 获取图标 URL，如果 state 中没有则使用默认值
        const editIconUrl = (state.meetingIcons && state.meetingIcons.edit) ? state.meetingIcons.edit : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTExIDRINFYyMmgxNFYxMSIvPjxwYXRoIGQ9Ik0xOC41IDIuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMMTIgMTVIOHYtNGw5LjUtOS41eiIvPjwvc3ZnPg==';
        const deleteIconUrl = (state.meetingIcons && state.meetingIcons.delete) ? state.meetingIcons.delete : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkYzQjMwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMyA2IDUgNiAyMSA2Ii8+PHBhdGggZD0iTTE5IDZ2MTRhMiAyIDAgMCAxLTIgMkg3YTIgMiAwIDAgMS0yLTJWNm0zIDBUNGEyIDIgMCAwIDEgMi0yaDRhMiAyIDAgMCAxIDIgMnYyIi8+PGxpbmUgeDE9IjEwIiB5MT0iMTEiIHgyPSIxMCIgeTI9IjE3Ii8+PGxpbmUgeDE9IjE0IiB5MT0iMTEiIHgyPSIxNCIgeTI9IjE3Ii8+PC9zdmc+';

        meeting.content.forEach((msg, index) => {
            const card = document.createElement('div');
            card.className = 'meeting-card';
            
            let avatar = '';
            let name = '';
            let roleClass = '';
            
            if (msg.role === 'user') {
                avatar = state.userProfile.avatar;
                name = '我';
                roleClass = 'meeting-card-role-user';
            } else {
                avatar = contact.avatar;
                name = contact.name; // 使用 AI 人设名
                roleClass = 'meeting-card-role-ai';
            }

            card.innerHTML = `
                <div class="meeting-card-header">
                    <img src="${avatar}" class="meeting-card-avatar">
                    <span class="meeting-card-name ${roleClass}">${name}</span>
                </div>
                <div class="meeting-card-content">${msg.text}</div>
                <div class="meeting-card-actions">
                    <img src="${editIconUrl}" class="meeting-action-icon" onclick="window.editMeetingMsg(${index})" title="编辑">
                    <img src="${deleteIconUrl}" class="meeting-action-icon danger" onclick="window.deleteMeetingMsg(${index})" title="删除">
                </div>
            `;
            container.appendChild(card);
        });
        
        // 自动滚动到底部
        container.scrollTop = container.scrollHeight;
    }

    // 6. 发送剧情文本
    function handleSendMeetingText() {
        const input = document.getElementById('meeting-input');
        const text = input.value.trim();
        
        if (!text) return;
        if (!state.currentMeetingId || !state.currentChatContactId) return;

        const meetings = state.meetings[state.currentChatContactId];
        const meeting = meetings.find(m => m.id === state.currentMeetingId);
        
        if (meeting) {
            meeting.content.push({
                role: 'user',
                text: text
            });
            saveConfig();
            renderMeetingCards(meeting);
            
            // 重置输入框
            input.value = '';
            input.style.height = 'auto'; 
        }
    }

    // 7. 保存文风
    function saveMeetingStyle() {
        const style = document.getElementById('meeting-style-input').value.trim();
        const minWords = document.getElementById('meeting-min-words').value;
        const maxWords = document.getElementById('meeting-max-words').value;

        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        if (contact) {
            contact.meetingStyle = style;
            contact.meetingMinWords = minWords;
            contact.meetingMaxWords = maxWords;
            saveConfig();
            document.getElementById('meeting-style-modal').classList.add('hidden');
            // 可以加个 Toast 提示
            // showChatToast('文风已保存');
        }
    }

    // 8. 结束见面
    function endMeeting() {
        if (!confirm('确定结束这次见面吗？这将保存当前进度并返回见面列表。')) return;
        
        const contactId = state.currentChatContactId;
        const meetingId = state.currentMeetingId;
        const meetings = state.meetings[contactId];
        const meeting = meetings.find(m => m.id === meetingId);

        document.getElementById('meeting-detail-screen').classList.add('hidden');
        // document.getElementById('meetings-screen').classList.add('hidden'); // 不隐藏列表页
        
        state.currentMeetingId = null;
        renderMeetingsList(contactId); // 刷新列表

        // 询问是否总结见面剧情
        if (meeting && meeting.content && meeting.content.length > 0) {
            if (confirm('是否要对本次见面剧情进行总结生成回忆？')) {
                showNotification('正在总结见面剧情...');
                generateMeetingSummary(contactId, meeting);
            }
        }
    }

    async function generateMeetingSummary(contactId, meeting) {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) {
            showNotification('联系人不存在', 2000, 'error');
            return;
        }

        const settings = state.aiSettings2.url ? state.aiSettings2 : state.aiSettings; // 优先使用副API
        if (!settings.url || !settings.key) {
            console.log('未配置API，无法自动总结见面');
            showNotification('未配置API', 2000, 'error');
            return;
        }

        // 提取剧情文本
        const storyText = meeting.content.map(m => {
            const role = m.role === 'user' ? '用户' : contact.name;
            return `${role}: ${m.text}`;
        }).join('\n');

        if (!storyText) {
            showNotification('见面内容为空', 2000);
            return;
        }

        const systemPrompt = `你是一个小说剧情总结助手。
请阅读以下一段角色扮演的剧情对话，并生成一段简练的剧情摘要。
摘要应该是陈述句，概括发生了什么主要事件。
不要包含“剧情显示”、“用户说”等前缀，直接陈述事实。
请将摘要控制在 100 字以内。`;

        try {
            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: storyText }
                    ],
                    temperature: 0.5
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            let summary = data.choices[0].message.content.trim();
            
            if (summary) {
                // 添加到记忆
                state.memories.push({
                    id: Date.now(),
                    contactId: contact.id,
                    content: `【见面回忆】(${meeting.title}) ${summary}`,
                    time: Date.now(),
                    range: '见面剧情'
                });
                saveConfig();
                
                console.log('见面剧情总结完成:', summary);
                showNotification('见面总结完成', 2000, 'success');
            } else {
                showNotification('未生成有效总结', 2000);
            }

        } catch (error) {
            console.error('见面总结失败:', error);
            showNotification('总结出错', 2000, 'error');
        }
    }

    // 9. 全局工具函数：编辑和删除剧情
    window.deleteMeetingMsg = function(index) {
        if (!confirm('确定删除这段剧情？')) return;
        if (!state.currentChatContactId || !state.currentMeetingId) return;

        const meeting = state.meetings[state.currentChatContactId].find(m => m.id === state.currentMeetingId);
        if (meeting) {
            meeting.content.splice(index, 1);
            saveConfig();
            renderMeetingCards(meeting);
        }
    }

    let currentEditingMeetingMsgIndex = null;

    window.editMeetingMsg = function(index) {
        if (!state.currentChatContactId || !state.currentMeetingId) return;

        const meeting = state.meetings[state.currentChatContactId].find(m => m.id === state.currentMeetingId);
        if (meeting) {
            currentEditingMeetingMsgIndex = index;
            const content = meeting.content[index].text;
            document.getElementById('edit-meeting-msg-content').value = content;
            document.getElementById('edit-meeting-msg-modal').classList.remove('hidden');
        }
    }

    // 绑定编辑弹窗事件
    const closeEditMeetingMsgBtn = document.getElementById('close-edit-meeting-msg');
    const saveEditMeetingMsgBtn = document.getElementById('save-edit-meeting-msg-btn');

    if (closeEditMeetingMsgBtn) {
        // 移除旧监听器
        const newCloseBtn = closeEditMeetingMsgBtn.cloneNode(true);
        closeEditMeetingMsgBtn.parentNode.replaceChild(newCloseBtn, closeEditMeetingMsgBtn);
        
        newCloseBtn.addEventListener('click', () => {
            document.getElementById('edit-meeting-msg-modal').classList.add('hidden');
            currentEditingMeetingMsgIndex = null;
        });
    }

    if (saveEditMeetingMsgBtn) {
        // 移除旧监听器
        const newSaveBtn = saveEditMeetingMsgBtn.cloneNode(true);
        saveEditMeetingMsgBtn.parentNode.replaceChild(newSaveBtn, saveEditMeetingMsgBtn);

        newSaveBtn.addEventListener('click', () => {
            if (currentEditingMeetingMsgIndex === null || !state.currentChatContactId || !state.currentMeetingId) return;

            const newText = document.getElementById('edit-meeting-msg-content').value.trim();
            if (!newText) {
                alert('内容不能为空');
                return;
            }

            const meeting = state.meetings[state.currentChatContactId].find(m => m.id === state.currentMeetingId);
            if (meeting) {
                meeting.content[currentEditingMeetingMsgIndex].text = newText;
                saveConfig();
                renderMeetingCards(meeting);
                document.getElementById('edit-meeting-msg-modal').classList.add('hidden');
                currentEditingMeetingMsgIndex = null;
            }
        });
    }

    // ============================================================
    // 见面功能核心逻辑 (确保这段代码在 script.js 底部)
    // ============================================================

    window.openMeetingsScreen = function(contactId) {
        if (!contactId) {
            console.error("未指定联系人ID");
            return;
        }
        
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return;

        console.log("正在打开见面列表，联系人:", contact.name);

        // 1. 隐藏资料卡
        const profileScreen = document.getElementById('ai-profile-screen');
        if (profileScreen) profileScreen.classList.add('hidden');

        // 2. 显示见面列表页
        const meetingsScreen = document.getElementById('meetings-screen');
        if (meetingsScreen) {
            meetingsScreen.classList.remove('hidden');
            renderMeetingsList(contactId);
        } else {
            alert("错误：HTML中缺少 id='meetings-screen' 元素");
        }
    };

    // ... (确保 renderMeetingsList 等其他函数也在下面) ...
    // ==========================================
    // [第四步核心] AI 剧情生成逻辑 (含回车支持)
    // ==========================================

    // 1. 监听回车键 (放在这里或者 setupEventListeners 里都可以)
    // 确保输入框存在时才绑定
    const meetingInputEl = document.getElementById('meeting-input');
    if (meetingInputEl) {
        // 移除旧的以防重复 (cloneNode法在这里不太好用因为是 textarea，直接用 addEventListener)
        // 简单处理：每次渲染详情页时其实应该绑定一次，但这里我们先放全局试试
        meetingInputEl.addEventListener('keydown', function(e) {
            // 如果按下了 Enter 且没有按 Shift (允许 Shift+Enter 换行)
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // 阻止默认的换行行为
                handleSendMeetingText(); // 触发发送
            }
        });
    }

    /**
     * 2. 构造见面模式的专用 Prompt
     */
    function constructMeetingPrompt(contactId, newUserInput) {
        const contact = state.contacts.find(c => c.id === contactId);
        const meetingId = state.currentMeetingId;
        const meetings = state.meetings[contactId];
        const currentMeeting = meetings.find(m => m.id === meetingId);
        
        // 获取线上聊天上下文
        let chatContext = '';
        const chatHistory = state.chatHistory[contactId] || [];
        if (chatHistory.length > 0) {
            // 取最近 15 条聊天记录
            const recentChats = chatHistory.slice(-15);
            chatContext = recentChats.map(msg => {
                const role = msg.role === 'user' ? '用户' : contact.name;
                let content = msg.content;
                if (msg.type === 'image') content = '[图片]';
                else if (msg.type === 'sticker') content = '[表情包]';
                return `${role}: ${content}`;
            }).join('\n');
        }

        // 基础设定
        let prompt = `你现在是一个小说家，正在进行一场角色扮演描写。\n`;
        prompt += `角色：${contact.name}。\n`;
        prompt += `人设：${contact.persona || '无特定人设'}。\n`; // 修正：使用 persona 字段
        prompt += `当前场景/文风/地点：${currentMeeting.style || '默认场景'}。\n\n`;
        
        if (chatContext) {
            prompt += `【线上聊天背景】(你们之前的聊天记录，供参考)\n${chatContext}\n\n`;
        }

        prompt += `【规则】\n`;
        prompt += `1. 请以第三人称视角描写，重点描写${contact.name}的神态、动作、语言以及环境氛围。\n`;
        prompt += `2. 不要出现"用户："或"AI："这样的剧本格式，直接写正文。\n`;
        prompt += `3. 沉浸在场景中，不要跳出人设。\n\n`;
        
        prompt += `【剧情回顾】\n`;
        
        // 拼接历史记录 (最近 10 条)
        const recentContent = currentMeeting.content.slice(-10);
        recentContent.forEach(card => {
            if (card.role === 'user') {
                prompt += `(用户动作/语言): ${card.text}\n`;
            } else {
                prompt += `(剧情发展): ${card.text}\n`;
            }
        });

        if (newUserInput) {
            prompt += `(用户动作/语言): ${newUserInput}\n`;
        }

        // 添加字数要求
        let lengthInstruction = "";
        if (contact.meetingMinWords || contact.meetingMaxWords) {
            const min = contact.meetingMinWords || '50'; // 默认给个下限
            const max = contact.meetingMaxWords || '不限';
            lengthInstruction = `\n【重要限制】\n请务必将回复字数严格控制在 ${min} 到 ${max} 字之间。不要过短也不要过长。\n`;
        }
        
        prompt += `\n请根据以上内容，续写接下来的剧情（描写${contact.name}的反应）。`;
        prompt += lengthInstruction; // 将字数限制放在最后，增强权重
        
        return prompt;
    }

    /**
     * 3. 执行 AI 请求并流式输出
     */
    async function handleMeetingAI(type) {
        const inputEl = document.getElementById('meeting-input');
        const userInput = inputEl.value.trim();
        const contactId = state.currentChatContactId;
        const meetingId = state.currentMeetingId;
        const container = document.getElementById('meeting-card-container');

        if (type === 'user' && !userInput) return;

        const meetings = state.meetings[contactId];
        const meeting = meetings.find(m => m.id === meetingId);
        if (!meeting) return;

        // 1. 用户发送上屏 (如果是用户触发)
        if (type === 'user') {
            meeting.content.push({
                role: 'user',
                text: userInput
            });
            saveConfig();
            renderMeetingCards(meeting); // 重绘显示用户消息
            inputEl.value = ''; 
            inputEl.style.height = 'auto';
        }

        // 2. UI 准备：添加一个临时的 AI 卡片
        const aiCard = document.createElement('div');
        aiCard.className = 'meeting-card';
        // 获取 AI 头像和名字
        const contact = state.contacts.find(c => c.id === contactId);
        const avatar = contact.avatar;
        const name = contact.name;
        
        aiCard.innerHTML = `
            <div class="meeting-card-header">
                <img src="${avatar}" class="meeting-card-avatar">
                <span class="meeting-card-name meeting-card-role-ai">${name}</span>
            </div>
            <div class="meeting-card-content loading-dots">...</div>
            <div class="meeting-card-actions">
                <!-- 占位，生成完再显示操作按钮 -->
            </div>
        `;
        container.appendChild(aiCard);
        
        // 滚动到底部
        container.scrollTop = container.scrollHeight;

        // 锁定按钮
        const continueBtn = document.getElementById('meeting-ai-continue-btn');
        if(continueBtn) continueBtn.disabled = true;
        inputEl.disabled = true; 

        try {
            const settings = state.aiSettings.url ? state.aiSettings : state.aiSettings2;
            if (!settings.url || !settings.key) {
                throw new Error("请先在设置中配置 AI API");
            }

            const fullPrompt = constructMeetingPrompt(contactId, type === 'user' ? userInput : null);
            
            let fetchUrl = settings.url;
            if (!fetchUrl.endsWith('/chat/completions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'chat/completions' : fetchUrl + '/chat/completions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.key}`
                },
                body: JSON.stringify({
                    model: settings.model,
                    messages: [
                        { role: 'user', content: fullPrompt }
                    ],
                    temperature: 0.7,
                    stream: false
                })
            });

            if (!response.ok) throw new Error(response.statusText);

            const data = await response.json();
            const finalTezt = data.choices[0].message.content.trim();
            
            const contentEl = aiCard.querySelector('.meeting-card-content');
            
            // 移除 loading 样式并显示内容
            contentEl.classList.remove('loading-dots');
            contentEl.innerText = finalTezt;
            
            // 保存
            meeting.content.push({
                role: 'ai',
                text: finalTezt
            });
            saveConfig();
            
            // 重新渲染以确保状态一致（添加操作按钮等）
            renderMeetingCards(meeting); 

        } catch (error) {
            console.error(error);
            const contentEl = aiCard.querySelector('.meeting-card-content');
            contentEl.classList.remove('loading-dots');
            contentEl.innerHTML = `<span style="color:red">生成失败: ${error.message}</span>`;
        } finally {
            if(continueBtn) continueBtn.disabled = false;
            inputEl.disabled = false;
            inputEl.focus(); 
        }
    }
// ==========================================
// [终极修复] 全局监听回车键 (放在文件最末尾)
// ==========================================
document.body.addEventListener('keydown', function(e) {
    // 1. 检查当前按键的目标是不是我们的输入框
    if (e.target && e.target.id === 'meeting-input') {
        
        // 2. 检查是不是 Enter 键 (且没有按 Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 阻止换行
            
            console.log("捕捉到回车键，准备发送..."); // 用于调试

            // 3. 触发发送逻辑
            if (typeof handleSendMeetingText === 'function') {
                handleSendMeetingText();
            } else {
                alert("错误：找不到 handleSendMeetingText 函数，请检查代码是否完整。");
            }
        }
    }
});
// ================= 见面字体隔离专用函数 =================

// 1. 应用见面字体 (只修改 --meeting-font-family)
function applyMeetingFont(fontName) {
    if (fontName === 'default') {
        document.documentElement.style.setProperty('--meeting-font-family', 'var(--font-family)');
    } else {
        const font = state.fonts.find(f => f.name === fontName);
        if (font) {
            // 如果是网络字体，确保样式标签存在
            if (font.type === 'url' && !document.getElementById(`style-${font.name}`)) {
                const style = document.createElement('style');
                style.id = `style-${font.name}`;
                style.textContent = `@font-face { font-family: '${font.name}'; src: url('${font.source}'); }`;
                document.head.appendChild(style);
            }
            // 关键：只修改见面变量
            document.documentElement.style.setProperty('--meeting-font-family', fontName);
        }
    }
}

// 2. 处理见面字体上传 (不调用 addFontToState，避免修改全局)
function handleMeetingFontUploadAction(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const fontName = `MeetingFont_${Date.now()}`;
        const fontFace = new FontFace(fontName, `url(${event.target.result})`);
        
        fontFace.load().then((loadedFace) => {
            document.fonts.add(loadedFace);
            
            // 存入字体列表（为了能被保存），但不切换全局当前字体
            state.fonts.push({ name: fontName, source: event.target.result, type: 'local' });
            
            // 仅切换见面字体
            state.currentMeetingFont = fontName;
            applyMeetingFont(fontName);
            saveConfig();
            
            alert('字体已应用到见面详情页');
        }).catch(err => {
            console.error('字体加载失败:', err);
            alert('字体文件无效');
        });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

// 3. 处理见面预设选择
function handleApplyMeetingFontPreset(e) {
    const name = e.target.value;
    if (!name) return;
    
    const preset = state.fontPresets.find(p => p.name === name);
    if (preset) {
        state.currentMeetingFont = preset.font;
        applyMeetingFont(preset.font);
        saveConfig();
    }
}

// 4. 重置见面字体
function resetMeetingFontAction() {
    state.currentMeetingFont = 'default';
    applyMeetingFont('default');
    saveConfig();
    alert('见面字体已重置为跟随系统');
}

    // 全局变量用于跟踪播放状态
    let currentVoiceAudio = null;
    let currentVoiceMsgId = null;
    let currentVoiceIcon = null;

    // 语音通话 VAD 功能实现
    async function startVoiceCallVAD() {
        if (voiceCallIsRecording) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            voiceCallStream = stream; // 保存流引用
            voiceCallAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            voiceCallAnalyser = voiceCallAudioContext.createAnalyser();
            voiceCallMicrophone = voiceCallAudioContext.createMediaStreamSource(stream);
            voiceCallScriptProcessor = voiceCallAudioContext.createScriptProcessor(2048, 1, 1);

            voiceCallAnalyser.fftSize = 512;
            voiceCallMicrophone.connect(voiceCallAnalyser);
            voiceCallAnalyser.connect(voiceCallScriptProcessor);
            voiceCallScriptProcessor.connect(voiceCallAudioContext.destination);

            voiceCallMediaRecorder = new MediaRecorder(stream);
            voiceCallChunks = [];

            voiceCallMediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    voiceCallChunks.push(e.data);
                }
            };

            voiceCallMediaRecorder.onstop = async () => {
                if (voiceCallChunks.length > 0) {
                    const audioBlob = new Blob(voiceCallChunks, { type: 'audio/webm' });
                    await processVoiceCallAudio(audioBlob);
                    voiceCallChunks = [];
                }
            };

            voiceCallIsSpeaking = false;
            voiceCallSilenceStart = Date.now();
            voiceCallIsRecording = true;

            // VAD 参数
            const VAD_THRESHOLD = 15; // 音量阈值 (0-255)
            const SILENCE_DURATION = 1500; // 静音持续时间 (ms) 触发发送

            voiceCallScriptProcessor.onaudioprocess = (event) => {
                const array = new Uint8Array(voiceCallAnalyser.frequencyBinCount);
                voiceCallAnalyser.getByteFrequencyData(array);
                let values = 0;
                const length = array.length;
                for (let i = 0; i < length; i++) {
                    values += array[i];
                }
                const average = values / length;

                // 更新状态显示
                const statusEl = document.getElementById('voice-call-status');
                
                if (average > VAD_THRESHOLD) {
                    // 检测到声音
                    if (!voiceCallIsSpeaking) {
                        console.log('VAD: Speaking started');
                        voiceCallIsSpeaking = true;
                        if (voiceCallMediaRecorder.state === 'inactive') {
                            voiceCallMediaRecorder.start();
                            if (statusEl) statusEl.textContent = '正在聆听...';
                        }
                    }
                    voiceCallSilenceStart = Date.now(); // 重置静音计时
                } else {
                    // 静音
                    if (voiceCallIsSpeaking) {
                        const silenceDuration = Date.now() - voiceCallSilenceStart;
                        if (silenceDuration > SILENCE_DURATION) {
                            console.log('VAD: Speaking ended');
                            voiceCallIsSpeaking = false;
                            if (voiceCallMediaRecorder.state === 'recording') {
                                voiceCallMediaRecorder.stop();
                                if (statusEl) statusEl.textContent = '正在处理...';
                            }
                        }
                    }
                }
            };

            console.log('Voice Call VAD started');

        } catch (error) {
            console.error('Failed to start VAD:', error);
            alert('无法启动语音检测，请检查麦克风权限');
            stopVoiceCallVAD();
        }
    }

    function stopVoiceCallVAD() {
        if (!voiceCallIsRecording) return;

        if (voiceCallMediaRecorder && voiceCallMediaRecorder.state !== 'inactive') {
            voiceCallMediaRecorder.stop();
        }
        
        // 停止所有麦克风轨道
        if (voiceCallStream) {
            voiceCallStream.getTracks().forEach(track => track.stop());
            voiceCallStream = null;
        }
        
        if (voiceCallMicrophone) voiceCallMicrophone.disconnect();
        if (voiceCallAnalyser) voiceCallAnalyser.disconnect();
        if (voiceCallScriptProcessor) {
            voiceCallScriptProcessor.disconnect();
            voiceCallScriptProcessor.onaudioprocess = null;
        }
        if (voiceCallAudioContext) voiceCallAudioContext.close();

        voiceCallIsRecording = false;
        voiceCallIsSpeaking = false;
        voiceCallChunks = [];
        
        // 更新 UI
        const micBtn = document.getElementById('voice-call-mic-btn');
        if (micBtn) {
            micBtn.classList.remove('active');
            const span = micBtn.nextElementSibling;
            if (span) span.textContent = '麦克风已关';
        }
        
        const statusEl = document.getElementById('voice-call-status');
        if (statusEl) statusEl.textContent = '通话中';

        console.log('Voice Call VAD stopped');
    }

    async function processVoiceCallAudio(audioBlob) {
        if (!state.whisperSettings.url || !state.whisperSettings.key) {
            console.warn('Whisper API not configured');
            return;
        }

        const statusEl = document.getElementById('voice-call-status');
        if (statusEl) statusEl.textContent = '正在转文字...';

        try {
            const audioFile = new File([audioBlob], "voice_call.webm", { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('file', audioFile);
            formData.append('model', state.whisperSettings.model || 'whisper-1');

            let fetchUrl = state.whisperSettings.url;
            if (!fetchUrl.endsWith('/audio/transcriptions')) {
                fetchUrl = fetchUrl.endsWith('/') ? fetchUrl + 'audio/transcriptions' : fetchUrl + '/audio/transcriptions';
            }

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.whisperSettings.key}`
                },
                body: formData
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            const text = data.text ? data.text.trim() : '';

            if (text) {
                console.log('VAD Recognized:', text);
                // 发送识别出的文本
                sendMessage(text, true, 'voice_call_text');
                // 触发 AI 回复
                generateVoiceCallAiReply();
            } else {
                console.log('VAD: No text recognized');
            }

        } catch (error) {
            console.error('Voice Call STT Error:', error);
        } finally {
            if (statusEl) statusEl.textContent = '正在聆听...'; // 恢复聆听状态
        }
    }

    // 5. 播放语音消息 (全局函数)
    window.playVoiceMsg = async function(msgId, textElId, event) {
        if (event) event.stopPropagation();

        const btn = event.currentTarget;
        const icon = btn.querySelector('i');

        // 防止重复点击同一条正在播放的消息
        if (currentVoiceMsgId === msgId && currentVoiceAudio && !currentVoiceAudio.paused) {
            return;
        }

        // 防止在加载时重复点击
        if (icon && icon.classList.contains('fa-spinner')) {
            return;
        }

        // 如果有其他消息正在播放，停止它
        if (currentVoiceAudio) {
            currentVoiceAudio.pause();
            currentVoiceAudio = null;
            currentVoiceMsgId = null;
            if (currentVoiceIcon) {
                currentVoiceIcon.className = 'fas fa-rss'; // 重置旧图标
                currentVoiceIcon = null;
            }
        }
        
        const textEl = document.getElementById(textElId);
        if (textEl) textEl.classList.remove('hidden');

        // 查找消息
        let targetMsg = null;
        if (state.currentChatContactId && state.chatHistory[state.currentChatContactId]) {
            targetMsg = state.chatHistory[state.currentChatContactId].find(m => m.id == msgId);
        }

        if (!targetMsg) {
            console.error('Message not found:', msgId);
            return;
        }

        let msgData = null;
        try {
            msgData = typeof targetMsg.content === 'string' ? JSON.parse(targetMsg.content) : targetMsg.content;
        } catch (e) {
            console.error('Parse error', e);
            return;
        }

        // 如果没有音频数据，尝试生成
        if (!msgData.audio && !msgData.isReal) {
            // 获取联系人配置
            const contact = state.contacts.find(c => c.id === state.currentChatContactId);
            if (!contact || !contact.ttsEnabled) {
                alert('无法播放：未启用TTS或联系人不存在');
                return;
            }

            // 显示加载状态
            if (icon) {
                icon.className = 'fas fa-spinner fa-spin'; // 临时改为加载图标
            }

            try {
                const audioData = await generateMinimaxTTS(msgData.text, contact.ttsVoiceId);
                if (audioData) {
                    msgData.audio = audioData;
                    // 更新消息内容
                    targetMsg.content = JSON.stringify(msgData);
                    saveConfig();
                } else {
                    alert('语音生成失败，请检查API配置');
                    if (icon) icon.className = 'fas fa-rss'; // 恢复图标
                    return;
                }
            } catch (e) {
                console.error('TTS generation error:', e);
                alert('语音生成出错');
                if (icon) icon.className = 'fas fa-rss';
                return;
            }
        }

        // 播放音频
        if (msgData.audio) {
            const audio = new Audio(msgData.audio);
            currentVoiceAudio = audio;
            currentVoiceMsgId = msgId;
            
            if (icon) {
                icon.className = 'fas fa-rss voice-playing-anim'; // 确保包含动画类
                currentVoiceIcon = icon;
            }
            
            audio.onended = () => {
                if (icon) {
                    icon.className = 'fas fa-rss'; // 移除动画
                }
                // 清除全局状态
                if (currentVoiceMsgId === msgId) {
                    currentVoiceAudio = null;
                    currentVoiceMsgId = null;
                    currentVoiceIcon = null;
                }
            };
            
            audio.onerror = (e) => {
                console.error('Audio play error', e);
                if (icon) icon.className = 'fas fa-rss';
                alert('播放失败：音频数据可能已损坏或格式不支持');
                // 清除全局状态
                if (currentVoiceMsgId === msgId) {
                    currentVoiceAudio = null;
                    currentVoiceMsgId = null;
                    currentVoiceIcon = null;
                }
            };
            
            audio.play().catch(err => {
                console.error('Play error:', err);
                if (icon) icon.className = 'fas fa-rss';
                alert('播放错误：' + err.message);
                // 清除全局状态
                if (currentVoiceMsgId === msgId) {
                    currentVoiceAudio = null;
                    currentVoiceMsgId = null;
                    currentVoiceIcon = null;
                }
            });
        } else {
            if (icon) icon.className = 'fas fa-rss';
            alert('该消息没有音频数据。');
        }
    };

});
