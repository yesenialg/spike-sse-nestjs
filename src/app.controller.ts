import { Controller, Get, HttpCode, HttpStatus, Post, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval, map, Observable, Subject, tap } from 'rxjs';
import { GameScore } from './game-score';

@Controller('games')
export class AppController {
  private scoreSubject = new Subject<GameScore>();
  private currentGameScore: GameScore = { data: { game: { lakers: 0, denver: 0 } } };

  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('scores-automatico')
  scores(): Observable<GameScore> {
    const game = {
      lakers: 0,
      denver: 0,
    };
    return interval(2000).pipe(
      tap(() => {
        game.lakers += Math.floor(Math.random() * 4) + 1;
        game.denver += Math.floor(Math.random() * 4) + 1;
      }),
      map(() => ({ data: { game } }))
    );
  }

  @Sse('scores-subscribe')
  scoresSubscribe(): Observable<GameScore> {
    return this.scoreSubject.asObservable().pipe(
      map((gameScore) => (gameScore))
    );
  }

  @Post('update-score')
  @HttpCode(HttpStatus.OK)
  updateScore(): void {
    this.currentGameScore.data.game.lakers += Math.floor(Math.random() * 4) + 1;
    this.currentGameScore.data.game.denver += Math.floor(Math.random() * 4) + 1;
    this.scoreSubject.next(this.currentGameScore);
  }

  @Post('stop')
  @HttpCode(HttpStatus.OK)
  stopCounter() {
    this.scoreSubject.complete();
  }
}
