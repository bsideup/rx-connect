export function ofWikiChanges(channel) {
    return this.create(observer => {
        const socket = io.connect("https://stream.wikimedia.org:443/rc", { "force new connection": true });

        socket.on("connect", () => socket.emit("subscribe", channel));

        socket.on("change", data => observer.next(data));

        return () => {
            socket.removeAllListeners("connect");
            socket.removeAllListeners("change");
            socket.disconnect();
            observer.complete();
        }
    });
}
