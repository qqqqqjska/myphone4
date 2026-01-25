// 美化/主题功能模块

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

function addWebFont(url) {
    const fontName = `WebFont_${Date.now()}`;
    const style = document.createElement('style');
    style.textContent = `@font-face { font-family: '${fontName}'; src: url('${url}'); }`;
    document.head.appendChild(style);
    addFontToState(fontName, url, 'url');
}

function resetFont() {
    window.iphoneSimState.currentFont = 'default';
    applyFont('default');
    saveConfig();
    alert('已重置为系统默认字体');
}

function addFontToState(name, source, type) {
    window.iphoneSimState.fonts.push({ name, source, type });
    window.iphoneSimState.currentFont = name;
    applyFont(name);
    saveConfig();
}

function applyFont(fontName) {
    const state = window.iphoneSimState;
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
    const state = window.iphoneSimState;
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
        font: window.iphoneSimState.currentFont
    };
    
    window.iphoneSimState.fontPresets.push(preset);
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
        window.iphoneSimState.fontPresets = window.iphoneSimState.fontPresets.filter(p => p.name !== name);
        saveConfig();
        renderFontPresets();
    }
}

function handleApplyFontPreset(e) {
    const name = e.target.value;
    if (!name) return;
    
    const preset = window.iphoneSimState.fontPresets.find(p => p.name === name);
    if (preset) {
        window.iphoneSimState.currentFont = preset.font;
        applyFont(window.iphoneSimState.currentFont);
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
        
        if (window.iphoneSimState.fontPresets) {
            window.iphoneSimState.fontPresets.forEach(preset => {
                const option = document.createElement('option');
                option.value = preset.name;
                option.textContent = preset.name;
                select.appendChild(option);
            });
        }
        
        if (currentValue && window.iphoneSimState.fontPresets.some(p => p.name === currentValue)) {
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
        window.iphoneSimState.wallpapers.push(wallpaper);
        window.iphoneSimState.currentWallpaper = wallpaper.id;
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
    
    window.iphoneSimState.wallpapers.forEach(wp => {
        const item = document.createElement('div');
        item.className = `gallery-item ${window.iphoneSimState.currentWallpaper === wp.id ? 'selected' : ''}`;
        item.innerHTML = `
            <img src="${wp.data}" alt="Wallpaper">
            <button class="delete-wp-btn" data-id="${wp.id}">&times;</button>
        `;
        
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-wp-btn')) {
                deleteWallpaper(wp.id);
            } else {
                window.iphoneSimState.currentWallpaper = wp.id;
                applyWallpaper(wp.id);
                renderWallpaperGallery();
                saveConfig();
            }
        });
        
        gallery.appendChild(item);
    });
}

function deleteWallpaper(id) {
    window.iphoneSimState.wallpapers = window.iphoneSimState.wallpapers.filter(wp => wp.id !== id);
    if (window.iphoneSimState.currentWallpaper === id) {
        window.iphoneSimState.currentWallpaper = null;
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
        if (!window.iphoneSimState.chatWallpapers) window.iphoneSimState.chatWallpapers = [];
        window.iphoneSimState.chatWallpapers.push(wallpaper);
        window.iphoneSimState.tempSelectedChatBg = wallpaper.data;
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
    
    if (!window.iphoneSimState.chatWallpapers) window.iphoneSimState.chatWallpapers = [];
    
    window.iphoneSimState.chatWallpapers.forEach(wp => {
        const item = document.createElement('div');
        const isSelected = window.iphoneSimState.tempSelectedChatBg === wp.data;
        item.className = `gallery-item ${isSelected ? 'selected' : ''}`;
        item.innerHTML = `
            <img src="${wp.data}" alt="Wallpaper">
            <button class="delete-wp-btn" data-id="${wp.id}">&times;</button>
        `;
        
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-wp-btn')) {
                deleteChatWallpaper(wp.id);
            } else {
                window.iphoneSimState.tempSelectedChatBg = wp.data;
                renderChatWallpaperGallery();
            }
        });
        
        gallery.appendChild(item);
    });
}

function deleteChatWallpaper(id) {
    const wp = window.iphoneSimState.chatWallpapers.find(w => w.id === id);
    if (wp && window.iphoneSimState.tempSelectedChatBg === wp.data) {
        window.iphoneSimState.tempSelectedChatBg = '';
    }
    window.iphoneSimState.chatWallpapers = window.iphoneSimState.chatWallpapers.filter(w => w.id !== id);
    renderChatWallpaperGallery();
    saveConfig();
}

