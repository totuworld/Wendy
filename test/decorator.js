'use strict';





const once = (fn) => {
  let invocations = new WeakSet();

  return function (...args) {
    if (invocations.has(this)) return;
    invocations.add(this);
    return fn.apply(this, args);
  }
}

class Person {
  setName (first, last) {
    this.firstName = first;
    this.lastName = last;
    return this;
  }
  fullName () {
    return this.firstName + " " + this.lastName;
  }
};

Object.defineProperty(Person.prototype, 'setName', { value: once(Person.prototype.setName) });


const logician = new Person()
                   .setName('Raymond', 'Smullyan');

logician.setName('Haskell', 'Curry');

const musician = new Person()
                   .setName('Miles', 'Davis');

console.log(logician.fullName());

console.log(musician.fullName());