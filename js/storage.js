
const STORAGE_KEY = "project_board_data";

export function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) return null;

        return JSON.parse(raw);
    } catch (error) {
        console.error("資料讀取失敗：", error);
        return null;
    }
}

export function saveData(data) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );

        return true;
    } catch (error) {
        console.error("資料保存失敗：", error);
        return false;
    }
}
