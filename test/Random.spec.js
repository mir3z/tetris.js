import { expect } from "chai";
import Random from "../src/Random";

describe("Random", () => {
    const SEED = 2;

    it("provides seeded random int generator", () => {
        const r1 = Random(SEED);
        const r2 = Random(SEED);
        const r3 = Random(SEED + 1);
        const r4 = Random(SEED + 2);

        expect(r1.next()).to.eql(r2.next());
        expect(r1.next()).to.eql(r2.next());

        expect(r3.next()).not.to.eql(r4.next());
        expect(r3.next()).not.to.eql(r4.next());
    });

    it("allows to peek next int", () => {
        const r = Random(SEED);

        expect(r.peek()).to.eql(r.peek());
        expect(r.next()).not.to.eql(r.next());
        expect(r.peek()).to.eql(r.next());
    });
});