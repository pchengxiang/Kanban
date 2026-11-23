
import { loadData, saveData } from "./storage.js";

import {
    addProject,
    getProject
} from "./project-manager.js";

import {
    renderProjects,
    renderBoard,
    renderTaskInfo
} from "./board-render.js";

import { bindEvents } from "./events.js";

// 1. 初始化資料
const data = loadData() || {
    projects: []
};

// 2. 初始化預設專案
if (data.projects.length === 0) {
    const project = addProject(data, "我的第一個專案");
    saveData(data);
}

// 3. 初始化選取狀態
const context = {
    data,

    selectedProjectId: data.projects[0]?.id || null,
    selectedTaskId: null
};

// 4. 資料保存
function persist() {
    saveData(data);
}

// 5. 專案切換
function selectProject(projectId) {
    context.selectedProjectId = projectId;
    context.selectedTaskId = null;
}

// 6. 任務選取
function selectTask(taskId) {
    context.selectedTaskId = taskId;
}

// 7. 畫面更新
function refresh() {
    const project = getProject(
        data,
        context.selectedProjectId
    );

    renderProjects(data, context.selectedProjectId);

    if (!project) {
        document.querySelector("#board-title").textContent =
            "尚未選擇專案";

        document.querySelector("#board-description").textContent = "";

        document.querySelector("#board-container").innerHTML = "";

        renderTaskInfo(null, null);
        return;
    }

    renderBoard(project);

    const task = project.tasks.find(
        item => item.id === context.selectedTaskId
    );

    if (!task) {
        context.selectedTaskId = null;
    }

    renderTaskInfo(task || null, project);
}

// 8. 將方法提供給事件模組
Object.assign(context, {
    persist,
    refresh,
    selectProject,
    selectTask
});

// 9. 啟動
bindEvents(context);

refresh();
