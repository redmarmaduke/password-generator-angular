import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'Password Generator';
  static get numbers() { return "0123456789" };
  static get lowercase() { return "abcdefghijklmnopqrstuvwxyz" };
  static get uppercase() { return "ABCDEFGHIJKLMNOPQRSTUVWXYZ" };
  static get special() { return " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" };
  generateButton: HTMLElement | null = null;
  copyButton: HTMLElement | null = null;
  passwordTextArea: HTMLTextAreaElement | null = null;

  ngAfterViewInit() {
    this.generateButton = document.getElementById("generate_btn");
    this.copyButton = document.getElementById("copy_btn");
    this.passwordTextArea = document.getElementById("password_textarea") as HTMLTextAreaElement;
  }

  /**
   * Swaps two elements of an array
   *
   * @param {array} array of elements to act on
   * @param {number} index of first element for swapping
   * @param {number} index of second element for swapping
   */

  swap(array: any[], indexOne: number, indexTwo: number) {
    // translate index if negative/positive and/or out of range to positive valid index
    const translateIndex = (i: number) => i < 0 ? -(-(i+1) % array.length) + array.length -1 : i % array.length;

    indexOne = translateIndex(indexOne);
    indexTwo = translateIndex(indexTwo);

    /* one line solution but looks like it may require more work under the hood unless the interpreter is clever
    https://medium.com/better-programming/how-swap-two-values-without-temporary-variables-using-javascript-8bb28f96b5f6
    
    array[indexOne] = [ array[indexTwo], array[indexTwo] = array[indexOne] ][0];
    */

    // swap
    const temp = array[indexOne];
    array[indexOne] = array[indexTwo];
    array[indexTwo] = temp;
  }

  /**
   * Generates a random character from all character classes submitted
   *
   * @param {string[]} charClasses array of character class strings
   * @return {string} random character
   */
  getRandomFromList(list: string | any[]): string {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  /**
   * Generates a password
   *
   * Each class will contribute at least one character and all remaining
   * characters will be selected randomly from the complete set of all
   * character classes.
   *
   * @param {number} numChars number of characters in the password
   * @param {string[]} charClasses array of character class strings
   */
  generatePassword(requiredPasswordLength: number, charClasses: string[]) {
    const password: string[] = [];

    /* must have enough characters to use at least one of each required character class */
    if (requiredPasswordLength < charClasses.length) {
      throw new Error("Invalid Argument: required password length is too short!");
    }

    while (password.length < requiredPasswordLength) {
      if (password.length < charClasses.length) {
        /* 
         * make sure each required character class gets at least a single instance 
         */
        const setIndex = Math.floor(Math.random() * charClasses[password.length].length);
        password.push(charClasses[password.length][setIndex]);
      }
      else {
        /* 
         * Remaining characters should be selected with equal probability from
         * all characters available.
         */
        password.push(this.getRandomFromList(charClasses.join()));
      }
    }

    /* randomize array */
    for (let i = 0; i < password.length - 1; ++i) {
      const j = Math.floor(Math.random() * (password.length - i)) + i;
      this.swap(password, i, j);
    }

    return password.join("");
  }

  generate() {
    let numChars = 0;
    do {
      numChars = parseInt(prompt("Enter length: ", "8") || "8");
      if (numChars >= 8 && numChars <= 128) {
        break;
      }
      else {
        alert("Length must be between 8 and 128 characters!");
      }
    }
    while (true);

    const charClasses = [];
    do {
      if (confirm("Use number character class?")) {
        charClasses.push(AppComponent.numbers);
      }
      if (confirm("Use lower-case character class?")) {
        charClasses.push(AppComponent.lowercase);
      }
      if (confirm("Use upper-case character class?")) {
        charClasses.push(AppComponent.uppercase);
      }
      if (confirm("Use special character class?")) {
        charClasses.push(AppComponent.special);
      }
      if (charClasses.length != 0) {
        break;
      }
      else {
        alert("You must choose at least one class of characters for the password!");
      }
    } while (true);

    let password = this.generatePassword(numChars, charClasses);
    console.log(password, this.passwordTextArea);
    /** document.getElementById("password").textAreaElement. */

    if (this.passwordTextArea) {
      this.passwordTextArea.value = password;
      this.passwordTextArea.style.textAlign = "left";
      /* allow break at any character */
      this.passwordTextArea.style.wordBreak = "break-all";
    }

    /* enable copy and paste */
    this.copyButton?.classList.remove("button_disabled");
  }

  copy() {
    /* https://www.w3schools.com/howto/howto_js_copy_clipboard.asp */
    /* select contents of the text field */
    this.passwordTextArea?.select();
    /* 
     * w3schools example claims that the selection range is required for 
     * correct behavior on mobile devices
     */
    this.passwordTextArea?.setSelectionRange(0, 99999);
    /* perform the copy */
    document.execCommand("copy");
    this.passwordTextArea?.setSelectionRange(0, 0);
  }
}
