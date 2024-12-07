export const dialogTemplates = {
  "player-choices": `
  <form novalidate action="#" method="get" class="player-choices__form">
        <fieldset>
          <div class="form-item-radio">
            <div>
              <p>Play against:</p>
              <label for="opponentTypeComputer">
                <input
                  type="radio"
                  id="opponentTypeComputer"
                  name="opponentType"
                  value="computer"
                  checked
                />
                Computer
              </label>
              <label for="opponentTypeHuman">
                <input
                  type="radio"
                  id="opponentTypeHuman"
                  name="opponentType"
                  value="human"
                />
                Human (two players on same device)
              </label>
            </div>
          </div>
          <div class="form-item-radio">
            <div>
              <p>Ship placement:</p>
              <label for="shipPlacementRandom">
                <input
                  type="radio"
                  id="shipPlacementRandom"
                  name="shipPlacement"
                  value="random"
                  checked
                />
                Random
              </label>
              <label for="shipPlacementManual">
                <input
                  type="radio"
                  id="shipPlacementManual"
                  name="shipPlacement"
                  value="manual"
                />
                Manual
              </label>
            </div>
          </div>
        </fieldset>
        <div class="form-buttons">
          <button type="submit" class="player-choices__button">
            Start Game
          </button>
        </div>
      </form>`,
  "next-ship-placement": `
    <div class="next-ship-placement__text>
      Pass the device to the next player...
    </div>`,
  "swap-players": `
      <div class="swap-players__output"></div>
      <div class="swap-players__text">
        Pass the device to the next player...
      </div>`,
  "ship-placement-p1": `
      <div class="ship-placement-p1__ship-orientation">
        <input
          type="radio"
          id="horizontal-p1"
          name="ship-orientation-p1"
          value="horizontal"
          checked
        />
        <label for="horizontal-p1">Horizontal</label>
        <input
          type="radio"
          id="vertical-p1"
          name="ship-orientation-p1"
          value="vertical"
        />
        <label for="vertical-p1">Vertical</label>
      </div>
      <label for="horizontal"></label>
      <div class="ship-placement-p1__ships"></div>
      <div class="ship-placement-p1__board"></div>
      <div class="ship-placement-p1__message"></div>`,
  "ship-placement-p2": `
      <div class="ship-placement-p2__ship-orientation">
        <input
          type="radio"
          id="horizontal-p2"
          name="ship-orientation-p2"
          value="horizontal"
          checked
        />
        <label for="horizontal-p2">Horizontal</label>
        <input
          type="radio"
          id="vertical-p2"
          name="ship-orientation-p2"
          value="vertical"
        />
        <label for="vertical-p2">Vertical</label>
      </div>
      <label for="horizontal"></label>
      <div class="ship-placement-p2__ships"></div>
      <div class="ship-placement-p2__board"></div>
      <div class="ship-placement-p2__message"></div>`,
};
