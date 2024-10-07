import { Controller, HttpCode, HttpStatus, Post, Sse } from '@nestjs/common';
import { interval, map, Observable, Subject, tap } from 'rxjs';
import { HealthyScore } from '../entities/healthy-score';

@Controller('healthy/single-channel')
export class SingleChannelController {
  private scoreSubject = new Subject<HealthyScore>();
  private currentHealthyScore: HealthyScore = { data: { training: { steps: 0, calories: 0 } } };

  @Sse('automatic-scores')
  automaticScores(): Observable<HealthyScore> {
    const training = {
      steps: 0,
      calories: 0,
    };
    return interval(2000).pipe(
      tap(() => {
        training.steps += Math.floor(Math.random() * 7) + 1;
        training.calories += Math.floor(Math.random() * 3) + 1;
      }),
      map(() => ({ data: { training } }))
    );
  }

  @Sse('subscription-scores')
  subscriptionScores(): Observable<HealthyScore> {
    return this.scoreSubject.asObservable().pipe(
      map((gameScore) => (gameScore))
    );
  }

  @Post('update-score')
  @HttpCode(HttpStatus.OK)
  updateScore(): void {
    this.currentHealthyScore.data.training.steps += Math.floor(Math.random() * 7) + 1;
    this.currentHealthyScore.data.training.calories += Math.floor(Math.random() * 3) + 1;
    this.scoreSubject.next(this.currentHealthyScore);
  }

  @Post('stop-subscription')
  @HttpCode(HttpStatus.OK)
  stopSubscription() {
    this.scoreSubject.complete();
  }
}