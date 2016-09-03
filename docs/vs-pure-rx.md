# RxConnect vs pure RxJS
Initially when we started to use React and RxJS together we quickly ran into the problem of subscription management. Having to deal with the famous "Hot vs Cold" is another question we wanted to avoid.

Inspired by article [RxJS: Don’t Unsubscribe](https://medium.com/@benlesh/rxjs-dont-unsubscribe-6753ed4fda87#.he23eg43o) by @blesh we rewrote our components to the single subscription model. But then we discovered a huge amount of the boilerplate code in our codebase, so we decided to extract common pattern and this is now RxConnect was born.
