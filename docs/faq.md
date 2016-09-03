# F.A.Q.

### Is it a new Flux framework?
Not at all! RxConnect wasn't aimed to be a framework, it's just a glue between your React components and RxJS.

### I saw many articles about React and RxJS working together, why RxConnect?
You're right, RxJS can work with React without the additional libraries. But! You'll have to manually deal with subscription management, create streams of properties, states, etc. And this is exactly what RxConnect does.

### Performance?
RxConnect is a thin layer between RxJS and React implemented as Higher Order Component (FYI Redux's `connect` is HoC as well), so we can assume that performance overhead is minimal.

### Testing
Since the connectors are decoupled from components and components are pure, testing can be done with standard tooling for both React and RxJS, i.e. you can test RxJS connectors with your favorite RxJS way like [Marble Diagrams](http://rxmarbles.com), and React components with tools like Facebook's [Jest](https://facebook.github.io/jest/).

### Who uses RxConnect?
It was developed for ZeroTurnaround where we actively use it. Feel free to submit your usage info so you can be on a list as well :)
