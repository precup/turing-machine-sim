/*
 * Emulates the tape of a TM. The tape is represented using a string.
 */
function Tape (start_string, start_position) {
  var tape = start_string;
  var position = start_position;

  // JS strings are immutable, so this function had to be written
  function _replace(string, index, character) {
    // Replace the character of the string at the
    // index position with the character specified
    // Returns the resulting string
    if(character.length !== 1) throw Error("_replace: character must be a string of length 1");
    if(index < 0 || index >= string.length) throw Error("_replace: index out of bounds");
    return string.substr(0, index) + character + string.substr(index + 1, string.length - index);
  }

  return {
    read: function read() {
      return tape[position];
    },
    write: function write(character) {
      if (character.length !== 1) throw Error("write: invalid input, character must be a string of length 1");
      try{
        tape = _replace(tape, position, character);
      } catch(e) {
        throw e;
      }
    },
    moveLeft: function moveLeft() {
      if (position > 0) {
        position --;
      } else { // position === 0
        tape = BLANK + tape;
      }
    },
    moveRight: function moveRight() {
      if(position < tape.length) {
        position ++;
      } else { // position is at the last character of the string
        tape = tape + BLANK;
      }
    },
    toString: function toString() {
      return tape;
    },
    getPosition: function getPosition() {
      return position;
    }
  };
}