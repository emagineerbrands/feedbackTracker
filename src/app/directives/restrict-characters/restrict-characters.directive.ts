import { Directive, HostListener  } from '@angular/core';

@Directive({
  selector: '[appRestrictCharacters]',
  standalone: true
})
export class RestrictCharactersDirective {

  constructor() { }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/; // This regex pattern will only allow numbers. Change it according to your needs.
    if (!pattern.test(event.key)) {
      // If the pressed key doesn't match the pattern, prevent the default action (which is to add the character to the input).
      event.preventDefault();
    }
  }

}
