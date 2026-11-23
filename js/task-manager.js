
export function createTask(title, columnId) {
    return {
        id: crypto.randomUUID(),
        title,
        description: "",
        columnId,
        priority: "一般",
        dueDate: "",
        createdAt: new Date().toISOString()
    };
}

export function addTask(project, title, columnId) {
    const task = createTask(title, columnId);

    project.tasks.push(task);

    return task;
}

export function updateTask(project, taskId, updates) {
    const task = project.tasks.find(
        task => task.id === taskId
    );

    if (!task) return;

    Object.assign(task, updates);

    return task;
}

export function removeTask(project, taskId) {
    project.tasks = project.tasks.filter(
        task => task.id !== taskId
    );
}

export function moveTask(project, taskId, columnId) {
    return updateTask(project, taskId, {
        columnId
    });
}

export function addColumn(project, title) {
    const column = {
        id: crypto.randomUUID(),
        title
    };

    project.columns.push(column);

    return column;
}
