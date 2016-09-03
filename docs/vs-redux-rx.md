# RxConnect vs redux-rx
Great redux-rx by @acdlite was the source of inspiration for RxConnect. However, since it's not activelly supported anymore, we decided to write our own. It's JavaScript after all :D

Jokes aside, we think RxConnect is better because:
* **RxConnect works with React-only applications outside of Redux.** redux-rx (as stated in a name) is designed to be used inside Redux only (i.e. expects `store` from the context), but it's nice to use the same API with pure React components.
* **Does one thing - glue between React and RxJS.** RxConnect not aimed to help with RxJS middlewares - there is a plenty of such projects already.
* **Higher Order Component**.
* **Everything is a stream. Except `dispatch`.** redux-rx converts everything to Rx's streams but in our case we decided that stuff like `dispatch` method is always static and it's kinda pointless to consume it as a stream.
* **redux-rx was implemented on top of https://github.com/acdlite/react-rx-component, which was deprecated**, but redux-rx didn't migrate to recompose.
