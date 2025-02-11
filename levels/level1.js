/**
 * @constant
 * @type {Level}
 * @description First level of the game containing enemies, clouds and background objects
 * @property {Array<Enemy>} enemies - Array of enemy objects (chickens and endboss)
 * @property {Array<Cloud>} clouds - Array of cloud objects for parallax effect
 * @property {Array<BackgroundObject>} backgroundObjects - Array of background layers
 */
const level1 = new Level([
    new Chicken(), 
    new Chicken(),
    new ChickenSmall(),
    new ChickenSmall(),
    new Chicken(),
    new ChickenSmall(),
    new Endboss(),
],
[
    new Cloud(), 
],
[
    new BackgroundObject('img/5_background/layers/air.png' , -719),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png' , -719),
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png' , -719),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png' , -719),

    new BackgroundObject('img/5_background/layers/air.png' , 0),
    new BackgroundObject('img/5_background/layers/3_third_layer/1.png' , 0),
    new BackgroundObject('img/5_background/layers/2_second_layer/1.png' , 0),
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png' , 0),

    new BackgroundObject('img/5_background/layers/air.png' , 719),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png' , 719),
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png' , 719),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png' , 719),

    new BackgroundObject('img/5_background/layers/air.png' , 719*2),
    new BackgroundObject('img/5_background/layers/3_third_layer/1.png' , 719*2),
    new BackgroundObject('img/5_background/layers/2_second_layer/1.png' , 719*2),
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png' , 719*2),

    new BackgroundObject('img/5_background/layers/air.png' , 719*3),
    new BackgroundObject('img/5_background/layers/3_third_layer/2.png' , 719*3),
    new BackgroundObject('img/5_background/layers/2_second_layer/2.png' , 719*3),
    new BackgroundObject('img/5_background/layers/1_first_layer/2.png' , 719*3),
]
);