function applyWallpaper(id) {
    if (!id) {
        document.documentElement.style.setProperty('--wallpaper', 'none');
        return;
    }
    const wp = window.iphoneSimState.wallpapers.find(w => w.id === id);
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

    const appsToShow = new Set(Object.keys(knownApps));
    
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
        
        const currentIcon = window.iphoneSimState.icons[appId];
        const currentColor = window.iphoneSimState.iconColors[appId] || appInfo.color;
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
                    ${currentIcon || window.iphoneSimState.iconColors[appId] ? `<button class="ios-btn-small danger" onclick="resetAppIcon('${appId}')">还原</button>` : ''}
                </div>
            </div>
        `;

        const input = item.querySelector('input[type="file"]');
        input.addEventListener('change', (e) => handleIconUpload(e, appId));
        
        const colorInput = item.querySelector('input[type="color"]');
        colorInput.addEventListener('input', (e) => handleIconColorChange(e, appId));
        
        list.appendChild(item);
    });
}

function handleIconUpload(e, appId) {
    const file = e.target.files[0];
    if (!file) return;

    compressImage(file, 300, 0.7).then(base64 => {
        window.iphoneSimState.icons[appId] = base64;
        applyIcons();
        renderIconSettings();
        saveConfig();
    }).catch(err => {
        console.error('图片压缩失败', err);
    });
}

function handleIconColorChange(e, appId) {
    const color = e.target.value;
    window.iphoneSimState.iconColors[appId] = color;
    
    const preview = document.getElementById(`preview-${appId}`);
    if (preview) {
        preview.style.backgroundColor = color;
        const icon = preview.querySelector('i');
        if (icon) {
            icon.style.color = color === '#ffffff' ? '#000' : '#fff';
        }
    }
    
    applyIcons();
    saveConfig();
}

window.resetAppIcon = function(appId) {
    delete window.iphoneSimState.icons[appId];
    delete window.iphoneSimState.iconColors[appId];
    applyIcons();
    renderIconSettings();
    saveConfig();
};

function applyIcons() {
    if (typeof renderItems === 'function') {
        renderItems();
    }

    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        const appId = item.dataset.appId;
        if (!appId) return;

        const iconContainer = item.querySelector('.app-icon');
        if (!iconContainer) return;

        const appInfo = knownApps[appId] || { icon: 'fas fa-question', color: '#ccc' };
        const customIcon = window.iphoneSimState.icons[appId];
        const customColor = window.iphoneSimState.iconColors[appId];
        const finalColor = customColor || appInfo.color;

        iconContainer.style.backgroundColor = finalColor;

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
        icons: { ...window.iphoneSimState.icons },
        iconColors: { ...window.iphoneSimState.iconColors }
    };
    
    window.iphoneSimState.iconPresets.push(preset);
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
        window.iphoneSimState.iconPresets = window.iphoneSimState.iconPresets.filter(p => p.name !== name);
        saveConfig();
        renderIconPresets();
    }
}

function handleApplyIconPreset(e) {
    const name = e.target.value;
    if (!name) return;
    
    const preset = window.iphoneSimState.iconPresets.find(p => p.name === name);
    if (preset) {
        window.iphoneSimState.icons = { ...preset.icons };
        window.iphoneSimState.iconColors = { ...preset.iconColors };
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
    
    if (window.iphoneSimState.iconPresets) {
        window.iphoneSimState.iconPresets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.name;
            option.textContent = preset.name;
            select.appendChild(option);
        });
    }
    
    if (currentValue && window.iphoneSimState.iconPresets.some(p => p.name === currentValue)) {
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
    const blob = new Blob([window.iphoneSimState.css], { type: 'text/css' });
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
    
    window.iphoneSimState.cssPresets.push(preset);
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
        window.iphoneSimState.cssPresets = window.iphoneSimState.cssPresets.filter(p => p.name !== name);
        saveConfig();
        renderCssPresets();
    }
}

function handleApplyCssPreset(e) {
    const name = e.target.value;
    if (!name) return;
    
    const preset = window.iphoneSimState.cssPresets.find(p => p.name === name);
    if (preset) {
        window.iphoneSimState.css = preset.css;
        document.getElementById('css-editor').value = window.iphoneSimState.css;
        applyCSS(window.iphoneSimState.css);
        saveConfig();
    }
}

function renderCssPresets() {
    const select = document.getElementById('css-preset-select');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- 选择预设 --</option>';
    
    if (window.iphoneSimState.cssPresets) {
        window.iphoneSimState.cssPresets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.name;
            option.textContent = preset.name;
            select.appendChild(option);
        });
    }
    
    if (currentValue && window.iphoneSimState.cssPresets.some(p => p.name === currentValue)) {
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
    
    window.iphoneSimState.cssPresets.push(preset);
    saveConfig();
    renderChatCssPresets();
    renderCssPresets();
    document.getElementById('chat-css-preset-select').value = name;
    alert('CSS预设已保存');
}

function handleDeleteChatCssPreset() {
    const select = document.getElementById('chat-css-preset-select');
    const name = select.value;
    if (!name) return;
    
    if (confirm(`确定要删除预设 "${name}" 吗？`)) {
        window.iphoneSimState.cssPresets = window.iphoneSimState.cssPresets.filter(p => p.name !== name);
        saveConfig();
        renderChatCssPresets();
        renderCssPresets();
    }
}

function handleApplyChatCssPreset(e) {
    const name = e.target.value;
    if (!name) return;
    
    const preset = window.iphoneSimState.cssPresets.find(p => p.name === name);
    if (preset) {
        document.getElementById('chat-setting-custom-css').value = preset.css;
    }
}

function renderChatCssPresets() {
    const select = document.getElementById('chat-css-preset-select');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- 选择预设 --</option>';
    
    if (window.iphoneSimState.cssPresets) {
        window.iphoneSimState.cssPresets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.name;
            option.textContent = preset.name;
            select.appendChild(option);
        });
    }
    
    if (currentValue && window.iphoneSimState.cssPresets.some(p => p.name === currentValue)) {
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
            const editor = document.getElementById('meeting-css-editor');
            if (editor) editor.value = window.iphoneSimState.meetingCss || '';
            modal.classList.remove('hidden');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    const fontUpload = document.getElementById('meeting-font-upload');
    if (fontUpload) {
        const newUpload = fontUpload.cloneNode(true);
        fontUpload.parentNode.replaceChild(newUpload, fontUpload);
        newUpload.addEventListener('change', handleMeetingFontUploadAction);
    }

    const fontPresetSelect = document.getElementById('meeting-font-preset-select');
    if (fontPresetSelect) {
        const newSelect = fontPresetSelect.cloneNode(true);
        fontPresetSelect.parentNode.replaceChild(newSelect, fontPresetSelect);
        newSelect.addEventListener('change', handleApplyMeetingFontPreset);
    }

    const resetFontBtn = document.getElementById('reset-meeting-font-btn');
    if (resetFontBtn) {
        const newReset = resetFontBtn.cloneNode(true);
        resetFontBtn.parentNode.replaceChild(newReset, resetFontBtn);
        newReset.addEventListener('click', resetMeetingFontAction);
    }

    const mainResetFontBtn = document.getElementById('reset-font-btn');
    if (mainResetFontBtn) mainResetFontBtn.addEventListener('click', resetFont);

    const saveCssBtn = document.getElementById('save-meeting-css-preset');
    if (saveCssBtn) saveCssBtn.addEventListener('click', handleSaveMeetingCssPreset);
    
    const deleteCssBtn = document.getElementById('delete-meeting-css-preset');
    if (deleteCssBtn) deleteCssBtn.addEventListener('click', handleDeleteMeetingCssPreset);
    
    const cssSelect = document.getElementById('meeting-css-preset-select');
    if (cssSelect) cssSelect.addEventListener('change', handleApplyMeetingCssPreset);
    
    const applyCssBtn = document.getElementById('apply-meeting-css-btn');
    if (applyCssBtn) applyCssBtn.addEventListener('click', () => {
        const css = document.getElementById('meeting-css-editor').value;
        window.iphoneSimState.meetingCss = css;
        applyMeetingCss(css);
        saveConfig();
        alert('见面模式 CSS 已应用');
    });

    const meetingEditIconUpload = document.getElementById('meeting-edit-icon-upload');
    if (meetingEditIconUpload) {
        const newUpload = meetingEditIconUpload.cloneNode(true);
        meetingEditIconUpload.parentNode.replaceChild(newUpload, meetingEditIconUpload);
        newUpload.addEventListener('change', (e) => handleMeetingIconUpload(e, 'edit'));
    }

    const meetingDeleteIconUpload = document.getElementById('meeting-delete-icon-upload');
    if (meetingDeleteIconUpload) {
        const newUpload = meetingDeleteIconUpload.cloneNode(true);
        meetingDeleteIconUpload.parentNode.replaceChild(newUpload, meetingDeleteIconUpload);
        newUpload.addEventListener('change', (e) => handleMeetingIconUpload(e, 'delete'));
    }

    if (window.iphoneSimState.meetingIcons) {
        const editPreview = document.getElementById('meeting-edit-icon-preview');
        const deletePreview = document.getElementById('meeting-delete-icon-preview');
        if (editPreview && window.iphoneSimState.meetingIcons.edit) editPreview.src = window.iphoneSimState.meetingIcons.edit;
        if (deletePreview && window.iphoneSimState.meetingIcons.delete) deletePreview.src = window.iphoneSimState.meetingIcons.delete;
    }
}

function handleMeetingIconUpload(e, type) {
    const file = e.target.files[0];
    if (!file) return;

    compressImage(file, 100, 0.7).then(base64 => {
        if (!window.iphoneSimState.meetingIcons) window.iphoneSimState.meetingIcons = {};
        window.iphoneSimState.meetingIcons[type] = base64;
        saveConfig();
        
        const preview = document.getElementById(`meeting-${type}-icon-preview`);
        if (preview) preview.src = base64;
        
        if (window.iphoneSimState.currentMeetingId && window.iphoneSimState.currentChatContactId) {
             const meetings = window.iphoneSimState.meetings[window.iphoneSimState.currentChatContactId];
             const meeting = meetings.find(m => m.id === window.iphoneSimState.currentMeetingId);
             if (meeting && window.renderMeetingCards) window.renderMeetingCards(meeting);
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
    
    if (!window.iphoneSimState.meetingCssPresets) window.iphoneSimState.meetingCssPresets = [];
    window.iphoneSimState.meetingCssPresets.push(preset);
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
        window.iphoneSimState.meetingCssPresets = window.iphoneSimState.meetingCssPresets.filter(p => p.name !== name);
        saveConfig();
        renderMeetingCssPresets();
    }
}

function handleApplyMeetingCssPreset(e) {
    const name = e.target.value;
    if (!name) return;
    
    const preset = window.iphoneSimState.meetingCssPresets.find(p => p.name === name);
    if (preset) {
        document.getElementById('meeting-css-editor').value = preset.css;
    }
}

function renderMeetingCssPresets() {
    const select = document.getElementById('meeting-css-preset-select');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- 选择预设 --</option>';
    
    if (window.iphoneSimState.meetingCssPresets) {
        window.iphoneSimState.meetingCssPresets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.name;
            option.textContent = preset.name;
            select.appendChild(option);
        });
    }
    
    if (currentValue && window.iphoneSimState.meetingCssPresets.some(p => p.name === currentValue)) {
        select.value = currentValue;
    }
}

function applyMeetingFont(fontName) {
    if (fontName === 'default') {
        document.documentElement.style.setProperty('--meeting-font-family', 'var(--font-family)');
    } else {
        const font = window.iphoneSimState.fonts.find(f => f.name === fontName);
        if (font) {
            if (font.type === 'url' && !document.getElementById(`style-${font.name}`)) {
                const style = document.createElement('style');
                style.id = `style-${font.name}`;
                style.textContent = `@font-face { font-family: '${font.name}'; src: url('${font.source}'); }`;
                document.head.appendChild(style);
            }
            document.documentElement.style.setProperty('--meeting-font-family', fontName);
        }
    }
}

function handleMeetingFontUploadAction(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const fontName = `MeetingFont_${Date.now()}`;
        const fontFace = new FontFace(fontName, `url(${event.target.result})`);
        
        fontFace.load().then((loadedFace) => {
            document.fonts.add(loadedFace);
            addFontToState(fontName, event.target.result, 'local'); 
            
            window.iphoneSimState.currentMeetingFont = fontName;
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

function handleApplyMeetingFontPreset(e) {
    const name = e.target.value;
    if (!name) return;
    
    const preset = window.iphoneSimState.fontPresets.find(p => p.name === name);
    if (preset) {
        window.iphoneSimState.currentMeetingFont = preset.font;
        applyMeetingFont(preset.font);
        saveConfig();
    }
}

function resetMeetingFontAction() {
    window.iphoneSimState.currentMeetingFont = 'default';
    applyMeetingFont('default');
    saveConfig();
    alert('见面字体已重置为跟随系统');
}

// --- 主题自定义器功能 ---
function initThemeCustomizer() {
    // 使用事件委托处理打开按钮，防止动态渲染导致失效
    document.body.addEventListener('click', (e) => {
        const openBtn = e.target.closest('#open-theme-customizer-btn');
        if (openBtn) {
            const appScreen = document.getElementById('theme-customizer-app');
            if (appScreen) {
                appScreen.classList.remove('hidden');
                // 初始化预览
                updateThemePreview();
            }
        }
    });

    const appScreen = document.getElementById('theme-customizer-app');
    const closeBtn = document.getElementById('close-theme-customizer');
    
    if (closeBtn && appScreen) {
        closeBtn.addEventListener('click', () => {
            appScreen.classList.add('hidden');
        });
    }
    
    const savePresetBtn = document.getElementById('save-theme-customizer-preset');
    if (savePresetBtn) {
        savePresetBtn.addEventListener('click', handleSaveChatCssPreset);
    }
    
    const resetBtn = document.getElementById('reset-theme-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if(confirm('确定要重置所有主题设置吗？')) {
                // 重置输入框
                const inputs = document.querySelectorAll('#customize-controls input');
                inputs.forEach(input => {
                    if (input.type === 'color') {
                        if (input.id.includes('bg-color')) input.value = input.id.includes('ai') ? '#E5E5EA' : '#007AFF';
                        else if (input.id.includes('text-color')) input.value = input.id.includes('ai') ? '#000000' : '#FFFFFF';
                        else input.value = '#000000';
                    } else if (input.type === 'range') {
                        if (input.id.includes('radius')) input.value = 18;
                        else if (input.id.includes('padding-t') || input.id.includes('padding-b')) input.value = 8;
                        else if (input.id.includes('padding-l') || input.id.includes('padding-r')) input.value = 12;
                        else if (input.id.includes('margin')) input.value = 10;
                        else if (input.id.includes('bg-size')) input.value = 100;
                        else if (input.id.includes('bg-x') || input.id.includes('bg-y')) input.value = 50;
                        else input.value = 0;
                    } else {
                        input.value = '';
                    }
                });
                updateThemePreview();
            }
        });
    }

    // === 导航切换逻辑 ===
    const navItems = document.querySelectorAll('#customize-nav .nav-item');
    const sections = [
        document.getElementById('controls-section-1'),
        document.getElementById('controls-section-2')
    ];

    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 移除所有 active 状态
            navItems.forEach(nav => {
                nav.style.fontWeight = 'normal';
                nav.style.color = '#888';
                nav.style.borderBottom = 'none';
                nav.classList.remove('active');
            });
            
            // 激活当前点击项
            item.style.fontWeight = 'bold';
            item.style.color = '#000';
            item.style.borderBottom = '2px solid #000';
            item.classList.add('active');

            // 切换显示对应的内容区域
            sections.forEach(sec => sec && sec.classList.add('hidden'));
            if (sections[index]) {
                sections[index].classList.remove('hidden');
            }
        });
    });

    // === 监听输入变化 ===
    const inputs = document.querySelectorAll('#customize-controls input, #customize-controls select');
    inputs.forEach(input => {
        input.addEventListener('input', updateThemePreview);
        input.addEventListener('change', updateThemePreview);
    });
    
    // 复制 CSS 按钮
    const copyBtn = document.getElementById('copy-css-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const cssOutput = document.getElementById('css-output');
            if (cssOutput) {
                cssOutput.select();
                document.execCommand('copy');
                alert('CSS 已复制到剪贴板');
            }
        });
    }

    // 监听 CSS 代码框变化，实时更新预览
    const cssOutput = document.getElementById('css-output');
    if (cssOutput) {
        cssOutput.addEventListener('input', () => {
            const css = cssOutput.value;
            applyPreviewCss(css);
        });
    }
}

function applyPreviewCss(css) {
    // 1. 替换 ID 以匹配预览容器中的元素 (将实际页面 ID 映射到预览页面 ID)
    let processedCss = css
        .replace(/#chat-input/g, '#preview-input')
        .replace(/#send-msg-btn/g, '#preview-send-btn')
        // 预览中没有直接对应的 AI 回复按钮，映射到表情按钮或忽略
        .replace(/#trigger-ai-reply-btn/g, '#preview-emoji-btn'); 

    // 2. 使用 CSS Nesting 将样式限制在预览容器内
    // 这样可以自动处理所有类名选择器，无需逐个替换
    let styleEl = document.getElementById('theme-preview-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'theme-preview-style';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = `#chat-preview-container {
${processedCss}
}`;
}

function updateThemePreview() {
    // 1. 获取值
    const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
    };

    // 顶栏底栏
    const topBg = getVal('ctrl-top-bg');
    const bottomBg = getVal('ctrl-bottom-bg');
    
    // AI
    const aiBgColor = getVal('ctrl-ai-bg-color');
    const aiTextColor = getVal('ctrl-ai-text-color');
    const aiRadius = `${getVal('ctrl-ai-radius-tl')}px ${getVal('ctrl-ai-radius-tr')}px ${getVal('ctrl-ai-radius-br')}px ${getVal('ctrl-ai-radius-bl')}px`;
    const aiPadding = `${getVal('ctrl-ai-padding-t')}px ${getVal('ctrl-ai-padding-r')}px ${getVal('ctrl-ai-padding-b')}px ${getVal('ctrl-ai-padding-l')}px`;
    const aiMargin = getVal('ctrl-ai-margin');
    const aiX = getVal('ctrl-ai-x');
    const aiY = getVal('ctrl-ai-y');
    const aiShadowBlur = getVal('ctrl-ai-shadow-blur');
    const aiShadowColor = getVal('ctrl-ai-shadow-color');
    const aiBgImg = getVal('ctrl-ai-bg-img');
    const aiBgSize = getVal('ctrl-ai-bg-size');
    const aiBgX = getVal('ctrl-ai-bg-x');
    const aiBgY = getVal('ctrl-ai-bg-y');

    // User
    const userBgColor = getVal('ctrl-user-bg-color');
    const userTextColor = getVal('ctrl-user-text-color');
    const userRadius = `${getVal('ctrl-user-radius-tl')}px ${getVal('ctrl-user-radius-tr')}px ${getVal('ctrl-user-radius-br')}px ${getVal('ctrl-user-radius-bl')}px`;
    const userPadding = `${getVal('ctrl-user-padding-t')}px ${getVal('ctrl-user-padding-r')}px ${getVal('ctrl-user-padding-b')}px ${getVal('ctrl-user-padding-l')}px`;
    const userMargin = getVal('ctrl-user-margin');
    const userX = getVal('ctrl-user-x');
    const userY = getVal('ctrl-user-y');
    const userShadowBlur = getVal('ctrl-user-shadow-blur');
    const userShadowColor = getVal('ctrl-user-shadow-color');
    const userBgImg = getVal('ctrl-user-bg-img');
    const userBgSize = getVal('ctrl-user-bg-size');
    const userBgX = getVal('ctrl-user-bg-x');
    const userBgY = getVal('ctrl-user-bg-y');

    // 更新显示数值
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('val-ai-margin', aiMargin);
    setTxt('val-ai-bg-size', aiBgSize);
    setTxt('val-user-margin', userMargin);
    setTxt('val-user-bg-size', userBgSize);

    // 2. 生成 CSS (包含所有聊天页面相关样式)
    let css = `/* 聊天页面自定义主题 */

