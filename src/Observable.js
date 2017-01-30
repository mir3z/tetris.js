export default function Observable() {
    const handlers = [];

    return {
        register(fn) {
            handlers.push(fn);
        },

        notify(...args) {
            handlers.forEach(handler => handler(...args));
        }
    };
}