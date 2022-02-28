const getUid = (length = 6) => {
    return [...Array(length)].map(() => {
        const r = Math.random() * 16 | 0;
        return r.toString(16)
    }).join('')
}

export default getUid;
