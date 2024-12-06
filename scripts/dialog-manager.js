import { dialogTemplates } from "./dialog-templates.js";

export class DialogManager {
  constructor() {
    this.dialogs = {};
    this.initializeDialogs();

    this.swapPlayersOutput = document.querySelector(".swap-players__output");
    this.gameOverOutput = document.querySelector(".game-over__output");
    this.gameOverButton = document.querySelector(".game-over__button");
  }

  createDialog({ selector, header, innerHTML, buttons = [] }) {
    if (this.dialogs[selector]) return this.dialogs[selector];

    if (!innerHTML && !dialogTemplates[selector])
      throw new Error(`Dialog template for ${selector} not found`);

    const myDialog = document.createElement("dialog");
    myDialog.className = `dialog ${selector}`;

    const myHeader = document.createElement("h2");
    myHeader.className = `${selector}__header`;
    myHeader.innerHTML = header;
    myDialog.appendChild(myHeader);

    const myBody = document.createElement("div");
    myBody.className = `${selector}__body`;
    innerHTML
      ? (myBody.innerHTML = innerHTML)
      : (myBody.innerHTML = dialogTemplates[selector]);
    myDialog.appendChild(myBody);

    buttons.forEach(({ text, action }) => {
      const myButton = document.createElement("button");
      myButton.className = `${selector}__button`;
      myButton.innerHTML = text;
      myButton.addEventListener("click", action);
      myDialog.appendChild(myButton);
    });

    document.body.appendChild(myDialog);
    this.dialogs[selector] = myDialog;
    return myDialog;
  }

  showDialog(selector) {
    const dialog = this.dialogs[selector];
    if (dialog) dialog.showModal();
  }

  closeDialog(selector) {
    const dialog = this.dialogs[selector];
    if (dialog) dialog.close();
  }

  addSubmitListener(selector, action) {
    const form = this.dialogs[selector].querySelector("form");
    if (form) {
      form.addEventListener("submit", action);
    }
  }

  initializeDialogs() {
    this.createDialog({
      selector: "player-choices",
      header: "Battleship",
    });

    this.createDialog({
      selector: "swap-players",
      header: "Result of your shot:",
      buttons: [
        {
          text: "Continue",
          action: () => {
            this.closeDialog("swap-players");
          },
        },
      ],
    });

    this.createDialog({
      selector: "game-over",
      header: "Game Over",
      innerHTML: `<div class="game-over__output"></div>`,
      buttons: [
        {
          text: "New Game",
          action: () => {
            this.closeDialog("game-over");
          },
        },
      ],
    });
  }
}
