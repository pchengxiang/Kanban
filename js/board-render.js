
function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

export function renderProjects(data, selectedId) {
    const container = document.querySelector(".project-items");

    container.innerHTML = data.projects.map(project => `
        <button
            class="project-item ${project.id === selectedId ? "active" : ""}"
            data-project-id="${escapeHTML(project.id)}"
            draggable="true"
        >
            <span class="project-dot"></span>
            ${escapeHTML(project.name)}
        </button>
    `).join("");
}

export function renderBoard(project) {
    document.querySelector("#board-title").textContent =
        project.name;

    document.querySelector("#board-description").textContent =
        `${project.tasks.length} 項任務`;

    const container = document.querySelector(".board-container");

    container.innerHTML = project.columns.map(column => {
        const tasks = project.tasks.filter(
            task => task.columnId === column.id
        );

        return `
            <section
                class="board-column"
                data-column-id="${escapeHTML(column.id)}"
            >
                <div class="column-header">
                    <h3>${escapeHTML(column.title)}</h3>
                    <span class="task-count">${tasks.length}</span>
                </div>

                ${tasks.map(task => `
                    <article
                        class="task-card"
                        draggable="true"
                        data-task-id="${escapeHTML(task.id)}"
                    >
                        <span class="task-tag blue">
                            ${escapeHTML(task.priority)}
                        </span>

                        <h4>${escapeHTML(task.title)}</h4>

                        <p>${escapeHTML(task.description)}</p>

                        <div class="task-footer">
                            <span>${escapeHTML(task.priority)}優先級</span>
                            <span>${escapeHTML(task.dueDate || "無期限")}</span>
                        </div>
                    </article>
                `).join("")}

                <button
                    class="add-task"
                    data-column-id="${escapeHTML(column.id)}"
                >
                    + 新增任務
                </button>
            </section>
        `;
    }).join("");
}


export function renderTaskInfo( task, project) {
    let container=  document.querySelector(".info-content");
    if (!task || !project) {
        container.innerHTML = `
            <p class="empty-info">選擇一個任務以查看資訊</p>
        `;
        return;
    }

    const columns = project.columns;

    container.innerHTML = `
        <form id="task-edit-form" class="task-edit-form">

            <div class="form-group">
                <label for="task-title">任務名稱</label>
                <input
                    id="task-title"
                    name="title"
                    type="text"
                    value="${escapeHTML(task.title)}"
                    required
                >
            </div>

            <div class="form-group">
                <label for="task-description">任務描述</label>
                <textarea
                    id="task-description"
                    name="description"
                    rows="5"
                >${escapeHTML(task.description || "")}</textarea>
            </div>

            <div class="form-group">
                <label for="task-column">所屬欄位</label>
                <select id="task-column" name="columnId">
                    ${columns.map(column => `
                        <option
                            value="${escapeHTML(column.id)}"
                            ${column.id === task.columnId ? "selected" : ""}
                        >
                            ${escapeHTML(column.title)}
                        </option>
                    `).join("")}
                </select>
            </div>

            <div class="form-group">
                <label for="task-priority">優先級</label>
                <select id="task-priority" name="priority">
                    <option value="low" ${task.priority === "low" ? "selected" : ""}>低</option>
                    <option value="medium" ${task.priority === "medium" ? "selected" : ""}>中</option>
                    <option value="high" ${task.priority === "high" ? "selected" : ""}>高</option>
                </select>
            </div>

            <div class="form-group">
                <label for="task-due-date">截止日期</label>
                <input
                    id="task-due-date"
                    name="dueDate"
                    type="date"
                    value="${escapeHTML(task.dueDate || "")}"
                >
            </div>

            <div class="form-actions">
                <button type="submit">儲存</button>
                <button type="button" id="cancel-task-edit">取消</button>
                <button type="button" id="delete-task">刪除任務</button>
            </div>

        </form>
    `;
}

