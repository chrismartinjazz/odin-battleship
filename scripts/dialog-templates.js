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
  "swap-players": `
      <div class="swap-players__output"></div>
      <div class="swap-players__text">
        Pass the device to the next player...
      </div>`,
};
