import { Controller, Get, HttpCode, HttpStatus, Post, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { GameScore } from './game-score';

@Controller('games')
export class AppController {
  private scoreSubject = new Subject<GameScore>();
  private currentGameScore: GameScore = { lakers: 0, denver: 0 };

  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('scores')
  scores(): Observable<GameScore> {
    return this.scoreSubject.asObservable().pipe(
      map((gameScore) => (gameScore))
    );
  }

  @Post('update-score')
  @HttpCode(HttpStatus.OK)
  updateScore(): void {
    this.currentGameScore.lakers += Math.floor(Math.random() * 4) + 1;
    this.currentGameScore.denver += Math.floor(Math.random() * 4) + 1;
    this.scoreSubject.next(this.currentGameScore);
  }

  @Post('stop')
  @HttpCode(HttpStatus.OK)
  stopCounter() {
    this.scoreSubject.complete();
  }
}
