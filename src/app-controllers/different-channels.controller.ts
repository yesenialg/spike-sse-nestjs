import { Controller, HttpCode, HttpStatus, Param, Post, Sse } from '@nestjs/common';
import { map, Observable, Subject } from 'rxjs';
import { HealthyScore } from '../entities/healthy-score';

@Controller('healthy/different-channels')
export class DifferentChannelsController {
    private currentHealthyScore: HealthyScore = { data: { training: { steps: 0, calories: 0 } } };
    private channels: { [key: string]: Subject<HealthyScore> } = {};

    @Sse('subscription-scores/:id')
    subscriptionScores(@Param('id') clientId: string): Observable<HealthyScore> {
        this.channels[clientId] = new Subject<HealthyScore>();
        return this.channels[clientId].asObservable().pipe(
            map((healthyScore) => (healthyScore))
        );
    }

    @Post('update-score/:id')
    @HttpCode(HttpStatus.OK)
    updateScore(@Param('id') clientId: string): void {
        this.currentHealthyScore.data.training.steps += Math.floor(Math.random() * 7) + 1;
        this.currentHealthyScore.data.training.calories += Math.floor(Math.random() * 3) + 1;
        this.channels[clientId].next(this.currentHealthyScore);
    }

    @Post('stop-subscription/:id')
    @HttpCode(HttpStatus.OK)
    stopSubscription(@Param('id') clienteId: string) {
        this.channels[clienteId].complete();
    }
}