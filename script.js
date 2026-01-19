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
        currentWallpaper: null,
        fontPresets: [],
        cssPresets: [],
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
        contacts: [], // { id, name, remark, avatar, persona, style, myAvatar, chatBg }
        currentChatContactId: null,
        chatHistory: {}, // { contactId: [{ role: 'user'|'assistant', content: '...' }] }
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
        stickerCategories: [], // { id, name, list: [{ url, desc }] }
        currentStickerCategoryId: null,
        isStickerManageMode: false,
        selectedStickers: new Set(), // 存储选中的表情包标识 (catId-index)
        replyingToMsg: null // 当前正在引用的消息 { content, name, type }
    };

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

    const walletScreen = document.getElementById('wallet-screen');
    const closeWalletBtn = document.getElementById('close-wallet-screen');
    const walletRechargeModal = document.getElementById('wallet-recharge-modal');
    const closeWalletRechargeBtn = document.getElementById('close-recharge-modal');

    const worldbookDetailScreen = document.getElementById('worldbook-detail-screen');
    const backToWorldbookListBtn = document.getElementById('back-to-worldbook-list');
    
    const screenContainer = document.getElementById('screen-container');

    // 应用列表配置
    const appList = [
        { id: 'icon-envelope', name: '信息', selector: '.icon-envelope' },
        { id: 'icon-wechat', name: '微信', selector: '.icon-wechat' },
        { id: 'icon-world', name: '世界书', selector: '.icon-world' },
        { id: 'icon-settings', name: '设置', selector: '.icon-settings' },
        { id: 'icon-theme', name: '美化', selector: '.icon-theme' },
        { id: 'icon-shopping', name: '购物', selector: '.icon-shopping' },
        { id: 'icon-forum', name: '论坛', selector: '.icon-forum' },
        { id: 'icon-phone', name: '查手机', selector: '.icon-phone' }
    ];

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
    function handleAppClick(app) {
        console.log('App clicked:', app.name);
        
        // 定义应用ID到全屏页面ID的映射
        const appMap = {
            'icon-theme': 'theme-app',
            'icon-settings': 'settings-app',
            'icon-wechat': 'wechat-app',
            'icon-world': 'worldbook-app'
        };

        const screenId = appMap[app.id];
        
        if (screenId) {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.classList.remove('hidden');
            }
        } else {
            alert(`${app.name} 功能开发中...`);
        }
    }

    // 初始化
    init();

    function init() {
        setupEventListeners();
        setupIOSFullScreen(); // 添加iOS全屏适配
        
        try {
            loadConfig();
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
        
        renderIconPresets();
        renderFontPresets();
        renderCssPresets();
        renderAiPresets();
        renderAiPresets(true);
        updateAiUi();
        updateAiUi(true);
        renderContactList();
        migrateWorldbookData(); // 迁移旧数据
        renderWorldbookCategoryList();
        renderMeTab();
        renderMoments();
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
            if (title) title.textContent = '通讯录';
            
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
                addBtn.innerHTML = '<i class="fas fa-user-plus"></i>';
                addBtn.onclick = () => document.getElementById('add-contact-modal').classList.remove('hidden');
                right.appendChild(addBtn);
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
        
        // 统一绑定应用图标点击事件
        appList.forEach(app => {
            // 通过选择器找到图标元素
            const iconEl = document.querySelector(app.selector);
            if (iconEl) {
                // 找到最近的 .app-item 父元素作为点击目标
                const appItem = iconEl.closest('.app-item');
                if (appItem) {
                    // 移除旧的监听器（如果有）并添加新的
                    appItem.onclick = () => handleAppClick(app);
                    appItem.style.cursor = 'pointer';
                }
            }
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
                wechatTabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.wechat-tab-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const tabName = tab.dataset.tab;
                document.getElementById(`wechat-tab-${tabName}`).classList.add('active');

                // 更新 Header
                updateWechatHeader(tabName);
            });
        });

        // 初始化 Header
        updateWechatHeader('wechat');

        // 微信添加联系人
        const addContactModal = document.getElementById('add-contact-modal');
        const closeAddContactBtn = document.getElementById('close-add-contact');
        const saveContactBtn = document.getElementById('save-contact-btn');

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
        const relationSelectModal = document.getElementById('relation-select-modal');
        const closeRelationSelectBtn = document.getElementById('close-relation-select');
        const aiMomentsEntry = document.getElementById('ai-moments-entry');

        if (closeAiProfileBtn) closeAiProfileBtn.addEventListener('click', () => aiProfileScreen.classList.add('hidden'));
        if (aiProfileMoreBtn) aiProfileMoreBtn.addEventListener('click', openChatSettings); // 资料卡更多按钮也打开设置
        if (aiProfileSendMsgBtn) aiProfileSendMsgBtn.addEventListener('click', () => {
            aiProfileScreen.classList.add('hidden');
            // 已经在聊天界面了，或者从通讯录进来的话需要打开聊天
            if (state.currentChatContactId) {
                openChat(state.currentChatContactId);
            }
        });
        
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
        
        if (chatMoreBtn && chatMorePanel) {
            chatMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                chatMorePanel.classList.toggle('hidden');
                // 确保表情包面板关闭
                if (stickerPanel) stickerPanel.classList.add('hidden');
                scrollToBottom();
            });

            // 点击面板内的项目
            chatMorePanel.querySelectorAll('.more-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    // 如果是照片、拍摄、转账、记忆或重回按钮，不执行通用逻辑（由单独的监听器处理）
                    if (item.id === 'chat-more-photo-btn' || item.id === 'chat-more-camera-btn' || item.id === 'chat-more-transfer-btn' || item.id === 'chat-more-memory-btn' || item.id === 'chat-more-regenerate-btn') return;
                    
                    e.stopPropagation();
                    const label = item.querySelector('.more-label').textContent;
                    alert(`功能 "${label}" 开发中...`);
                    chatMorePanel.classList.add('hidden');
                });
            });
        }

        // 表情包系统初始化
        initStickerSystem();

        // 点击其他地方关闭面板
        document.addEventListener('click', (e) => {
            if (chatMorePanel && !chatMorePanel.classList.contains('hidden') && 
                !chatMorePanel.contains(e.target) && 
                !chatMoreBtn.contains(e.target)) {
                chatMorePanel.classList.add('hidden');
            }
            
            if (stickerPanel && !stickerPanel.classList.contains('hidden') && 
                !stickerPanel.contains(e.target) && 
                (stickerBtn ? !stickerBtn.contains(e.target) : true)) {
                stickerPanel.classList.add('hidden');
            }
        });

        // 输入框聚焦时关闭面板
        if (chatInput) {
            chatInput.addEventListener('focus', () => {
                if (chatMorePanel) chatMorePanel.classList.add('hidden');
                if (stickerPanel) stickerPanel.classList.add('hidden');
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
                state.icons = {};
                applyIcons();
                saveConfig();
                renderIconSettings();
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

        // AI 设置相关 (主)
        setupAiListeners(false);
        
        // AI 设置相关 (副)
        setupAiListeners(true);

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
        const saveConfigBtn = document.getElementById('save-config');
        if (saveConfigBtn) {
            saveConfigBtn.addEventListener('click', () => {
                saveConfig();
                alert('配置已保存');
            });
        }
        
        const loadConfigBtn = document.getElementById('load-config');
        if (loadConfigBtn) {
            loadConfigBtn.addEventListener('click', () => {
                loadConfig();
                alert('配置已加载');
            });
        }
        
        const exportJsonBtn = document.getElementById('export-json');
        if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportJSON);
        
        const importJsonInput = document.getElementById('import-json');
        if (importJsonInput) importJsonInput.addEventListener('change', importJSON);

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

        // 记忆功能
        const chatMoreMemoryBtn = document.getElementById('chat-more-memory-btn');
        if (chatMoreMemoryBtn) {
            chatMoreMemoryBtn.addEventListener('click', () => {
                openMemoryApp();
                document.getElementById('chat-more-panel').classList.add('hidden');
            });
        }

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

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result;
            sendMessage(base64, true, 'image');
            
            // 关闭更多面板
            document.getElementById('chat-more-panel').classList.add('hidden');
        };
        reader.readAsDataURL(file);
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
            const reader = new FileReader();
            reader.onload = (event) => {
                if (postMomentImages.length < 9) {
                    postMomentImages.push(event.target.result);
                    renderPostMomentImages();
                }
            };
            reader.readAsDataURL(file);
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
        
        const reader = new FileReader();
        reader.onload = (event) => {
            updateUserProfile(type, event.target.result);
        };
        reader.readAsDataURL(file);
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
                        let userHtml = `<span class="comment-user">${c.user}</span>`;
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
                <img src="${state.userProfile.avatar}" class="persona-avatar">
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
        const style = document.getElementById('contact-style').value;
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
            style,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + name // 默认头像
        };

        if (avatarInput.files && avatarInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                contact.avatar = e.target.result;
                saveContactAndClose(contact);
            };
            reader.readAsDataURL(avatarInput.files[0]);
        } else {
            saveContactAndClose(contact);
        }
    }

    function saveContactAndClose(contact) {
        state.contacts.push(contact);
        saveConfig();
        renderContactList();
        
        // 清空输入
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-remark').value = '';
        document.getElementById('contact-persona').value = '';
        document.getElementById('contact-style').value = '';
        document.getElementById('contact-avatar-upload').value = '';
        
        document.getElementById('add-contact-modal').classList.add('hidden');
        openChat(contact.id);
    }

    function renderContactList() {
        const list = document.getElementById('contact-list');
        if (!list) return;
        
        list.innerHTML = '';
        
        state.contacts.forEach(contact => {
            const item = document.createElement('div');
            item.className = 'contact-item';
            item.innerHTML = `
                <img src="${contact.avatar}" class="contact-avatar">
                <div class="contact-info">
                    <div class="contact-name">${contact.remark || contact.nickname || contact.name}</div>
                </div>
            `;
            item.addEventListener('click', () => openChat(contact.id));
            list.appendChild(item);
        });
    }

    function openChat(contactId) {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact) return;
        
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

        const reader = new FileReader();
        reader.onload = (event) => {
            contact.profileBg = event.target.result;
            document.getElementById('ai-profile-bg').style.backgroundImage = `url(${contact.profileBg})`;
            saveConfig();
        };
        reader.readAsDataURL(file);
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

        const reader = new FileReader();
        reader.onload = (event) => {
            contact.momentsBg = event.target.result;
            // 更新当前显示的背景
            const cover = document.getElementById('personal-moments-cover');
            if (cover) {
                cover.style.backgroundImage = `url(${contact.momentsBg})`;
            }
            saveConfig();
        };
        reader.readAsDataURL(file);
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
                        let userHtml = `<span class="comment-user">${c.user}</span>`;
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

        document.getElementById('chat-setting-remark').value = contact.remark || '';
        document.getElementById('chat-setting-persona').value = contact.persona || '';
        document.getElementById('chat-setting-context-limit').value = contact.contextLimit || '';
        document.getElementById('chat-setting-summary-limit').value = contact.summaryLimit || '';
        document.getElementById('chat-setting-show-thought').checked = contact.showThought || false;
        document.getElementById('chat-setting-thought-visible').checked = contact.thoughtVisible || false;
        // 清空文件输入
        document.getElementById('chat-setting-avatar').value = '';
        document.getElementById('chat-setting-my-avatar').value = '';
        document.getElementById('chat-setting-bg').value = '';

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

        document.getElementById('chat-settings-screen').classList.remove('hidden');
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

        const remark = document.getElementById('chat-setting-remark').value;
        const persona = document.getElementById('chat-setting-persona').value;
        const contextLimit = document.getElementById('chat-setting-context-limit').value;
        const summaryLimit = document.getElementById('chat-setting-summary-limit').value;
        const showThought = document.getElementById('chat-setting-show-thought').checked;
        const thoughtVisible = document.getElementById('chat-setting-thought-visible').checked;
        const userPersonaId = document.getElementById('chat-setting-user-persona').value;
        const avatarInput = document.getElementById('chat-setting-avatar');
        const myAvatarInput = document.getElementById('chat-setting-my-avatar');
        const bgInput = document.getElementById('chat-setting-bg');

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

        contact.remark = remark;
        contact.persona = persona;
        contact.contextLimit = contextLimit ? parseInt(contextLimit) : 0;
        contact.summaryLimit = summaryLimit ? parseInt(summaryLimit) : 0;
        contact.showThought = showThought;
        contact.thoughtVisible = thoughtVisible;
        contact.userPersonaId = userPersonaId ? parseInt(userPersonaId) : null;
        document.getElementById('chat-title').textContent = remark || contact.name;

        const promises = [];

        if (avatarInput.files && avatarInput.files[0]) {
            promises.push(new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    contact.avatar = e.target.result;
                    resolve();
                };
                reader.readAsDataURL(avatarInput.files[0]);
            }));
        }

        if (myAvatarInput.files && myAvatarInput.files[0]) {
            promises.push(new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    contact.myAvatar = e.target.result;
                    resolve();
                };
                reader.readAsDataURL(myAvatarInput.files[0]);
            }));
        }

        if (bgInput.files && bgInput.files[0]) {
            promises.push(new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    contact.chatBg = e.target.result;
                    resolve();
                };
                reader.readAsDataURL(bgInput.files[0]);
            }));
        }

        Promise.all(promises).then(() => {
            saveConfig();
            renderContactList(); // 更新列表头像/备注
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

            document.getElementById('chat-settings-screen').classList.add('hidden');
        });
    }

    function renderChatHistory(contactId) {
        const messages = state.chatHistory[contactId] || [];
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        
        messages.forEach(msg => {
            appendMessageToUI(msg.content, msg.role === 'user', msg.type || 'text', msg.description, msg.replyTo);
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
        
        saveConfig(); // 简单起见，每次发送都保存
        
        appendMessageToUI(text, isUser, type, description, msg.replyTo);
        scrollToBottom();

        // 检查是否需要自动总结
        checkAndSummarize(state.currentChatContactId);
    }

    function appendMessageToUI(text, isUser, type = 'text', description = null, replyTo = null) {
        // 隐藏自动同步的评论消息和动态发布消息，但保留在历史记录中供AI读取
        if (type === 'text' && text && typeof text === 'string') {
            if (text.startsWith('[评论了你的动态: "') || text.startsWith('[发布了动态]:')) {
                return;
            }
        }

        const container = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        
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
        
        const contact = state.contacts.find(c => c.id === state.currentChatContactId);
        
        let contentHtml = '';
        if (type === 'image' || type === 'sticker') {
            contentHtml = `<img src="${text}" style="max-width: 200px; border-radius: 4px;">`;
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
        }

        // 构建引用 HTML
        let replyHtml = '';
        if (replyTo) {
            replyHtml = `
                <div class="quote-container">
                    回复 ${replyTo.name}: ${replyTo.content}
                </div>
            `;
        }

        if (!isUser) {
            const avatar = contact ? contact.avatar : '';
            msgDiv.innerHTML = `
                <img src="${avatar}" class="chat-avatar" onclick="window.openAiProfile()" style="cursor: pointer;">
                <div class="msg-wrapper">
                    <div class="message-content ${extraClass}">
                        ${contentHtml}
                    </div>
                    ${replyHtml}
                </div>
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
                    <div class="message-content ${extraClass}">
                        ${contentHtml}
                    </div>
                    ${replyHtml}
                </div>
            `;
        }
        
        // 绑定长按事件
        let longPressTimer;
        const handleStart = (e) => {
            longPressTimer = setTimeout(() => {
                handleMessageLongPress(e, text, isUser, type);
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
                handleMessageLongPress(e, text, isUser, type);
            });
        }

        container.appendChild(msgDiv);
    }

    function handleMessageLongPress(e, content, isUser, type) {
        // 获取坐标
        let x, y;
        if (e.type === 'touchstart') {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        
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

        showContextMenu(x, y, { content, name, isUser, type });
    }

    function showContextMenu(x, y, msgData) {
        // 移除旧菜单
        const oldMenu = document.querySelector('.context-menu');
        if (oldMenu) oldMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" id="menu-quote">引用</div>
            <div class="context-menu-item" id="menu-copy">复制</div>
            <div class="context-menu-item" id="menu-delete" style="color: #ff3b30;">删除</div>
        `;
        
        // 调整位置，防止溢出屏幕
        const menuWidth = 150; // 估算宽度
        if (x + menuWidth > window.innerWidth) {
            x = window.innerWidth - menuWidth - 10;
        }
        
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        
        document.body.appendChild(menu);
        
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

        menu.querySelector('#menu-delete').onclick = () => {
            // 删除功能暂未完全实现逻辑（需要消息ID），这里先做个样子或者简单删除DOM
            // 为了完整实现删除，需要在消息数据中添加唯一ID，并在渲染时绑定
            // 这里暂时只移除菜单
            alert('删除功能开发中...');
            menu.remove();
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

        // 构建 Prompt
        let systemPrompt = `你现在扮演 ${contact.name}。
人设：${contact.persona || '无'}
聊天风格：${contact.style || '正常'}
${userPromptInfo}
${momentContext}
${memoryContext}

你必须完全沉浸在角色中，绝对不能透露你是AI或语言模型。你的回复必须像一个真实的${contact.name}在使用微信聊天。
你拥有一个“微信朋友圈”功能和“微信转账”功能。
1. 当用户发送的消息格式为 '[评论了你的动态: "..."] ...' 时，表示用户在朋友圈评论了你的动态。
   - 如果这是用户的**最新一条消息**，请结合动态内容和用户的评论进行回复。
   - 如果这出现在**历史记录**中且你已经回复过，请忽略它，不要重复回复，将其视为已发生的背景事件。
2. 当用户发送的消息格式为 '[发布了动态]: ...' 时，表示用户刚刚发了一条朋友圈。你可以根据人设决定是否去点赞或评论。
3. 当收到 '[转账消息] ...' 时，如果状态是 'pending'，你可以决定接收或退回。

【指令说明】
- 如果你想发朋友圈，请在回复最后另起一行输出：MOMENT: 内容
- 如果你想给用户最新的动态点赞，请在回复最后另起一行输出：ACTION: LIKE_MOMENT
- 如果你想评论用户最新的动态，请在回复最后另起一行输出：ACTION: COMMENT_MOMENT: 评论内容
- 如果你想发送图片，请在回复最后另起一行输出：ACTION: SEND_IMAGE: 图片描述
- 如果你想发送表情包，请在回复最后另起一行输出：ACTION: SEND_STICKER: 表情包描述 (请从可用表情包列表中选择)
- 如果你想给用户转账，请在回复最后另起一行输出：ACTION: TRANSFER: 金额 备注 (例如: ACTION: TRANSFER: 88.88 节日快乐)
- 如果你想接收用户的转账，请在回复最后另起一行输出：ACTION: ACCEPT_TRANSFER: [ID] (例如: ACTION: ACCEPT_TRANSFER: 1737266888888)
- 如果你想退回用户的转账，请在回复最后另起一行输出：ACTION: RETURN_TRANSFER: [ID]
- 如果你想引用某条消息进行回复，请在回复最后另起一行输出：ACTION: QUOTE_MESSAGE: 消息内容摘要
- 如果你想更改自己的资料（网名、微信号、个性签名），请在回复最后另起一行输出：
  - ACTION: UPDATE_NAME: 新网名
  - ACTION: UPDATE_WXID: 新微信号
  - ACTION: UPDATE_SIGNATURE: 新签名
  (可以同时使用多个更改指令)
- 请在回复的最开始，先进行思考，分析用户意图和你的回复策略，将思考内容包裹在 <thinking> 和 </thinking> 标签中。
- 如果需要输出角色的内心独白（心声），请在回复的最后（所有指令之后），另起一行输出：THOUGHT: 内容。

注意：
1. **严格遵守格式**：指令必须在回复的最后，每个指令独占一行，不要放在中间。
2. 正常回复应该自然，不要机械地说“我点赞了”或“我收钱了”。
3. 如果不想执行操作，就不要输出指令。
4. 发送图片时，请提供详细的画面描述。
5. 一次回复中最多只能发起一笔转账。
6. 你有权限更改自己的资料卡信息（网名、微信号、签名），当用户要求或你自己想改时可以使用。
7. **必须进行思考**：在回复的最开始输出 <thinking>...</thinking>，这部分内容用户不可见，仅用于你的推理。
8. **THOUGHT: 内容** 是角色的心理活动，用户可见（如果开启了显示）。

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
        let contextMessages = history;
        if (contact.contextLimit && contact.contextLimit > 0) {
            contextMessages = history.slice(-contact.contextLimit);
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
                } else {
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

            // 移除思维链 <thinking>...</thinking>
            replyContent = replyContent.replace(/<thinking>[\s\S]*?<\/thinking>/g, '').trim();

            // 预处理：先按 ||| 分割
            const rawSegments = replyContent.split('|||');
            const cleanReplies = [];
            let imageToSend = null;
            let hasTransferred = false; // 限制一次只能转账一次
            
            // 定义指令正则 (匹配单行指令或直到段落结束)
            const momentRegex = /MOMENT:\s*(.*?)(?:\n|$)/;
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
                role: 'assistant',
                content: text,
                replyTo: replyTo
            };
            
            if (thought) {
                msgData.thought = thought;
            }
            
            state.chatHistory[state.currentChatContactId].push(msgData);
            saveConfig();
            
            // 使用 appendMessageToUI 渲染，确保包含长按事件绑定等逻辑
            appendMessageToUI(text, false, 'text', null, replyTo);
            
            scrollToBottom();
            
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
        
        document.getElementById('manual-summary-modal').classList.add('hidden');
        showNotification('正在手动总结...');
        
        await generateSummary(contact, messagesToSummarize);
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
                        <button class="memory-edit-btn" onclick="window.editMemory(${memory.id})">编辑</button>
                        <button class="memory-delete-btn" onclick="window.deleteMemory(${memory.id})">删除</button>
                    </div>
                </div>
                <div class="memory-content">${memory.content}</div>
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

    async function checkAndSummarize(contactId) {
        const contact = state.contacts.find(c => c.id === contactId);
        if (!contact || !contact.summaryLimit || contact.summaryLimit <= 0) return;

        const history = state.chatHistory[contactId] || [];
        
        if (!contact.lastSummaryIndex) contact.lastSummaryIndex = 0;
        
        const newMessagesCount = history.length - contact.lastSummaryIndex;
        
        if (newMessagesCount >= contact.summaryLimit) {
            // 触发总结
            const messagesToSummarize = history.slice(contact.lastSummaryIndex);
            contact.lastSummaryIndex = history.length; // 更新索引
            saveConfig(); // 保存索引更新

            showNotification('正在总结...');
            await generateSummary(contact, messagesToSummarize);
        }
    }

    async function generateSummary(contact, messages) {
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
                    time: Date.now()
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

        const fontName = `WebFont_${Date.now()}`;
        const style = document.createElement('style');
        style.textContent = `@font-face { font-family: '${fontName}'; src: url('${url}'); }`;
        document.head.appendChild(style);
        
        addFontToState(fontName, url, 'url');
        document.getElementById('font-url').value = '';
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
        const select = document.getElementById('font-preset-select');
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
    }

    // --- 壁纸功能 ---

    function handleWallpaperUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const wallpaper = {
                id: Date.now(),
                data: event.target.result
            };
            state.wallpapers.push(wallpaper);
            state.currentWallpaper = wallpaper.id;
            applyWallpaper(wallpaper.id);
            renderWallpaperGallery();
            saveConfig();
        };
        reader.readAsDataURL(file);
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

        appList.forEach(app => {
            const item = document.createElement('div');
            item.className = 'list-item';
            
            const currentIcon = state.icons[app.id];
            const currentColor = state.iconColors[app.id] || '#ffffff'; // 默认白色，虽然CSS默认可能是其他
            let previewContent = '';
            
            // 安全地获取预览内容
            if (currentIcon) {
                previewContent = `<img src="${currentIcon}">`;
            } else {
                const el = document.querySelector(app.selector + ' i');
                if (el) {
                    previewContent = `<i class="${el.className}"></i>`;
                } else {
                    // 如果找不到i标签（可能已经被替换为img但state中没有记录），尝试恢复默认
                    previewContent = '<i class="fas fa-question"></i>';
                }
            }

            item.innerHTML = `
                <div class="icon-row">
                    <div class="icon-preview-small" id="preview-${app.id}" style="background-color: ${currentColor};">
                        ${previewContent}
                    </div>
                    <div class="icon-info column">
                        <span>${app.name}</span>
                        <div class="color-picker-row" style="margin-top: 5px; display: flex; align-items: center; gap: 5px;">
                            <span style="font-size: 12px; color: #888;">背景色:</span>
                            <input type="color" class="color-picker-input" value="${currentColor}" data-id="${app.id}" style="width: 30px; height: 20px; padding: 0; border: none;">
                        </div>
                    </div>
                    <div class="icon-actions">
                        <input type="file" id="upload-${app.id}" accept="image/*" class="file-input-hidden">
                        <label for="upload-${app.id}" class="ios-btn">更换</label>
                        ${currentIcon || state.iconColors[app.id] ? `<button class="ios-btn-small danger" onclick="resetAppIcon('${app.id}')">还原</button>` : ''}
                    </div>
                </div>
            `;

            // 绑定上传事件
            const input = item.querySelector('input[type="file"]');
            input.addEventListener('change', (e) => handleIconUpload(e, app.id));
            
            // 绑定颜色选择事件
            const colorInput = item.querySelector('input[type="color"]');
            colorInput.addEventListener('input', (e) => handleIconColorChange(e, app.id));
            
            // 绑定还原事件
            const resetBtn = item.querySelector('button');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => resetAppIcon(app.id));
            }

            list.appendChild(item);
        });
    }

    function handleIconUpload(e, appId) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            state.icons[appId] = event.target.result;
            applyIcons();
            renderIconSettings();
            saveConfig();
        };
        reader.readAsDataURL(file);
    }

    function handleIconColorChange(e, appId) {
        const color = e.target.value;
        state.iconColors[appId] = color;
        
        // 实时更新预览
        const preview = document.getElementById(`preview-${appId}`);
        if (preview) preview.style.backgroundColor = color;
        
        applyIcons();
        saveConfig();
        
        // 如果之前没有还原按钮，现在有了颜色修改，应该显示还原按钮
        // 为了简单，这里不重新渲染整个列表，只是保存配置
    }

    window.resetAppIcon = function(appId) {
        delete state.icons[appId];
        delete state.iconColors[appId];
        applyIcons();
        renderIconSettings();
        saveConfig();
    };

    function applyIcons() {
        appList.forEach(app => {
            const el = document.querySelector(app.selector);
            if (!el) return;
            
            const iconData = state.icons[app.id];
            const iconColor = state.iconColors[app.id];
            
            // 应用背景色
            if (iconColor) {
                el.style.backgroundColor = iconColor;
            } else {
                // 恢复默认背景色 (通常由CSS控制，这里设为空)
                el.style.backgroundColor = '';
            }
            
            if (iconData) {
                el.innerHTML = `<img src="${iconData}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--icon-radius);">`;
                // 如果有图片，背景色可能被遮挡，但如果图片是透明png，背景色会显示
            } else {
                const originalIcons = {
                    'icon-envelope': 'fas fa-envelope',
                    'icon-wechat': 'fab fa-weixin',
                    'icon-world': 'fas fa-globe',
                    'icon-settings': 'fas fa-cog',
                    'icon-theme': 'fas fa-paint-brush',
                    'icon-shopping': 'fas fa-shopping-bag',
                    'icon-forum': 'fas fa-comments',
                    'icon-phone': 'fas fa-mobile-alt'
                };
                el.innerHTML = `<i class="${originalIcons[app.id]}"></i>`;
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
            localStorage.setItem('iphoneSimConfig', JSON.stringify(state));
        } catch (e) {
            alert('存储空间不足，无法保存所有数据（可能是图片太大）。建议减少壁纸或图标数量。');
            console.error(e);
        }
    }

    function loadConfig() {
        const saved = localStorage.getItem('iphoneSimConfig');
        if (saved) {
            try {
                const loadedState = JSON.parse(saved);
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
                if (!state.defaultVirtualImageUrl) state.defaultVirtualImageUrl = '';
                if (state.showStatusBar === undefined) state.showStatusBar = true;
                if (!state.iconColors) state.iconColors = {};
                if (!state.iconPresets) state.iconPresets = [];
                if (!state.stickerCategories) state.stickerCategories = [];
                
                // 修正当前选中的表情包分类
                if (state.stickerCategories.length > 0) {
                    const currentCat = state.stickerCategories.find(c => c.id === state.currentStickerCategoryId);
                    if (!currentCat) {
                        state.currentStickerCategoryId = state.stickerCategories[0].id;
                    }
                } else {
                    state.currentStickerCategoryId = null;
                }

                const defaultVirtualImageUrlInput = document.getElementById('default-virtual-image-url');
                if (defaultVirtualImageUrlInput) defaultVirtualImageUrlInput.value = state.defaultVirtualImageUrl;

                const statusBarToggle = document.getElementById('show-status-bar-toggle');
                if (statusBarToggle) statusBarToggle.checked = state.showStatusBar;
                toggleStatusBar(state.showStatusBar);

                const cssEditor = document.getElementById('css-editor');
                if (cssEditor) cssEditor.value = state.css;
                
                applyFont(state.currentFont);
                applyWallpaper(state.currentWallpaper);
                applyIcons();
                applyCSS(state.css);
                
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
            } catch (e) {
                console.error('解析配置失败:', e);
            }
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
                
                // 修正当前选中的表情包分类
                if (state.stickerCategories.length > 0) {
                    const currentCat = state.stickerCategories.find(c => c.id === state.currentStickerCategoryId);
                    if (!currentCat) {
                        state.currentStickerCategoryId = state.stickerCategories[0].id;
                    }
                } else {
                    state.currentStickerCategoryId = null;
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

        // 使用事件委托处理底部栏按钮 (管理)
        const tabBar = document.getElementById('sticker-tab-bar');
        if (tabBar) {
            // 移除旧的监听器（如果有），防止重复绑定
            const newTabBar = tabBar.cloneNode(true);
            tabBar.parentNode.replaceChild(newTabBar, tabBar);
            
            newTabBar.addEventListener('click', (e) => {
                // 查找最近的 .sticker-settings-tab
                const manageBtn = e.target.closest('#sticker-manage-btn');

                if (manageBtn) {
                    e.stopPropagation();
                    // 如果已经在管理模式，点击则是“完成”，退出管理模式
                    if (state.isStickerManageMode) {
                        toggleStickerManageMode();
                    } else {
                        // 否则显示选项菜单
                        document.getElementById('sticker-options-modal').classList.remove('hidden');
                    }
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
        if (state.stickerCategories.length > 0) {
            if (!state.currentStickerCategoryId) {
                state.currentStickerCategoryId = state.stickerCategories[0].id;
            }
            renderStickerList();
        }
    }

    function toggleStickerPanel() {
        const panel = document.getElementById('sticker-panel');
        const chatMorePanel = document.getElementById('chat-more-panel');
        
        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            if (chatMorePanel) chatMorePanel.classList.add('hidden');
            scrollToBottom();
            renderStickerTabs();
            renderStickerList();
        } else {
            panel.classList.add('hidden');
            // 退出管理模式
            if (state.isStickerManageMode) {
                toggleStickerManageMode();
            }
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

        container.innerHTML = '';

        state.stickerCategories.forEach(cat => {
            const tab = document.createElement('div');
            tab.className = `sticker-tab ${state.currentStickerCategoryId === cat.id ? 'active' : ''}`;
            tab.textContent = cat.name;
            tab.onclick = (e) => {
                e.stopPropagation();
                state.currentStickerCategoryId = cat.id;
                // 切换分类时退出搜索状态
                document.getElementById('sticker-search-input').value = '';
                // 切换分类时退出管理模式
                if (state.isStickerManageMode) {
                    toggleStickerManageMode();
                }
                renderStickerTabs();
                renderStickerList();
            };
            container.appendChild(tab);
        });
    }

    function renderStickerList(filterText = '') {
        const container = document.getElementById('sticker-content');
        if (!container) return;

        container.innerHTML = '';

        if (!state.currentStickerCategoryId) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 20px;">暂无表情包，请点击 + 号导入</div>';
            return;
        }

        const category = state.stickerCategories.find(c => c.id === state.currentStickerCategoryId);
        if (!category) return;

        let stickers = category.list;
        if (filterText) {
            stickers = stickers.filter(s => s.desc.toLowerCase().includes(filterText.toLowerCase()));
        }

        if (stickers.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 20px;">没有找到匹配的表情</div>';
            return;
        }

        stickers.forEach((sticker, index) => {
            const item = document.createElement('div');
            item.className = `sticker-item ${state.isStickerManageMode && state.selectedStickers.has(`${category.id}-${index}`) ? 'selected' : ''}`;
            
            let innerHTML = `
                <img src="${sticker.url}" loading="lazy" onerror="this.src='https://placehold.co/60x60?text=Error'">
                <span>${sticker.desc}</span>
            `;

            if (state.isStickerManageMode) {
                innerHTML += `<div class="sticker-checkbox"><i class="fas fa-check"></i></div>`;
                item.onclick = (e) => {
                    e.stopPropagation();
                    toggleSelectSticker(category.id, index);
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
        document.getElementById('sticker-panel').classList.add('hidden');
    }

    function toggleStickerManageMode() {
        state.isStickerManageMode = !state.isStickerManageMode;
        state.selectedStickers.clear();
        
        const manageBtn = document.getElementById('sticker-manage-btn');
        const actionsPanel = document.getElementById('sticker-manage-actions');
        const searchBox = document.querySelector('.sticker-search-box');
        
        if (state.isStickerManageMode) {
            manageBtn.innerHTML = '<span style="font-size: 14px; color: #007AFF;">完成</span>';
            actionsPanel.classList.remove('hidden');
            searchBox.style.display = 'none';
        } else {
            manageBtn.innerHTML = '<i class="fas fa-cog"></i>';
            actionsPanel.classList.add('hidden');
            searchBox.style.display = 'flex';
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
        if (!state.currentStickerCategoryId) return;
        
        const category = state.stickerCategories.find(c => c.id === state.currentStickerCategoryId);
        if (!category) return;

        // 检查是否已全选
        let allSelected = true;
        for (let i = 0; i < category.list.length; i++) {
            if (!state.selectedStickers.has(`${category.id}-${i}`)) {
                allSelected = false;
                break;
            }
        }

        if (allSelected) {
            // 取消全选
            for (let i = 0; i < category.list.length; i++) {
                state.selectedStickers.delete(`${category.id}-${i}`);
            }
        } else {
            // 全选
            for (let i = 0; i < category.list.length; i++) {
                state.selectedStickers.add(`${category.id}-${i}`);
            }
        }
        
        updateSelectCount();
        renderStickerList();
    }

    function deleteSelectedStickers() {
        if (state.selectedStickers.size === 0) {
            // 如果没有选中任何表情，且处于管理模式，询问是否删除当前分类
            if (state.currentStickerCategoryId) {
                if (confirm('未选择表情。是否删除当前整个分类？')) {
                    state.stickerCategories = state.stickerCategories.filter(c => c.id !== state.currentStickerCategoryId);
                    state.currentStickerCategoryId = state.stickerCategories.length > 0 ? state.stickerCategories[0].id : null;
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
});
