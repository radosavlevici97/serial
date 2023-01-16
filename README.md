# serial

1. This is a basic spinnable slot. It has no feature, or gain, or paytable/preloader. All you can do is spin the wheels.

2. This code is not a code to be delivered in production, it is a code under development that I made to practice programming. 
   In order to be delivered in production, this code needs a lot of refactoring, removing hardcoded values, adding explicit 
   comments on each method in each class (in some classes I added comments), and streamlining the code itself.
   Commit messages must also be very detailed to understand exactly what was done at certain stages of the game's development.
   I built this game without paying attention to design patterns and SOLID principles. 
   If I had made a more complex game, I would have thought before starting the code, about the structure of the game in such a way 
   that the SOLID principles are not violated, and about what design patterns can be applied to make the code easier to maintain and reuse (Ex: MVC, factory, builder,      strategy, observer, state).
   
3. To build the game, one of these three commands must be run in the terminal, depending on the package manager you have installed (nodejs must be installed as well): 
      yarn install / 
      npm install /
      pnpm install   (I use this one, from my point of view, pnpm is the best). 
   Then you need to run: 
      yarn build / 
      npm build /
      pnpm build. 
   When you run this command, esbuild.script.js will be called and it will build the game very quickly, much faster than webpack. 
   In this script there is also a part of code that copies the game resources (some spritesheets and images and json files) from src to public. 
   In case you have an error during the build, the command had to be run one more time (there is a bug when copying the resources, I didn't invest too much time in the build script).
   Finally, you can open index.html (it also loads in an iframe, the slot.html page), from the public folder and the game will load ( the resize script is not working properly). 