/* --- 顶栏 (Header) --- */
.chat-header {
    height: 91px;
    height: calc(44px + max(47px, env(safe-area-inset-top, 0px)));
    padding-top: 47px;
    padding-top: max(47px, env(safe-area-inset-top, 0px));
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #f9f9f9; /* 默认背景色 */
    border-bottom: 1px solid #d1d1d6;
    position: relative;
    ${topBg ? `background-image: url('${topBg}'); background-size: cover; background-position: center;` : ''}
}

.chat-header > span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 17px;
    font-weight: 600;
    z-index: 1;
}

.back-btn {
    background: none;
    border: none;
    color: #000;
    font-size: 17px;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    padding: 5px;
    position: relative;
    z-index: 2;
}

.wechat-icon-btn {
    background: none;
    border: none;
    font-size: 18px;
    color: #000;
    cursor: pointer;
    padding: 10px;
    margin: -5px;
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* --- 消息容器 (Body) --- */
.chat-body {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    background-color: #f2f2f7; /* 默认聊天背景 */
}

/* --- 底栏/输入框 (Input Area) --- */
.chat-input-area {
    min-height: 50px;
    background-color: #f9f9f9;
    border-top: 1px solid #d1d1d6;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    gap: 12px;
    z-index: 100;
    position: relative;
    padding-bottom: max(8px, env(safe-area-inset-bottom));
    ${bottomBg ? `background-image: url('${bottomBg}'); background-size: cover; background-position: center; background-color: transparent;` : ''}
}

#chat-input {
    flex: 1;
    height: 36px;
    border: 1px solid #e5e5e5;
    border-radius: 20px;
    padding: 0 15px;
    background-color: #fff;
    font-size: 16px;
    z-index: 10;
    position: relative;
    min-width: 0;
}

