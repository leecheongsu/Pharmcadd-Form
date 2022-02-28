const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export const time2string = (ms) => {
    let temp = []
    let [d, h, m, s] = [0, 0, 0, 0]

    d = Math.floor(ms / DAY)
    h = Math.floor((ms % DAY) / HOUR)
    m = Math.floor((ms % HOUR) / MINUTE)
    s = Math.floor((ms % MINUTE) / SECOND)

    if (d) temp.push(d + 'day' + (d > 1 ? 's' : ''))
    if (h) temp.push(h + 'h')
    if (m) temp.push(m + 'm')
    if (s) temp.push(s + 's')

    return temp.join(' ')
}
