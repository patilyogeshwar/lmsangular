import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customFilter'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val: any) => {
      let rVal = (val.className?.toLocaleLowerCase().includes(args)) || (val.name?.toLocaleLowerCase().includes(args)) || (val.chapterName?.toLocaleLowerCase().includes(args));
      return rVal;
    })
  }

}