import { Pipe, PipeTransform } from '@angular/core';
import { convertToLocalTimeString } from '../utils/DateTimeConverter';
@Pipe({
  name: 'dateTimeConverter',
  standalone: false
})
export class DateTimeConverterPipe implements PipeTransform {

  transform(dateTime:string): unknown {
    return convertToLocalTimeString(dateTime)
  }

}
