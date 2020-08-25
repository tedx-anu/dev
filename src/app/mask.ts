import {Directive,HostListener} from '@angular/core'

@Directive({
selector: '[dobMask]'
})
export class DobDirective {

@HostListener('input', ['$event'])
onKeyDown(event: KeyboardEvent) {
const input = event.target as HTMLInputElement;

let trimmed = input.value.replace(/\s+/g, '');

if (trimmed.length > 10) {
  trimmed = trimmed.substr(0, 10);
}


trimmed = trimmed.replace(/-/g,'');

 let numbers = [];
 
 numbers.push(trimmed.substr(0,2));
 if(trimmed.substr(2,2)!=="")
 numbers.push(trimmed.substr(2,2));
 if(trimmed.substr(4,4)!="")
 numbers.push(trimmed.substr(4,4));


input.value = numbers.join('-');

  }
}