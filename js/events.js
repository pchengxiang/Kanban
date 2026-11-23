
import {
    addProject,
    removeProject,
    getProject
} from "./project-manager.js";

import {
    addTask,
    updateTask,
    removeTask,
    moveTask,
    addColumn
} from "./task-manager.js";

import { moveProject } from "./project-manager.js";

export function bindEvents(context) {
    const {
        data,
        persist,
        refresh,
        selectProject,
        selectTask
    } = context;

    let draggedTaskId = null;

    function currentProject() {
        return getProject(data, context.selectedProjectId);
    }

    // 新增專案
    document.querySelector("#add_project")
        .addEventListener("click", () => {
            const name = prompt("請輸入專案名稱：");

            if (!name?.trim()) return;

            const project = addProject(data, name.trim());

            selectProject(project.id);
            persist();
            refresh();
        });

    // 移除專案
    document.querySelector("#remove-project")
        .addEventListener("click", () => {
            const project = currentProject();

            if (!project) return;

            if (!confirm(`確定移除「${project.name}」？`)) return;

            removeProject(data, project.id);

            const nextProject = data.projects[0];

            selectProject(nextProject?.id || null);
            selectTask(null);

            persist();
            refresh();
        });

    // 專案切換
    document.querySelector(".project-items")
        .addEventListener("click", event => {
            const button = event.target.closest("[data-project-id]");

            if (!button) return;

            selectProject(button.dataset.projectId);
            selectTask(null);

            refresh();
        });

    // 新增看板欄位
    document.querySelector(".add-board")
        .addEventListener("click", () => {
            const project = currentProject();

            if (!project) return;

            const title = prompt("請輸入看板欄位名稱：");

            if (!title?.trim()) return;

            addColumn(project, title.trim());

            persist();
            refresh();
        });

    // 新增任務
    document.querySelector(".board-container")
        .addEventListener("click", event => {
            const button = event.target.closest(".add-task");

            if (!button) return;

            const project = currentProject();

            if (!project) return;

            const title = prompt("請輸入任務名稱：");

            if (!title?.trim()) return;

            const task = addTask(
                project,
                title.trim(),
                button.dataset.columnId
            );

            selectTask(task.id);

            persist();
            refresh();
        });

    // 選取任務
    document.querySelector(".board-container")
        .addEventListener("click", event => {
            const card = event.target.closest(".task-card");

            if (!card) return;

            selectTask(card.dataset.taskId);
            refresh();
        });

    // 編輯與刪除任務
    document.querySelector(".info-content")
        .addEventListener("click", event => {
            const action = event.target.dataset.action;

            if (!action) return;

            const project = currentProject();

            if (!project) return;

            const task = project.tasks.find(
                item => item.id === context.selectedTaskId
            );

            if (!task) return;

            if (action === "edit-task") {
                const title = prompt("任務名稱：", task.title);

                if (title === null || !title.trim()) return;

                const description = prompt(
                    "任務描述：",
                    task.description
                );

                if (description === null) return;

                const priority = prompt(
                    "優先級（高、一般、低）：",
                    task.priority
                );

                if (priority === null) return;

                const dueDate = prompt(
                    "截止日期（YYYY-MM-DD）：",
                    task.dueDate
                );

                if (dueDate === null) return;

                updateTask(project, task.id, {
                    title: title.trim(),
                    description: description.trim(),
                    priority: priority.trim() || "一般",
                    dueDate: dueDate.trim()
                });
            }

            if (action === "delete-task") {
                if (!confirm("確定刪除此任務？")) return;

                removeTask(project, task.id);
                selectTask(null);
            }

            persist();
            refresh();
        });

    // 開始拖拉
    document.querySelector(".board-container")
        .addEventListener("dragstart", event => {
            const card = event.target.closest(".task-card");

            if (!card) return;

            draggedTaskId = card.dataset.taskId;

            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", draggedTaskId);
        });

    // 允許放置
    document.querySelector(".board-container")
        .addEventListener("dragover", event => {
            if (event.target.closest(".board-column")) {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
            }
        });

    // 放置任務
    document.querySelector(".board-container")
        .addEventListener("drop", event => {
            const column = event.target.closest(".board-column");

            if (!column || !draggedTaskId) return;

            event.preventDefault();

            const project = currentProject();

            if (!project) return;

            moveTask(
                project,
                draggedTaskId,
                column.dataset.columnId
            );

            draggedTaskId = null;

            persist();
            refresh();
        });

    document.querySelector(".board-container")
        .addEventListener("dragend", () => {
            draggedTaskId = null;
        });

    
    const infoContainer = document.querySelector(".info-content");

    // 儲存任務
    infoContainer.addEventListener("submit", (event) => {
        if (event.target.id !== "task-edit-form") return;

        event.preventDefault();

        const project = currentProject();
        if (!project || !context.selectedTaskId) return;

        const formData = new FormData(event.target);

        const updates = {
            title: formData.get("title").trim(),
            description: formData.get("description"),
            columnId: formData.get("columnId"),
            priority: formData.get("priority"),
            dueDate: formData.get("dueDate")
        };

        if (!updates.title) return;

        updateTask(
            project,
            context.selectedTaskId,
            updates
        );

        context.persist();
        context.refresh();
    });

    // 取消編輯
    infoContainer.addEventListener("click", (event) => {
        if (event.target.id === "cancel-task-edit") {
            context.refresh();
        }
    });

    infoContainer.addEventListener("click", (event) => {
     if (event.target.id === "delete-task") {
        const project = currentProject();

        if (!project || !context.selectedTaskId) return;

        const confirmed = confirm("確定要刪除這個任務嗎？");

        if (!confirmed) return;

        removeTask(project, context.selectedTaskId);

        context.selectedTaskId = null;

        context.persist();
        context.refresh();
      
    }});

    let draggedProjectId = null;

    const projectContainer = document.querySelector(".project-items");

    projectContainer.addEventListener("dragstart", event => {
        const item = event.target.closest(".project-item");

        if (!item) return;

        draggedProjectId = item.dataset.projectId;

        event.dataTransfer.effectAllowed = "move";
    });

    projectContainer.addEventListener("dragover", event => {
        if (!event.target.closest(".project-item")) return;

        event.preventDefault();
    });

    projectContainer.addEventListener("drop", event => {
        event.preventDefault();

        const target = event.target.closest(".project-item");

        if (!target || !draggedProjectId) return;

        const targetId = target.dataset.projectId;

        moveProject(
            context.data.projects,
            draggedProjectId,
            targetId
        );

        context.persist();
        context.refresh();

        draggedProjectId = null;
    });
}