.chat-icon-btn {
    background: none;
    border: none;
    font-size: 26px;
    color: #858585;
    padding: 0;
    cursor: pointer;
    z-index: 20;
    position: relative;
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

#send-msg-btn, #trigger-ai-reply-btn {
    background: none;
    border: none;
    color: #007AFF;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
}

/* --- 消息气泡 (Messages) --- */
.chat-message {
    display: flex;
    margin-bottom: 10px;
    align-items: flex-start;
    position: relative;
}

.chat-message.user {
    flex-direction: row-reverse;
}

.chat-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0 8px;
    object-fit: cover;
    margin-bottom: 2px;
}

.msg-time {
    font-size: 10px;
    color: #b2b2b2;
    margin: 0 6px;
    align-self: flex-end;
    white-space: nowrap;
    margin-bottom: 5px;
}

.message-content {
    padding: 8px 12px;
    border-radius: 18px;
    max-width: 70%;
    position: relative;
    font-size: 16px;
    line-height: 1.4;
    word-wrap: break-word;
    white-space: pre-wrap;
}

/* AI 消息气泡 (自定义) */
.chat-message.other .message-content {
    background-color: ${aiBgColor};
    color: ${aiTextColor};
    border-radius: ${aiRadius};
    padding: ${aiPadding};
    margin-bottom: ${aiMargin}px;
    transform: translate(${aiX}px, ${aiY}px);
    border: none;
    ${aiShadowBlur !== '0' ? `box-shadow: 0 2px ${aiShadowBlur}px ${aiShadowColor};` : 'box-shadow: none;'}
    ${aiBgImg ? `background-image: url('${aiBgImg}'); background-size: ${aiBgSize}%; background-position: ${aiBgX}% ${aiBgY}%; background-repeat: no-repeat;` : ''}
}

