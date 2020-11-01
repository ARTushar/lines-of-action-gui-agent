const MoveBox = (entities, { input }) => {
    // console.log(entities)
    // console.log(input);
    const { payload } = input.find(x => x.name === 'onMouseDown') || {};

   if(payload) {
       const box1 = entities['box1'];
       console.log(payload);

       box1.x = payload.pageX;
       box1.y = payload.pageY;
       box1.blackPlayer = !box1.blackPlayer;
   }

   return entities;
}

export { MoveBox };