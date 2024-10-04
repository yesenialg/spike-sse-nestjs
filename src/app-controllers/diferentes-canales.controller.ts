import { Controller, HttpCode, HttpStatus, Param, Post, Sse } from '@nestjs/common';
import { map, Observable, Subject } from 'rxjs';
import { GameScore } from '../entities/game-score';

@Controller('games/canales-diferentes')
export class DiferentesCanalesController {
    private currentGameScore: GameScore = { data: { game: { lakers: 0, denver: 0 } } };
    private canales: { [key: string]: Subject<GameScore> } = {};

    @Sse('scores-subscribe/:id')
    scoresSubscribe(@Param('id') clienteId: string): Observable<GameScore> {
        this.canales[clienteId] = new Subject<GameScore>();
        return this.canales[clienteId].asObservable().pipe(
            map((gameScore) => (gameScore))
        );
    }

    @Post('update-score/:id')
    @HttpCode(HttpStatus.OK)
    updateScore(@Param('id') clienteId: string): void {
        this.currentGameScore.data.game.lakers += Math.floor(Math.random() * 4) + 1;
        this.currentGameScore.data.game.denver += Math.floor(Math.random() * 4) + 1;
        this.canales[clienteId].next(this.currentGameScore);
    }

    @Post('stop/:id')
    @HttpCode(HttpStatus.OK)
    stopCounter(@Param('id') clienteId: string) {
        this.canales[clienteId].complete();
    }
}