/* 用户消息气泡 (自定义) */
.chat-message.user .message-content {
    background-color: ${userBgColor};
    color: ${userTextColor};
    border-radius: ${userRadius};
    padding: ${userPadding};
    margin-bottom: ${userMargin}px;
    transform: translate(${userX}px, ${userY}px);
    border: none;
    ${userShadowBlur !== '0' ? `box-shadow: 0 2px ${userShadowBlur}px ${userShadowColor};` : 'box-shadow: none;'}
    ${userBgImg ? `background-image: url('${userBgImg}'); background-size: ${userBgSize}%; background-position: ${userBgX}% ${userBgY}%; background-repeat: no-repeat;` : ''}
}

/* --- 语音消息 (Voice Message) --- */
.chat-message .message-content.voice-msg {
    background: transparent !important;
    padding: 0 !important;
    box-shadow: none !important;
}

.voice-bar-top {
    display: flex;
    align-items: center;
    height: 36px;
    line-height: 40px;
    min-width: 80px;
    padding: 0 12px;
    border-radius: 18px;
    position: relative;
    z-index: 10;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    cursor: pointer;
}

.chat-message.other .voice-bar-top {
    background-color: #ffffff;
    color: #000;
}

.chat-message.user .voice-bar-top {
    background-color: #000000;
    color: #ffffff;
    flex-direction: row-reverse;
}

