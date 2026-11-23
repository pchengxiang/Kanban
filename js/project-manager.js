
export function createProject(name) {
    return {
        id: crypto.randomUUID(),
        name,

        columns: [
            { id: crypto.randomUUID(), title: "待處理" },
            { id: crypto.randomUUID(), title: "進行中" },
            { id: crypto.randomUUID(), title: "待驗收" },
            { id: crypto.randomUUID(), title: "已完成" }
        ],

        tasks: []
    };
}

export function addProject(data, name) {
    const project = createProject(name);

    data.projects.push(project);

    return project;
}

export function removeProject(data, projectId) {
    data.projects = data.projects.filter(
        project => project.id !== projectId
    );
}

export function getProject(data, projectId) {
    return data.projects.find(
        project => project.id === projectId
    );
}

export function moveProject(projects, fromId, toId) {
    const fromIndex = projects.findIndex(
        project => project.id === fromId
    );

    const toIndex = projects.findIndex(
        project => project.id === toId
    );

    if (fromIndex === -1 || toIndex === -1) return;

    const [project] = projects.splice(fromIndex, 1);

    projects.splice(toIndex, 0, project);
}