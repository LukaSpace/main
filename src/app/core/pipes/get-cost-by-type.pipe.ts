import { Pipe, PipeTransform } from '@angular/core';
import { Cost, CostType } from '../../interfaces/portfolio/budget/model';

@Pipe({ name: 'getCostByType' })
export class GetCostByTypePipe implements PipeTransform {
    transform(costs: Cost[], costType: CostType): number {
        if (!costs || !Array.isArray(costs)) {
            return 0;
        }
        return costs
            .filter(cost => cost.costType === costType)
            .reduce((sum, cost) => sum + cost.value, 0);
    }
}