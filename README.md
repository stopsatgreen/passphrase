Passphrase custom element
==========

Uses Web Speech API to set a passphrase which can be stored safely, then retrieved also using speech. [Easier and more secure](http://xkcd.com/936/) than remembering a password - with the obvious caveat that you shouldn’t use it in public where it can be overheard.

_Currently works only on Chrome Canary with_ **experimental Web Platform features** _flag enabled._

##Experimental features##

* Custom elements to extend a password input
* HTML templates for the content of the custom element
* Shadow DOM to hide the controls from the DOM
* Web Speech API to set/get the passphrase
* The `dialog` element and API

##Important note##

Currently only stores the passphrase in local storage; obviously to make this practical it would need to be salted and hashed, at least.

##To do##

* Make it use real storage
* Better visual design and feedback
* More informative error handling
* Fallback to text if speech retrieval doesn't work
* Better fallback for non-supported browsers
* Streamline some of the hacky script