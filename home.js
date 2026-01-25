// 主页/应用网格功能模块

const GRID_ROWS = 6;
const GRID_COLS = 4;
const TOTAL_SLOTS = GRID_ROWS * GRID_COLS;
let isEditMode = false;

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

function deleteImportedWidget(index) {
    if (confirm('确定要从库中删除此组件吗？')) {
        importedWidgets.splice(index, 1);
        // 保存更新后的库
        localStorage.setItem('myIOS_Library', JSON.stringify(importedWidgets));
        // 重新渲染
        renderLibrary();
    }
}

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

// 初始化监听器
function setupHomeListeners() {
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
}

// 注册初始化函数
if (window.appInitFunctions) {
    window.appInitFunctions.push(setupHomeListeners);
}

// 暴露给全局以便 core.js 调用
window.initGrid = initGrid;
window.renderItems = renderItems;
