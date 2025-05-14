import { Pipe, PipeTransform } from '@angular/core';
import { Livraison } from '../models/livraison';

@Pipe({
  name: 'statusFilter',
  standalone: false
})
export class StatusFilterPipe implements PipeTransform {

   transform(livraisons: Livraison[], selectedStatus: string): Livraison[] {
    if (!livraisons) return [];

    if (!selectedStatus || selectedStatus === 'Tous les statuts') {
      return livraisons;
    }

    return livraisons.filter(l => l.statut === selectedStatus);
  }

}
