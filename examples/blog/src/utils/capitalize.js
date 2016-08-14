export default function capitalize() {
    if (this.length == 0) {
        return this;
    }

    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}
