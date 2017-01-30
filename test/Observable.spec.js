import { expect } from "chai";
import { spy, assert } from "sinon";
import Observable from "../src/Observable";

describe("Observable", () => {

    it("implements observer pattern", () => {
        const listener1 = spy();
        const listener2 = spy();
        const o = Observable();
        const params = { foo: 100 };

        o.register(listener1);
        o.register(listener2);
        o.notify(params);

        assert.calledWith(listener1, params);
        assert.calledWith(listener2, params);
    });
});