.voice-text-bottom {
    display: block;
    position: relative;
    background-color: #ffffff;
    color: #333;
    margin-top: 6px;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.4;
    max-width: 240px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* --- 转账消息 (Transfer Message) --- */
.message-content.transfer-msg {
    padding: 0;
    background-color: #ffffff !important;
    width: 240px !important;
    height: 80px !important;
    overflow: hidden;
    border-radius: 12px !important;
    cursor: pointer;
    border: 1px solid #e5e5ea;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    color: #000 !important;
}

.transfer-icon {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 22px;
    margin-right: 15px;
}

.transfer-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.transfer-amount {
    font-size: 17px;
    font-weight: 600;
}

.transfer-remark {
    font-size: 13px;
    color: #8e8e93;
}
`;

    // 3. 更新输出
    const output = document.getElementById('css-output');
    if (output) output.value = css;

    // 4. 更新预览
    applyPreviewCss(css);
}

// --- 初始化监听器 ---
function setupThemeListeners() {
    initThemeCustomizer(); // 调用初始化函数

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

    const fontUpload = document.getElementById('font-upload');
    if (fontUpload) fontUpload.addEventListener('change', handleFontUpload);
    
    const applyFontUrlBtn = document.getElementById('apply-font-url');
    if (applyFontUrlBtn) applyFontUrlBtn.addEventListener('click', handleFontUrl);
    
    const saveFontPresetBtn = document.getElementById('save-font-preset');
    if (saveFontPresetBtn) saveFontPresetBtn.addEventListener('click', handleSaveFontPreset);
    
    const deleteFontPresetBtn = document.getElementById('delete-font-preset');
    if (deleteFontPresetBtn) deleteFontPresetBtn.addEventListener('click', handleDeleteFontPreset);
    
    const fontPresetSelect = document.getElementById('font-preset-select');
    if (fontPresetSelect) fontPresetSelect.addEventListener('change', handleApplyFontPreset);

    const wallpaperUpload = document.getElementById('wallpaper-upload');
    if (wallpaperUpload) wallpaperUpload.addEventListener('change', handleWallpaperUpload);
    
    const resetWallpaperBtn = document.getElementById('reset-wallpaper');
    if (resetWallpaperBtn) {
        resetWallpaperBtn.addEventListener('click', () => {
            window.iphoneSimState.currentWallpaper = null;
            applyWallpaper(null);
            saveConfig();
            renderWallpaperGallery();
        });
    }

    const resetIconsBtn = document.getElementById('reset-icons');
    if (resetIconsBtn) {
        resetIconsBtn.addEventListener('click', () => {
            if (confirm('确定要重置所有图标和颜色吗？')) {
                window.iphoneSimState.icons = {};
                window.iphoneSimState.iconColors = {};
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

    const saveCssBtn = document.getElementById('save-css');
    if (saveCssBtn) {
        saveCssBtn.addEventListener('click', () => {
            window.iphoneSimState.css = document.getElementById('css-editor').value;
            applyCSS(window.iphoneSimState.css);
            saveConfig();
            alert('CSS配置已保存');
        });
    }
    
    const exportCssBtn = document.getElementById('export-css');
    if (exportCssBtn) exportCssBtn.addEventListener('click', exportCSS);

    const saveCssPresetBtn = document.getElementById('save-css-preset');
    if (saveCssPresetBtn) saveCssPresetBtn.addEventListener('click', handleSaveCssPreset);
    
    const deleteCssPresetBtn = document.getElementById('delete-css-preset');
    if (deleteCssPresetBtn) deleteCssPresetBtn.addEventListener('click', handleDeleteCssPreset);
    
    const cssPresetSelect = document.getElementById('css-preset-select');
    if (cssPresetSelect) cssPresetSelect.addEventListener('change', handleApplyCssPreset);

    const defaultVirtualImageUrlInput = document.getElementById('default-virtual-image-url');
    if (defaultVirtualImageUrlInput) {
        defaultVirtualImageUrlInput.addEventListener('change', (e) => {
            window.iphoneSimState.defaultVirtualImageUrl = e.target.value;
        });
    }

    const statusBarToggle = document.getElementById('show-status-bar-toggle');
    if (statusBarToggle) {
        statusBarToggle.addEventListener('change', (e) => {
            window.iphoneSimState.showStatusBar = e.target.checked;
            toggleStatusBar(window.iphoneSimState.showStatusBar);
            saveConfig();
        });
    }

    const saveIconPresetBtn = document.getElementById('save-icon-preset');
    if (saveIconPresetBtn) saveIconPresetBtn.addEventListener('click', handleSaveIconPreset);
    
    const deleteIconPresetBtn = document.getElementById('delete-icon-preset');
    if (deleteIconPresetBtn) deleteIconPresetBtn.addEventListener('click', handleDeleteIconPreset);
    
    const iconPresetSelect = document.getElementById('icon-preset-select');
    if (iconPresetSelect) iconPresetSelect.addEventListener('change', handleApplyIconPreset);

    const saveAllSettingsBtn = document.getElementById('save-all-settings');
    if (saveAllSettingsBtn) {
        saveAllSettingsBtn.addEventListener('click', () => {
            saveConfig();
            alert('所有配置已保存');
        });
    }
    
    // 聊天设置 CSS 预设相关
    const saveChatCssPresetBtn = document.getElementById('save-chat-css-preset');
    if (saveChatCssPresetBtn) saveChatCssPresetBtn.addEventListener('click', handleSaveChatCssPreset);

    const deleteChatCssPresetBtn = document.getElementById('delete-chat-css-preset');
    if (deleteChatCssPresetBtn) deleteChatCssPresetBtn.addEventListener('click', handleDeleteChatCssPreset);

    const chatCssPresetSelect = document.getElementById('chat-css-preset-select');
    if (chatCssPresetSelect) chatCssPresetSelect.addEventListener('change', handleApplyChatCssPreset);
}

// 注册初始化函数
if (window.appInitFunctions) {
    window.appInitFunctions.push(setupThemeListeners);
}
