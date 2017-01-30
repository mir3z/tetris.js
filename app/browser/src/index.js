import createKeyListener from "./browserKeyListener";
import wait from "./wait";
import { createGameRenderer } from "./View.jsx";
import { h, render } from "preact";

import main from "../../main";

const keyListener = createKeyListener(window);
const renderGame = createGameRenderer(document.body);

main(keyListener, wait, renderGame);