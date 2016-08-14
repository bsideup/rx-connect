export default function hashCode() {
    if (this.length === 0) {
        return 0;
    }

    let hash = 0;
    for (let i = 0; i < this.length; i++) {
        let chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }

    return hash;
}
