import {map, take, timer} from "rxjs";

export const countdownTimer = (countdown: number) => {
  return timer(0, 1000)
    .pipe(
      take(countdown + 1),
      map((secondsElapsed: number) => countdown - secondsElapsed)
    );
}
