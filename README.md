# style-observer
Observer any changes of your styling applied on the elements of the page

## Motivation

I like to follow [Bramus](https://github.com/bramus) on multiple social network and I discovered recently a [repo](https://github.com/bramus/style-observer) he created two years ago where he tried to provide a way to be aware when CSS property change on an element.

I started to look into the repo and code and found he used a [hack](https://github.com/bramus/style-observer/blob/f2dff73202e0a7c25eb635c6d1f4e39f0f8ca932/src/index.ts#L241-L245) around the `transition` property. Which is [documented](https://github.com/bramus/style-observer#how-is-this-library-worse-when-compared-to-other-libraries) into the repo:

```
Also note that changing the value transition property yourself will make this library no longer work.
```

I know now browsers provide some events dedicated to CSS, and I wonder if we could use them to be as much as possible be informed when a change is performed?

## CSS "events"

Obviously, CSS doesn't have events, but JavaScript has got some.
We could find:

 - [transitionend](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)
 - [transitionrun](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)
 - [transitionstart](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)
 - [transitioncancel](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)
 - [animationstart](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)
 - [animationiteration](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event)
 - [animationend](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)
 - [animationcancel](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)
