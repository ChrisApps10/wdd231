export function getLayoutPreference(key) {
    return localStorage.getItem(key) || "grid";
}

export function saveLayoutPreference(key, layout) {
    localStorage.setItem(key, layout);
}