const locks = {};
const isLocked = key => () => locks[key] || false;
const unlock = key => () => locks[key] = false;
const lock = key => (timeout = 0) => {
    locks[key] = true;
    timeout && setTimeout(unlock(key), timeout);
}
export const Lock = key => {
    return {
        isLocked: isLocked(key),
        unlock: unlock(key),
        lock: lock(key)
    }
}

