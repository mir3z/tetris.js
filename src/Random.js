export default function Random(seed) {
    let state = seed;

    const m = 2147483648;
    const a = 1103515245;
    const c = 12345;

    const next = () => (a * state + c) % m;

    return {
        next() {
            state = next();
            return state;
        },

        peek() {
            return next();
        }
    };
}