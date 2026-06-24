import OBR from "@owlbear-rodeo/sdk";
import {
  ROUND_CHANGE_EVENT_CHANNEL,
  SET_ROUND_CHANNEL,
  type RoundChangeData,
  type SetRoundData,
} from "../broadcastRoundProtocol";

// Round change event messaging
export function broadcastRoundChangeEventMessage(roundNumber: number | null) {
  OBR.broadcast.sendMessage(
    ROUND_CHANGE_EVENT_CHANNEL,
    {
      roundNumber,
    } satisfies RoundChangeData,
    { destination: "ALL" },
  );
}
export function handleRoundChangeEventMessage(
  callback: (data: RoundChangeData) => void,
) {
  return OBR.broadcast.onMessage(ROUND_CHANGE_EVENT_CHANNEL, (event) => {
    const data = event.data as RoundChangeData;
    callback(data);
  });
}

// Set round event messaging
export function broadcastSetRoundNumberMessage(roundNumber: number) {
  OBR.broadcast.sendMessage(
    SET_ROUND_CHANNEL,
    {
      roundNumber,
    } satisfies SetRoundData,
    { destination: "LOCAL" },
  );
}
export function handleSetRoundNumberMessage(
  callback: (data: SetRoundData) => void,
) {
  return OBR.broadcast.onMessage(SET_ROUND_CHANNEL, (event) => {
    const data = event.data as SetRoundData;
    broadcastRoundChangeEventMessage(data.roundNumber);
    callback(data);
  });
}
