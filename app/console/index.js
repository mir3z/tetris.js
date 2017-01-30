import main from "../main";
import wait from "./src/wait";
import createKeyListener from "./src/consoleKeyListener";
import renderGame from "./src/view";

const keyListener = createKeyListener(process.stdin);

main(keyListener, wait, renderGame);