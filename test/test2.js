var nr = require('../index' );

//var message = "My name is Matthew Crocker. Sometimes I go by Matt Crocker. My legal name is Matthew Witmer Crocker. Resume shows Matthew W. Crocker and cards Matthew W Crocker. My brothers are Michael Crocker, Rett Crocker (Rett E. Crocker), Gabe Crocker and Ian Jarosh. Rett is married to Kerry Crocker. My girlfriend is named Lauren N. Tranchita, otherwise known as Nicole Tranchita."

var message = "My name is Matthew Crocker one two three four five. Sometimes I go by Matt Crocker. My resume shows Matthew W. Crocker and cards Matthew W Crocker. My legal name is Matthew Witmer Crocker, and my Dad's name is Charles Everett Crocker. My girlfriend is named Lauren N. Tranchita, but she goes by Nicole Tranchita. Her legal name is Lauren Nicole Tranchita."

//var message = "The is a man named Matthew Crocker. His full name is actually Matthew Witmer Crocker, but you may also see him using the name Matt Crocker, Matthew W Crocker, Matthew W. Crocker, or Mattie Crocker, occasionally."

var namesFound = nr.find(message, { unique: true, capitalized: true, top: 0.9 });
var num = 0;

namesFound.forEach( function ( n, idx )
{
    console.log( n.name );
    switch(n.name)
    {
      case "Matthew Crocker":
        num++;
        break;
      case "Matt Crocker":
        num++;
        break;
      case "Matthew Witmer":
        num++;
        break;
      case "Matthew W. Crocker":
        num++;
        break;
      case "Matthew W Crocker":
        num++;
        break;
      case "Mattie Crocker":
        num++;
        break;
      case "Michael Crocker":
        num++;
        break;
      case "Rett Crocker":
        num++;
        break;
      case "Rett E. Crocker":
        num++;
        break;
      case "Gabe Crocker":
        num++;
        break;
      case "Ian Jarosh":
        num++;
        break;
      case "Kerry Crocker":
        num++;
        break;
      case "Lauren N. Tranchita":
        num++;
        break;
      case "Lauren Tranchita":
        num++;
        break;
      case "Nicole Tranchita":
        num++;
        break;
      case "Charles Everett Crocker":
        num++;
        break;
      case "Matthew Witmer Crocker":
        num++;
        break;
      case "Lauren Nicole Tranchita":
        num++;
        break;
      default:
        break;
    }
});
console.log(num + ' number of names found out of 9\n');
//console.log(num + ' number of names found out of 13\n');
//console.log("The correct names are:\n Matthew Crocker\n Matt Crocker\n Matthew W. Crocker\n Matthew W Crocker\n Lauren N. Tranchita\n Nicole Tranchita")



//var namesFound2 = nr.find(message, {top: 0.9});
//console.log(namesFound2);
//console.log(namesFound2.length + ' number of names found out of 16');
